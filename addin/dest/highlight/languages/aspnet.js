/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:30 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/markup'
], function (pandora, root, imports, undefined) {
	var highlight = pandora.highlight;
	highlight.languages.aspnet = highlight.languages.extend('markup', {
		'page-directive tag': {
			pattern: /<%\s*@.*%>/i,
			inside: {
				'page-directive tag': /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
				rest: highlight.languages.markup.tag.inside
			}
		},
		'directive tag': {
			pattern: /<%.*%>/i,
			inside: {
				'directive tag': /<%\s*?[$=%#:]{0,2}|%>/i,
				rest: highlight.languages.csharp
			}
		}
	});
	highlight.languages.aspnet.tag.pattern = /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i;
	highlight.languages.insertBefore('inside', 'punctuation', {
		'directive tag': highlight.languages.aspnet['directive tag']
	}, highlight.languages.aspnet.tag.inside["attr-value"]);
	highlight.languages.insertBefore('aspnet', 'comment', {
		'asp comment': /<%--[\w\W]*?--%>/
	});
	highlight.languages.insertBefore('aspnet', highlight.languages.javascript ? 'script': 'tag', {
		'asp script': {
			pattern: /(<script(?=.*runat=['"]?server['"]?)[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: highlight.languages.csharp || {}
		}
	});
}, true);
//# sourceMappingURL=aspnet.js.map