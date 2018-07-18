/*!
 * tanguage script compiled code
 *
 * Datetime: Wed, 18 Jul 2018 06:56:44 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/dom/virtual/Component'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var dom = pandora.ns('dom', {});
    var virtual = function (options) {
        if (options === void 0) { options = {};}
        return new virtual.Component(options);
    }
    var createVElement = pandora.dom.createVElement = function (tagName, props, children) {
        return new virtual.Element(tagName, props, children);
    }
    pandora('dom.virtual', virtual);
});
//# sourceMappingURL=virtual.js.map