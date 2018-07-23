getPosition(string) {
    if (string) {
        // console.log(string);
        let match = string.match(/@(\d+)L(\d+)P(\d+)(O*)(\d*):{0,3}/);
        if (match) {
            if (match[4]) {
                var index = parseInt(match[5]);
            } else {
                var index = parseInt(match[3]);
            }
            return {
                match: match[0],
                head: !index,
                file: parseInt(match[1]),
                line: parseInt(match[2]) + 1,
                col: parseInt(match[3]) + 1,
                o: [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), index],
            }
        }
    }
    return void 0;
}
pickReplacePosis(lines[], vars) {
    let imports = [],
        using_as = {},
        preast = [];

    for (let index = 0; index < lines.length; index++) {
        // console.log(lines[index]);
        switch (lines[index].subtype) {
            case 'sentence':
                // console.log(lines[index]);
                const code = lines[index].value.trim();
                this.pushSentencesToPREAST(preast, vars, code, lines[index].display, lines[index].posi);
                break;

            case 'variable':
            // case 'assignment':
                preast.push([{
                    type: 'code',
                    posi: lines[index].posi,
                    display: lines[index].display,
                    vars: vars,
                    value: lines[index].value
                }]);
                break;
            case 'using':
            case 'usings':
                // console.log(lines[index]);.return
                let posi = this.replacements[lines[index].index][2];
                let src = this.replacements[lines[index].index][0].toString().trim();
                // let alias = .trim();

                if (!imports['includes'](src)) {
                    imports.push(src);
                    imports.push(posi);
                }
                if (this.replacements[lines[index].index][1]) {
                    let position;
                    let alias;
                    if (lines[index].subtype === 'usings') {
                        let members = this.replacements[lines[index].index][1].split(',');
                        for (let m = 0; m < members.length; m++) {
                            position = this.getPosition(members[m]);
                            alias = members[m].replace(position.match, '').trim();
                            using_as[alias] = [src, alias, position];
                        }
                        // console.log(this.replacements[lines[index].index][1]);
                    } else {
                        position = this.getPosition(this.replacements[lines[index].index][1]);
                        alias = this.replacements[lines[index].index][1].replace(position.match, '').trim();
                        // console.log(alias);
                        using_as[alias] = [src, '*', position];
                    }
                    if (vars.self[alias] === void 0) {
                        vars.self[alias] = 'var';
                    } else if (vars.self[alias] === 'let') {
                        if (position){
                            this.error(' Variable `' + alias + '` has already been declared at char ' + position.col + ' on line ' + position.line + '.');
                        }
                        this.error(' Variable `' + alias + '` has already been declared.');
                    }
                }
                break;
            default:
                preast.push([{
                    index: lines[index].index,
                    // posi: lines[index].posi,
                    display: lines[index].display,
                    type: lines[index].subtype
                }]);
                break;
        }
    }
    this.imports = imports;
    this.using_as = using_as;
    // console.log(using_as);
    // console.log(imports, preast);
    imports = using_as = undefined;
    return preast;
}