/*!
 * tanguage script compiled code
 *
 * Datetime: Mon, 02 Jul 2018 05:51:31 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/util/bool',
	'~Component'
], function (pandora, root, imports, undefined) {
	var app = pandora.ns('app', {});
	var _ = pandora;
	var is = _.util.bool.is;
	pandora.declareClass('app.Application', {
		components: {},
		_init: function (options) {
			var _arguments = arguments;
			if (options === void 0) { options = {};}
			if (options.components) {
				pandora.each(options.components, function (name, item) {
					if (is(item, app.Component)) {
						this.components[name] = item;
					}
					else {
						this.components[name] = new app.Component(item.el, item.tpl);
					};
				}, this);
			}
			else if (options.el) {
				this.components = {
					main: new app.Component(options.el, options.tpl)
				};
			}
			else {
				_.error();
			};
		}
	});
	
}, true);
//# sourceMappingURL=Application.js.map