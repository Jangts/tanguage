/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:28:50 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/c'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	pandora.highlight.languages.bison = pandora.highlight.languages.extend('c',  {});
	pandora.highlight.languages.insertBefore('bison', 'comment', {
		'bison': {
			pattern: /^[\s\S]*?%%[\s\S]*?%%/,
			inside: {
				'c': {
					pattern: /%\{[\s\S]*?%\}|\{(?:\{[^}]*\}|[^{}])*\}/,
					inside: {
						'delimiter': {
							pattern: /^%?\{|%?\}$/,
							alias: 'punctuation'
						},
						'bison-variable': {
							pattern: /[$@](?:<[^\s>]+>)?[\w$]+/,
							alias: 'variable',
							inside: {
								'punctuation': /<|>/
							}
						},
						rest: highlight.languages.c
					}
				},
				'comment': highlight.languages.c.comment,
				'string': highlight.languages.c.string,
				'property': /\S+(?=:)/,
				'keyword': /%\w+/,
				'number': {
					pattern: /(^|[^@])\b(?:0x[\da-f]+|\d+)/i,
					lookbehind: true
				},
				'punctuation': /%[%?]|[|:;\[\]<>]/
			}
		}
	});
});
//# sourceMappingURL=bison.js.map