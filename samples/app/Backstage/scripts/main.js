/*!
 * tanguage script compiled code
 *
 * Datetime: Wed, 04 Jul 2018 12:41:28 GMT
 */;
// tang.config({});
tang.init().block([
    /* @posi0 */'$_/async/',
    /* @posi1 */'$_/app/Backstage/'
], function (pandora, root, imports, undefined) {
    /* @posi2 */var async = imports['$_/async/'];
    /* @posi3 */var Backstage = imports['$_/app/backstage/'];
    /* @posi4 */var OPTIONS_SRC = 'options.json';
    /* @posi5 */root.console.log(imports, /* @posi7 */Backstage);
    /* @posi8 */root.console.log(1);
    /* @posi9 */function main () {
        /* @posi10 */async.json(
            /* @posi12 */OPTIONS_SRC,
            /* @posi14 */function (/* @posi15 */options) {
                /* @posi16 */new Backstage(/* @posi18 */options);
            });
        /* @posi19 */return 0;
    }
    /* @posi20 */main();
}, true);
//# sourceMappingURL=main.js.map