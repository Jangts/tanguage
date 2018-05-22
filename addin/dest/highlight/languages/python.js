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
	pandora.highlight.languages.python = {
		'triple-quoted-string': {
			pattern: /"""[\s\S]+?"""|'''[\s\S]+?'''/,
			alias: 'string'
		},
		'comment': {
			pattern: /(^|[^\\])#.*/,
			lookbehind: true
		},
		'string': /("|')(?:\\?.)*?\1/,
		'function': {
			pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g,
			lookbehind: true
		},
		'class-name': {
			pattern: /(\bclass\s+)[a-z0-9_]+/i,
			lookbehind: true
		},
		'keyword': /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/,
		'boolean': /\b(?:True|False)\b/,
		'number': /\b-?(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
		'operator': /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,
		'punctuation': /[{}[\];(),.:]/
	};
});
//# sourceMappingURL=python.js.map