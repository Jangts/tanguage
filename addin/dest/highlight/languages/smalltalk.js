/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:28:52 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	_.see.languages.smalltalk = {
		'comment': /"(?:""|[^"])+"/,
		'string': /'(?:''|[^'])+'/,
		'symbol': /#[\da-z]+|#(?:-|([+\/\\*~<>=@%|&?!])\1?)|#(?=\()/i,
		'block-arguments': {
			pattern: /(\[\s*):[^\[|]*?\|/,
			lookbehind: true,
			inside: {
				'variable': /:[\da-z]+/i,
				'punctuation': /\|/
			}
		},
		'temporary-variables': {
			pattern: /\|[^|]+\|/,
			inside: {
				'variable': /[\da-z]+/i,
				'punctuation': /\|/
			}
		},
		'keyword': /\b(?:nil|true|false|self|super|new)\b/,
		'character': {
			pattern: /\$./,
			alias: 'string'
		},
		'number': [
			/\d+r-?[\dA-Z]+(?:\.[\dA-Z]+)?(?:e-?\d+)?/,
			/(?:\B-|\b)\d+(?:\.\d+)?(?:e-?\d+)?/
		],
		'operator': /[<=]=?|:=|~[~=]|\/\/?|\\\\|>[>=]?|[!^+\-*&|,@]/,
		'punctuation': /[.;:?\[\](){}]/
	};
});
//# sourceMappingURL=smalltalk.js.map