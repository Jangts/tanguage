/*!
 * tanguage framework source code
 *
 * static see.highlight.language
 *
 * Date: 2017-04-06
 */
;
tang.init().block('$_/see/highlight/highlight', function(_, global, imports, undefined) {
    _.see.highlight.languages.brainfuck = {
        'pointer': {
            pattern: /<|>/,
            alias: 'keyword'
        },
        'increment': {
            pattern: /\+/,
            alias: 'inserted'
        },
        'decrement': {
            pattern: /-/,
            alias: 'deleted'
        },
        'branching': {
            pattern: /\[|\]/,
            alias: 'important'
        },
        'operator': /[.,]/,
        'comment': /\S+/
    };
});