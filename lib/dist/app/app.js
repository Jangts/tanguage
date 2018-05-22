/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 08:41:42 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/app/Application'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var _ = pandora;
	var app = function (elem) {
		return new _.app.Application(elem);
	}
	pandora('app', app);
});
//# sourceMappingURL=app.js.map