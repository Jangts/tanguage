/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 09:53:40 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/util/',
    '$_/dom/Elements',
    '$_/dom/Template'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var app = pandora.ns('app', {});
    var isEl = imports['$_/util/'] && imports['$_/util/']['isEl'];
    var $ = imports['$_/dom/elements'];
    var Template = imports['$_/dom/template'];
    var _ = pandora;
    var errors = {
        NoElem: 'Sorry, component must have an Document Element(instance of DOM).'
    };
    pandora.declareClass('app.Component', {
        HTMLElement: undefined,
        template: undefined,
        _init: function (elem, template) {
            elem = _isEl(elem) ? elem : doc.getElementById(elem);
            if (elem) {
                this.HTMLElement = elem;
            }
            else {
                _.error(errors.NoElem);
            };
        },
        html: function (content) {
            if (this.HTMLElement) {
                this.HTMLElement.innerHTML = content;
            }
            else {
                _.error(errors.NoElem);
            };
        }
    });
    
});
//# sourceMappingURL=Component.js.map