/*!
 * tanguage framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tang.init().block('$_/see/highlight/highlight', function(_, global, imports, undefined) {
    _.see.highlight.languages.clike = {
        'comment': [{
                pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
                lookbehind: true
            },
            {
                pattern: /(^|[^\\:])\/\/.*/,
                lookbehind: true
            }
        ],
        'string': {
            pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
            greedy: true
        },
        'class-name': {
            pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
            lookbehind: true,
            inside: {
                punctuation: /(\.|\\)/
            }
        },
        'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
        'boolean': /\b(true|false)\b/,
        'function': /[a-z0-9_]+(?=\()/i,
        'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
        'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
        'punctuation': /[{}[\];(),.:]/
    };
});