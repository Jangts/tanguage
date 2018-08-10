/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 10 Aug 2018 04:01:25 GMT
 */
;
// tang.config({});
tang.init().block([
    '$_/see/Scrollbar/',
    '$_/see/Tabs/SlideTabs',
    '$_/see/ListView',
    '$_/see/NavMenu'
], function (pandora, root, imports, undefined) {
    var see = pandora.ns('see', {});
    var _ = pandora;
    var $ = _.dom.$;
    pandora.ns('see.Scrollbar', {auto: function () {
        $('.tang-see.scrollbar[data-ic-auto]').each(function () {
            if (($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'scrollbar')) {
                $(this).data('icRendered', 'scrollbar');
                new pandora.see.Scrollbar(this, {
                    theme: $(this).data('scbarTheme') || 'default-light'
                });
            };
        });
    }});
    pandora.see.NavMenu.auto();
    pandora.see.Scrollbar.auto();
    pandora.see.Tabs.auto();
    pandora.see.Tabs.SlideTabs.auto();
    pandora.see.ListView.auto();
}, true);
//# sourceMappingURL=autolayout.js.map