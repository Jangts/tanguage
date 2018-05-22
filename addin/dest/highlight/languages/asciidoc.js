/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:18:01 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../'
], function (pandora, root, imports, undefined) {
	var highlight = pandora.highlight;
	var attributes = {
		pattern: /(^[ \t]*)\[(?!\[)(?:(["'$`])(?:(?!\2)[^\\]|\\.)*\2|\[(?:[^\]\\]|\\.)*\]|[^\]\\]|\\.)*\]/m,
		lookbehind: true,
		inside: {
			'quoted': {
				pattern: /([$`])(?:(?!\1)[^\\]|\\.)*\1/,
				inside: {
					'punctuation': /^[$`]|[$`]$/
				}
			},
			'interpreted': {
				pattern: /'(?:[^'\\]|\\.)*'/,
				inside: {
					'punctuation': /^'|'$/
				}
			},
			'string': /"(?:[^"\\]|\\.)*"/,
			'variable': /\w+(?==)/,
			'punctuation': /^\[|\]$|,/,
			'operator': /\=/,
			'attr-value': /(?!^\s+$).+/
		}
	};
	highlight.languages.asciidoc = {
		'comment-block': {
			pattern: /^(\/{4,})(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?\1/m,
			alias: 'comment'
		},
		'table': {
			pattern: /^\|={3,}(?:(?:\r?\n|\r).*)*?(?:\r?\n|\r)\|={3,}$/m,
			inside: {
				'specifiers': {
					pattern: /(?!\|)(?:(?:(?:\d+(?:\.\d+)?|\.\d+)[+*])?(?:[<^>](?:\.[<^>])?|\.[<^>])?[a-z]*)(?=\|)/,
					alias: 'attr-value'
				},
				'punctuation': {
					pattern: /(^|[^\\])[|!]=*/,
					lookbehind: true
				}
			}
		},
		'passthrough-block': {
			pattern: /^(\+{4,})(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?\1$/m,
			inside: {
				'punctuation': /^\++|\++$/
			}
		},
		'literal-block': {
			pattern: /^(-{4,}|\.{4,})(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?\1$/m,
			inside: {
				'punctuation': /^(?:-+|\.+)|(?:-+|\.+)$/
			}
		},
		'other-block': {
			pattern: /^(--|\*{4,}|_{4,}|={4,})(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?\1$/m,
			inside: {
				'punctuation': /^(?:-+|\*+|_+|=+)|(?:-+|\*+|_+|=+)$/
			}
		},
		'list-punctuation': {
			pattern: /(^[ \t]*)(?:-|\*{1,5}|\.{1,5}|(?:[a-z]|\d+)\.|[xvi]+\))(?= )/im,
			lookbehind: true,
			alias: 'punctuation'
		},
		'list-label': {
			pattern: /(^[ \t]*)[a-z\d].+(?::{2,4}|;;)(?=\s)/im,
			lookbehind: true,
			alias: 'symbol'
		},
		'indented-block': {
			pattern: /((\r?\n|\r)\2)([ \t]+)\S.*(?:(?:\r?\n|\r)\3.+)*(?=\2{2}|$)/,
			lookbehind: true
		},
		'comment': /^\/\/.*/m,
		'title': {
			pattern: /^.+(?:\r?\n|\r)(?:={3,}|-{3,}|~{3,}|\^{3,}|\+{3,})$|^={1,5} +.+|^\.(?![\s.]).*/m,
			alias: 'important',
			inside: {
				'punctuation': /^(?:\.|=+)|(?:=+|-+|~+|\^+|\++)$/
			}
		},
		'attribute-entry': {
			pattern: /^:[^:\r\n]+:(?: .*?(?: \+(?:\r?\n|\r).*?)*)?$/m,
			alias: 'tag'
		},
		'attributes': attributes,
		'hr': {
			pattern: /^'{3,}$/m,
			alias: 'punctuation'
		},
		'page-break': {
			pattern: /^<{3,}$/m,
			alias: 'punctuation'
		},
		'admonition': {
			pattern: /^(?:TIP|NOTE|IMPORTANT|WARNING|CAUTION):/m,
			alias: 'keyword'
		},
		'callout': [{
			pattern: /(^[ \t]*)<?\d*>/m,
			lookbehind: true,
			alias: 'symbol'
		}, {
			pattern: /<\d+>/,
			alias: 'symbol'
		}],
		'macro': {
			pattern: /\b[a-z\d][a-z\d-]*::?(?:(?:\S+)??\[(?:[^\]\\"]|(["'])(?:(?!\1)[^\\]|\\.)*\1|\\.)*\])/,
			inside: {
				'function': /^[a-z\d-]+(?=:)/,
				'punctuation': /^::?/,
				'attributes': {
					pattern: /(?:\[(?:[^\]\\"]|(["'])(?:(?!\1)[^\\]|\\.)*\1|\\.)*\])/,
					inside: attributes.inside
				}
			}
		},
		'inline': {
			pattern: /(^|[^\\])(?:(?:\B\[(?:[^\]\\"]|(["'])(?:(?!\2)[^\\]|\\.)*\2|\\.)*\])?(?:\b_(?!\s)(?: _|[^_\\\r\n]|\\.)+(?:(?:\r?\n|\r)(?: _|[^_\\\r\n]|\\.)+)*_\b|\B``(?!\s).+?(?:(?:\r?\n|\r).+?)*''\B|\B`(?!\s)(?: ['`]|.)+?(?:(?:\r?\n|\r)(?: ['`]|.)+?)*['`]\B|\B(['*+#])(?!\s)(?: \3|(?!\3)[^\\\r\n]|\\.)+(?:(?:\r?\n|\r)(?: \3|(?!\3)[^\\\r\n]|\\.)+)*\3\B)|(?:\[(?:[^\]\\"]|(["'])(?:(?!\4)[^\\]|\\.)*\4|\\.)*\])?(?:(__|\*\*|\+\+\+?|##|\$\$|[~^]).+?(?:(?:\r?\n|\r).+?)*\5|\{[^}\r\n]+\}|\[\[\[?.+?(?:(?:\r?\n|\r).+?)*\]?\]\]|<<.+?(?:(?:\r?\n|\r).+?)*>>|\(\(\(?.+?(?:(?:\r?\n|\r).+?)*\)?\)\)))/m,
			lookbehind: true,
			inside: {
				'attributes': attributes,
				'url': {
					pattern: /^(?:\[\[\[?.+?\]?\]\]|<<.+?>>)$/,
					inside: {
						'punctuation': /^(?:\[\[\[?|<<)|(?:\]\]\]?|>>)$/
					}
				},
				'attribute-ref': {
					pattern: /^\{.+\}$/,
					inside: {
						'variable': {
							pattern: /(^\{)[a-z\d,+_-]+/,
							lookbehind: true
						},
						'operator': /^[=?!#%@$]|!(?=[:}])/,
						'punctuation': /^\{|\}$|::?/
					}
				},
				'italic': {
					pattern: /^(['_])[\s\S]+\1$/,
					inside: {
						'punctuation': /^(?:''?|__?)|(?:''?|__?)$/
					}
				},
				'bold': {
					pattern: /^\*[\s\S]+\*$/,
					inside: {
						punctuation: /^\*\*?|\*\*?$/
					}
				},
				'punctuation': /^(?:``?|\+{1,3}|##?|\$\$|[~^]|\(\(\(?)|(?:''?|\+{1,3}|##?|\$\$|[~^`]|\)?\)\))$/
			}
		},
		'replacement': {
			pattern: /\((?:C|TM|R)\)/,
			alias: 'builtin'
		},
		'entity': /&#?[\da-z]{1,8};/i,
		'line-continuation': {
			pattern: /(^| )\+$/m,
			lookbehind: true,
			alias: 'punctuation'
		}
	};
	attributes.inside['interpreted'].inside.rest = {
		'macro': highlight.languages.asciidoc['macro'],
		'inline': highlight.languages.asciidoc['inline'],
		'replacement': highlight.languages.asciidoc['replacement'],
		'entity': highlight.languages.asciidoc['entity']
	};
	highlight.languages.asciidoc['passthrough-block'].inside.rest = {
		'macro': highlight.languages.asciidoc['macro']
	};
	highlight.languages.asciidoc['literal-block'].inside.rest = {
		'callout': highlight.languages.asciidoc['callout']
	};
	highlight.languages.asciidoc['table'].inside.rest = {
		'comment-block': highlight.languages.asciidoc['comment-block'],
		'passthrough-block': highlight.languages.asciidoc['passthrough-block'],
		'literal-block': highlight.languages.asciidoc['literal-block'],
		'other-block': highlight.languages.asciidoc['other-block'],
		'list-punctuation': highlight.languages.asciidoc['list-punctuation'],
		'indented-block': highlight.languages.asciidoc['indented-block'],
		'comment': highlight.languages.asciidoc['comment'],
		'title': highlight.languages.asciidoc['title'],
		'attribute-entry': highlight.languages.asciidoc['attribute-entry'],
		'attributes': highlight.languages.asciidoc['attributes'],
		'hr': highlight.languages.asciidoc['hr'],
		'page-break': highlight.languages.asciidoc['page-break'],
		'admonition': highlight.languages.asciidoc['admonition'],
		'list-label': highlight.languages.asciidoc['list-label'],
		'callout': highlight.languages.asciidoc['callout'],
		'macro': highlight.languages.asciidoc['macro'],
		'inline': highlight.languages.asciidoc['inline'],
		'replacement': highlight.languages.asciidoc['replacement'],
		'entity': highlight.languages.asciidoc['entity'],
		'line-continuation': highlight.languages.asciidoc['line-continuation']
	};
	highlight.languages.asciidoc['other-block'].inside.rest = {
		'table': highlight.languages.asciidoc['table'],
		'list-punctuation': highlight.languages.asciidoc['list-punctuation'],
		'indented-block': highlight.languages.asciidoc['indented-block'],
		'comment': highlight.languages.asciidoc['comment'],
		'attribute-entry': highlight.languages.asciidoc['attribute-entry'],
		'attributes': highlight.languages.asciidoc['attributes'],
		'hr': highlight.languages.asciidoc['hr'],
		'page-break': highlight.languages.asciidoc['page-break'],
		'admonition': highlight.languages.asciidoc['admonition'],
		'list-label': highlight.languages.asciidoc['list-label'],
		'macro': highlight.languages.asciidoc['macro'],
		'inline': highlight.languages.asciidoc['inline'],
		'replacement': highlight.languages.asciidoc['replacement'],
		'entity': highlight.languages.asciidoc['entity'],
		'line-continuation': highlight.languages.asciidoc['line-continuation']
	};
	highlight.languages.asciidoc['title'].inside.rest = {
		'macro': highlight.languages.asciidoc['macro'],
		'inline': highlight.languages.asciidoc['inline'],
		'replacement': highlight.languages.asciidoc['replacement'],
		'entity': highlight.languages.asciidoc['entity']
	};
	highlight.hooks.add('wrap', function (env) {
		if (env.type === 'entity') {
			env.attributes['title'] = env.content.replace(/&amp;/, '&');
		};
	});
}, true);
//# sourceMappingURL=asciidoc.js.map