/*!
 * tanguage script compiled code
 *
 * Datetime: Sat, 04 Aug 2018 11:26:40 GMT
 */
;
// tang.config({});
tang.init().block([], function (pandora, root, imports, undefined) {
    tang.init().block(['$_/util/', '$_/dom/Elements', '$_/math/easing'], function (pandora_1, root_1, imports, undefined) {
        var _ = pandora_1;
        var declare = pandora_1.declareClass;
        var doc = root_1.document;
        var location = root_1.location;
        var $ = _.dom.$;
        var scrollbar = '';
        scrollbar += '<a href="javascript:void(0);" class="scroll-button-prev" oncontextmenu="return false;"></a>';
        scrollbar += '<div class="scroll-bar">';
        scrollbar += '<div class="scroll-dragger" oncontextmenu="return false;"></div>';
        scrollbar += '<div class="scroll-rail"></div></div>';
        scrollbar += '<a href="javascript:void(0);" class="scroll-button-next" oncontextmenu="return false;"></a>';
        var checkCurs = {
            cut: function () {
                this.cur = this.cur >= 0 ? this.cur : this.sections.length - 1;
                this.cur = this.cur < this.sections.length ? this.cur : 0;
            }
        };
        _('see');
        declare('see.Tabs', {
            _init: function (elem, options) {
                this.HTMLElement = _.util.isStr(elem) ? _.dom.selector.byId(elem): elem;
                options = options || {}
                for (var i in options) {
                    this[i] = options[i];
                }
                this.trigger = options.trigger === 'mouseover' ? 'mouseover':'click';
                switch (options.type) {
                    case 'horizontal':;
                    case 'vertical':;
                    case 'fade':;
                    break;;
                    default:
                    this.type = 'cut';
                }
                this.onplay = _.util.isFn(options.onplay) ? options.onplay : _.self;
                if (options.id) {
                    var sec_selector = '.tab-section.' + options.id;
                    var a_selector = '.tab-anchor.' + options.id;
                }
                else {
                    var sec_selector = '.tab-section';
                    var a_selector = '.tab-anchor';
                }
                this.sections = $(sec_selector, this.HTMLElement);
                var aliases = this.aliases = {};
                this.anchors = $(a_selector, this.HTMLElement).each(function (i) {
                    var alias = $(this).data('tabAlias');
                    if (alias) {
                        aliases[alias] = i;
                    };
                });
                this.bind(a_selector);
            },
            keyClass: 'actived',
            sections: [],
            anchors: [],
            bind: function () {
                var that = this;
                _.each(this.anchors, function (el, i) {
                    new _.dom.Events(el).push(that.trigger, null, null, function () {
                        that.cur = i;
                        that[that.type] && that[that.type]();
                    });
                });
                this.prevBtn && new _.dom.Events(this.prevBtn).push(this.trigger, null, null, function () {
                    that.cur = that.cur - 1;
                    that[that.type] && that[that.type]();
                });
                this.nextBtn && new _.dom.Events(this.nextBtn).push(this.trigger, null, null, function () {
                    that.cur = that.cur + 1;
                    that[that.type] && that[that.type]();
                });
            },
            duration: 600,
            cut: function () {
                var that = this;
                checkCurs.cut.call(this);
                _.each(this.sections, function () {
                    _.dom.toggleClass(this, that.keyClass, false);
                });
                _.dom.toggleClass(this.sections[this.cur], this.keyClass, true);
                _.each(this.anchors, function () {
                    _.dom.toggleClass(this, that.keyClass, false);
                });
                _.dom.toggleClass(this.anchors[this.cur], this.keyClass, true);
            },
            horizontal: function () {},
            vertical: function () {},
            fade: function () {},
            cur: 0,
            keyClass: 'actived',
            trigger: 'mouseover',
            type: 'cut',
            play: function () {
                this[this.type] && this[this.type]();
                this.onplay(this.cur);
            },
            playPrev: function () {
                this.cur = this.cur--;
                this.play();
            },
            playNext: function () {
                this.cur = this.cur + 1;
                this.play();
            },
            bind: function (a_selector) {
                var that = this;
                $(this.HTMLElement).on(this.trigger, a_selector, null, function () {
                    var cur = void 0;
                    var alias = $(this).data('tabAlias');
                    if (alias) {
                        cur = aliases[alias];
                    }
                    else {
                        cur = $(this).data('tabIndex');
                    }
                    if (cur !== that.cur) {
                        that.cur = cur;
                        that.play();
                    };
                });
                return this;
            }
        });
        _.extend(_.see.Tabs, {
            auto: function () {
                $('.tabs[data-ic-auto]').each(function () {
                    if (($(this).data('icAuto') != 'false') && ($(this).data('icRendered') != 'tabs')) {
                        $(this).data('icRendered', 'tabs');
                        new _.see.Tabs(this, {
                            trigger: $(this).data('tabsTrigger') || 'mouseover',
                            keyClass: $(this).data('tabskeyclass') || 'actived'
                        });
                    };
                });
            }
        });
    });
}, true);
//# sourceMappingURL=Tabs.js.map