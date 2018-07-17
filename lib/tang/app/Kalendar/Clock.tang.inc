/*!
 * tanguage framework source code
 *
 * class dom.Events
 *
 * Date 2017-04-06
 */
;
class Clock extends Component {
    H = 0
    m = 0
    s = 0

    _init (elem) {
        elem = _.util.isElement(elem) ? elem : doc.getElementById(elem);
        if (elem) {
            this.Element = elem;
            _.dom.addClass(elem, 'tang-clock');
            this.dial = $('.clock-dial', elem).html('<div class="clock-fixer"></div><div class="clock-hand hour"></div><div class="clock-hand minute"></div><div class="clock-hand second"></div>')[0] || _.dom.create('div', elem, {
                className: 'clock-dial',
                innerHTML: '<div class="clock-fixer"></div><div class="clock-hand hour"></div><div class="clock-hand minute"></div><div class="clock-hand second"></div>'
            });
            this.hands = {
                hour: $('.clock-hand.hour', this.dial),
                minute: $('.clock-hand.minute', this.dial),
                second: $('.clock-hand.second', this.dial)
            };

            var that = this;
            that.h = 0;
            that.m = 0;
            that.s = 0;
            this._observe(true)
                ._listen('h', function(a, v) {
                    that.setHour(v);
                })
                ._listen('m', function(a, v) {
                    that.setMinute(v);
                })
                ._listen('s', function(a, v) {
                    that.setSecond(v);
                });
        } else {
            _.error('Must specify an element!');
        }
    }

    setHour (h) {
        h = parseInt(h) % 12;

        this._observer.silently = true;
        this.h = h;
        var angle = this.h * 30 + this.m * 0.5;
        this.hands.hour.css('transform', 'rotate(' + angle + 'deg)');
        this._observer.silently = false;

        return this;
    }

    setMinute (m) {
        m = parseInt(m) % 60;

        this._observer.silently = true;
        this.m = m;
        var angle = this.m * 6;
        this.hands.minute.css('transform', 'rotate(' + angle + 'deg)');
        this._observer.silently = false;

        return this;
    }

    setSecond (s) {
        s = parseInt(s) % 60;

        this._observer.silently = true;
        this.s = s;
        var angle = this.s * 6;
        this.hands.second.css('transform', 'rotate(' + angle + 'deg)');
        this._observer.silently = false;

        return this;
    }

    setTime (time) {

    }
}