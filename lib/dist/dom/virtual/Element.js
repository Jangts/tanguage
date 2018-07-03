/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 03 Jul 2018 15:51:08 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/util/bool',
	'$_/arr/diff',
	'$_/obj/',
	'$_/dom/',
	'$_/dom/VElement/patch',
	'$_/dom/VElement/diff'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var dom = pandora.ns('dom', {});
	var _ = pandora;
	var doc = root.document;
	var console = root.console;
	pandora.declareClass('dom.VElement', {
		_init: function (tagName, props, children) {
			var _arguments = arguments;
			if (_.util.bool.isArr(props)) {
				children = props;
				props = {};
			}
			this.tagName = tagName;
			this.props = props || {}
			this.children = children || [];
			this.key = props ? props.key : undefined;
			var count = 0;
			pandora.each(this.children, function (i, child) {
				if (child instanceof _.dom.VElement) {
					count += child.count;
				}
				else {
					children[i] = '' + child;
				}
				count++;
			}, this);
			this.count = count;
		},
		render: function () {
			var _arguments = arguments;
			var elem = doc.createElement(this.tagName);
			var props = this.props;
			for (var propName in props) {
				var propValue = props[propName];
				_.dom.set(elem, propName, propValue);
			}
			pandora.each(this.children, function (i, child) {
				var childEl = (child instanceof _.dom.VElement) ? child.render():
				doc.createTextNode(child);
				elem.appendChild(childEl);
			}, this);
			return elem;
		}
	});
	_.extend(_.dom, true, {
		createVElement: function (tagName, props, children) {
			return new _.dom.VElement(tagName, props, children);
		}
	});
	_.extend(_.dom.VElement, true, {
		patch: patch,
		diff: diff,
		create: function (tagName, props, children) {
			return new _.dom.VElement(tagName, props, children);
		}
	});
});
//# sourceMappingURL=Element.js.map