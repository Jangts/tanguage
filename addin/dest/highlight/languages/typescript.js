/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:18:03 GMT
 */
;
// tang.config({});
tang.init().block([
	'~/../',
	'~/../languages/javascript'
], function (pandora, root, imports, undefined) {
	_.highlight.languages.typescript = _.highlight.languages.extend('javascript', {
		'keyword': /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield|module|declare|constructor|string|Function|any|number|boolean|Array|enum)\b/
	});
}, true);
//# sourceMappingURL=typescript.js.map