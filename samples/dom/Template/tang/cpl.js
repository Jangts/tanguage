/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 29 Jun 2018 07:24:18 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/dom/Template'
], function (pandora, root, imports, undefined) {
	var document = root.document;
	var view = document.getElementById('view');
	var template = new pandora.dom.Template(unescape('%3Ctable%20width%3D%22360%22%20border%3D%221%22%20cellspacing%3D%221%22%20cellpadding%3D%221%22%3E%0D%0A%20%20%20%20%3Ctr%3E%0D%0A%20%20%20%20%20%20%20%20%3Ctd%3E%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%25echo%28this.data.greeting%29%3B%25%3E%2C%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25echo%28this.data.name%29%3B%25%3E%0D%0A%20%20%20%20%20%20%20%20%3C/td%3E%0D%0A%20%20%20%20%20%20%20%20%3C%25var%20arr%20%3D%20%5B1%2C%202%2C%203%2C%204%2C%205%2C%206%2C%207%5D%3B%20for%28var%20i%20%3D%200%3B%20i%20%3C%20arr.length%3B%20i++%29%7B%25%3E%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%3Darr%5Bi%5D%25%3E%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/td%3E%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%25%7D%25%3E%0D%0A%20%20%20%20%3C/tr%3E%0D%0A%3C/table%3E'));
	view.innerHTML = template.complie({
		greeting: 'Hello',
		name: 'tanguage'
	}).echo();
	console.log(template);
}, true);
//# sourceMappingURL=cpl.js.map