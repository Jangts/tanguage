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
	pandora.highlight.languages.git = {
		'comment': /^#.*/m,
		'deleted': /^[-–].*/m,
		'inserted': /^\+.*/m,
		'string': /("|')(\\?.)*?\1/m,
		'command': {
			pattern: /^.*\$ git .*$/m,
			inside: {
				'parameter': /\s(--|-)\w+/m
			}
		},
		'coord': /^@@.*@@$/m,
		'commit_sha1': /^commit \w{40}$/m
	};
}, true);
//# sourceMappingURL=git.js.map