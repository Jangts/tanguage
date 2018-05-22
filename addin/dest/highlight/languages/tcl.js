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
	pandora.highlight.languages.tcl = {
		'comment': {
			pattern: /(^|[^\\])#.*/,
			lookbehind: true
		},
		'string': /"(?:[^"\\\r\n]|\\(?:\r\n|[\s\S]))*"/,
		'variable': [{
			pattern: /(\$)(?:::)?(?:[a-zA-Z0-9]+::)*[a-zA-Z0-9_]+/,
			lookbehind: true
		}, {
			pattern: /(\$){[^}]+}/,
			lookbehind: true
		}, {
			pattern: /(^\s*set[ \t]+)(?:::)?(?:[a-zA-Z0-9]+::)*[a-zA-Z0-9_]+/m,
			lookbehind: true
		}],
		'function': {
			pattern: /(^\s*proc[ \t]+)[^\s]+/m,
			lookbehind: true
		},
		'builtin': [{
			pattern: /(^\s*)(?:proc|return|class|error|eval|exit|for|foreach|if|switch|while|break|continue)\b/m,
			lookbehind: true
		}, /\b(elseif|else)\b/],
		'scope': {
			pattern: /(^\s*)(global|upvar|variable)\b/m,
			lookbehind: true,
			alias: 'constant'
		},
		'keyword': {
			pattern: /(^\s*|\[)(after|append|apply|array|auto_(?:execok|import|load|mkindex|qualify|reset)|automkindex_old|bgerror|binary|catch|cd|chan|clock|close|concat|dde|dict|encoding|eof|exec|expr|fblocked|fconfigure|fcopy|file(?:event|name)?|flush|gets|glob|history|http|incr|info|interp|join|lappend|lassign|lindex|linsert|list|llength|load|lrange|lrepeat|lreplace|lreverse|lsearch|lset|lsort|math(?:func|op)|memory|msgcat|namespace|open|package|parray|pid|pkg_mkIndex|platform|puts|pwd|re_syntax|read|refchan|regexp|registry|regsub|rename|Safe_Base|scan|seek|set|socket|source|split|string|subst|Tcl|tcl(?:_endOfWord|_findLibrary|startOf(?:Next|Previous)Word|wordBreak(?:After|Before)|test|vars)|tell|time|tm|trace|unknown|unload|unset|update|uplevel|vwait)\b/m,
			lookbehind: true
		},
		'operator': /!=?|\*\*?|==|&&?|\|\|?|<[=<]?|>[=>]?|[-+~\/%?^]|\b(?:eq|ne|in|ni)\b/,
		'punctuation': /[{}()\[\]]/
	};
});
//# sourceMappingURL=tcl.js.map