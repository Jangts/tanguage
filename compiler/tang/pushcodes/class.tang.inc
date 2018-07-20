pushClassCodes(codes[], element, layer, namespace)[] {
    let indent1 = "\r\n" + stringRepeat("    ", layer);
    let indent2 = "\r\n" + stringRepeat("    ", layer + 1);
    let elements = [];
    let static_elements = [];
    let cname = '';
    if (element.subtype === 'stdClass') {
        cname = 'pandora.' + element.cname.trim();
        codes.push(indent1 + this.pushPostionsToMap(element.posi) + 'pandora.declareClass(\'' + element.cname.trim() + '\', ');
    } else {
        if (element.cname && element.cname.trim()) {
            cname = element.cname.trim();
            if (cname.match(/^[\$a-zA-Z_][\$\w]*$/)) {
                codes.push(indent1 + 'var ' + this.pushPostionsToMap(element.posi) + cname + ' = ' + 'pandora.declareClass(');
            } else {
                codes.push(indent1 + this.pushPostionsToMap(element.posi) + cname + ' = ' + 'pandora.declareClass(');
            }
        } else {
            this.pushPostionsToMap(element.posi, codes)
            codes.push('pandora.declareClass(');
        }
    }
    if (element.base) {
        codes.push(element.base + ', ');
    }
    codes.push('{');
    // console.log(element);
    let overrides = {};
    let setters = [];
    let getters = [];
    let indent3 = "\r\n" + stringRepeat("    ", layer + 2);
    for (let index = 0; index < element.body.length; index++) {
        const member = element.body[index];
        let elem = [];
        // console.log(member);
        switch (member.type) {
            case 'method':
                // console.log(member);
                elem.push(indent2 + this.pushPostionsToMap(member.posi) + member.fname + ': ');
                this.pushFunctionCodes(elem, member, layer + 1, namespace);
                elements.push(elem.join(''));
                break;

            case 'overrideMethod':
                overrides[member.fname] = overrides[member.fname] || {};
                let argslen = member.args.length;
                if (!overrides[member.fname][argslen]) {
                    let fname = overrides[member.fname][argslen] = '___override_method_' + member.fname + '_' + argslen;
                    elem.push(indent2 + this.pushPostionsToMap(member.posi) + fname + ': ');
                    this.pushFunctionCodes(elem, member, layer + 1, namespace);
                    elements.push(elem.join(''));
                }
                break;

            case 'prop':
                elem.push(indent2 + this.pushPostionsToMap(member.posi) + member.pname + ': ');
                this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                elements.push(elem.join(''));
                break;

            case 'setPropMethod':
                elem.push(indent3 + this.pushPostionsToMap(member.posi) + member.fname + ': ');
                this.pushFunctionCodes(elem, member, layer + 2, namespace);
                setters.push(elem.join(''));
                break;

            case 'getPropMethod':
                elem.push(indent3 + this.pushPostionsToMap(member.posi) + member.fname + ': ');
                this.pushFunctionCodes(elem, member, layer + 2, namespace);
                getters.push(elem.join(''));
                break;

            case 'staticMethod':
                elem.push(indent2 + this.pushPostionsToMap(member.posi) + member.fname + ': ');
                this.pushFunctionCodes(elem, member, layer + 1, namespace);
                static_elements.push(elem.join(''));
                break;

            case 'staticProp':
                elem.push(indent2 + this.pushPostionsToMap(member.posi) + member.pname + ': ');
                this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                static_elements.push(elem.join(''));
                break;
        }
        this.pushOverrideMethod(elements, overrides, indent2, indent3);
        if (setters.length) {
            elements.push(indent2 + '_setters: {' + setters.join(',') + '}');
        }
        if (getters.length) {
            elements.push(indent2 + '_getters: {' + getters.join(',') + '}');
        }
        elem = undefined;
    }

    if (elements.length) {
        codes.push(elements.join(','));
    }
    codes.push(indent1 + '})');
    if (cname) {
        if (static_elements.length) {
            codes.push(';' + indent1 + this.pushPostionsToMap(element.posi) + 'pandora.extend(' + cname + ', {');
            codes.push(static_elements.join(','));
            codes.push(indent1 + '});');
        } else {
            codes.push(';');
        }
        codes.push(indent1);
    }
    indent1 = indent2 = indent3 = elements = static_elements = cname = overrides = getters = setters = undefined;
    return codes;
}