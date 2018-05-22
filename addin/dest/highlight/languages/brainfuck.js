/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:18:02 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../'
], function (pandora, root, imports, undefined) {
	_.highlight.languages.brainfuck = {
		'pointer': {
			pattern: /<|>/,
			alias: 'keyword'
		},
		'increment': {
			pattern: /\+/,
			alias: 'inserted'
		},
		'decrement': {
			pattern: /-/,
			alias: 'deleted'
		},
		'branching': {
			pattern: /\[|\]/,
			alias: 'important'
		},
		'operator': /[.,]/,
		'comment': /\S+/
	};
}, true);
//# sourceMappingURL=brainfuck.js.map