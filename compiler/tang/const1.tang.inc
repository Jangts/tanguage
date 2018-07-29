const
keywords = [
    'break',
    'case', 'catch', 'const', 'continue',
    'default', 'delete', 'do',
    'else',
    'finally', 'for', 'function',
    'if', 'in', 'instanceof',
    'let',
    'new', 'null',
    'return',
    'switch',
    'throw', 'try', 'typeof',
    'var', 'void',
    'while', 'with'],
reservedFname = ['if', 'for', 'while', 'switch', 'with', 'catch'],
reserved = ['window', 'global', 'tang', 'this', 'arguments'],
semicolon = {
    type: 'code',
    posi: undefined,
    display: 'inline',
    vars: {
        // 父级作用域
        parent: null,
        // ES5实际作用域
        scope: {
            // 局域命名空间
            namespace: this.namespace,
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
        // 类型：分号
        type: 'semicolon'
    },
    value: ';'
};