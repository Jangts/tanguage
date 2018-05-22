/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:28:51 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../'
], function (pandora, root, imports, undefined) {
	var module = this.module;
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
});
//# sourceMappingURL=ini.js.map