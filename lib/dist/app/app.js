/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 03 Jul 2018 15:51:02 GMT
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