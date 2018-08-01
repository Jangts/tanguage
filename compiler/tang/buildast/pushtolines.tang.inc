pushSentenceToLines(lines, code, display) {
    value = code.trim();
    if (value && !value.match(/^@\d+L\d+P\d+O?\d*:::$/)) {
        let match_as_statement = value.match(/^(@\d+L\d+P\d+O?\d*:::)?\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_([a-z]+)___([\r\n]+|$)/);
        // console.log(match_as_statement, display);
        if (match_as_statement) {
            if (display === 'block' && !['class', 'function', 'closure', 'if']['includes'](match_as_statement[3])) {
                // console.log(match_as_statement[2]);
                value = value + ';';
            }
            // console.log(this.replacements[match_as_statement[2]][1] || match_as_statement[1]);
            this.replacements[match_as_statement[2]][1] = this.replacements[match_as_statement[2]][1] || match_as_statement[1];
            lines.push({
                type: 'line',
                subtype: match_as_statement[3],
                // posi: this.replacements[match_as_statement[2]][1] || match_as_statement[1],
                display: display,
                index: match_as_statement[2]
            });
        } else {
            // console.log(value, display === 'block');
            if ((display === 'block') && !/_as_closure___$/.test(value)) {
                value += ';';
            } else if (/_as_aftoperator::$/.test(value)) {
                value += ';';
                display === 'block';
            }
            // console.log(value);
            let clauses = value.split(',');
            // console.log(clauses);
            for (let c = 0; c < clauses.length; c++) {
                let element = clauses[c];
                let position = this.getPosition(element);
                // console.log(position, value)
                if (position) {
                    if (display === 'block') {
                        position.head = true;
                    }
                    var value = element.replace(position.match, '');
                } else {
                    var value = element.trim();
                    let match_as_mark = value.match(/^@boundary_(\d+)_as_([a-z]+)::/);
                    if (match_as_mark && this.replacements[match_as_mark[1]][1]) {
                        position = this.getPositionByIndex(match_as_mark[1]);
                        if (position && (display === 'block')) {
                            position.head = true;
                        }
                    }
                }
                // if (display === 'block') {
                //     value = value + ';';
                // }
                lines.push({
                    type: 'line',
                    subtype: 'sentence',
                    display: display,
                    posi: position,
                    value: value
                });
            }
        }
        match_as_statement = undefined;
    }
}
pushVariablesToLines(lines, vars, posi, code, symbol, inOrder = false) {
    var display;
    var clauses = code.split(/,\s*(@\d+L\d+P\d+O?\d*:::)*/);
    clauses.unshift(posi);
    // console.log(array, clauses);
    for (let c = 0; c < clauses.length; c += 2) {
        if (inOrder) {
            if (c) {
                if (c === clauses.length - 2) {
                    display = 'last';
                } else {
                    display = 'inline';
                }
            } else {
                if (c === clauses.length - 2) {
                    display = 'block';
                } else {
                    display = 'first';
                }
            }
        } else {
            display = 'block';
        }
        // console.log(display);
        this.pushVariableToLines(lines, vars, clauses[c], clauses[c + 1], symbol, display);
    }
    display = clauses = undefined;
}
pushVariableToLines(lines, vars, posi, code, symbol, display = 'block') {
    if (code) {
        var _symbol = 'var';
        switch (display) {
            case 'first':
                return this.pushVariableToLine(lines, vars, code, symbol, posi, 'inline', _symbol, ',');

            case 'last':
                return this.pushVariableToLine(lines, vars, code, symbol, posi, 'inline', '', ';');

            case 'block':
                return this.pushVariableToLine(lines, vars, code, symbol, posi, 'block', _symbol, ';');

            default:
                return this.pushVariableToLine(lines, vars, code, symbol, posi, 'inline', '', ',');
        }
        _symbol = undefined;
    }
}