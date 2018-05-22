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
	var highlight = pandora.highlight;
	highlight.languages.diff = {
		'coord': [
			/^(?:\*{3}|-{3}|\+{3}).*$/m,
			/^@@.*@@$/m,
			/^\d+.*$/m
		],
		'deleted': /^[-<].+$/m,
		'inserted': /^[+>].+$/m,
		'diff': {
			'pattern': /^!(?!!).+$/m,
			'alias': 'important'
		}
	};
});
//# sourceMappingURL=diff.js.map