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
	pandora.highlight.languages.scheme = {
		'comment': /;.*/,
		'string': /"(?:[^"\\\r\n]|\\.)*?"|'[^('\s]*/,
		'keyword': {
			pattern: /(\()(?:define(?:-syntax|-library|-values)?|(?:case-)?lambda|let(?:\*|rec)?(?:-values)?|else|if|cond|begin|delay(?:-force)?|parameterize|guard|set!|(?:quasi-)?quote|syntax-rules)/,
			lookbehind: true
		},
		'builtin': {
			pattern: /(\()(?:(?:cons|car|cdr|list|call-with-current-continuation|call\/cc|append|abs|apply|eval)\b|null\?|pair\?|boolean\?|eof-object\?|char\?|procedure\?|number\?|port\?|string\?|vector\?|symbol\?|bytevector\?)/,
			lookbehind: true
		},
		'number': {
			pattern: /(\s|\))[-+]?[0-9]*\.?[0-9]+(?:\s*[-+]\s*[0-9]*\.?[0-9]+i)?\b/,
			lookbehind: true
		},
		'boolean': /#[tf]/,
		'operator': {
			pattern: /(\()(?:[-+*%\/]|[<>]=?|=>?)/,
			lookbehind: true
		},
		'function': {
			pattern: /(\()[^\s()]*(?=\s)/,
			lookbehind: true
		},
		'punctuation': /[()]/
	};
});
//# sourceMappingURL=scheme.js.map