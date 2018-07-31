/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 31 Jul 2018 16:35:31 GMT
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
//# sourceMappingURL=Table.js.map