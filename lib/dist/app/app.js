/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 12 Jul 2018 00:52:47 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/app/Application'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var _ = pandora;
    var app = function (elem) {
        return new _.app.Application(elem);
    }
    pandora('app', app);
});
//# sourceMappingURL=app.js.map