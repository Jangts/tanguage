/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:32 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../'
], function (pandora, root, imports, undefined) {
	pandora.highlight.languages.sas = {
		'datalines': {
			pattern: /^\s*(?:(?:data)?lines|cards);[\s\S]+?(?:\r?\n|\r);/im,
			alias: 'string',
			inside: {
				'keyword': {
					pattern: /^(\s*)(?:(?:data)?lines|cards)/i,
					lookbehind: true
				},
				'punctuation': /;/
			}
		},
		'comment': [{
			pattern: /(^\s*|;\s*)\*.*;/m,
			lookbehind: true
		}, /\/\*[\s\S]+?\*\//],
		'datetime': {
			pattern: /'[^']+'(?:dt?|t)\b/i,
			alias: 'number'
		},
		'string': /(["'])(?:\1\1|(?!\1)[\s\S])*\1/,
		'keyword': /\b(?:data|else|format|if|input|proc|run|then)\b/i,
		'number': /(?:\B-|\b)(?:[\da-f]+x|\d+(?:\.\d+)?(?:e[+-]?\d+)?)/i,
		'operator': /\*\*?|\|\|?|!!?|¦¦?|<[>=]?|>[<=]?|[-+\/=&]|[~¬^]=?|\b(?:eq|ne|gt|lt|ge|le|in|not)\b/i,
		'punctuation': /[$%@.(){}\[\];,\\]/
	};
}, true);
//# sourceMappingURL=sas.js.map