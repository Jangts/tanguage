const
zero2z = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
namingExpr = /^[A-Z_\$][\w\$]*$/i,
argsExpr = /^...[A-Z_\$][\w\$]*$/i,
stringas = {
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
operators = {
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
    closure: /(@\d+L\d+P\d+O*\d*:::)?(@*[\$a-zA-Z_][\$\w]*|\)|\=|\(\s)?(@\d+L\d+P\d+O*\d*:::)?\s*\{(\s*[^\{\}]*?)\s*\}/g,
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
    arrowfn: /(___boundary_[A-Z0-9_]{36}_(\d+)_as_parentheses___)\s*(->|=>)\s*([\s\S]+)\s*$/,
    objectattr: /^\s*(@\d+L\d+P\d+O?\d*:::)?((([\$a-zA-Z_][\$\w]*)))\s*(\:*)([\s\S]*)$/,
    classelement: /^\s*(@\d+L\d+P\d+O?\d*:::)?((public|static|set|get|om)\s+)?([\$\w]*)\s*(\=*)([\s\S]*)$/,
    travelargs: /^((@\d+L\d+P\d+O*\d*:::)?[\$a-zA-Z_][\$\w\.]*)\s+as\s(@\d+L\d+P\d+O*\d*:::)([\$a-zA-Z_][\$\w]*)(\s*,((@\d+L\d+P\d+O*\d*:::)([\$a-zA-Z_][\$\w]*)?)?)?/
},
hasProp = (obj, prop) => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
},
boundaryMaker = () => {
    let radix = 36;
    let uid = new Array(radix);
    for (let i = 0; i < radix; i++) {
        uid[i] = zero2z[Math.floor(Math.random() * radix)];
    }
    uid[8] = uid[13] = uid[18] = uid[23] = '_';
    radix = undefined;
    return uid.join('');
},
stringRepeat = (string, number) => {
    return new Array(number + 1).join(string);
};