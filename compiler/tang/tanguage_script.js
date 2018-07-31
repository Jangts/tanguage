/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 31 Jul 2018 16:35:05 GMT
 */;
void

function(root, factory) {
    if (typeof exports === 'object') {
        root.console = console;
        exports = factory(root);
        if (typeof module === 'object') {
            module.exports = exports;
        }
    }
    else if (typeof root.define === 'function' && root.define.amd) {
        root.define(function () {
            return factory(root);
        });
    }
    else if (typeof root.tang === 'object' && typeof root.tang.init === 'function') {
        root.tang.init();
        root.tang.module.exports = factory(root);
    }
    else {
        factory(root)
    }
}(typeof window === 'undefined' ? global : window, function(root, undefined) {
    var pandora = {};
    pandora.declareClass = (function () {
        var blockClass = {
            _public: {},
            _init: function () {}
        };
        function prepareClassMembers (target, data, start) {
            for (start;start < data.length;start++) {
                if (data[start]&& typeof data[start] === 'object') {
                    pandora.extend(target, true, data[start]);
                }
                else {
                    break;
                }
            }
            return target;
        }
        function produceClass (superclass, members) {
            var Class = function () {};
            Class.prototype = superclass;
            var constructor = function () {
                if (this instanceof constructor) {
                    this._private = {};
                    this._init.apply(this, arguments);
                    return this;
                }
                else {
                    var instance = new constructor();
                    instance._private = {};
                    instance._init.apply(instance, arguments);
                    return instance;
                };
            }
            constructor.prototype = new Class();
            members._parent = superclass;
            pandora.extend(constructor.prototype, true, members);
            return constructor;
        }
        function declareClass () {
            var superclass = void 0;var members = {};
            if (arguments.length > 0) {
                if (typeof arguments[0] === 'function') {
                    superclass = arguments[0].prototype || blockClass;
                    members = prepareClassMembers(members, arguments, 1);
                }
                else {
                    superclass = blockClass;
                    members = prepareClassMembers(members, arguments, 0);
                }
            }
            else {
                superclass = blockClass;
                members = {};
            }
            return produceClass(superclass, members);
        }
        return declareClass;
    }());
    pandora.slice = function (arrayLike, startIndex, endIndex) {
        startIndex = parseInt(startIndex) || 0;
        return Array.prototype.slice.call(arrayLike, startIndex, endIndex);
    }
    pandora.each = function (obj, handler, that, hasOwnProperty) {
        if (typeof(obj) == 'object' && obj) {
            var addArgs = pandora.slice(arguments, 3);
            if (hasOwnProperty) {
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                    }
                }
            }
            else if ((obj instanceof Array) || (Object.prototype.toString.call(obj) === '[object Array]') || ((typeof(obj.length) === 'number') && ((typeof(obj.item) === 'function') || (typeof(obj.splice) != 'undefined')))) {
                for (var i = 0;i < obj.length;i++) {
                    handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                }
            }
            else {
                for (var i in obj) {
                    handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                }
            }
        };
    }
    pandora.extend = function (base) {
        base = (base && (typeof(base) === 'object' || typeof(base) === 'function')) ? base : root;
        var rewrite = (arguments[1] === 1 || arguments[1] === true) ? true : false;
        pandora.each(pandora.slice(arguments, 1), function (index, source) {
            pandora.each(source, function (key, value) {
                if (source.hasOwnProperty(key)) {
                    if (typeof base[key] === 'undefined' || rewrite) {
                        base[key] = value;
                    }
                };
            });
        });
        return base;
    };
    pandora.declareClass = (function () {
        var blockClass = {
            _public: {},
            _init: function () {}
        };
        function prepareClassMembers (target, data, start) {
            for (start;start < data.length;start++) {
                if (data[start]&& typeof data[start] === 'object') {
                    pandora.extend(target, true, data[start]);
                }
                else {
                    break;
                }
            }
            return target;
        }
        function produceClass (superclass, members) {
            var Class = function () {};
            Class.prototype = superclass;
            var constructor = function () {
                if (this instanceof constructor) {
                    this._private = {};
                    this._init.apply(this, arguments);
                    return this;
                }
                else {
                    var instance = new constructor();
                    instance._private = {};
                    instance._init.apply(instance, arguments);
                    return instance;
                };
            }
            constructor.prototype = new Class();
            members._parent = superclass;
            pandora.extend(constructor.prototype, true, members);
            return constructor;
        }
        function declareClass () {
            var superclass = void 0;var members = {};
            if (arguments.length > 0) {
                if (typeof arguments[0] === 'function') {
                    superclass = arguments[0].prototype || blockClass;
                    members = prepareClassMembers(members, arguments, 1);
                }
                else {
                    superclass = blockClass;
                    members = prepareClassMembers(members, arguments, 0);
                }
            }
            else {
                superclass = blockClass;
                members = {};
            }
            return produceClass(superclass, members);
        }
        return declareClass;
    }());
    if (Array.prototype.includes == undefined) {
        Array.prototype.includes = function (searchElement, fromIndex) {
            fromIndex = parseInt(fromIndex) || 0;
            for (fromIndex;fromIndex < this.length;fromIndex++) {
                if (this[fromIndex] === searchElement) {
                    return true;
                }
            }
            return false;
        }
    }
    var Buf = void 0;
    if (typeof Buffer === 'function') {
        Buf = Buffer;
    }
    else {
        Buf = function (string) {
            this.value = string;
        }
        Buf.prototype.toString = function () {
            return this.value;
        }
    }
    var keywords = [
        'break',
        'case',
        'catch',
        'const',
        'continue',
        'default',
        'delete',
        'do',
        'else',
        'finally',
        'for',
        'function',
        'if',
        'in',
        'instanceof',
        'let',
        'new',
        'null',
        'return',
        'switch',
        'throw',
        'try',
        'typeof',
        'var',
        'void',
        'while',
        'with'
    ];
    var reservedFname = ['if', 'for', 'while', 'switch', 'with', 'catch'];
    var reserved = ['window', 'global', 'tang', 'this', 'arguments'];
    var semicolon = {
        type: 'code',
        posi: undefined,
        display: 'inline',
        vars: {
            parent: null,
            scope: {
                namespace: this.namespace,
                public:  {},
                const:  {},
                private:  {},
                protected:  {},
                fixed: [],
                fix_map:  {}
            },
            hasHalfFunScope: false,
            locals:  {},
            type: 'semicolon'
        },
        value: ';'
    };
    var zero2z = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var namingExpr = /^[A-Z_\$][\w\$]*$/i;
    var argsExpr = /^...[A-Z_\$][\w\$]*$/i;
    var stringas = {
        '/': '_as_pattern___',
        '`': '_as_template___',
        '"': '_as_string___',
        "'": '_as_string___'
    };
    var operators = {
        mixed: /([\$\w]\s*(@\d+L\d+P\d+O*\d*:::)?)(\=\=|\!\=|\=|\!|\+|\-|\*|\/|\%|<<|>>|>>>|\&|\^|\||<|>)=\s*((@\d+L\d+P\d+O*\d*:::)?(\+|\-)?[\$\w\.]|@boundary_)/g,
        bool: /([\$\w]\s*(@\d+L\d+P\d+O*\d*:::)?)(\&\&|\|\||\<|\<\<|\>\>\>|\>\>|\>)\s*((@\d+L\d+P\d+O*\d*:::)?(\+|\-)?[\$\w\.])/g,
        op: /([\$\w]\s*(@\d+L\d+P\d+O*\d*:::)?)(\+|\-|\*\*|\*|\/|\%|\&)\s*((@\d+L\d+P\d+O*\d*:::)?(\s+(\+|\-))?[\$\w\.])/g,
        owords: /\s+(@\d+L\d+P\d+O*\d*:::)?(in|of)\s+(@\d+L\d+P\d+O*\d*:::)?/g,
        sign: /(^|\s*[^\+\-])(\+|\-)([\$\w\.])/g,
        swords: /(^|[^\$\w])(typeof|instanceof|void|delete)\s+((@\d+L\d+P\d+O*\d*:::)?\+*\-*[\$\w\.]|@boundary_)/g,
        before: /(\+\+|\-\-|\!|\~)\s*([\$\w\.])/g,
        after: /([\$\w\.])[ \t]*(@\d+L\d+P\d+O*\d*:::)?(\+\+|\-\-)/g,
        error: /(.*)(\+\+|\-\-|\+|\-)(.*)/g
    };
    var replaceWords = /(^|@\d+L\d+P\d+O?\d*:::|\s)(continue|return|throw|break|case|else)\s*(\s|;|___boundary_[A-Z0-9_]{36}_(\d+)_as_([a-z]+)___)/g;
    var replaceExpRegPattern = {
        typetag: /^((\s*@\d+L\d+P0:::)*\s*(@\d+L\d+P0*):::(\s*))?@(module|native)[;\s]*/,
        namespace: /(^|[\r\n])((@\d+L\d+P0):::)?(\s*)namespace\s+(\.{0,1}[\$a-zA-Z_][\$\w\.]*)\s*(;|\r|\n)/,
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
        closure: /(@\d+L\d+P\d+O*\d*:::)?(@*[\$a-zA-Z_][\$\w]*|\)|\=|\(\s)?(@\d+L\d+P\d+O*\d*:::)?\s*\{(\s*[^\{\}]*?)\s*\}/g,
        recheckfn: /(@\d+L\d+P\d+O?\d*:::)?([\$a-zA-Z_][\$\w]*)?___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_closure___(@\d+L\d+P\d+O?\d*:::)?/,
        expression: /(@\d+L\d+P\d+O*\d*:::)?(if|for|while|switch|with|catch|each)\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*;*\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_(closure|objlike)___)/g,
        if: /(@\d+L\d+P\d+O*\d*:::)?if\s*(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*/g,
        object: /(@\d+L\d+P\d+O*\d*:::)?\{\s*(@\d+L\d+P\d+O*\d*:::(\.\.\.)?[\$a-zA-Z_][\$\w]*(\s*,@\d+L\d+P\d+O*\d*:::(\.\.\.)?[\$a-zA-Z_][\$\w]*)*)\s*\}(@\d+L\d+P\d+O*\d*:::)?/g,
        array: /(@\d+L\d+P\d+O*\d*:::)?\[\s*(@\d+L\d+P\d+O*\d*:::(\.\.\.)?[\$a-zA-Z_][\$\w]*(\s*,@\d+L\d+P\d+O*\d*:::(\.\.\.)?[\$a-zA-Z_][\$\w]*)*)\s*\]/g,
        clog: /(@\d+L\d+P\d+O*\d*:::|\s+)clog\s+(.+?)\s*([;\r\n]+|$)/g
    };
    var matchExpRegPattern = {
        string: /(\/|\#|`|"|')([\*\/\=])?/,
        strings: {
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
        objectattr: /^\s*(@\d+L\d+P\d+O?\d*:::)?((([\$a-zA-Z_][\$\w]*)))\s*(\:*)([\s\S]*)$/,
        classelement: /^\s*(@\d+L\d+P\d+O?\d*:::)?((public|static|set|get|om)\s+)?([\$\w]*)\s*(\=*)([\s\S]*)$/,
        travelargs: /^((@\d+L\d+P\d+O*\d*:::)?[\$a-zA-Z_][\$\w\.]*)\s+as\s(@\d+L\d+P\d+O*\d*:::)([\$a-zA-Z_][\$\w]*)(\s*,((@\d+L\d+P\d+O*\d*:::)([\$a-zA-Z_][\$\w]*)?)?)?/
    };
    var hasProp = function (obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };
    var boundaryMaker = function () {
        var radix = 36;
        var uid = new Array(radix);
        for (var i = 0;i < radix;i++) {
            uid[i] = zero2z[Math.floor(Math.random() * radix)];
        }
        uid[8] = uid[13] = uid[18] = uid[23] = '_';
        radix = undefined;
        return uid.join('');
    };
    var stringRepeat = function (string, number) {
        return new Array(number + 1).join(string);
    };
    var Script = pandora.declareClass({
        uid: undefined,
        input: undefined,
        isMainBlock: true,
        maintag_posi: undefined,
        namespace: '',
        namespace_posi: undefined,
        markPattern: undefined,
        trimPattern: undefined,
        lastPattern: undefined,
        stringReplaceTimes: 65536,
        positions: [],
        replacements: undefined,
        imports: [],
        using_as: {},
        ast: {},
        mappings: undefined,
        configinfo: '{}',
        configinfo_posi: undefined,
        posimap: [],
        sources: [],
        output: undefined,
        tess: {},
        blockreserved: undefined,
        xvars: undefined,
        total_opens: 0,
        last_opens: [0],
        last_closed: true,
        anonymous_variables: 0,
        closurecount: 0,
        isNativeCode: false,
        useDeclare: false,
        useAnonSpace: true,
        useExtends: false,
        useEach: false,
        useLoop: false,
        _init: function (input, source, run) {
            if (source === void 0) { source = '';}
            if (run === void 0) { run = false;}
            this.uid = boundaryMaker();
            this.markPattern = new RegExp('@boundary_(\\\d+)_as_(mark)::', 'g');
            this.trimPattern = new RegExp('(___boundary_' + this.uid + '_(\\\d+)_as_(string|pattern|template)___|___boundary_(\\\d+)_as_propname___)', 'g');
            this.lastPattern = new RegExp('(___boundary_' + this.uid + '_(\\\d+)_as_(string|pattern|template)___|___boundary_(\\\d+)_as_propname___|@boundary_(\\\d+)_as_(keyword|midword|preoperator|operator|aftoperator|comments)::)', 'g');
            this.input = input;
            this.output = undefined;
            this.blockreserved = ['pandora', 'root'];
            this.xvars = [];
            this.replacements = [['{}'], ['/='], ['/'], [' +'], [' -'], [' === '], [' + '], ['\"'], ['"\\r\\n"'], ['[^\\/']];
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
            };
        },
        compile: function () {
            var newcontent = this.markPosition(this.input, 0);
            var string = this.encode(newcontent);
            var vars = {
                parent: null,
                scope: {
                    namespace: this.namespace,
                    public:  {},
                    const:  {},
                    private:  {},
                    protected:  {},
                    fixed: [],
                    fix_map:  {}
                },
                hasHalfFunScope: false,
                locals:  {},
                type: 'blocklike'
            };
            vars.self = vars.scope.protected;
            this.buildAST(this.pickReplacePosis(this.getLines(string, vars), vars), vars);
            this.generate();
            newcontent = string = vars = undefined;
            return this;
        },
        error: function (str) {
            throw 'tanguage script Error: ' + str;
        },
        pushBuffer: function (replacement) {
            var buf = new Buf(replacement[0]);
            replacement[0] = buf;
            this.replacements.push(replacement);
        },
        readBuffer: function (index) {
            return this.replacements[index][0].toString();
        },
        markPosition: function (string, sourceid) {
            var _this = this;
            var _arguments = arguments;
            if (sourceid === void 0) { sourceid = 0;}
            var lines = string.split(/\r{0,1}\n/);
            var positions = [];
            for (var l = 0;l < lines.length;l++) {
                var elements = lines[l].split(/(,|;|\{|\[|\(|\}|\sas\s|->|=>)/);
                var newline = [];
                for (var c = 0, length = 0;c < elements.length;c++) {
                    var element = elements[c];
                    if (c === 0) {
                        length = 0;
                    }
                    if (element === ',' || element === ';' || element === '{' || element === '[' || element === '(' || element === '}' || element === ' as ' || element === '->' || element === '=>') {
                        newline.push(element);
                    }
                    else {
                        newline.push('@' + sourceid + 'L' + l + 'P' + length + ':::' + element);
                    }
                    length += element.length;
                }
                positions.push(newline);
            }
            var newlines = positions.map(function (line) {
                return line.join("");
            });
            lines = positions = undefined;
            return newlines.join("\r\n");
        },
        tidyPosition: function (string) {
            var _this = this;
            var _arguments = arguments;
            var on = true;
            while (on) {
                on = false;
                string = string.replace(/(@\d+L\d+P\d+O?\d*:::\s*)+(@\d+L\d+P0:::)/g, function (match, last, newline) {
                    on = true;
                    return "\r\n" + newline;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/[\r\n]*(@\d+L\d+P)0:::(\s+)/g, function (match, pre, space) {
                    on = true;
                    return "\r\n" + pre + space.length + 'O0:::';
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(@\d+L\d+P)(\d+):::(\s+)/g, function (match, pre, num, space) {
                    on = true;
                    return pre + (parseInt(num) + space.length) + 'O' + num + ':::';
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(\{|\[|\(|\)|\]|\})\s*@\d+L\d+P\d+O?\d*:::\s*(\)|\]|\})/g, function (match, before, atfer) {
                    on = true;
                    return before + atfer;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(@\d+L\d+P\d+O?\d*:::\s*)+(\)|\]|\})/g, function (match, posi, panbrackets) {
                    on = true;
                    return panbrackets;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(/(\s*@\d+L\d+P\d+O?\d*:::)+(,|;)/g, function (match, posi, panstop) {
                    on = true;
                    return panstop;
                });
            }
            string = string.replace(/::::/g, '::: :');
            return string;
        },
        encode: function (string) {
            var _this = this;
            var _arguments = arguments;
            string = string
                .replace(replaceExpRegPattern.typetag, function (match, gaps, preline, posi, gap, tag) {
                    _this.isMainBlock = false;
                    if (gaps) {
                        _this.maintag_posi = posi;
                        if (!!gap) {
                            _this.maintag_posi += 'O' + gap.length;
                        }
                    }
                    else {
                        _this.maintag_posi = '@0L0P0';
                    }
                    if (tag === 'module') {
                        _this.blockreserved.push('module');
                    }
                    else if (tag === 'native') {
                        _this.isNativeCode = true;
                    }
                    return '';
                })
                .replace(replaceExpRegPattern.namespace, function (match, linestart, posi, at, gap, namespace) {
                    if (_this.namespace === '') {
                        _this.namespace += namespace + '.';
                        _this.namespace_posi = at;
                        if (gap) {
                            _this.namespace_posi += 'O' + gap.length;
                        }
                        _this.namespace.replace(/^\.+/, '').replace(/\.+/, '.');
                    }
                    return '';
                });
            string = this.replaceUsing(string);
            string = this.replaceStrings(string);
            string = this.replaceIncludes(string);
            string = this.tidyPosition(string);
            string = string.replace(/(@\d+L\d+P\d+O?\d*:::)?((public|static|set|get|om)\s+)?___boundary_[A-Z0-9_]{36}_(\d+)_as_string___\s*(\:|\(|\=)/g, function (match, posi, desc, type, index, after) {
                if (_this.replacements[index][1]) {
                    return "\r\n" + _this.replacements[index][1] + '___boundary_' + index + '_as_propname___' + after;
                }
                if (desc) {
                    return "\r\n" + posi + desc + '___boundary_' + index + '_as_propname___' + after;
                }
                return "\r\n" + '___boundary_' + index + '_as_propname___' + after;
            });
            string = string
                .replace(/([\$a-zA-Z_][\$\w]*)\s*(->|=>)/g, "($1)$2")
                .replace(/\.\s*\(/g, "..storage.set(")
                .replace(/@\s*\(/g, "..storage.get(")
                .replace(/@\d+L\d+P\d+O?\d*:::@var\s+([\$a-zA-Z_][\$\w]*(\s*,\s*@\d+L\d+P\d+O?\d*:::[\$a-zA-Z_][\$\w]*)*);*/g, function (match, words) {
                    var vars = words.replace(/\s*@\d+L\d+P\d+O?\d*:::/g, '').split(',');
                    _this.xvars.push(...vars);
                    return '';
                });
            string = this.replaceBrackets(string);
            string = this.replaceBraces(string);
            string = this.replaceParentheses(string);
            string = string
                .replace(/@\d+L\d+P\d+O?\d*:::(___boundary_|$)/g, "$1")
                .replace(/@\d+L\d+P\d+O?\d*:::(___boundary_|$)/g, "$1")
                .replace(/\s*(,|;)\s*/g, "$1\r\n");
            return string;
        },
        replaceUsing: function (string) {
            var _this = this;
            var _arguments = arguments;
            return string.replace(replaceExpRegPattern.use, function (match, posi, $, url, as, alias, variables, posimembers, members) {
                if (_this.isNativeCode) {
                    _this.error('Native Code Not Support Use Expression');
                }
                var index = _this.replacements.length;
                if ($) {
                    if ($ === '@') {
                        url = '//' + url;
                    }
                    else {
                        url = '$_/' + url;
                    }
                }
                if (members) {
                    _this.pushBuffer([url, members, posi]);
                    return '___boundary_' + _this.uid + '_' + index + '_as_usings___;';
                }
                _this.pushBuffer([url, variables, posi]);
                return '___boundary_' + _this.uid + '_' + index + '_as_using___;';
            });
        },
        replaceWords: function (string) {
            var _this = this;
            var _arguments = arguments;
            return string.replace(replaceWords, function (match, posi, word, after) {
                var index = _this.replacements.length;
                if (word === 'else') {
                    _this.pushBuffer([word + ' ', posi && posi.trim()]);
                    return ";\r\n" + '@boundary_' + index + '_as_midword::' + after;
                }
                if (after === ';' || word === 'continue' || word === 'break') {
                    _this.pushBuffer([word + ';', posi && posi.trim()]);
                    return ";\r\n" + '@boundary_' + index + '_as_keyword::;';
                }
                _this.pushBuffer([word + ' ', posi && posi.trim()]);
                return ";\r\n" + '@boundary_' + index + '_as_preoperator::' + after;
            });
        },
        replaceIncludes: function (string) {
            var _this = this;
            var _arguments = arguments;
            if (this.sources.length) {
                var on = true;
                var id = this.sources.length - 1;
                var str = void 0;
                while (on) {
                    on = false;
                    string = string.replace(replaceExpRegPattern.include, function (match, type, index) {
                        on = true;
                        var context = _this.sources[id].src.replace(/[^\/\\]+$/, '');
                        var src = _this.readBuffer(index).replace(/('|"|`)/g, '').trim();
                        switch (type) {
                            case 'template':
                            if (_this.isNativeCode) {
                                _this.error('Native Code Not Support TPL File');
                            }
                            str = _this.getTplContent(src, context);
                            _this.replacements[index][0] = "'" + escape(str) + "'";
                            return 'new ..dom.Template(unescape(___boundary_' + _this.uid + '_' + index + '_as_string___));';
                            case 'include':
                            str = _this.onReadFile(src, context);
                            str = _this.markPosition(str, _this.sources.length - 1);
                            str = _this.replaceStrings(str);
                            str = _this.replaceIncludes(str);
                            return str + "\r\n";
                        };
                    });
                }
            }
            else {}
            return string;
        },
        onReadFile: function (source, context) {
            if (context === void 0) { context = void 0;}
            return "/* include '" + source + "' not be supported. */\r\n";
        },
        getTplContent: function (source, context) {
            if (context === void 0) { context = void 0;}
            return "";
        },
        replaceStrings: function (string, ignoreComments) {
            var _this = this;
            var _arguments = arguments;
            if (ignoreComments === void 0) { ignoreComments = false;}
            string = string.replace(/\\+(`|")/g, function (match) {
                var index = _this.replacements.length;
                _this.pushBuffer([match]);
                return '@boundary_' + index + '_as_mark::';
            }).replace(/\\+(`|")/g, function (match) {
                var index = _this.replacements.length;
                _this.pushBuffer([match]);
                return '@boundary_' + index + '_as_mark::';
            }).replace(/\[@\d+L\d+P\d+O?\d*:::\^\//g, '[^\/').replace(/(=|:)\s*\/=/g, '$1 /\\=').replace(/\\[^\r\n](@\d+L\d+P\d+O?\d*:::)*/g, function (match) {
                var index = _this.replacements.length;
                _this.pushBuffer([match]);
                return '@boundary_' + index + '_as_mark::';
            });
            var count = 0;
            var matches = string.match(matchExpRegPattern.string);
            while ((count < this.stringReplaceTimes) && matches) {
                count++;
                var index = this.replacements.length;
                switch (matches[1]) {
                    case '#':
                    string = string.replace(/(\S*)\s*\#.+/, "$1");
                    matches = string.match(matchExpRegPattern.string);
                    continue;
                    case '/':
                    switch (matches[2]) {
                        case '*':
                        if (ignoreComments) {
                            string = string.replace(/\/\*{1,2}[\s\S]*?(\*\/|$)/, function (match) {
                                _this.pushBuffer([match]);
                                return '@boundary_' + index + '_as_comments::';
                            });
                        }
                        else {
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
                var match = string.match(matchExpRegPattern.strings[matches[1]]);
                if (match && (matches.index >= match.index)&& !match[5]) {
                    if (matches[1] === '`') {
                        string = string.replace(match[2], this.replaceTemplate(match[2]));
                    }
                    else {
                        if (match[1]) {
                            this.pushBuffer([match[2].replace(/@\d+L\d+P\d+O?\d*:::/g, ''), match[1].trim(), match[4]]);
                        }
                        else {
                            this.pushBuffer([match[2].replace(/@\d+L\d+P\d+O?\d*:::/g, ''), void 0, match[4]]);
                        }
                        string = string.replace(match[0], '___boundary_' + this.uid + '_' + index + stringas[matches[1]] + match[3]);
                    }
                }
                else if (matches[1] === '`' && match) {
                    string = string.replace(match[2], this.replaceTemplate(match[2]));
                }
                else if (matches[0] === '/') {
                    string = string.replace(matches[0], '@boundary_2_as_operator::');
                }
                else {
                    this.error('Unexpected `' + matches[1] + '` in `' + this.decode(string.substr(matches.index)).substr(0, 256) + '`');
                }
                matches = string.match(matchExpRegPattern.string);
            }
            matches = undefined;
            return string;
        },
        replaceTemplate: function (string) {
            var _this = this;
            var _arguments = arguments;
            var lines = string.replace(/"/g, function () {
                return '"';
            }).replace(/`/g, '').split(/\r{0,1}\n/);
            var codes = [];
            if (this.last_closed && this.last_opens.length) {
                var i = this.last_opens.length - 1;
                var opens = this.last_opens[i];
                this.last_opens.length = i;
            }
            else {
                var opens = 0;
            }
            for (var index = 0;index < lines.length;index++) {
                var posi = '';
                var line = lines[index].replace(/@\d+L\d+P\d+O?\d*:::/g, function (_posi) {
                    if (!posi) {
                        posi = _posi;
                    }
                    return '';
                });
                if (line) {
                    var elements = line.split(/(\$\{|\{|\})/);
                    var type = void 0;var lasttype = void 0;
                    var inline = [];
                    var code = posi;
                    for (var e = 0;e < elements.length;e++) {
                        var element = elements[e];
                        if (opens === 0 && element === '${') {
                            opens++;
                            this.total_opens++;
                        }
                        else if (opens && element === '{') {
                            opens++;
                            this.total_opens++;
                            inline[inline.length - 1].value += '{';
                        }
                        else if (opens && element === '}') {
                            opens--;
                            this.total_opens--;
                            if (opens) {
                                inline[inline.length - 1].value += '}';
                            }
                        }
                        else {
                            if (opens === 0) {
                                type = 'string';
                            }
                            else {
                                type = 'code';
                            }
                            if (type === lasttype) {
                                inline[inline.length - 1].value += element;
                            }
                            else {
                                inline.push({
                                    type: type,
                                    value: element
                                });
                            }
                            lasttype = type;
                        }
                    }
                    for (var c = 0;c < inline.length;c++) {
                        if (c) {
                            code += '@boundary_6_as_operator::';
                        }
                        if (inline[c].type === 'string') {
                            code += '"' + inline[c].value + '"';
                        }
                        else {
                            code += inline[c].value.replace(/"/g, '"');
                        }
                    }
                    codes.push(code.replace(/""@boundary_6_as_operator::/g, '').replace(/@boundary_6_as_operator::""$/, ''));
                }
            }
            if (opens) {
                this.last_closed = false;
                this.last_opens.push(opens);
            }
            else {
                this.last_closed = true;
            }
            if (this.total_opens) {
                var after = '`';
            }
            else {
                var after = '';
            }
            string = codes.join('@boundary_6_as_operator::___boundary_' + this.uid + '_8_as_string___' + '@boundary_6_as_operator::;' + "\r\n");
            string = string.replace(/"@boundary_6_as_operator::___boundary_[A-Z0-9_]{36}_8_as_string___/g, '\\r\\n"');
            string = this.replaceStrings(string) + after;
            codes = undefined;
            return string;
        },
        replaceBrackets: function (string) {
            var _this = this;
            var _arguments = arguments;
            var left = string.indexOf('[');
            var right = string.indexOf(']');
            var count = 0;
            while ((count < this.stringReplaceTimes) && (left >= 0)) {
                count++;
                if (left < right) {
                    string = string.replace(replaceExpRegPattern.array, function (match, posi, elements) {
                        var index = _this.replacements.length;
                        _this.pushBuffer(['[' + elements + ']', posi && posi.trim()]);
                        return '___boundary_' + _this.uid + '_' + index + '_as_list___';
                    }).replace(replaceExpRegPattern.arraylike, function (match, posi, elements) {
                        elements = _this.replaceBraces(elements);
                        elements = _this.replaceParentheses(elements);
                        var index = _this.replacements.length;
                        _this.pushBuffer(['[' + elements + ']', posi && posi.trim()]);
                        return '___boundary_' + _this.uid + '_' + index + '_as_arraylike___';
                    });
                    left = string.indexOf('[');
                    right = string.indexOf(']');
                }
                else {
                    if (right >= 0) {
                        var index = right;
                    }
                    else {
                        var index = left;
                    }
                    this.error('Unexpected `' + (right >= 0 ? ']':'[') + '` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
                }
            }
            if (right >= 0) {
                var index = right;
                this.error('Unexpected `]` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
            }
            return string;
        },
        replaceBraces: function (string) {
            var left = string.indexOf('{');
            var right = string.indexOf('}');
            var count = 0;
            while ((count < this.stringReplaceTimes) && (left >= 0)) {
                count++;
                if (left < right) {
                    string = this.replaceCodeSegments(string);
                    string = this.recheckFnOrCallLikes(string);
                    left = string.indexOf('{');
                    right = string.indexOf('}');
                }
                else {
                    if (right >= 0) {
                        var index = right;
                    }
                    else {
                        var index = left;
                    }
                    this.error('Unexpected `' + (right >= 0 ? '}':'{') + '` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
                }
            }
            if (right >= 0) {
                var index = right;
                this.error('Unexpected `}` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
            }
            return string;
        },
        replaceCodeSegments: function (string) {
            var _this = this;
            var _arguments = arguments;
            var matched = false;
            string = string.replace(replaceExpRegPattern.class, function (match, posi, body) {
                matched = true;
                body = _this.replaceParentheses(body);
                var index = _this.replacements.length;
                _this.pushBuffer([body, posi && posi.trim()]);
                return '___boundary_' + _this.uid + '_' + index + '_as_class___';
            });
            if(matched) return string;
            string = string.replace(replaceExpRegPattern.extends, function (match, posi, exp, name, node, assign, closure) {
                matched = true;
                name = name.replace(/^\.+/, '');
                exp = exp.replace(/\s+/, '');
                var body = void 0;
                if (assign) {
                    if (exp === 'extends') {
                        _this.error('Unexpected `extends`: extends ' + name + ' with');
                    }
                    else {
                        if (node && node.length === 2) {
                            body = 'globalassign ' + name + '{' + _this.replaceParentheses(closure) + '}';
                        }
                        else {
                            body = 'nsassign ' + name + '{' + _this.replaceParentheses(closure) + '}';
                        }
                    }
                }
                else {
                    if (exp === 'extends') {
                        if (node) {
                            if (node.length === 2) {
                                body = 'globalassign ' + name + '{' + _this.replaceParentheses(closure) + '}';
                            }
                            else {
                                body = 'nsassign ' + name + '{' + _this.replaceParentheses(closure) + '}';
                            }
                        }
                        else {
                            body = 'extends ' + name + '{' + _this.replaceParentheses(closure) + '}';
                        }
                    }
                    else {
                        if (node && node.length === 2) {
                            if (exp === 'voidns' || exp === 'voidnamespace') {
                                body = 'voidglobal ' + name + '{' + _this.replaceParentheses(closure) + '}';
                            }
                            else {
                                body = 'global ' + name + '{' + _this.replaceParentheses(closure) + '}';
                            }
                        }
                        else {
                            if (exp === 'voidns' || exp === 'voidnamespace') {
                                body = 'voidns ' + name + '{' + _this.replaceParentheses(closure) + '}';
                            }
                            else {
                                body = 'ns ' + name + '{' + _this.replaceParentheses(closure) + '}';
                            }
                        }
                    }
                }
                var index = _this.replacements.length;
                _this.pushBuffer([body, posi && posi.trim()]);
                return '___boundary_' + _this.uid + '_' + index + '_as_extends___';
            });
            if(matched) return string;
            string = string.replace(replaceExpRegPattern.anonspace, function (match, posi, exp, closure) {
                matched = true;
                exp = exp.replace(/\s+/, '');
                if (exp === 'voidns' || exp === 'voidnamespace') {
                    var body = 'voidanonspace {' + _this.replaceParentheses(closure) + '}';
                }
                else {
                    var body = 'anonspace {' + _this.replaceParentheses(closure) + '}';
                }
                var index = _this.replacements.length;
                _this.pushBuffer([body, posi && posi.trim()]);
                return '___boundary_' + _this.uid + '_' + index + '_as_extends___';
            });
            if(matched) return string;
            string = string.replace(replaceExpRegPattern.fnlike, function (match, posi, definition, type, call, callname, closure) {
                matched = true;
                closure = _this.replaceParentheses(closure);
                call = _this.replaceOperators(call);
                match = (definition || '') + call + ' {' + closure + '}';
                var index = _this.replacements.length;
                _this.pushBuffer([match, posi && posi.trim()]);
                return '___boundary_' + _this.uid + '_' + index + '_as_function___';
            });
            if(matched) return string;
            string = string.replace(replaceExpRegPattern.object, function (match, posi, closure) {
                matched = true;
                var index = _this.replacements.length;
                _this.pushBuffer([match, posi && posi.trim()]);
                return '___boundary_' + _this.uid + '_' + index + '_as_sets___';
            });
            if(matched) return string;
            return string.replace(replaceExpRegPattern.closure, function (match, posi1, word, posi3, closure) {
                closure = _this.replaceParentheses(closure);
                posi1 = posi1 ? posi1.trim():'';
                posi3 = posi3 ? posi3.trim():'';
                var index = _this.replacements.length;
                var index2 = void 0;
                switch (word) {
                    case undefined:
                    if ((closure.indexOf(';') >= 0)||
                    !closure.match(/^\s*(@\d+L\d+P\d+O?\d*:::)?(___boundary_[A-Z0-9_]{36}_\d+_as_function___|[\$a-zA-Z_][\$\w]*\s*(,|:|$))/)) {
                        _this.pushBuffer(['{' + closure + '}', posi3]);
                        return posi1 + (word || '') + posi3 + ' ___boundary_' + _this.uid + '_' + index + '_as_closure___';
                    }
                    if (closure.match(/^\s*___boundary_[A-Z0-9_]{36}_\d+_as_function___\s*$/)) {
                        _this.pushBuffer(['{' + closure + '}', posi3]);
                        return posi1 + (word || '') + posi3 + ' ___boundary_' + _this.uid + '_' + index + '_as_objlike___';
                    }
                    _this.pushBuffer(['{' + closure + '}', posi3]);
                    return '___boundary_' + _this.uid + '_' + index + '_as_object___';
                    case '=':
                    _this.pushBuffer(['{' + closure + '}']);
                    return '= ___boundary_' + _this.uid + '_' + index + '_as_object___';
                    case '@config':
                    if (_this.configinfo === '{}') {
                        _this.configinfo_posi = posi1 || posi3;
                        _this.configinfo = _this.decode(match.replace('@config', ''));
                    }
                    return '';
                    case 'return':
                    case 'typeof':
                    _this.pushBuffer([word + ' ', posi1]);
                    index2 = _this.replacements.length;
                    _this.pushBuffer(['{' + closure + '}']);
                    return '@boundary_' + index + '_as_preoperator::___boundary_' + _this.uid + '_' + index2 + '_as_object___';
                    case 'do':
                    case 'try':
                    _this.pushBuffer([word + ' ', posi1]);
                    index2 = _this.replacements.length;
                    _this.pushBuffer(['{' + closure + '}', posi3]);
                    return '; @boundary_' + index + '_as_keyword::___boundary_' + _this.uid + '_' + index2 + '_as_closure___;';
                    case 'else':
                    case 'finally':
                    _this.pushBuffer([word + ' ', posi1]);
                    index2 = _this.replacements.length;
                    _this.pushBuffer(['{' + closure + '}', posi3]);
                    return ";\r\n" + '@boundary_' + index + '_as_midword::___boundary_' + _this.uid + '_' + index2 + '_as_closure___';
                    default:
                    if (word.indexOf('(') === 0) {
                        _this.pushBuffer(['{' + closure + '}', posi3]);
                        return word + '___boundary_' + _this.uid + '_' + index + '_as_object___';
                    }
                    _this.pushBuffer(['{' + closure + '}', posi3]);
                    return posi1 + word + ";\r\n" + posi3 + '___boundary_' + _this.uid + '_' + index + '_as_closure___;';
                };
            });
        },
        replaceParentheses: function (string) {
            var _this = this;
            var _arguments = arguments;
            string = this.replaceWords(string);
            var left = string.indexOf('(');
            var right = string.indexOf(')');
            var count = 0;
            while ((count < this.stringReplaceTimes) && (left >= 0)) {
                count++;
                if (left < right) {
                    string = string.replace(replaceExpRegPattern.parentheses, function (match, posi, argslike) {
                        argslike = _this.replaceOperators(argslike);
                        argslike = _this.replaceCalls(argslike);
                        argslike = _this.replaceArrowFunctions(argslike);
                        var index = _this.replacements.length;
                        _this.pushBuffer(['(' + argslike + ')', posi && posi.trim()]);
                        return '___boundary_' + _this.uid + '_' + index + '_as_parentheses___';
                    });
                    string = this.recheckFnOrCallLikes(string);
                    left = string.indexOf('(');
                    right = string.indexOf(')');
                }
                else {
                    if (right >= 0) {
                        var index = right;
                    }
                    else {
                        var index = left;
                    }
                    this.error('Unexpected `' + (right >= 0 ? ')':'(') + '` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
                }
            }
            if (right >= 0) {
                var index = right;
                this.error('Unexpected `)` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
            }
            string = this.replaceOperators(string);
            string = this.replaceCalls(string);
            string = this.replaceArrowFunctions(string);
            return string;
        },
        recheckFnOrCallLikes: function (string) {
            var _this = this;
            var _arguments = arguments;
            string = string.replace(replaceExpRegPattern.recheckfn, function (posi) {
                var fnlike = posi + fname + _this.replacements[parenthesesindex][0].toString() + _this.replacements[closureindex][0].toString();
                var index = _this.replacements.length;
                _this.pushBuffer([fnlike, posi]);
                return '___boundary_' + _this.uid + '_' + index + '_as_function___ ';
            }).replace(replaceExpRegPattern.expression, function (match, posi, expname, exp, expindex, closure, closureindex) {
                var expressioncontent = _this.readBuffer(expindex);
                var body = _this.readBuffer(closureindex);
                var index = _this.replacements.length;
                _this.pushBuffer([expname + expressioncontent + body, posi]);
                return '___boundary_' + _this.uid + '_' + index + '_as_expression___';
            }).replace(replaceExpRegPattern.if, function (match, posi, parentheses) {
                var index = _this.replacements.length;
                _this.pushBuffer(['if ' + parentheses, posi]);
                return '___boundary_' + _this.uid + '_' + index + '_as_if___ ';
            });
            return string;
        },
        replaceCalls: function (string) {
            var _this = this;
            var _arguments = arguments;
            string = string.replace(replaceExpRegPattern.clog, function (match, posi, args) {
                var index1 = _this.replacements.length;
                _this.pushBuffer(['(' + args + ')', undefined]);
                var index2 = _this.replacements.length;
                _this.pushBuffer(['log___boundary_' + _this.uid + '_' + index1 + '_as_parentheses___', undefined]);
                var index3 = _this.replacements.length;
                _this.pushBuffer(['.___boundary_' + _this.uid + '_' + index2 + '_as_callmethod___', posi]);
                return '___boundary_' + _this.uid + '_' + index3 + '_as_log___;';
            });
            return this.replaceCallsChain(string.replace(replaceExpRegPattern.call, function (match, posi, fullname, constructor, methodname, dot, callname, args, argindex, after) {
                if (fullname.match(/^___boundary_[A-Z0-9_]{36}_\d+_as_(if|class|object|closure)___/)) {
                    return match;
                }
                var index = _this.replacements.length;
                if (constructor) {
                    _this.pushBuffer([fullname + args, posi && posi.trim()]);
                    return '___boundary_' + _this.uid + '_' + index + '_as_construct___' + after;
                }
                else {
                    _this.pushBuffer([callname + args, posi && posi.trim()]);
                    if (dot) {
                        return '.___boundary_' + _this.uid + '_' + index + '_as_callmethod___' + after;
                    }
                    else if (callname === 'if') {
                        return '___boundary_' + _this.uid + '_' + index + '_as_if___ ' + after;
                    }
                    return '___boundary_' + _this.uid + '_' + index + '_as_call___' + after;
                };
            }));
        },
        replaceCallsChain: function (string) {
            var _this = this;
            var _arguments = arguments;
            return string.replace(replaceExpRegPattern.callschain, function (match, posi, _index) {
                var index = _this.replacements.length;
                match = match.replace(/_as_call___/g, '_as_callmethod___');
                _this.pushBuffer([match, posi || _this.replacements[_index][1]]);
                return '___boundary_' + _this.uid + '_' + index + '_as_callschain___';
            });
        },
        replaceArrowFunctions: function (string) {
            var _this = this;
            var _arguments = arguments;
            var arrowcodes = string.match(/(->|=>)/);
            if (arrowcodes) {
                if (string.match(replaceExpRegPattern.arrowfn)) {
                    return string.replace(replaceExpRegPattern.arrowfn, function (match, args, argsindex, arrow, body, end) {
                        var posi = _this.replacements[argsindex][1];
                        var matches = body.match(/^(@\d+L\d+P\d+O*\d*:::)?\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_(parentheses|object|closure)___\s*$/);
                        if (matches) {
                            var code = _this.replacements[matches[2]][0].toString();
                            var posi_204 = _this.replacements[matches[2]][1];
                            if (matches[3] === 'parentheses') {
                                body = code.replace(/^\(\s*(.*?)\s*\)$/, function (match, code) {
                                    var index = _this.replacements.length;
                                    _this.pushBuffer(['return ', posi_204]);
                                    return '@boundary_' + index + '_as_preoperator:: ' + code;
                                });
                            }
                            else {
                                body = code.replace(/(^\{|\}$)/g, '');
                            }
                        }
                        else {
                            var index_208 = _this.replacements.length;
                            _this.pushBuffer(['return ', void 0]);
                            body = '@boundary_' + index_208 + '_as_preoperator:: ' + body;
                        }
                        var index = _this.replacements.length;
                        _this.pushBuffer([args + arrow + body, posi]);
                        return '___boundary_' + _this.uid + '_' + index + '_as_arrowfn___' + end;
                    });
                }
                else {
                    this.error('Unexpected `' + arrowcodes[0] + '` in `' + this.decode(string.substr(arrowcodes.index, 256)) + '`');
                }
            }
            arrowcodes = undefined;
            return string;
        },
        replaceOperators: function (string) {
            var _this = this;
            var _arguments = arguments;
            var on = true;
            while (on) {
                on = false;
                string = string.replace(operators.owords, function (match, posi, word) {
                    on = true;
                    var index = _this.replacements.length;
                    _this.pushBuffer([' ' + word + ' ']);
                    return '@boundary_' + index + '_as_operator::';
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.swords, function (match, before, word, right) {
                    on = true;
                    var index = _this.replacements.length;
                    if (word === 'instanceof') {
                        _this.pushBuffer([' ' + word + ' ']);
                        before = before.trim();
                        return before + '@boundary_' + index + '_as_operator::' + right;
                    }
                    else {
                        _this.pushBuffer([word + ' ']);
                    }
                    return before + '@boundary_' + index + '_as_preoperator::' + right;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.mixed, function (match, left, posi, op, right, posir, sign) {
                    on = true;
                    if (sign) {
                        var _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '@boundary_' + _index + '_as_preoperator::');
                    }
                    var index = _this.replacements.length;
                    _this.pushBuffer([' ' + op + '= ', posi]);
                    return left + '@boundary_' + index + '_as_operator::' + right;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.bool, function (match, left, posi, op, right, posir, sign) {
                    on = true;
                    if (sign) {
                        var _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '@boundary_' + _index + '_as_preoperator::');
                    }
                    var index = _this.replacements.length;
                    _this.pushBuffer([' ' + op + ' ', posi]);
                    return left + '@boundary_' + index + '_as_operator::' + right;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.op, function (match, left, posi, op, right, posir, sign) {
                    on = true;
                    if (sign) {
                        var _index = sign === '+' ? 3 : 4;
                        right = right.replace(sign, '@boundary_' + _index + '_as_preoperator::');
                    }
                    var index = _this.replacements.length;
                    _this.pushBuffer([' ' + op + ' ', posi]);
                    return left + '@boundary_' + index + '_as_operator::' + right;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.sign, function (match, before, sign, number) {
                    on = true;
                    var index = sign === '+' ? 3 : 4;
                    return before + '@boundary_' + index + '_as_preoperator::' + number;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.before, function (match, op, number) {
                    on = true;
                    var index = _this.replacements.length;
                    _this.pushBuffer([op]);
                    return '@boundary_' + index + '_as_preoperator::' + number;
                });
            }
            on = true;
            while (on) {
                on = false;
                string = string.replace(operators.after, function (match, number, posi, op) {
                    on = true;
                    var index = _this.replacements.length;
                    _this.pushBuffer([op]);
                    return number + (posi || '') + '@boundary_' + index + '_as_aftoperator::';
                });
            }
            return string.replace(operators.error, function (match, before, op, after) {
                if (after && after.indexOf('>') === 0) {
                    return match;
                }
                _this.error('Unexpected `' + op + '` in `' + _this.decode(match) + '`');
                return '';
            });
        },
        getPosition: function (string) {
            if (string) {
                var match = string.match(/@(\d+)L(\d+)P(\d+)(O*)(\d*):{0,3}/);
                if (match) {
                    if (match[4]) {
                        var index = parseInt(match[5]);
                    }
                    else {
                        var index = parseInt(match[3]);
                    }
                    return {
                        match: match[0],
                        head: !index,
                        file: parseInt(match[1]),
                        line: parseInt(match[2]) + 1,
                        col: parseInt(match[3]) + 1,
                        o: [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), index]
                    };
                }
            }
            return void 0;
        },
        pickReplacePosis: function (lines, vars) {
            var imports = [];
            var using_as = {};
            var preast = [];
            for (var index = 0;index < lines.length;index++) {
                switch (lines[index].subtype) {
                    case 'sentence':
                    var code = lines[index].value.trim();
                    this.pushSentencesToPREAST(preast, vars, code, lines[index].display, lines[index].posi);
                    break;
                    case 'variable':
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
                    var posi = this.replacements[lines[index].index][2];
                    var src = this.replacements[lines[index].index][0].toString().trim();
                    if (!imports['includes'](src)) {
                        imports.push(src);
                        imports.push(posi);
                    }
                    if (this.replacements[lines[index].index][1]) {
                        var position = void 0;
                        var alias = void 0;
                        if (lines[index].subtype === 'usings') {
                            var members = this.replacements[lines[index].index][1].split(',');
                            for (var m = 0;m < members.length;m++) {
                                position = this.getPosition(members[m]);
                                alias = members[m].replace(position.match, '').trim();
                                using_as[alias] = [src, alias, position];
                            }
                        }
                        else {
                            position = this.getPosition(this.replacements[lines[index].index][1]);
                            alias = this.replacements[lines[index].index][1].replace(position.match, '').trim();
                            using_as[alias] = [src, '*', position];
                        }
                        if (vars.self[alias] === void 0) {
                            vars.self[alias] = 'var';
                        }
                        else if (vars.self[alias] === 'let') {
                            if (position) {
                                this.error(' Variable `' + alias + '` has already been declared at char ' + position.col + ' on line ' + position.line + '.');
                            }
                            this.error(' Variable `' + alias + '` has already been declared.');
                        }
                    }
                    break;
                    default:
                    preast.push([{
                        index: lines[index].index,
                        display: lines[index].display,
                        type: lines[index].subtype
                    }]);
                    break;
                }
            }
            this.imports = imports;
            this.using_as = using_as;
            imports = using_as = undefined;
            return preast;
        },
        pickTretOfMatch: function (match_as_statement, isblock) {
            if (isblock === void 0) { isblock = true;}
            var tret_of_match = match_as_statement[3].trim();
            if (
            tret_of_match
            && !(tret_of_match === ';' && ['closure', 'if']['includes'](match_as_statement[2]))
            && !(tret_of_match === ';'&&!isblock && ['class', 'function']['includes'](match_as_statement[2]))) {
                return [{
                    index: match_as_statement[1],
                    display: 'inline',
                    type: match_as_statement[2]
                }, tret_of_match];
            }
            return null;
        },
        getLines: function (string, vars, inOrder) {
            if (inOrder === void 0) { inOrder = false;}
            string = string
                .replace(/:::(var|let|const|public)\s+(@\d+L\d+P(\d+O)?0:::)/g, ':::$1 ')
                .replace(/([^,;\s])\s*(@\d+L\d+P(\d+O)?0:::[^\.\(\[)])/g, '$1;$2')
                .replace(/(___boundary_[A-Z0-9_]{36}_\d+_as_(if)___)[;\s]*/g, "$1 ")
                .replace(/[;\r\n]+(___boundary_[A-Z0-9_]{36}_\d+_as_(expression|if|class|function|extends|call|log|object|objlike|closure|parentheses)___)/g, ";$1")
                .replace(/(___boundary_[A-Z0-9_]{36}_\d+_as_(log|closure|function)___)[;\r\n]+/g, "$1;\r\n")
                .replace(/[;\r\n]+((@\d+L\d+P\d+O?\d*:::)?___boundary_[A-Z0-9_]{36}_\d+_as_(callschain)___)/g, "$1")
                .trim();
            var sentences = string.split(/\s*;+\s*/);
            var lines = [];
            for (var s = 0;s < sentences.length;s++) {
                var sentence = sentences[s].trim();
                if (sentence) {
                    var array = sentence.split(/:::(var|let|const|public)\s+/);
                    if (array.length === 1) {
                        var definition = sentence.match(/(^|\s+)(var|let|const|public)(\s+|$)/);
                        if (definition) {
                            var definitions = sentence.match(/(@boundary_\d+_as_midword::|(@boundary_\d+_as_midword::\s*)?___boundary_[A-Z0-9_]{36}_\d+_as_(if|closure)___)\s*(var|let|const|public)\s+([\s\S]+)/);
                            if (definitions) {
                                this.pushSentenceToLines(lines, definitions[1], 'inline');
                                this.pushVariablesToLines(lines, vars, undefined, definitions[5], definitions[4], true);
                                continue;
                            }
                            this.error('Unexpected `' + definition[1] + '` in `' + this.decode(sentence) + '`.');
                        }
                        else {
                            this.pushSentenceToLines(lines, sentence, (inOrder && (s === sentences.length - 1)) ? 'inline':'block');
                        }
                        definition = undefined;
                    }
                    else if (array.length === 3) {
                        this.pushVariablesToLines(lines, vars, array[0], array[2], array[1], inOrder);
                    }
                    else {
                        var position = this.getPosition(array[2]);
                        this.error('Unexpected `' + array[3] + '` at char ' + position.col + ' on line ' + position.line + '， near ' + this.decode(array[2]) + '.');
                    }
                }
            }
            return lines;
        },
        pushSentenceToLines: function (lines, code, display) {
            value = code.trim();
            if (value && !value.match(/^@\d+L\d+P\d+O?\d*:::$/)) {
                var match_as_statement = value.match(/^(@\d+L\d+P\d+O?\d*:::)?\s*___boundary_[A-Z0-9_]{36}_(\d+)_as_([a-z]+)___([\r\n]+|$)/);
                if (match_as_statement) {
                    if (display === 'block'&& !['class', 'function', 'closure', 'if']['includes'](match_as_statement[3])) {
                        value = value + ';';
                    }
                    this.replacements[match_as_statement[2]][1] = this.replacements[match_as_statement[2]][1] || match_as_statement[1];
                    lines.push({
                        type: 'line',
                        subtype: match_as_statement[3],
                        display: display,
                        index: match_as_statement[2]
                    });
                }
                else {
                    if ((display === 'block')&& !/_as_closure___$/.test(value)) {
                        value += ';';
                    }
                    else if (/_as_aftoperator::$/.test(value)) {
                        value += ';';
                        display === 'block';
                    };
                    var clauses = value.split(',');
                    for (var c = 0;c < clauses.length;c++) {
                        var element = clauses[c];
                        var position = this.getPosition(element);
                        if (position) {
                            if (display === 'block') {
                                position.head = true;
                            }
                            var value = element.replace(position.match, '');
                        }
                        else {
                            var value = element.trim();
                            var match_as_mark = value.match(/^@boundary_(\d+)_as_([a-z]+)::/);
                            if (match_as_mark && this.replacements[match_as_mark[1]][1]) {
                                position = this.getPosition(this.replacements[match_as_mark[1]][1]);
                                if (position && (display === 'block')) {
                                    position.head = true;
                                }
                            }
                        }
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
            };
        },
        pushVariablesToLines: function (lines, vars, posi, code, symbol, inOrder) {
            if (inOrder === void 0) { inOrder = false;}
            var display = void 0;
            var clauses = code.split(/,\s*(@\d+L\d+P\d+O?\d*:::)*/);
            clauses.unshift(posi);
            for (var c = 0;c < clauses.length;c += 2) {
                if (inOrder) {
                    if (c) {
                        if (c === clauses.length - 2) {
                            display = 'last';
                        }
                        else {
                            display = 'inline';
                        }
                    }
                    else {
                        if (c === clauses.length - 2) {
                            display = 'block';
                        }
                        else {
                            display = 'first';
                        }
                    }
                }
                else {
                    display = 'block';
                }
                this.pushVariableToLines(lines, vars, clauses[c], clauses[c + 1], symbol, display);
            }
            display = clauses = undefined;
        },
        pushVariableToLines: function (lines, vars, posi, code, symbol, display) {
            if (display === void 0) { display = 'block';}
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
            };
        },
        pushVariableToLine: function (lines, vars, code, symbol, posi, display, _symbol, endmark) {
            if (posi === void 0) { posi = '';}
            if (display === void 0) { display = 'inline';}
            if (_symbol === void 0) { _symbol = '';}
            if (endmark === void 0) { endmark = ',';}
            if (code) {
                var position = this.getPosition(posi);
                var match = code.match(/^([\$\a-zA-Z_][\$\w]*)@boundary_(\d+)_as_operator::/);
                if (match && ['in', 'of']['includes'](this.replacements[match[2]][0].toString().trim())) {
                    var element = match[1];
                    lines.push({
                        type: 'line',
                        subtype: 'sentence',
                        display: 'inline',
                        posi: void 0,
                        value: _symbol + ' ' + code
                    });
                    this.pushVariableToVars(vars, symbol, element, position);
                    element = undefined;
                }
                else {
                    var array = code.split(/\s*=\s*/);
                    if (array.length === 1) {
                        var value = 'void 0';
                    }
                    else {
                        var value = array.pop();
                    }
                    for (var index = 0;index < array.length;index++) {
                        var element = array[index].trim();
                        if (index) {
                            lines.push({
                                type: 'line',
                                subtype: 'sentence',
                                posi: position,
                                display: 'inline',
                                value: element + ' = '
                            });
                        }
                        else {
                            var match_295 = element.match(/^___boundary_[A-Z0-9_]{36}_(\d+)_as_(sets|list)___$/);
                            if (match_295) {
                                return this.pushVariablesToLine(lines, vars, match_295, symbol, _symbol, value, position, endmark);
                            }
                            else if (element.match(/^[\$a-zA-Z_][\$\w]*$/)) {
                                this.pushVariableToVars(vars, symbol, element, position);
                                lines.push({
                                    type: 'line',
                                    subtype: 'variable',
                                    display: 'inline',
                                    posi: position,
                                    value: _symbol + ' ' + element + ' = '
                                });
                            }
                            else {
                                if (this.sources[position.file]) {
                                    this.error('Unexpected Definition `' + symbol + '` at char ' + position.col + ' on line ' + position.line + ' in file [' + position.file + '][' + this.sources[position.file].src + '].');
                                }
                                else {
                                    this.error('Unexpected Definition `' + symbol + '` at char ' + position.col + ' on line ' + position.line + '.');
                                }
                            }
                            match_295 = undefined;
                        }
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
            };
        },
        pushVariablesToLine: function (lines, vars, match, symbol, _symbol, value, position, endmark) {
            if (_symbol === void 0) { _symbol = '';}
            if (endmark === void 0) { endmark = ',';}
            var type = void 0;var elements = [];
            if (match[2] === 'sets') {
                var closure = this.replacements[match[1]][0].toString().replace(/(\{|\})/g, '');
                if (/\.+/.test(closure)) {
                    type = '...';
                }
                else {
                    type = 'object';
                }
                elements = closure.split(',');
                closure = undefined;
            }
            else {
                type = 'array';
                elements = this.replacements[match[1]][0].toString().replace(/(\[|\])/g, '').split(',');
            }
            value = this.pushVariableValueToLine(lines, vars, type, symbol, _symbol, value, position, endmark);
            for (var i = 0;i < elements.length;i++) {
                var position_307 = this.getPosition(elements[i]);
                var element = elements[i].replace(position_307.match, '').trim();
                if (element.indexOf('.') >= 0) {
                    this.pushSetsToVars(lines, vars, type, i, symbol, _symbol, element, value, position_307, endmark);
                    break;
                }
                else {
                    this.pushSetToVars(lines, vars, type, i, elements.length, symbol, _symbol, element, value, position_307, endmark);
                }
                position_307 = element = undefined;
            }
            type = elements = undefined;
        },
        pushVariableValueToLine: function (lines, vars, type, symbol, _symbol, value, position, endmark) {
            var anonvar = void 0;
            if (value.match(/^[\$a-zA-Z_][\$\w]*(\s*\.\s*[\$a-zA-Z_][\$\w]*)*$/)&& !value.match(/___boundary_[A-Z0-9_]{36}_(\d+)_as_[a-z]+___/)) {
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
            }
            else {
                this.anonymous_variables++;
                anonvar = '_ανώνυμος_variable_' + this.anonymous_variables;
                while (hasProp(vars.self, anonvar)) {
                    this.anonymous_variables++;
                    anonvar = '_ανώνυμος_variable_' + this.anonymous_variables;
                }
                position.head = true;
                this.pushVariableToVars(vars, symbol, anonvar, position);
                lines.push({
                    type: 'line',
                    subtype: 'variable',
                    display: 'inline',
                    posi: position,
                    value: _symbol + ' ' + anonvar + ' = '
                }, {
                    type: 'line',
                    subtype: 'sentence',
                    display: 'inline',
                    posi: void 0,
                    value: value + endmark
                });
                return anonvar;
            };
        },
        pushSetToVars: function (lines, vars, type, index, length, symbol, _symbol, variable, value, position, endmark) {
            var _value = void 0;var __value = void 0;
            if (type === '...') {
                _value = 'pandora.remove(' + value + ', \'' + variable + '\')';
            }
            else if (type === 'object') {
                _value = value + '.' + variable;
            }
            else {
                _value = value + '[' + index + ']';
            }
            this.pushVariableToVars(vars, symbol, variable, position);
            if (index) {
                if (index === length - 1) {
                    __value = ', ' + variable + ' = ' + _value + endmark;
                }
                else {
                    __value = ', ' + variable + ' = ' + _value;
                }
            }
            else {
                position.head = true;
                __value = _symbol + ' ' + variable + ' = ' + _value;
                if (length === 1) {
                    __value += endmark;
                }
            }
            _value = undefined;
            lines.push({
                type: 'line',
                subtype: 'variable',
                display: 'inline',
                posi: position,
                value: __value
            });
        },
        pushSetsToVars: function (lines, vars, type, index, symbol, _symbol, variable, value, position, endmark) {
            var _value = void 0;var __value = void 0;
            variable = variable.replace(/\.+/, '');
            if (type === '...') {
                if (index) {
                    __value = ', ' + variable + ' = ' + value + endmark;
                }
                else {
                    position.head = true;
                    __value = _symbol + ' ' + variable + ' = ' + value;
                }
            }
            else {
                _value = 'pandora.slice(' + value + ', ' + index + ')';
                if (index) {
                    __value = ', ' + variable + ' = ' + _value + endmark;
                }
                else {
                    position.head = true;
                    __value = _symbol + ' ' + variable + ' = ' + _value;
                }
            }
            _value = variable = undefined;
            lines.push({
                type: 'line',
                subtype: 'variable',
                display: 'inline',
                posi: position,
                value: __value
            });
        },
        pushVariableToVars: function (vars, symbol, variable, position) {
            if (vars.self[variable] !== void 0) {
                if (vars.self[variable] === 'let' || symbol === 'let') {
                    if (position) {
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
            }
            else {
                vars.self[variable] = symbol;
            }
            if (symbol === 'const') {
                vars.scope.const[variable] = variable;
            }
            else if (symbol === 'public' && (vars.scope.namespace !== null)) {
                vars.scope.public[variable] = variable;
            };
        },
        pushSentencesToPREAST: function (preast, vars, code, display, lineposi) {
            if (preast === void 0) { preast = [];}
            if (display === void 0) { display = 'block';}
            if (code) {
                var inline = [];
                var statements = code.split('___boundary_' + this.uid);
                while (!statements[0].trim()) {
                    statements.shift();
                }
                for (var s = 0;s < statements.length;s++) {
                    var statement = statements[s];
                    if (statement.trim()) {
                        var match_as_statement = statement.match(matchExpRegPattern.index3);
                        if (match_as_statement) {
                            var array = this.pickTretOfMatch(match_as_statement, display === 'block');
                            if (array) {
                                inline.push(array[0]);
                                this.pushRowsToAST(inline, vars, array[1], false, undefined);
                            }
                            else {
                                inline.push({
                                    index: match_as_statement[1],
                                    display: (statements.length === 1) ? display : 'inline',
                                    type: match_as_statement[2]
                                });
                            }
                            array = undefined;
                        }
                        else {
                            if ((statements.length === 1) && (display === 'block')) {
                                this.pushRowsToAST(inline, vars, statements[0], true, lineposi);
                            }
                            else {
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
            };
        },
        buildAST: function (preast, vars) {
            var ast = {
                type: 'codes',
                vars: vars,
                body: []
            };
            for (var index = 0;index < preast.length;index++) {
                var block = preast[index];
                if (block.length === 1) {
                    var element = block[0];
                    if (element.type === 'code') {
                        ast.body.push(element);
                    }
                    else {
                        ast.body.push(this.walk(element, vars, false));
                    }
                }
                else {
                    var codes = {
                        type: 'codes',
                        vars: vars,
                        body: []
                    };
                    for (var b = 0;b < block.length;b++) {
                        var el = block[b];
                        if (el.type === 'code') {
                            codes.body.push(el);
                        }
                        else {
                            codes.body.push(this.walk(el, vars, true));
                        }
                    }
                    ast.body.push(codes);
                }
                block = undefined;
            }
            this.ast = ast;
            ast = undefined;
            return this;
        },
        pushBodyToAST: function (body, vars, code, inOrder) {
            if (body === void 0) { body = [];}
            if (inOrder === void 0) { inOrder = false;}
            var lines = code ? this.getLines(code, vars, inOrder):[];
            for (var index = 0;index < lines.length;index++) {
                switch (lines[index].subtype) {
                    case 'sentence':
                    var code_363 = lines[index].value.trim();
                    this.pushSentencesToAST(body, vars, code_363, !inOrder && (lines[index].display === 'block'), lines[index].posi);
                    break;
                    case 'variable':
                    body.push({
                        type: 'code',
                        posi: lines[index].posi,
                        display: inOrder ? 'inline': lines[index].display,
                        vars: vars,
                        value: lines[index].value
                    });
                    break;
                    default:
                    body.push(this.walk({
                        index: lines[index].index,
                        display: inOrder ? 'inline':'block',
                        type: lines[index].subtype
                    }, vars, inOrder));
                    break;
                }
            }
            lines = undefined;
            return body;
        },
        pushSentencesToAST: function (body, vars, code, isblock, lineposi) {
            if (body === void 0) { body = [];}
            if (isblock === void 0) { isblock = true;}
            if (code) {
                var inline = [];
                var statements = code.split('___boundary_' + this.uid);
                while (!statements[0].trim()) {
                    statements.shift();
                }
                if (statements.length === 1) {
                    this.pushReplacementsToAST(inline, vars, statements[0], isblock, lineposi);
                }
                else {
                    for (var s = 0;s < statements.length;s++) {
                        this.pushReplacementsToAST(inline, vars, statements[s], false, (s === 0) && lineposi);
                    }
                }
                if (inline.length === 1) {
                    body.push(inline[0]);
                }
                else {
                    body.push({
                        type: 'codes',
                        vars: vars,
                        body: inline
                    });
                }
                inline = undefined;
            }
            return body;
        },
        pushReplacementsToAST: function (body, vars, code, isblock, lineposi) {
            if (code.trim()) {
                var match_as_statement = code.match(matchExpRegPattern.index3);
                if (match_as_statement) {
                    var array = this.pickTretOfMatch(match_as_statement, isblock);
                    if (array) {
                        body.push(this.walk(array[0], vars, true));
                        this.pushRowsToAST(body, vars, array[1], false, undefined);
                    }
                    else {
                        body.push(this.walk({
                            index: match_as_statement[1],
                            display: isblock ? 'block':'inline',
                            type: match_as_statement[2]
                        }, vars, true));
                    }
                    array = undefined;
                }
                else {
                    this.pushRowsToAST(body, vars, code, isblock, lineposi);
                }
                match_as_statement = undefined;
            }
            return body;
        },
        pushRowsToAST: function (body, vars, code, isblock, lineposi) {
            var rows = code.split(/[\r\n]+/);
            for (var r = 0;r < rows.length;r++) {
                var row = rows[r];
                if (row.trim()) {
                    this.pushCodeToAST(body, vars, row, isblock, (r === 0) && lineposi);
                }
            }
            rows = undefined;
            return body;
        },
        pushCodeToAST: function (body, vars, code, isblock, lineposi) {
            var display = isblock ? 'block': 'inline';
            var position = this.getPosition(code) || lineposi;
            if (position) {
                var element = code.replace(position.match, '');
            }
            else {
                var element = code;
            }
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
        },
        walk: function (element, vars, inOrder) {
            if (vars === void 0) { vars = false;}
            switch (element.type) {
                case 'arraylike':
                case 'list':
                return this.walkArray(element.index, element.display, vars);
                case 'arrowfn':
                return this.walkArrowFn(element.index, element.display, vars);
                case 'if':
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
                return this.walkFnLike(element.index, element.display, vars, 'def');
                case 'object':
                case 'sets':
                return this.walkObject(element.index, element.display, vars);
                case 'parentheses':
                return this.walkParentheses(element.index, element.display, vars);
                case 'pattern':
                case 'string':
                case 'template':
                var that = this;
                var position = this.getPosition(this.replacements[element.index][1]);
                return {
                    type: 'code',
                    posi: position,
                    display: element.display || 'inline',
                    vars: vars,
                    value: '___boundary_' + this.uid + '_' + element.index + '_as_string___'
                };
                default:return {
                    type: 'code',
                    posi: void 0,
                    display: 'hidden',
                    vars: vars,
                    value: ""
                };
            };
        },
        walkArray: function (index, display, vars) {
            var body = [];
            var position = this.getPosition(this.replacements[index][1]);
            var clauses = this.readBuffer(index).replace(/([\[\s\]])/g, '').split(',');
            for (var c = 0;c < clauses.length;c++) {
                if (c) {
                    var posi = this.getPosition(clauses[c]);
                }
                else {
                    var posi = this.getPosition(clauses[c]) || position;
                }
                this.pushSentencesToAST(body, vars, clauses[c], false, posi);
            }
            return {
                type: 'arraylike',
                posi: position,
                display: display,
                vars: vars,
                body: body
            };
        },
        walkParentheses: function (index, vars) {
            var body = [];
            var clauses = this.readBuffer(index).replace(/([\[\s\]])/g, '').split(/\s*(,)/);
            var position = this.getPosition(this.replacements[index][1]);
            for (var c = 0;c < clauses.length;c++) {
                if (c) {
                    var posi = this.getPosition(clauses[c]);
                }
                else {
                    var posi = this.getPosition(clauses[c]) || position;
                }
                this.pushSentencesToAST(body, vars, clauses[c], false, posi);
            }
            if (body.length === 1) {
                return body[0];
            }
            return {
                type: 'codes',
                display: 'inline',
                vars: vars,
                body: body
            };
        },
        walkCall: function (index, display, vars, type) {
            var name = [];
            var args = [];
            var matches = this.readBuffer(index).match(matchExpRegPattern.call);
            var position = this.getPosition(this.replacements[index][1]);
            var nameArr = matches[1].split('___boundary_' + this.uid);
            var paramArr = this.replacements[matches[2]][0].toString().split(/([\(,\)])/);
            for (var n = 0;n < nameArr.length;n++) {
                var element = nameArr[n];
                if (element) {
                    if (type === 'construct') {
                        this.pushReplacementsToAST(name, vars, element, false, undefined);
                    }
                    else {
                        this.pushReplacementsToAST(name, vars, element, false, (n === 0) && position);
                    }
                }
            }
            for (var p = 0;p < paramArr.length;p++) {
                var paramPosi = this.getPosition(paramArr[p]);
                if (paramPosi) {
                    var param = paramArr[p].replace(paramPosi.match, '').trim();
                }
                else {
                    var param = paramArr[p].trim();
                }
                if (param && param != '(' && param != ')' && param != ',') {
                    var statements = param.split('___boundary_' + this.uid);
                    var inline = [];
                    for (var s = 0;s < statements.length;s++) {
                        this.pushReplacementsToAST(inline, vars, statements[s], false, (s === 0) && paramPosi);
                    }
                    if (inline.length) {
                        args.push({
                            type: 'parameter',
                            posi: inline[0].posi || paramPosi,
                            display: 'inline',
                            vars: vars,
                            body: inline
                        });
                    }
                    else {
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
                if(position) position.head = false;
                display = 'inline';
            }
            matches = nameArr = paramArr = undefined;
            return {
                type: type,
                posi: position,
                display: display,
                name: name,
                vars: vars,
                args: args
            };
        },
        walkCallsChain: function (index, display, vars, type) {
            var _this = this;
            var _arguments = arguments;
            var code = this.readBuffer(index);
            var position = this.getPosition(this.replacements[index][1]);
            var calls = [];
            code.replace(/(@\d+L\d+P\d+O*\d*:::)?\.___boundary_[A-Z0-9_]{36}_(\d+)_as_callmethod___/g, function (match, posi, _index) {
                if (posi) {
                    _this.replacements[_index][1] = posi;
                }
                calls.push(_this.walkCall(_index, 'inline', vars, 'callmethod'));
                return '';
            });
            if (type === 'log' && position) {
                position.head = true;
            }
            code = undefined;
            return {
                type: type,
                posi: position,
                display: (position && position.head) ? 'blocks':'inline',
                vars: vars,
                calls: calls
            };
        },
        walkClass: function (index, display, vars) {
            if (vars === void 0) { vars = true;}
            var matches = this.readBuffer(index).match(matchExpRegPattern.class);
            var type = matches[1];
            var namespace = vars.scope.namespace || this.namespace;
            var cname = matches[3];
            var subtype = 'stdClass';
            if (matches[2]) {
                if (matches[2].length !== 2) {
                    cname = namespace + cname;
                }
            }
            else {
                if (type === 'dec') {
                    if (cname) {
                        if (this.isNativeCode) {
                            this.error('Native Code Not Support Standard Class Expression');
                        }
                        cname = namespace + cname;
                    }
                    else if (namespace) {
                        if (this.isNativeCode) {
                            this.error('Native Code Not Support Standard Class Expression');
                        }
                        cname = namespace.replace(/\.$/, '');
                    }
                    else {
                        subtype = 'anonClass';
                    }
                }
                else {
                    subtype = 'anonClass';
                }
            }
            var basename = matches[6];
            var position = this.getPosition(this.replacements[index][1]);
            if (type === 'class') {
                this.useDeclare = true;
                if ((subtype === 'anonClass') && cname && cname.match(namingExpr)) {
                    this.pushVariableToVars(vars, 'var', cname, position);
                }
                if (matches[5]) {
                    if (matches[5].length === 2) {
                        basename = 'pandora.' + basename;
                    }
                    else {
                        basename = 'pandora.' + namespace + basename;
                    }
                }
            }
            else {
                this.useExtends = true;
                if (matches[4] === 'ignore') {
                    basename = true;
                }
                else {
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
        },
        walkClosure: function (index, display, vars) {
            var localvars = {
                parent: vars,
                scope: vars.scope,
                hasHalfFunScope: false,
                self:  {},
                locals: vars.locals,
                fix_map:  {},
                type: 'local'
            };
            var array = this.readBuffer(index).split(/\s*(\{|\})\s*/);
            var position = this.getPosition(this.replacements[index][1]);
            var body = this.pushBodyToAST([], localvars, array[2]);
            this.resetVarsRoot(localvars);
            array = undefined;
            return {
                type: 'closure',
                posi: position,
                display: display,
                vars: localvars,
                body: body
            };
        },
        walkExtends: function (index, display, vars) {
            var matches = this.readBuffer(index).match(matchExpRegPattern.extends);
            var position = this.getPosition(this.replacements[index][1]);
            var subtype = 'ext';
            var objname = matches[2];
            var localvars = vars;
            var namespace = void 0;
            var body = void 0;
            if ((matches[1] === 'voidns') || (matches[1] === 'voidglobal') || (matches[1] === 'voidanonspace') || (matches[1] === 'ns') || (matches[1] === 'global') || (matches[1] === 'anonspace')) {
                subtype = matches[1];
                if (subtype === 'voidanonspace' || subtype === 'anonspace') {
                    this.useAnonSpace = true;
                }
                else {
                    if (this.isNativeCode) {
                        this.error('Native Code Not Support Namespace Expression');
                    }
                }
                if (subtype === 'voidanonspace' || subtype === 'anonspace') {
                    namespace = '';
                }
                else if ((subtype === 'voidglobal') || (subtype === 'global')) {
                    namespace = objname + '.';
                }
                else {
                    namespace = (vars.namespace || this.namespace) + objname + '.';
                }
                localvars = {
                    parent: vars,
                    scope: {
                        namespace: namespace,
                        public:  {},
                        const:  {},
                        private:  {},
                        protected:  {},
                        fixed: ['this', 'arguments'],
                        fix_map:  {}
                    },
                    hasHalfFunScope: false,
                    locals:  {},
                    type: 'scope'
                };
                localvars.self = localvars.scope.protected;
                body = this.pushBodyToAST([], localvars, matches[3]);
            }
            else {
                if ((matches[1] === 'nsassign') || (matches[1] === 'globalassign')) {
                    if (this.isNativeCode) {
                        this.error('Native Code Not Support Assign Expression');
                    }
                    subtype = matches[1];
                }
                else {
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
            };
        },
        walkObject: function (index, display, vars) {
            if (vars === void 0) { vars = true;}
            return {
                type: 'object',
                display: display || 'inline',
                posi: this.getPosition(this.replacements[index][1]),
                vars: vars,
                body: this.checkObjMember(vars, this.readBuffer(index))
            };
        },
        walkArrowFn: function (index, display, vars) {
            var matches = this.readBuffer(index).match(matchExpRegPattern.arrowfn);
            var subtype = 'fn';
            var selfvas = {};
            if (matches[3] === '=>') {
                subtype = '=>';
                vars.hasHalfFunScope = true;
                vars.locals['this'] = null;
                vars.locals['arguments'] = null;
                var locals = vars.locals;
                var varstype = 'arrowfn';
            }
            else {
                var locals = {};
                var varstype = 'scope';
            }
            var localvars = {
                parent: vars,
                scope: {
                    namespace: vars.namespace,
                    public:  {},
                    const:  {},
                    private:  {},
                    protected:  {},
                    fixed: [],
                    fix_map:  {}
                },
                hasHalfFunScope: false,
                locals: locals,
                type: varstype
            };
            localvars.self = localvars.scope.protected;
            localvars.fix_map = localvars.scope.fix_map;
            var args = this.checkArgs(this.replacements[matches[2]][0].toString().replace(/(^\(|\)$)/g, ''), localvars);
            return {
                type: 'def',
                posi: this.getPosition(this.replacements[index][1]),
                display: 'inline',
                vars: localvars,
                subtype: subtype,
                args: args.keys,
                defaults: args.vals,
                body: this.checkFnBody(localvars, args, matches[4])
            };
        },
        walkFnLike: function (index, display, vars, type) {
            var _this = this;
            var _arguments = arguments;
            function push (semicolons, lines) {
                for (var index = 0;index < lines.length;index++) {
                    if (lines[index].type === 'codes') {
                        semicolons = push(semicolons, lines[index].body);
                        continue;
                    }
                    if(lines[index].posi) lines[index].posi.head = false;
                    if (lines[index].value) {
                        if (lines[index].value.match(/;/)) {
                            if (semicolons < 2) {
                                lines[index].value = lines[index].value.replace(/;\s*/, '; ');
                                semicolons++;
                            }
                            else {
                                lines[index].value = lines[index].value.replace(/;\s*/, '');
                            }
                        }
                    }
                    head.body.push(lines[index]);
                }
                return semicolons;
            }
            var tem = {
                fnlike: /(^|(function|def|public|method)\s+)?([\$a-zA-Z_][\$\w]*)?\s*\(([^\(\)]*)\)\s*\{([^\{\}]*?)\}/
            };
            var matches = this.readBuffer(index).match(matchExpRegPattern.fnlike);
            var subtype = matches[2] || 'function';
            var fname = matches[3] !== 'function' ? matches[3]:'';
            if ((type === 'def' && subtype === 'function') || type === 'exp') {
                if (reservedFname['includes'](fname)) {
                    var headline = matches[4];
                    var localvars_472 = {
                        parent: vars,
                        scope: vars.scope,
                        hasHalfFunScope: false,
                        self:  {},
                        locals: vars.locals,
                        fix_map:  {},
                        type: 'local'
                    };
                    if (fname === 'for') {
                        var head = {
                            type: 'codes',
                            vars: localvars_472,
                            display: 'inline',
                            body: []
                        };
                        var lines = this.pushBodyToAST([], localvars_472, headline, true);
                        var semicolons = push(0, lines);
                    }
                    else {
                        var head = this.pushSentencesToAST([],vars,headline,false,this.getPosition(headline))[0] || (function () {
                            _this.error(' Must have statements in head of ' + fname + ' expreesion.');
                        })();
                    }
                    var body = this.pushBodyToAST([], localvars_472, matches[5]);
                    this.resetVarsRoot(localvars_472);
                    return {
                        type: 'exp',
                        posi: this.getPosition(this.replacements[index][1]),
                        display: 'block',
                        vars: localvars_472,
                        expression: fname,
                        head: head,
                        body: body
                    };
                }
                if (fname === 'each') {
                    var condition = matches[4].match(matchExpRegPattern.travelargs);
                    if (condition) {
                        var self = {};var agrs = [];
                        if (condition[5]) {
                            if (condition[8]) {
                                if (condition[4] !== condition[8]) {
                                    self[condition[4]] = 'var';
                                    self[condition[8]] = 'var';
                                    agrs = [[condition[4], this.getPosition(condition[3])], [condition[8], this.getPosition(condition[7])]];
                                }
                                else {
                                    this.error('indexname cannot same to the itemname');
                                }
                            }
                            else {
                                self[condition[4]] = 'var';
                                agrs = [[condition[4], condition[3]]];
                            }
                        }
                        else {
                            if (condition[4] !== '_index') {
                                self['_index'] = 'var';
                                self[condition[4]] = 'var';
                                agrs = [['_index', undefined], [condition[4], this.getPosition(condition[3])]];
                            }
                            else {
                                this.error('itemname cannot same to the default indexname');
                            }
                        }
                        this.useEach = true;
                        vars.hasHalfFunScope = true;
                        vars.locals['arguments'] = null;
                        var localvars_479 = {
                            parent: vars,
                            scope: {
                                namespace: null,
                                public:  {},
                                const:  {},
                                private:  {},
                                protected: self,
                                fixed: [],
                                fix_map:  {},
                                break: false
                            },
                            hasHalfFunScope: false,
                            locals: vars.locals,
                            type: 'travel'
                        };
                        localvars_479.self = localvars_479.scope.protected;
                        var iterator = this.pushSentencesToAST([],localvars_479,condition[1],false,this.getPosition(condition[2]))[0] || (function () {
                            _this.error(' Must have statements in head of each expreesion.');
                        })();
                        var subtype_479 = 'allprop';
                        var code = matches[5].replace(/@ownprop[;\s]*/g, function () {
                            subtype_479 = 'ownprop';
                            return '';
                        });
                        return {
                            type: 'travel',
                            posi: this.getPosition(this.replacements[index][1]),
                            display: 'block',
                            subtype: subtype_479,
                            iterator: iterator,
                            vars: localvars_479,
                            callback: {
                                type: 'def',
                                display: 'inline',
                                vars: localvars_479,
                                fname: '',
                                args: agrs,
                                body: this.pushBodyToAST([], localvars_479, code)
                            }
                        };
                    }
                }
            }
            var position = this.getPosition(this.replacements[index][1]);
            if (type === 'def') {
                if (fname) {
                    if (fname !== 'return') {
                        this.pushVariableToVars(vars, 'var', fname, position);
                    }
                }
                else {
                    if (subtype === 'function') {
                        if (display === 'block') {
                            fname = '_ανώνυμος_function_' + this.anonymous_variables;
                            this.anonymous_variables++;
                        }
                    }
                    else {
                        display = 'block';
                        fname = subtype;
                        subtype = 'function';
                    }
                    this.pushVariableToVars(vars, 'var', fname, position);
                }
            }
            var localvars = {
                parent: vars,
                scope: {
                    namespace: vars.namespace,
                    public:  {},
                    const:  {},
                    private:  {},
                    protected:  {},
                    fixed: ['this', 'arguments'],
                    fix_map:  {}
                },
                hasHalfFunScope: false,
                locals:  {},
                type: 'scope'
            };
            localvars.self = localvars.scope.protected;
            var args = this.checkArgs(matches[4], localvars);
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
            };
        },
        checkProp: function (vars, posi, type, attr, array) {
            var position = this.getPosition(posi);
            if (array.length > 1) {
                var body = [];
                if (attr[6]) {
                    body.push({
                        type: 'code',
                        posi: void 0,
                        display: 'inline',
                        vars: vars,
                        value: attr[6].trim()
                    });
                }
                for (var index = 1;index < array.length;index++) {
                    var element = array[index];
                    var match_as_statement = element.trim().match(matchExpRegPattern.index3);
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
                    }
                    else {
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
                body: [{
                    type: 'code',
                    posi: void 0,
                    display: 'inline',
                    vars: vars,
                    value: attr[6].trim()
                }]
            };
        },
        checkObjMember: function (vars, code) {
            var that = this;var body = [];
            var bodyIndex =  -1;
            var lastIndex = 0;
            var array = code.split(/\s*[\{,\}]\s*/);
            for (var index = 0;index < array.length;index++) {
                var element = array[index].trim();
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
                                    continue;
                                }
                            }
                            body.push(this.checkProp(vars, match_0[1], 'objProp', match_0, elArr));
                            bodyIndex++;
                            continue;
                        }
                        else {}
                    }
                    else {
                        for (var i = 1;i < elArr.length;i++) {
                            var match_as_statement = elArr[i].trim().match(matchExpRegPattern.index3);
                            switch (match_as_statement[2]) {
                                case 'string':
                                case 'pattern':
                                case 'tamplate':
                                console.log(body, bodyIndex);
                                body[bodyIndex].body.push({
                                    type: 'code',
                                    posi: void 0,
                                    display: 'inline',
                                    vars: vars,
                                    value: ',' + this.replacements[parseInt(match_as_statement[1])][0].toString().replace(this.markPattern, function () {
                                        return that.replacements[arguments[1]][0].toString();
                                    })
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
        },
        checkClassBody: function (vars, code) {
            var body = [];
            var array = code.replace('_as_function___', '_as_function___;').split(/[;,\r\n]+/);
            for (var index = 0;index < array.length;index++) {
                var element = array[index].trim();
                var type = 'method';
                if (element) {
                    var elArr = element.split('___boundary_' + this.uid);
                    if (elArr[0] && elArr[0].trim()) {
                        var match_0 = elArr[0].match(matchExpRegPattern.classelement);
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
                                    }
                                    else {
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
                        var match_1 = elArr[1].trim().match(matchExpRegPattern.index);
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
        },
        checkArgs: function (code, localvars) {
            var args = code.split(/\s*,\s*/);
            var keys = [];
            var keysArray = void 0;
            var vals = [];
            for (var index = 0;index < args.length;index++) {
                var arg = args[index];
                if (arg) {
                    var array = arg.split(/\s*=\s*/);
                    var position = this.getPosition(array[0]);
                    if (position) {
                        var varname = array[0].replace(position.match, '');
                    }
                    else {
                        var varname = array[0];
                    }
                    if (varname.match(namingExpr)) {
                        keys.push([varname, position]);
                        vals.push(array[1]);
                        localvars.self[varname] = 'var';
                    }
                    else if (varname.match(argsExpr)) {
                        keysArray = [varname, position];
                        localvars.self[varname] = 'var';
                        break;
                    };
                    array = position = varname = undefined;
                }
            }
            args = undefined;
            return {
                keys: keys,
                keysArray: keysArray,
                vals: vals
            };
        },
        checkFnBody: function (vars, args, code) {
            code = code.trim();
            var body = [];
            for (var index = 0;index < args.vals.length;index++) {
                if (args.vals[index] !== undefined) {
                    var valArr = args.vals[index].split('___boundary_' + this.uid);
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
                    }
                    else {
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
            return body;
        },
        generate: function () {
            var ast = this.ast;
            this.ast = {};
            var head = [];
            var neck = [];
            var body = [];
            var foot = [];
            this.fixVariables(ast.vars);
            this.pushCodes(body, ast.vars, ast.body, 1, this.namespace);
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
                else if (this.useEach) {
                    this.pushEach(neck);
                }
                this.useLoop && this.pushLoop(neck);
            }
            else {
                var imports = this.imports;
                var alias = this.using_as;
                this.imports = [];
                this.using_as = {};
                this.pushBlockHeader(head, imports);
                this.pushAlias(neck, ast.vars, alias);
                imports = undefined;
                alias = undefined;
            }
            this.pushFooter(foot, ast.vars);
            ast = undefined;
            var preoutput = head.join('') + neck.join('') + this.trim(body.join('')) + foot.join('');
            head = neck = body = foot = undefined;
            this.output = this.pickUpMap(this.restoreStrings(preoutput, true)).replace(/[\s;]+;/g, ';');
            preoutput = undefined;
            return this;
        },
        pushPostionsToMap: function (position, codes) {
            if (position && (typeof position === 'object')) {
                var index = this.posimap.length;
                this.posimap.push(position);
                var replace = '/* @posi' + index + ' */';
                index = undefined;
                if (codes) {
                    codes.push(replace);
                }
                return replace;
            }
            return '';
        },
        pickUpMap: function (string) {
            var lines = string.split(/\r{0,1}\n/);
            var _lines = [];
            var mappings = [];
            for (var l = 0;l < lines.length;l++) {
                var line = lines[l];
                lines[l] = undefined;
                var mapping = [];
                var match = void 0;
                while (match = line.match(/\/\*\s@posi(\d+)\s\*\//)) {
                    var index = match.index;
                    if (match[1] < this.posimap.length - 1) {
                        var i = parseInt(match[1]) + 1;
                        var position = this.posimap[i];
                        this.posimap[i] = undefined;
                        mapping.push([index, position.o[0], position.o[1], position.o[2], 0]);
                    }
                    else {}
                    line = line.replace(match[0], '');
                }
                _lines.push(line);
                mappings.push(mapping);
                line = mapping = undefined;
            }
            this.posimap = undefined;
            mappings[0][0] = [0, 0, 0, 0, 0];
            this.mappings = mappings;
            mappings = undefined;
            return _lines.join("\r\n");
        },
        pushNativeHeader: function (codes) {
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
        },
        pushDeclare: function (codes) {
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
            codes.push('\r\n            var constructor = void 0;');
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
        },
        pushEach: function (codes) {
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
        },
        pushExtends: function (codes) {
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
        },
        pushLoop: function (codes) {
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
        },
        pushBlockHeader: function (codes, imports) {
            codes.push('/*!');
            codes.push("\r\n" + ' * tanguage script compiled code');
            codes.push("\r\n" + ' *');
            codes.push("\r\n" + ' * Datetime: ' + (new Date()).toUTCString());
            codes.push("\r\n" + ' */');
            codes.push("\r\n" + ';');
            codes.push("\r\n");
            if (this.configinfo === '{}') {
                codes.push("// ");
            }
            else {
                this.pushPostionsToMap(this.getPosition(this.configinfo_posi), codes);
            }
            codes.push('tang.config(' + this.configinfo + ');');
            if (this.isMainBlock) {
                codes.push("\r\n" + 'tang.init().block([');
            }
            else {
                codes.push("\r\n" + 'tang.init().block([');
            }
            if (imports.length) {
                var stropmi = [];
                for (var index = 0;index < imports.length;index += 2) {
                    stropmi.push(this.pushPostionsToMap(this.getPosition(imports[index + 1])) + "'" + imports[index] + "'");
                }
                codes.push("\r\n    " + stropmi.join(",\r\n    ") + "\r\n");
                stropmi = undefined;
            }
            if (this.isMainBlock) {
                codes.push('], function (pandora, root, imports, undefined) {');
            }
            else {
                codes.push('], function (pandora, root, imports, undefined) {');
                codes.push("\r\n    var module = this.module;");
            }
            if (this.namespace) {
                var namespace = this.namespace.replace(/\.$/, "");
                var name = namespace.replace(/^(.*\.)?([\$a-zA-Z_][\$\w]*)$/, "$2");
                codes.push("\r\n    var " + name + " = pandora.ns('" + namespace + "', {});");
                namespace = name = undefined;
            }
            return codes;
        },
        pushAlias: function (codes, vars, alias) {
            for (var key in vars.locals) {
                codes.push("\r\n    var " + vars.locals[key] + ' = ' + key + ';');
            }
            for (var key in alias) {
                var value = alias[key][0].toLowerCase();
                codes.push("\r\n    " + this.pushPostionsToMap(alias[key][2]) + "var " + this.patchVariables(key, vars));
                codes.push(" = imports['" + value);
                if (alias[key][1] === '*') {
                    codes.push("'];");
                }
                else {
                    codes.push("'] && imports['" + value + "']['" + key + "'];");
                }
                value = undefined;
            }
            return codes;
        },
        pushCodes: function (codes, vars, array, layer, namespace, lasttype) {
            if (namespace === void 0) { namespace = this.namespace;}
            if (lasttype === void 0) { lasttype = '';}
            for (var index = 0;index < array.length;index++) {
                var element = array[index];
                this.pushElement(codes, vars, element, layer, namespace, (index - 1 >= 0) ? array[index - 1].type : lasttype);
            }
            return codes;
        },
        pushElement: function (codes, vars, element, layer, namespace, lasttype) {
            var _this = this;
            var _arguments = arguments;
            if (namespace === void 0) { namespace = this.namespace;}
            if (lasttype === void 0) { lasttype = '';}
            var indent = "\r\n" + stringRepeat("    ", layer);
            switch (element.type) {
                case 'arraylike':
                this.pushArrayCodes(codes, element, layer, namespace);
                break;
                case 'if':
                case 'call':
                case 'callmethod':
                case 'construct':
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
                    var code = this.patchVariables(element.value, vars);
                    if (vars.scope.break !== undefined) {
                        code = code.replace(/@return;*/g, function () {
                            vars.scope.break = true;
                            _this.useLoop = true;
                            return 'pandora.loop.out();' + indent + 'return;';
                        });
                    }
                    if (element.display === 'block' || lasttype === 'exp') {
                        codes.push(indent + this.pushPostionsToMap(element.posi) + code);
                    }
                    else {
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
                this.pushCodes(codes, element.vars, element.body, layer + ((element.posi && element.posi.head) ? 1:0), namespace, lasttype);
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
                this.pushObjCodes(codes, element, layer, namespace);
                break;
                case 'travel':
                this.pushTravelCodes(codes, element, layer, namespace);
                break;
            }
            indent = undefined;
            return codes;
        },
        pushArrayCodes: function (codes, element, layer, namespace) {
            var elements = [];
            if (element.posi) {
                this.pushPostionsToMap(element.posi, codes);
            }
            codes.push('[');
            if (element.body.length) {
                var _layer = layer;
                var indent1 = void 0;var indent2 = void 0;
                var _break = false;
                if (element.body[0].posi && element.body[0].posi.head) {
                    indent1 = "\r\n" + stringRepeat("    ", _layer);
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("    ", _layer);
                    codes.push(indent2);
                    _break = true;
                }
                this.pushArrayElements(elements, element.body, element.vars, _layer, namespace);
                while (elements.length && !elements[0].trim()) {
                    elements.shift();
                }
                if (elements.length) {
                    if (_break) {
                        codes.push(elements.join(',' + indent2) + indent1);
                    }
                    else {
                        codes.push(elements.join(', '));
                    }
                }
                _layer = indent1 = indent2 = _break = undefined;
            }
            codes.push(']');
            elements = undefined;
            return codes;
        },
        pushArrayElements: function (elements, body, vars, _layer, namespace) {
            for (var index = 0;index < body.length;index++) {
                if (body[index].value) {
                    elements.push(this.pushPostionsToMap(body[index].posi) + this.patchVariables(body[index].value, vars));
                }
                else {
                    var elemCodes = [];
                    this.pushPostionsToMap(body[index].posi, elemCodes);
                    this.pushElement(elemCodes, vars, body[index], _layer, namespace);
                    if (elemCodes.length) {
                        elements.push(elemCodes.join('').trim());
                    }
                    elemCodes = undefined;
                }
            };
        },
        pushCallCodes: function (codes, element, layer, namespace) {
            var naming = this.pushCodes([], element.vars, element.name, layer, namespace);
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
            var name = naming.join('');
            if (name === 'new') {
                codes.push('new (');
            }
            else {
                if (element.type === 'construct') {
                    codes.push('new ');
                }
                codes.push(name + '(');
            }
            var args = [];
            if (element.args.length) {
                var _layer = layer;
                var indent2 = void 0;
                var _break = false;
                if ((element.args.length > 1) && element.args[0].posi && element.args[0].posi.head) {
                    _layer++;
                    indent2 = "\r\n" + stringRepeat("    ", _layer);
                    _break = true;
                }
                this.pushCallArgs(args, element.args, element.vars, _layer, namespace);
                while (args.length && !args[0].trim()) {
                    args.shift();
                }
                if (args.length) {
                    if (_break) {
                        codes.push(indent2 + args.join(',' + indent2));
                    }
                    else {
                        codes.push(args.join(', '));
                    }
                }
                _layer = indent2 = _break = undefined;
            }
            if (element.type === 'if') {
                codes.push(') ');
            }
            else if (element.display === 'block') {
                codes.push(');');
            }
            else {
                codes.push(')');
            }
            naming = name = undefined;
            return codes;
        },
        pushCallArgs: function (args, body, vars, _layer, namespace) {
            for (var index = 0;index < body.length;index++) {
                var param = body[index].body;
                var paramCodes = [];
                this.pushPostionsToMap(body[index].posi, paramCodes);
                this.pushCodes(paramCodes, vars, param, _layer, namespace);
                if (paramCodes.length) {
                    args.push(paramCodes.join('').trim());
                }
                paramCodes = undefined;
            };
        },
        pushCallsCodes: function (codes, element, layer, namespace, lasttype) {
            var elements = [];
            var _layer = layer;
            var indent = void 0;
            var _break = false;
            if (element.type === 'log') {
                if (lasttype === 'if') {
                    indent = "";
                }
                else {
                    indent = "\r\n" + stringRepeat("    ", _layer);
                }
                codes.push(indent + this.pushPostionsToMap(element.posi) + 'root.console');
            }
            else if (element.posi && element.posi.head) {
                _layer++;
                _break = true;
                indent = "\r\n" + stringRepeat("    ", _layer);
            }
            for (var index = 0;index < element.calls.length;index++) {
                var method = element.calls[index];
                elements.push(this.pushElement([], element.vars, method, _layer, namespace).join(''));
            }
            if (_break) {
                codes.push(indent + '.' + elements.join(indent + '.'));
            }
            else {
                codes.push('.' + elements.join('.'));
                if (element.type === 'log') {
                    codes.push(';');
                }
            }
            elements = _layer = indent = _break = undefined;
            return codes;
        },
        pushClassCodes: function (codes, element, layer, namespace) {
            var indent1 = "\r\n" + stringRepeat("    ", layer);
            var indent2 = "\r\n" + stringRepeat("    ", layer + 1);
            var elements = [];
            var static_elements = [];
            var cname = '';
            if (element.subtype === 'stdClass') {
                cname = 'pandora.' + element.cname.trim();
                codes.push(indent1 + this.pushPostionsToMap(element.posi) + 'pandora.declareClass(\'' + element.cname.trim() + '\', ');
            }
            else {
                if (element.cname && element.cname.trim()) {
                    cname = element.cname.trim();
                    if (cname.match(/^[\$a-zA-Z_][\$\w]*$/)) {
                        codes.push(indent1 + 'var ' + this.pushPostionsToMap(element.posi) + cname + ' = ' + 'pandora.declareClass(');
                    }
                    else {
                        codes.push(indent1 + this.pushPostionsToMap(element.posi) + cname + ' = ' + 'pandora.declareClass(');
                    }
                }
                else {
                    this.pushPostionsToMap(element.posi, codes);
                    codes.push('pandora.declareClass(');
                }
            }
            if (element.base) {
                codes.push(element.base + ', ');
            }
            codes.push('{');
            var overrides = {};
            var setters = [];
            var getters = [];
            var indent3 = "\r\n" + stringRepeat("    ", layer + 2);
            for (var index = 0;index < element.body.length;index++) {
                var member = element.body[index];
                var elem = [];
                switch (member.type) {
                    case 'method':
                    elem.push(indent2 + this.pushPostionsToMap(member.posi) + member.fname + ': ');
                    this.pushFunctionCodes(elem, member, layer + 1, namespace);
                    elements.push(elem.join(''));
                    break;
                    case 'overrideMethod':
                    overrides[member.fname] = overrides[member.fname] || {}
                    var argslen = member.args.length;
                    if (!overrides[member.fname][argslen]) {
                        var fname = overrides[member.fname][argslen] = '___override_method_' + member.fname + '_' + argslen;
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
                }
                else {
                    codes.push(';');
                }
                codes.push(indent1);
            }
            indent1 = indent2 = indent3 = elements = static_elements = cname = overrides = getters = setters = undefined;
            return codes;
        },
        pushFunctionCodes: function (codes, element, layer, namespace) {
            var indent = "\r\n" + stringRepeat("    ", layer);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            }
            else {
                var posi = '';
            }
            this.fixVariables(element.vars);
            if (element.type === 'def' && element.fname) {
                if (element.fname === 'return') {
                    codes.push(indent + posi + 'return function (');
                }
                else {
                    var fname = this.patchVariable(element.fname, element.vars.parent);
                    switch (element.subtype) {
                        case 'def':
                        codes.push(indent + posi + 'pandora.' + namespace + element.fname + ' = function (');
                        break;
                        case 'public':
                        codes.push(indent + posi + 'var ' + fname + ' = pandora.' + namespace + element.fname + ' = function (');
                        break;
                        default:
                        if (element.display === 'block') {
                            codes.push(indent + posi + 'function ' + fname + ' (');
                        }
                        else {
                            codes.push(posi + 'function ' + fname + ' (');
                        }
                    }
                }
            }
            else {
                codes.push(posi + 'function (');
            }
            if (element.args.length) {
                var args = [];
                for (var index = 0;index < element.args.length;index++) {
                    args.push(this.pushPostionsToMap(element.args[index][1]) + this.patchVariable(element.args[index][0], element.vars));
                }
                codes.push(args.join(', '));
            }
            codes.push(') {');
            if (element.body.length) {
                if ((element.vars.type === 'blocklike') || (element.vars.type === 'scope')) {
                    for (var key in element.vars.locals) {
                        codes.push(indent + "    var " + element.vars.locals[key] + ' = ' + key + ';');
                    }
                }
                element.body.push(semicolon);
                this.pushCodes(codes, element.vars, element.body, layer + 1, namespace);
            }
            else {
                indent = '';
            }
            codes.push(indent + '}');
            indent = undefined;
            return codes;
        },
        pushOverrideMethod: function (elements, overrides, indent2, indent3) {
            for (var fname in overrides) {
                if (hasProp(overrides, fname)) {
                    var elem = [];
                    elem.push(indent2 + fname + ': ');
                    elem.push('function(){');
                    var element = overrides[fname];
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
            };
        },
        pushExtendsCodes: function (codes, element, layer, namespace) {
            var indent1 = "\r\n" + stringRepeat("    ", layer);
            var indent2 = "\r\n" + stringRepeat("    ", layer + 1);
            var indent3 = "\r\n" + stringRepeat("    ", layer + 2);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            }
            else {
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
                }
                else {
                    codes.push(indent1 + posi + 'pandora.ns(\'' + namespace + element.oname.trim() + '\', function () {');
                    this.pushCodes(codes, element.vars, element.body, layer + 1, namespace + element.oname.trim() + '.');
                }
                if (element.subtype === 'anonspace' || element.subtype === 'ns' || element.subtype === 'global') {
                    var exports = [];
                    codes.push(indent2 + 'return {');
                    for (var name in element.vars.scope.public) {
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
            }
            else if (element.subtype === 'nsassign' || element.subtype === 'globalassign') {
                codes.push(indent1 + posi + 'pandora.ns(\'' + namespace + element.oname.trim() + '\', ');
                this.pushObjCodes(codes, element, layer, namespace);
            }
            else {
                codes.push(indent1 + posi + 'pandora.extend(' + element.oname + ', ');
                this.pushObjCodes(codes, element, layer, namespace);
            }
            codes.push(');');
            codes.push(indent1);
            indent1 = indent2 = indent3 = posi = undefined;
            return codes;
        },
        pushObjCodes: function (codes, element, layer, namespace) {
            var indent1 = "\r\n" + stringRepeat("    ", layer);
            var indent2 = "\r\n" + stringRepeat("    ", layer + 1);
            if (element.type === 'object' && element.display === 'block') {
                codes.push(indent1 + this.pushPostionsToMap(element.posi) + '{');
            }
            else {
                codes.push('{');
            }
            if (element.body.length) {
                var elements = [];
                var _layer = layer;
                var _break = false;
                if ((element.body.length > 1) || (element.body[0].posi && element.body[0].posi.head)) {
                    _layer++;
                    codes.push(indent2);
                    _break = true;
                }
                for (var index = 0;index < element.body.length;index++) {
                    var member = element.body[index];
                    var elem = [];
                    switch (member.type) {
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
                }
                else {
                    codes.push(elements.join(','));
                }
                elements = _layer = _break = undefined;
            }
            codes.push('}');
            indent1 = indent2 = undefined;
            return codes;
        },
        pushExpandClassCodes: function (codes, element, layer, namespace) {
            var indent1 = "\r\n" + stringRepeat("    ", layer);
            var indent2 = "\r\n" + stringRepeat("    ", layer + 1);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            }
            else {
                var posi = '';
            }
            var elements = [];
            var static_elements = [];
            var cname = '';
            if (element.subtype === 'stdClass') {
                cname = 'pandora.' + element.cname.trim();
            }
            else {
                if (element.cname && element.cname.trim()) {
                    cname = element.cname.trim();
                }
                else {
                    return codes;
                }
            }
            codes.push(indent1 + posi + 'pandora.extend(' + cname + '.prototype, ');
            if (element.base === false) {
                codes.push('true, ');
            }
            codes.push('{');
            var overrides = {};
            var indent3 = "\r\n" + stringRepeat("    ", layer + 2);
            for (var index = 0;index < element.body.length;index++) {
                var member = element.body[index];
                var elem = [];
                switch (member.type) {
                    case 'method':
                    elem.push(indent2 + member.fname + ': ');
                    this.pushFunctionCodes(elem, member, layer + 1, namespace);
                    elements.push(elem.join(''));
                    break;
                    case 'overrideMethod':
                    overrides[member.fname] = overrides[member.fname] || {}
                    var argslen = member.args.length;
                    if (!overrides[member.fname][argslen]) {
                        var fname = overrides[member.fname][argslen] = '___override_method_' + member.fname + '_' + argslen;
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
            if (static_elements.length) {
                codes.push(';' + indent1 + 'pandora.extend(' + cname + ', {');
                codes.push(static_elements.join(','));
                codes.push(indent1 + '});');
            }
            else {
                codes.push(';');
            }
            codes.push(indent1);
            indent1 = indent2 = elements = static_elements = cname = overrides = indent3 = undefined;
            return codes;
        },
        pushExpressionCodes: function (codes, element, layer, namespace) {
            var indent1 = "\r\n" + stringRepeat("    ", layer);
            var indent2 = "\r\n" + stringRepeat("    ", layer);
            if (element.posi) {
                var posi = this.pushPostionsToMap(element.posi);
            }
            else {
                var posi = '';
            }
            this.fixVariables(element.vars);
            if (element.type === 'closure') {
                if (element.posi) {
                    codes.push(indent1 + posi + '{');
                }
                else {
                    codes.push(' {');
                }
            }
            else {
                codes.push(indent1 + posi + element.expression + ' (');
                this.pushElement(codes, element.vars.parent, element.head, layer, namespace);
                codes.push(') {');
            }
            if (element.body.length) {
                codes.push(indent2);
                this.pushCodes(codes, element.vars, element.body, layer + 1, namespace);
                codes.push(indent1 + '}');
            }
            else {
                codes.push('}');
            }
            indent1 = indent2 = undefined;
            return codes;
        },
        pushTravelCodes: function (codes, element, layer, namespace) {
            var index = codes.length;
            var indent = "\r\n" + stringRepeat("    ", layer);
            codes.push(indent + 'pandora.each(');
            this.pushElement(codes, element.vars, element.iterator, layer, namespace);
            codes.push(', ');
            this.pushFunctionCodes(codes, element.callback, layer, namespace);
            if (element.vars.scope.break === true) {
                codes[index] = indent + 'pandora.loop(';
            }
            if (element.subtype === 'ownprop') {
                codes.push(', this, true);');
            }
            else {
                codes.push(', this);');
            }
            codes.push(indent);
            index = indent = undefined;
            return codes;
        },
        pushFooter: function (codes, vars) {
            for (var name in vars.scope.public) {
                codes.push("\r\n    pandora('" + this.namespace + name + "', " + vars.scope.public[name] + ");");
            }
            if (this.isMainBlock) {
                codes.push("\r\n" + '}, true);');
            }
            else {
                codes.push("\r\n" + '});');
            }
            return codes;
        },
        resetVarsRoot: function (vars) {
            var scope = vars.scope;
            for (var varname in vars.self) {
                if (hasProp(vars.self, varname)) {
                    if (vars.self[varname] === 'const' || vars.self[varname] === 'let') {
                        if (hasProp(scope.protected, varname) && (!hasProp(scope.private, varname) || (scope.private[varname].parent === vars))) {
                            scope.private[varname] = vars;
                        }
                    }
                    else {
                        if (hasProp(scope.protected, varname)) {
                            scope.protected[varname] = 'var';
                        }
                        else if (scope.protected[varname] === 'let') {
                            this.error(' Variable `' + varname + '` has already been declared.');
                        }
                    }
                }
            }
            scope = undefined;
        },
        fixVariables: function (vars) {
            vars.index = this.closurecount;
            switch (vars.type) {
                case 'arrowfn':
                vars.scope.fix_map['this'] = vars.locals['this'];
                vars.scope.fixed.push(vars.locals['this']);
                case 'travel':
                if (vars.type === 'travel') {
                    vars.scope.fixed.push('this');
                }
                vars.scope.fix_map['arguments'] = vars.locals['arguments'];
                vars.scope.fixed.push(vars.locals['arguments']);
                case 'blocklike':
                case 'scope':
                for (var element in vars.self) {
                    var varname = element;
                    if (keywords['includes'](element) || reserved['includes'](element)) {
                        this.error('keywords `' + element + '` cannot be a variable name.');
                    }
                    if (this.blockreserved['includes'](element)) {
                        varname = element + '_' + vars.index;
                        while (vars.self[varname]) {
                            varname = varname + '_' + vars.index;
                        }
                    }
                    while (vars.scope.fixed['includes'](varname)) {
                        varname = varname + '_' + vars.index;
                    }
                    vars.scope.fix_map[element] = varname;
                    if (hasProp(vars.scope.public, element)) {
                        vars.scope.public[element] = varname;
                    }
                    vars.scope.fixed.push(varname);
                }
                if ((vars.type === 'blocklike') || (vars.type === 'scope')) {
                    for (var key in vars.locals) {
                        if (hasProp(vars.locals, key)) {
                            var varname_755 = '_' + key;
                            while (vars.self[varname_755]) {
                                varname_755 = varname_755 + '_' + vars.index;
                            }
                            vars.locals[key] = varname_755;
                        }
                    }
                }
                break;
                case 'local':
                for (var element_757 in vars.self) {
                    if (vars.self[element_757] === 'const' || vars.self[element_757] === 'let') {
                        var varname_758 = element_757;
                        if (keywords['includes'](element_757) || reserved['includes'](element_757)) {
                            this.error('keywords `' + element_757 + '` cannot be a variable name.');
                        }
                        if (this.blockreserved['includes'](element_757) || this.xvars['includes'](element_757)) {
                            varname_758 = element_757 + '_' + vars.index;
                            while (vars.self[varname_758]) {
                                varname_758 = varname_758 + '_' + vars.index;
                            }
                        }
                        while (vars.scope.fixed['includes'](varname_758) || (vars.scope.private[varname_758] && (vars.scope.private[varname_758] !== vars))) {
                            varname_758 = varname_758 + '_' + vars.index;
                        }
                        if (varname_758 !== element_757) {
                            if (vars.scope.fixed['includes'](element_757)) {
                                vars.fix_map[element_757] = varname_758;
                            }
                            else {
                                vars.scope.fix_map[element_757] = varname_758;
                            }
                        }
                        vars.scope.fixed.push(varname_758);
                    }
                }
            }
            this.closurecount++;
        },
        patchVariables: function (code, vars) {
            var _this = this;
            var _arguments = arguments;
            if (code) {
                return code.replace(/(^|[^\$\w\.])(var\s+)?([\$a-zA-Z_][\$\w]*)\s*=\s*/g, function (match, before, definition, varname) {
                    if (!definition && hasProp(vars.scope.const, varname)) {
                        _this.error('Cannot re-assign constant `' + varname + '`');
                    }
                    return match;
                }).replace(/(^|[^\$\w\.])(var\s+)?([\$a-zA-Z_][\$\w]*)(\s+|\s*[^\$\w]|\s*$)/g, function (match, before, definition, varname, after) {
                    return before + (definition || '') + _this.patchVariable(varname, vars) + after || '';
                }).replace(/(^|[\?\:\=]\s*)(ns\.|\$\.|\.)(\.[\$a-zA-Z_][\$\w]*|$)/g, function (match, before, node, member) {
                    return before + _this.patchNamespace(node, vars) + member;
                });
            }
            return '';
        },
        patchVariable: function (varname, vars) {
            if (vars.fix_map && hasProp(vars.fix_map, varname)) {
                return vars.fix_map[varname];
            }
            if (vars.type === 'local') {
                var parent = vars.parent;
                while (parent && parent.type === 'local') {
                    if (parent.fix_map && hasProp(parent.fix_map, varname)) {
                        return parent.fix_map[varname];
                    }
                    parent = parent.parent;
                }
            }
            if (hasProp(vars.scope.fix_map, varname)) {
                return vars.scope.fix_map[varname];
            }
            if (!keywords['includes'](varname)&& !this.xvars['includes'](varname) && (!vars.scope.fixed['includes'](varname) || (hasProp(vars.scope.private, varname) && (vars.scope.private[varname] !== vars)))) {
                if (hasProp(vars.scope.private, varname)) {
                    var _varname = varname;
                    while (hasProp(vars.scope.private, varname)) {
                        varname = varname + '_' + vars.index;
                    }
                    while (vars.scope.fixed['includes'](varname)) {
                        varname = varname + '_' + vars.index;
                    }
                }
                else {
                    for (var key in vars.locals) {
                        if (hasProp(vars.locals, key)) {
                            var _key = vars.locals[key];
                            if (varname === _key) {
                                varname = varname + '_' + vars.index;
                                while (vars.scope.private[varname]) {
                                    varname = varname + '_' + vars.index;
                                }
                                while (vars.scope.fixed['includes'](varname)) {
                                    varname = varname + '_' + vars.index;
                                }
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
            !vars.scope.fixed['includes'](varname)&&
            !keywords['includes'](varname)&&
            !reserved['includes'](varname)&&
            !this.blockreserved['includes'](varname)&&
            !this.xvars['includes'](varname)) {
                varname = this.patchVariable(varname + '_' + vars.index, vars);
            };
            return varname;
        },
        patchNamespace: function (node, vars) {
            if (node === '.') {
                return 'pandora';
            }
            if (vars.scope.namespace) {
                return ('pandora.' + vars.scope.namespace).replace(/\.+$/, '');
            }
            return ('pandora.' + this.namespace).replace(/\.+$/, '');
        },
        restoreStrings: function (string, last) {
            var that = this;
            if (last) {
                var pattern = this.lastPattern;
            }
            else {
                var pattern = this.trimPattern;
            }
            return string.replace(pattern, function () {
                if (arguments[5]) {
                    return that.replacements[arguments[5]][0].toString();
                }
                return that.replacements[arguments[2] || arguments[4]][0].toString();
            }).replace(this.markPattern, function () {
                return that.replacements[arguments[1]][0].toString();
            }).replace(/(@\d+L\d+P\d+O?\d*:::)/g, '');
        },
        decode: function (string) {
            string = string.replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
            var matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
            while (matches) {
                string = string.replace(matches[0], this.replacements[matches[2]][0].toString()).replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
                matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
            }
            matches = string.match(/@boundary_(\d+)_as_[a-z]+::/);
            while (matches) {
                string = string.replace(matches[0], this.replacements[matches[1]][0].toString()).replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
                matches = string.match(/@boundary_(\d+)_as_[a-z]+::/);
            }
            matches = undefined;
            return string.replace(/(@\d+L\d+P\d+O?\d*:::)/g, '');
        },
        trim: function (string) {
            var _this = this;
            var _arguments = arguments;
            string = this.replaceStrings(string, true);
            string = string.replace(/\s*(@boundary_\d+_as_comments::)?@(ownprop|return)[; \t]*/g, function () {
                return '';
            });
            string = string.replace(/((@boundary_\d+_as_comments::)\s*)+(@boundary_\d+_as_comments::)/g, "$3");
            string = string.replace(/\s*;(\s*;)*[\t \x0B]*/g, ";");
            string = string.replace(/(.)(\{|\[|\(|\.|\:)\s*[,;]+/g, function (match, before, mark) {
                if ((before === mark) && (before === ':')) {
                    return match;
                }
                return before + mark;
            });
            string = string.replace(/[;\s]*[\r\n]+(\t*)[ ]*(@boundary_\d+_as_comments::)(@boundary_\d+_as_operator::)\s*/g, function (match, white, comments, midword) {
                return "\r\n" + white.replace(/\t/g, '    ') + '   ' + comments + midword;
            });
            string = string.replace(/\s*(@boundary_\d+_as_operator::)[;\s]*[\r\n]+(\t*)[ ]*(@boundary_\d+_as_comments::)/g, "\r\n$2   $3 $1 ");
            string = string.replace(/(}*[;\s]*)[\r\n]+([ \t]*)[ ]*(@boundary_\d+_as_comments::)(@boundary_\d+_as_midword::)\s*/g, function (match, pre, white, comments, midword) {
                return pre.replace(/\s+/g, '').replace(/\};/g, '}') + "\r\n" + white.replace(/\t/g, '    ') + comments + midword;
            });
            string = string.replace(/[;\s]*(\=|\?)[;\s]*/g, " $1 ");
            string = string.replace(/\s+(\:)[;\s]*/g, " $1 ");
            string = string.replace(/[;\s]+(@boundary_\d+_as_comments::)(\:)[;\s]*/g, " $2 $1");
            string = string.replace(/[^\:\S]+(\:)\s*(@boundary_\d+_as_comments::)/g, " $1 $2");
            string = string.replace(/\s+[\r\n]([ \t])/g, function (match, white) {
                return "\r\n" + white.replace(/\t/g, '    ');
            });
            string = string.replace(/\{\s+\}/g, '{}');
            string = string.replace(/\[\s+\]/g, '[]');
            string = string.replace(/\(\s+\)/g, '()');
            string = string.replace(/(\s*)(@boundary_(\d+)_as_(operator|aftoperator|keyword|midword)::)\s*/g, function (match, pregap, operator, index) {
                if (_this.replacements[index][1]) {
                    return pregap + operator;
                }
                return operator;
            });
            string = string.replace(/(@boundary_\d+_as_(preoperator)::)(\s*;+|(\s+([^;])))/g, function (match, operator, word, right, afterwithgap, after) {
                if (after) {
                    return operator + after;
                }
                return operator;
            });
            string = string.replace(/\)\s*return\s+/, ') return ');
            return string;
        },
        run: function (precall, callback) {
            var _this = this;
            var _arguments = arguments;
            if (precall === void 0) { precall = null;}
            if (callback === void 0) { callback = function (content) {};}
            if (!this.output) {
                this.compile();
            }
            precall && precall.call(this, this.output);
            eval(this.output);
            callback.call(this);
        }
    });
    root.tanguage_script = function (input, run) {
        return new Script(input, run);
    };
    return root.tanguage_script;
});