pushVariableToLine(lines, vars, code, symbol, posi = '', display = 'inline', _symbol = '', endmark = ',') {
    if (code) {
        let position = this.getPosition(posi);
        let match = code.match(/^([\$\a-zA-Z_][\$\w]*)@boundary_(\d+)_as_operator::/);
        // console.log(code);
        if (match && ['in', 'of']['includes'](this.replacements[match[2]][0].toString().trim())) {
            let element = match[1];
            lines.push({
                type: 'line',
                subtype: 'sentence',
                display: 'inline',
                posi: void 0,
                value: _symbol + ' ' + code
            });
            this.pushVariableToVars(vars, symbol, element, position);
            element = undefined;
        } else {
            let array = code.split(/\s*=\s*/);
            // console.log(array);
            if (array.length === 1) {
                var value = 'void 0';
            } else {
                var value = array.pop();
            }
            // console.log(value, array);
            for (let index = 0; index < array.length; index++) {
                var element = array[index].trim();
                // if (position && display === 'block') position.head = true;
                if (index) {
                    // console.log(element);
                    lines.push({
                        type: 'line',
                        subtype: 'sentence',
                        posi: position,
                        display: 'inline',
                        value: element + ' = '
                    });
                } else {
                    let match = element.match(/^___boundary_[A-Z0-9_]{36}_(\d+)_as_(sets|list)___$/);
                    if (match) {
                        // console.log(match);
                        return this.pushVariablesToLine(lines, vars, match, symbol, _symbol, value, position, endmark);
                    } else if (element.match(/^[\$a-zA-Z_][\$\w]*$/)) {
                        // console.log(element);                    
                        this.pushVariableToVars(vars, symbol, element, position);
                        lines.push({
                            type: 'line',
                            subtype: 'variable',
                            display: 'inline',
                            posi: position,
                            value: _symbol + ' ' + element + ' = '
                        });
                        // value = element;
                    } else {
                        // console.log(element);
                        if (this.sources[position.file]) {
                            this.error('Unexpected Definition `' + symbol + '` at char ' + position.col + ' on line ' + position.line + ' in file [' + position.file + '][' + this.sources[position.file].src + '].');
                        } else {
                            // console.log(element);
                            this.error('Unexpected Definition `' + symbol + '` at char ' + position.col + ' on line ' + position.line + '.');
                        }
                    }
                    match = undefined;
                }
                // console.log('foo');
                if (index === array.length - 1) {
                    lines.push({
                        type: 'line',
                        subtype: 'sentence',
                        display: 'inline',
                        posi: void 0,
                        value: value + endmark
                    });
                }
            }
            array = value = undefined;
        }
        position = match = undefined;
    }
}
pushVariablesToLine(lines, vars, match, symbol, _symbol = '', value, position, endmark = ','){
    let type, elements = [];
    if (match[2] === 'sets') {
        let closure = this.readBuffer(match[1]).replace(/(\{|\})/g, '');
        if (/\.+/.test(closure)) {
            type = '...';
        } else {
            type = 'object';
        }
        elements = closure.split(',');
        closure = undefined;
    } else {
        type = 'array';
        elements = this.readBuffer(match[1]).replace(/(\[|\])/g, '').split(',');
    }
    value = this.pushVariableValueToLine(lines, vars, type, symbol, _symbol, value, position, endmark);
    // console.log(elements, value);
    for (let i = 0; i < elements.length; i++) {
        let position = this.getPosition(elements[i]);
        let element = elements[i].replace(position.match, '').trim();
        // console.log(element, element.indexOf('.'));
        // console.log(element, position.match);
        if (element.indexOf('.') >= 0) {
            this.pushSetsToVars(lines, vars, type, i, symbol, _symbol, element, value, position, endmark)
            break;
        } else {
            this.pushSetToVars(lines, vars, type, i, elements.length, symbol, _symbol, element, value, position, endmark)
        }
        position = element = undefined;
    }
    type = elements = undefined;
}
pushVariableValueToLine(lines, vars, type, symbol, _symbol, value, position, endmark){
    let anonvar;
    if (value.match(/^[\$a-zA-Z_][\$\w]*(\s*\.\s*[\$a-zA-Z_][\$\w]*)*$/) && !value.match(/___boundary_[A-Z0-9_]{36}_(\d+)_as_[a-z]+___/)) {
        if (type === '...') {
            this.anonymous_variables++;
            anonvar = '_ανώνυμος_variable_' + this.anonymous_variables;
            while (hasProp(vars.self, anonvar)) {
                this.anonymous_variables++;
                anonvar = '_ανώνυμος_variable_' + this.anonymous_variables;
            }
            lines.push({
                type: 'line',
                subtype: 'variable',
                display: 'block',
                posi: position,
                value: _symbol + ' ' + anonvar + ' = pandora.clone(' + value.replace(/\s+/g, '') + ')' + endmark
            });
            return anonvar;
        }
        return value.replace(/\s+/g, '');
    } else {
        // console.log(value);
        this.anonymous_variables++;
        anonvar = '_ανώνυμος_variable_' + this.anonymous_variables;
        while (hasProp(vars.self, anonvar)) {
            this.anonymous_variables++;
            anonvar = '_ανώνυμος_variable_' + this.anonymous_variables;
        }
        position.head = true;
        this.pushVariableToVars(vars, symbol, anonvar, position);
        lines.push(
            {
                type: 'line',
                subtype: 'variable',
                display: 'inline',
                posi: position,
                value: _symbol + ' ' + anonvar + ' = '
            },
            {
                type: 'line',
                subtype: 'sentence',
                display: 'inline',
                posi: void 0,
                value: value + endmark
            });
        return anonvar;
    }
}