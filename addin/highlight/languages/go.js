/*!
 * tanguage framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tang.init().block([
    '$_/see/highlight/highlight',
    '$_/see/highlight/languages/clike'
], function(_, global, imports, undefined) {
    var highlight = _.see.highlight;
    highlight.languages.go = highlight.languages.extend('clike', {
        'keyword': /\b(break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
        'builtin': /\b(bool|byte|complex(64|128)|error|float(32|64)|rune|string|u?int(8|16|32|64|)|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print(ln)?|real|recover)\b/,
        'boolean': /\b(_|iota|nil|true|false)\b/,
        'operator': /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
        'number': /\b(-?(0x[a-f\d]+|(\d+\.?\d*|\.\d+)(e[-+]?\d+)?)i?)\b/i,
        'string': /("|'|`)(\\?.|\r|\n)*?\1/
    });
    delete highlight.languages.go['class-name'];
});