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
        // 父级作用域
        parent: vars,
        // ES5实际作用域
        scope: {
            // 局域命名空间
            namespace: vars.namespace,
            // 局域变量
            public: {},
            // 局域常量
            const: {},
            // 局域私有变量
            private: {},
            // 子域受保护变量
            protected: {},
            // 局域变量校正
            fixed: [],
            // 局域变量校正量映射
            fix_map: {}
        },
        // 子域变量
        locals: locals,
        // 类型：ES5标准函数作用域/箭头函数作用域
        type: varstype
    };
    localvars.self = localvars.scope.protected;
    localvars.fix_map = localvars.scope.fix_map;
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