/*!
 * tanguage script compiled code
 *
 * Datetime: Wed, 11 Jul 2018 12:54:48 GMT
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