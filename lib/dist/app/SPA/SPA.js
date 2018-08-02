/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 01:36:17 GMT
 */;
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
    var Component = imports['$_/app/router/'];
    var _ = pandora;
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
        _init: function () {},
        load: function () {},
        hide: function () {},
        show: function (direcion) {},
        remove: function () {},
        delete: function () {}
    });
    defaultPageOptions = {
        tagName: 'div'
    };
    var Widget = pandora.declareClass(Component, {
        layer: undefined,
        _init: function () {}
    });
    var Layer = pandora.declareClass(Component, {
        pages: {},
        _init: function () {},
        toTop: function () {},
        toBottom: function () {},
        addPage: function () {},
        removePage: function () {}
    });
    function scanLayer (app) {
        var _arguments = arguments;
        var layers = {};
        var elem = app.Element;
        pandora.each(elem.childNodes, function (index, node) {
            if (dom.hasAttr(node, 'data-layer-name')) {
                var layerName = dom.getAttr(node, 'data-layer-name');
                if (layers[layerName]) {
                    dom.remove(node, elem);
                    return;
                }
                layers[layerName] = new Layer({
                    uid: layerName,
                    Element: node
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
            defaultPage: defaultPageOptions
        }
    };
    var emptyLayerOptions = {
        tagName: 'div',
        className: '',
        pages: {}
    };
    function createLayer () {}
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
        Element: undefined,
        uid: undefined,
        layers: [],
        defaultLayer: undefined,
        popupLayer: undefined,
        widgetsLayer: undefined,
        _init: function (elem, options) {
            if (options === void 0) { options = {};}
            this.uid = 'SPA-' + _.Identifier().toString();
            this.layers = [];
            if (isEl(elem)) {
                this.Element = elem;
                
                scanLayer(this, options);
            }
            else if (isStr(elem) && $(elem).length) {
                this.Element = $(elem).get(0);
                
                scanLayer(this, options);
            }
            else {
                this.Element = pandora.dom.create('div', body, {
                    id: this.uid,
                    className: 'tanguage-spa'
                });
                if (options.defaultLayerName) {
                    this.defaultLayer = createLayer(this, options.defaultLayerName, options.layers && options.layers[options.defaultLayerName] || defaultLayerOptions);
                }
                else {
                    this.defaultLayer = createLayer(this, 'default', options.layers && options.layers['default'] || defaultLayerOptions);
                }
            }
            if (options.defaultLayerName) {
                if (options.defaultLayerName !== this.defaultLayer.uid) {
                    this.defaultLayer = createLayer(this, options.defaultLayerName, options.layers && options.layers[options.defaultLayerName] || defaultLayerOptions);
                }
            }
            if (options.popupLayer) {
                this.popupLayer = createPopupLayer(this, options.popupLayer || popupLayerOptions);
            }
            if (options.widgetsLayer) {
                this.widgetsLayer = createWidgetLayer(this, options.widgetsLayer || widgetsLayerOptions);
            };
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