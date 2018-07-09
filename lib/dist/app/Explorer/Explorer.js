/*!
 * tanguage script compiled code
 *
 * Datetime: Mon, 09 Jul 2018 21:03:10 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/app/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var app = pandora.ns('app', {});
    pandora.declareClass('app.Explorer', {
        _init: function (options) {
            if (options === void 0) { options = {};}
            this.prop = options.prop;
        }
    });
    
});
//# sourceMappingURL=Explorer.js.map