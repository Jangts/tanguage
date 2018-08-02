replaceStrings(string, ignoreComments = false) {
    string = string.replace(/\\+(`|")/g, (match) => {
        let index = this.replacements.length;
        this.pushBuffer([match]);
        return '@boundary_' + index + '_as_mark::';
    })
    .replace(/\\+(`|")/g, (match) => {
        let index = this.replacements.length;
        this.pushBuffer([match]);
        return '@boundary_' + index + '_as_mark::';
    })
    .replace(/\[@\d+L\d+P\d+O?\d*:::\^\//g, '@boundary_9_as_mark::')
    .replace(/(=|:)\s*\/=/g, '$1 /\\=')
    .replace(/\\[^\r\n](@\d+L\d+P\d+O?\d*:::)*/g, (match) => {
        let index = this.replacements.length;
        this.pushBuffer([match]);
        return '@boundary_' + index + '_as_mark::';
    });
    // console.log(string);

    let count = 0;
    let matches = string.match(matchExpRegPattern.string);

    while ((count < this.stringReplaceTimes) && matches) {
        count++;
        // console.log(count, matches );
        // console.log(matches);
        const index = this.replacements.length;
        switch (matches[1]) {
            case '#':
                string = string.replace(/(\S*)\s*\#.+/, "$1");
                matches = string.match(matchExpRegPattern.string);
                continue;

            case '/':
                switch (matches[2]) {
                    case '*':
                        if (ignoreComments) {
                            // console.log(true);
                            string = string.replace(/\/\*{1,2}[\s\S]*?(\*\/|$)/, (match) => {
                                this.pushBuffer([match]);
                                return '@boundary_' + index + '_as_comments::';
                            });
                        } else {
                            string = string.replace(/\/\*{1,2}[\s\S]*?(\*\/|$)/, "");
                        }
                        matches = string.match(matchExpRegPattern.string);
                        continue;
                    case '/':
                        string = string.replace(/(\S*)\s*\/\/.*/, "$1");
                        matches = string.match(matchExpRegPattern.string);
                        continue;
                    case '=':
                        string = string.replace(matches[0], '@boundary_1_as_operator::');
                        matches = string.match(matchExpRegPattern.string);
                        continue;
                }
                break;
        }
        let match = string.match(matchExpRegPattern.strings[matches[1]]);
        if (match && (matches.index >= match.index) && !match[5]) {
            // console.log(matches, match);
            if (matches[1]==='`'){
                string = string.replace(match[2], this.replaceTemplate(match[2]));
            }else{
                if (match[1]) {
                    this.pushBuffer([match[2].replace(/@\d+L\d+P\d+O?\d*:::/g, ''), match[1].trim(), match[4]]);
                } else {
                    this.pushBuffer([match[2].replace(/@\d+L\d+P\d+O?\d*:::/g, ''), void 0, match[4]]);
                }
                string = string.replace(match[0], '___boundary_' + this.uid + '_' + index + stringas[matches[1]] + match[3]);
            }
        } else if (matches[1] === '`' && match) {
            // console.log(match, string);
            string = string.replace(match[2], this.replaceTemplate(match[2]));
        } else if (matches[0] === '/') {
            string = string.replace(matches[0], '@boundary_2_as_operator::');
        } else {
            // console.log(string, matches, match);
            // console.log(matches, match);
            this.error('Unexpected `' + matches[1] + '` in `' + this.decode(string.substr(matches.index)).substr(0, 256) + '`');
        }
        matches = string.match(matchExpRegPattern.string);
    }
    // console.log(string);
    // console.log(this.replacements);
    matches = undefined;
    return string;
}