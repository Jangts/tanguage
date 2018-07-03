/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 03 Jul 2018 15:51:02 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/util/type',
	'$_/dom/Template'
], function (pandora, root, imports, undefined) {
	var app = pandora.ns('app', {});
	var _ = pandora;
	var errors = {
		NoElem: 'Sorry, component must have an Document Element(instance of DOM).'
	};
	pandora.declareClass('app.Component', {
		Element: undefined,
		template: undefined,
		_init: function (elem, template) {
			elem = _.util.type.isElement(elem) ? elem : doc.getElementById(elem);
			if (elem) {
				this.Element = elem;
			}
			else {
				_.error(errors.NoElem);
			};
		},
		html: function (content) {
			if (this.Element) {
				this.Element.innerHTML = content;
			}
			else {
				_.error(errors.NoElem);
			};
		}
	});
	
}, true);
//# sourceMappingURL=Component.js.map