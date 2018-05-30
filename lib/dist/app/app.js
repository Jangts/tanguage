/*!
 * tanguage script compiled code
 *
 * Datetime: Wed, 30 May 2018 10:24:51 GMT
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