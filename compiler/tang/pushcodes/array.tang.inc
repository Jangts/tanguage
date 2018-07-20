pushArrayCodes(codes[], element, layer, namespace)[] {
    let elements = [];
    if (element.posi) {
        this.pushPostionsToMap(element.posi, codes);
    }
    codes.push('[');
    if (element.body.length) {
        let _layer = layer;
        let indent1, indent2;
        let _break = false;
        // console.log(element.body[0]);
        if (element.body[0].posi && element.body[0].posi.head) {
            indent1 = "\r\n" + stringRepeat("    ", _layer);
            _layer++;
            indent2 = "\r\n" + stringRepeat("    ", _layer);
            codes.push(indent2);
            _break = true;
        }
        // console.log(element.body);
        this.pushArrayElements(elements, element.body, element.vars, _layer, namespace);
        while (elements.length && !elements[0].trim()) {
            elements.shift();
        }
        if (elements.length) {
            if (_break) {
                codes.push(elements.join(',' + indent2) + indent1);
            } else {
                codes.push(elements.join(', '));
            }
        }
        _layer = indent1 = indent2 = _break = undefined;
    }
    codes.push(']');
    elements = undefined;
    return codes;
}
pushArrayElements(elements, body, vars, _layer, namespace){
    for (let index = 0; index < body.length; index++) {
        if (body[index].value) {
            elements.push(this.pushPostionsToMap(body[index].posi) + body[index].value);
        } else {
            let elemCodes = [];
            this.pushPostionsToMap(body[index].posi, elemCodes);
            this.pushElement(elemCodes, vars, body[index], _layer, namespace);
            if (elemCodes.length) {
                elements.push(elemCodes.join('').trim());
            }
            elemCodes = undefined;
        }
    }
}