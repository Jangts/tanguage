/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 10 Aug 2018 04:01:24 GMT
 */
;
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