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
	pandora.highlight.languages.keyman = {
		'comment': /\bc\s.*/i,
		'function': /\[\s*((CTRL|SHIFT|ALT|LCTRL|RCTRL|LALT|RALT|CAPS|NCAPS)\s+)*([TKU]_[a-z0-9_?]+|".+?"|'.+?')\s*\]/i,
		'string': /("|')((?!\1).)*\1/,
		'bold': [
			/&(baselayout|bitmap|capsononly|capsalwaysoff|shiftfreescaps|copyright|ethnologuecode|hotkey|includecodes|keyboardversion|kmw_embedcss|kmw_embedjs|kmw_helpfile|kmw_helptext|kmw_rtl|language|layer|layoutfile|message|mnemoniclayout|name|oldcharposmatching|platform|targets|version|visualkeyboard|windowslanguages)\b/i,
			/\b(bitmap|bitmaps|caps on only|caps always off|shift frees caps|copyright|hotkey|language|layout|message|name|version)\b/i
		],
		'keyword': /\b(any|baselayout|beep|call|context|deadkey|dk|if|index|layer|notany|nul|outs|platform|return|reset|save|set|store|use)\b/i,
		'atrule': /\b(ansi|begin|unicode|group|using keys|match|nomatch)\b/i,
		'number': /\b(U\+[\dA-F]+|d\d+|x[\da-f]+|\d+)\b/i,
		'operator': /[+>\\,()]/,
		'tag': /\$(keyman|kmfl|weaver|keymanweb|keymanonly):/i
	};
});
//# sourceMappingURL=keyman.js.map