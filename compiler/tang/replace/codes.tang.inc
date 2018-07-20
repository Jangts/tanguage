replaceCodeSegments(string) {
    let matched = false;
    string = string.replace(replaceExpRegPattern.class, (match, posi, body) => {
        matched = true;
        body = this.replaceParentheses(body);
        let index = this.replacements.length;
        this.pushBuffer([body, posi && posi.trim()]);
        return '___boundary_' + this.uid + '_' + index + '_as_class___';
    });
    if (matched) return string;

    string = string.replace(replaceExpRegPattern.extends, (match, posi, exp, name, node, assign, closure) => {
        matched = true;
        name = name.replace(/^\.+/, '');
        exp = exp.replace(/\s+/, '');
        let body;
        if (assign) {
            if (exp === 'extends') {
                this.error('Unexpected `extends`: extends ' + name + ' with');
            }
            else {
                if (node && node.length === 2) {
                    body = 'globalassign ' + name + '{' + this.replaceParentheses(closure) + '}';
                } else {
                    body = 'nsassign ' + name + '{' + this.replaceParentheses(closure) + '}';
                }
            }
        } else {
            if (exp === 'extends') {
                if (node) {
                    if (node.length === 2) {
                        body = 'globalassign ' + name + '{' + this.replaceParentheses(closure) + '}';
                    } else {
                        body = 'nsassign ' + name + '{' + this.replaceParentheses(closure) + '}';
                    }
                } else {
                    body = 'extends ' + name + '{' + this.replaceParentheses(closure) + '}';
                }
            }
            else {
                if (node && node.length === 2) {
                    if (exp === 'voidns' || exp === 'voidnamespace') {
                        body = 'voidglobal ' + name + '{' + this.replaceParentheses(closure) + '}';
                    } else {
                        body = 'global ' + name + '{' + this.replaceParentheses(closure) + '}';
                    }                           
                } else {
                    if (exp === 'voidns' || exp === 'voidnamespace') {
                        body = 'voidns ' + name + '{' + this.replaceParentheses(closure) + '}';
                    } else {
                        body = 'ns ' + name + '{' + this.replaceParentheses(closure) + '}';
                    }
                }
            }
        }
        let index = this.replacements.length;
        this.pushBuffer([body, posi && posi.trim()]);
        return '___boundary_' + this.uid + '_' + index + '_as_extends___';
    });
    if (matched) return string;

    string = string.replace(replaceExpRegPattern.anonspace, (match, posi, exp, closure) => {
        matched = true;
        exp = exp.replace(/\s+/, '');
        // console.log(exp);
        if (exp === 'voidns' || exp === 'voidnamespace') {
            var body = 'voidanonspace {' + this.replaceParentheses(closure) + '}';
        } else {
            var body = 'anonspace {' + this.replaceParentheses(closure) + '}';
        }
        let index = this.replacements.length;
        this.pushBuffer([body, posi && posi.trim()]);
        return '___boundary_' + this.uid + '_' + index + '_as_extends___';
    });
    if (matched) return string;

    string = string.replace(replaceExpRegPattern.fnlike, (match, posi, definition, type, call, callname, closure) => {
        matched = true;
        // console.log(match);
        closure = this.replaceParentheses(closure);
        call = this.replaceOperators(call);
        match = (definition || '') + call + ' {' + closure + '}';
        let index = this.replacements.length;
        // console.log(match);
        this.pushBuffer([match, posi && posi.trim()]);
        return '___boundary_' + this.uid + '_' + index + '_as_function___';
    });
    if (matched) return string;

    string = string.replace(replaceExpRegPattern.object, (match, posi, closure) => {
        matched = true;
        // console.log([match, posi, closure]);
        let index = this.replacements.length;
        this.pushBuffer([match, posi && posi.trim()]);
        return '___boundary_' + this.uid + '_' + index + '_as_sets___';
    });
    if (matched) return string;

    return string.replace(replaceExpRegPattern.closure, (match, posi1, word, posi3, closure) => {
        // console.log(match, '|', word, '|', posi2, '|', posi3, '|', closure);
        // if (!word && match.match(/\s*\{\s*\}/)) {
        //     console.log(posi2, '|', posi3);
        //     return '@boundary_0_as_mark::';
        // }
        closure = this.replaceParentheses(closure);
        // closure = this.replaceOperators(closure, false);
        // console.log(closure);
        posi1 = posi1 ? posi1.trim() : '';
        posi3 = posi3 ? posi3.trim() : '';
        let index = this.replacements.length;
        let index2;
        switch (word) {
            case undefined:
                if ((closure.indexOf(';') >= 0) ||
                    !closure.match(/^\s*(@\d+L\d+P\d+O?\d*:::)?(___boundary_[A-Z0-9_]{36}_\d+_as_function___|[\$a-zA-Z_][\$\w]*\s*(,|:|$))/)) {
                    this.pushBuffer(['{' + closure + '}', posi3]);
                    return posi1 + (word || '') + posi3 + ' ___boundary_' + this.uid + '_' + index + '_as_closure___';
                }
                if (closure.match(/^\s*___boundary_[A-Z0-9_]{36}_\d+_as_function___\s*$/)) {
                    this.pushBuffer(['{' + closure + '}', posi3]);
                    return posi1 + (word || '') + posi3 + ' ___boundary_' + this.uid + '_' + index + '_as_objlike___';
                }
                // console.log(closure);
                // console.log(word, '|', posi2, '|', posi3);
                this.pushBuffer(['{' + closure + '}', posi3]);
                return '___boundary_' + this.uid + '_' + index + '_as_object___';

            case '=':
                this.pushBuffer(['{' + closure + '}']);
                return '= ___boundary_' + this.uid + '_' + index + '_as_object___';

            case '@config':
                if (this.configinfo === '{}') {
                    this.configinfo_posi = posi1 || posi3;
                    this.configinfo = this.decode(match.replace('@config', ''));
                }
                return '';

            case 'return':
            case 'typeof':
                this.pushBuffer([word + ' ', posi1]);
                index2 = this.replacements.length;
                this.pushBuffer(['{' + closure + '}']);
                return '@boundary_' + index + '_as_preoperator::___boundary_' + this.uid + '_' + index2 + '_as_object___';

            case 'do':
            case 'try':
                this.pushBuffer([word + ' ', posi1]);
                index2 = this.replacements.length;
                this.pushBuffer(['{' + closure + '}', posi3]);
                return '; @boundary_' + index + '_as_keyword::___boundary_' + this.uid + '_' + index2 + '_as_closure___;';

            case 'else':
            case 'finally':
                this.pushBuffer([word + ' ', posi1]);
                index2 = this.replacements.length;
                this.pushBuffer(['{' + closure + '}', posi3]);
                return ";\r\n" + '@boundary_' + index + '_as_midword::___boundary_' + this.uid + '_' + index2 + '_as_closure___';

            default:
                if (word.indexOf('(') === 0) {
                    // console.log(true, word);
                    this.pushBuffer(['{' + closure + '}', posi3]);
                    return word + '___boundary_' + this.uid + '_' + index + '_as_object___';
                }
                // console.log(word, closure);
                this.pushBuffer(['{' + closure + '}', posi3]);
                return posi1 + word + ";\r\n" + posi3 + '___boundary_' + this.uid + '_' + index + '_as_closure___;';
        }
    });
}