/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 12 Jul 2018 00:52:47 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/util/',
    '$_/dom/Template'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var app = pandora.ns('app', {});
    var _ = pandora;
    var errors = {
        NoElem: 'Sorry, component must have an Document Element(instance of DOM).'
    };
    pandora.declareClass('app.Component', {
        Element: undefined,
        template: undefined,
        _init: function (elem, template) {
            elem = _.util.isElement(elem) ? elem : doc.getElementById(elem);
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
    
});
//# sourceMappingURL=Component.js.map