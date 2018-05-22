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
	pandora.highlight.languages.ini = {
		'comment': /^[ \t]*;.*$/m,
		'important': /\[.*?\]/,
		'constant': /^[ \t]*[^\s=]+?(?=[ \t]*=)/m,
		'attr-value': {
			pattern: /\=.*/,
			inside: {
				'punctuation': /^[=]/
			}
		}
	};
}, true);
//# sourceMappingURL=ini.js.map