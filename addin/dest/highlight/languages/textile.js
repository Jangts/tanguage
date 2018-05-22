/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:33 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/css'
], function (pandora, root, imports, undefined) {;
	var highlight = pandora.highlight;
	var modifierRegex = '(?:\\([^|)]+\\)|\\[[^\\]]+\\]|\\{[^}]+\\})+';
	var modifierTokens = {
		'css': {
			pattern: /\{[^}]+\}/,
			inside: {
				rest: highlight.languages.css
			}
		},
		'class-id': {
			pattern: /(\()[^)]+(?=\))/,
			lookbehind: true,
			alias: 'attr-value'
		},
		'lang': {
			pattern: /(\[)[^\]]+(?=\])/,
			lookbehind: true,
			alias: 'attr-value'
		},
		'punctuation': /[\\\/]\d+|\S/
	};
	highlight.languages.textile = highlight.languages.extend('markup', {
		'phrase': {
			pattern: /(^|\r|\n)\S[\s\S]*?(?=$|\r?\n\r?\n|\r\r)/,
			lookbehind: true,
			inside: {
				'block-tag': {
					pattern: RegExp('^[a-z]\\w*(?:' + modifierRegex + '|[<>=()])*\\.'),
					inside: {
						'modifier': {
							pattern: RegExp('(^[a-z]\\w*)(?:' + modifierRegex + '|[<>=()])+(?=\\.)'),
							lookbehind: true,
							inside: _.copy(modifierTokens)
						},
						'tag': /^[a-z]\w*/,
						'punctuation': /\.$/
					}
				},
				'list': {
					pattern: RegExp('^[*#]+(?:' + modifierRegex + ')?\\s+.+', 'm'),
					inside: {
						'modifier': {
							pattern: RegExp('(^[*#]+)' + modifierRegex),
							lookbehind: true,
							inside: _.copy(modifierTokens)
						},
						'punctuation': /^[*#]+/
					}
				},
				'table': {
					pattern: RegExp('^(?:(?:' + modifierRegex + '|[<>=()^~])+\\.\\s*)?(?:\\|(?:(?:' + modifierRegex + '|[<>=()^~_]|[\\\\/]\\d+)+\\.)?[^|]*)+\\|', 'm'),
					inside: {
						'modifier': {
							pattern: RegExp('(^|\\|(?:\\r?\\n|\\r)?)(?:' + modifierRegex + '|[<>=()^~_]|[\\\\/]\\d+)+(?=\\.)'),
							lookbehind: true,
							inside: _.copy(modifierTokens)
						},
						'punctuation': /\||^\./
					}
				},
				'inline': {
					pattern: RegExp('(\\*\\*|__|\\?\\?|[*_%@+\\-^~])(?:' + modifierRegex + ')?.+?\\1'),
					inside: {
						'bold': {
							pattern: RegExp('((^\\*\\*?)(?:' + modifierRegex + ')?).+?(?=\\2)'),
							lookbehind: true
						},
						'italic': {
							pattern: RegExp('((^__?)(?:' + modifierRegex + ')?).+?(?=\\2)'),
							lookbehind: true
						},
						'cite': {
							pattern: RegExp('(^\\?\\?(?:' + modifierRegex + ')?).+?(?=\\?\\?)'),
							lookbehind: true,
							alias: 'string'
						},
						'code': {
							pattern: RegExp('(^@(?:' + modifierRegex + ')?).+?(?=@)'),
							lookbehind: true,
							alias: 'keyword'
						},
						'inserted': {
							pattern: RegExp('(^\\+(?:' + modifierRegex + ')?).+?(?=\\+)'),
							lookbehind: true
						},
						'deleted': {
							pattern: RegExp('(^-(?:' + modifierRegex + ')?).+?(?=-)'),
							lookbehind: true
						},
						'span': {
							pattern: RegExp('(^%(?:' + modifierRegex + ')?).+?(?=%)'),
							lookbehind: true
						},
						'modifier': {
							pattern: RegExp('(^\\*\\*|__|\\?\\?|[*_%@+\\-^~])' + modifierRegex),
							lookbehind: true,
							inside: _.copy(modifierTokens)
						},
						'punctuation': /[*_%?@+\-^~]+/
					}
				},
				'link-ref': {
					pattern: /^\[[^\]]+\]\S+$/m,
					inside: {
						'string': {
							pattern: /(\[)[^\]]+(?=\])/,
							lookbehind: true
						},
						'url': {
							pattern: /(\])\S+$/,
							lookbehind: true
						},
						'punctuation': /[\[\]]/
					}
				},
				'link': {
					pattern: RegExp('"(?:' + modifierRegex + ')?[^"]+":.+?(?=[^\\w/]?(?:\\s|$))'),
					inside: {
						'text': {
							pattern: RegExp('(^"(?:' + modifierRegex + ')?)[^"]+(?=")'),
							lookbehind: true
						},
						'modifier': {
							pattern: RegExp('(^")' + modifierRegex),
							lookbehind: true,
							inside: _.copy(modifierTokens)
						},
						'url': {
							pattern: /(:).+/,
							lookbehind: true
						},
						'punctuation': /[":]/
					}
				},
				'image': {
					pattern: RegExp('!(?:' + modifierRegex + '|[<>=()])*[^!\\s()]+(?:\\([^)]+\\))?!(?::.+?(?=[^\\w/]?(?:\\s|$)))?'),
					inside: {
						'source': {
							pattern: RegExp('(^!(?:' + modifierRegex + '|[<>=()])*)[^!\\s()]+(?:\\([^)]+\\))?(?=!)'),
							lookbehind: true,
							alias: 'url'
						},
						'modifier': {
							pattern: RegExp('(^!)(?:' + modifierRegex + '|[<>=()])+'),
							lookbehind: true,
							inside: _.copy(modifierTokens)
						},
						'url': {
							pattern: /(:).+/,
							lookbehind: true
						},
						'punctuation': /[!:]/
					}
				},
				'footnote': {
					pattern: /\b\[\d+\]/,
					alias: 'comment',
					inside: {
						'punctuation': /\[|\]/
					}
				},
				'acronym': {
					pattern: /\b[A-Z\d]+\([^)]+\)/,
					inside: {
						'comment': {
							pattern: /(\()[^)]+(?=\))/,
							lookbehind: true
						},
						'punctuation': /[()]/
					}
				},
				'mark': {
					pattern: /\b\((TM|R|C)\)/,
					alias: 'comment',
					inside: {
						'punctuation': /[()]/
					}
				}
			}
		}
	});
	var nestedPatterns = {
		'inline': _.copy(highlight.languages.textile['phrase'].inside['inline']),
		'link': _.copy(highlight.languages.textile['phrase'].inside['link']),
		'image': _.copy(highlight.languages.textile['phrase'].inside['image']),
		'footnote': _.copy(highlight.languages.textile['phrase'].inside['footnote']),
		'acronym': _.copy(highlight.languages.textile['phrase'].inside['acronym']),
		'mark': _.copy(highlight.languages.textile['phrase'].inside['mark'])
	};
	highlight.languages.textile['phrase'].inside['inline'].inside['bold'].inside = nestedPatterns;
	highlight.languages.textile['phrase'].inside['inline'].inside['italic'].inside = nestedPatterns;
	highlight.languages.textile['phrase'].inside['inline'].inside['inserted'].inside = nestedPatterns;
	highlight.languages.textile['phrase'].inside['inline'].inside['deleted'].inside = nestedPatterns;
	highlight.languages.textile['phrase'].inside['inline'].inside['span'].inside = nestedPatterns;
	highlight.languages.textile['phrase'].inside['table'].inside['inline'] = nestedPatterns['inline'];
	highlight.languages.textile['phrase'].inside['table'].inside['link'] = nestedPatterns['link'];
	highlight.languages.textile['phrase'].inside['table'].inside['image'] = nestedPatterns['image'];
	highlight.languages.textile['phrase'].inside['table'].inside['footnote'] = nestedPatterns['footnote'];
	highlight.languages.textile['phrase'].inside['table'].inside['acronym'] = nestedPatterns['acronym'];
	highlight.languages.textile['phrase'].inside['table'].inside['mark'] = nestedPatterns['mark'];
}, true);
//# sourceMappingURL=textile.js.map