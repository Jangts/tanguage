pushSetToVars(lines, vars, type, index, length, symbol, _symbol, variable, value, position, endmark) {
    let _value, __value;
    if (type === '...') {
        _value = 'pandora.remove(' + value + ', \'' + variable + '\')';
    } else if (type === 'object') {
        // console.log(value, variable, index, endmark);
        _value = value + '.' + variable;
    } else {
        _value = value + '[' + index + ']';
    }
    this.pushVariableToVars(vars, symbol, variable, position);
    if (index) {
        if (index === length - 1) {
            __value = ', ' + variable + ' = ' + _value + endmark;
        } else {
            __value = ', ' + variable + ' = ' + _value;
        }
    } else {
        position.head = true;
        // console.log(_symbol, variable, _value);
        __value = _symbol + ' ' + variable + ' = ' + _value;
        if (length === 1){
            __value += endmark;
        }
    }
    // console.log(__value);
    _value = undefined;
    lines.push({
        type: 'line',
        subtype: 'variable',
        display: 'inline',
        posi: position,
        value: __value
    });
}
pushSetsToVars(lines, vars, type, index, symbol, _symbol, variable, value, position, endmark) {
    let _value, __value;
    variable = variable.replace(/\.+/, '');
    // console.log(variable);
    if (type === '...') {
        if (index) {
            __value = ', ' + variable + ' = ' + value + endmark;
        } else {
            position.head = true;
            __value = _symbol + ' ' + variable + ' = ' + value;
        }
    } else {
        _value = 'pandora.slice(' + value + ', ' + index + ')';
        if (index) {
            __value = ', ' + variable + ' = ' + _value + endmark;
        } else {
            position.head = true;
            __value = _symbol + ' ' + variable + ' = ' + _value;
        }
    }
    // console.log(__value);
    _value = variable = undefined;
    lines.push({
        type: 'line',
        subtype: 'variable',
        display: 'inline',
        posi: position,
        value: __value
    });
}
pushVariableToVars(vars, symbol, variable, position){
    if (vars.self[variable] !== void 0) {
        if (vars.self[variable] === 'let' || symbol === 'let') {
            if (position){
                this.error(' Variable `' + variable + '` has already been declared at char ' + position.col + ' on line ' + position.line + '.');
            }
            this.error(' Variable `' + variable + '` has already been declared.');
        }
        if (vars.self[variable] === 'const' || symbol === 'const') {
            if (position) {
                this.error(' Const `' + variable + '` has already been declared at char ' + position.col + ' on line ' + position.line + '.');
            }
            this.error(' Const `' + variable + '` has already been declared.');
        }
    }else{
        vars.self[variable] = symbol;
    }
    if (symbol === 'const') {
        vars.root.const[variable] = variable;
    }
    else if (symbol === 'public' && (vars.root.namespace !== null)) {
        vars.root.public[variable] = variable;
    }
}