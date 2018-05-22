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
	pandora.highlight.languages.json = {
		'property': /".*?"(?=\s*:)/ig,
		'string': /"(?!:)(\\?[^"])*?"(?!:)/g,
		'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
		'punctuation': /[{}[\]);,]/g,
		'operator': /:/g,
		'boolean': /\b(true|false)\b/gi,
		'null': /\bnull\b/gi
	};
}, true);
//# sourceMappingURL=json.js.map