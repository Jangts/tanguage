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
patchVariables(code, vars) {
    // console.log(code, vars);
    if (code) {
        // console.log(code);
        
        return code.replace(matchExpRegPattern.pickConst, (match, before, definition, varname) => {
            // console.log(match, "\r\n", before, '[', varname, '](', type, ')', after);
            if (!definition && hasProp(vars.self, varname) && (vars.self[varname] === 'const')) {
                // console.log(vars);
                this.error('Cannot re-assign constant `' + varname + '`');
            }
            return match;
        }).replace(matchExpRegPattern.pickVars, (match, before, definition, varname, after) => {
            // console.log(before, match, after);
            // console.log(type);
            return before + (definition || '') + this.patchVariable(varname, vars) + after || '';
            }).replace(matchExpRegPattern.pickNS, (match, before, node, member) => {
            // console.log(match, "\r\n", before, '[', node, ']', member, vars);
            return before + this.patchNamespace(node, vars) + member;
        });
    }
    // console.log(code);
    return '';
}
patchVariable(varname, vars) {
    // console.log('before:', varname, vars);
    // if (varname === 'posi') console.log('before:', varname, vars);
    // if (varname === 'subtype') console.log('before:', varname, vars);
    // if (varname === 'code') console.log('before:', varname, vars);
    // if (varname === 'match') console.log('before:', varname, vars);
    // if (varname === 'element') console.log('before:', varname, vars);
    // if (varname === 'localvars') console.log('before:', varname, vars);
    // if (varname === 'block') console.log('before:', varname, vars);
    // if (varname === 'block_2') console.log('before:', varname, vars);
    
    if (vars.fix_map && hasProp(vars.fix_map, varname)) {
        // console.log(varname, vars.fix_map[varname]);
        return vars.fix_map[varname];
    }
    if (vars.type === 'local'){
        let parent = vars.parent;
        while (parent && parent.type === 'local') {
            if (parent.fix_map && hasProp(parent.fix_map, varname)) {
                // console.log(varname, vars.fix_map[varname]);
                return parent.fix_map[varname];
            }
            parent = parent.parent;
        }
    }
    
    if (hasProp(vars.scope.fix_map, varname)) {
        // console.log(varname, vars.scope.fix_map[varname]);
        return vars.scope.fix_map[varname];
    }

    // if (varname === 'block_2') console.log(!vars.scope.fixed['includes'](varname), (hasProp(vars.scope.private, varname) && (vars.scope.private[varname]!==vars)));
    
    if (!keywords['includes'](varname) && !this.xvars['includes'](varname) && (!vars.scope.fixed['includes'](varname) || (hasProp(vars.scope.private, varname) && (vars.scope.private[varname] !== vars)))) {
        // console.log(varname);
        if (hasProp(vars.scope.private, varname)) {
            // console.log(varname, vars.scope.private);
            let _varname = varname;
            // console.log(vars);
            while (hasProp(vars.scope.private, varname)) {
                varname = varname + '_' + vars.index;
            }
            while (vars.scope.fixed['includes'](varname)) {
                varname = varname + '_' + vars.index;
            }
            // vars.scope.fix_map[_varname] = varname;
        } else {
            for (const key in vars.locals) {
                if (hasProp(vars.locals, key)) {
                    const _key = vars.locals[key];
                    // console.log(_key);
                    if (varname === _key) {
                        varname = varname + '_' + vars.index;
                        while (vars.scope.private[varname]) {
                            varname = varname + '_' + vars.index;
                        }
                        while (vars.scope.fixed['includes'](varname)) {
                            varname = varname + '_' + vars.index;
                        }
                        // console.log(vars);
                        vars.scope.fix_map[_key] = varname;
                    }
                }
            }
            if (vars.parent) {
                varname = this.patchVariable(varname, vars.parent);
            }
        }
    }
    else if (
        !vars.scope.fixed['includes'](varname) &&
        !keywords['includes'](varname) && 
        !reserved['includes'](varname) && 
        !this.blockreserved['includes'](varname) &&
        !this.xvars['includes'](varname)) {
        varname = this.patchVariable(varname + '_' + vars.index, vars);
        // console.log(varname);
    }

    // console.log('after:', varname);
    return varname;
}