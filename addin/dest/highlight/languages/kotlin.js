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
	var highlight = pandora.highlight;
	highlight.languages.kotlin = highlight.languages.extend('clike', {
		'keyword': {
			pattern: /(^|[^.])\b(?:abstract|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|else|enum|final|finally|for|fun|get|if|import|in|init|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|out|override|package|private|protected|public|reified|return|sealed|set|super|tailrec|this|throw|to|try|val|var|when|where|while)\b/,
			lookbehind: true
		},
		'function': [
			/\w+(?=\s*\()/,
			{
				pattern: /(\.)\w+(?=\s*\{)/,
				lookbehind: true
			}
		],
		'number': /\b(?:0[bx][\da-fA-F]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?[fFL]?)\b/,
		'operator': /\+[+=]?|-[-=>]?|==?=?|!(?:!|==?)?|[\/*%<>]=?|[?:]:?|\.\.|&&|\|\||\b(?:and|inv|or|shl|shr|ushr|xor)\b/
	});
	delete highlight.languages.kotlin["class-name"];
	highlight.languages.insertBefore('kotlin', 'string', {
		'raw-string': {
			pattern: /(["'])\1\1[\s\S]*?\1{3}/,
			alias: 'string'
		}
	});
	highlight.languages.insertBefore('kotlin', 'keyword', {
		'annotation': {
			pattern: /\B@(?:\w+:)?(?:[A-Z]\w*|\[[^\]]+\])/,
			alias: 'builtin'
		}
	});
	highlight.languages.insertBefore('kotlin', 'function', {
		'label': {
			pattern: /\w+@|@\w+/,
			alias: 'symbol'
		}
	});
	var interpolation = [{
		pattern: /\$\{[^}]+\}/,
		inside: {
			delimiter: {
				pattern: /^\$\{|\}$/,
				alias: 'variable'
			},
			rest: _.copy(highlight.languages.kotlin)
		}
	}, {
		pattern: /\$\w+/,
		alias: 'variable'
	}];
	highlight.languages.kotlin['string'].inside = highlight.languages.kotlin['raw-string'].inside = {
		interpolation: interpolation
	};
}, true);
//# sourceMappingURL=kotlin.js.map