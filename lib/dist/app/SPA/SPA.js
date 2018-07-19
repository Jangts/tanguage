/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 19 Jul 2018 02:41:41 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/util/',
    '$_/dom/Elements',
    '$_/app/Component',
    '$_/app/Router/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var app = pandora.ns('app', {});
    var isStr = imports['$_/util/'] && imports['$_/util/']['isStr'];
    var isEl = imports['$_/util/'] && imports['$_/util/']['isEl'];
    var $ = imports['$_/dom/elements'];
    var Component = imports['$_/app/router/'];
    var _ = pandora;
    var doc = root.document;
    var VirtualPage = pandora.declareClass(Component, {
        Element: undefined,
        scrollTop: 0,
        _init: function () {},
        load: function () {},
        html: function () {},
        remove: function () {},
        delete: function () {}
    });
    var Layer = pandora.declareClass(Component, {
        Element: undefined,
        pages: {},
        _init: function () {},
        addPage: function () {},
        removePage: function () {}
    });
    pandora.declareClass('app.SPA', Component, {
        Element: undefined,
        layers: [],
        _init: function (elem) {
            this.layers = [];
            if (isEl(elem)) {
                this.Element = elem;
            }
            else if (isStr(elem)) {
                this.Element = $(elem).get(0);
            }
            else {
                this.Element = pandora.dom.create('div', doc, {
                    className: 'tanguage-spa'
                });
            };
        },
        addLayer: function () {
            this.layers.push(new Layer());
        }
    });
    module.exports = app.SPA;
});
//# sourceMappingURL=SPA.js.map