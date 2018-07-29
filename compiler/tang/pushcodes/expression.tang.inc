pushExpressionCodes(codes, element, layer, namespace) {
    let indent1 = "\r\n" + stringRepeat("    ", layer);
    let indent2 = "\r\n" + stringRepeat("    ", layer);
    if (element.posi) {
        var posi = this.pushPostionsToMap(element.posi);
    } else {
        var posi = '';
    }
    this.fixVariables(element.vars);
    if (element.type === 'closure') {
        // console.log(element);
        if (element.posi) {
            codes.push(indent1 + posi + '{')
        } else {
            codes.push(' {');
        }
    } else {
        codes.push(indent1 + posi + element.expression + ' (');
        // console.log(element.head);
        this.pushElement(codes, element.vars.parent, element.head, layer, namespace);
        codes.push(') {');
    }
    if (element.body.length) {
        codes.push(indent2);
        // console.log(element.body);
        this.pushCodes(codes, element.vars, element.body, layer + 1, namespace);
        codes.push(indent1 + '}');
    } else {
        codes.push('}');
    }
    indent1 = indent2 = undefined;
    return codes;
}
pushTravelCodes(codes, element, layer, namespace) {
    let index = codes.length,
        indent = "\r\n" + stringRepeat("    ", layer);
    // console.log(element);
    codes.push(indent + 'pandora.each(');
    this.pushElement(codes, element.vars, element.iterator, layer, namespace);
    codes.push(', ');
    this.pushFunctionCodes(codes, element.callback, layer, namespace);
    if (element.vars.scope.break === true) {
        codes[index] = indent + 'pandora.loop(';
    }
    if (element.subtype === 'ownprop') {
        codes.push(', this, true);');
    } else {
        codes.push(', this);');
    }
    codes.push(indent);
    index = indent = undefined;
    return codes;
}