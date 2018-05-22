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
	pandora.highlight.languages.roboconf = {
		'comment': /#.*/,
		'keyword': {
			'pattern': /(^|\s)(?:(?:facet|instance of)(?=[ \t]+[\w-]+[ \t]*\{)|(?:external|import)\b)/,
			lookbehind: true
		},
		'component': {
			pattern: /[\w-]+(?=[ \t]*\{)/,
			alias: 'variable'
		},
		'property': /[\w.-]+(?=[ \t]*:)/,
		'value': {
			pattern: /(=[ \t]*)[^,;]+/,
			lookbehind: true,
			alias: 'attr-value'
		},
		'optional': {
			pattern: /\(optional\)/,
			alias: 'builtin'
		},
		'wildcard': {
			pattern: /(\.)\*/,
			lookbehind: true,
			alias: 'operator'
		},
		'punctuation': /[{},.;:=]/
	};
});
//# sourceMappingURL=roboconf.js.map