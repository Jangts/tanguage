/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:30 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../'
], function (pandora, root, imports, undefined) {
	pandora.highlight.languages.apl = {
		'comment': /(?:⍝|#[! ]).*$/m,
		'string': /'(?:[^'\r\n]|'')*'/,
		'number': /¯?(?:\d*\.?\d+(?:e[+¯]?\d+)?|¯|∞)(?:j¯?(?:\d*\.?\d+(?:e[\+¯]?\d+)?|¯|∞))?/i,
		'statement': /:[A-Z][a-z][A-Za-z]*\b/,
		'system-function': {
			pattern: /⎕[A-Z]+/i,
			alias: 'function'
		},
		'constant': /[⍬⌾#⎕⍞]/,
		'function': /[-+×÷⌈⌊∣|⍳?*⍟○!⌹<≤=>≥≠≡≢∊⍷∪∩~∨∧⍱⍲⍴,⍪⌽⊖⍉↑↓⊂⊃⌷⍋⍒⊤⊥⍕⍎⊣⊢⍁⍂≈⍯↗¤→]/,
		'monadic-operator': {
			pattern: /[\\\/⌿⍀¨⍨⌶&∥]/,
			alias: 'operator'
		},
		'dyadic-operator': {
			pattern: /[.⍣⍠⍤∘⌸]/,
			alias: 'operator'
		},
		'assignment': {
			pattern: /←/,
			alias: 'keyword'
		},
		'punctuation': /[\[;\]()◇⋄]/,
		'dfn': {
			pattern: /[{}⍺⍵⍶⍹∇⍫:]/,
			alias: 'builtin'
		}
	};
}, true);
//# sourceMappingURL=apl.js.map