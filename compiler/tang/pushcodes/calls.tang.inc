pushCallCodes(codes[], element, layer, namespace)[] {
    let naming = this.pushCodes([], element.vars, element.name, layer, namespace);
    // console.log(element);
    // console.log(element.name.length, element.name[0], naming);
    if (element.posi) {
        if (element.type === 'callmethod') {
            element.posi.head = false;
        }
        if (element.posi.head) {
            var indent = "\r\n" + stringRepeat("    ", layer);
            codes.push(indent);
        }
        this.pushPostionsToMap(element.posi, codes);
    }
    let name = naming.join('');
    if (name === 'new') {
        codes.push('new (');
    } else {
        if (element.type === 'construct') {
            codes.push('new ');
        }
        codes.push(name + '(');
    }

    let args = [];
    if (element.args.length) {
        let _layer = layer;
        let indent2;
        let _break = false;
        // console.log(element.args[0]);
        if ((element.args.length > 1) && element.args[0].posi && element.args[0].posi.head) {
            // console.log(true);
            _layer++;
            indent2 = "\r\n" + stringRepeat("    ", _layer);
            // codes.push(indent2);
            _break = true;
        }
        // console.log(element.name[0].value, element.args.length, element.args[0]);
        this.pushCallArgs(args, element.args, element.vars, _layer, namespace);
        // console.log(args);
        while (args.length && !args[0].trim()) {
            args.shift();
        }
        if (args.length) {
            if (_break) {
                codes.push(indent2 + args.join(',' + indent2));
                // console.log(codes);
            } else {
                codes.push(args.join(', '));
            }
        }
        _layer = indent2 = _break = undefined;
    }
    // console.log(element.display);
    if (element.type === 'if'){
        codes.push(') ');
    }
    else if (element.display === 'block') {
        codes.push(');');
    } else {
        codes.push(')');
    }
    naming = name = undefined;
    return codes;
}
pushCallArgs(args, body, vars, _layer, namespace){
    for (let index = 0; index < body.length; index++) {
        const param = body[index].body;
        let paramCodes = [];
        this.pushPostionsToMap(body[index].posi, paramCodes)
        this.pushCodes(paramCodes, vars, param, _layer, namespace);
        if (paramCodes.length) {
            args.push(paramCodes.join('').trim());
        }
        // console.log(element.name[0].value, param, paramCodes);
        paramCodes = undefined;
    }
}
pushCallsCodes(codes[], element, layer, namespace, lasttype)[] {
    let elements = [];
    let _layer = layer;
    let indent;
    let _break = false;
    // console.log(element);
    if (element.type === 'log') {
        if(lasttype==='if'){
            indent = "";
        }else{
            indent = "\r\n" + stringRepeat("    ", _layer);
        }
        codes.push(indent + this.pushPostionsToMap(element.posi) + 'root.console');
    }
    else if (element.posi && element.posi.head) {
        _layer++;
        _break = true;
        indent = "\r\n" + stringRepeat("    ", _layer);
    }

    for (let index = 0; index < element.calls.length; index++) {
        const method = element.calls[index];
        // console.log(method);
        elements.push(this.pushElement([], element.vars, method, _layer, namespace).join(''));
    }
    // console.log(elements);
    if (_break) {
        codes.push(indent + '.' + elements.join(indent + '.'));
    } else {
        codes.push('.' + elements.join('.'));
        if (element.type === 'log') {
            codes.push(';');
        }
    }
    elements = _layer = indent = _break = undefined;
    return codes;
}