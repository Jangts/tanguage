resetVarsRoot(vars) {
    let scope = vars.scope;
    for (const varname in vars.self) {
        if (hasProp(vars.self, varname)) {
            if (vars.self[varname] === 'const' || vars.self[varname] === 'let') {
                // console.log(vars);
                if (hasProp(scope.protected, varname) && (!hasProp(scope.private, varname) || (scope.private[varname].parent === vars))) {
                    scope.private[varname] = vars;
                }
            } else {
                // console.log(scope.protected, scope.protected.hasOwnProperty, scope);
                if (hasProp(scope.protected, varname)) {
                    scope.protected[varname] = 'var';
                    // delete vars.self[varname];
                } else if (scope.protected[varname] === 'let') {
                    this.error(' Variable `' + varname + '` has already been declared.');
                }
            }
        }
    }
    scope = undefined;
}
fixVariables(vars) {
    vars.index = this.closurecount;
    // console.log(vars);
    // console.log(vars.type, vars);
    switch (vars.type) {
        case 'arrowfn':
            vars.scope.fix_map['this'] = vars.locals['this'];
            vars.scope.fixed.push(vars.locals['this']);
        case 'travel':
            if (vars.type === 'travel') {
                // console.log(vars);
                vars.scope.fixed.push('this');
            }
            vars.scope.fix_map['arguments'] = vars.locals['arguments'];
            vars.scope.fixed.push(vars.locals['arguments']);
        case 'blocklike':
        case 'scope':
            // if ((vars.type !== 'blocklike')) {
            //     // console.log('foo', vars.parent, vars.parent.scope.fix_map);
            //     for (const element in vars.parent.scope.fix_map) {
            //         if (hasProp(vars.parent.scope.fix_map, element)) {
            //             vars.scope.fixed.push(element);
            //             // vars.locals[element] = 
            //             vars.scope.fix_map[element] = vars.parent.scope.fix_map[element];
            //         }
            //     }
            // }
            for (const element in vars.self) {
                let varname = element;
                if (keywords['includes'](element) || reserved['includes'](element)) {
                    // console.log(vars);
                    this.error('keywords `' + element + '` cannot be a variable name.');
                }
                if (this.blockreserved['includes'](element)) {
                    varname = element + '_' + vars.index;
                    while (vars.self[varname]) {
                        varname = varname + '_' + vars.index;
                    }
                }
                while (vars.scope.fixed['includes'](varname)) {
                    // console.log(varname);
                    varname = varname + '_' + vars.index;
                }
                
                // if (varname !== element) {
                    // console.log(varname);
                    vars.scope.fix_map[element] = varname;
                    if (hasProp(vars.scope.public, element)) {
                        vars.scope.public[element] = varname;
                    }
                // }
                // console.log(varname, element);
                vars.scope.fixed.push(varname);
            }
            if ((vars.type === 'blocklike') || (vars.type === 'scope')) {
                for (const key in vars.locals) {
                    if (hasProp(vars.locals, key)) {
                        let varname = '_' + key;
                        while (vars.self[varname]) {
                            varname = varname + '_' + vars.index;
                        }
                        vars.locals[key] = varname;
                    }
                }
            }
            // console.log(vars);
            break;
        case 'local':
            for (const element in vars.self) {
                if (vars.self[element] === 'const' || vars.self[element] === 'let') {
                    let varname = element;
                    // console.log(vars.index, varname); 
                    if (keywords['includes'](element) || reserved['includes'](element)) {
                        this.error('keywords `' + element + '` cannot be a variable name.');
                    }
                    if (this.blockreserved['includes'](element)||this.xvars['includes'](element)) {
                        varname = element + '_' + vars.index;
                        while (vars.self[varname]) {
                            // console.log(varname);
                            varname = varname + '_' + vars.index;
                        }
                        // console.log(varname);
                    }
                    while (vars.scope.fixed['includes'](varname) || (vars.scope.private[varname] && (vars.scope.private[varname] !== vars))) {
                        // console.log(varname);
                        varname = varname + '_' + vars.index;
                    }

                    if (varname !== element) {
                        // console.log(varname, vars, vars.scope.fixed[element]);
                        // console.log(aaaaa);
                        if (vars.scope.fixed['includes'](element)){
                            vars.fix_map[element] = varname;
                        }else{
                            vars.scope.fix_map[element] = varname;
                        }
                    }
                    // console.log(varname, element, vars);
                    // vars.fixed.push(varname);
                    vars.scope.fixed.push(varname);
                }
            }
    }
    // console.log(vars);
    this.closurecount++;
}
@include 'patchvars';