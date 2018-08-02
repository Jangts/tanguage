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

    return this.replaceClosures(string);
}