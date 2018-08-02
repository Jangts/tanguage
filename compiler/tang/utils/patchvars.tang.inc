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