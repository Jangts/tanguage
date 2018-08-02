pushArrayCodes(codes, element, layer, namespace) {
    if (element.posi) {
        this.pushPostionsToMap(element.posi, codes);
    }

    // codes.push('[');
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
        for (let index = 0; index < element.body.length; index++) {
            const group = element.body[index];
            let code = '';
            if(group.type==='arrVar'){
                code += this.pushPostionsToMap(group.posi) + this.patchVariable(group.aname, group.vars);
            }else{
                let elements = [];
                this.pushArrayElements(elements, group.elems, group.vars, _layer, namespace);
                while (elements.length && !elements[0].trim()) {
                    elements.shift();
                }
                code += '[';
                if (elements.length) {
                    if (_break) {
                        code += elements.join(',' + indent2) + indent1;
                    } else {
                        code += elements.join(', ');
                    }
                }
                code += ']';
                elements = undefined;
            }
            if (index === 0) {
                codes.push(code);
            }else{
                if (index === 1){
                    codes.push('.concat(' + code);
                }
                else{
                    codes.push(', ' + code);
                }
                if (index === element.body.length-1) {
                    codes.push(')');
                }
            }
        }
        _layer = indent1 = indent2 = _break = undefined;
    }else{
        codes.push('[]');
    }
    
    return codes;
}
pushArrayElements(elements, body, vars, _layer, namespace){
    for (let index = 0; index < body.length; index++) {
        if (body[index].value) {
            elements.push(this.pushPostionsToMap(body[index].posi) + this.patchVariables(body[index].value, vars));
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