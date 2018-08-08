/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 07 Aug 2018 07:23:21 GMT
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
    Photos.Album = pandora.declareClass(Photos, {
        state: false,
        cur: 0,
        AnimTrans: undefined,
        defaultImage: undefined,
        tipsOnLoading: 'Loading...',
        tipsAlreadyFirst: 'Already First',
        tipsAlreadyLast: 'Already Last',
        _init: function (stage, options) {
            this.HTMLElement = _.util.isStr(stage) ? _.dom.selector.byId(stage): stage;
            this.build(options);
            if (options.url) {
                this.redata(options.url);
            }
            else if (options.data) {
                this.redata(options.data);
            }
            else if (options.imagePath) {
                this.redata({
                    imagePath: options.imagePath,
                    totalImages: options.totalImages,
                    imageExtension: options.imageExtension
                });
            };
        },
        build: function (options) {
            options = options  || {}
            if (_.byCn('ib-photo-actor',this.HTMLElement)[0]) {
                this.Actor = _.byCn('ib-photo-actor',this.HTMLElement)[0];
                var size = _.dom.getSize(this.Actor);
                this.ActorWidth = size.width;
                this.ActorHeight = size.height;
            }
            else {
                var size = options.maxSize  || _.dom.getSize(this.HTMLElement);
                this.Actor = _.dom.create('div', this.HTMLElement, {
                    className: 'ib-photo-actor',
                    style: size
                });
            }
            this.ActorWidth = size.width;
            this.ActorHeight = size.height;
            this.Picture = _.byCn('ib-photo-image',this.Actor)[0] || _.dom.create('img', this.Actor, {
                className: 'ib-photo-image',
                style: {
                    position: 'absolute',
                    width: this.ActorWidth,
                    height: this.ActorHeight,
                    left: 0,
                    top: 0
                }
            });
            this.Notice = _.byCn('ib-photo-notice',this.Actor)[0] || _.dom.create('div', this.Actor, {
                className: 'ib-photo-notice',
                style: {
                    position: 'absolute',
                    width: this.ActorWidth /2,
                    height: 30,
                    left: this.ActorWidth /4,
                    top: this.ActorHeight /2,
                    marginTop:  -15,
                    background: '#000',
                    color: '#FFF',
                    textAlign: 'center',
                    overflow: 'hidden',
                    opacity: .8,
                    display: 'none',
                    lineHeight: 30
                }
            });
            this.ratio = this.ActorWidth /this.ActorHeight;
            this.AnimTrans = options.AnimTrans;
            this.duration = options.duration  || 500;
            this.trigger = options.trigger  || 'none';
            this.defaultImage = options.defaultImage;
            this.Nav = query('.ib-photo-nav ul',this.HTMLElement)[0];
            if(this.Nav) this.thumbNum = options.thumbNum  || 10;
            this.bind();
        },
        fix: function (origin) {
            origin.onload = origin.onerror = null;
            this.Notice.style.display = 'none';
            var ratio = origin.width /origin.height;
            if (ratio  > this.ratio) {
                var width = origin.width  < this.ActorWidth ? origin.width : this.ActorWidth;
                var height = width  * ratio;
            }
            else {
                var height = origin.height  < this.ActorHeight ? origin.height : this.ActorHeight;
                var width = height  * ratio;
            }
            var left = (this.ActorWidth - width)/2;
            var top = (this.ActorHeight - height)/2;
            if (this.AnimTrans) {
                _.dom.stop(this.Picture, true);
                _.dom.play(this.Picture, {
                    width: width,
                    height: height,
                    left: left,
                    top: top
                }, this.duration);
            }
            else {
                _.dom.setStyle(this.Picture, {
                    width: width,
                    height: height,
                    left: left,
                    top: top
                });
            };
        },
        fixNav: function () {
            var _arguments = arguments;
            if (this.Nav) {
                pandora.each(query('li',this.Nav), function (_index, li) {
                    _.dom.removeClass(li, 'actived');
                }, this);
                _.dom.addClass(query('[data-photo-num=' + this.cur + ']',this.Nav)[0], 'actived');
                var thumbWidth = _.dom.getWidth(query('.ib-photo-nav',this.HTMLElement)[0])/this.thumbNum;
                var midNum = Math.ceil(this.thumbNum /2) - 1;
                if (this.cur  < midNum) {
                    this.Nav.style.left = '0px';
                }
                else if (this.cur  < this.length  - this.thumbNum  + midNum) {
                    this.Nav.style.left = '-' + thumbWidth  * (this.cur - midNum) + 'px';
                }
                else {
                    this.Nav.style.left = '-' + thumbWidth  * (this.length - this.thumbNum) + 'px';
                }
            };
        },
        on: function () {
            this.state = true;
            return this;
        },
        off: function () {
            this.state = false;
            return this;
        },
        redata: function (images) {
            switch (typeof images) {
                case 'string':;
                var that = this;
                this.loadJson(images, function (array) {
                    var _arguments = arguments;
                    that.images = [];
                    that.thumbs = [];
                    that.length = 0;
                    pandora.each(array, function (_index, img) {
                        var src = img[3];
                        var sfix = /\.[^\.]+$/.exec(src);
                        that.images.push(src  + '_1100' + sfix);
                        that.thumbs.push(src  + '_275' + sfix);
                        that.length++;
                    }, this);
                    that.length  > 0  && that.nav().play();
                });
                break;;
                case 'object':;
                if (_.util.isArr(images)) {
                    this.loadArray(images);
                }
                else {
                    this.loadFolder(images);
                }
                this.length  > 0  && this.nav().play();
                break;;
            }
            return this;
        },
        bind: function () {
            var that = this;
            new Events(this.HTMLElement)
                .push('click', '.ib-photo-prev', null, function () {
                    that.cur--;
                    that.play();
                })
                .push('click', '.ib-photo-next', null, function () {
                    that.cur++;
                    that.play();
                })
                .push('click', '.ib-photo-thumb', null, function () {
                    that.cur = _.dom.getData(this, 'photoNum');
                    that.play();
                });
            new Events(document).push('keydown', null, null, function (e) {
                if (that.status) {
                    switch (e.which) {
                        case 27:
                        that.offCallback();
                        that.off();
                        break;;
                        case 37:
                        that.cur--;
                        that.play();
                        break;;
                        case 39:
                        that.cur++;
                        that.play();
                        break;;
                    }
                };
            });
        },
        nav: function () {
            var _arguments = arguments;
            if (this.Nav) {
                this.thumbs = this.thumbs  || this.images;
                var nav = this.Nav;
                var thumbWidth = _.dom.getWidth(query('.ib-photo-nav',this.HTMLElement)[0])/this.thumbNum;
                nav.style.position = 'absolute';
                nav.style.width = thumbWidth  * this.length  + 'px';
                nav.innerHTML = '';
                pandora.each(this.thumbs, function (i, thumb) {
                    _.dom.create('li', nav, {
                        className: 'ib-photo-thumb',
                        dataPhotoNum: i,
                        innerHTML: '<img src="' + thumb  + '" />',
                        style: {
                            width: thumbWidth
                        }
                    });
                }, this);
            }
            return this;
        },
        play: function (n) {
            if (this.check()) {
                var origin = new Image();
                origin.src = this.images[n || this.cur];
                var that = this;
                that.Picture.src = origin.src;
                that.tips(that.tipsOnLoading);
                if (origin.complete) {
                    that.fix(origin);
                }
                else {
                    origin.onload = function () {
                        if (this.src  == that.Picture.src) {
                            that.fix(this);
                        };
                    }
                    origin.onerror = function () {
                        that.Picture.src = that.defaultImage;
                    }
                }
                this.fixNav();
            };
        },
        check: function () {
            if (this.cur  > this.length  - 1) {
                this.cur = this.length  - 1;
                this.tips(this.tipsAlreadyLast);
                return false;
            }
            if (this.cur  < 0) {
                this.cur = 0;
                this.tips(this.tipsAlreadyFirst);
                return false;
            }
            return true;
        },
        tips: function (str, duration) {
            duration = duration  || 1500;
            var that = this;
            this.Notice.innerHTML = str;
            this.Notice.style.display = 'block';
            setTimeout(function () {
                that.Notice.style.display = 'none';
            }, duration);
        }
    });
    this.module.exports = Photos.Album;
});