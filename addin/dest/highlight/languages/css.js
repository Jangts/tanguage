/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:31 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../'
], function (pandora, root, imports, undefined) {
	var highlight = pandora.highlight;
	highlight.languages.css = {
		'comment': /\/\*[\w\W]*?\*\//,
		'atrule': {
			pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
			inside: {
				'rule': /@[\w-]+/
			}
		},
		'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
		'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
		'string': /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
		'property': /(\b|\B)[\w-]+(?=\s*:)/i,
		'important': /\B!important\b/i,
		'function': /[-a-z0-9]+(?=\()/i,
		'punctuation': /[(){};:]/
	};
	highlight.languages.css['atrule'].inside.rest = _.copy(highlight.languages.css);
	if (highlight.languages.markup) {
		highlight.languages.insertBefore('markup', 'tag', {
			'style': {
				pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
				lookbehind: true,
				inside: highlight.languages.css,
				alias: 'language-css'
			}
		});
		highlight.languages.insertBefore('inside', 'attr-value', {
			'style-attr': {
				pattern: /\s*style=("|').*?\1/i,
				inside: {
					'attr-name': {
						pattern: /^\s*style/i,
						inside: highlight.languages.markup.tag.inside
					},
					'punctuation': /^\s*=\s*['"]|['"]\s*$/,
					'attr-value': {
						pattern: /.+/i,
						inside: highlight.languages.css
					}
				},
				alias: 'language-css'
			}
		}, highlight.languages.markup.tag);
	}
	highlight.languages.css.selector = {
		pattern: /[^\{\}\s][^\{\}]*(?=\s*\{)/,
		inside: {
			'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
			'pseudo-class': /:[-\w]+(?:\(.*\))?/,
			'class': /\.[-:\.\w]+/,
			'id': /#[-:\.\w]+/
		}
	};
	highlight.languages.insertBefore('css', 'function', {
		'hexcode': /#[\da-f]{3,6}/i,
		'entity': /\\[\da-f]{1,8}/i,
		'number': /[\d%\.]+/
	});
}, true);
//# sourceMappingURL=css.js.map