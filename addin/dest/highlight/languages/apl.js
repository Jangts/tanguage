/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:28:50 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../'
], function (pandora, root, imports, undefined) {
	var module = this.module;
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
});
//# sourceMappingURL=apl.js.map