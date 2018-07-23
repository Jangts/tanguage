@include 'arrow';
walkFnLike(index, display, vars, type) {
    function push(semicolons, lines) {
        for (let index = 0; index < lines.length; index++) {
            if (lines[index].type === 'codes') {
                semicolons = push(semicolons, lines[index].body);
                continue;
            }
            if (lines[index].posi) lines[index].posi.head = false;
            if (lines[index].value) {
                if (lines[index].value.match(/;/)) {
                    if (semicolons < 2) {
                        lines[index].value = lines[index].value.replace(/;\s*/, '; ');
                        semicolons++;
                    } else {
                        // console.log(lines[index].value);
                        lines[index].value = lines[index].value.replace(/;\s*/, '');
                    }
                }
            }
            head.body.push(lines[index]);
        }
        return semicolons;
    }
    // console.log(index, this.replacements[index]);
    let tem = {
        fnlike: /(^|(function|def|public|method)\s+)?([\$a-zA-Z_][\$\w]*)?\s*\(([^\(\)]*)\)\s*\{([^\{\}]*?)\}/
    }
    let matches = this.readBuffer(index).match(matchExpRegPattern.fnlike);
    // console.log(matches);
    let subtype = matches[2] || 'function';
    let fname = matches[3] !== 'function' ? matches[3] : '';
    if ((type === 'def' && subtype === 'function')|| type === 'exp') {
        if (reservedFname['includes'](fname)) {
            const headline = matches[4];
            let localvars = {
                parent: vars,
                root: vars.root,
                self: {},
                locals: vars.locals,
                fixed: [],
                fix_map: {},
                type: 'local'
            };
            if (fname === 'for') {
                var head = {
                    type: 'codes',
                    vars: localvars,
                    display: 'inline',
                    body: []
                };
                var lines = this.pushBodyToAST([], localvars, headline, true);
                var semicolons = push(0, lines);
                // console.log(semicolons, lines);
            } else {
                var head = this.pushSentencesToAST([], localvars, headline, false, this.getPosition(headline))[0] || (() => {
                    this.error(' Must have statements in head of ' + fname + ' expreesion.');
                })();
                // console.log(localvars, head);
            }

            let body = this.pushBodyToAST([], localvars, matches[5]);
            this.resetVarsRoot(localvars);
            // console.log(body);
            return {
                type: 'exp',
                posi: this.getPosition(this.replacements[index][1]),
                display: 'block',
                vars: localvars,
                expression: fname,
                head: head,
                body: body
            };
        }
        if (fname === 'each') {
            const condition = matches[4].match(matchExpRegPattern.travelargs);
            // console.log(matches, condition);
            if (condition) {
                let self = {}, agrs = [];
                if (condition[5]) {
                    if (condition[8]) {
                        if (condition[4] !== condition[8]) {
                            self[condition[4]] = 'var';
                            self[condition[8]] = 'var';
                            agrs = [[condition[4], this.getPosition(condition[3])], [condition[8], this.getPosition(condition[7])]];
                        } else {
                            this.error('indexname cannot same to the itemname');
                        }
                    } else {
                        self[condition[4]] = 'var';
                        agrs = [[condition[4], condition[3]]];
                    }
                } else {
                    if (condition[4] !== '_index') {
                        self['_index'] = 'var';
                        self[condition[4]] = 'var';
                        agrs = [['_index', undefined], [condition[4], this.getPosition(condition[3])]];
                    } else {
                        this.error('itemname cannot same to the default indexname');
                    }
                }

                this.useEach = true;

                let localvars = {
                    parent: vars,
                    root: {
                        namespace: null,
                        public: {},
                        const: {},
                        private: {},
                        protected: {},
                        fixed: [],
                        fix_map: {},
                        break: false
                    },
                    locals: vars.locals,
                    type: 'travel'
                };
                localvars.self = localvars.root.protected;
                localvars.locals['arguments'] = null;
                let iterator = this.pushSentencesToAST([], localvars, condition[1], false, this.getPosition(condition[2]))[0] || (() => {
                    this.error(' Must have statements in head of each expreesion.');
                })();

                let subtype = 'allprop';
                let code = matches[5].replace(/@ownprop[;\s]*/g, () => {
                    subtype = 'ownprop';
                    return '';
                });

                return {
                    type: 'travel',
                    posi: this.getPosition(this.replacements[index][1]),
                    display: 'block',
                    subtype: subtype,
                    iterator: iterator,
                    vars: localvars,
                    callback: {
                        type: 'def',
                        display: 'inline',
                        vars: localvars,
                        fname: '',
                        args: agrs,
                        body: this.pushBodyToAST([], localvars, code)
                    }
                }
            }
        }
    }
    let position = this.getPosition(this.replacements[index][1]);
    if (type === 'def'){
        if (fname) {
            if (fname !== 'return') {
                this.pushVariableToVars(vars, 'var', fname, position);
            }
        } else {
            if (subtype === 'function') {
                if (display === 'block') {
                    fname = '_ανώνυμος_function_' + this.anonymous_variables;
                    this.anonymous_variables++;
                }
            } else {
                display = 'block';
                fname = subtype;
                subtype = 'function';
            }
            this.pushVariableToVars(vars, 'var', fname, position);
        }
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
        locals: {},
        type: 'root'
    };
    localvars.self = localvars.root.protected;
    let args = this.checkArgs(matches[4], localvars);
    tem = undefined;
    return {
        type: type,
        vars: localvars,
        posi: this.getPosition(this.replacements[index][1]),
        display: display,
        subtype: subtype,
        fname: fname,
        args: args.keys,
        defaults: args.vals,
        body: this.checkFnBody(localvars, args, matches[5])
    }
}