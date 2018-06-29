/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 29 Jun 2018 07:13:49 GMT
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