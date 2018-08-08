/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 07 Aug 2018 07:23:21 GMT
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