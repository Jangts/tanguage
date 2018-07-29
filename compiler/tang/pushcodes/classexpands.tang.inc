pushExpandClassCodes(codes, element, layer, namespace) {
    let indent1 = "\r\n" + stringRepeat("    ", layer);
    let indent2 = "\r\n" + stringRepeat("    ", layer + 1);
    if (element.posi) {
        var posi = this.pushPostionsToMap(element.posi);
    } else {
        var posi = '';
    }
    let elements = [];
    let static_elements = [];
    let cname = '';
    if (element.subtype === 'stdClass') {
        cname = 'pandora.' + element.cname.trim();
    } else {
        if (element.cname && element.cname.trim()) {
            cname = element.cname.trim();
        } else {
            return codes;
        }
    }
    codes.push(indent1 + posi + 'pandora.extend(' + cname + '.prototype, ');
    if (element.base===false) {
        codes.push('true, ');
    }
    codes.push('{');
    // console.log(element);
    let overrides = {};
    let indent3 = "\r\n" + stringRepeat("    ", layer + 2);
    for (let index = 0; index < element.body.length; index++) {
        const member = element.body[index];
        let elem = [];
        // console.log(member);
        switch (member.type) {
            case 'method':
                elem.push(indent2 + member.fname + ': ');
                this.pushFunctionCodes(elem, member, layer + 1, namespace);
                elements.push(elem.join(''));
                break;

            case 'overrideMethod':
                overrides[member.fname] = overrides[member.fname] || {};
                let argslen = member.args.length;
                if (!overrides[member.fname][argslen]) {
                    let fname = overrides[member.fname][argslen] = '___override_method_' + member.fname + '_' + argslen;
                    elem.push(indent2 + fname + ': ');
                    this.pushFunctionCodes(elem, member, layer + 1, namespace);
                    elements.push(elem.join(''));
                }
                break;

            case 'prop':
                elem.push(indent2 + member.pname + ': ');
                this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                elements.push(elem.join(''));
                break;

            case 'staticMethod':
                elem.push(indent2 + member.fname + ': ');
                this.pushFunctionCodes(elem, member, layer + 1, namespace);
                static_elements.push(elem.join(''));
                break;

            case 'staticProp':
                elem.push(indent2 + member.pname + ': ');
                this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                static_elements.push(elem.join(''));
                break;
        }
    }
    this.pushOverrideMethod(elements, overrides, indent2, indent3);
    if (elements.length) {
        codes.push(elements.join(','));
    }
    codes.push(indent1 + '})');
    // console.log(element.display);
    if (static_elements.length) {
        codes.push(';' + indent1 + 'pandora.extend(' + cname + ', {');
        codes.push(static_elements.join(','));
        codes.push(indent1 + '});');
    } else {
        codes.push(';');
    }
    codes.push(indent1);
    // console.log(elements, static_elements); 
    indent1 = indent2 = elements = static_elements = cname = overrides = indent3 = undefined;
    return codes;
}