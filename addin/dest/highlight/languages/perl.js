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
	pandora.highlight.languages.perl = {
		'comment': [{
			pattern: /(^\s*)=\w+[\s\S]*?=cut.*/m,
			lookbehind: true
		}, {
			pattern: /(^|[^\\$])#.*/,
			lookbehind: true
		}],
		'string': [
			/\b(?:q|qq|qx|qw)\s*([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1/,
			/\b(?:q|qq|qx|qw)\s+([a-zA-Z0-9])(?:[^\\]|\\[\s\S])*?\1/,
			/\b(?:q|qq|qx|qw)\s*\((?:[^()\\]|\\[\s\S])*\)/,
			/\b(?:q|qq|qx|qw)\s*\{(?:[^{}\\]|\\[\s\S])*\}/,
			/\b(?:q|qq|qx|qw)\s*\[(?:[^[\]\\]|\\[\s\S])*\]/,
			/\b(?:q|qq|qx|qw)\s*<(?:[^<>\\]|\\[\s\S])*>/,
			/("|`)(?:[^\\]|\\[\s\S])*?\1/,
			/'(?:[^'\\\r\n]|\\.)*'/
		],
		'regex': [
			/\b(?:m|qr)\s*([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1[msixpodualngc]*/,
			/\b(?:m|qr)\s+([a-zA-Z0-9])(?:[^\\]|\\.)*?\1[msixpodualngc]*/,
			/\b(?:m|qr)\s*\((?:[^()\\]|\\[\s\S])*\)[msixpodualngc]*/,
			/\b(?:m|qr)\s*\{(?:[^{}\\]|\\[\s\S])*\}[msixpodualngc]*/,
			/\b(?:m|qr)\s*\[(?:[^[\]\\]|\\[\s\S])*\][msixpodualngc]*/,
			/\b(?:m|qr)\s*<(?:[^<>\\]|\\[\s\S])*>[msixpodualngc]*/,
			{
				pattern: /(^|[^-]\b)(?:s|tr|y)\s*([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\2(?:[^\\]|\\[\s\S])*?\2[msixpodualngcer]*/,
				lookbehind: true
			},
			{
				pattern: /(^|[^-]\b)(?:s|tr|y)\s+([a-zA-Z0-9])(?:[^\\]|\\[\s\S])*?\2(?:[^\\]|\\[\s\S])*?\2[msixpodualngcer]*/,
				lookbehind: true
			},
			{
				pattern: /(^|[^-]\b)(?:s|tr|y)\s*\((?:[^()\\]|\\[\s\S])*\)\s*\((?:[^()\\]|\\[\s\S])*\)[msixpodualngcer]*/,
				lookbehind: true
			},
			{
				pattern: /(^|[^-]\b)(?:s|tr|y)\s*\{(?:[^{}\\]|\\[\s\S])*\}\s*\{(?:[^{}\\]|\\[\s\S])*\}[msixpodualngcer]*/,
				lookbehind: true
			},
			{
				pattern: /(^|[^-]\b)(?:s|tr|y)\s*\[(?:[^[\]\\]|\\[\s\S])*\]\s*\[(?:[^[\]\\]|\\[\s\S])*\][msixpodualngcer]*/,
				lookbehind: true
			},
			{
				pattern: /(^|[^-]\b)(?:s|tr|y)\s*<(?:[^<>\\]|\\[\s\S])*>\s*<(?:[^<>\\]|\\[\s\S])*>[msixpodualngcer]*/,
				lookbehind: true
			},
			/\/(?:[^\/\\\r\n]|\\.)*\/[msixpodualngc]*(?=\s*(?:$|[\r\n,.;})&|\-+*~<>!?^]|(lt|gt|le|ge|eq|ne|cmp|not|and|or|xor|x)\b))/
		],
		'variable': [
			/[&*$@%]\{\^[A-Z]+\}/,
			/[&*$@%]\^[A-Z_]/,
			/[&*$@%]#?(?=\{)/,
			/[&*$@%]#?((::)*'?(?!\d)[\w$]+)+(::)*/i,
			/[&*$@%]\d+/,
			/(?!%=)[$@%][!"#$ % &'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/
		],
		'filehandle ': {
			pattern: /<(?![<=])\S*>|\b_\b/,
			alias: 'symbol '
		},
		'vstring ': {
			pattern: /v\d+(\.\d+)*|\d+(\.\d+){2,}/,
			alias: 'string '
		},
		'function ': {
			pattern: /sub [a-z0-9_]+/i,
			inside: {
				keyword: /sub/
			}
		},
		'keyword ': /\b(any|break|continue|default|delete|die|do|else|elsif|eval|for|foreach|given|goto|if|last|local|my|next|our|package|print|redo|require|say|state|sub|switch|undef|unless|until|use|when|while)\b/,
		'number ': /\b-?(0x[\dA-Fa-f](_?[\dA-Fa-f])*|0b[01](_?[01])*|(\d(_?\d)*)?\.?\d(_?\d)*([Ee][+-]?\d+)?)\b/,
		'operator ': /-[rwxoRWXOezsfdlpSbctugkTBMAC]\b|\+[+=]?|-[-=>]?|\*\*?=?|\/\/?=?|=[=~>]?|~[~=]?|\|\|?=?|&&?=?|<(?:=>?|<=?)?|>>?=?|![~=]?|[%^]=?|\.(?:=|\.\.?)?|[\\?]|\bx(?:=|\b)|\b(lt|gt|le|ge|eq|ne|cmp|not|and|or|xor)\b/,
		'punctuation ': /[{}[\];(),:]/
	};
});
//# sourceMappingURL=perl.js.map