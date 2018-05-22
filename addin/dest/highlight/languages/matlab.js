/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:18:02 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../'
], function (pandora, root, imports, undefined) {
	_.highlight.languages.matlab = {
		'string': /\B'(?:''|[^'\n])*'/,
		'comment': [
			/%\{[\s\S]*?\}%/,
			/%.+/
		],
		'number': /\b-?(?:\d*\.?\d+(?:[eE][+-]?\d+)?(?:[ij])?|[ij])\b/,
		'keyword': /\b(?:break|case|catch|continue|else|elseif|end|for|function|if|inf|NaN|otherwise|parfor|pause|pi|return|switch|try|while)\b/,
		'function': /(?!\d)\w+(?=\s*\()/,
		'operator': /\.?[*^\/\\']|[+\-:@]|[<>=~]=?|&&?|\|\|?/,
		'punctuation': /\.{3}|[.,;\[\](){}!]/
	};
}, true);
//# sourceMappingURL=matlab.js.map