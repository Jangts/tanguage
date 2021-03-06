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
	var highlight = pandora.highlight;
	highlight.languages.elixir = {
		'comment': {
			pattern: /(^|[^#])#(?![{#]).*/m,
			lookbehind: true
		},
		'regex': /~[rR](?:("""|'''|[\/|"'])(?:\\.|(?!\1)[^\\])+\1|\((?:\\\)|[^)])+\)|\[(?:\\\]|[^\]])+\]|\{(?:\\\}|[^}])+\}|<(?:\\>|[^>])+>)[uismxfr]*/,
		'string': [{
			pattern: /~[cCsSwW](?:("""|'''|[\/|"'])(?:\\.|(?!\1)[^\\])+\1|\((?:\\\)|[^)])+\)|\[(?:\\\]|[^\]])+\]|\{(?:\\\}|#\{[^}]+\}|[^}])+\}|<(?:\\>|[^>])+>)[csa]?/,
			inside:  {}
		}, {
			pattern: /("""|''')[\s\S]*?\1/,
			inside:  {}
		}, {
			pattern: /("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/,
			inside:  {}
		}],
		'atom': {
			pattern: /(^|[^:]):\w+/,
			lookbehind: true,
			alias: 'symbol'
		},
		'attr-name': /\w+:(?!:)/,
		'capture': {
			pattern: /(^|[^&])&(?:[^&\s\d()][^\s()]*|(?=\())/,
			lookbehind: true,
			alias: 'function'
		},
		'argument': {
			pattern: /(^|[^&])&\d+/,
			lookbehind: true,
			alias: 'variable'
		},
		'attribute': {
			pattern: /@[\S]+/,
			alias: 'variable'
		},
		'number': /\b(?:0[box][a-f\d_]+|\d[\d_]*)(?:\.[\d_]+)?(?:e[+-]?[\d_]+)?\b/i,
		'keyword': /\b(?:after|alias|and|case|catch|cond|def(?:callback|exception|impl|module|p|protocol|struct)?|do|else|end|fn|for|if|import|not|or|require|rescue|try|unless|use|when)\b/,
		'boolean': /\b(?:true|false|nil)\b/,
		'operator': [
			/\bin\b|&&?|\|[|>]?|\\\\|::|\.\.\.?|\+\+?|-[->]?|<[-=>]|>=|!==?|\B!|=(?:==?|[>~])?|[*\/^]/,
			{
				pattern: /([^<])<(?!<)/,
				lookbehind: true
			},
			{
				pattern: /([^>])>(?!>)/,
				lookbehind: true
			}
		],
		'punctuation': /<<|>>|[.,%\[\]{}()]/
	};
	highlight.languages.elixir.string.forEach(function (o) {
		o.inside = {
			'interpolation': {
				pattern: /#\{[^}]+\}/,
				inside: {
					'delimiter': {
						pattern: /^#\{|\}$/,
						alias: 'punctuation'
					},
					rest: _.copy(highlight.languages.elixir)
				}
			}
		};
	});
});
//# sourceMappingURL=elixir.js.map