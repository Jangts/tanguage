/*!
 * tanguage script compiled code
 *
 * Datetime: Wed, 18 Jul 2018 09:00:29 GMT
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
    pandora.declareClass('app.SPA', Component, {
        layers: [],
        _init: function (elem) {
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
        }
    });
    module.exports = app.SPA;
});
//# sourceMappingURL=SPA.js.map