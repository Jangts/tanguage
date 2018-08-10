/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 10 Aug 2018 04:01:24 GMT
 */
;
// tang.config({});
tang.init().block([
    '$_/dom/Events',
    '$_/util/',
    '$_/app/Photos/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var app = pandora.ns('app', {});
    var Events = imports['$_/dom/events'];
    var Photos = imports['$_/app/photos/'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console, location = root.location;
    var query = _.dom.sizzle  || _.dom.selector;
    Photos.ThreeDimensionalEyes = pandora.declareClass(Photos, {
        cur: 0,
        start: 0,
        _init: function (stage, images) {
            this.HTMLElement = _.util.isStr(stage) ? _.dom.selector.byId(stage): stage;
            _.dom.setStyle(this.HTMLElement, {
                cursor: 'default'
            });
            switch (typeof images) {
                case 'string':;
                this.loadBox();
                var that = this;
                this.loadJson(images, function () {
                    that.length  > 0  && that.play();
                });
                break;;
                case 'object':;
                this.loadBox();
                if (_.util.isArr(images)) {
                    this.loadArray(images);
                }
                else {
                    this.loadFolder(images);
                }
                this.length  > 0  && this.play();
                break;;
                case 'undefined':;
                this.noData();
                this.length  > 0  && this.play().bind();
                break;;
            };
        },
        loadBox: function () {
            var that = this;
            this.loadingArea = query('.ib-3deyes-loading',this.HTMLElement)[0] || _.dom.create('div', this.HTMLElement, {
                className: 'ib-3deyes-loading'
            });
            _.dom.setStyle(this.loadingArea, {
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                bottom: 0
            });
            _.dom.addEvents(this.loadingArea, 'click', null, null, function () {
                that.loading();
                _.dom.removeEvents(this, 'click');
            });
        },
        loading: function () {
            var loaded = 0;
            var percent = void 0;
            var that = this;
            _.dom.setStyle(this.loadingArea, {
                width: 0,
                height: 5,
                backgroundColor: '#000',
                opacity: .8
            });
            for (var n = 0;n  < this.length;n++) {
                var img = _.dom.create('img', this.HTMLElement, {
                    src: this.images[n],
                    className: 'ib-3deyes-item'
                });
                img.style.display = 'none';
                img.onload = function () {
                    loaded++;
                    percent = loaded /that.length  * 100;
                    _.dom.setStyle(that.loadingArea, 'width', percent  + '%');
                    if (loaded  >= that.length) {
                        _.dom.setStyle(that.loadingArea, 'display', 'none');
                        that.bind();
                    };
                }
            };
        },
        noData: function () {
            this.images = [];
            var that = this;
            _.each(query('img.ib-3deyes-item', this.HTMLElement), function () {
                _.dom.setStyle(this, 'display', 'none');
                that.images.push(_.dom.getAttr(this, 'src'));
                that.length++;
            });
        },
        bind: function () {
            var that = this;
            new Events(this.HTMLElement)
                .push('mousedown', null, null, function () {
                    that.state = true;
                })
                .push('touchstart', null, null, function () {
                    that.state = true;
                })
                .push('mousemove', null, null, function (e) {
                    if (that.state  == true) {
                        that.change(e.pageX  - this.offsetLeft);
                    }
                    else {
                        that.start = e.pageX  - this.offsetLeft;
                    };
                })
                .push('touchmove', null, null, function (e) {
                    e.preventDefault();
                    var end = e.touches[0] || e.changedTouches[0];
                    if (that.state  == true) {
                        that.change(end.pageX  - this.offsetLeft);
                    }
                    else {
                        that.start = end.pageX  - this.offsetLeft;
                    };
                });
            new Events(document)
                .push('mouseup', null, null, function () {
                    that.state = false;
                })
                .push("touchend", null, null, function () {
                    that.state = false;
                });
            return this;
        },
        change: function (end) {
            var move = this.start  - end;
            if (move  > 25) {
                this.start = this.start  - 25;
                this.cur = --this.cur  < 0 ? this.length  - 1 : this.cur;
                this.play();
                this.change(end);
            }
            else if (move  <  -25) {
                this.start = this.start  + 25;
                this.cur = ++this.cur  >= this.length ? 0 : this.cur;
                this.play();
                this.change(end);
            }
            else {
                this.start = end;
            };
        },
        play: function () {
            _.dom.setStyle(this.HTMLElement, {
                backgroundImage: 'url(' + this.images[this.cur] + ')',
                position: 'relative'
            });
            return this;
        }
    });
    this.module.exports = Photos.ThreeDimensionalEyes;
});
//# sourceMappingURL=ThreeDimensionalEyes.js.map