walkClosure(index, display, vars) {
    // console.log(this.replacements[index]);
    let localvars = {
        // 父级作用域
        parent: vars,
        // ES5实际作用域
        scope: vars.scope,
        // 当前作用域本级变量
        self: {},
        // 子域变量
        locals: vars.locals,
        // 类型：局部
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
            // 父级作用域
            parent: vars,
            // ES5实际作用域
            scope: {
            // 局域命名空间
                namespace: namespace,
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
            locals: {},
            // 类型：ES5标准函数作用域
            type: 'scope'
        };
        // 当前作用域本级变量
        localvars.self = localvars.scope.protected;
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