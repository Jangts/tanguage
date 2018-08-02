/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 07:22:57 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/util/',
    '$_/arr/diff',
    '$_/obj/',
    '$_/dom/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var virtual = pandora.ns('dom.virtual', {});
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    pandora.declareClass('dom.virtual.HTMLElement', {
        _init: function (tagName, props, children) {
            var _arguments = arguments;
            if (_.util.isArr(props)) {
                children = props;
                props = {};
            }
            this.tagName = tagName;
            this.props = props || {}
            this.children = children || [];
            this.key = props ? props.key : undefined;
            var count = 0;
            pandora.each(this.children, function (i, child) {
                if (child instanceof _.dom.virtual.HTMLElement) {
                    count += child.count;
                }
                else {
                    children[i] = '' + child;
                }
                count++;
            }, this);
            this.count = count;
        },
        render: function () {
            var _arguments = arguments;
            var elem = doc.createElement(this.tagName);
            var props = this.props;
            for (var propName in props) {
                var propValue = props[propName];
                _.dom.set(elem, propName, propValue);
            }
            pandora.each(this.children, function (i, child) {
                var childEl = (child instanceof _.dom.virtual.HTMLElement) ? child.render():
                doc.createTextNode(child);
                elem.appendChild(childEl);
            }, this);
            return elem;
        }
    });
    
});
//# sourceMappingURL=Element.js.map