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
});
//# sourceMappingURL=git.js.map