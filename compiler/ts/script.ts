/*!
 * tanguage script compiler
 * Core Code
 *
 * Written and Designed By Jang Ts
 * https://github.com/Jangts/tanguage/wiki
 */
;
(function (root, factory) {
    // console.log(root.tang, typeof root.tang, typeof root.tang.init)
    if (typeof exports === 'object') {
        exports = factory(root);
        if (typeof module === 'object') {
            module.exports = exports;
        }
    }
    else if (typeof root.define === 'function' && root.define.amd) {
        // AMD
        root.define('tanguage_script', [], function () {
            return factory(root);
        });
    }
    else if (typeof root.tang === 'object' && typeof root.tang.init === 'function') {
        // TNS
        root.tang.init();
        root.tang.module.exports = factory(root);
        // console.log(root.tang.module.exports);
    }
    else {
        root.tanguage_script = factory(root);
    }
}(this, function (root) {
    if (Array.prototype['includes'] == undefined) {
        Array.prototype['includes'] = function(searchElement: any, fromIndex: any): boolean {
            fromIndex = parseInt(fromIndex) || 0;
            for (fromIndex; fromIndex < this.length; fromIndex++) {
                if (this[fromIndex] === searchElement) {
                    return true;
                }
            }
            return false;
        }
    }

    let Buf:any;
    if(typeof Buffer === 'function'){
        Buf = Buffer;
    }else{
        Buf = function (string: string) {
            this.value = string;
        }
        Buf.prototype['toString'] = function (): string {
            return this.value;
        }
    }

    const
        hasProp = (obj, prop) => {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        },
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
                // 是否含有箭头函数和遍历语句
                hasHalfFunScope: false,
                // 子域变量
                locals: {},
                // 类型：分号
                type: 'semicolon'
            },
            value: ';'
        };

    const
        zero2z: string[] = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
        replacements = [['{}'], ['/='], ['/'], [' +'], [' -'], [' === '], [' + '], ['\"'], ['"\\r\\n"'], ['[^\\/']],
        namingExpr: RegExp = /^[A-Z_\$][\w\$]*$/i,
        argsExpr: RegExp = /^...[A-Z_\$][\w\$]*$/i,
        stringas: any = {
            '/': '_as_pattern___',
            '`': '_as_template___',
            '"': '_as_string___',
            "'": '_as_string___'
        },
        // '++ ', '-- ',
        // ' !', ' ~', ' +', ' -', ' ++', ' --',
        // ' ** ', ' * ', ' / ', ' % ', ' + ', ' - ',
        // ' << ', ' >> ', ' >>> ',
        // ' < ', ' <= ', ' > ', ' >= ',
        // ' == ', ' != ', ' === ', ' !== ',
        // ' & ', ' ^ ', ' | ', ' && ', ' || ',
        // ' = ', ' += ', ' -= ', ' *= ', ' /= ', ' %= ', ' <<= ', ' >>= ', ' >>>= ', ' &= ', ' ^= ', ' |= '
        operators: any = {
            // 因为打开所有括号后还有检查一次符号，所以运算量还是会带有括号
            mixed: /([\$\w]\s*(@\d+L\d+P\d+O*\d*:::)?)(\=\=|\!\=|\=|\!|\+|\-|\*|\/|\%|<<|>>|>>>|\&|\^|\||<|>)=\s*((@\d+L\d+P\d+O*\d*:::)?(\+|\-)?[\$\w\.]|@boundary_)/g,
            bool: /([\$\w]\s*(@\d+L\d+P\d+O*\d*:::)?)(\&\&|\|\||\<|\<\<|\>\>\>|\>\>|\>)\s*((@\d+L\d+P\d+O*\d*:::)?(\+|\-)?[\$\w\.])/g,
            op: /([\$\w]\s*(@\d+L\d+P\d+O*\d*:::)?)(\+|\-|\*\*|\*|\/|\%|\&)\s*((@\d+L\d+P\d+O*\d*:::)?(\s+(\+|\-))?[\$\w\.])/g,
            owords: /\s+(@\d+L\d+P\d+O*\d*:::)?(in|of)\s+(@\d+L\d+P\d+O*\d*:::)?/g,
            sign: /(^|\s*[^\+\-])(\+|\-)([\$\w\.])/g,
            swords: /(^|[^\$\w])(typeof|instanceof|void|delete)\s+((@\d+L\d+P\d+O*\d*:::)?\+*\-*[\$\w\.]|@boundary_)/g,
            before: /(\+\+|\-\-|\!|\~)\s*([\$\w\.])/g,
            after: /([\$\w\.])[ \t]*(@\d+L\d+P\d+O*\d*:::)?(\+\+|\-\-)/g,
            error: /(.*)(\+\+|\-\-|\+|\-)(.*)/g
        },
        replaceWords = /(^|@\d+L\d+P\d+O?\d*:::|\s)(continue|return|throw|break|case|else)\s*(\s|;|___boundary_[A-Z0-9_]{36}_(\d+)_as_([a-z]+)___)/g,
        replaceExpRegPattern = {
            typetag: /^((\s*@\d+L\d+P0:::)*\s*(@\d+L\d+P0*):::(\s*))?@(module|native)[;\s]*/,
            namespace: /(^|[\r\n])((@\d+L\d+P0):::)?(\s*)namespace\s+(\.{0,1}[\$a-zA-Z_][\$\w\.]*)\s*(;|\r|\n)/,
            // 位置是在replace usings 和 strings 之后才tidy的，所以还存在后接空格
            use: /(@\d+L\d+P\d+:::)\s*use\s*(\$|@)?\s+([\~\$\w\.\/\\\?\=\&]+)(\s+as(\s+(@\d+L\d+P\d+:::\s*[\$a-zA-Z_][\$\w]*)|\s*(@\d+L\d+P\d+:::\s*)?\{(@\d+L\d+P\d+:::\s*[\$a-zA-Z_][\$\w]*(\s*,@\d+L\d+P\d+:::\s*[\$a-zA-Z_][\$\w]*)*)\})(@\d+L\d+P\d+:::\s*)?)?\s*[;\r\n]/g,
            include: /\s*@(include|template)\s+___boundary_[A-Z0-9_]{36}_(\d+)_as_string___[;\r\n]+/g,
            extends: /(@\d+L\d+P\d+O*\d*:::)?(void\s+ns|void\s+namespace|ns|namespace|extends)\s+((\.{0,3})[\$a-zA-Z_][\$\w\.]*)(\s+with)?\s*\{([^\{\}]*?)\}/g,
            anonspace: /(@\d+L\d+P\d+O*\d*:::)?(void\s+ns|void\s+namespace|ns|namespace)\s*\{([^\{\}]*?)\}/g,
            class: /(@\d+L\d+P\d+O*\d*:::)?((class|expands)(\s+\.{0,3}[\$a-zA-Z_][\$\w\.]*)?(\s+extends\s+\.{0,3}[\$a-zA-Z_][\$\w\.]*|ignore)?\s*\{[^\{\}]*?\})/g,
            fnlike: /(@\d+L\d+P\d+O*\d*:::)?(^|(function|def|public)\s+)?(([\$a-zA-Z_][\$\w]*)?\s*\([^\(\)]*\))\s*\{([^\{\}]*?)\}/g,
            parentheses: /(@\d+L\d+P\d+O*\d*:::)?\(\s*([^\(\)]*)\s*\)/g,
            arraylike: /(@\d+L\d+P\d+O*\d*:::)?\[(\s*[^\[\]]*)\s*\]/g,
            call: /(@\d+L\d+P\d+O*\d*:::)?((new)\s+([\$a-zA-Z_\.][\$\w\.]*)|(\.)?([\$a-zA-Z_][\$\w]*))\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*([^\$\w\s\{]|[\r\n].|\s*___boundary_[A-Z0-9_]{36}_\d+_as_array___|\s*@boundary_\d+_as_operator::|$)/g,
            callschain: /\s*(@\d+L\d+P\d+O*\d*:::)?\.\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_(call|callmethod)___(\s*(@\d+L\d+P\d+O*\d*:::)?\.\s*___boundary_[A-Z0-9_]{36}_\d+_as_(call|callmethod)___)*/g,
            arrowfn: /(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*(->|=>)\s*([^,;\r\n]+)\s*(,|;|\r|\n|$)/g,
            closure: /(@\d+L\d+P\d+O*\d*:::)?(@*[\$a-zA-Z_][\$\w]*|\)|\=|\:+|\(\s)?(@\d+L\d+P\d+O*\d*:::)?\s*\{(\s*[^\{\}]*?)\s*\}/g,
            recheckfn: /(@\d+L\d+P\d+O?\d*:::|\s+)?([\$a-zA-Z_][\$\w]*)?\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_closure___(@\d+L\d+P\d+O?\d*:::)?/,
            expression: /(@\d+L\d+P\d+O*\d*:::)?(if|for|while|switch|with|catch|each)\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*;*\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_(closure|objlike)___)/g,
            if: /(@\d+L\d+P\d+O*\d*:::)?if\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*/g,
            object: /(@\d+L\d+P\d+O*\d*:::)?\{\s*(@\d+L\d+P\d+O*\d*:::(\.\.\.)?[\$a-zA-Z_][\$\w]*(\s*,@\d+L\d+P\d+O*\d*:::(\.\.\.)?[\$a-zA-Z_][\$\w]*)*)\s*\}(@\d+L\d+P\d+O*\d*:::)?/g,
            array: /(@\d+L\d+P\d+O*\d*:::)?\[\s*(@\d+L\d+P\d+O*\d*:::(\.\.\.)?[\$a-zA-Z_][\$\w]*(\s*,@\d+L\d+P\d+O*\d*:::(\.\.\.)?[\$a-zA-Z_][\$\w]*)*)\s*\]/g,
            clog: /(@\d+L\d+P\d+O*\d*:::|\s+)clog\s+(.+?)\s*([;\r\n]+|$)/g
        },
        matchExpRegPattern = {
            string: /(\/|\#|`|"|')([\*\/\=])?/,
            strings: {
                // 位置是在replace usings 和 strings 之后才tidy的，所以还存在后接空格
                '/': /(\s*@\d+L\d+P\d+O?\d*:::\s*)?(\/[^\/\r\n]+\/[img]*)(\s+in\s|\s*@boundary_\d+_as_(preoperator|operator|aftoperator|comments)::|\s*[\r\n]|(\s*[\$\w])|\s*[^\$\w]|\s*$)/,
                '`': /(\s*@\d+L\d+P\d+O*\d*:::\s*)?(`[^`]*`)(\s+in\s|\s*@boundary_\d+_as_(preoperator|operator|aftoperator|comments)::|\s*[\r\n]|(\s*[\$\w])|\s*[^\$\w]|\s*$)/,
                '"': /(\s*@\d+L\d+P\d+O*\d*:::\s*)?("[^\"\r\n]*")(\s+in\s|\s*@boundary_\d+_as_(preoperator|operator|aftoperator|comments)::|\s*[\r\n]|(\s*[\$\w])|\s*[^\$\w]|\s*$)/,
                "'": /(\s*@\d+L\d+P\d+O*\d*:::\s*)?('[^\'\r\n]*')(\s+in\s|\s*@boundary_\d+_as_(preoperator|operator|aftoperator|comments)::|\s*[\r\n]|\s*([\$\w])|\s*[^\$\w]|\s*$)/
            },
            index: /(\d+)_as_([a-z]+)/,
            index3: /^_(\d+)_as_([a-z]+)___([\s\S]*)$/,
            extends: /(voidns|ns|nsassign|voidglobal|global|globalassign|extends|voidanonspace|anonspace)\s+([\$a-zA-Z_][\$\w\.]*)?\s*\{([^\{\}]*?)\}/,
            class: /(class|expands)\s*(\.{1,3})?([\$a-zA-Z_][\$\w\.]*)?(\s+extends\s+(\.{1,3})?([\$a-zA-Z_][\$\w\.]*)|ignore)?\s*\{([^\{\}]*?)\}/,
            fnlike: /(^|(function|def|public)\s+)?([\$a-zA-Z_][\$\w]*)?\s*\(([^\(\)]*)\)\s*\{([^\{\}]*?)\}/,
            call: /([\$a-zA-Z_\.][\$\w\.]*)\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___/,
            arrowfn: /(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*(->|=>)\s*([\s\S]*)\s*$/,
            objectattr: /^\s*(@\d+L\d+P\d+O?\d*:::)?((([\$a-zA-Z_][\$\w]*|@boundary_\d+_as_propname::)))\s*(\:*)([\s\S]*)$/,
            classelement: /^\s*(@\d+L\d+P\d+O?\d*:::)?((public|static|set|get|om)\s+)?([\$\w]*)\s*(\=*)([\s\S]*)$/,
            travelargs: /^((@\d+L\d+P\d+O*\d*:::)?[\$a-zA-Z_][\$\w\.]*)\s+as\s(@\d+L\d+P\d+O*\d*:::)([\$a-zA-Z_][\$\w]*)(\s*,((@\d+L\d+P\d+O*\d*:::)([\$a-zA-Z_][\$\w]*)?)?)?/,
            pickConst: /(^|[^\$\w\.])(var\s+)?([\$a-zA-Z_][\$\w]*)\s*=\s*/g,
            pickVars: /(^|[^\$\w\.])(var\s+)?([\$a-zA-Z_][\$\w]*)(\s+|\s*[^\$\w]|\s*$)/g,
            pickNS: /(^|[\?\:\=]\s*)(ns\.|\$\.|\.)(\.[\$a-zA-Z_][\$\w]*|$)/g
        },
        boundaryMaker = (): string => {
            let radix = 36;
            let uid = new Array(radix);
            for (let i = 0; i < radix; i++) {
                uid[i] = zero2z[Math.floor(Math.random() * radix)];
            }
            uid[8] = uid[13] = uid[18] = uid[23] = '_';
            radix = undefined;
            return uid.join('');
        },
        stringRepeat = (string: string, number: number): string => {
            return new Array(number + 1).join(string);
        };

    class Script {
        // 唯一标识
        uid: string
        // 源代码
        input: string
        // 是否主代码块
        isMainBlock: boolean = true
        // 第一有效标记位置
        first_availabe_posi: string
        // 全域命名空间
        namespace: string = ''
        // 全域命名空间标记位置
        namespace_posi: string
        markPattern: RegExp;
        lastPattern: RegExp;
        stringReplaceTimes: number = 65536;
        positions: Array<string>[] = []
        // 替换组
        replacements: Array<string>[]
        // 引入代码块组
        imports: any[] = []
        // 引入代码块别名
        using_as: object = {}
        // 语法树
        ast: any = {}
        // 位置映射表
        mappings: Array<any>[]
        configinfo = '{}'
        configinfo_posi: string
        posimap: any[] = [];
        sources: any[] = [];
        output: string | undefined
        tess = {}
        blockreserved:string[];
        xvars:string[];
        total_opens = 0;
        last_opens = [0];
        last_closed = true;
        anonymous_variables = 0;
        closurecount: number = 0;
        isNativeCode = false;
        useDeclare = false;
        useAnonSpace = true;
        useExtends = false;
        useEach = false;
        useLoop = false;
        constructor(input: string, source: string = '', run: boolean = false) {
            this.consoleDateTime('BEGIN:');
            this.uid = boundaryMaker();
            this.markPattern = new RegExp('@boundary_(\\\d+)_as_(mark)::', 'g');
            this.lastPattern = new RegExp('(___boundary_' + this.uid + '_(\\\d+)_as_(string|pattern|template)___|@boundary_(\\\d+)_as_propname::|@boundary_(\\\d+)_as_(keyword|midword|preoperator|operator|aftoperator|comments)::)', 'g');
            this.input = input;
            this.output = undefined;
            this.blockreserved = ['pandora', 'root'];
            this.xvars = [];
            this.replacements = [['{}'], ['/='], ['/'], [' +'], [' -'], [' === '], [' + '], ['\"'], ['"\\r\\n"'], ['[^\\/']];
            this.posimap = [];
            this.sources = [];
            this.mappings = [];
            
            if (source) {
                this.sources.push({
                    id: 0,
                    src: source
                });
                this.sources[source] = true;
            }
            if (run) {
                this.run();
            }
        }
        compile(): Script {
            this.consoleDateTime('START COMPILE:');
            // console.log(this.input);
            let newcontent: string = this.markPosition(this.input, 0);
            let string = this.encode(newcontent);
            let vars: any = {
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
                // 是否含有箭头函数和遍历语句
                hasHalfFunScope: false,
                // 子域变量
                locals: {},
                // 类型：类全域代码块
                type: 'blocklike'
            };
            // 当前作用域本级变量
            vars.self = vars.scope.protected;
            this.consoleDateTime('BUILD AST:');
            this.buildAST(this.pickReplacePosis(this.getLines(string, vars), vars), vars);
            // this.output = 'console.log("Hello, world!");';
            this.consoleDateTime('GENERATE:');
            this.generate();
            this.consoleDateTime('COMPLETED:');
            // console.log(this.replacements);
            newcontent = string = vars = undefined;
            return this;
        }
        error(str) {
            throw 'tanguage script Error: ' + str;
        }
        markPosition(string, sourceid: number = 0) {
            let lines = string.split(/\r{0,1}\n/);
            // console.log(lines);
            let positions = [];
            for (let l = 0; l < lines.length; l++) {
                const elements = lines[l].split(/(,|;|\{|\[|\(|\}|\sas\s|->|=>)/);
                // console.log(elements);
                let newline = [];
                for (let c = 0, length = 0; c < elements.length; c++) {
                    const element = elements[c];
                    if (c === 0) {
                        length = 0;
                    }
                    if (element === ',' || element === ';' || element === '{' || element === '[' || element === '(' || element === '}' || element === ' as ' || element === '->' || element === '=>') {
                        newline.push(element);
                    } else {
                        newline.push('@' + sourceid + 'L' + l + 'P' + length + ':::' + element);
                    }
                    length += element.length;
                }
                positions.push(newline);
            }
            let newlines = positions.map((line) => {
                return line.join("");
            })
            // this.positions.push(positions);
            // console.log(newlines.join("\r\n"));
            lines = positions = undefined;
            return newlines.join("\r\n");
        }
        tidyPosition(string) {
            let on = true;
            while (on) {
                on = false;
                string = string.replace(/(@\d+L\d+P\d+O?\d*:::\s*)+(@\d+L\d+P0:::)/g, (match: string, last: string, newline: string) => {
                    // console.log(match);
                    on = true;
                    return "\r\n" + newline;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/[\r\n]*(@\d+L\d+P)0:::(\s+)/g, (match, pre, space) => {
                    // console.log(pre, space);
                    on = true;
                    return "\r\n" + pre + space.length + 'O0:::';
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(@\d+L\d+P)(\d+):::(\s+)/g, (match, pre, num, space) => {
                    // console.log(pre, num, space);
                    on = true;
                    return pre + (parseInt(num) + space.length) + 'O' + num + ':::';
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(\{|\[|\(|\)|\]|\})\s*@\d+L\d+P\d+O?\d*:::\s*(\)|\]|\})/g, (match: string, before: string, atfer: string) => {
                    // console.log(match);
                    on = true;
                    return before + atfer;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(@\d+L\d+P\d+O?\d*:::\s*)+(\)|\]|\})/g, (match: string, posi: string, panbrackets: string) => {
                    // console.log(match);
                    on = true;
                    return panbrackets;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(\s*@\d+L\d+P\d+O?\d*:::)+(,|;)/g, (match: string, posi: string, panstop: string) => {
                    // console.log(match);
                    on = true;
                    return panstop;
                });
            }
            string = string.replace(/::::/g, '::: :');
            return string;
        }
        pushBuffer(replacement:any[]){
            // console.log(typeof Buffer, Buffer);
            let buf = new Buf(replacement[0]);
            replacement[0] = buf;
            this.replacements.push(replacement);
        }
        readBuffer(index) {
            // console.log(this.replacements[index][0]);
            if (index > 9) {
                let string = this.replacements[index][0].toString();
                this.replacements[index][0] = undefined;
                return string;
            }
            return replacements[index][0].toString();
        }
        encode(string: string): string {
            // console.log(string);
            string = string
                .replace(replaceExpRegPattern.typetag, (match: string, gaps, preline, posi, gap, tag) => {
                    this.isMainBlock = false;
                    if (gaps) {
                        this.first_availabe_posi = posi;
                        if (!!gap) {
                            this.first_availabe_posi += 'O' + gap.length;
                        }
                    } else {
                        this.first_availabe_posi = '@0L0P0';
                    }
                    if (tag === 'module') {
                        this.blockreserved.push('module');
                    }
                    else if (tag === 'native') {
                        this.isNativeCode = true;
                    }
                    
                    // console.log(gaps, preline, posi, !!gap, gap.length);
                    // console.log('This is not a main block.', this.first_availabe_posi);
                    return '';
                })
                .replace(replaceExpRegPattern.namespace, (match: string, linestart, posi, at, gap: string, namespace: string) => {
                    if (this.namespace === '') {
                        this.namespace += namespace + '.';
                        this.namespace_posi = at;
                        if (gap) {
                            this.namespace_posi += 'O' + gap.length;
                        }
                        this.namespace.replace(/^\.+/, '').replace(/\.+/, '.');
                        // console.log('namespace:' + namespace, this.namespace_posi);
                    }
                    return '';
                });
            // console.log(string);
            string = this.replaceUsing(string);
            // console.log(string);
            string = this.replaceStrings(string);
            this.consoleDateTime('LOADING SRCS:');
            string = this.replaceIncludes(string);
            this.consoleDateTime('SRCS LOADED:');
            // console.log(string);
            // console.log(this.replacements);
            string = this.tidyPosition(string);
            // console.log(string);
            string = string.replace(/(@\d+L\d+P\d+O?\d*:::)?((public|static|set|get|om|\+)\s+)?___boundary_[A-Z0-9_]{36}_(\d+)_as_string___\s*(\:|\(|\=)/g, (match, posi, desc, type, index, after) => {
                // console.log(posi, desc, this.replacements[index][1]);
                if(after==='('){
                    after = ': (';
                }
                if (this.replacements[index][1]) {
                    return "\r\n" + this.replacements[index][1] + '@boundary_' + index + '_as_propname::' + after;
                }
                if (desc) {
                    if (type==='+'){
                        return match;
                    }
                    return "\r\n" + posi + desc + '@boundary_' + index + '_as_propname::' + after;
                }
                return "\r\n" + '@boundary_' + index + '_as_propname::' + after;
            });
            // console.log(string);
            string = string
                .replace(/([\$a-zA-Z_][\$\w]*)\s*(->|=>)/g, "($1)$2")
                .replace(/\.\s*\(/g, "..storage.set(")
                .replace(/@\s*\(/g, "..storage.get(")
                .replace(/@\d+L\d+P\d+O?\d*:::@var\s+([\$a-zA-Z_][\$\w]*(\s*,\s*@\d+L\d+P\d+O?\d*:::[\$a-zA-Z_][\$\w]*)*);*/g, (match, words)=>{
                    let vars = words.replace(/\s*@\d+L\d+P\d+O?\d*:::/g, '').split(',');
                    // console.log(vars, match);
                    this.xvars.push(...vars);
                    return '';
                });
            // console.log(string);
            // console.log(this.xvars, string);
            // console.log(this.replacements);

            this.consoleDateTime('ANALYZE:');
            string = this.replaceBrackets(string);
            // console.log(string);
            string = this.replaceBraces(string);
            // console.log(string);
            string = this.replaceParentheses(string);
            // console.log(string);
            string = string
                .replace(/@\d+L\d+P\d+O?\d*:::(___boundary_|$)/g, "$1")
                .replace(/@\d+L\d+P\d+O?\d*:::(___boundary_|$)/g, "$1")
                .replace(/\s*(,|;)\s*/g, "$1\r\n")
                .replace(/(_\d+_as_function___)[;\s]*(@boundary_\d+_as_midword::)/g, "$1\r\n$2");
            // console.log(string);
            // console.log(this.replacements);
            return string;
        }
        replaceUsing(string: string): string {
            return string.replace(replaceExpRegPattern.use, (match: string, posi, $, url, as, alias, variables, posimembers, members) => {
                if (this.isNativeCode) {
                    this.error('Native Code Not Support Use Expression');
                }
                // console.log(arguments);
                // console.log(match, ':', posi, url, as, alias);
                let index = this.replacements.length;
                if ($) {
                    if ($==='@') {
                        url = '//' + url;
                    }else{
                        url = '$_/' + url;
                    }
                }
                if (members) {
                    // console.log(members);
                    // url = url.replace(array, '[]');
                    this.pushBuffer([url, members, posi]);
                    return '___boundary_' + this.uid + '_' + index + '_as_usings___;';
                }
                this.pushBuffer([url, variables, posi]);
                return '___boundary_' + this.uid + '_' + index + '_as_using___;';
            });
        }
        replaceStrings(string: string, ignoreComments: boolean = false): string {
            string = string.replace(/\\+(`|")/g, (match: string) => {
                let index = this.replacements.length;
                this.pushBuffer([match]);
                return '@boundary_' + index + '_as_mark::';
            })
            .replace(/\\+(`|")/g, (match: string) => {
                let index = this.replacements.length;
                this.pushBuffer([match]);
                return '@boundary_' + index + '_as_mark::';
            })
            .replace(/\[@\d+L\d+P\d+O?\d*:::\^\//g, '@boundary_9_as_mark::')
            .replace(/(=|:)\s*\/=/g, '$1 /\\=')
            .replace(/\\[^\r\n](@\d+L\d+P\d+O?\d*:::)*/g, (match: string) => {
                let index = this.replacements.length;
                this.pushBuffer([match]);
                return '@boundary_' + index + '_as_mark::';
            });
            // console.log(string);

            let count: number = 0;
            let matches: any = string.match(matchExpRegPattern.string);

            while ((count < this.stringReplaceTimes) && matches) {
                count++;
                // console.log(count, matches );
                // console.log(matches);
                const index = this.replacements.length;
                switch (matches[1]) {
                    case '#':
                        string = string.replace(/(\S*)\s*\#.+/, "$1");
                        matches = string.match(matchExpRegPattern.string);
                        continue;

                    case '/':
                        switch (matches[2]) {
                            case '*':
                                if (ignoreComments) {
                                    // console.log(true);
                                    string = string.replace(/\/\*{1,2}[\s\S]*?(\*\/|$)/, (match) => {
                                        this.pushBuffer([match]);
                                        return '@boundary_' + index + '_as_comments::';
                                    });
                                } else {
                                    string = string.replace(/\/\*{1,2}[\s\S]*?(\*\/|$)/, "");
                                }
                                matches = string.match(matchExpRegPattern.string);
                                continue;
                            case '/':
                                string = string.replace(/(\S*)\s*\/\/.*/, "$1");
                                matches = string.match(matchExpRegPattern.string);
                                continue;
                            case '=':
                                string = string.replace(matches[0], '@boundary_1_as_operator::');
                                matches = string.match(matchExpRegPattern.string);
                                continue;
                        }
                        break;
                }
                let match: any = string.match(matchExpRegPattern.strings[matches[1]]);
                if (match && (matches.index >= match.index) && !match[5]) {
                    // console.log(matches, match);
                    if (matches[1]==='`'){
                        string = string.replace(match[2], this.replaceTemplate(match[2]));
                    }else{
                        if (match[1]) {
                            this.pushBuffer([match[2].replace(/@\d+L\d+P\d+O?\d*:::/g, ''), match[1].trim(), match[4]]);
                        } else {
                            this.pushBuffer([match[2].replace(/@\d+L\d+P\d+O?\d*:::/g, ''), void 0, match[4]]);
                        }
                        string = string.replace(match[0], '___boundary_' + this.uid + '_' + index + stringas[matches[1]] + match[3]);
                    }
                } else if (matches[1] === '`' && match) {
                    // console.log(match, string);
                    string = string.replace(match[2], this.replaceTemplate(match[2]));
                } else if (matches[0] === '/') {
                    string = string.replace(matches[0], '@boundary_2_as_operator::');
                } else {
                    // console.log(string, matches, match);
                    // console.log(matches, match);
                    this.error('Unexpected `' + matches[1] + '` in `' + this.decode(string.substr(matches.index)).substr(0, 256) + '`');
                }
                matches = string.match(matchExpRegPattern.string);
            }
            // console.log(string);
            // console.log(this.replacements);
            matches = undefined;
            // console.log('LOOP TIMES: ' + count);
            return string;
        }
        replaceTemplate(string){
            const lines = string.replace(/"/g, () => {
                return '@boundary_7_as_mark::';
            }).replace(/`/g, '').split(/\r{0,1}\n/);
            let codes: string[] = []
            // console.log(match);
            if (this.last_closed && this.last_opens.length){
                let i = this.last_opens.length - 1;
                // console.log(i);
                var opens: number = this.last_opens[i];
                // console.log(this.last_opens, this.last_opens.length, i);
                this.last_opens.length = i;
            }else{
                var opens: number = 0;
            }
            
            for (let index = 0; index < lines.length; index++) {
                let posi = '';
                const line = lines[index].replace(/@\d+L\d+P\d+O?\d*:::/g, (_posi)=>{
                    if(!posi){
                        posi = _posi;
                    }
                    return '';
                });
                if(line){
                    const elements = line.split(/(\$\{|\{|\})/);
                    // console.log(posi);
                    let type, lasttype;
                    let inline: any[] = [];
                    let code: string = posi;
                    // console.log(line, elements);
                    for (let e = 0; e < elements.length; e++) {
                        const element = elements[e];
                        if (opens === 0 && element === '${') {
                            opens++;
                            this.total_opens++;
                            // console.log('add', opens, this.total_opens);
                        } else if (opens && element === '{') {
                            opens++;
                            this.total_opens++;
                            // console.log('add', opens, this.total_opens);
                            inline[inline.length - 1].value += '{';
                        } else if (opens && element === '}') {
                            opens--;
                            this.total_opens--;
                            // console.log('minus', opens, this.total_opens);
                            if (opens) {
                                inline[inline.length - 1].value += '}';
                            }
                        } else {
                            if (opens === 0) {
                                type = 'string';
                            } else {
                                type = 'code';
                            }
                            if (type === lasttype) {
                                inline[inline.length - 1].value += element;
                            } else {
                                inline.push({
                                    type: type,
                                    value: element
                                });
                            }
                            lasttype = type;
                        }
                    }

                    for (let c = 0; c < inline.length; c++) {
                        if (c) {
                            code += '@boundary_6_as_operator::';
                            // code += ' + ';
                        }
                        if (inline[c].type === 'string') {
                            // this.pushBuffer(['"' + inline[c].value + '"']);
                            code += '"' + inline[c].value + '"';
                        } else {
                            code += inline[c].value.replace(/@boundary_7_as_mark::/g, '"');
                        }
                    }
                    // console.log(code);
                    codes.push(code.replace(/""@boundary_6_as_operator::/g, '').replace(/@boundary_6_as_operator::""$/, ''));
                }
            }
            if (opens) {
                this.last_closed = false;
                this.last_opens.push(opens);
            } else {
                this.last_closed = true;
            }
            if (this.total_opens) {
                var after: string = '`';
            } else {
                var after: string = '';
            }
            string = codes.join('@boundary_6_as_operator::___boundary_' + this.uid + '_8_as_string___' + '@boundary_6_as_operator::;' + "\r\n");
            // console.log(lines, codes);
            // console.log(this.last_closed, this.total_opens, opens, string + after);
            // console.log(string);
            string = string.replace(/"@boundary_6_as_operator::___boundary_[A-Z0-9_]{36}_8_as_string___/g, '\\r\\n"');
            string = this.replaceStrings(string) + after;
            // console.log(string);
            // console.log(this.replacements);
            // a();
            codes = undefined;
            return string;
        }
        replaceIncludes(string: string): string {
            if (this.sources.length) {
                let on = true;
                let id = this.sources.length - 1;
                let str;
                while (on) {
                    on = false;
                    string = string.replace(replaceExpRegPattern.include, (match: string, type:string, index) => {
                        // console.log(this.sources);
                        // console.log(id, this.sources[id].src);
                        on = true;
                        let context = this.sources[id].src.replace(/[^\/\\]+$/, '');
                        let src = this.readBuffer(index).replace(/('|"|`)/g, '').trim();
                        switch (type){
                            case 'template':
                                if (this.isNativeCode) {
                                    this.error('Native Code Not Support TPL File');
                                }
                                str = this.getTplContent(src, context);
                                // console.log(str, this.replacements[index]);
                                this.replacements[index][0] = "'" + escape(str) + "'";
                                return 'new ..dom.Template(unescape(___boundary_' + this.uid + '_' + index + '_as_string___));';

                            case 'include':
                                str = this.onReadFile(src, context);
                                str = this.markPosition(str, this.sources.length - 1);
                                // console.log(str);
                                str = this.replaceStrings(str);
                                // console.log(str);
                                str = this.replaceIncludes(str);
                                return str + "\r\n";//this.onReadFile(match);
                        }
                    });
                }
            }
            return string
        }
        onReadFile(source: string, context: any = void 0): string {
            // console.log(match, source);
            return "/* include '" + source + "' not be supported. */\r\n";
        }
        getTplContent(source: string, context: any = void 0): string {
            return "";
        }
        replaceBrackets(string: string): string {
            let left = string.indexOf('[');
            let right = string.indexOf(']');
            let count: number = 0;
            while ((count < this.stringReplaceTimes) && (left >= 0)) {
                count++;
                // console.log(left, right);
                // console.log(left, right, string);
                if (left < right) {
                    string = string.replace(replaceExpRegPattern.array, (match: string, posi, elements) => {
                        // console.log(match, elements);
                        let index = this.replacements.length;
                        this.pushBuffer(['[' + elements + ']', posi && posi.trim()]);
                        return '___boundary_' + this.uid + '_' + index + '_as_list___';
                    }).replace(replaceExpRegPattern.arraylike, (match: string, posi: string, elements: string) => {
                        // console.log(match);
                        elements = this.replaceBraces(elements);
                        elements = this.replaceParentheses(elements);
                        let index = this.replacements.length;
                        this.pushBuffer(['[' + elements + ']', posi && posi.trim()]);
                        return '___boundary_' + this.uid + '_' + index + '_as_arraylike___';
                    });
                    left = string.indexOf('[');
                    right = string.indexOf(']');
                } else {
                    if (right >= 0) {
                        var index = right;
                    } else {
                        var index = left;
                    }
                    this.error('Unexpected `' + (right >= 0 ? ']' : '[') + '` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
                }
            }
            if (right >= 0) {
                var index = right;
                // console.log(left, right, string);
                this.error('Unexpected `]` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
            }
            return string;
        }
        replaceBraces(string: string): string {
            let left = string.indexOf('{');
            let right = string.indexOf('}');
            let count: number = 0;
            while ((count < this.stringReplaceTimes) && (left >= 0)) {
                count++;
                // console.log(left, right);
                if (left < right) {
                    string = this.replaceCodeSegments(string);
                    // console.log(string);
                    string = this.recheckFnOrCallLikes(string)
                    left = string.indexOf('{');
                    right = string.indexOf('}');
                } else {
                    if (right >= 0) {
                        var index = right;
                    } else {
                        var index = left;
                    }
                    // console.log(left, right, string.substr(index, 256));
                    this.error('Unexpected `' + (right >= 0 ? '}' : '{') + '` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
                }
            }
            if (right >= 0) {
                var index = right;
                // console.log(string);
                this.error('Unexpected `}` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
            }
            return string;
        }
        replaceCodeSegments(string: string): string {
            // console.log(string);
            let matched = false;
            string = string.replace(replaceExpRegPattern.class, (match: string, posi, body) => {
                matched = true;
                body = this.replaceParentheses(body);
                let index = this.replacements.length;
                this.pushBuffer([body, posi && posi.trim()]);
                return '___boundary_' + this.uid + '_' + index + '_as_class___';
            });
            if (matched) return string;

            string = string.replace(replaceExpRegPattern.extends, (match: string, posi, exp, name, node, assign, closure) => {
                matched = true;
                name = name.replace(/^\.+/, '');
                exp = exp.replace(/\s+/, '');
                let body;
                if (assign) {
                    if (exp === 'extends') {
                        this.error('Unexpected `extends`: extends ' + name + ' with');
                    }
                    else {
                        if (node && node.length === 2) {
                            body = 'globalassign ' + name + '{' + this.replaceParentheses(closure) + '}';
                        } else {
                            body = 'nsassign ' + name + '{' + this.replaceParentheses(closure) + '}';
                        }
                    }
                } else {
                    if (exp === 'extends') {
                        if (node) {
                            if (node.length === 2) {
                                body = 'globalassign ' + name + '{' + this.replaceParentheses(closure) + '}';
                            } else {
                                body = 'nsassign ' + name + '{' + this.replaceParentheses(closure) + '}';
                            }
                        } else {
                            body = 'extends ' + name + '{' + this.replaceParentheses(closure) + '}';
                        }
                    }
                    else {
                        if (node && node.length === 2) {
                            if (exp === 'voidns' || exp === 'voidnamespace') {
                                body = 'voidglobal ' + name + '{' + this.replaceParentheses(closure) + '}';
                            } else {
                                body = 'global ' + name + '{' + this.replaceParentheses(closure) + '}';
                            }                           
                        } else {
                            if (exp === 'voidns' || exp === 'voidnamespace') {
                                body = 'voidns ' + name + '{' + this.replaceParentheses(closure) + '}';
                            } else {
                                body = 'ns ' + name + '{' + this.replaceParentheses(closure) + '}';
                            }
                        }
                    }
                }
                let index = this.replacements.length;
                this.pushBuffer([body, posi && posi.trim()]);
                return '___boundary_' + this.uid + '_' + index + '_as_extends___';
            });
            if (matched) return string;

            string = string.replace(replaceExpRegPattern.anonspace, (match: string, posi, exp, closure) => {
                matched = true;
                exp = exp.replace(/\s+/, '');
                // console.log(exp);
                if (exp === 'voidns' || exp === 'voidnamespace') {
                    var body = 'voidanonspace {' + this.replaceParentheses(closure) + '}';
                } else {
                    var body = 'anonspace {' + this.replaceParentheses(closure) + '}';
                }
                let index = this.replacements.length;
                this.pushBuffer([body, posi && posi.trim()]);
                return '___boundary_' + this.uid + '_' + index + '_as_extends___';
            });
            if (matched) return string;

            string = string.replace(replaceExpRegPattern.fnlike, (match: string, posi, definition, type, call, callname, closure) => {
                matched = true;
                // console.log(match);
                closure = this.replaceParentheses(closure);
                call = this.replaceOperators(call);
                match = (definition || '') + call + ' {' + closure + '}';
                let index = this.replacements.length;
                // console.log(match);
                this.pushBuffer([match, posi && posi.trim()]);
                return '___boundary_' + this.uid + '_' + index + '_as_function___';
            });
            if (matched) return string;

            string = string.replace(replaceExpRegPattern.object, (match: string, posi, closure) => {
                matched = true;
                // console.log([match, posi, closure]);
                let index = this.replacements.length;
                this.pushBuffer([match, posi && posi.trim()]);
                return '___boundary_' + this.uid + '_' + index + '_as_sets___';
            });
            if (matched) return string;

            return this.replaceClosures(string);
        }
        replaceClosures(string: string): string {
            return string.replace(replaceExpRegPattern.closure, (match: string, posi1, word: string, posi3, closure: string) => {
                // console.log(match, '|', word, '|', posi3, '|', closure);
                // if (!word && match.match(/\s*\{\s*\}/)) {
                //     console.log(posi2, '|', posi3);
                //     return '@boundary_0_as_mark::';
                // }
                closure = this.replaceParentheses(closure);
                // closure = this.replaceOperators(closure, false);
                // console.log(closure);
                posi1 = posi1 ? posi1.trim() : '';
                posi3 = posi3 ? posi3.trim() : '';
                let index = this.replacements.length;
                let index2;
                // console.log(word, ':',closure);
                switch (word) {
                    case undefined:
                        // console.log(closure);
                        // console.log(word, closure);
                        // console.log(closure.indexOf(';') >= 0);
                        // console.log(!closure.match(/^\s*(@\d+L\d+P\d+O?\d*:::)?(___boundary_[A-Z0-9_]{36}_\d+_as_function___|[\$a-zA-Z_][\$\w]*\s*(,|:|$)|@boundary_\d+_as_propname:::)/));

                        if ((closure.indexOf(';') >= 0) ||
                            !closure.match(/^\s*(@\d+L\d+P\d+O?\d*:::)?(___boundary_[A-Z0-9_]{36}_\d+_as_function___|@boundary_\d+_as_propname:::|[\$a-zA-Z_][\$\w]*\s*(,|:|$))/)) {
                            // console.log('foo');
                            this.pushBuffer(['{' + closure + '}', posi3]);
                            return posi1 + (word || '') + posi3 + ' ___boundary_' + this.uid + '_' + index + '_as_closure___';
                        }
                        if (closure.match(/^\s*___boundary_[A-Z0-9_]{36}_\d+_as_function___\s*$/)) {
                            // console.log('bar');
                            this.pushBuffer(['{' + closure + '}', posi3]);
                            return posi1 + (word || '') + posi3 + ' ___boundary_' + this.uid + '_' + index + '_as_objlike___';
                        }
                        // console.log(closure);
                        // console.log(word, '|', posi2, '|', posi3);
                        this.pushBuffer(['{' + closure + '}', posi3]);
                        return '___boundary_' + this.uid + '_' + index + '_as_object___';

                    case ':':
                    case ':::':
                    case '=':
                        this.pushBuffer(['{' + closure + '}']);
                        return word + ' ___boundary_' + this.uid + '_' + index + '_as_object___';

                    case '@config':
                        if (this.configinfo === '{}') {
                            this.configinfo_posi = posi1 || posi3;
                            this.configinfo = this.decode(match.replace('@config', ''));
                        }
                        return '';

                    case 'return':
                    case 'typeof':
                        this.pushBuffer([word + ' ', posi1]);
                        index2 = this.replacements.length;
                        this.pushBuffer(['{' + closure + '}']);
                        return '@boundary_' + index + '_as_preoperator::___boundary_' + this.uid + '_' + index2 + '_as_object___';

                    case 'do':
                    case 'try':
                        this.pushBuffer([word + ' ', posi1]);
                        index2 = this.replacements.length;
                        this.pushBuffer(['{' + closure + '}', posi3]);
                        return '; @boundary_' + index + '_as_keyword::___boundary_' + this.uid + '_' + index2 + '_as_closure___;';

                    case 'else':
                    case 'finally':
                        this.pushBuffer([word + ' ', posi1]);
                        index2 = this.replacements.length;
                        this.pushBuffer(['{' + closure + '}', posi3]);
                        return "\r\n" + '@boundary_' + index + '_as_midword::___boundary_' + this.uid + '_' + index2 + '_as_closure___';

                    default:
                        if (word.indexOf('(') === 0) {
                            // console.log(true, word);
                            this.pushBuffer(['{' + closure + '}', posi3]);
                            return word + '___boundary_' + this.uid + '_' + index + '_as_object___';
                        }
                        // console.log(word, closure);
                        this.pushBuffer(['{' + closure + '}', posi3]);
                        return posi1 + word + "\r\n" + posi3 + '___boundary_' + this.uid + '_' + index + '_as_closure___';
                }
            });
        }
        replaceParentheses(string: string): string {
            string = this.replaceWords(string);
            let left = string.indexOf('(');
            let right = string.indexOf(')');
            let count: number = 0;
            while ((count < this.stringReplaceTimes) && (left >= 0)) {
                count++;
                // console.log(left, right);
                if (left < right) {
                    string = string.replace(replaceExpRegPattern.parentheses, (match, posi, argslike: string) => {
                        // console.log(argslike);
                        argslike = this.replaceOperators(argslike);

                        argslike = this.replaceCalls(argslike);
                        argslike = this.replaceArrowFunctions(argslike);
                        let index = this.replacements.length;
                        this.pushBuffer(['(' + argslike + ')', posi && posi.trim()]);
                        return '___boundary_' + this.uid + '_' + index + '_as_parentheses___';
                    });
                    // console.log(string);
                    // string = this.recheckFnLikes(string);
                    string = this.recheckFnOrCallLikes(string);
                    left = string.indexOf('(');
                    right = string.indexOf(')');
                } else {
                    if (right >= 0) {
                        var index = right;
                    } else {
                        var index = left;
                    }
                    // console.log(string);
                    this.error('Unexpected `' + (right >= 0 ? ')' : '(') + '` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
                }
            }
            if (right >= 0) {
                var index = right;
                this.error('Unexpected `)` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
            }
            string = this.replaceOperators(string);
            string = this.replaceCalls(string);
            // console.log(string);
            string = this.replaceArrowFunctions(string);
            // console.log(string);
            return string;
        }
        replaceWords(string: string) {
            // console.log(string);
            return string.replace(replaceWords, (match, posi, word, after) => {
                let index = this.replacements.length;
                // console.log(word, after);
                if (word === 'else') {
                    this.pushBuffer([word + ' ', posi && posi.trim()]);
                    return ";\r\n" + '@boundary_' + index + '_as_midword::' + after;
                }
                if (after === ';' || word === 'continue' || word === 'break') {
                    this.pushBuffer([word + ';', posi && posi.trim()]);
                    return ";\r\n" + '@boundary_' + index + '_as_keyword::;';
                }
                this.pushBuffer([word + ' ', posi && posi.trim()]);
                // console.log(word, replaceWords);
                return ";\r\n" + '@boundary_' + index + '_as_preoperator::' + after;
            })
        }
        recheckFnOrCallLikes(string: string): string {
            string = string.replace(replaceExpRegPattern.recheckfn, (match: string, posi, fname: string, parenthesesindex: string, closureindex: string) => {
                let fnlike = posi + fname + this.replacements[parenthesesindex][0].toString() + this.replacements[closureindex][0].toString();
                this.replacements[parenthesesindex] = this.replacements[closureindex] = null;
                let index = this.replacements.length;
                this.pushBuffer([fnlike, posi]);
                return '___boundary_' + this.uid + '_' + index + '_as_function___ ';
            }).replace(replaceExpRegPattern.expression, (match: string, posi, expname, exp: string, expindex: string, closure: string, closureindex: string) => {
                // console.log(match, posi, expname, exp, expindex, closure, closureindex);
                // console.log(expindex, closureindex);
                // on = true;
                let expressioncontent = this.readBuffer(expindex);
                let body = this.readBuffer(closureindex);
                let index = this.replacements.length;
                // console.log(index, match, expname + '(' + expressioncontent + ')' + body);
                // console.log(expressioncontent, body);
                // console.log(index, match);
                this.pushBuffer([expname + expressioncontent + body, posi]);
                // if (expname==='if'){
                //     return '___boundary_' + this.uid + '_' + index + '_as_if___';
                // }
                return '___boundary_' + this.uid + '_' + index + '_as_expression___';
            }).replace(replaceExpRegPattern.if, (match: string, posi, parentheses: string) => {
                // on = true;
                let index = this.replacements.length;
                // console.log(index, match);
                this.pushBuffer(['if ' + parentheses, posi]);
                return '___boundary_' + this.uid + '_' + index + '_as_if___ ';
            });
            return string;
        }
        replaceOperators(string: string): string {
            let on = true;
            while (on) {
                on = false;
                string = string.replace(operators.owords, (match: string, posi, word: string) => {
                    // console.log(match);
                    on = true;
                    let index = this.replacements.length;
                    this.pushBuffer([' ' + word + ' ']);
                    return '@boundary_' + index + '_as_operator::';
                });
            }

            // console.log(string);
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.swords, (match: string, before: string, word: string, right: string) => {
                    // console.log(match, before, word);
                    on = true;
                    let index = this.replacements.length;
                    if (word === 'instanceof') {
                        // console.log(match, before, word)
                        this.pushBuffer([' ' + word + ' ']);
                        before = before.trim()
                        return before + '@boundary_' + index + '_as_operator::' + right;
                    } else {
                        this.pushBuffer([word + ' ']);
                    }
                    return before + '@boundary_' + index + '_as_preoperator::' + right;
                });
            }

            on = true;
            while (on) {
                // console.log(string);
                on = false;
                string = string.replace(operators.mixed, (match: string, left: string, posi: string, op: string, right: string, posir, sign: string) => {
                    // console.log(string);
                    // console.log(match, left, op, right, sign);
                    on = true;
                    if (sign) {
                        let _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '@boundary_' + _index + '_as_preoperator::');
                    }
                    let index = this.replacements.length;
                    this.pushBuffer([' ' + op + '= ', posi]);
                    return left + '@boundary_' + index + '_as_operator::' + right;
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.bool, (match: string, left: string, posi: string, op: string, right: string, posir, sign: string) => {
                    // console.log(match);
                    on = true;
                    if (sign) {
                        let _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '@boundary_' + _index + '_as_preoperator::');
                    }
                    let index = this.replacements.length;
                    this.pushBuffer([' ' + op + ' ', posi]);
                    return left + '@boundary_' + index + '_as_operator::' + right;
                });
            }

            on = true;
            while (on) {
                on = false;
                // console.log(string);
                string = string.replace(operators.op, (match: string, left: string, posi: string, op: string, right: string, posir, sign: string) => {
                    // console.log(match);
                    on = true;
                    if (sign) {
                        let _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '@boundary_' + _index + '_as_preoperator::');
                    }
                    let index = this.replacements.length;
                    this.pushBuffer([' ' + op + ' ', posi]);
                    // console.log(left + '@boundary_' + index + '_as_operator::' + right);
                    return left + '@boundary_' + index + '_as_operator::' + right;
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.sign, (match: string, before: string, sign: string, number: string) => {
                    on = true;
                    // let index = this.replacements.length;
                    // this.pushBuffer(' ' + sign);
                    let index = sign === '+' ? 3 : 4;
                    return before + '@boundary_' + index + '_as_preoperator::' + number;
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.before, (match: string, op: string, number: string) => {
                    on = true;
                    let index = this.replacements.length;
                    this.pushBuffer([op]);
                    return '@boundary_' + index + '_as_preoperator::' + number;
                });
            }

            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.after, (match: string, number: string, posi, op: string) => {
                    on = true;
                    let index = this.replacements.length;
                    this.pushBuffer([op]);
                    return number + (posi||'') + '@boundary_' + index + '_as_aftoperator::';
                });
            }
            return string.replace(operators.error, (match: string, before: string, op: string, after: string) => {
                // console.log(string, match);
                if (after && after.indexOf('>') === 0) {
                    return match;
                }
                this.error('Unexpected `' + op + '` in `' + this.decode(match) + '`');
                return '';
            });
        }
        replaceCalls(string: string): string {
            // console.log(string);
            string = string.replace(replaceExpRegPattern.clog, (match: string, posi, args) => {
                // console.log(match, args);
                let index1 = this.replacements.length;
                this.pushBuffer(['(' + args + ')', undefined]);
                let index2 = this.replacements.length;
                this.pushBuffer(['log___boundary_' + this.uid + '_' + index1 + '_as_parentheses___', undefined]);
                let index3 = this.replacements.length;
                this.pushBuffer(['.___boundary_' + this.uid + '_' + index2 + '_as_callmethod___', posi]);
                return '___boundary_' + this.uid + '_' + index3 + '_as_log___;';
            });
            return this.replaceCallsChain(string.replace(replaceExpRegPattern.call, (match: string, posi, fullname: string, constructor: string, methodname: string, dot, callname, args: string, argindex: string, after: string) => {
                // console.log(fullname);
                if (fullname.match(/^___boundary_[A-Z0-9_]{36}_\d+_as_(if|class|object|closure)___/)) {
                    return match;
                }
                let index = this.replacements.length;
                if (constructor) {
                    // console.log(fullname);
                    this.pushBuffer([fullname + args, posi && posi.trim()]);
                    return '___boundary_' + this.uid + '_' + index + '_as_construct___' + after;
                } else {
                    this.pushBuffer([callname + args, posi && posi.trim()]);
                    if (dot) {
                        return '.___boundary_' + this.uid + '_' + index + '_as_callmethod___' + after;
                    } else if (callname === 'if') {
                        console.log(index);
                        return '___boundary_' + this.uid + '_' + index + '_as_if___ ' + after;
                    }
                    // console.log(after);
                    return '___boundary_' + this.uid + '_' + index + '_as_call___' + after;
                }
            }));
        }
        replaceCallsChain(string: string): string {
            // console.log(string);
            return string.replace(replaceExpRegPattern.callschain, (match: string, posi: string, _index: string) => {
                let index = this.replacements.length;
                match = match.replace(/_as_call___/g, '_as_callmethod___');
                this.pushBuffer([match, posi || this.replacements[_index][1]]);
                return '___boundary_' + this.uid + '_' + index + '_as_callschain___';
            });
        }
        replaceArrowFunctions(string: string): string {
            let arrowcodes = string.match(/(->|=>)/);
            // console.log(arrow);
            if (arrowcodes) {
                if (string.match(replaceExpRegPattern.arrowfn)) {
                    // console.log(string.match(matchExpRegPattern.arrowfn));
                    return string.replace(replaceExpRegPattern.arrowfn, (match: string, args: string, argsindex: string, arrow: string, body: string, end: string) => {
                        // console.log(replaceExpRegPattern.arrowfn, match, args, argsindex, arrow, body, end);
                        // console.log(body);
                        let posi = this.replacements[argsindex][1];
                        // console.log(match);
                        // console.log(body);
                        let matches = body.match(/^(@\d+L\d+P\d+O*\d*:::)?\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_(parentheses|object|closure)___\s*$/);
                        // console.log(matches);
                        if (matches) {
                            let code = this.replacements[matches[2]][0].toString();
                            let posi = this.replacements[matches[2]][1];
                            this.replacements[matches[2]] = null;
                            if (matches[3] === 'parentheses') {
                                body = code.replace(/^\(\s*(.*?)\s*\)$/, (match: string, code: string) => {
                                    let index = this.replacements.length;
                                    this.pushBuffer(['return ', posi]);
                                    return '@boundary_' + index + '_as_preoperator:: ' + code;
                                });
                            } else {
                                // console.log(code);
                                // console.log(code.replace(/(^\{|\}$)/g, ''));
                                body = code.replace(/(^\{|\}$)/g, '');
                                // console.log([args + arrow + body, posi]);
                            }
                        } else {
                            // let index = this.replacements.length;
                            // this.pushBuffer(['return ', void 0]);
                            // body = '@boundary_' + index + '_as_preoperator:: ' + body;
                            // console.log(body);
                            // body = body.replace(/(^\{|\}$)/g, '');
                            let matches = body.match(/^(@\d+L\d+P\d+O*\d*:::)?\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_(parentheses|object|closure)___\s*(@\d+L\d+P\d+O*\d*:::)?$/);
                            // console.log(matches);
                            if (matches) {
                                let code = this.replacements[matches[2]][0].toString();
                                let posi = this.replacements[matches[2]][1];
                                this.replacements[matches[2]] = null;
                                if (matches[3] === 'parentheses') {
                                    body = code.replace(/^\(\s*(.*?)\s*\)$/, (match: string, code: string) => {
                                        let index = this.replacements.length;
                                        this.pushBuffer(['return ', posi]);
                                        return '@boundary_' + index + '_as_preoperator:: ' + code;
                                    });
                                } else {
                                    // console.log(code);
                                    body = code.replace(/(^\{|\}$)/g, '');
                                }
                            } else {
                                let index = this.replacements.length;
                                this.pushBuffer(['return ', void 0]);
                                body = '@boundary_' + index + '_as_preoperator:: ' + body;
                                // console.log(body);
                            }
                        }
                        let index = this.replacements.length;
                        this.pushBuffer([args + arrow + body, posi]);
                        return '___boundary_' + this.uid + '_' + index + '_as_arrowfn___' + end;
                    });
                } else {
                    // console.log(string);
                    this.error('Unexpected `' + arrowcodes[0] + '` in `' + this.decode(string.substr(arrowcodes.index, 256)) + '`');
                }
            }
            arrowcodes = undefined;
            return string;
        }
        getPosition(string: string) {
            if (string) {
                // console.log(string);
                let match = string.match(/@(\d+)L(\d+)P(\d+)(O*)(\d*):{0,3}/);
                if (match) {
                    if (match[4]) {
                        var index = parseInt(match[5]);
                    } else {
                        var index = parseInt(match[3]);
                    }
                    return {
                        match: match[0],
                        head: !index,
                        file: parseInt(match[1]),
                        line: parseInt(match[2]) + 1,
                        col: parseInt(match[3]) + 1,
                        o: [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), index],
                    }
                }
            }
            return void 0;
        }
        getPositionByIndex(index) {
            let posi = this.replacements[index][1];
            this.replacements[index][1] = undefined;
            return this.getPosition(posi);
        }
        pickTretOfMatch(match_as_statement: string[], isblock: boolean = true): any {
            let tret_of_match: string = match_as_statement[3].trim();
            if (
                tret_of_match
                && !(tret_of_match === ';' && ['closure', 'if']['includes'](match_as_statement[2]))
                && !(tret_of_match === ';' && !isblock && ['class', 'function']['includes'](match_as_statement[2]))
            ) {
                return [{
                    index: match_as_statement[1],
                    display: 'inline',
                    type: match_as_statement[2]
                }, tret_of_match];
            }
            return null;
        }
        getLines(string: string, vars: any, inOrder: boolean = false): object[] {
            // console.log(string);
            string = string
                .replace(/:::(var|let|const|public)\s+(@\d+L\d+P(\d+O)?0:::)/g, ':::$1 ')
                .replace(/([^,;\s])\s*(@\d+L\d+P(\d+O)?0:::[^\.\(\[)])/g, '$1;$2')
                .replace(/(___boundary_[A-Z0-9_]{36}_\d+_as_(if)___)[;\s]*/g, "$1 ")
                .replace(/[;\r\n]+(___boundary_[A-Z0-9_]{36}_\d+_as_(expression|if|class|function|extends|call|log|object|objlike|closure|parentheses)___)/g, ";$1")
                .replace(/(___boundary_[A-Z0-9_]{36}_\d+_as_(log|closure|function)___)[;\r\n]+/g, "$1;\r\n")
                .replace(/[;\r\n]+((@\d+L\d+P\d+O?\d*:::)?___boundary_[A-Z0-9_]{36}_\d+_as_(callschain)___)/g, "$1")
                .trim();
            const sentences: string[] = string.split(/\s*;+\s*/);
            let lines: object[] = [];
            // console.log(string, sentences);
            for (let s = 0; s < sentences.length; s++) {
                const sentence = sentences[s].trim();
                // console.log(sentence);
                if (sentence) {
                    const array = sentence.split(/:::(var|let|const|public)\s+/);
                    // console.log(array, sentence);
                    if (array.length === 1) {
                        let definition = sentence.match(/(^|\s+)(var|let|const|public)(\s+|$)/);
                        if (definition) {
                            let definitions = sentence.match(/(@boundary_\d+_as_midword::|(@boundary_\d+_as_midword::\s*)?___boundary_[A-Z0-9_]{36}_\d+_as_(if|closure)___)\s*(var|let|const|public)\s+([\s\S]+)/);
                            // console.log(definitions);
                            if (definitions) {
                                this.pushSentenceToLines(lines, definitions[1], 'inline');
                                this.pushVariablesToLines(lines, vars, undefined, definitions[5], definitions[4], true);
                                continue;
                            }
                            // console.log(sentence);
                            this.error('Unexpected `' + definition[1] + '` in `' + this.decode(sentence) + '`.');
                        } else {
                            // console.log(sentence);
                            this.pushSentenceToLines(lines, sentence, (inOrder && (s===sentences.length-1)) ? 'inline' : 'block');
                        }
                        definition = undefined;
                    } else if (array.length === 3) {
                        this.pushVariablesToLines(lines, vars, array[0], array[2], array[1], inOrder);
                        // console.log(spilitarray, sentences);
                    } else {
                        // console.log(spilitarray[3], spilitarray);
                        var position = this.getPosition(array[2]);
                        this.error('Unexpected `' + array[3] + '` at char ' + position.col + ' on line ' + position.line + '， near ' + this.decode(array[2]) + '.');
                    }
                }
            }
            // console.log(lines);
            return lines;
        }
        pushSentenceToLines(lines: any[], code: string, display: string) {
            value = code.trim();
            if (value && !value.match(/^@\d+L\d+P\d+O?\d*:::$/)) {
                let match_as_statement = value.match(/^(@\d+L\d+P\d+O?\d*:::)?\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_([a-z]+)___([\r\n]+|$)/);
                // console.log(match_as_statement, display);
                if (match_as_statement) {
                    if (display === 'block' && !['class', 'function', 'closure', 'if']['includes'](match_as_statement[3])) {
                        // console.log(match_as_statement[2]);
                        value = value + ';';
                    }
                    // console.log(this.replacements[match_as_statement[2]][1] || match_as_statement[1]);
                    this.replacements[match_as_statement[2]][1] = this.replacements[match_as_statement[2]][1] || match_as_statement[1];
                    lines.push({
                        type: 'line',
                        subtype: match_as_statement[3],
                        // posi: this.replacements[match_as_statement[2]][1] || match_as_statement[1],
                        display: display,
                        index: match_as_statement[2]
                    });
                } else {
                    // console.log(value, display === 'block');
                    if ((display === 'block') && !/_as_closure___$/.test(value)) {
                        value += ';';
                    } else if (/_as_aftoperator::$/.test(value)) {
                        value += ';';
                        display === 'block';
                    }
                    // console.log(value);
                    let clauses = value.split(',');
                    // console.log(clauses);
                    for (let c = 0; c < clauses.length; c++) {
                        let element = clauses[c];
                        let position = this.getPosition(element);
                        // console.log(position, value)
                        if (position) {
                            if (display === 'block') {
                                position.head = true;
                            }
                            var value = element.replace(position.match, '');
                        } else {
                            var value = element.trim();
                            let match_as_mark = value.match(/^@boundary_(\d+)_as_([a-z]+)::/);
                            if (match_as_mark && this.replacements[match_as_mark[1]][1]) {
                                position = this.getPositionByIndex(match_as_mark[1]);
                                if (position && (display === 'block')) {
                                    position.head = true;
                                }
                            }
                        }
                        // if (display === 'block') {
                        //     value = value + ';';
                        // }
                        lines.push({
                            type: 'line',
                            subtype: 'sentence',
                            display: display,
                            posi: position,
                            value: value
                        });
                    }
                }
                match_as_statement = undefined;
            }
        }
        pushVariablesToLines(lines: any, vars: any, posi: string, code: string, symbol: string, inOrder: boolean = false) {
            var display;
            var clauses = code.split(/,\s*(@\d+L\d+P\d+O?\d*:::)*/);
            clauses.unshift(posi);
            // console.log(clauses, symbol);
            for (let c = 0; c < clauses.length; c += 2) {
                if (inOrder) {
                    if (c) {
                        if (c === clauses.length - 2) {
                            display = 'last';
                        } else {
                            display = 'inline';
                        }
                    } else {
                        if (c === clauses.length - 2) {
                            display = 'block';
                        } else {
                            display = 'first';
                        }
                    }
                } else {
                    display = 'block';
                }
                // console.log(display);
                this.pushVariableToLines(lines, vars, clauses[c], clauses[c + 1], symbol, display);
            }
            display = clauses = undefined;
        }
        pushVariableToLines(lines: any, vars: any, posi: string, code: string, symbol: string, display: string = 'block') {
            if (code) {
                var _symbol = 'var';
                switch (display) {
                    case 'first':
                        return this.pushVariableToLine(lines, vars, code, symbol, posi, 'inline', _symbol, ',');

                    case 'last':
                        return this.pushVariableToLine(lines, vars, code, symbol, posi, 'inline', '', ';');

                    case 'block':
                        return this.pushVariableToLine(lines, vars, code, symbol, posi, 'block', _symbol, ';');

                    default:
                        return this.pushVariableToLine(lines, vars, code, symbol, posi, 'inline', '', ',');
                }
                _symbol = undefined;
            }
        }
        pushVariableToLine(lines: any, vars: any, code: string, symbol: string, posi: string = '', display: string = 'inline', _symbol: string = '', endmark: string = ',') {
            if (code) {
                let position = this.getPosition(posi);
                let match = code.match(/^([\$\a-zA-Z_][\$\w]*)@boundary_(\d+)_as_operator::/);
                // console.log(code, match);
                if (match && ['in', 'of']['includes'](this.replacements[match[2]][0].toString().trim())) {
                    let element = match[1];
                    lines.push({
                        type: 'line',
                        subtype: 'sentence',
                        display: 'inline',
                        posi: void 0,
                        value: _symbol + ' ' + code
                    });
                    this.pushVariableToVars(vars, symbol, element, position);
                    element = undefined;
                } else {
                    let array = code.split(/\s*=\s*/);
                    // console.log(array);
                    if (array.length === 1) {
                        var value = 'void 0';
                    } else {
                        var value = array.pop();
                    }
                    // console.log(value, array);
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index].trim();
                        // if (position && display === 'block') position.head = true;
                        if (index) {
                            // console.log(element);
                            lines.push({
                                type: 'line',
                                subtype: 'sentence',
                                posi: position,
                                display: 'inline',
                                value: element + ' = '
                            });
                        } else {
                            let match = element.match(/^___boundary_[A-Z0-9_]{36}_(\d+)_as_(sets|list)___$/);
                            if (match) {
                                // console.log(match);
                                return this.pushVariablesToLine(lines, vars, match, symbol, _symbol, value, position, endmark);
                            } else if (element.match(/^[\$a-zA-Z_][\$\w]*$/)) {
                                // console.log(element);                    
                                this.pushVariableToVars(vars, symbol, element, position);
                                lines.push({
                                    type: 'line',
                                    subtype: 'variable',
                                    display: 'inline',
                                    posi: position,
                                    value: _symbol + ' ' + element + ' = '
                                });
                                // value = element;
                            } else {
                                // console.log(element);
                                if (this.sources[position.file]) {
                                    this.error('Unexpected Definition `' + symbol + '` at char ' + position.col + ' on line ' + position.line + ' in file [' + position.file + '][' + this.sources[position.file].src + '].');
                                } else {
                                    // console.log(element);
                                    this.error('Unexpected Definition `' + symbol + '` at char ' + position.col + ' on line ' + position.line + '.');
                                }
                            }
                            match = undefined;
                        }
                        // console.log('foo');
                        if (index === array.length - 1) {
                            lines.push({
                                type: 'line',
                                subtype: 'sentence',
                                display: 'inline',
                                posi: void 0,
                                value: value + endmark
                            });
                        }
                    }
                    array = value = undefined;
                }
                position = match = undefined;
            }
        }
        pushVariablesToLine(lines: any, vars: any, match, symbol, _symbol: string = '', value, position, endmark: string = ','){
            let type, elements = [];
            if (match[2] === 'sets') {
                let closure = this.readBuffer(match[1]).replace(/(\{|\})/g, '');
                if (/\.+/.test(closure)) {
                    type = '...';
                } else {
                    type = 'object';
                }
                elements = closure.split(',');
                closure = undefined;
            } else {
                type = 'array';
                elements = this.readBuffer(match[1]).replace(/(\[|\])/g, '').split(',');
            }
            value = this.pushVariableValueToLine(lines, vars, type, symbol, _symbol, value, position, endmark);
            // console.log(elements, value);
            for (let i = 0; i < elements.length; i++) {
                let position = this.getPosition(elements[i]);
                let element = elements[i].replace(position.match, '').trim();
                // console.log(element, element.indexOf('.'));
                // console.log(element, position.match);
                if (element.indexOf('.') >= 0) {
                    this.pushSetsToVars(lines, vars, type, i, symbol, _symbol, element, value, position, endmark)
                    break;
                } else {
                    this.pushSetToVars(lines, vars, type, i, elements.length, symbol, _symbol, element, value, position, endmark)
                }
                position = element = undefined;
            }
            type = elements = undefined;
        }
        pushVariableValueToLine(lines, vars, type, symbol, _symbol, value, position, endmark){
            let anonvar;
            if (value.match(/^[\$a-zA-Z_][\$\w]*(\s*\.\s*[\$a-zA-Z_][\$\w]*)*$/) && !value.match(/___boundary_[A-Z0-9_]{36}_(\d+)_as_[a-z]+___/)) {
                if (type === '...') {
                    this.anonymous_variables++;
                    anonvar = '_ανώνυμος_variable_' + this.anonymous_variables;
                    while (hasProp(vars.self, anonvar)) {
                        this.anonymous_variables++;
                        anonvar = '_ανώνυμος_variable_' + this.anonymous_variables;
                    }
                    lines.push({
                        type: 'line',
                        subtype: 'variable',
                        display: 'block',
                        posi: position,
                        value: _symbol + ' ' + anonvar + ' = pandora.clone(' + value.replace(/\s+/g, '') + ')' + endmark
                    });
                    return anonvar;
                }
                return value.replace(/\s+/g, '');
            } else {
                // console.log(value);
                this.anonymous_variables++;
                anonvar = '_ανώνυμος_variable_' + this.anonymous_variables;
                while (hasProp(vars.self, anonvar)) {
                    this.anonymous_variables++;
                    anonvar = '_ανώνυμος_variable_' + this.anonymous_variables;
                }
                position.head = true;
                this.pushVariableToVars(vars, symbol, anonvar, position);
                lines.push(
                    {
                        type: 'line',
                        subtype: 'variable',
                        display: 'inline',
                        posi: position,
                        value: _symbol + ' ' + anonvar + ' = '
                    },
                    {
                        type: 'line',
                        subtype: 'sentence',
                        display: 'inline',
                        posi: void 0,
                        value: value + endmark
                    });
                return anonvar;
            }
        }
        pushSetToVars(lines, vars, type, index, length, symbol, _symbol, variable, value, position, endmark) {
            let _value, __value;
            if (type === '...') {
                let index = this.replacements.length;
                this.pushBuffer(["'" + variable + "'"]);
                _value = 'pandora.remove(' + value + ', ___boundary_' + this.uid + '_' + index + '_as_string___)';
            } else if (type === 'object') {
                // console.log(value, variable, index, endmark);
                _value = value + '.' + variable;
            } else {
                _value = value + '[' + index + ']';
            }
            this.pushVariableToVars(vars, symbol, variable, position);
            if (index) {
                if (index === length - 1) {
                    __value = ', ' + variable + ' = ' + _value + endmark;
                } else {
                    __value = ', ' + variable + ' = ' + _value;
                }
            } else {
                position.head = true;
                // console.log(_symbol, variable, _value);
                __value = _symbol + ' ' + variable + ' = ' + _value;
                if (length === 1){
                    __value += endmark;
                }
            }
            // console.log(__value);
            _value = undefined;
            lines.push({
                type: 'line',
                subtype: 'variable',
                display: 'inline',
                posi: position,
                value: __value
            });
        }
        pushSetsToVars(lines, vars, type, index, symbol, _symbol, variable, value, position, endmark) {
            let _value, __value;
            variable = variable.replace(/\.+/, '');
            // console.log(variable);
            if (type === '...') {
                if (index) {
                    __value = ', ' + variable + ' = ' + value + endmark;
                } else {
                    position.head = true;
                    __value = _symbol + ' ' + variable + ' = ' + value;
                }
            } else {
                _value = 'pandora.slice(' + value + ', ' + index + ')';
                if (index) {
                    __value = ', ' + variable + ' = ' + _value + endmark;
                } else {
                    position.head = true;
                    __value = _symbol + ' ' + variable + ' = ' + _value;
                }
            }
            // console.log(__value);
            _value = variable = undefined;
            lines.push({
                type: 'line',
                subtype: 'variable',
                display: 'inline',
                posi: position,
                value: __value
            });
        }
        pushVariableToVars(vars, symbol, variable, position){
            if (vars.self[variable] !== void 0) {
                if (vars.self[variable] === 'let' || symbol === 'let') {
                    if (position){
                        this.error(' Variable `' + variable + '` has already been declared at char ' + position.col + ' on line ' + position.line + '.');
                    }
                    this.error(' Variable `' + variable + '` has already been declared.');
                }
                if (vars.self[variable] === 'const' || symbol === 'const') {
                    if (position) {
                        this.error(' Const `' + variable + '` has already been declared at char ' + position.col + ' on line ' + position.line + '.');
                    }
                    this.error(' Const `' + variable + '` has already been declared.');
                }
            }else{
                vars.self[variable] = symbol;
            }
            if (symbol === 'const') {
                vars.scope.const[variable] = variable;
            }
            else if (symbol === 'public' && (vars.scope.namespace !== null)) {
                vars.scope.public[variable] = variable;
            }
        }
        pickReplacePosis(lines: any[], vars: any): object[] {
            let imports: any[] = [],
                using_as: any = {},
                preast: object[] = [];

            for (let index = 0; index < lines.length; index++) {
                // console.log(lines[index]);
                switch (lines[index].subtype) {
                    case 'sentence':
                        // console.log(lines[index]);
                        const code = lines[index].value.trim();
                        this.pushSentencesToPREAST(preast, vars, code, lines[index].display, lines[index].posi);
                        break;

                    case 'variable':
                    // case 'assignment':
                        preast.push([{
                            type: 'code',
                            posi: lines[index].posi,
                            display: lines[index].display,
                            vars: vars,
                            value: lines[index].value
                        }]);
                        break;
                    case 'using':
                    case 'usings':
                        // console.log(lines[index]);.return
                        let posi = this.replacements[lines[index].index][2];
                        let mens = this.replacements[lines[index].index][1];
                        let src = this.replacements[lines[index].index][0].toString().trim();
                        this.replacements[lines[index].index] = null;
                        // let alias = .trim();

                        if (!imports['includes'](src)) {
                            imports.push(src);
                            imports.push(posi);
                        }
                        if (mens) {
                            let position;
                            let alias;
                            if (lines[index].subtype === 'usings') {
                                let members = mens.split(',');
                                for (let m = 0; m < members.length; m++) {
                                    position = this.getPosition(members[m]);
                                    alias = members[m].replace(position.match, '').trim();
                                    using_as[alias] = [src, alias, position];
                                }
                            } else {
                                position = this.getPosition(mens);
                                alias = mens.replace(position.match, '').trim();
                                // console.log(alias);
                                using_as[alias] = [src, '*', position];
                            }
                            if (vars.self[alias] === void 0) {
                                vars.self[alias] = 'var';
                            } else if (vars.self[alias] === 'let') {
                                if (position){
                                    this.error(' Variable `' + alias + '` has already been declared at char ' + position.col + ' on line ' + position.line + '.');
                                }
                                this.error(' Variable `' + alias + '` has already been declared.');
                            }
                        }
                        break;
                    default:
                        preast.push([{
                            index: lines[index].index,
                            // posi: lines[index].posi,
                            display: lines[index].display,
                            type: lines[index].subtype
                        }]);
                        break;
                }
            }
            this.imports = imports;
            this.using_as = using_as;
            // console.log(using_as);
            // console.log(imports, preast);
            imports = using_as = undefined;
            return preast;
        }
        pushSentencesToPREAST(preast: object[] = [], vars: any, code: string, display: string = 'block', lineposi: any): object[] {
            if (code) {
                let inline = [];
                const statements: string[] = code.split('___boundary_' + this.uid);
                while (!statements[0].trim()) {
                    statements.shift();
                }
                // console.log(statements)
                for (let s = 0; s < statements.length; s++) {
                    let statement = statements[s];
                    if (statement.trim()) {
                        let match_as_statement: any = statement.match(matchExpRegPattern.index3);
                        // console.log(match_as_statement);
                        if (match_as_statement) {
                            let array: any[] = this.pickTretOfMatch(match_as_statement, display === 'block');
                            if (array) {
                                inline.push(array[0]);
                                this.pushRowsToAST(inline, vars, array[1], false, undefined);
                            } else {
                                // console.log(lines[index].display);
                                inline.push({
                                    index: match_as_statement[1],
                                    display: (statements.length === 1) ? display : 'inline',
                                    type: match_as_statement[2]
                                });
                            }
                            array = undefined;
                        } else {
                            if ((statements.length === 1) && (display === 'block')) {
                                this.pushRowsToAST(inline, vars, statements[0], true, lineposi);
                            } else {
                                this.pushRowsToAST(inline, vars, statements[0], false, lineposi);
                            }
                        }
                        match_as_statement = undefined;
                    }
                    statement = undefined;
                }
                preast.push(inline);
                inline = undefined;
                return preast;
            }
        }
        buildAST(preast: object[], vars: any): Script {
            // console.log(preast);
            let ast = {
                type: 'codes',
                vars: vars,
                body: []
            };
            for (let index = 0; index < preast.length; index++) {
                let block: any = preast[index];
                if (block.length === 1) {
                    const element = block[0];
                    if (element.type === 'code') {
                        ast.body.push(element);
                    } else {
                        ast.body.push(this.walk(element, vars, false));
                    }
                } else {
                    let codes = {
                        type: 'codes',
                        vars: vars,
                        body: []
                    };
                    for (let b = 0; b < block.length; b++) {
                        const element = block[b];
                        if (element.type === 'code') {
                            codes.body.push(element);
                        } else {
                            codes.body.push(this.walk(element, vars, true));
                        }
                    }
                    ast.body.push(codes);
                }
                block = undefined;
            }
            this.ast = ast;
            ast = undefined;
            return this;
        }
        pushBodyToAST(body: object[] = [], vars: any, code: string, inOrder: boolean = false): object[] {
            let lines: any = code ? this.getLines(code, vars, inOrder) : [];
            // console.log(code, lines);
            for (let index = 0; index < lines.length; index++) {
                switch (lines[index].subtype) {
                    case 'sentence':
                        const code = lines[index].value.trim()
                        // console.log(lines[index].display === 'block', line);
                        // console.log(lines[index]);
                        this.pushSentencesToAST(body, vars, code, !inOrder && (lines[index].display === 'block'), lines[index].posi);
                        break;

                    case 'variable':
                    // case 'assignment':
                        // console.log(lines[index].value);
                        body.push({
                            type: 'code',
                            posi: lines[index].posi,
                            display: inOrder ? 'inline' : lines[index].display,
                            vars: vars,
                            value: lines[index].value
                        });
                        break;
                    default:
                        body.push(this.walk({
                            index: lines[index].index,
                            display: inOrder ? 'inline' : 'block',
                            type: lines[index].subtype
                        }, vars, inOrder));
                        break;
                }
            }
            // console.log(body);
            lines = undefined;
            return body;
        }
        pushSentencesToAST(body: object[] = [], vars: any, code: string, isblock: boolean = true, lineposi: any): object[] {
            if (code) {
                // console.log(isblock, lineposi);
                let inline = [];
                const statements: string[] = code.split('___boundary_' + this.uid);
                while (!statements[0].trim()) {
                    statements.shift();
                }
                // console.log(statements)
                if (statements.length === 1) {
                    this.pushReplacementsToAST(inline, vars, statements[0], isblock, lineposi);
                } else {
                    for (let s = 0; s < statements.length; s++) {
                        this.pushReplacementsToAST(inline, vars, statements[s], false, (s === 0) && lineposi);
                    }
                }
                if (inline.length === 1) {
                    body.push(inline[0]);
                } else {
                    body.push({
                        type: 'codes',
                        vars: vars,
                        body: inline
                    });
                }
                inline = undefined;
            }
            return body;
        }
        pushReplacementsToAST(body: object[], vars: any, code: string, isblock: boolean, lineposi: any): object[] {
            // console.log(code);
            // code = code.trim();
            if (code.trim()) {
                let match_as_statement: any = code.match(matchExpRegPattern.index3);
                // console.log(match_as_statement);
                // console.log(code, match_as_statement, isblock, lineposi);
                if (match_as_statement) {
                    let array: any[] = this.pickTretOfMatch(match_as_statement, isblock);
                    if (array) {
                        body.push(this.walk(array[0], vars, true));
                        this.pushRowsToAST(body, vars, array[1], false, undefined);
                    } else {
                        body.push(this.walk({
                            index: match_as_statement[1],
                            display: isblock ? 'block' : 'inline',
                            type: match_as_statement[2]
                        }, vars, true));
                    }
                    array = undefined;
                } else {
                    this.pushRowsToAST(body, vars, code, isblock, lineposi);
                }
                match_as_statement = undefined;
            }
            return body;
        }
        pushRowsToAST(body: object[], vars: any, code: string, isblock: boolean, lineposi: any): object[] {
            var rows = code.split(/[\r\n]+/);
            // console.log(array);
            for (let r = 0; r < rows.length; r++) {
                const row = rows[r];
                if (row.trim()) {
                    this.pushCodeToAST(body, vars, row, isblock, (r === 0) && lineposi);
                }
            }
            rows = undefined;
            return body;
        }
        pushCodeToAST(body: object[], vars: any, code: string, isblock: boolean, lineposi: any): object[] {
            let display = isblock ? 'block' : 'inline';
            let position = this.getPosition(code) || lineposi;
            if (position) {
                var element = code.replace(position.match, '');
            } else {
                var element = code;
            }
            // console.log(element, position);
            if (element) {
                body.push({
                    type: 'code',
                    posi: position,
                    vars: vars,
                    display: display,
                    value: element
                });
            }
            display = position = element = undefined;
            return body;
        }
        walk(element: any, vars: any = false, inOrder: boolean): object {
            // console.log(element);
            switch (element.type) {
                case 'arraylike':
                case 'list':
                    return this.walkArray(element.index, element.display, vars);
                case 'arrowfn':
                    return this.walkArrowFn(element.index, element.display, vars);
                case 'if':
                // console.log(element);
                case 'call':
                case 'callmethod':
                case 'construct':
                    return this.walkCall(element.index, element.display, vars, element.type);
                case 'log':
                case 'callschain':
                    return this.walkCallsChain(element.index, element.display, vars, element.type);
                case 'class':
                    return this.walkClass(element.index, element.display, vars);
                case 'objlike':
                    if (inOrder) {
                        // console.log(true, element);
                        element.type = 'object';
                        return this.walkObject(element.index, element.display, vars);
                    }
                case 'closure':
                    return this.walkClosure(element.index, element.display, vars);
                case 'expression':
                    return this.walkFnLike(element.index, element.display, vars, 'exp');
                case 'extends':
                    return this.walkExtends(element.index, element.display, vars);
                case 'function':
                    // console.log(element.index, element.display, vars, 'def');
                    return this.walkFnLike(element.index, element.display, vars, 'def');
                case 'object':
                case 'sets':
                    return this.walkObject(element.index, element.display, vars);
                case 'parentheses':
                    return this.walkParentheses(element.index, element.display, vars);
                case 'pattern':
                case 'string':
                case 'template':
                    let that = this;
                    let position = this.getPositionByIndex(element.index);
                    // console.log(position);
                    return {
                        type: 'code',
                        posi: position,
                        display: element.display || 'inline',
                        vars: vars,
                        value: '___boundary_' + this.uid + '_' + element.index + '_as_string___'
                    }
                default:
                    return {
                        type: 'code',
                        posi: void 0,
                        display: 'hidden',
                        vars: vars,
                        value: ""
                    }
            }
        }
        walkArray(index: number, display: any, vars: any): object {
            let body: any = [],
                elems: any = [],
                position = this.getPositionByIndex(index),
                clauses = this.readBuffer(index).replace(/([\[\s\]])/g, '').split(',');
            // console.log(this.replacements[index], clauses);
            for (let c = 0; c < clauses.length; c++) {
                let posi;
                if (c) {
                    posi = this.getPosition(clauses[c]);
                } else {
                    posi = this.getPosition(clauses[c]) || position;
                }
                let value = clauses[c].replace(posi, '');
                let match = value.match(/\.\.\.(\w+)/);
                if (match){
                    // console.log(match[1]);
                    if (elems.length){
                        body.push({
                            type: "arrEls",
                            posi,
                            vars,
                            elems: elems
                        });
                    }
                    body.push({
                        type: "arrVar", 
                        posi, 
                        vars,
                        aname: match[1]
                    });
                    elems = [];
                } else {
                    this.pushSentencesToAST(elems, vars, clauses[c], false, posi);
                    if (c === clauses.length-1){
                        body.push({
                            type: "arrEls",
                            posi,
                            vars,
                            elems: elems
                        });
                    }
                }
            }
            // console.log(body);
            return {
                type: 'arraylike',
                posi: position,
                display: display,
                vars: vars,
                body: body
            };
        }
        walkArrowFn(index: number, display: any, vars: any) {
            let matches: any = this.readBuffer(index).match(matchExpRegPattern.arrowfn);
            // console.log(replaceExpRegPattern.arrowfn);
            // console.log(matchExpRegPattern.arrowfn);
            
            // console.log(this.readBuffer(index), matches);
            let subtype = 'fn';
            let selfvas = {};
            if (matches[3] === '=>') {
                subtype = '=>';
                vars.hasHalfFunScope = true;
                vars.locals['this'] = null;
                vars.locals['arguments'] = null;
                var locals: any = vars.locals;
                var varstype = 'arrowfn';
            } else {
                var locals: any = {};
                var varstype = 'scope';
            }
            let localvars: any = {
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
                // 是否含有箭头函数和遍历语句
                hasHalfFunScope: false,
                // 子域变量
                locals: locals,
                // 类型：ES5标准函数作用域/箭头函数作用域
                type: varstype
            };
            localvars.self = localvars.scope.protected;
            // localvars.fix_map = localvars.scope.fix_map;
            let args: any = this.checkArgs(this.readBuffer(matches[2]).replace(/(^\(|\)$)/g, ''), localvars);
            // console.log(matches);
            return {
                type: 'def',
                posi: this.getPositionByIndex(index),
                display: 'inline',
                vars: localvars,
                subtype: subtype,
                args: args.keys,
                defaults: args.vals,
                body: this.checkFnBody(localvars, args, matches[4])
            }
        }
        walkCall(index: number, display: any, vars: any, type: string): object {
            // console.log(this.replacements[index]);
            let name = [],
                args = [],
                matches: any = this.readBuffer(index).match(matchExpRegPattern.call),
                position = this.getPositionByIndex(index),
                nameArr: string[] = matches[1].split('___boundary_' + this.uid),
                paramArr = this.readBuffer(matches[2]).split(/([\(,\)])/);
            // console.log(this.replacements[index], matches);
            for (let n = 0; n < nameArr.length; n++) {
                const element = nameArr[n];
                if (element) {
                    if (type === 'construct') {
                        // console.log(name, nameArr);
                        this.pushReplacementsToAST(name, vars, element, false, undefined);
                    } else {
                        this.pushReplacementsToAST(name, vars, element, false, (n === 0) && position);
                    }
                }
            }
            // console.log(matches, paramArr);
            for (let p = 0; p < paramArr.length; p++) {
                const paramPosi = this.getPosition(paramArr[p]);
                if (paramPosi) {
                    var param = paramArr[p].replace(paramPosi.match, '').trim();
                } else {
                    var param = paramArr[p].trim();
                }
                // console.log(paramPosi);
                if (param && param != '(' && param != ')' && param != ',') {
                    // console.log(p, param, paramPosi);
                    let statements: string[] = param.split('___boundary_' + this.uid);
                    let inline: any[] = [];
                    for (let s = 0; s < statements.length; s++) {
                        this.pushReplacementsToAST(inline, vars, statements[s], false, (s === 0) && paramPosi);
                    }
                    // console.log(inline);
                    if (inline.length) {
                        args.push({
                            type: 'parameter',
                            posi: inline[0].posi || paramPosi,
                            display: 'inline',
                            vars: vars,
                            body: inline
                        });
                    } else {
                        args.push({
                            type: 'parameter',
                            posi: paramPosi,
                            display: 'inline',
                            vars: vars,
                            body: [{
                                type: 'code',
                                posi: paramPosi,
                                display: 'inline',
                                vars: vars,
                                value: 'void 0'
                            }]
                        });
                    }
                }
            }
            if (type === 'callmethod') {
                if (position) position.head = false;
                display = 'inline';
            }
            // console.log(this.replacements[index]);
            matches = nameArr = paramArr = undefined;
            return {
                type: type,
                posi: position,
                display: display,
                name: name,
                vars: vars,
                args: args
            };
        }
        walkCallsChain(index: number, display: any, vars: any, type: string): object {
            let code = this.readBuffer(index),
                position = this.getPositionByIndex(index),
                calls = [];

            code.replace(/(@\d+L\d+P\d+O*\d*:::)?\.___boundary_[A-Z0-9_]{36}_(\d+)_as_callmethod___/g, (match, posi, _index) => {
                // console.log(match, posi, _index);
                if (posi) {
                    this.replacements[_index][1] = posi;
                }
                calls.push(this.walkCall(_index, 'inline', vars, 'callmethod'));
                return '';
            });
            // console.log(code, calls, position);
            if (type === 'log' && position) {
                position.head = true;
            }

            code = undefined;
            return {
                type: type,
                posi: position,
                display: (position && position.head) ? 'blocks' : 'inline',
                vars: vars,
                calls: calls
            };
        }
        walkClass(index: number, display: any, vars: any = true) {
            // console.log(this.replacements[index]);
            let matches: any = this.readBuffer(index).match(matchExpRegPattern.class);
            // console.log(matches);
            let type = matches[1];
            let namespace = vars.scope.namespace || this.namespace;
            let cname = matches[3];
            let subtype = 'stdClass';
            if (matches[2]) {
                if (matches[2].length !== 2) {
                    cname = namespace + cname;
                }
            } else {
                if (type === 'dec') {
                    if (cname) {
                        if (this.isNativeCode) {
                            this.error('Native Code Not Support Standard Class Expression');
                        }
                        cname = namespace + cname;
                    } else if (namespace) {
                        if (this.isNativeCode) {
                            this.error('Native Code Not Support Standard Class Expression');
                        }
                        cname = namespace.replace(/\.$/, '');
                    } else {
                        subtype = 'anonClass'; 
                    }
                }
                else {
                    subtype = 'anonClass';
                }
            }
            let basename = matches[6];
            let position = this.getPositionByIndex(index);
            if (type === 'class') {
                this.useDeclare = true;
                if ((subtype === 'anonClass') && cname && cname.match(namingExpr)){
                    this.pushVariableToVars(vars, 'var', cname, position);
                }
                if (matches[5]) {
                    if (matches[5].length === 2) {
                        basename = 'pandora.' + basename;
                    } else {
                        basename = 'pandora.' + namespace + basename;
                    }
                }
            }else{
                this.useExtends = true;
                if (matches[4] ==='ignore') {
                    basename = true;
                }else{
                    basename = false;
                }
            }

            namespace = undefined;
            return {
                type: type,
                posi: position,
                display: display,
                subtype: subtype,
                cname: cname,
                base: basename,
                vars: vars,
                body: this.checkClassBody(vars, matches[7] || '')
            };
        }
        walkClosure(index: number, display: any, vars: any) {
            // console.log(this.replacements[index]);
            let localvars = {
                // 父级作用域
                parent: vars,
                // ES5实际作用域
                scope: vars.scope,
                // 是否含有箭头函数和遍历语句
                hasHalfFunScope: false,
                // 当前作用域本级变量
                self: {},
                // 子域变量
                locals: vars.locals,
                // fixed: [],
                // 当前作用域本级变量校正量映射
                fix_map: {},
                // 类型：局部
                type: 'local'
            };
            let array = this.readBuffer(index).split(/\s*(\{|\})\s*/);
            let position = this.getPositionByIndex(index);
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
        walkExtends(index: number, display: any, vars: any) {
            // console.log(this.replacements[index]);
            let matches: any = this.readBuffer(index).match(matchExpRegPattern.extends);
            let position = this.getPositionByIndex(index);
            let subtype: string = 'ext';
            let objname: string = matches[2];
            let localvars: any = vars;
            let namespace: string;
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
                        fixed: ['this', 'arguments'],
                        // 局域变量校正量映射
                        fix_map: {}
                    },
                    // 是否含有箭头函数和遍历语句
                    hasHalfFunScope: false,
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
        walkFnLike(index: number, display: any, vars: any, type: string) {
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
            let matches: any = this.readBuffer(index).match(matchExpRegPattern.fnlike);
            // console.log(matches);
            let subtype = matches[2] || 'function';
            let fname = matches[3] !== 'function' ? matches[3] : '';
            if ((type === 'def' && subtype === 'function')|| type === 'exp') {
                if (reservedFname['includes'](fname)) {
                    const headline = matches[4];
                    let localvars = {
                        // 父级作用域
                        parent: vars,
                        // ES5实际作用域
                        scope: vars.scope,
                        // 是否含有箭头函数和遍历语句
                        hasHalfFunScope: false,
                        // 当前作用域本级变量
                        self: {},
                        // 子域变量
                        locals: vars.locals,
                        // 当前作用域本级变量校正量映射
                        fix_map: {},
                        // 类型：局部
                        type: 'local'
                    };
                    if (fname === 'for') {
                        var head: any = {
                            type: 'codes',
                            vars: localvars,
                            display: 'inline',
                            body: []
                        };
                        var lines: any[] = this.pushBodyToAST([], localvars, headline, true);
                        var semicolons = push(0, lines);
                        // console.log(semicolons, lines);
                    } else {
                        var head: any = this.pushSentencesToAST([], vars, headline, false, this.getPosition(headline))[0] || (() => {
                            this.error(' Must have statements in head of ' + fname + ' expreesion.');
                        })();
                        // console.log(localvars, head);
                    }

                    let body = this.pushBodyToAST([], localvars, matches[5]);
                    this.resetVarsRoot(localvars);
                    // console.log(body);
                    return {
                        type: 'exp',
                        posi: this.getPositionByIndex(index),
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
                        let self = {}, agrs: any[] = [];
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
                        vars.hasHalfFunScope = true;
                        vars.locals['arguments'] = null;
                        let localvars: any = {
                            // 父级作用域
                            parent: vars,
                            // ES5实际作用域
                            scope: {
                            // 局域命名空间
                                namespace: null,
                                // 局域变量
                                public: {},
                                // 局域常量
                                const: {},
                                // 局域私有变量
                                private: {},
                                // 子域受保护变量
                                protected: self,
                                // 局域变量校正
                                fixed: [],
                                // 局域变量校正量映射
                                fix_map: {},
                                // 遍历是否可跳出
                                break: false
                            },
                            // 是否含有箭头函数和遍历语句
                            hasHalfFunScope: false,
                            // 子域变量
                            locals: vars.locals,
                            // 类型：遍历
                            type: 'travel'
                        };
                        // 当前作用域本级变量
                        localvars.self = localvars.scope.protected;
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
                            posi: this.getPositionByIndex(index),
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
            let position = this.getPositionByIndex(index);
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
            

            let localvars: any = {
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
                    fixed: ['this', 'arguments'],
                    // 局域变量校正量映射
                    fix_map: {}
                },
                // 是否含有箭头函数和遍历语句
                hasHalfFunScope: false,
                // 子域变量
                locals: {},
                // 类型：ES5标准函数作用域
                type: 'scope'
            };
            // 当前作用域本级变量
            localvars.self = localvars.scope.protected;
            let args: any = this.checkArgs(matches[4], localvars);
            tem = undefined;
            return {
                type: type,
                vars: localvars,
                posi: this.getPositionByIndex(index),
                display: display,
                subtype: subtype,
                fname: fname,
                args: args.keys,
                defaults: args.vals,
                body: this.checkFnBody(localvars, args, matches[5])
            }
        }
        walkParentheses(index: number, display: undefined, vars: any): object {
            let body = [],
                clauses = this.readBuffer(index).replace(/([\[\s\]])/g, '').split(/\s*(,)/),
                position = this.getPositionByIndex(index);
            for (let c = 0; c < clauses.length; c++) {
                if (c) {
                    var posi = this.getPosition(clauses[c]);
                } else {
                    var posi = this.getPosition(clauses[c]) || position;
                }
                this.pushSentencesToAST(body, vars, clauses[c], false, posi);
            }
            // console.log(body);
            if (body.length === 1) {
                return body[0];
            }
            return {
                type: 'codes',
                display: 'inline',
                vars: vars,
                body: body
            };
        }
        walkObject(index: number, display: any, vars: any = true) {
            return {
                type: 'object',
                display: display || 'inline',
                posi: this.getPositionByIndex(index),
                vars: vars,
                body: this.checkObjMember(vars, this.readBuffer(index))
            };
        }
        checkProp(vars: any, posi, type: string, attr: string[], array: string[]): object {
            // console.log(posi);
            // console.log(type, posi, attr, array);
            let position = this.getPosition(posi);
            // position.head = false;
            // console.log(position);
            if (array.length > 1) {
                let body = [];
                if (attr[6]) {
                    body.push({
                        type: 'code',
                        posi: void 0,
                        display: 'inline',
                        vars: vars,
                        value: attr[6].trim()
                    });
                }
                for (let index = 1; index < array.length; index++) {
                    const element = array[index];
                    const match_as_statement: any = element.trim().match(matchExpRegPattern.index3);
                    // console.log(matches);
                    if (match_as_statement) {
                        body.push(this.walk({
                            index: match_as_statement[1],
                            type: match_as_statement[2]
                        }, vars, true));
                        if (match_as_statement[3]) {
                            body.push({
                                type: 'code',
                                posi: void 0,
                                display: 'inline',
                                vars: vars,
                                value: match_as_statement[3].trim()
                            });
                        }
                    } else {
                        // console.log(element);
                        body.push({
                            type: 'code',
                            posi: void 0,
                            display: 'inline',
                            vars: vars,
                            value: element.trim()
                        });
                    }
                }
                return {
                    type: type,
                    posi: position,
                    display: 'inline',
                    pname: attr[4].trim() || 'myAttribute',
                    vars: vars,
                    body: body
                };
            }
            return {
                type: type,
                posi: position,
                display: 'inline',
                pname: attr[4].trim() || 'myAttribute',
                vars: vars,
                body: [
                    {
                        type: 'code',
                        posi: void 0,
                        display: 'inline',
                        vars: vars,
                        value: attr[6].trim()
                    }
                ]
            };
        }
        checkClassBody(vars: any, code: string): object[] {
            // console.log(code);
            let body = [],
                array = code.replace('_as_function___', '_as_function___;').split(/[;,\r\n]+/);
            // console.log(code);
            for (let index = 0; index < array.length; index++) {
                let element = array[index].trim();
                let type: string = 'method';
                // console.log(element);
                if (element) {
                    let elArr = element.split('___boundary_' + this.uid);
                    // console.log(elArr);
                    if (elArr[0] && elArr[0].trim()) {
                        let match_0 = elArr[0].match(matchExpRegPattern.classelement);
                        // console.log(match_0[4].trim(), match_0, elArr);
                        if (match_0) {
                            if (match_0[4].trim()) {
                                switch (match_0[3]) {
                                    case undefined:
                                    case 'public':
                                        type = 'prop';
                                        break;
                                    case 'static':
                                        type = 'staticProp';
                                        break;
                                    default:
                                        this.error('Cannot use `' + match_0[3] + '` on property `' + match_0[4] + '`');
                                }
                                if (match_0[5] != '=') {
                                    if ((elArr.length === 1)) {
                                        match_0[6] = 'undefined';
                                    } else {
                                        continue;
                                    }
                                }
                                body.push(this.checkProp(vars, match_0[1], type, match_0, elArr));
                                continue;
                            }
                            switch (match_0[3]) {
                                case 'om':
                                    type = 'overrideMethod';
                                    break;
                                case 'get':
                                    type = 'getPropMethod';
                                    break;
                                case 'set':
                                    type = 'setPropMethod';
                                    break;
                                case 'static':
                                    // console.log(match_0[5], elArr);
                                    if (match_0[5] === '=') {
                                        match_0[4] = 'static';
                                        if ((elArr.length === 1)) {
                                            match_0[6] = 'undefined';
                                        }
                                        body.push(this.checkProp(vars, match_0[1], 'prop', match_0, elArr));
                                        continue;
                                    }
                                    type = 'staticMethod';
                                    break;
                            }
                        }
                        match_0 = undefined;
                    }
                    if (elArr[1] && elArr[1].trim()) {
                        let match_1: any = elArr[1].trim().match(matchExpRegPattern.index);
                        if (match_1[2] === 'function') {
                            body.push(this.walkFnLike(parseInt(match_1[1]), 'inline', vars, type));
                        }
                    }
                    elArr = undefined;
                }
                element = type = undefined;
            }
            array = undefined;
            return body;
        }
        checkObjMember(vars: any, code: string): object[] {
            let that = this, body:any = [],
                bodyIndex = -1,
                lastIndex: number = 0,
                array = code.split(/\s*[\{,\}]\s*/);
            // console.log(code, array);
            for (let index = 0; index < array.length; index++) {
                let element = array[index].trim();
                if (element) {
                    var elArr = element.split('___boundary_' + this.uid);
                    if (elArr[0] && elArr[0].trim()) {
                        var match_0 = elArr[0].match(matchExpRegPattern.objectattr);
                        if (match_0) {
                            if (match_0[5] != ':') {
                                if ((elArr.length === 1)) {
                                    match_0[6] = match_0[4];
                                }
                                else {
                                    // console.log(elArr);
                                    continue;
                                }
                            }
                            // console.log(elArr);
                            body.push(this.checkProp(vars, match_0[1], 'objProp', match_0, elArr));
                            bodyIndex++;
                            continue;
                        } else {
                            body.useExplode = true;
                            let posi = this.getPosition(elArr[0]);
                            // console.log(elArr);
                            body.push({
                                type: 'object',
                                posi: this.getPosition(elArr[0]),
                                oname: elArr[0].replace((posi.match || '') + '...', ''),
                                vars: vars
                            });
                        }
                    } else {
                        // console.log(elArr);
                        for (let i = 1; i < elArr.length; i++) {
                            const match_as_statement = elArr[i].trim().match(matchExpRegPattern.index3);
                            switch (match_as_statement[2]) {
                                case 'string':
                                case 'pattern':
                                case 'tamplate':
                                    // console.log(match_as_statement);
                                    // console.log(body, bodyIndex);
                                    body[bodyIndex].body.push({
                                        type: 'code',
                                        posi: void 0,
                                        display: 'inline',
                                        vars: vars,
                                        // value: ',' + this.readBuffer(parseInt(match_as_statement[1])).replace(this.markPattern, function () {
                                        //     return that.readBuffer(arguments[1]);
                                        // })
                                        value: ',' + match_as_statement[0]
                                    });
                                    if (match_as_statement[3]) {
                                        body[bodyIndex].body.push({
                                            type: 'code',
                                            posi: void 0,
                                            display: 'inline',
                                            vars: vars,
                                            value: match_as_statement[3]
                                        });
                                    }
                                    break;

                                case 'function':
                                    if (elArr.length === 2) {
                                        body.push(this.walkFnLike(parseInt(match_as_statement[1]), 'inline', vars, 'method'));
                                        bodyIndex++;
                                    }
                                    break;
                            }
                        }
                    }
                }
                element = elArr = undefined;
            }
            that = bodyIndex = lastIndex = array = undefined;
            return body;
        }
        checkArgs(code: string, localvars): object {
            let args = code.split(/\s*,\s*/),
                keys = [],
                keysArray = void 0,
                vals = [];
            // console.log(code, args);
            for (let index = 0; index < args.length; index++) {
                let arg = args[index];
                if (arg) {
                    let array = arg.split(/\s*=\s*/);
                    let position = this.getPosition(array[0]);
                    if (position) {
                        var varname = array[0].replace(position.match, '');
                    } else {
                        var varname = array[0];
                    }
                    // console.log(arg, array, position, varname);
                    if (varname.match(namingExpr)) {
                        keys.push([varname, position]);
                        vals.push(array[1]);
                        localvars.self[varname] = 'var';
                    } else if (varname.match(argsExpr)) {
                        keysArray = [varname, position];
                        localvars.self[varname] = 'var';
                        break;
                    }
                    array = position = varname = undefined;
                }
            }
            args = undefined;
            return {
                keys: keys,
                keysArray: keysArray,
                vals: vals
            }
        }
        checkFnBody(vars: any, args: any, code: string): object[] {
            code = code.trim()
            // console.log(code);
            let body = [];
            // console.log(args, lines);
            for (let index = 0; index < args.vals.length; index++) {
                if (args.vals[index] !== undefined) {
                    let valArr = args.vals[index].split('___boundary_' + this.uid);
                    if (valArr[1]) {
                        body.push({
                            type: 'code',
                            posi: args.keys[index][1],
                            display: 'block',
                            value: 'if (' + args.keys[index][0] + '@boundary_5_as_operator::void 0) { ' + args.keys[index][0] + ' = ' + valArr[0]
                        });
                        this.pushReplacementsToAST(body, vars, valArr[1], false, this.getPosition(args.vals[index]));
                        body.push({
                            type: 'code',
                            posi: void 0,
                            display: 'inline',
                            value: '; }'
                        });
                    } else {
                        body.push({
                            type: 'code',
                            posi: args.keys[index][1],
                            display: 'block',
                            value: 'if (' + args.keys[index][0] + '@boundary_5_as_operator::void 0) { ' + args.keys[index][0] + ' = ' + valArr[0] + '; }'
                        });
                    }
                    valArr = undefined;
                }
            }

            if (args.keysArray) {
                body.push({
                    type: 'code',
                    posi: args.keysArray[1],
                    display: 'block',
                    value: 'var ' + args.keysArray[0].replace('...', '') + ' = Array.prototype.slice.call(arguments, ' + args.keys.length + ');'
                });
            }

            this.pushBodyToAST(body, vars, code);
            // console.log(code, body);
            return body;
        }
        generate(): Script {
            // console.log(this.replacements);
            // console.log(this.ast.body);
            let ast = this.ast;
            this.ast = {};

            let head: string[] = [];
            let neck: string[] = [];
            let body: string[] = [];
            let foot: string[] = [];

            this.consoleDateTime('FIX VARS:');
            this.fixVariables(ast.vars);
            this.consoleDateTime('PUSH BODY:');
            this.pushCodes(body, ast.vars, ast.body, 1, this.namespace);

            this.consoleDateTime('PUSH HEAD:');
            if (this.isNativeCode) {
                this.pushNativeHeader(head);
                this.useDeclare && this.pushDeclare(neck);
                if (this.useDeclare) {
                    this.pushEach(neck);
                    this.pushExtends(neck);
                    this.pushDeclare(neck);
                }
                else if (this.useExtends) {
                    this.pushEach(neck);
                    this.pushExtends(neck);
                }
                else if (this.useEach){
                    this.pushEach(neck);
                }
                this.useLoop && this.pushLoop(neck);
            } else {
                let imports = this.imports;
                let alias = this.using_as;
                this.imports = [];
                this.using_as = {};
                this.pushBlockHeader(head, imports);
                this.pushAlias(neck, ast.vars, alias);
                imports = undefined;
                alias = undefined;
            }
            
            this.consoleDateTime('PUSH FOOT:');
            this.pushFooter(foot, ast.vars);
            ast = undefined;

            this.consoleDateTime('JOIN PRE OPT:');
            let preoutput = head.join('') + neck.join('') + this.restoreStrings(this.trim(body.join(''))) + foot.join('');
            head = neck = body = foot = undefined;

            this.consoleDateTime('PICK MAP:');
            this.output = this.pickUpMap(preoutput);
            preoutput = undefined;
            // console.log(this.output);
            return this;
        }
        pushPostionsToMap(position, codes: string[] | undefined = undefined) {
            if (position && (typeof position === 'object')) {
                let index = this.posimap.length;
                this.posimap.push(position);
                let replace = '/* @posi' + index + ' */';
                index = undefined;
                if (codes) {
                    codes.push(replace);
                }
                return replace;
            }
            return '';
        }
        pushNativeHeader(codes: string[]): string[] {
            codes.push('/*!');
            codes.push("\r\n" + ' * tanguage script compiled code');
            codes.push("\r\n" + ' *');
            codes.push("\r\n" + ' * Datetime: ' + (new Date()).toUTCString());
            codes.push("\r\n" + ' */');
            codes.push("\r\n" + ';');
            codes.push("\r\nvoid\r\n");

            codes.push('\r\nfunction(root, factory) {');
            codes.push('\r\n    if (typeof exports === \'object\') {');
            codes.push('\r\n        root.console = console;');
            codes.push('\r\n        exports = factory(root);');
            codes.push('\r\n        if (typeof module === \'object\') {');
            codes.push('\r\n            module.exports = exports;');
            codes.push('\r\n        }');
            codes.push('\r\n    }');
            codes.push('\r\n    else if (typeof root.define === \'function\' && root.define.amd) {');
            codes.push('\r\n        root.define(function () {');
            codes.push('\r\n            return factory(root);');
            codes.push('\r\n        });');
            codes.push('\r\n    }');
            codes.push('\r\n    else if (typeof root.tang === \'object\' && typeof root.tang.init === \'function\') {');
            codes.push('\r\n        root.tang.init();');
            codes.push('\r\n        root.tang.module.exports = factory(root);');
            codes.push('\r\n    }');
            codes.push('\r\n    else {');
            codes.push('\r\n        factory(root)');
            codes.push('\r\n    }');
            codes.push('\r\n}(typeof window === \'undefined\' ? global : window, function(root, undefined) {');
            codes.push('\r\n    var pandora = {};');
            return codes;
        }
        pushDeclare(codes: string[]): string[] {
            codes.push('\r\n    pandora.declareClass = (function () {');
            codes.push('\r\n        var blockClass = {');
            codes.push('\r\n            _public: {},');
            codes.push('\r\n            _init: function () {}');
            codes.push('\r\n        };');
            codes.push('\r\n        function prepareClassMembers (target, data, start) {');
            codes.push('\r\n            for (start;start < data.length;start++) {');
            codes.push('\r\n                if (data[start]&& typeof data[start] === \'object\') {');
            codes.push('\r\n                    pandora.extend(target, true, data[start]);');
            codes.push('\r\n                }');
            codes.push('\r\n                else {');
            codes.push('\r\n                    break;');
            codes.push('\r\n                }');
            codes.push('\r\n            }');
            codes.push('\r\n            return target;');
            codes.push('\r\n        }');
            codes.push('\r\n        function produceClass (superclass, members) {');
            codes.push('\r\n            var Class = function () {};');
            codes.push('\r\n            Class.prototype = superclass;');
            codes.push('\r\n            var constructor = function () {');
            codes.push('\r\n                if (this instanceof constructor) {');
            codes.push('\r\n                    this._private = {};');
            codes.push('\r\n                    this._init.apply(this, arguments);');
            codes.push('\r\n                    return this;');
            codes.push('\r\n                }');
            codes.push('\r\n                else {');
            codes.push('\r\n                    var instance = new constructor();');
            codes.push('\r\n                    instance._private = {};');
            codes.push('\r\n                    instance._init.apply(instance, arguments);');
            codes.push('\r\n                    return instance;');
            codes.push('\r\n                };');
            codes.push('\r\n            }');
            codes.push('\r\n            constructor.prototype = new Class();');
            codes.push('\r\n            members._parent = superclass;');
            codes.push('\r\n            pandora.extend(constructor.prototype, true, members);');
            codes.push('\r\n            return constructor;');
            codes.push('\r\n        }');
            codes.push('\r\n        function declareClass () {');
            codes.push('\r\n            var superclass = void 0;var members = {};');
            codes.push('\r\n            if (arguments.length > 0) {');
            codes.push('\r\n                if (typeof arguments[0] === \'function\') {');
            codes.push('\r\n                    superclass = arguments[0].prototype || blockClass;');
            codes.push('\r\n                    members = prepareClassMembers(members, arguments, 1);');
            codes.push('\r\n                }');
            codes.push('\r\n                else {');
            codes.push('\r\n                    superclass = blockClass;');
            codes.push('\r\n                    members = prepareClassMembers(members, arguments, 0);');
            codes.push('\r\n                }');
            codes.push('\r\n            }');
            codes.push('\r\n            else {');
            codes.push('\r\n                superclass = blockClass;');
            codes.push('\r\n                members = {};');
            codes.push('\r\n            }');
            codes.push('\r\n            return produceClass(superclass, members);');
            codes.push('\r\n        }');
            codes.push('\r\n        return declareClass;');
            codes.push('\r\n    }());');
            return codes;
        }
        pushEach(codes: string[]): string[] {
            codes.push('\r\n    pandora.slice = function (arrayLike, startIndex, endIndex) {');
            codes.push('\r\n        startIndex = parseInt(startIndex) || 0;');
            codes.push('\r\n        return Array.prototype.slice.call(arrayLike, startIndex, endIndex);');
            codes.push('\r\n    }');
            codes.push('\r\n    pandora.each = function (obj, handler, that, hasOwnProperty) {');
            codes.push('\r\n        if (typeof(obj) == \'object\' && obj) {');
            codes.push('\r\n            var addArgs = pandora.slice(arguments, 3);');
            codes.push('\r\n            if (hasOwnProperty) {');
            codes.push('\r\n                for (var i in obj) {');
            codes.push('\r\n                    if (obj.hasOwnProperty(i)) {');
            codes.push('\r\n                        handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));');
            codes.push('\r\n                    }');
            codes.push('\r\n                }');
            codes.push('\r\n            }');
            codes.push('\r\n            else if ((obj instanceof Array) || (Object.prototype.toString.call(obj) === \'[object Array]\') || ((typeof(obj.length) === \'number\') && ((typeof(obj.item) === \'function\') || (typeof(obj.splice) != \'undefined\')))) {');
            codes.push('\r\n                for (var i = 0;i < obj.length;i++) {');
            codes.push('\r\n                    handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));');
            codes.push('\r\n                }');
            codes.push('\r\n            }');
            codes.push('\r\n            else {');
            codes.push('\r\n                for (var i in obj) {');
            codes.push('\r\n                    handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));');
            codes.push('\r\n                }');
            codes.push('\r\n            }');
            codes.push('\r\n        };');
            codes.push('\r\n    }');
            return codes;
        }
        pushExtends(codes: string[]): string[] {
            codes.push('\r\n    pandora.extend = function (base) {');
            codes.push('\r\n        base = (base && (typeof(base) === \'object\' || typeof(base) === \'function\')) ? base : root;');
            codes.push('\r\n        var rewrite = (arguments[1] === 1 || arguments[1] === true) ? true : false;');
            codes.push('\r\n        pandora.each(pandora.slice(arguments, 1), function (index, source) {');
            codes.push('\r\n            pandora.each(source, function (key, value) {');
            codes.push('\r\n                if (source.hasOwnProperty(key)) {');
            codes.push('\r\n                    if (typeof base[key] === \'undefined\' || rewrite) {');
            codes.push('\r\n                        base[key] = value;');
            codes.push('\r\n                    }');
            codes.push('\r\n                };');
            codes.push('\r\n            });');
            codes.push('\r\n        });');
            codes.push('\r\n        return base;');
            codes.push('\r\n    };');
            return codes;
        }
        pushLoop(codes: string[]): string[] {
            codes.push('\r\n    pandora.loop = (function () {');
            codes.push('\r\n        var BREAK = false;');
            codes.push('\r\n        loop.out = function () {');
            codes.push('\r\n            BREAK = true;');
            codes.push('\r\n        }');
            codes.push('\r\n        function loop (obj, handler, that, hasOwnProperty) {');
            codes.push('\r\n            if (typeof(obj) == \'object\' && obj) {');
            codes.push('\r\n                var addArgs = pandora.slice(arguments, 3);');
            codes.push('\r\n                BREAK = false;');
            codes.push('\r\n                if (hasOwnProperty) {');
            codes.push('\r\n                    for (var i in obj) {');
            codes.push('\r\n                        if (BREAK) {');
            codes.push('\r\n                            BREAK = false;');
            codes.push('\r\n                            break;');
            codes.push('\r\n                        }');
            codes.push('\r\n                        if (obj.hasOwnProperty(i)) {');
            codes.push('\r\n                            handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));');
            codes.push('\r\n                        }');
            codes.push('\r\n                    }');
            codes.push('\r\n                }');
            codes.push('\r\n                else if ((obj instanceof Array) || (Object.prototype.toString.call(obj) === \'[object Array]\') || ((typeof(obj.length) === \'number\') && ((typeof(obj.item) === \'function\') || (typeof(obj.splice) != \'undefined\')))) {');
            codes.push('\r\n                    for (var i = 0;i < obj.length;i++) {');
            codes.push('\r\n                        if (BREAK) {');
            codes.push('\r\n                            BREAK = false;');
            codes.push('\r\n                            break;');
            codes.push('\r\n                        }');
            codes.push('\r\n                        handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));');
            codes.push('\r\n                    }');
            codes.push('\r\n                }');
            codes.push('\r\n                else {');
            codes.push('\r\n                    for (var i in obj) {');
            codes.push('\r\n                        if (BREAK) {');
            codes.push('\r\n                            BREAK = false;');
            codes.push('\r\n                            break;');
            codes.push('\r\n                        }');
            codes.push('\r\n                        handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));');
            codes.push('\r\n                    }');
            codes.push('\r\n                }');
            codes.push('\r\n            };');
            codes.push('\r\n        }');
            codes.push('\r\n        return loop;');
            codes.push('\r\n    }());');
            return codes;
        }
        pushBlockHeader(codes: string[], imports: any[]): string[] {
            codes.push('/*!');
            codes.push("\r\n" + ' * tanguage script compiled code');
            codes.push("\r\n" + ' *');
            codes.push("\r\n" + ' * Datetime: ' + (new Date()).toUTCString());
            codes.push("\r\n" + ' */');
            codes.push("\r\n" + ';');

            codes.push("\r\n");
            if (this.configinfo === '{}') {
                codes.push("// ");
            } else {
                this.pushPostionsToMap(this.getPosition(this.configinfo_posi), codes);
            }
            codes.push('tang.config(' + this.configinfo + ');');
            if (this.isMainBlock) {
                codes.push("\r\n" + 'tang.init().block([');
            } else {
                codes.push("\r\n" + 'tang.init().block([');
            }
            if (imports.length) {
                let stropmi: string[] = [];
                for (let index = 0; index < imports.length; index += 2) {
                    stropmi.push(this.pushPostionsToMap(this.getPosition(imports[index + 1])) + "'" + imports[index] + "'");
                }
                // console.log(imports, stropmi);
                codes.push("\r\n    " + stropmi.join(",\r\n    ") + "\r\n");
                stropmi = undefined;
            }
            if (this.isMainBlock) {
                codes.push('], function (pandora, root, imports, undefined) {');
            } else {
                codes.push('], function (pandora, root, imports, undefined) {');
                codes.push("\r\n    var module = this.module;");
            }
            if (this.namespace) {
                let namespace = this.namespace.replace(/\.$/, "");
                let name = namespace.replace(/^(.*\.)?([\$a-zA-Z_][\$\w]*)$/, "$2");
                codes.push("\r\n    var " + name + " = pandora.ns('" + namespace + "', {});");
                namespace = name = undefined;
            }
            return codes;
        }
        pushAlias(codes: string[], vars, alias: any): string[] {
            for (var key in vars.locals) {
                codes.push("\r\n    var " + vars.locals[key] + ' = ' + key + ';');
            }
            for (const key in alias) {
                // console.log(key);
                // let position = this.getPosition(key);
                // let _key = key.replace(position.match, '').trim();
                let value = alias[key][0].toLowerCase();
                codes.push("\r\n    " + this.pushPostionsToMap(alias[key][2]) + "var " + this.patchVariables(key, vars));
                codes.push(" = imports['" + value);
                if (alias[key][1] === '*') {
                    codes.push("'];");
                } else {
                    codes.push("'] && imports['" + value + "']['" + key + "'];");
                }
                value = undefined;
            }
            return codes;
        }
        pushCodes(codes: string[], vars: any, array: any[], layer: number, namespace: string = this.namespace, lasttype: string = '', ignoreVarsPatch:boolean = false): string[] {
            // console.log(codes, array);
            // console.log(array);
            // console.log(layer, array);
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                // console.log(element);
                this.pushElement(codes, vars, element, layer, namespace, (index - 1 >= 0) ? array[index - 1].type : lasttype, ignoreVarsPatch);
            }
            return codes;
        }
        pushElement(codes: string[], vars: any, element: any, layer: number, namespace: string = this.namespace, lasttype: string = '', ignoreVarsPatch: boolean = false): string[] {
            let indent = "\r\n" + stringRepeat("    ", layer);
            switch (element.type) {
                case 'arraylike':
                    this.pushArrayCodes(codes, element, layer, namespace);
                    break;
                case 'if':
                case 'call':
                case 'callmethod':
                case 'construct':
                    // console.log(layer);
                    // console.log(element);
                    this.pushCallCodes(codes, element, layer, namespace);
                    break;
                case 'log':
                case 'callschain':
                    this.pushCallsCodes(codes, element, layer, namespace, lasttype);
                    break;
                case 'class':
                case 'dec':
                    this.pushClassCodes(codes, element, layer, namespace);
                    break;
                case 'code':
                    if (element.value) {
                        // console.log(element.posi&&element.posi.head, element.display, element.value);
                        // console.log(element.value, vars);
                        if (ignoreVarsPatch){
                            var code: string = element.value;
                        }else{
                            var code: string = this.patchVariables(element.value, vars);
                        }
                        
                        if (vars.scope.break !== undefined) {
                            code = code.replace(/@return;*/g, () => {
                                vars.scope.break = true;
                                this.useLoop = true;
                                return 'pandora.loop.out();' + indent + 'return;';
                            });
                        }
                        // console.log(code);
                        // console.log(code, element.display, element.posi, lasttype);
                        if (element.display === 'block'||lasttype==='exp') {
                            codes.push(indent + this.pushPostionsToMap(element.posi) + code);
                        } else {
                            if (element.posi) {
                                if (element.posi.head) {
                                    codes.push(indent);
                                }
                                this.pushPostionsToMap(element.posi, codes);
                            }
                            codes.push(code);
                        }
                    }
                    break;
                case 'codes':
                    // console.log(element);
                    this.pushCodes(codes, element.vars, element.body, layer + ((element.posi && element.posi.head) ? 1 : 0), namespace, lasttype);
                    break;
                case 'def':
                    this.pushFunctionCodes(codes, element, layer, namespace);
                    break;
                case 'extends':
                    this.pushExtendsCodes(codes, element, layer, namespace);
                    break;
                case 'exp':
                case 'closure':
                    this.pushExpressionCodes(codes, element, layer, namespace);
                    break;
                case 'expands':
                    this.pushExpandClassCodes(codes, element, layer, namespace);
                    break;
                case 'object':
                    // console.log(element);
                    this.pushObjCodes(codes, element, layer, namespace);
                    break;
                case 'travel':
                    this.pushTravelCodes(codes, element, layer, namespace);
                    break;
            }
            indent = undefined;
            return codes;
        }
        pushArrayCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            if (element.posi) {
                this.pushPostionsToMap(element.posi, codes);
            }

            // codes.push('[');
            if (element.body.length) {
                let _layer = layer;
                let indent1, indent2;
                let _break = false;
                // console.log(element.body[0]);
                if (element.body[0].posi && element.body[0].posi.head) {
                    indent1 = "\r\n" + stringRepeat("    ", _layer);
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("    ", _layer);
                    codes.push(indent2);
                    _break = true;
                }
                for (let index = 0; index < element.body.length; index++) {
                    const group = element.body[index];
                    let code:string = '';
                    if(group.type==='arrVar'){
                        code += this.pushPostionsToMap(group.posi) + this.patchVariable(group.aname, group.vars);
                    }else{
                        let elements: string[] = [];
                        this.pushArrayElements(elements, group.elems, group.vars, _layer, namespace);
                        while (elements.length && !elements[0].trim()) {
                            elements.shift();
                        }
                        code += '[';
                        if (elements.length) {
                            if (_break) {
                                code += elements.join(',' + indent2) + indent1;
                            } else {
                                code += elements.join(', ');
                            }
                        }
                        code += ']';
                        elements = undefined;
                    }
                    if (index === 0) {
                        codes.push(code);
                    }else{
                        if (index === 1){
                            codes.push('.concat(' + code);
                        }
                        else{
                            codes.push(', ' + code);
                        }
                        if (index === element.body.length-1) {
                            codes.push(')');
                        }
                    }
                }
                _layer = indent1 = indent2 = _break = undefined;
            }else{
                codes.push('[]');
            }
            
            return codes;
        }
        pushArrayElements(elements, body, vars, _layer, namespace){
            for (let index = 0; index < body.length; index++) {
                if (body[index].value) {
                    elements.push(this.pushPostionsToMap(body[index].posi) + this.patchVariables(body[index].value, vars));
                } else {
                    let elemCodes: string[] = [];
                    this.pushPostionsToMap(body[index].posi, elemCodes);
                    this.pushElement(elemCodes, vars, body[index], _layer, namespace);
                    if (elemCodes.length) {
                        elements.push(elemCodes.join('').trim());
                    }
                    elemCodes = undefined;
                }
            }
        }
        pushCallCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let naming: string[] = this.pushCodes([], element.vars, element.name, layer, namespace, '', element.type ==='callmethod');
            // console.log(naming, element);
            // console.log(element.name.length, element.name[0], naming);
            if (element.posi) {
                if (element.type === 'callmethod') {
                    element.posi.head = false;
                }
                if (element.posi.head) {
                    var indent = "\r\n" + stringRepeat("    ", layer);
                    codes.push(indent);
                }
                this.pushPostionsToMap(element.posi, codes);
            }
            let name = naming.join('');
            if (name === 'new') {
                codes.push('new (');
            } else {
                if (element.type === 'construct') {
                    codes.push('new ');
                }
                codes.push(name + '(');
            }

            let args: string[] = [];
            if (element.args.length) {
                let _layer = layer;
                let indent2;
                let _break = false;
                // console.log(element.args[0]);
                if ((element.args.length > 1) && element.args[0].posi && element.args[0].posi.head) {
                    // console.log(true);
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("    ", _layer);
                    // codes.push(indent2);
                    _break = true;
                }
                // console.log(element.name[0].value, element.args.length, element.args[0]);
                this.pushCallArgs(args, element.args, element.vars, _layer, namespace);
                // console.log(args);
                while (args.length && !args[0].trim()) {
                    args.shift();
                }
                if (args.length) {
                    if (_break) {
                        codes.push(indent2 + args.join(',' + indent2));
                        // console.log(codes);
                    } else {
                        codes.push(args.join(', '));
                    }
                }
                _layer = indent2 = _break = undefined;
            }
            // console.log(element.display);
            if (element.type === 'if'){
                codes.push(') ');
            }
            else if (element.display === 'block') {
                codes.push(');');
            } else {
                codes.push(')');
            }
            naming = name = undefined;
            return codes;
        }
        pushCallArgs(args, body, vars, _layer, namespace){
            for (let index = 0; index < body.length; index++) {
                const param = body[index].body;
                let paramCodes: string[] = [];
                this.pushPostionsToMap(body[index].posi, paramCodes)
                this.pushCodes(paramCodes, vars, param, _layer, namespace);
                if (paramCodes.length) {
                    args.push(paramCodes.join('').trim());
                }
                // console.log(element.name[0].value, param, paramCodes);
                paramCodes = undefined;
            }
        }
        pushCallsCodes(codes: string[], element: any, layer: number, namespace: string, lasttype: string): string[] {
            let elements: any[] = [];
            let _layer = layer;
            let indent;
            let _break = false;
            // console.log(element);
            if (element.type === 'log') {
                if(lasttype==='if'){
                    indent = "";
                }else{
                    indent = "\r\n" + stringRepeat("    ", _layer);
                }
                codes.push(indent + this.pushPostionsToMap(element.posi) + 'root.console');
            }
            else if (element.posi && element.posi.head) {
                _layer++;
                _break = true;
                indent = "\r\n" + stringRepeat("    ", _layer);
            }

            for (let index = 0; index < element.calls.length; index++) {
                const method = element.calls[index];
                // console.log(method);
                // method
                elements.push(this.pushElement([], element.vars, method, _layer, namespace).join(''));
            }
            // console.log(elements);
            if (_break) {
                codes.push(indent + '.' + elements.join(indent + '.'));
            } else {
                codes.push('.' + elements.join('.'));
                if (element.type === 'log') {
                    codes.push(';');
                }
            }
            elements = _layer = indent = _break = undefined;
            return codes;
        }
        pushClassCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent1 = "\r\n" + stringRepeat("    ", layer);
            let indent2 = "\r\n" + stringRepeat("    ", layer + 1);
            let elements: string[] = [];
            let static_elements: string[] = [];
            let cname: string = '';
            if (element.subtype === 'stdClass') {
                let cnt = element.cname.trim();
                let index = this.replacements.length;
                this.pushBuffer(["'" + cnt + "'"]);
                cname = 'pandora.' + cnt;
                cnt = undefined;
                codes.push(indent1 + this.pushPostionsToMap(element.posi) + 'pandora.declareClass(___boundary_' + this.uid + '_' + index + '_as_string___, ');
            } else {
                if (element.cname && element.cname.trim()) {
                    cname = element.cname.trim();
                    if (cname.match(/^[\$a-zA-Z_][\$\w]*$/)) {
                        codes.push(indent1 + 'var ' + this.pushPostionsToMap(element.posi) + cname + ' = ' + 'pandora.declareClass(');
                    } else {
                        codes.push(indent1 + this.pushPostionsToMap(element.posi) + cname + ' = ' + 'pandora.declareClass(');
                    }
                } else {
                    this.pushPostionsToMap(element.posi, codes)
                    codes.push('pandora.declareClass(');
                }
            }
            if (element.base) {
                codes.push(element.base + ', ');
            }
            codes.push('{');
            // console.log(element);
            let overrides = {};
            let setters = [];
            let getters = [];
            let indent3 = "\r\n" + stringRepeat("    ", layer + 2);
            for (let index = 0; index < element.body.length; index++) {
                const member = element.body[index];
                let elem: string[] = [];
                // console.log(member);
                switch (member.type) {
                    case 'method':
                        // console.log(member);
                        elem.push(indent2 + this.pushPostionsToMap(member.posi) + member.fname + ': ');
                        this.pushFunctionCodes(elem, member, layer + 1, namespace);
                        elements.push(elem.join(''));
                        break;

                    case 'overrideMethod':
                        overrides[member.fname] = overrides[member.fname] || {};
                        let argslen = member.args.length;
                        if (!overrides[member.fname][argslen]) {
                            let fname = overrides[member.fname][argslen] = '___override_method_' + member.fname + '_' + argslen;
                            elem.push(indent2 + this.pushPostionsToMap(member.posi) + fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
                            elements.push(elem.join(''));
                        }
                        break;

                    case 'prop':
                        elem.push(indent2 + this.pushPostionsToMap(member.posi) + member.pname + ': ');
                        this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                        elements.push(elem.join(''));
                        break;

                    case 'setPropMethod':
                        elem.push(indent3 + this.pushPostionsToMap(member.posi) + member.fname + ': ');
                        this.pushFunctionCodes(elem, member, layer + 2, namespace);
                        setters.push(elem.join(''));
                        break;

                    case 'getPropMethod':
                        elem.push(indent3 + this.pushPostionsToMap(member.posi) + member.fname + ': ');
                        this.pushFunctionCodes(elem, member, layer + 2, namespace);
                        getters.push(elem.join(''));
                        break;

                    case 'staticMethod':
                        elem.push(indent2 + this.pushPostionsToMap(member.posi) + member.fname + ': ');
                        this.pushFunctionCodes(elem, member, layer + 1, namespace);
                        static_elements.push(elem.join(''));
                        break;

                    case 'staticProp':
                        elem.push(indent2 + this.pushPostionsToMap(member.posi) + member.pname + ': ');
                        this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                        static_elements.push(elem.join(''));
                        break;
                }
                this.pushOverrideMethod(elements, overrides, indent2, indent3);
                if (setters.length) {
                    elements.push(indent2 + '_setters: {' + setters.join(',') + '}');
                }
                if (getters.length) {
                    elements.push(indent2 + '_getters: {' + getters.join(',') + '}');
                }
                elem = undefined;
            }

            if (elements.length) {
                codes.push(elements.join(','));
            }
            codes.push(indent1 + '})');
            if (cname) {
                if (static_elements.length) {
                    codes.push(';' + indent1 + this.pushPostionsToMap(element.posi) + 'pandora.extend(' + cname + ', {');
                    codes.push(static_elements.join(','));
                    codes.push(indent1 + '});');
                } else {
                    codes.push(';');
                }
                codes.push(indent1);
            }
            indent1 = indent2 = indent3 = elements = static_elements = cname = overrides = getters = setters = undefined;
            return codes;
        }
        pushFunctionCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent = "\r\n" + stringRepeat("    ", layer);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            } else {
                var posi = '';
            }

            this.fixVariables(element.vars);
            if (element.type === 'def' && element.fname) {
                if (element.fname === 'return') {
                    codes.push(indent + posi + 'return function (');
                } else {
                    let fname = this.patchVariable(element.fname, element.vars.parent);
                    switch (element.subtype){
                        case 'def':
                            codes.push(indent + posi + 'pandora.' + namespace + element.fname + ' = function (');
                            break;
                        case 'public':
                            codes.push(indent + posi + 'var ' + fname + ' = pandora.' + namespace + element.fname + ' = function (');
                            break;
                        default:
                            if (element.display === 'block') {
                                codes.push(indent + posi + 'function ' + fname + ' (');
                            } else {
                                codes.push(posi + 'function ' + fname + ' (');
                            }
                    }
                }
            } else {
                codes.push(posi + 'function (');
            }

            if (element.args.length) {
                let args: string[] = [];
                for (let index = 0; index < element.args.length; index++) {
                    args.push(this.pushPostionsToMap(element.args[index][1]) + this.patchVariable(element.args[index][0], element.vars));
                }
                codes.push(args.join(', '));
            }

            codes.push(') {');
            // console.log(element.body);
            // console.log(element);
            if (element.body.length) {
                // console.log(element);
                if ((element.vars.type === 'blocklike') || (element.vars.type === 'scope')) {
                    for (var key in element.vars.locals) {
                        codes.push(indent + "    var " + element.vars.locals[key] + ' = ' + key + ';');
                    }
                }
                element.body.push(semicolon);
                this.pushCodes(codes, element.vars, element.body, layer + 1, namespace);
            } else {
                indent = '';
            }
            // console.log(element.display, element.subtype);
            codes.push(indent + '}');
            indent = undefined;
            return codes;
        }
        pushExtendsCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent1 = "\r\n" + stringRepeat("    ", layer);
            let indent2 = "\r\n" + stringRepeat("    ", layer + 1);
            let indent3 = "\r\n" + stringRepeat("    ", layer + 2);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            } else {
                var posi = '';
            }
            if (element.subtype === 'global' || element.subtype === 'globalassign') {
                namespace = '';
            }
            if (element.subtype === 'voidanonspace' || element.subtype === 'voidns' || element.subtype === 'voidglobal' || element.subtype === 'anonspace' || element.subtype === 'ns' || element.subtype === 'global') {
                this.fixVariables(element.vars);
                if (element.subtype === 'voidanonspace' || element.subtype === 'anonspace') {
                    codes.push(indent1 + posi + '(function () {');
                    this.pushCodes(codes, element.vars, element.body, layer + 1, namespace + '.');
                } else {
                    let index = this.replacements.length;
                    this.pushBuffer(["'" + namespace + element.oname.trim() + "'"]);
                    codes.push(indent1 + posi + 'pandora.ns(___boundary_' + this.uid + '_' + index + '_as_string___, function () {');
                    this.pushCodes(codes, element.vars, element.body, layer + 1, namespace + element.oname.trim() + '.');
                }
                // console.log(element.body);
                if (element.subtype === 'anonspace' || element.subtype === 'ns' || element.subtype === 'global'){
                    let exports = [];
                    // console.log(element.vars.scope.public);
                    codes.push(indent2 + 'return {');
                    for (const name in element.vars.scope.public) {
                        exports.push(name + ': ' + element.vars.scope.public[name]);
                    }
                    if (exports.length) {
                        codes.push(indent3 + exports.join(',' + indent3));
                    }
                    codes.push(indent2 + '}');
                }
                
                codes.push(indent1 + '}');
                if (element.subtype === 'voidanonspace' || element.subtype === 'anonspace') {
                    codes.push('()');
                }
               
            } else if (element.subtype === 'nsassign' || element.subtype === 'globalassign') {
                let index = this.replacements.length;
                this.pushBuffer(["'" + namespace + element.oname.trim() + "'"]);
                codes.push(indent1 + posi + 'pandora.ns(___boundary_' + this.uid + '_' + index + '_as_string___, ');
                this.pushObjCodes(codes, element, layer, namespace);
            } else {
                codes.push(indent1 + posi + 'pandora.extend(' + element.oname + ', ');
                this.pushObjCodes(codes, element, layer, namespace);
            }
            codes.push(');');
            codes.push(indent1);
            indent1 = indent2 = indent3 = posi = undefined;
            return codes;
        }
        pushExpressionCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent1 = "\r\n" + stringRepeat("    ", layer);
            let indent2 = "\r\n" + stringRepeat("    ", layer);
            // console.log(element);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            } else {
                var posi = '';
            }
            this.fixVariables(element.vars);
            if (element.type === 'closure') {
                // console.log(element);
                if (element.posi) {
                    codes.push(indent1 + posi + '{')
                } else {
                    codes.push(' {');
                }
            } else {
                codes.push(indent1 + posi + element.expression + ' (');
                // console.log(element.head);
                // this.pushElement(codes, element.head.vars.parent, element.head, layer, namespace);
                this.pushElement(codes, element.head.vars, element.head, layer, namespace);
                codes.push(') {');
            }
            if (element.body.length) {
                codes.push(indent2);
                // console.log(element.body);
                this.pushCodes(codes, element.vars, element.body, layer + 1, namespace);
                codes.push(indent1 + '}');
            } else {
                codes.push('}');
            }
            indent1 = indent2 = undefined;
            return codes;
        }
        pushExpandClassCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let indent1 = "\r\n" + stringRepeat("    ", layer);
            let indent2 = "\r\n" + stringRepeat("    ", layer + 1);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            } else {
                var posi = '';
            }
            let elements: string[] = [];
            let static_elements: string[] = [];
            let cname: string = '';
            if (element.subtype === 'stdClass') {
                cname = 'pandora.' + element.cname.trim();
            } else {
                if (element.cname && element.cname.trim()) {
                    cname = element.cname.trim();
                } else {
                    return codes;
                }
            }
            codes.push(indent1 + posi + 'pandora.extend(' + cname + '.prototype, ');
            if (element.base===false) {
                codes.push('true, ');
            }
            codes.push('{');
            // console.log(element);
            let overrides = {};
            let indent3 = "\r\n" + stringRepeat("    ", layer + 2);
            for (let index = 0; index < element.body.length; index++) {
                const member = element.body[index];
                let elem: string[] = [];
                // console.log(member);
                switch (member.type) {
                    case 'method':
                        elem.push(indent2 + member.fname + ': ');
                        this.pushFunctionCodes(elem, member, layer + 1, namespace);
                        elements.push(elem.join(''));
                        break;

                    case 'overrideMethod':
                        overrides[member.fname] = overrides[member.fname] || {};
                        let argslen = member.args.length;
                        if (!overrides[member.fname][argslen]) {
                            let fname = overrides[member.fname][argslen] = '___override_method_' + member.fname + '_' + argslen;
                            elem.push(indent2 + fname + ': ');
                            this.pushFunctionCodes(elem, member, layer + 1, namespace);
                            elements.push(elem.join(''));
                        }
                        break;

                    case 'prop':
                        elem.push(indent2 + member.pname + ': ');
                        this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                        elements.push(elem.join(''));
                        break;

                    case 'staticMethod':
                        elem.push(indent2 + member.fname + ': ');
                        this.pushFunctionCodes(elem, member, layer + 1, namespace);
                        static_elements.push(elem.join(''));
                        break;

                    case 'staticProp':
                        elem.push(indent2 + member.pname + ': ');
                        this.pushCodes(elem, member.vars, member.body, layer + 1, namespace);
                        static_elements.push(elem.join(''));
                        break;
                }
            }
            this.pushOverrideMethod(elements, overrides, indent2, indent3);
            if (elements.length) {
                codes.push(elements.join(','));
            }
            codes.push(indent1 + '})');
            // console.log(element.display);
            if (static_elements.length) {
                codes.push(';' + indent1 + 'pandora.extend(' + cname + ', {');
                codes.push(static_elements.join(','));
                codes.push(indent1 + '});');
            } else {
                codes.push(';');
            }
            codes.push(indent1);
            // console.log(elements, static_elements); 
            indent1 = indent2 = elements = static_elements = cname = overrides = indent3 = undefined;
            return codes;
        }
        pushOverrideMethod(elements, overrides, indent2, indent3) {
            for (const fname in overrides) {
                if (hasProp(overrides, fname)) {
                    // console.log(overrides[fname]);
                    let elem = [];
                    elem.push(indent2 + fname + ': ');
                    elem.push('function(){');
                    const element = overrides[fname];
                    for (var args in element) {
                        if (hasProp(element, args)) {
                            elem.push(indent3 + 'if (arguments.length@boundary_5_as_operator::' + args + ') { return this.' + element[args] + '.apply(this, arguments); }');
                        }
                    }
                    elem.push(indent3 + 'return this.' + element[args] + '.apply(this, arguments);');
                    elem.push(indent2 + '}');
                    elements.push(elem.join(''));
                    elem = undefined;
                }
            }
        }
        pushTravelCodes(codes: string[], element: any, layer: number, namespace: string): string[] {
            let index = codes.length,
                indent = "\r\n" + stringRepeat("    ", layer);
            // console.log(element);
            codes.push(indent + 'pandora.each(');
            this.pushElement(codes, element.vars, element.iterator, layer, namespace);
            codes.push(', ');
            this.pushFunctionCodes(codes, element.callback, layer, namespace);
            if (element.vars.scope.break === true) {
                codes[index] = indent + 'pandora.loop(';
            }
            if (element.subtype === 'ownprop') {
                codes.push(', this, true);');
            } else {
                codes.push(', this);');
            }
            codes.push(indent);
            index = indent = undefined;
            return codes;
        }
        pushObjCodes(codes: string[], element: any, layer: number, namespace: string) {
            let indent1 = "\r\n" + stringRepeat("    ", layer);
            let indent2 = "\r\n" + stringRepeat("    ", layer + 1);
            // console.log(element);
            if (element.type === 'object' && element.display === 'block') {
                codes.push(indent1 + this.pushPostionsToMap(element.posi));
            }
            if (element.body.useExplode) {
                var objects: string[] = [];
                codes.push('pandora.extend({');
            }else{
                codes.push('{');
            }

            if (element.body.length) {
                let elements: string[] = [];
                let _layer = layer;
                let _break = false;
                // console.log(element.body[0]);
                if ((element.body.length > 1) || (element.body[0].posi && element.body[0].posi.head)) {
                    _layer++;
                    codes.push(indent2);
                    _break = true;
                }
                // console.log(_break, element);
                for (let index = 0; index < element.body.length; index++) {
                    const member = element.body[index];
                    let elem: string[] = [];
                    // console.log(member);
                    switch (member.type) {
                        case 'object':
                            objects.push(this.pushPostionsToMap(member.posi) + this.patchVariable(member.oname, member.vars));
                            break;

                        case 'method':
                            elem.push(this.pushPostionsToMap(member.posi) + member.fname + ': ');
                            this.pushFunctionCodes(elem, member, _layer, namespace);
                            elements.push(elem.join(''));
                            break;

                        case 'objProp':
                            elem.push(this.pushPostionsToMap(member.posi) + member.pname + ': ');
                            this.pushCodes(elem, member.vars, member.body, _layer, namespace);
                            elements.push(elem.join(''));
                            break;
                    }
                    elem = undefined;
                }
                if (_break) {
                    codes.push(elements.join(',' + indent2));
                    codes.push(indent1);
                } else {
                    codes.push(elements.join(','));
                }
                elements = _layer = _break = undefined;
            }
            if (element.body.useExplode) {
                codes.push('}, true, ' + objects.join(', ') + ')');
            } else {
                codes.push('}');
            }

            indent1 = indent2 = undefined;
            return codes;
        }
        pushFooter(codes: string[], vars: any): string[] {
            // console.log(vars.scope.public);
            for (const name in vars.scope.public) {
                codes.push("\r\n    pandora('" + this.namespace + name + "', " + vars.scope.public[name] + ");");
            }
            if (this.isMainBlock) {
                codes.push("\r\n" + '}, true);');
            } else {
                codes.push("\r\n" + '});');
            }
            return codes;
        }
        resetVarsRoot(vars: any) {
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
        fixVariables(vars: any) {
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
                            while (vars.scope.fixed['includes'](varname) || (hasProp(vars.scope.private, varname) && (vars.scope.private[varname] !== vars))) {
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
        patchVariables(code: string, vars: any): string {
            // console.log(code, vars);
            if (code) {
                return code.replace(matchExpRegPattern.pickConst, (match, before, definition, varname) => {
                    // console.log(match, "\r\n", before, '[', varname, '](', type, ')', after);
                    if (!definition && hasProp(vars.self, varname) && (vars.self[varname] === 'const')) {
                        // console.log(vars);
                        this.error('Cannot re-assign constant `' + varname + '`');
                    }
                    return match;
                }).replace(matchExpRegPattern.pickVars, (match, before, definition, varname, after) => {
                    // console.log(before, match, after);
                    return before + (definition || '') + this.patchVariable(varname, vars) + after || '';
                }).replace(matchExpRegPattern.pickNS, (match, before, node, member) => {
                    // console.log(match, "\r\n", before, '[', node, ']', member, vars);
                    return before + this.patchNamespace(node, vars) + member;
                });
            }
            // console.log(code);
            return '';
        }
        patchVariable(varname: string, vars: any): string {
            // if (varname === 'document')
            //     console.log(!vars.scope.fixed['includes'](varname) || (vars.scope.private[varname] !== vars), vars.scope.fixed, vars.scope.private);
            // if (varname === 'posi') console.log('before:', varname, vars);
            // if (varname === 'subtype') console.log('before:', varname, vars);
            // if (varname === 'code') console.log('before:', varname, vars);
            // if (varname === 'match') console.log('before:', varname, vars);
            // if (varname === 'element') console.log('before:', varname, vars);
            // if (varname === 'localvars') console.log('before:', varname, vars);
            // if (varname === 'block') console.log('before:', varname, vars);
            // if (varname === 'block_2') console.log('before:', varname, vars);
            // if (varname === 'c') console.log('before:', varname, vars);
            // if (varname === 'arguments') console.log('before:', varname, vars);
            // console.log('before:', varname, vars);
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
                        // console.log(varname);
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
        patchNamespace(node: string, vars: any): string {
            if (node === '.') {
                return 'pandora';
            }
            if (vars.scope.namespace) {
                return ('pandora.' + vars.scope.namespace).replace(/\.+$/, '');
            }
            // console.log(this.namespace);
            return ('pandora.' + this.namespace).replace(/\.+$/, '');
        }
        restoreStrings(string: string): string {
            this.consoleDateTime('RESTORE STRINGS:');
            // console.log(string);
            let that = this;
            return string.replace(this.lastPattern, function () {
                // all + string|pattern|template  + type + propname + keyword|midword|preoperator|operator|aftoperator|comments + type
                if (arguments[5]) {
                    return that.readBuffer(arguments[5]);
                }
                return that.readBuffer(arguments[2] || arguments[4]);
            }).replace(this.markPattern, function () {
                return that.readBuffer(arguments[1]);
            }).replace(/(@\d+L\d+P\d+O?\d*:::)/g, '');
        }
        decode(string: string): string {
            string = string.replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
            let matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
            while (matches) {
                // console.log(matches, this.replacements[matches[2]]);
                string = string.replace(matches[0], this.readBuffer(matches[2])).replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
                matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
            }
            matches = string.match(/@boundary_(\d+)_as_[a-z]+::/);
            while (matches) {
                // console.log(matches, this.replacements[matches[2]]);
                string = string.replace(matches[0], this.readBuffer(matches[1])).replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
                matches = string.match(/@boundary_(\d+)_as_[a-z]+::/);
            }
            matches = undefined;
            // console.log(string);
            return string.replace(/(@\d+L\d+P\d+O?\d*:::)/g, '');
        }
        trim(string: string): string {
            this.consoleDateTime('START TRIM:');
            // console.log(string);

            // 去除多余标注
            string = string.replace(/\s*(\/\*\s+@posi\d+\s+\*\/)?@(ownprop|return)[; \t]*/g, () => {
                return '';
            });
            string = string.replace(/((\/\*\s+@posi\d+\s+\*\/)\s*)+(\/\*\s+@posi\d+\s+\*\/)/g, "$3");
            // console.log(string);

            // 去除多余符号
            string = string.replace(/\s*;(\s*;)*[\t \x0B]*/g, ";");
            string = string.replace(/(.)(\{|\[|\(|\.|\:)\s*[,;]+/g, (match, before, mark) => {
                if ((before === mark) && (before === ':')) {
                    return match;
                }
                return before + mark;
            });
            // console.log(string);
            
            // 主要用来处理加法链等
            string = string.replace(/[;\s]*[\r\n]+(\t*)[ ]*(\/\*\s+@posi\d+\s+\*\/)(@boundary_\d+_as_operator::)\s*/g, (match, white, comments, midword) => {
                return "\r\n" + white.replace(/\t/g, '    ') + '   ' + comments + midword;
            });
            // console.log(string);


            string = string.replace(/\s*(@boundary_\d+_as_operator::)[;\s]*[\r\n]+(\t*)[ ]*(\/\*\s+@posi\d+\s+\*\/)/g, "\r\n$2   $3 $1 ");
            // console.log(string);
        
            // 主要用来处理};else等
            string = string.replace(/(}*[;\s]*)[\r\n]+([ \t]*)[ ]*(\/\*\s+@posi\d+\s+\*\/)(@boundary_\d+_as_midword::)\s*/g, (match, pre, white, comments, midword) => {
                // console.log([match, pre, white, comments, midword]);
                return pre.replace(/\s+/g, '').replace(/\};/g, '}') + "\r\n" + white.replace(/\t/g, '    ') + comments + midword;
            });
            // console.log(string);
            // 格式化相应符号
            string = string.replace(/[;\s]*(\=|\?)[;\s]*/g, " $1 ");

            string = string.replace(/\s+(\:)[;\s]*/g, " $1 ");
            string = string.replace(/[;\s]+(\/\*\s+@posi\d+\s+\*\/)(\:)[;\s]*/g, " $2 $1");
            // console.log(string);
            string = string.replace(/[^\:\S]+(\:)\s*(\/\*\s+@posi\d+\s+\*\/)/g, " $1 $2");
            // console.log(string);
            // 删除多余空白与换行
            // string = string.replace(/[ ]+/g, " ");
            string = string.replace(/\s+[\r\n]([ \t])/g, (match, white)=>{
                return "\r\n"+white.replace(/\t/g, '    ');
            });
            string = string.replace(/\{\s+\}/g, '{}');
            string = string.replace(/\[\s+\]/g, '[]');
            string = string.replace(/\(\s+\)/g, '()');
            // 运算符处理
            string = string.replace(/(\s*)(@boundary_(\d+)_as_(operator|aftoperator|keyword|midword)::)\s*/g, (match, pregap, operator, index) => {
                // console.log(this.replacements[index]);
                if (this.replacements[index][1]) {
                    // console.log(this.replacements[index]);
                    return pregap + operator;
                }
                return operator;
            });
            // this.replacements = undefined;
            string = string.replace(/(@boundary_\d+_as_(preoperator)::)(\s*;+|(\s+([^;])))/g, (match, operator, word, right, afterwithgap, after) => {
                if (after) {
                    return operator + after;
                }
                return operator;
            });
            // console.log(string);
            string = string.replace(/\)\s*return\s+/, ') return ');
            // console.log(string);
            this.consoleDateTime('FINISH TRIM:');
            return string;
        }
        pickUpMap(string: string) {
            let lines = string.split(/\r{0,1}\n/);
            let _lines = [];
            let mappings = [];
            // console.log(this.posimap);
            for (let l = 0; l < lines.length; l++) {
                let line = lines[l];
                lines[l] = undefined;
                let mapping = [];
                let match;
                while (match = line.match(/\/\*\s@posi(\d+)\s\*\//)) {
                    let index = match.index;
                    let i = parseInt(match[1]);
                    let position = this.posimap[i];
                    this.posimap[i] = undefined;
                    mapping.push([index, position.o[0], position.o[1], position.o[2], 0]);
                    line = line.replace(match[0], '');
                }
                _lines.push(line);
                mappings.push(mapping);
                line = mapping = undefined;
            }
            this.posimap = undefined;
            this.mappings = mappings;
            mappings = undefined;
            // console.log(mappings)

            return _lines.join("\r\n");
        }
        run(precall = null, callback = (content) => { }) {
            if (!this.output) {
                this.compile();
            }
            precall && precall.call(this, this.output);
            eval(this.output);
            callback.call(this);
        }
        consoleDateTime(tag: string) {
            if (false) {
                console.log(tag);
                console.log(new Date());
            }
        }
    }

    return function (input, run) {
        return new Script(input, run);
    };
}));