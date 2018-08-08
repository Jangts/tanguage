/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 07 Aug 2018 05:58:54 GMT
 */
;
// tang.config({});
tang.init().block([
    '$_/dom/',
    '$_/app/SPA/'
], function (pandora, root, imports, undefined) {
    var SPA = imports['$_/app/spa/'];
    var myapp = new SPA;
    root.console.log(myapp);
}, true);
//# sourceMappingURL=main.js.map