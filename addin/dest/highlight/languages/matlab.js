/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:28:51 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	pandora.highlight.languages.matlab = {
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
});
//# sourceMappingURL=matlab.js.map