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
	pandora.highlight.languages.http = {
		'request-line': {
			pattern: /^(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b\shttps?:\/\/\S+\sHTTP\/[0-9.]+/m,
			inside: {
				property: /^(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b/,
				'attr-name': /:\w+/
			}
		},
		'response-status': {
			pattern: /^HTTP\/1.[01] [0-9]+.*/m,
			inside: {
				property: {
					pattern: /(^HTTP\/1.[01] )[0-9]+.*/i,
					lookbehind: true
				}
			}
		},
		'header-name': {
			pattern: /^[\w-]+:(?=.)/m,
			alias: 'keyword'
		}
	};
	var httpLanguages = {
		'application/json': highlight.languages.javascript,
		'application/xml': highlight.languages.markup,
		'text/xml': highlight.languages.markup,
		'text/html': highlight.languages.markup
	};
	for (var contentType in httpLanguages) {
		if (httpLanguages[contentType]) {
			var options = {};
			options[contentType] = {
				pattern: new RegExp('(content-type:\\s*' + contentType + '[\\w\\W]*?)(?:\\r?\\n|\\r){2}[\\w\\W]*', 'i'),
				lookbehind: true,
				inside: {
					rest: httpLanguages[contentType]
				}
			};
			highlight.languages.insertBefore('http', 'header-name', options);
		}
	}
}, true);
//# sourceMappingURL=http.js.map