/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:18:02 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/clike'
], function (pandora, root, imports, undefined) {
	var highlight = pandora.highlight;
	highlight.languages.groovy = highlight.languages.extend('clike', {
		'keyword': /\b(as|def|in|abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|trait|transient|try|void|volatile|while)\b/,
		'string': /("""|''')[\W\w]*?\1|("|'|\/)(?:\\?.)*?\2|(\$\/)(\$\/\$|[\W\w])*?\/\$/,
		'number': /\b(?:0b[01_]+|0x[\da-f_]+(?:\.[\da-f_p\-]+)?|[\d_]+(?:\.[\d_]+)?(?:e[+-]?[\d]+)?)[glidf]?\b/i,
		'operator': {
			pattern: /(^|[^.])(~|==?~?|\?[.:]?|\*(?:[.=]|\*=?)?|\.[@&]|\.\.<|\.{1,2}(?!\.)|-[-=>]?|\+[+=]?|!=?|<(?:<=?|=>?)?|>(?:>>?=?|=)?|&[&=]?|\|[|=]?|\/=?|\^=?|%=?)/,
			lookbehind: true
		},
		'punctuation': /\.+|[{}[\];(),:$]/
	});
	highlight.languages.insertBefore('groovy', 'string', {
		'shebang': {
			pattern: /#!.+/,
			alias: 'comment'
		}
	});
	highlight.languages.insertBefore('groovy', 'punctuation', {
		'spock-block': /\b(setup|given|when|then|and|cleanup|expect|where):/
	});
	highlight.languages.insertBefore('groovy', 'function', {
		'annotation': {
			alias: 'punctuation',
			pattern: /(^|[^.])@\w+/,
			lookbehind: true
		}
	});
	highlight.hooks.add('wrap', function (env) {
		if (env.language === 'groovy' && env.type === 'string') {
			var delimiter = env.content[0];
			if (delimiter != "'") {
				var pattern = /([^\\])(\$(\{.*?\}|[\w\.]+))/;
				if (delimiter === '$') {
					pattern = /([^\$])(\$(\{.*?\}|[\w\.]+))/;
				}
				env.content = env.content.replace(/&amp;/g, '&').replace(/&lt;/g, '<');
				env.content = highlight.highlight(env.content, {
					'expression': {
						pattern: pattern,
						lookbehind: true,
						inside: highlight.languages.groovy
					}
				});
				env.classes.push(delimiter === '/' ? 'regex':'gstring');
			}
		};
	});
}, true);
//# sourceMappingURL=groovy.js.map