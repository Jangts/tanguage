walkArrowFn(index, display, vars) {
    let matches = this.readBuffer(index).match(matchExpRegPattern.arrowfn);
    // console.log(this.replacements[index], matches);
    let subtype = 'fn';
    let selfvas = {};
    if (matches[3] === '=>') {
        subtype = '=>';
        vars.locals['this'] = null;
        vars.locals['arguments'] = null;
        var locals = vars.locals;
        var varstype = 'arrowfn';
    } else {
        var locals = {};
        var varstype = 'root';
    }
    let localvars = {
        parent: vars,
        root: {
            namespace: vars.namespace,
            public: {},
            const: {},
            private: {},
            protected: {},
            fixed: [],
            fix_map: {}
        },
        locals: locals,
        type: varstype
    };
    localvars.self = localvars.root.protected;
    localvars.fix_map = localvars.root.fix_map;
    let args = this.checkArgs(this.replacements[matches[2]][0].toString().replace(/(^\(|\)$)/g, ''), localvars);
    // console.log(matches);
    return {
        type: 'def',
        posi: this.getPosition(this.replacements[index][1]),
        display: 'inline',
        vars: localvars,
        subtype: subtype,
        args: args.keys,
        defaults: args.vals,
        body: this.checkFnBody(localvars, args, matches[4])
    }
}