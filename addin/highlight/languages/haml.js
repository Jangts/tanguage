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
    '$_/see/highlight/languages/coffeescript',
    '$_/see/highlight/languages/erb',
    '$_/see/highlight/languages/javascript',
    '$_/see/highlight/languages/less',
    '$_/see/highlight/languages/ruby',
    '$_/see/highlight/languages/scss',
    '$_/see/highlight/languages/textile',
], function(_, global, imports, undefined) {
    var highlight = _.see.highlight;
    var handlebars_pattern = /\{\{\{[\w\W]+?\}\}\}|\{\{[\w\W]+?\}\}/g;

    highlight.languages.haml = {
        // Multiline stuff should appear before the rest

        'multiline-comment': {
            pattern: /((?:^|\r?\n|\r)([\t ]*))(?:\/|-#).*((?:\r?\n|\r)\2[\t ]+.+)*/,
            lookbehind: true,
            alias: 'comment'
        },

        'multiline-code': [{
                pattern: /((?:^|\r?\n|\r)([\t ]*)(?:[~-]|[&!]?=)).*,[\t ]*((?:\r?\n|\r)\2[\t ]+.*,[\t ]*)*((?:\r?\n|\r)\2[\t ]+.+)/,
                lookbehind: true,
                inside: {
                    rest: highlight.languages.ruby
                }
            },
            {
                pattern: /((?:^|\r?\n|\r)([\t ]*)(?:[~-]|[&!]?=)).*\|[\t ]*((?:\r?\n|\r)\2[\t ]+.*\|[\t ]*)*/,
                lookbehind: true,
                inside: {
                    rest: highlight.languages.ruby
                }
            }
        ],

        // See at the end of the file for known filters
        'filter': {
            pattern: /((?:^|\r?\n|\r)([\t ]*)):[\w-]+((?:\r?\n|\r)(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/,
            lookbehind: true,
            inside: {
                'filter-name': {
                    pattern: /^:[\w-]+/,
                    alias: 'variable'
                }
            }
        },

        'markup': {
            pattern: /((?:^|\r?\n|\r)[\t ]*)<.+/,
            lookbehind: true,
            inside: {
                rest: highlight.languages.markup
            }
        },
        'doctype': {
            pattern: /((?:^|\r?\n|\r)[\t ]*)!!!(?: .+)?/,
            lookbehind: true
        },
        'tag': {
            // Allows for one nested group of braces
            pattern: /((?:^|\r?\n|\r)[\t ]*)[%.#][\w\-#.]*[\w\-](?:\([^)]+\)|\{(?:\{[^}]+\}|[^}])+\}|\[[^\]]+\])*[\/<>]*/,
            lookbehind: true,
            inside: {
                'attributes': [{
                        // Lookbehind tries to prevent interpolations for breaking it all
                        // Allows for one nested group of braces
                        pattern: /(^|[^#])\{(?:\{[^}]+\}|[^}])+\}/,
                        lookbehind: true,
                        inside: {
                            rest: highlight.languages.ruby
                        }
                    },
                    {
                        pattern: /\([^)]+\)/,
                        inside: {
                            'attr-value': {
                                pattern: /(=\s*)(?:"(?:\\?.)*?"|[^)\s]+)/,
                                lookbehind: true
                            },
                            'attr-name': /[\w:-]+(?=\s*!?=|\s*[,)])/,
                            'punctuation': /[=(),]/
                        }
                    },
                    {
                        pattern: /\[[^\]]+\]/,
                        inside: {
                            rest: highlight.languages.ruby
                        }
                    }
                ],
                'punctuation': /[<>]/
            }
        },
        'code': {
            pattern: /((?:^|\r?\n|\r)[\t ]*(?:[~-]|[&!]?=)).+/,
            lookbehind: true,
            inside: {
                rest: highlight.languages.ruby
            }
        },
        // Interpolations in plain text
        'interpolation': {
            pattern: /#\{[^}]+\}/,
            inside: {
                'delimiter': {
                    pattern: /^#\{|\}$/,
                    alias: 'punctuation'
                },
                rest: highlight.languages.ruby
            }
        },
        'punctuation': {
            pattern: /((?:^|\r?\n|\r)[\t ]*)[~=\-&!]+/,
            lookbehind: true
        }
    };

    var filter_pattern = '((?:^|\\r?\\n|\\r)([\\t ]*)):{{filter_name}}((?:\\r?\\n|\\r)(?:\\2[\\t ]+.+|\\s*?(?=\\r?\\n|\\r)))+';

    // Non exhaustive list of available filters and associated languages
    var filters = [
        'css',
        { filter: 'coffee', language: 'coffeescript' },
        'erb',
        'javascript',
        'less',
        'markdown',
        'ruby',
        'scss',
        'textile'
    ];
    var all_filters = {};
    for (var i = 0, l = filters.length; i < l; i++) {
        var filter = filters[i];
        filter = typeof filter === 'string' ? { filter: filter, language: filter } : filter;
        if (highlight.languages[filter.language]) {
            all_filters['filter-' + filter.filter] = {
                pattern: RegExp(filter_pattern.replace('{{filter_name}}', filter.filter)),
                lookbehind: true,
                inside: {
                    'filter-name': {
                        pattern: /^:[\w-]+/,
                        alias: 'variable'
                    },
                    rest: highlight.languages[filter.language]
                }
            }
        }
    }

    highlight.languages.insertBefore('haml', 'filter', all_filters);
});