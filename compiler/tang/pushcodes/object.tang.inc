pushExtendsCodes(codes, element, layer, namespace) {
    let indent1 = "\r\n" + stringRepeat("    ", layer);
    let indent2 = "\r\n" + stringRepeat("    ", layer + 1);
    let indent3 = "\r\n" + stringRepeat("    ", layer + 2);
    if (element.posi) {
        var posi = this.pushPostionsToMap(element.posi);
    } else {
        var posi = '';
    }
    if (element.subtype === 'global' || element.subtype === 'globalassign') {
        namespace = '';
    }
    if (element.subtype === 'voidanonspace' || element.subtype === 'voidns' || element.subtype === 'voidglobal' || element.subtype === 'anonspace' || element.subtype === 'ns' || element.subtype === 'global') {
        this.fixVariables(element.vars);
        if (element.subtype === 'voidanonspace' || element.subtype === 'anonspace') {
            codes.push(indent1 + posi + '(function () {');
            this.pushCodes(codes, element.vars, element.body, layer + 1, namespace + '.');
        } else {
            codes.push(indent1 + posi + 'pandora.ns(\'' + namespace + element.oname.trim() + '\', function () {');
            this.pushCodes(codes, element.vars, element.body, layer + 1, namespace + element.oname.trim() + '.');
        }
        // console.log(element.body);
        if (element.subtype === 'anonspace' || element.subtype === 'ns' || element.subtype === 'global'){
            let exports = [];
            // console.log(element.vars.scope.public);
            codes.push(indent2 + 'return {');
            for (const name in element.vars.scope.public) {
                exports.push(name + ': ' + element.vars.scope.public[name]);
            }
            if (exports.length) {
                codes.push(indent3 + exports.join(',' + indent3));
            }
            codes.push(indent2 + '}');
        }
        
        codes.push(indent1 + '}');
        if (element.subtype === 'voidanonspace' || element.subtype === 'anonspace') {
            codes.push('()');
        }
        
    } else if (element.subtype === 'nsassign' || element.subtype === 'globalassign') {
        codes.push(indent1 + posi + 'pandora.ns(\'' + namespace + element.oname.trim() + '\', ');
        this.pushObjCodes(codes, element, layer, namespace);
    } else {
        codes.push(indent1 + posi + 'pandora.extend(' + element.oname + ', ');
        this.pushObjCodes(codes, element, layer, namespace);
    }
    codes.push(');');
    codes.push(indent1);
    indent1 = indent2 = indent3 = posi = undefined;
    return codes;
}
pushObjCodes(codes, element, layer, namespace) {
    let indent1 = "\r\n" + stringRepeat("    ", layer);
    let indent2 = "\r\n" + stringRepeat("    ", layer + 1);
    // console.log(element);
    if (element.type === 'object' && element.display === 'block') {
        codes.push(indent1 + this.pushPostionsToMap(element.posi) + '{');
    } else {
        codes.push('{');
    }

    if (element.body.length) {
        let elements = [];
        let _layer = layer;
        let _break = false;
        // console.log(element.body[0]);
        if ((element.body.length > 1) || (element.body[0].posi && element.body[0].posi.head)) {
            _layer++;
            codes.push(indent2);
            _break = true;
        }
        // console.log(_break, element);
        for (let index = 0; index < element.body.length; index++) {
            const member = element.body[index];
            let elem = [];
            // console.log(member);
            switch (member.type) {
                case 'method':
                    elem.push(this.pushPostionsToMap(member.posi) + member.fname + ': ');
                    this.pushFunctionCodes(elem, member, _layer, namespace);
                    elements.push(elem.join(''));
                    break;

                case 'objProp':
                    elem.push(this.pushPostionsToMap(member.posi) + member.pname + ': ');
                    this.pushCodes(elem, member.vars, member.body, _layer, namespace);
                    elements.push(elem.join(''));
                    break;
            }
            elem = undefined;
        }
        if (_break) {
            codes.push(elements.join(',' + indent2));
            codes.push(indent1);
        } else {
            codes.push(elements.join(','));
        }
        elements = _layer = _break = undefined;
    }
    codes.push('}');
    indent1 = indent2 = undefined;
    return codes;
}