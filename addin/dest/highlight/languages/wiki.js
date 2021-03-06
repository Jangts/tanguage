/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:28:53 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/markup'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var highlight = pandora.highlight;
	highlight.languages.wiki = highlight.languages.extend('markup', {
		'block-comment': {
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true,
			alias: 'comment'
		},
		'heading': {
			pattern: /^(=+).+?\1/m,
			inside: {
				'punctuation': /^=+|=+$/,
				'important': /.+/
			}
		},
		'emphasis': {
			pattern: /('{2,5}).+?\1/,
			inside: {
				'bold italic': {
					pattern: /(''''').+?(?=\1)/,
					lookbehind: true
				},
				'bold': {
					pattern: /(''')[^'](?:.*?[^'])?(?=\1)/,
					lookbehind: true
				},
				'italic': {
					pattern: /('')[^'](?:.*?[^'])?(?=\1)/,
					lookbehind: true
				},
				'punctuation': /^''+|''+$/
			}
		},
		'hr': {
			pattern: /^-{4,}/m,
			alias: 'punctuation'
		},
		'url': [/ISBN +(?:97[89][ -]?)?(?:\d[ -]?){9}[\dx]\b|(?:RFC|PMID) +\d+/i, /\[\[.+?\]\]|\[.+?\]/],
		'variable': [/__[A-Z]+__/, /\{{3}.+?\}{3}/, /\{\{.+?}}/],
		'symbol': [
			/^#redirect/im,
			/~{3,5}/
		],
		'table-tag': {
			pattern: /((?:^|[|!])[|!])[^|\r\n]+\|(?!\|)/m,
			lookbehind: true,
			inside: {
				'table-bar': {
					pattern: /\|$/,
					alias: 'punctuation'
				},
				rest: highlight.languages.markup['tag'].inside
			}
		},
		'punctuation': /^(?:\{\||\|\}|\|-|[*#:;!|])|\|\||!!/m
	});
	highlight.languages.insertBefore('wiki', 'tag', {
		'nowiki': {
			pattern: /<(nowiki|pre|source)\b[\w\W]*?>[\w\W]*?<\/\1>/i,
			inside: {
				'tag': {
					pattern: /<(?:nowiki|pre|source)\b[\w\W]*?>|<\/(?:nowiki|pre|source)>/i,
					inside: highlight.languages.markup['tag'].inside
				}
			}
		}
	});
});
//# sourceMappingURL=wiki.js.map