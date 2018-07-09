/*!
 * tanguage script compiled code
 *
 * Datetime: Mon, 09 Jul 2018 21:03:11 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/util/',
    '$_/app/Component'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var data = pandora.ns('data', {});
    var _ = pandora;
    var is = _.util.is;
    pandora.declareClass('data.Panel', {
        components: {},
        _init: function (options) {
            var _arguments = arguments;
            if (options === void 0) { options = {};}
            if (options.components) {
                pandora.each(options.components, function (name, item) {
                    if (is(item, app.Component)) {
                        this.components[name] = item;
                    }
else {
                        this.components[name] = new app.Component(item.el, item.tpl);
                    };
                }, this);
            }
else if (options.el) {
                this.components = {
                    main: new app.Component(options.el, options.tpl)
                };
            }
else {
                _.error();
            };
        }
    });
    
});
//# sourceMappingURL=Panel.js.map