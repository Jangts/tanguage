encode(string) {
    // console.log(string);
    string = string
        .replace(replaceExpRegPattern.typetag, (match, gaps, preline, posi, gap, tag) => {
            this.isMainBlock = false;
            if (gaps) {
                this.maintag_posi = posi;
                if (!!gap) {
                    this.maintag_posi += 'O' + gap.length;
                }
            } else {
                this.maintag_posi = '@0L0P0';
            }
            if (tag === 'module') {
                this.blockreserved.push('module');
            }
            else if (tag === 'native') {
                this.isNativeCode = true;
            }
            
            // console.log(gaps, preline, posi, !!gap, gap.length);
            // console.log('This is not a main block.', this.maintag_posi);
            return '';
        })
        .replace(replaceExpRegPattern.namespace, (match, linestart, posi, at, gap, namespace) => {
            if (this.namespace === '') {
                this.namespace += namespace + '.';
                this.namespace_posi = at;
                if (gap) {
                    this.namespace_posi += 'O' + gap.length;
                }
                this.namespace.replace(/^\.+/, '').replace(/\.+/, '.');
                // console.log('namespace:' + namespace, this.namespace_posi);
            }
            return '';
        });
    // console.log(string);
    string = this.replaceUsing(string);
    // console.log(string);
    string = this.replaceStrings(string);
    string = this.replaceIncludes(string);
    // console.log(string);
    // console.log(this.replacements);
    string = this.tidyPosition(string);
    // console.log(string);
    string = string.replace(/(@\d+L\d+P\d+O?\d*:::)?((public|static|set|get|om)\s+)?___boundary_[A-Z0-9_]{36}_(\d+)_as_string___\s*(\:|\(|\=)/g, (match, posi, desc, type, index, after) => {
        // console.log(posi, desc, this.replacements[index][1]);
        if (this.replacements[index][1]) {
            return "\r\n" + this.replacements[index][1] + '___boundary_' + index + '_as_propname___' + after;
        }
        if (desc) {
            return "\r\n" + posi + desc + '___boundary_' + index + '_as_propname___' + after;
        }
        return "\r\n" + '___boundary_' + index + '_as_propname___' + after;
    });
    // console.log(string);
    string = string
        .replace(/([\$a-zA-Z_][\$\w]*)\s*(->|=>)/g, "($1)$2")
        .replace(/\.\s*\(/g, "..storage.set(")
        .replace(/@\s*\(/g, "..storage.get(")
        .replace(/@\d+L\d+P\d+O?\d*:::@var\s+([\$a-zA-Z_][\$\w]*(\s*,\s*@\d+L\d+P\d+O?\d*:::[\$a-zA-Z_][\$\w]*)*);*/g, (match, words)=>{
            let vars = words.replace(/\s*@\d+L\d+P\d+O?\d*:::/g, '').split(',');
            // console.log(vars, match);
            this.xvars.push(...vars);
            return '';
        });
    // console.log(string);
    // console.log(this.xvars, string);
    // console.log(this.replacements);

    string = this.replaceBrackets(string);
    // console.log(string);
    string = this.replaceBraces(string);
    // console.log(string);
    string = this.replaceParentheses(string);
    // console.log(string);
    string = string
        .replace(/@\d+L\d+P\d+O?\d*:::(___boundary_|$)/g, "$1")
        .replace(/@\d+L\d+P\d+O?\d*:::(___boundary_|$)/g, "$1")
        .replace(/\s*(,|;)\s*/g, "$1\r\n");
    // console.log(string);
    // console.log(this.replacements);
    return string;
}
replaceUsing(string) {
    return string.replace(replaceExpRegPattern.use, (match, posi, $, url, as, alias, variables, posimembers, members) => {
        if (this.isNativeCode) {
            this.error('Native Code Not Support Use Expression');
        }
        // console.log(arguments);
        // console.log(match, ':', posi, url, as, alias);
        let index = this.replacements.length;
        if ($) {
            if ($==='@') {
                url = '//' + url;
            }else{
                url = '$_/' + url;
            }
        }
        if (members) {
            // console.log(members);
            // url = url.replace(array, '[]');
            this.pushBuffer([url, members, posi]);
            return '___boundary_' + this.uid + '_' + index + '_as_usings___;';
        }
        this.pushBuffer([url, variables, posi]);
        return '___boundary_' + this.uid + '_' + index + '_as_using___;';
    });
}
replaceWords(string) {
    // console.log(string);
    return string.replace(replaceWords, (match, posi, word, after) => {
        let index = this.replacements.length;
        // console.log(word, after);
        if (word === 'else') {
            this.pushBuffer([word + ' ', posi && posi.trim()]);
            return ";\r\n" + '@boundary_' + index + '_as_midword::' + after;
        }
        if (after === ';' || word === 'continue' || word === 'break') {
            this.pushBuffer([word + ';', posi && posi.trim()]);
            return ";\r\n" + '@boundary_' + index + '_as_keyword::;';
        }
        this.pushBuffer([word + ' ', posi && posi.trim()]);
        return ";\r\n" + '@boundary_' + index + '_as_keyword::' + after;
    })
}
@include 'replace/files';
@include 'replace/strings';
@include 'replace/template';
@include 'replace/brackets';
@include 'replace/fnncalls';
@include 'replace/operators';