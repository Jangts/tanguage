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
	pandora.highlight.languages.lua = {
		'comment': /^#!.+|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,
		'string': /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[\s\S]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
		'number': /\b0x[a-f\d]+\.?[a-f\d]*(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|\.?\d*(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
		'keyword': /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
		'function': /(?!\d)\w+(?=\s*(?:[({]))/,
		'operator': [
			/[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/,
			{
				pattern: /(^|[^.])\.\.(?!\.)/,
				lookbehind: true
			}
		],
		'punctuation': /[\[\](){},;]|\.+|:+/
	};
}, true);
//# sourceMappingURL=lua.js.map