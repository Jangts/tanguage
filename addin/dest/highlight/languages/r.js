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
	pandora.highlight.languages.r = {
		'comment': /#.*/,
		'string': /(['"])(?:\\?.)*?\1/,
		'percent-operator': {
			pattern: /%[^%\s]*%/,
			alias: 'operator'
		},
		'boolean': /\b(?:TRUE|FALSE)\b/,
		'ellipsis': /\.\.(?:\.|\d+)/,
		'number': [
			/\b(?:NaN|Inf)\b/,
			/\b(?:0x[\dA-Fa-f]+(?:\.\d*)?|\d*\.?\d+)(?:[EePp][+-]?\d+)?[iL]?\b/
		],
		'keyword': /\b(?:if|else|repeat|while|function|for|in|next|break|NULL|NA|NA_integer_|NA_real_|NA_complex_|NA_character_)\b/,
		'operator': /->?>?|<(?:=|<?-)?|[>=!]=?|::?|&&?|\|\|?|[+*\/^$@~]/,
		'punctuation': /[(){}\[\],;]/
	};
});
//# sourceMappingURL=r.js.map