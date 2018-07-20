resetVarsRoot(vars) {
    let root = vars.root;
    for (const varname in vars.self) {
        if (hasProp(vars.self, varname)) {
            if (vars.self[varname] === 'const' || vars.self[varname] === 'let') {
                // console.log(vars);
                if (hasProp(root.protected, varname) && (!hasProp(root.private, varname) || (root.private[varname].parent === vars))) {
                    root.private[varname] = vars;
                }
            } else {
                // console.log(root.protected, root.protected.hasOwnProperty, root);
                if (hasProp(root.protected, varname)) {
                    root.protected[varname] = 'var';
                    // delete vars.self[varname];
                } else if (root.protected[varname] === 'let') {
                    this.error(' Variable `' + varname + '` has already been declared.');
                }
            }
        }
    }
    root = undefined;
}
fixVariables(vars) {
    vars.index = this.closurecount;
    // console.log(vars);
    // console.log(vars.type, vars);
    switch (vars.type) {
        case 'arrowfn':
            vars.root.fix_map['this'] = vars.locals['this'];
            vars.root.fixed.push(vars.locals['this']);
        case 'travel':
            if (vars.type === 'travel') {
                vars.root.fixed.push('this');
            }
            vars.root.fix_map['arguments'] = vars.locals['arguments'];
            vars.root.fixed.push(vars.locals['arguments']);
        case 'root':
            for (var element in vars.self) {
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
                if (varname !== element) {
                    // console.log(varname);
                    vars.root.fix_map[element] = varname;
                    if (hasProp(vars.root.public, element)) {
                        vars.root.public[element] = varname;
                    }
                }
                vars.root.fixed.push(varname);
            }
            if (vars.type === 'root') {
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
            for (var element in vars.self) {
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
                    while (vars.root.fixed['includes'](varname) || (vars.root.private[varname] && (vars.root.private[varname] !== vars))) {
                        // console.log(varname);
                        varname = varname + '_' + vars.index;
                    }

                    if (varname !== element) {
                        // console.log(varname);
                        vars.fix_map[element] = varname;

                    }
                    vars.fixed.push(varname);
                    vars.root.fixed.push(varname);
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
        return code.replace(/(^|[^\$\w\.])(var\s+)?([\$a-zA-Z_][\$\w]*)\s*=\s*/g, (match, before, definition, varname) => {
            // console.log(match, "\r\n", before, '[', varname, '](', type, ')', after);
            if (!definition && hasProp(vars.root.const, varname)) {
                this.error('Cannot re-assign constant `' + varname + '`');
            }
            return match;
        }).replace(/(^|[^\$\w\.])(var\s+)?([\$a-zA-Z_][\$\w]*)(\s+|\s*[^\$\w]|\s*$)/g, (match, before, definition, varname, after) => {
            // console.log(match, "\r\n", before, '[', varname, '](', type, ')', after);
            // console.log(type);
            return before + (definition || '') + this.patchVariable(varname, vars) + after || '';
        }).replace(/(^|[\?\:\=]\s*)(ns\.|\$\.|\.)(\.[\$a-zA-Z_][\$\w]*|$)/g, (match, before, node, member) => {
            // console.log(match, "\r\n", before, '[', node, ']', member, vars);
            return before + this.patchNamespace(node, vars) + member;
        });
    }
    // console.log(code);
    return '';
}
patchVariable(varname, vars) {
    // if (varname === 'document')
    //     console.log(!vars.root.fixed['includes'](varname) || (vars.root.private[varname] !== vars), vars.root.fixed, vars.root.private);
    // console.log('before:', varname, vars);
    if (vars.fix_map && hasProp(vars.fix_map, varname)) {
        // console.log(varname, vars.fix_map[varname]);
        return vars.fix_map[varname];
    }
    if (hasProp(vars.root.fix_map, varname)) {
        // console.log(varname, vars.root.fix_map[varname]);
        return vars.root.fix_map[varname];
    }
    else if (!keywords['includes'](varname) && !this.xvars['includes'](varname) && (!vars.root.fixed['includes'](varname) || (vars.root.private[varname]!==vars))) {
        // console.log(varname);
        if (hasProp(vars.root.private, varname)) {
            // console.log(varname, vars.root.private);
            let _varname = varname;
            // console.log(vars);
            while (hasProp(vars.root.private, varname)) {
                varname = varname + '_' + vars.index;
            }
            while (vars.root.fixed['includes'](varname)) {
                varname = varname + '_' + vars.index;
            }
            // vars.root.fix_map[_varname] = varname;
        } else {
            for (const key in vars.locals) {
                if (hasProp(vars.locals, key)) {
                    const _key = vars.locals[key];
                    // console.log(_key);
                    if (varname === _key) {
                        varname = varname + '_' + vars.index;
                        while (vars.root.private[varname]) {
                            varname = varname + '_' + vars.index;
                        }
                        while (vars.root.fixed['includes'](varname)) {
                            varname = varname + '_' + vars.index;
                        }
                        // console.log(vars);
                        vars.fix_map[_key] = varname;
                    }
                }
            }
        }
    }
    // console.log('after:', varname);
    return varname;
}