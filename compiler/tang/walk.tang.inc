walk(element, vars = false, inOrder) {
    // console.log(element);
    switch (element.type) {
        case 'arraylike':
        case 'list':
            return this.walkArray(element.index, element.display, vars);
        case 'arrowfn':
            return this.walkArrowFn(element.index, element.display, vars);
        case 'if':
        // console.log(element);
        case 'call':
        case 'callmethod':
        case 'construct':
            return this.walkCall(element.index, element.display, vars, element.type);
        case 'log':
        case 'callschain':
            return this.walkCallsChain(element.index, element.display, vars, element.type);
        case 'class':
            return this.walkClass(element.index, element.display, vars);
        case 'objlike':
            if (inOrder) {
                // console.log(true, element);
                element.type = 'object';
                return this.walkObject(element.index, element.display, vars);
            }
        case 'closure':
            return this.walkClosure(element.index, element.display, vars);
        case 'expression':
            return this.walkFnLike(element.index, element.display, vars, 'exp');
        case 'extends':
            return this.walkExtends(element.index, element.display, vars);
        case 'function':
            // console.log(element.index, element.display, vars, 'def');
            return this.walkFnLike(element.index, element.display, vars, 'def');
        case 'object':
        case 'sets':
            return this.walkObject(element.index, element.display, vars);
        case 'parentheses':
            return this.walkParentheses(element.index, element.display, vars);
        case 'pattern':
        case 'string':
        case 'template':
            let that = this;
            let position = this.getPosition(this.replacements[element.index][1]);
            // console.log(position);
            return {
                type: 'code',
                posi: position,
                display: element.display || 'inline',
                vars: vars,
                value: '___boundary_' + this.uid + '_' + element.index + '_as_string___'
                // value: this.replacements[element.index][0].toString().replace(this.markPattern, function () {
                //     return that.replacements[arguments[1]][0].toString();
                // })
            }
        default:
            return {
                type: 'code',
                posi: void 0,
                display: 'hidden',
                vars: vars,
                value: ""
            }
    }
}
walkArray(index, display, vars) {
    let body = [],
        position = this.getPosition(this.replacements[index][1]),
        clauses = this.readBuffer(index).replace(/([\[\s\]])/g, '').split(',');
    // console.log(this.replacements[index], clauses);
    for (let c = 0; c < clauses.length; c++) {
        if (c) {
            var posi = this.getPosition(clauses[c]);
        } else {
            var posi = this.getPosition(clauses[c]) || position;
        }
        this.pushSentencesToAST(body, vars, clauses[c], false, posi);
    }
    // console.log(body);
    return {
        type: 'arraylike',
        posi: position,
        display: display,
        vars: vars,
        body: body
    };
}
walkParentheses(index, display: undefined, vars) {
    let body = [],
        clauses = this.readBuffer(index).replace(/([\[\s\]])/g, '').split(/\s*(,)/),
        position = this.getPosition(this.replacements[index][1]);
    for (let c = 0; c < clauses.length; c++) {
        if (c) {
            var posi = this.getPosition(clauses[c]);
        } else {
            var posi = this.getPosition(clauses[c]) || position;
        }
        this.pushSentencesToAST(body, vars, clauses[c], false, posi);
    }
    // console.log(body);
    if (body.length === 1) {
        return body[0];
    }
    return {
        type: 'codes',
        display: 'inline',
        vars: vars,
        body: body
    };
}
@include 'walk/calls';
@include 'walk/class';
@include 'walk/objlikes';
@include 'walk/fnlikes';
@include 'walk/checks';