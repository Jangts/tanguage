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
	pandora.highlight.languages.julia = {
		'comment': {
			pattern: /(^|[^\\])#.*/,
			lookbehind: true
		},
		'string': /"""[\s\S]+?"""|'''[\s\S]+?'''|("|')(\\?.)*?\1/,
		'keyword': /\b(abstract|baremodule|begin|bitstype|break|catch|ccall|const|continue|do|else|elseif|end|export|finally|for|function|global|if|immutable|import|importall|let|local|macro|module|print|println|quote|return|try|type|typealias|using|while)\b/,
		'boolean': /\b(true|false)\b/,
		'number': /\b-?(0[box])?(?:[\da-f]+\.?\d*|\.\d+)(?:[efp][+-]?\d+)?j?\b/i,
		'operator': /\+=?|-=?|\*=?|\/[\/=]?|\\=?|\^=?|%=?|÷=?|!=?=?|&=?|\|[=>]?|\$=?|<(?:<=?|[=:])?|>(?:=|>>?=?)?|==?=?|[~≠≤≥]/,
		'punctuation': /[{}[\];(),.:]/
	};
});
//# sourceMappingURL=julia.js.map