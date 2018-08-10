/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 10 Aug 2018 04:01:25 GMT
 */
;
// tang.config({});
tang.init().block([
    '$_/util/',
    '$_/dom/',
    '$_/dom/Elements',
    '$_/app/Component',
    '$_/app/Router/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var app = pandora.ns('app', {});
    var isStr = imports['$_/util/'] && imports['$_/util/']['isStr'];
    var isEl = imports['$_/util/'] && imports['$_/util/']['isEl'];
    var dom = imports['$_/dom/'];
    var $ = imports['$_/dom/elements'];
    var Component = imports['$_/app/component'];
    var Router = imports['$_/app/router/'];
    var _ = pandora;
    var _$ = _.dom;
    var __ = _.util;
    var doc = root.document;
    var body = doc.body;
    var View = pandora.declareClass(Component, {
        container: undefined,
        scrollTop: 0,
        _init: function () {}
    });
    var AJAXView = pandora.declareClass(View, {
        _init: function () {},
        load: function () {},
        ajax: function () {}
    });
    var COMView = pandora.declareClass(View, {
        _init: function () {},
        load: function () {},
        html: function () {}
    });
    var FrameView = pandora.declareClass(View, {
        _init: function () {},
        load: function () {},
        html: function () {}
    });
    var NodeView = pandora.declareClass(View, {
        _init: function () {},
        load: function () {},
        html: function () {}
    });
    var Bar = pandora.declareClass(Component, {
        _init: function () {}
    });
    var Title = pandora.declareClass(Bar, {
        container: undefined
    });
    var Title = pandora.declareClass(Bar, {
        container: undefined
    });
    var Alert = pandora.declareClass(Component, {
        layer: undefined,
        _init: function () {}
    });
    var Picker = pandora.declareClass(Component, {
        layer: undefined,
        _init: function () {}
    });
    var TabNav = pandora.declareClass(Bar, {
        layer: undefined
    });
    var VirtualPage = pandora.declareClass(Component, {
        layer: undefined,
        titleComponent: undefined,
        viewComponent: undefined,
        buttonsComponent: undefined,
        _init: function (layer, pagename, elem, options) {
            layer.app.router.reg(pagename, pandora.extend({
                layer: layer,
                pagename: pagename
            }, true, ), function (foo, bar) {
                root.console.log(foo, bar);
            });
        },
        load: function () {},
        hide: function () {},
        show: function (direcion) {},
        remove: function () {},
        delete: function () {}
    });
    defaultPageOptions = {
        tagName: 'div',
        html: 'hello, this is my first SPA!'
    };
    function createPage (layer, pageName, pageOptions) {
        var elem = void 0;
        if (layer.$pages.has(pageOptions.elem)) {
            elem = pageOptions.elem;
        }
        else {
            elem = dom.create(pageOptions.tagName  || 'div', layer.$pages[0], {
                className: 'spa-vpage',
                dataLayerName: pageName,
                html: pageOptions.html  || 'hello, this is my first SPA!'
            });
        }
        var page = new VirtualPage(layer, pageName, elem, pageOptions);
        layer.pages[pageName] = page;
        return page;
    }
    var Widget = pandora.declareClass(Component, {
        layer: undefined,
        _init: function () {}
    });
    var Layer = pandora.declareClass(Component, {
        appInstance: undefined,
        pages: {},
        _init: function (app, elem, options) {
            var _arguments = arguments;
            this.app = app;
            this.HTMLElement = elem;
            this.name = _$.getAttr(elem, 'data-layer-name');
            this.$pages = $('.spa-pages', elem);
            this.$tools = $('.spa-tools', elem);
            this.$loading = $('.spa-loading', elem);
            root.console.log(options);
            pandora.each(options.pages, function (pageName, pageOptions) {
                createPage(this, pageName, pageOptions);
            }, this);
        },
        toTop: function () {},
        toBottom: function () {},
        addPage: function () {},
        removePage: function () {}
    });
    function scanLayer (app) {
        var _arguments = arguments;
        var layers = {};
        var elem = app.HTMLElement;
        pandora.each(elem.childNodes, function (index, node) {
            if (dom.hasAttr(node, 'data-layer-name')) {
                var layerName = dom.getAttr(node, 'data-layer-name');
                if (layers[layerName]) {
                    dom.remove(node, elem);
                    return;;
                }
                layers[layerName] = new Layer({
                    uid: layerName,
                    HTMLElement: node
                });
                if (index === 0) {
                    app.defaultLayer = layers[layerName];
                }
            }
            else {
                dom.remove(node, elem);
            };
        }, this);
    }
    var defaultLayerOptions = {
        tagName: 'div',
        className: '',
        pages: {
            '/index/': defaultPageOptions
        }
    };
    var emptyLayerOptions = {
        tagName: 'div',
        className: '',
        pages: {}
    };
    function createLayer (app, layerName, layerOptions) {
        var elem = void 0;
        if (__.in(layerOptions. elem, app.HTMLElement.childNodes)) {
            elem = layerOptions.elem;
        }
        else {
            elem = dom.create(layerOptions.tagName  || 'div', app.HTMLElement, {
                className: 'spa-layer',
                dataLayerName: layerName,
                html: '<div class="spa-pages"></div><div class="spa-loading"></div><div class="spa-tools"></div>'
            });
        }
        var layer = new Layer(app, elem, layerOptions);
        app.layers[layerName] = layer;
        return layer;
    }
    var PopupLayer = pandora.declareClass(Component, {
        _init: function () {}
    });
    var popupLayerOptions = {
        tagName: 'div',
        className: 'popup-layer'
    };
    function createPopupLayer () {}
    var WidgetsLayer = pandora.declareClass(Component, {
        widgets: {},
        _init: function () {}
    });
    var widgetsLayerOptions = {
        tagName: 'div',
        className: 'widgets-layer'
    };
    function createWidgetsLayer () {}
    pandora.declareClass('app.SPA', Component, {
        uid: undefined,
        layers: [],
        defaultLayer: undefined,
        popupLayer: undefined,
        widgetsLayer: undefined,
        activedLayer: undefined,
        router: undefined,
        _init: function (options) {
            if (options === void 0) { options = {};}
            this.uid = 'SPA-' + _.Identifier().toString();
            this.layers = [];
            this.router = new Router;
            if (isEl(options.elem)) {
                this.HTMLElement = options.elem;
                scanLayer(this, options);
            }
            else if (isStr(options.elem) && $(options.elem).length) {
                this.HTMLElement = $(options.elem).get(0);
                scanLayer(this, options);
            }
            else {
                this.HTMLElement = dom.create('div', body, {
                    id: this.uid,
                    className: 'tanguage-spa'
                });
                this.defaultLayer = createLayer(this, 'default', options.layers  && options.layers['default'] || defaultLayerOptions);
            }
            if (!this.defaultLayer) {
                this.defaultLayer = createLayer(this, 'default', options.layers  && options.layers['default'] || defaultLayerOptions);
            }
            if (options.popupLayer) {
                this.popupLayer = createPopupLayer(this, options.popupLayer  || popupLayerOptions);
            }
            if (options.widgetsLayer) {
                this.widgetsLayer = createWidgetLayer(this, options.widgetsLayer  || widgetsLayerOptions);
            };
        },
        refleshTitle: function (newTitle) {
            $('title').html(newTitle);
        },
        addLayer: function () {
            this.layers.push(new Layer());
        },
        addWidgets: function () {
            if (!this.widgetsLayer) {
                this.widgetsLayer = createWidgetLayer(this, widgetsLayerOptions);
            };
        },
        addPickComponnet: function () {
            if (!this.popupLayer) {
                this.popupLayer = createWidgetLayer(this, popupLayerOptions);
            };
        },
        pick: function () {},
        alert: function () {
            if (!this.popupLayer) {
                this.popupLayer = createWidgetLayer(this, popupLayerOptions);
            };
        }
    });
    module.exports = app.SPA;
});
//# sourceMappingURL=SPA.js.map