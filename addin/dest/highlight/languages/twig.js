/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:28:52 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/markup'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	pandora.highlight.languages.twig = {
		'comment': /\{#[\s\S]*?#\}/,
		'tag': {
			pattern: /\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}/,
			inside: {
				'ld': {
					pattern: /^(?:\{\{\-?|\{%\-?\s*\w+)/,
					inside: {
						'punctuation': /^(?:\{\{|\{%)\-?/,
						'keyword': /\w+/
					}
				},
				'rd': {
					pattern: /\-?(?:%\}|\}\})$/,
					inside: {
						'punctuation': /.*/
					}
				},
				'string': {
					pattern: /("|')(?:\\?.)*?\1/,
					inside: {
						'punctuation': /^['"]|['"]$/
					}
				},
				'keyword': /\b(?:even|if|odd)\b/,
				'boolean': /\b(?:true|false|null)\b/,
				'number': /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+([Ee][-+]?\d+)?)\b/,
				'operator': [{
					pattern: /(\s)(?:and|b\-and|b\-xor|b\-or|ends with|in|is|matches|not|or|same as|starts with)(?=\s)/,
					lookbehind: true
				}, /[=<>]=?|!=|\*\*?|\/\/?|\?:?|[-+~%|]/],
				'property': /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
				'punctuation': /[()\[\]{}:.,]/
			}
		},
		'other': {
			pattern: /\S(?:[\s\S]*\S)?/,
			inside: highlight.languages.markup
		}
	};
});
//# sourceMappingURL=twig.js.map