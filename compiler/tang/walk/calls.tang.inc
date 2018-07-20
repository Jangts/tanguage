walkCall(index, display, vars, type) {
    // console.log(this.replacements[index]);
    let name = [],
        args = [],
        matches = this.readBuffer(index).match(matchExpRegPattern.call),
        position = this.getPosition(this.replacements[index][1]),
        nameArr = matches[1].split('___boundary_' + this.uid),
        paramArr = this.replacements[matches[2]][0].toString().split(/([\(,\)])/);
    // console.log(this.getLines(this.replacements[matches[2]][0].toString(), vars));
    // console.log(this.replacements[index], matches);
    for (let n = 0; n < nameArr.length; n++) {
        var element = nameArr[n];
        if (element) {
            if (type === 'construct') {
                // console.log(name, nameArr);
                this.pushReplacementsToAST(name, vars, element, false, undefined);
            } else {
                this.pushReplacementsToAST(name, vars, element, false, (n === 0) && position);
            }
        }
    }
    // console.log(matches, paramArr);
    for (let p = 0; p < paramArr.length; p++) {
        const paramPosi = this.getPosition(paramArr[p]);
        if (paramPosi) {
            var param = paramArr[p].replace(paramPosi.match, '').trim();
        } else {
            var param = paramArr[p].trim();
        }
        // console.log(paramPosi);
        if (param && param != '(' && param != ')' && param != ',') {
            // console.log(p, param, paramPosi);
            let statements = param.split('___boundary_' + this.uid);
            let inline = [];
            for (let s = 0; s < statements.length; s++) {
                this.pushReplacementsToAST(inline, vars, statements[s], false, (s === 0) && paramPosi);
            }
            // console.log(inline);
            if (inline.length) {
                args.push({
                    type: 'parameter',
                    posi: inline[0].posi || paramPosi,
                    display: 'inline',
                    vars: vars,
                    body: inline
                });
            } else {
                args.push({
                    type: 'parameter',
                    posi: paramPosi,
                    display: 'inline',
                    vars: vars,
                    body: [{
                        type: 'code',
                        posi: paramPosi,
                        display: 'inline',
                        vars: vars,
                        value: 'void 0'
                    }]
                });
            }
        }
    }
    if (type === 'callmethod') {
        if (position) position.head = false;
        display = 'inline';
    }
    // console.log(this.replacements[index]);
    matches = nameArr = paramArr = undefined;
    return {
        type: type,
        posi: position,
        display: display,
        name: name,
        vars: vars,
        args: args
    };
}
walkCallsChain(index, display, vars, type) {
    let code = this.readBuffer(index),
        position = this.getPosition(this.replacements[index][1]),
        calls = [];

    code.replace(/(@\d+L\d+P\d+O*\d*:::)?\.___boundary_[A-Z0-9_]{36}_(\d+)_as_callmethod___/g, (match, posi, _index) => {
        // console.log(match, posi, _index);
        if (posi) {
            this.replacements[_index][1] = posi;
        }
        calls.push(this.walkCall(_index, 'inline', vars, 'callmethod'));
        return '';
    });
    // console.log(code, calls, position);
    if (type === 'log' && position) {
        position.head = true;
    }

    code = undefined;
    return {
        type: type,
        posi: position,
        display: (position && position.head) ? 'blocks' : 'inline',
        vars: vars,
        calls: calls
    };
}