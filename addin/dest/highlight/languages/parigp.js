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
	pandora.highlight.languages.parigp = {
		'comment': /\/\*[\s\S]*?\*\/|\\\\.*/,
		'string': /"(?:[^"\\]|\\.)*"/,
		'keyword': (function () {
			var keywords = [
				'breakpoint',
				'break',
				'dbg_down',
				'dbg_err',
				'dbg_up',
				'dbg_x',
				'forcomposite',
				'fordiv',
				'forell',
				'forpart',
				'forprime',
				'forstep',
				'forsubgroup',
				'forvec',
				'for',
				'iferr',
				'if',
				'local',
				'my',
				'next',
				'return',
				'until',
				'while'
			];
			keywords = keywords.map(function (keyword) {
				return keyword.split('').join(' *');
			}).join('|');
			return RegExp('\\b(?:' + keywords + ')\\b');
		}()),
		'function': /\w[\w ]*?(?= *\()/,
		'number': {
			pattern: /((?:\. *\. *)?)(?:\d(?: *\d)*(?: *(?!\. *\.)\.(?: *\d)*)?|\. *\d(?: *\d)*)(?: *e *[+-]? *\d(?: *\d)*)?/i,
			lookbehind: true
		},
		'operator': /\. *\.|[*\/!](?: *=)?|%(?: *=|(?: *#)?(?: *')*)?|\+(?: *[+=])?|-(?: *[-=>])?|<(?:(?: *<)?(?: *=)?| *>)?|>(?: *>)?(?: *=)?|=(?: *=){0,2}|\\(?: *\/)?(?: *=)?|&(?: *&)?|\| *\||['#~^]/,
		'punctuation': /[\[\]{}().,:;|]/
	};
});
//# sourceMappingURL=parigp.js.map