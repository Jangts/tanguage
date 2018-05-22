/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:31 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/javascript'
], function (pandora, root, imports, undefined) {
	var highlight = pandora.highlight;
	var comment = /#(?!\{).+/;
	var interpolation = {
		pattern: /#\{[^}]+\}/,
		alias: 'variable'
	};
	highlight.languages.coffeescript = highlight.languages.extend('javascript', {
		'comment': comment,
		'string': [
			/ '(?:\\?[^\\])*?' /,
			{
				pattern: /"(?:\\?[^\\])*?"/,
				inside: {
					'interpolation': interpolation
				}
			}
		],
		'keyword': /\b(and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/,
		'class-member': {
			pattern: /@(?!\d)\w+/,
			alias: 'variable'
		}
	});
	highlight.languages.insertBefore('coffeescript', 'comment', {
		'multiline-comment': {
			pattern: /###[\s\S]+?###/,
			alias: 'comment'
		},
		'block-regex': {
			pattern: /\/{3}[\s\S]*?\/{3}/,
			alias: 'regex',
			inside: {
				'comment': comment,
				'interpolation': interpolation
			}
		}
	});
	highlight.languages.insertBefore('coffeescript', 'string', {
		'inline-javascript': {
			pattern: /`(?:\\?[\s\S])*?`/,
			inside: {
				'delimiter': {
					pattern: /^`|`$/,
					alias: 'punctuation'
				},
				rest: highlight.languages.javascript
			}
		},
		'multiline-string': [{
			pattern: /'''[\s\S]*?'''/,
			alias: 'string'
		}, {
			pattern: /"""[\s\S]*?"""/,
			alias: 'string',
			inside: {
				interpolation: interpolation
			}
		}]
	});
	highlight.languages.insertBefore('coffeescript', 'keyword', {
		'property': /(?!\d)\w+(?=\s*:(?!:))/
	});
}, true);
//# sourceMappingURL=coffeescript.js.map