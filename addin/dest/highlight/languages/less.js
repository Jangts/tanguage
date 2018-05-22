/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:31 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/css'
], function (pandora, root, imports, undefined) {
	var highlight = pandora.highlight;
	highlight.languages.less = highlight.languages.extend('css', {
		'comment': [/\/\*[\w\W]*?\*\//, {
			pattern: /(^|[^\\])\/\/.*/,
			lookbehind: true
		}],
		'atrule': {
			pattern: /@[\w-]+?(?:\([^{}]+\)|[^(){};])*?(?=\s*\{)/i,
			inside: {
				'punctuation': /[:()]/
			}
		},
		'selector': {
			pattern: /(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\([^{}]*\)|[^{};@])*?(?=\s*\{)/,
			inside: {
				'variable': /@+[\w-]+/
			}
		},
		'property': /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/i,
		'punctuation': /[{}();:,]/,
		'operator': /[+\-*\/]/
	});
	highlight.languages.insertBefore('less', 'punctuation', {
		'function': highlight.languages.less.
function
	});
	highlight.languages.insertBefore('less', 'property', {
		'variable': [{
			pattern: /@[\w-]+\s*:/,
			inside: {
				"punctuation": /:/
			}
		}, / @@ ? [\w - ] + /],
		'mixin-usage': {
			pattern: / ([{;]\s * )[.#]( ? !\d)[\w - ] + . * ?( ? =[(;]) /,
			lookbehind: true,
			alias: 'function'
		}
	});
}, true);
//# sourceMappingURL=less.js.map