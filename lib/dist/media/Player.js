/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 10 Aug 2018 04:01:31 GMT
 */
;
// tang.config({});
tang.init().block([
    '$_/dom/Events'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    pandora.declareClass('media.Player', {
        type: 'AUDIO',
        protectTime: 100,
        lastActionTime: Date.now(),
        _init: function (elem, sheet) {
            if (_.util.isEl(elem) && _.uitl.bool.inArr(elem.tagName, ['AUDIO', 'VIDEO'])) {
                this.HTMLElement = elem;
                this.type = this.HTMLElement.tagName;
            }
            else {
                this.HTMLElement = new Audio;
                this.type = 'AUDIO';
                sheet = elem;
            }
            this.sheet = {};
            this.register(sheet);
        },
        setSource: function (sources) {
            if (sources  && (typeof sources === 'object')) {
                var that = this;
                for (var i in sources) {
                    if (this.canPlay(i) == 'maybe') {
                        try {
                            that.HTMLElement.src = sources[i];
                        }
                        catch (e) {
                            this.stop(function () {
                                that.HTMLElement.src = sources[i];
                            });
                        }
                        break;;
                    }
                }
            }
            return this;
        },
        register: function (sheet, sources) {
            if (sheet  && (typeof sheet === 'object')) {
                for (var code in sheet) {
                    if (sheet[code] && (typeof sheet[code] === 'object')) {
                        this.sheet[code] = sheet[code];
                    }
                }
            }
            else if (sheet  && sources  && (typeof sheet === 'string') && (typeof sources === 'object')) {
                this.sheet[code] = sheet[code];
            };
            return this;
        },
        clear: function (sheet, sources) {
            this.sheet = [];
        },
        play: function (code) {
            if (code  && this.sheet[code]) {
                this.setSource(this.sheet[code]);
            }
            var that = this;
            var duration = Date.now() - this.lastActionTime;
            if (duration  > this.protectTime) {
                this.HTMLElement.play();
                this.lastActionTime = Date.now();
            }
            else {
                this.timer  && clearTimeout(this.timer);
                this.timer = setTimeout(function () {
                    that.HTMLElement.play();
                    that.lastActionTime = Date.now();
                }, this.protectTime  - duration);
            }
            return this;
        },
        canPlay: function (mime) {
            return this.HTMLElement.canPlayType(mime);
        },
        pause: function (onpause) {
            var that = this;
            var duration = Date.now() - this.lastActionTime;
            if (duration  > this.protectTime) {
                this.HTMLElement.pause();
                this.lastActionTime = Date.now();
                _.util.isFn(onpause) && onpause.call(this);
            }
            else {
                this.timer  && clearTimeout(this.timer);
                this.timer = setTimeout(function () {
                    that.HTMLElement.pause();
                    that.lastActionTime = Date.now();
                    _.util.isFn(onpause) && onpause.call(this);
                }, this.protectTime  - duration);
            }
            return this;
        },
        stop: function (onstop) {
            this.pause(function () {
                this.HTMLElement.currentTime = 0;
                _.util.isFn(onstop) && onstop.call(this);
            });
            return this;
        },
        volume: function (vol) {
            switch (typeof vol) {
                case 'string':;
                if (vol  == 'up') {
                    var volume = this.HTMLElement.volume  + 0.1;
                    if (volume  >= 1) {
                        volume = 1;
                    }
                    this.HTMLElement.volume = volume;
                }
                else if (vol  == 'down') {
                    var volume = this.HTMLElement.volume  - 0.1;
                    if (volume  <= 0) {
                        volume = 0;
                    }
                    this.HTMLElement.volume = volume;
                }
                break;;
                case 'number':;
                if (vol  >= 0  && vol  <= 1) {
                    this.HTMLElement.volume = vol;
                }
                break;;
            };
        }
    });
    this.module.exports = _.media.Player;
});
//# sourceMappingURL=Player.js.map