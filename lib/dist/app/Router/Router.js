/*!
 * tanguage script compiled code
 *
 * Datetime: Mon, 16 Jul 2018 15:11:09 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/app/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var app = pandora.ns('app', {});
    pandora.declareClass('app.Router', {
        _init: function (options) {
            if (options === void 0) { options = {};}
            this.prop = options.prop;
        }
    });
    
});
//# sourceMappingURL=Router.js.map