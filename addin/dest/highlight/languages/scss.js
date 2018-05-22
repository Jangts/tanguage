/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:32 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/css'
], function (pandora, root, imports, undefined) {
	var highlight = pandora.highlight;
	highlight.languages.scss = highlight.languages.extend('css', {
		'comment': {
			pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,
			lookbehind: true
		},
		'atrule': {
			pattern: /@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,
			inside: {
				'rule': /@[\w-]+/
			}
		},
		'url': /(?:[-a-z]+-)*url(?=\()/i,
		'selector': {
			pattern: /(?=\S)[^@;\{\}\(\)]?([^@;\{\}\(\)]|&|#\{\$[-_\w]+\})+(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/m,
			inside: {
				'placeholder': /%[-_\w]+/
			}
		}
	});
	highlight.languages.insertBefore('scss', 'atrule', {
		'keyword': [/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i, {
			pattern: /( +)(?:from|through)(?= )/,
			lookbehind: true
		}]
	});
	highlight.languages.insertBefore('scss', 'property', {
		'variable': /\$[-_\w]+|#\{\$[-_\w]+\}/
	});
	highlight.languages.insertBefore('scss', 'function', {
		'placeholder': {
			pattern: /%[-_\w]+/,
			alias: 'selector'
		},
		'statement': /\B!(?:default|optional)\b/i,
		'boolean': /\b(?:true|false)\b/,
		'null': /\bnull\b/,
		'operator': {
			pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,
			lookbehind: true
		}
	});
	highlight.languages.scss['atrule'].inside.rest = _.copy(highlight.languages.scss);
	highlight.languages.scala = highlight.languages.extend('java', {
		'keyword': /<-|=>|\b(?:abstract|case|catch|class|def|do|else|extends|final|finally|for|forSome|if|implicit|import|lazy|match|new|null|object|override|package|private|protected|return|sealed|self|super|this|throw|trait|try|type|val|var|while|with|yield)\b/,
		'string': /"""[\W\w]*?"""|"(?:[^"\\\r\n]|\\.)*"|'(?:[^\\\r\n']|\\.[^\\']*)'/,
		'builtin': /\b(?:String|Int|Long|Short|Byte|Boolean|Double|Float|Char|Any|AnyRef|AnyVal|Unit|Nothing)\b/,
		'number': /\b(?:0x[\da-f]*\.?[\da-f]+|\d*\.?\d+e?\d*[dfl]?)\b/i,
		'symbol': /'[^\d\s\\]\w*/
	});
	delete highlight.languages.scala['class-name'];
	delete highlight.languages.scala['function'];
}, true);
//# sourceMappingURL=scss.js.map