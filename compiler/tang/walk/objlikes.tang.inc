walkClosure(index, display, vars) {
    // console.log(this.replacements[index]);
    let localvars = {
        parent: vars,
        root: vars.root,
        self: {},
        locals: vars.locals,
        fixed: [],
        fix_map: {},
        type: 'local'
    };
    let array = this.readBuffer(index).split(/\s*(\{|\})\s*/);
    let position = this.getPosition(this.replacements[index][1]);
    let body = this.pushBodyToAST([], localvars, array[2]);
    this.resetVarsRoot(localvars);
    array = undefined;
    return {
        type: 'closure',
        posi: position,
        display: display,
        vars: localvars,
        body: body
    }
}
walkExtends(index, display, vars) {
    // console.log(this.replacements[index]);
    let matches = this.readBuffer(index).match(matchExpRegPattern.extends);
    let position = this.getPosition(this.replacements[index][1]);
    let subtype = 'ext';
    let objname = matches[2];
    let localvars = vars;
    let namespace;
    let body;
    // console.log(matches);
    if ((matches[1] === 'voidns') || (matches[1] === 'voidglobal') || (matches[1] === 'voidanonspace') || (matches[1] === 'ns') || (matches[1] === 'global') || (matches[1] === 'anonspace')) {
        subtype = matches[1];
        if (subtype === 'voidanonspace' || subtype === 'anonspace') {
            this.useAnonSpace = true;
        } else {
            if (this.isNativeCode) {
                this.error('Native Code Not Support Namespace Expression');
            }
        }
        
        if (subtype === 'voidanonspace'||subtype === 'anonspace'){
            namespace = '';
        }
        else if ((subtype === 'voidglobal') || (subtype === 'global')) {
            namespace = objname + '.';
        } else {
            namespace = (vars.namespace || this.namespace) + objname + '.';
        }
        localvars = {
            parent: vars,
            root: {
                namespace: namespace,
                public: {},
                const: {},
                private: {},
                protected: {},
                fixed: [],
                fix_map: {}
            },
            locals: {},
            type: 'root'
        };
        localvars.self = localvars.root.protected;
        body = this.pushBodyToAST([], localvars, matches[3]);
    } else {
        if ((matches[1] === 'nsassign') || (matches[1] === 'globalassign')) {
            if (this.isNativeCode) {
                this.error('Native Code Not Support Assign Expression');
            }
            subtype = matches[1];
        } else {
            this.useExtends = true;
        }
        body = this.checkObjMember(localvars, matches[3]);
    }

    matches = namespace = undefined;

    return {
        type: 'extends',
        posi: position,
        display: display,
        subtype: subtype,
        oname: objname,
        vars: localvars,
        body: body
    }
}
walkObject(index, display, vars = true) {
    return {
        type: 'object',
        display: display || 'inline',
        posi: this.getPosition(this.replacements[index][1]),
        vars: vars,
        body: this.checkObjMember(vars, this.readBuffer(index))
    };
}