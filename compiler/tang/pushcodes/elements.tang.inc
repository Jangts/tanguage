pushCodes(codes, vars, array, layer, namespace = this.namespace, lasttype = '') {
    // console.log(codes, array);
    // console.log(array);
    // console.log(layer, array);
    for (let index = 0; index < array.length; index++) {
        var element = array[index];
        // console.log(element);
        this.pushElement(codes, vars, element, layer, namespace, (index - 1 >= 0) ? array[index - 1].type : lasttype);
    }
    return codes;
}
pushElement(codes, vars, element, layer, namespace = this.namespace, lasttype = '') {
    let indent = "\r\n" + stringRepeat("    ", layer);
    switch (element.type) {
        case 'arraylike':
            this.pushArrayCodes(codes, element, layer, namespace);
            break;
        case 'if':
        case 'call':
        case 'callmethod':
        case 'construct':
            // console.log(layer);
            this.pushCallCodes(codes, element, layer, namespace);
            break;
        case 'log':
        case 'callschain':
            this.pushCallsCodes(codes, element, layer, namespace, lasttype);
            break;
        case 'class':
        case 'dec':
            this.pushClassCodes(codes, element, layer, namespace);
            break;
        case 'code':
            if (element.value) {
                // console.log(element.posi&&element.posi.head, element.display, element.value);
                var code = this.patchVariables(element.value, vars);
                if (vars.scope.break !== undefined) {
                    code = code.replace(/@return;*/g, () => {
                        vars.scope.break = true;
                        this.useLoop = true;
                        return 'pandora.loop.out();' + indent + 'return;';
                    });
                }
                // console.log(code);
                // console.log(code, element.display, element.posi, lasttype);
                if (element.display === 'block'||lasttype==='exp') {
                    codes.push(indent + this.pushPostionsToMap(element.posi) + code);
                } else {
                    if (element.posi) {
                        if (element.posi.head) {
                            codes.push(indent);
                        }
                        this.pushPostionsToMap(element.posi, codes);
                    }
                    codes.push(code);
                }
            }
            break;
        case 'codes':
            // console.log(element);
            this.pushCodes(codes, element.vars, element.body, layer + ((element.posi && element.posi.head) ? 1 : 0), namespace, lasttype);
            break;
        case 'def':
            this.pushFunctionCodes(codes, element, layer, namespace);
            break;
        case 'extends':
            this.pushExtendsCodes(codes, element, layer, namespace);
            break;
        case 'exp':
        case 'closure':
            this.pushExpressionCodes(codes, element, layer, namespace);
            break;
        case 'expands':
            this.pushExpandClassCodes(codes, element, layer, namespace);
            break;
        case 'object':
            // console.log(element);
            this.pushObjCodes(codes, element, layer, namespace);
            break;
        case 'travel':
            this.pushTravelCodes(codes, element, layer, namespace);
            break;
    }
    indent = undefined;
    return codes;
}