recheckFnOrCallLikes(string) {
    string = string.replace(replaceExpRegPattern.expression, (match, posi, expname, exp, expindex, closure, closureindex) => {
        // console.log(match, posi, expname, exp, expindex, closure, closureindex);
        // console.log(expindex, closureindex);
        // on = true;
        let expressioncontent = this.readBuffer(expindex);
        let body = this.readBuffer(closureindex);
        let index = this.replacements.length;
        // console.log(index, match, expname + '(' + expressioncontent + ')' + body);
        // console.log(expressioncontent, body);
        this.pushBuffer([expname + expressioncontent + body, posi]);
        return '___boundary_' + this.uid + '_' + index + '_as_expression___';
    }).replace(replaceExpRegPattern.if, (match, posi, parentheses) => {
        // on = true;
        let index = this.replacements.length;
        this.pushBuffer(['if ' + parentheses, posi]);
        return '___boundary_' + this.uid + '_' + index + '_as_if___ ';
    });
    return string;
}
replaceCalls(string) {
    // console.log(string);
    string = string.replace(replaceExpRegPattern.clog, (match, posi, args) => {
        // console.log(match, args);
        let index1 = this.replacements.length;
        this.pushBuffer(['(' + args + ')', undefined]);
        let index2 = this.replacements.length;
        this.pushBuffer(['log___boundary_' + this.uid + '_' + index1 + '_as_parentheses___', undefined]);
        let index3 = this.replacements.length;
        this.pushBuffer(['.___boundary_' + this.uid + '_' + index2 + '_as_callmethod___', posi]);
        return '___boundary_' + this.uid + '_' + index3 + '_as_log___;';
    });
    return this.replaceCallsChain(string.replace(replaceExpRegPattern.call, (match, posi, fullname, constructor, methodname, dot, callname, args, argindex, after) => {
        // console.log(fullname);
        if (fullname.match(/^___boundary_[A-Z0-9_]{36}_\d+_as_(if|class|object|closure)___/)) {
            return match;
        }
        let index = this.replacements.length;
        if (constructor) {
            // console.log(fullname);
            this.pushBuffer([fullname + args, posi && posi.trim()]);
            return '___boundary_' + this.uid + '_' + index + '_as_construct___' + after;
        } else {
            this.pushBuffer([callname + args, posi && posi.trim()]);
            if (dot) {
                return '.___boundary_' + this.uid + '_' + index + '_as_callmethod___' + after;
            } else if (callname === 'if') {
                return '___boundary_' + this.uid + '_' + index + '_as_if___ ' + after;
            }
            return '___boundary_' + this.uid + '_' + index + '_as_call___' + after;
        }
    }));
}
replaceCallsChain(string) {
    // console.log(string);
    return string.replace(replaceExpRegPattern.callschain, (match, posi, _index) => {
        let index = this.replacements.length;
        match = match.replace(/_as_call___/g, '_as_callmethod___');
        this.pushBuffer([match, posi || this.replacements[_index][1]]);
        return '___boundary_' + this.uid + '_' + index + '_as_callschain___';
    });
}
replaceArrowFunctions(string) {
    let arrowcodes = string.match(/(->|=>)/);
    // console.log(arrow);
    if (arrowcodes) {
        if (string.match(replaceExpRegPattern.arrowfn)) {
            // console.log(string.match(matchExpRegPattern.arrowfn));
            return string.replace(replaceExpRegPattern.arrowfn, (match, args, argsindex, arrow, body, end) => {
                // console.log(match, args, argsindex, arrow, body, end);
                // console.log(body);
                let posi = this.replacements[argsindex][1];
                // console.log(match);
                // console.log(body);
                let matches = body.match(/^(@\d+L\d+P\d+O*\d*:::)?\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_(parentheses|object|closure)___\s*$/);
                // console.log(matches);
                if (matches) {
                    let code = this.replacements[matches[2]][0].toString();
                    let posi = this.replacements[matches[2]][1];
                    if (matches[3] === 'parentheses') {
                        body = code.replace(/^\(\s*(.*?)\s*\)$/, (match, code) => {
                            let index = this.replacements.length;
                            this.pushBuffer(['return ', posi]);
                            return '@boundary_' + index + '_as_preoperator:: ' + code;
                        });
                    } else {
                        // console.log(code);
                        body = code.replace(/(^\{|\}$)/g, '');
                    }
                } else {
                    let index = this.replacements.length;
                    this.pushBuffer(['return ', void 0]);
                    body = '@boundary_' + index + '_as_preoperator:: ' + body;
                    // console.log(body);
                }
                let index = this.replacements.length;
                this.pushBuffer([args + arrow + body, posi]);
                return '___boundary_' + this.uid + '_' + index + '_as_arrowfn___' + end;
            });
        } else {
            // console.log(string);
            this.error('Unexpected `' + arrowcodes[0] + '` in `' + this.decode(string.substr(arrowcodes.index, 256)) + '`');
        }
    }
    arrowcodes = undefined;
    return string;
}