/*!
 * tanguage script compiled code
 *
 * Datetime: Wed, 18 Jul 2018 06:56:40 GMT
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
//# sourceMappingURL=Stage.js.map