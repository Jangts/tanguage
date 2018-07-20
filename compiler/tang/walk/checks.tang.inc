@include 'checkmembers';
checkClassBody(vars, code) {
    // console.log(code);
    let body = [],
        array = code.replace('_as_function___', '_as_function___;').split(/[;,\r\n]+/);
    // console.log(code);
    for (let index = 0; index < array.length; index++) {
        let element = array[index].trim();
        let type = 'method';
        // console.log(element);
        if (element) {
            let elArr = element.split('___boundary_' + this.uid);
            // console.log(elArr);
            if (elArr[0] && elArr[0].trim()) {
                let match_0 = elArr[0].match(matchExpRegPattern.classelement);
                // console.log(match_0[4].trim(), match_0, elArr);
                if (match_0) {
                    if (match_0[4].trim()) {
                        switch (match_0[3]) {
                            case undefined:
                            case 'public':
                                type = 'prop';
                                break;
                            case 'static':
                                type = 'staticProp';
                                break;
                            default:
                                this.error('Cannot use `' + match_0[3] + '` on property `' + match_0[4] + '`');
                        }
                        if (match_0[5] != '=') {
                            if ((elArr.length === 1)) {
                                match_0[6] = 'undefined';
                            } else {
                                continue;
                            }
                        }
                        body.push(this.checkProp(vars, match_0[1], type, match_0, elArr));
                        continue;
                    }
                    switch (match_0[3]) {
                        case 'om':
                            type = 'overrideMethod';
                            break;
                        case 'get':
                            type = 'getPropMethod';
                            break;
                        case 'set':
                            type = 'setPropMethod';
                            break;
                        case 'static':
                            // console.log(match_0[5], elArr);
                            if (match_0[5] === '=') {
                                match_0[4] = 'static';
                                if ((elArr.length === 1)) {
                                    match_0[6] = 'undefined';
                                }
                                body.push(this.checkProp(vars, match_0[1], 'prop', match_0, elArr));
                                continue;
                            }
                            type = 'staticMethod';
                            break;
                    }
                }
                match_0 = undefined;
            }
            if (elArr[1] && elArr[1].trim()) {
                let match_1 = elArr[1].trim().match(matchExpRegPattern.index);
                if (match_1[2] === 'function') {
                    body.push(this.walkFnLike(parseInt(match_1[1]), 'inline', vars, type));
                }
            }
            elArr = undefined;
        }
        element = type = undefined;
    }
    array = undefined;
    return body;
}
checkArgs(code, localvars) {
    let args = code.split(/\s*,\s*/),
        keys = [],
        keysArray = void 0,
        vals = [];
    // console.log(code, args);
    for (let index = 0; index < args.length; index++) {
        let arg = args[index];
        if (arg) {
            let array = arg.split(/\s*=\s*/);
            let position = this.getPosition(array[0]);
            if (position) {
                var varname = array[0].replace(position.match, '');
            } else {
                var varname = array[0];
            }
            // console.log(arg, array, position, varname);
            if (varname.match(namingExpr)) {
                keys.push([varname, position]);
                vals.push(array[1]);
                localvars.self[varname] = 'var';
            } else if (varname.match(argsExpr)) {
                keysArray = [varname, position];
                localvars.self[varname] = 'var';
                break;
            }
            array = position = varname = undefined;
        }
    }
    args = undefined;
    return {
        keys: keys,
        keysArray: keysArray,
        vals: vals
    }
}
checkFnBody(vars, args, code) {
    code = code.trim()
    // console.log(code);
    let body = [];
    // console.log(args, lines);
    for (let index = 0; index < args.vals.length; index++) {
        if (args.vals[index] !== undefined) {
            let valArr = args.vals[index].split('___boundary_' + this.uid);
            if (valArr[1]) {
                body.push({
                    type: 'code',
                    posi: args.keys[index][1],
                    display: 'block',
                    value: 'if (' + args.keys[index][0] + '@boundary_5_as_operator::void 0) { ' + args.keys[index][0] + ' = ' + valArr[0]
                });
                this.pushReplacementsToAST(body, vars, valArr[1], false, this.getPosition(args.vals[index]));
                body.push({
                    type: 'code',
                    posi: void 0,
                    display: 'inline',
                    value: '; }'
                });
            } else {
                body.push({
                    type: 'code',
                    posi: args.keys[index][1],
                    display: 'block',
                    value: 'if (' + args.keys[index][0] + '@boundary_5_as_operator::void 0) { ' + args.keys[index][0] + ' = ' + valArr[0] + '; }'
                });
            }
            valArr = undefined;
        }
    }

    if (args.keysArray) {
        body.push({
            type: 'code',
            posi: args.keysArray[1],
            display: 'block',
            value: 'var ' + args.keysArray[0].replace('...', '') + ' = Array.prototype.slice.call(arguments, ' + args.keys.length + ');'
        });
    }

    this.pushBodyToAST(body, vars, code);
    // console.log(code, body);
    return body;
}