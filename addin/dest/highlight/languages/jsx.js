/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:18:02 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/javascript'
], function (pandora, root, imports, undefined) {;
	var highlight = pandora.highlight;
	var javascript = _.copy(highlight.languages.javascript);
	highlight.languages.jsx = highlight.languages.extend('markup', javascript);
	highlight.languages.jsx.tag.pattern = /<\/?[\w\.:-]+\s*(?:\s+[\w\.:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+|(\{[\w\W]*?\})))?\s*)*\/?>/i;
	highlight.languages.jsx.tag.inside['attr-value'].pattern = /\=[^\{](?:('|")[\w\W]*?(\1)|[^\s>]+)/i;
	var jsxExpression = _.copy(highlight.languages.jsx);
	delete jsxExpression.punctuation;
	jsxExpression = highlight.languages.insertBefore('jsx', 'operator', {
		'punctuation': /\=(?={)|[{}[\];(),.:]/
	}, {
		jsx: jsxExpression
	});
	highlight.languages.insertBefore('inside', 'attr-value', {
		'script': {
			pattern: /\=(\{(?:\{[^\}]*\}|[^}])+\})/i,
			inside: jsxExpression,
			'alias': 'language-javascript'
		}
	}, highlight.languages.jsx.tag);
}, true);
//# sourceMappingURL=jsx.js.map