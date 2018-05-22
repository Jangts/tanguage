/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:31 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/clike'
], function (pandora, root, imports, undefined) {
	var highlight = pandora.highlight;
	highlight.languages.haxe = highlight.languages.extend('clike', {
		'string': {
			pattern: /(["'])(?:(?!\1)[^\\]|\\[\s\S])*\1/,
			inside: {
				'interpolation': {
					pattern: /(^|[^\\])\$(?:\w+|\{[^}]+\})/,
					lookbehind: true,
					inside: {
						'interpolation': {
							pattern: /^\$\w*/,
							alias: 'variable'
						}
					}
				}
			}
		},
		'keyword': /\bthis\b|\b(?:abstract|as|break|case|cast|catch|class|continue|default|do|dynamic|else|enum|extends|extern|from|for|function|if|implements|import|in|inline|interface|macro|new|null|override|public|private|return|static|super|switch|throw|to|try|typedef|using|var|while)(?!\.)\b/,
		'operator': /\.{3}|\+\+?|-[->]?|[=!]=?|&&?|\|\|?|<[<=]?|>[>=]?|[*\/%~^]/
	});
	highlight.languages.insertBefore('haxe', 'class-name', {
		'regex': {
			pattern: /~\/(?:[^\/\\\r\n]|\\.)+\/[igmsu]*/
		}
	});
	highlight.languages.insertBefore('haxe', 'keyword', {
		'preprocessor': {
			pattern: /#\w+/,
			alias: 'builtin'
		},
		'metadata': {
			pattern: /@:?\w+/,
			alias: 'symbol'
		},
		'reification': {
			pattern: /\$(?:\w+|(?=\{))/,
			alias: 'variable'
		}
	});
	highlight.languages.haxe['string'].inside['interpolation'].inside.rest = _.copy(highlight.languages.haxe);
	delete highlight.languages.haxe['class-name'];
}, true);
//# sourceMappingURL=haxe.js.map