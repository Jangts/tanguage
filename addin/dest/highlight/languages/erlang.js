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
	pandora.highlight.languages.erlang = {
		'comment': /%.+/,
		'string': /"(?:\\?.)*?"/,
		'quoted-function': {
			pattern: /'(?:\\.|[^'\\])+'(?=\()/,
			alias: 'function'
		},
		'quoted-atom': {
			pattern: /'(?:\\.|[^'\\])+'/,
			alias: 'atom'
		},
		'boolean': /\b(?:true|false)\b/,
		'keyword': /\b(?:fun|when|case|of|end|if|receive|after|try|catch)\b/,
		'number': [
			/\$\\?./,
			/\d+#[a-z0-9]+/i,
			/(?:\b|-)\d*\.?\d+([Ee][+-]?\d+)?\b/
		],
		'function': /\b[a-z][\w@]*(?=\()/,
		'variable': {
			pattern: /(^|[^@])(?:\b|\?)[A-Z_][\w@]*/,
			lookbehind: true
		},
		'operator': [
			/[=\/<>:]=|=[:\/]=|\+\+?|--?|[=*\/!]|\b(?:bnot|div|rem|band|bor|bxor|bsl|bsr|not|and|or|xor|orelse|andalso)\b/,
			{
				pattern: /(^|[^<])<(?!<)/,
				lookbehind: true
			},
			{
				pattern: /(^|[^>])>(?!>)/,
				lookbehind: true
			}
		],
		'atom': /\b[a-z][\w@]*/,
		'punctuation': /[()[\]{}:;,.#|]|<<|>>/
	};
}, true);
//# sourceMappingURL=erlang.js.map