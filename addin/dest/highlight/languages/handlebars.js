/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:31 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/markup'
], function (pandora, root, imports, undefined) {
	var highlight = pandora.highlight;
	var handlebars_pattern = /\{\{\{[\w\W]+?\}\}\}|\{\{[\w\W]+?\}\}/g;
	highlight.languages.handlebars = highlight.languages.extend('markup', {
		'handlebars': {
			pattern: handlebars_pattern,
			inside: {
				'delimiter': {
					pattern: /^\{\{\{?|\}\}\}?$/i,
					alias: 'punctuation'
				},
				'string': /(["'])(\\?.)*?\1/,
				'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?)\b/,
				'boolean': /\b(true|false)\b/,
				'block': {
					pattern: /^(\s*~?\s*)[#\/]\S+?(?=\s*~?\s*$|\s)/i,
					lookbehind: true,
					alias: 'keyword'
				},
				'brackets': {
					pattern: /\[[^\]]+\]/,
					inside: {
						punctuation: /\[|\]/,
						variable: /[\w\W]+/
					}
				},
				'punctuation': /[!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]/,
				'variable': /[^!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~\s]+/
			}
		}
	});
	highlight.languages.insertBefore('handlebars', 'tag', {
		'handlebars-comment': {
			pattern: /\{\{![\w\W]*?\}\}/,
			alias: ['handlebars', 'comment']
		}
	});
	highlight.hooks.add('before-highlight', function (env) {
		if (env.language !== 'handlebars') {
			return;;
		}
		env.tokenStack = [];
		env.backupCode = env.code;
		env.code = env.code.replace(handlebars_pattern, function (match) {
			env.tokenStack.push(match);
			return '___HANDLEBARS' + env.tokenStack.length + '___';
		});
	});
	highlight.hooks.add('before-insert', function (env) {
		if (env.language === 'handlebars') {
			env.code = env.backupCode;
			delete env.backupCode;
		};
	});
	highlight.hooks.add('after-highlight', function (env) {
		if (env.language !== 'handlebars') {
			return;;
		}
		for (var i = 0, t = void 0;t = env.tokenStack[i];i++) {
			env.highlightedCode = env.highlightedCode.replace('___HANDLEBARS' + (i + 1) + '___', highlight.highlight(t, env.grammar, 'handlebars').replace(/\$/g, '$$$$'));
		}
		env.element.innerHTML = env.highlightedCode;
	});
}, true);
//# sourceMappingURL=handlebars.js.map