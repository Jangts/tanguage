replaceTemplate(string){
    const lines = string.replace(/"/g, () => {
        return '@boundary_7_as_mark::';
    }).replace(/`/g, '').split(/\r{0,1}\n/);
    let codes = []
    // console.log(match);
    if (this.last_closed && this.last_opens.length){
        let i = this.last_opens.length - 1;
        // console.log(i);
        var opens = this.last_opens[i];
        // console.log(this.last_opens, this.last_opens.length, i);
        this.last_opens.length = i;
    }else{
        var opens = 0;
    }
    
    for (let index = 0; index < lines.length; index++) {
        let posi = '';
        const line = lines[index].replace(/@\d+L\d+P\d+O?\d*:::/g, (_posi)=>{
            if(!posi){
                posi = _posi;
            }
            return '';
        });
        if(line){
            const elements = line.split(/(\$\{|\{|\})/);
            // console.log(posi);
            let type, lasttype;
            let inline = [];
            let code = posi;
            // console.log(line, elements);
            for (let e = 0; e < elements.length; e++) {
                var element = elements[e];
                if (opens === 0 && element === '${') {
                    opens++;
                    this.total_opens++;
                    // console.log('add', opens, this.total_opens);
                } else if (opens && element === '{') {
                    opens++;
                    this.total_opens++;
                    // console.log('add', opens, this.total_opens);
                    inline[inline.length - 1].value += '{';
                } else if (opens && element === '}') {
                    opens--;
                    this.total_opens--;
                    // console.log('minus', opens, this.total_opens);
                    if (opens) {
                        inline[inline.length - 1].value += '}';
                    }
                } else {
                    if (opens === 0) {
                        type = 'string';
                    } else {
                        type = 'code';
                    }
                    if (type === lasttype) {
                        inline[inline.length - 1].value += element;
                    } else {
                        inline.push({
                            type: type,
                            value: element
                        });
                    }
                    lasttype = type;
                }
            }

            for (let c = 0; c < inline.length; c++) {
                if (c) {
                    code += '@boundary_6_as_operator::';
                    // code += ' + ';
                }
                if (inline[c].type === 'string') {
                    // this.pushBuffer(['"' + inline[c].value + '"']);
                    code += '"' + inline[c].value + '"';
                } else {
                    code += inline[c].value.replace(/@boundary_7_as_mark::/g, '"');
                }
            }
            // console.log(code);
            codes.push(code.replace(/""@boundary_6_as_operator::/g, '').replace(/@boundary_6_as_operator::""$/, ''));
        }
    }
    if (opens) {
        this.last_closed = false;
        this.last_opens.push(opens);
    } else {
        this.last_closed = true;
    }
    if (this.total_opens) {
        var after = '`';
    } else {
        var after = '';
    }
    string = codes.join('@boundary_6_as_operator::___boundary_' + this.uid + '_8_as_string___' + '@boundary_6_as_operator::;' + "\r\n");
    // console.log(lines, codes);
    // console.log(this.last_closed, this.total_opens, opens, string + after);
    // console.log(string);
    string = string.replace(/"@boundary_6_as_operator::___boundary_[A-Z0-9_]{36}_8_as_string___/g, '\\r\\n"');
    string = this.replaceStrings(string) + after;
    // console.log(string);
    // console.log(this.replacements);
    // a();
    codes = undefined;
    return string;
}