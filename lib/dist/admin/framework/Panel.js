/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 07:22:54 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/app/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var app = pandora.ns('app', {});
    pandora.declareClass('app.BackStage', {
        _init: function (options) {
            if (options === void 0) { options = {};}
            this.prop = options.prop;
        }
    });
    this.module.exports = app.BackStage;
});
//# sourceMappingURL=Panel.js.map