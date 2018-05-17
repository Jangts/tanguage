/*!
 * tanguage framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tang.init().block('$_/see/highlight/highlight', function(_, global, imports, undefined) {
    _.see.highlight.languages.json = {
        'property': /".*?"(?=\s*:)/ig,
        'string': /"(?!:)(\\?[^"])*?"(?!:)/g,
        'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
        'punctuation': /[{}[\]);,]/g,
        'operator': /:/g,
        'boolean': /\b(true|false)\b/gi,
        'null': /\bnull\b/gi,
    };
});