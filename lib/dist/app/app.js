/*!
 * tanguage script compiled code
 *
 * Datetime: Mon, 09 Jul 2018 21:03:10 GMT
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