/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 19 Jul 2018 17:46:27 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/app/Router/'
], function (pandora, root, imports, undefined) {
    var Router = imports['$_/app/router/'];
    function callback (route) {
        root.console.log(this, route);
    }
    var router = new Router({
        '/about/': callback,
        '/about/*': callback,
        '/about/*/index.asp': callback,
        '/news/:newsid/': callback,
        '?news=:newsid': callback,
        '?news=:newsid&comments=:commentid': callback
    });
    root.console.log(router);
}, true);
//# sourceMappingURL=main.js.map