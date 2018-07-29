pushFunctionCodes(codes, element, layer, namespace) {
    let indent = "\r\n" + stringRepeat("    ", layer);
    if (element.posi) {
        var posi = this.pushPostionsToMap(element.posi);
    } else {
        var posi = '';
    }

    this.fixVariables(element.vars);
    if (element.type === 'def' && element.fname) {
        if (element.fname === 'return') {
            codes.push(indent + posi + 'return function (');
        } else {
            let fname = this.patchVariable(element.fname, element.vars.parent);
            switch (element.subtype){
                case 'def':
                    codes.push(indent + posi + 'pandora.' + namespace + element.fname + ' = function (');
                    break;
                case 'public':
                    codes.push(indent + posi + 'var ' + fname + ' = pandora.' + namespace + element.fname + ' = function (');
                    break;
                default:
                    if (element.display === 'block') {
                        codes.push(indent + posi + 'function ' + fname + ' (');
                    } else {
                        codes.push(posi + 'function ' + fname + ' (');
                    }
            }
        }
    } else {
        codes.push(posi + 'function (');
    }

    if (element.args.length) {
        let args = [];
        for (let index = 0; index < element.args.length; index++) {
            args.push(this.pushPostionsToMap(element.args[index][1]) + element.args[index][0]);
        }
        codes.push(args.join(', '));
    }

    codes.push(') {');
    // console.log(element.body);
    // console.log(element);
    if (element.body.length) {
        // console.log(element);
        if (element.vars.type === 'root') {
            for (var key in element.vars.locals) {
                codes.push(indent + "    var " + element.vars.locals[key] + ' = ' + key + ';');
            }
        }
        element.body.push(semicolon);
        this.pushCodes(codes, element.vars, element.body, layer + 1, namespace);
    } else {
        indent = '';
    }
    //
    console.log(element.display, element.subtype);
    codes.push(indent + '}');
    indent = undefined;
    return codes;
}
pushOverrideMethod(elements, overrides, indent2, indent3) {
    for (const fname in overrides) {
        if (hasProp(overrides, fname)) {
            // console.log(overrides[fname]);
            let elem = [];
            elem.push(indent2 + fname + ': ');
            elem.push('function(){');
            var element = overrides[fname];
            for (var args in element) {
                if (hasProp(element, args)) {
                    elem.push(indent3 + 'if (arguments.length@boundary_5_as_operator::' + args + ') { return this.' + element[args] + '.apply(this, arguments); }');
                }
            }
            elem.push(indent3 + 'return this.' + element[args] + '.apply(this, arguments);');
            elem.push(indent2 + '}');
            elements.push(elem.join(''));
            elem = undefined;
        }
    }
}