/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 19 Jul 2018 04:16:26 GMT
 */;
// tang.config({});
tang.init().block([], function (pandora, root, imports, undefined) {
    tang.init().block([
        '$_/util/',
        '$_/dom/'
    ], function (pandora, root, imports, undefined) {
        var _ = pandora_1;
        var declare = pandora_1.declareClass;
        var doc = root_1.document;
        var location = root_1.location;
        var infinity = root_1.Number.POSITIVE_INFINITY;
        var $ = _.dom.$;
        _('see');
        var initScrollTop = $(doc.body).scrollTop();
        var handlers = {};
        declare('app.FrameView', {
            state: false,
            Element: null,
            frame: null,
            histories: null,
            nextIndex: 0,
            _init: function (elem) {
                this.Element = _.util.isStr(elem) ? _.dom.selector.byId(elem): elem;
                this.frame = _.dom.create('iframe', this.Element, {
                    width: '100%',
                    height: '100%'
                });
                this.histories = [];
            },
            on: function () {
                this.state = true;
                _.dom.setAttr(this.Element, 'state', 'on');
                return this;
            },
            off: function () {
                this.state = false;
                _.dom.setAttr(this.Element, 'state', 'off');
                return this;
            },
            load: function (url, isnew) {
                this.on().frame.src = url;
                if (isnew === true) {
                    this.histories.length = this.nextIndex;
                    this.histories.push(url);
                    this.nextIndex = this.histories.length;
                }
                var that = this;
                this.frame.onload = function () {
                    console.log(this.location);
                    that.onload(this);
                }
                this.frame.onload.onhashchange = function () {
                    console.log(this, that.frame.location, that.frame.location.hash);
                }
                _.dom.setStyle(this.Element, {overflowY: 'hidden'}).setStyle(this.frame, {
                    height: '100%',
                    overflow: 'auto'
                });
                return this;
            },
            onload: function (frame) {
                _.dom.setStyle(this.Element, {overflowY: 'hidden'}).setStyle(this, {
                    height: '100%',
                    overflow: 'auto'
                });
                try {
                    var frameSize = _.dom.getSize(frame.contentWindow.document.body);
                }
                catch (error) {
                    frame.scrolling = 'auto';
                    return;
                }
                _.dom.setStyle(frame, {
                    height: frameSize.height,
                    overflow: 'hidden'
                });
                _.dom.setStyle(this.Element, {overflowY: 'auto'});
            },
            refresh: function () {
                return this.load(this.histories[this.nextIndex - 1]);
            },
            loadPrev: function () {
                if (this.nextIndex > 1) {
                    this.nextIndex--;
                    this.request(this.histories[this.nextIndex - 1]);
                }
                return this;
            },
            loadNext: function () {
                if (this.nextIndex < this.histories.length) {
                    this.nextIndex++;
                    this.request(this.histories[this.nextIndex - 1]);
                }
                return this;
            },
            loadText: function (html) {
                this.launch().frame.srcdoc = html;
                return this;
            },
            resize: function () {
                return this;
            }
        });
    });
}, true);
//# sourceMappingURL=FrameView.js.map