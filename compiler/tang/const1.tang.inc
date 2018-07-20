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
        parent: null,
        root: {
            namespace: this.namespace,
            public: {},
            const: {},
            private: {},
            protected: {},
            fixed: [],
            fix_map: {}
        },
        locals: {},
        type: 'semicolon'
    },
    value: ';'
};