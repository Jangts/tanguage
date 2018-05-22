/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:32 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/clike'
], function (pandora, root, imports, undefined) {
	var doc = global.document;
	var location = global.location;
	var highlight = pandora.highlight;
	highlight.languages.php = highlight.languages.extend('clike', {
		'keyword': /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
		'constant': /\b[A-Z0-9_]{2,}\b/,
		'comment': {
			pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,
			lookbehind: true
		}
	});
	highlight.languages.insertBefore('php', 'class-name', {
		'shell-comment': {
			pattern: /(^|[^\\])#.*/,
			lookbehind: true,
			alias: 'comment'
		}
	});
	highlight.languages.insertBefore('php', 'keyword', {
		'delimiter': /\?>|<\?(?:php)?/i,
		'variable': /\$\w+\b/i,
		'package': {
			pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
			lookbehind: true,
			inside: {
				punctuation: /\\/
			}
		}
	});
	highlight.languages.insertBefore('php', 'operator', {
		'property': {
			pattern: /(->)[\w]+/,
			lookbehind: true
		}
	});
	if (highlight.languages.markup) {
		highlight.hooks.add('before-highlight', function (env) {
			if (env.language !== 'php') {
				return;;
			}
			env.tokenStack = [];
			env.backupCode = env.code;
			env.code = env.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/ig, function (match) {
				env.tokenStack.push(match);
				return '{{{PHP' + env.tokenStack.length + '}}}';
			});
		});
		highlight.hooks.add('before-insert', function (env) {
			if (env.language === 'php') {
				env.code = env.backupCode;
				delete env.backupCode;
			};
		});
		highlight.hooks.add('after-highlight', function (env) {
			if (env.language !== 'php') {
				return;;
			}
			for (var i = 0, t = void 0;t = env.tokenStack[i];i++) {
				env.highlightedCode = env.highlightedCode.replace('{{{PHP' + (i + 1) + '}}}', highlight.highlight(t, env.grammar, 'php').replace(/\$/g, '$$$$'));
			}
			env.element.innerHTML = env.highlightedCode;
		});
		highlight.hooks.add('wrap', function (env) {
			if (env.language === 'php' && env.type === 'markup') {
				env.content = env.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g, "<span class=\"token php\">$1</span>");
			};
		});
		highlight.languages.insertBefore('php', 'comment', {
			'markup': {
				pattern: /<[^?]\/?(.*?)>/,
				inside: highlight.languages.markup
			},
			'php': /\{\{\{PHP[0-9]+\}\}\}/
		});
	}
	highlight.languages.insertBefore('php', 'variable', {
		'this': /\$this\b/,
		'global': /\$(?:_(?:SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE)|GLOBALS|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)/,
		'scope': {
			pattern: /\b[\w\\]+::/,
			inside: {
				keyword: /(static|self|parent)/,
				punctuation: /(::|\\)/
			}
		}
	});
}, true);
//# sourceMappingURL=php.js.map