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
}, true);
//# sourceMappingURL=diff.js.map