/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:28:51 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/c'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	pandora.highlight.languages.cpp = pandora.highlight.languages.extend('c', {
		'keyword': /\b(alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
		'boolean': /\b(true|false)\b/,
		'operator': /[-+]{1,2}|!=?|<{1,2}=?|>{1,2}=?|\->|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|?\||\?|\*|\/|\b(and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/
	});
	pandora.highlight.languages.insertBefore('cpp', 'keyword', {
		'class-name': {
			pattern: /(class\s+)[a-z0-9_]+/i,
			lookbehind: true
		}
	});
});
//# sourceMappingURL=cpp.js.map