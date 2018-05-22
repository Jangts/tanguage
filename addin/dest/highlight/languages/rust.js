/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:28:52 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	pandora.highlight.languages.rust = {
		'comment': [{
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true
		}, {
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}],
		'string': [
			/b?r(#*)"(?:\\?.)*?"\1/,
			/b?("|')(?:\\?.)*?\1/
		],
		'keyword': /\b(?:abstract|alignof|as|be|box|break|const|continue|crate|do|else|enum|extern|false|final|fn|for|if|impl|in|let|loop|match|mod|move|mut|offsetof|once|override|priv|pub|pure|ref|return|sizeof|static|self|struct|super|true|trait|type|typeof|unsafe|unsized|use|virtual|where|while|yield)\b/,
		'attribute': {
			pattern: /#!?\[.+?\]/,
			alias: 'attr-name'
		},
		'function': [
			/[a-z0-9_]+(?=\s*\()/i,
			/[a-z0-9_]+!(?=\s*\(|\[)/i
		],
		'macro-rules': {
			pattern: /[a-z0-9_]+!/i,
			alias: 'function'
		},
		'number': /\b-?(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(\d(_?\d)*)?\.?\d(_?\d)*([Ee][+-]?\d+)?)(?:_?(?:[iu](?:8|16|32|64)?|f32|f64))?\b/,
		'closure-params': {
			pattern: /\|[^|]*\|(?=\s*[{-])/,
			inside: {
				'punctuation': /[\|:,]/,
				'operator': /[&*]/
			}
		},
		'punctuation': /[{}[\];(),:]|\.+|->/,
		'operator': /[-+*\/%!^=]=?|@|&[&=]?|\|[|=]?|<<?=?|>>?=?/
	};
});
//# sourceMappingURL=rust.js.map