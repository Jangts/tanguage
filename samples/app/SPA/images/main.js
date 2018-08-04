/*!
 * tanguage script compiled code
 *
 * Datetime: Sat, 04 Aug 2018 11:27:09 GMT
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