/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 31 Jul 2018 16:35:31 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/app/Component',
    '$_/arr/',
    '$_/dom/Elements',
    '$_/util/',
    '$_/util/Time'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var app = pandora.ns('app', {});
    var Component = imports['$_/app/component'];
    var has = imports['$_/arr/'] && imports['$_/arr/']['has'];
    var $ = imports['$_/dom/elements'];
    var gettype = imports['$_/util/'] && imports['$_/util/']['gettype'];
    var isElement = imports['$_/util/'] && imports['$_/util/']['isElement'];
    var Time = imports['$_/util/time'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var time = new Time();
    var mons = [];
    function getYear (year) {
        switch (gettype(year, true)) {
            case 'Integer':
            case 'StringInteger':
            var y = parseInt(year);
            if (y) {
                return y;
            }
            return new Date().getFullYear();
            default:
            return new Date().getFullYear();
        };
    }
    function getMonth (month, year) {
        switch (gettype(month, true)) {
            case 'Integer':
            case 'StringInteger':
            var m = parseInt(month) - 1;
            if (m >= 0 && m < 12) {
                return [m, getYear(year)];
            }
            if (year != undefined) {
                if (m >= 12) {
                    var inc = parseInt(m/12);
                    m = m % 12;
                    return [m, getYear(year) + inc];
                }
                if (m < 0) {
                    var inc = parseInt(m/12) - 1;
                    m = m % 12 + 12;
                    return [m, getYear(year) + inc];
                }
            }
            case 'Float':
            case 'StringFloat':
            var date = new Date(parseFloat(month));
            return [date.getMonth(), date.getFullYear()];
            case 'String':
            var m = has(months, month);
            if (m !== false) {
                return [m, getYear(year)];
            }
            m = has(mons, month);
            if (m !== false) {
                return [m, getYear(year)];
            }
            var date = new Date(month);
            m = date.getMonth();
            if (m) {
                return [m, date.getFullYear()];
            }
            var date = new Date();
            return [date.getMonth(), date.getFullYear()];
            case 'Array':
            return getMonth(month[0], month[1]);
            default:
            var date = new Date();
            return [date.getMonth(), date.getFullYear()];
        };
    }
    function getStr (num) {
        if (num > 9) {
            return num.toString();
        }
        return '0' + num;
    }
    function getDays (month, year, days) {
        var day = void 0;var lastdate = void 0;
        days.length = 0;
        days.firstDay = new Date(year,month,1).getDay();
        month++;
        lastdate = new Date(year, month, 0);
        days.lastDay = lastdate.getDay();
        lastdate = lastdate.getDate();
        for (day = 1;day <= lastdate;day++) {
            var arr = [year.toString(), getStr(month), getStr(day)];
            arr.year = year;
            arr.month = month - 1;
            arr.day = day;
            arr.dow = (days.firstDay + day - 1) % 7;
            days.push(arr);
        };
    }
    function removeByIndex (array, index) {
        var result = [];
        for (var i = 0;i < array.length;i++) {
            i == index || result.push(array[i]);
        }
        return result;
    }
    var Month = pandora.declareClass(_.Iterator, {
        year: 1970,
        month: 0,
        days: [],
        firstDay: 0,
        lastDay: 0,
        _init: function (month, year) {
            var month = getMonth(month, year);
            this.year = month[1];
            this.month = month[0];
            getDays(month[0], month[1], this);
        },
        prevMonth: function (createNewInstance) {
            if (createNewInstance === false) {
                this._init(this.month, this.year);
                return this;
            }
            return new Month(this.month, this.year);
        },
        nextMonth: function (createNewInstance) {
            if (createNewInstance === false) {
                this._init(this.month + 2, this.year);
                return this;
            }
            return new Month(this.month + 2, this.year);
        },
        prevYear: function (createNewInstance) {
            if (createNewInstance === false) {
                this._init(this.month, this.year - 1);
                return this;
            }
            return new Month(this.month, this.year - 1);
        },
        nextYear: function (createNewInstance) {
            if (createNewInstance === false) {
                this._init(this.month, this.year + 1);
                return this;
            }
            return new Month(this.month, this.year + 1);
        }
    });
    pandora.extend(Month, {
        format: getStr
    });
    var Clock = pandora.declareClass(Component, {
        H: 0,
        m: 0,
        s: 0,
        _init: function (elem) {
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
                this._observe(true)._listen('h', function (a, v) {
                    that.setHour(v);
                })._listen('m', function (a, v) {
                    that.setMinute(v);
                })._listen('s', function (a, v) {
                    that.setSecond(v);
                });
            }
            else {
                _.error('Must specify an element!');
            };
        },
        setHour: function (h) {
            h = parseInt(h) % 12;
            this._observer.silently = true;
            this.h = h;
            var angle = this.h * 30 + this.m * 0.5;
            this.hands.hour.css('transform', 'rotate(' + angle + 'deg)');
            this._observer.silently = false;
            return this;
        },
        setMinute: function (m) {
            m = parseInt(m) % 60;
            this._observer.silently = true;
            this.m = m;
            var angle = this.m * 6;
            this.hands.minute.css('transform', 'rotate(' + angle + 'deg)');
            this._observer.silently = false;
            return this;
        },
        setSecond: function (s) {
            s = parseInt(s) % 60;
            this._observer.silently = true;
            this.s = s;
            var angle = this.s * 6;
            this.hands.second.css('transform', 'rotate(' + angle + 'deg)');
            this._observer.silently = false;
            return this;
        },
        setTime: function (time) {}
    });
    pandora.declareClass('app.Kalendar', Component, {
        _init: function (elem) {
            elem = _.util.isElement(elem) ? elem : doc.getElementById(elem);
            if (elem) {
                this.Element = elem;
                _.dom.addClass(elem, 'tang-kalendar');
                this.months = $('.months',elem)[0] || _.dom.create('ul', elem, {className: 'months'});
                this.week = $('.week',elem)[0] || _.dom.create('ul', elem, {className: 'week'});
                this.days = $('.days',elem)[0] || _.dom.create('ul', elem, {className: 'days'});
                this.update(true);
            }
            else {
                _.error('Must specify an element!');
            };
        },
        update: function (today) {
            time.update();
            this.today = [time.year(), Month.format(time.month()), Month.format(time.day()), time.dayofweek()];
            if (today) {
                this.data = new Month(this.today[1], this.today[0]);
            }
            return this.drawMonths().drawDaysOfWeek().drawDaysOfMonth();
        },
        prevMonth: function () {
            this.data.prevMonth(false);
            return this.update();
        },
        nextMonth: function () {
            this.data.nextMonth(false);
            return this.update();
        },
        drawMonths: function () {
            var html = '<li class="month prev-month">&lt;</li>';
            html += '<li class="month curr-month">' + months[this.data.month] + ' ' + this.data.year + '</li>';
            html += '<li class="month next-month">&gt;</li>';
            this.months.innerHTML = html;
            return this;
        },
        drawDaysOfWeek: function () {
            var d = 1;
            var html = '';
            for (d;d < 8;d++) {
                _d = d % 7;
                if (_d == this.today[3]) {
                    html += '<li class="day-of-week today">' + dow[_d] + '</li>';
                }
                else {
                    html += '<li class="day-of-week">' + dow[_d] + '</li>';
                }
            }
            this.week.innerHTML = html;
            return this;
        },
        drawDaysOfMonth: function () {
            var p = 1;
            var prevIndex = void 0;
            var prevmonth = this.data.prevMonth();
            var t = 0;
            var day = 1;
            var date = void 0;
            var today = this.today.join('/');
            var n = 0;
            var nextlen = void 0;
            var nextmonth = this.data.nextMonth();
            var html = '';
            if (this.data.firstDay === 0) {
                prevIndex = prevmonth.length - 6;
                for (p;p < 6;p++) {
                    html += '<li class="day disabled">' + prevmonth[prevIndex++].day + '</li>';
                }
            }
            else {
                prevIndex = prevmonth.length - this.data.firstDay + 1;
                for (p;p < this.data.firstDay;p++) {
                    html += '<li class="day disabled">' + prevmonth[prevIndex++].day + '</li>';
                }
            }
            for (t;t < this.data.length;t++) {
                date = this.data[t].join('/') + '/' + this.data[t].dow;
                if (date == today) {
                    html += '<li class="day today" data-day-index="' + t + '">' + (day++) + '</li>';
                }
                else {
                    html += '<li class="day" data-day-index="' + t + '">' + (day++) + '</li>';
                }
            }
            nextlen = 43 - p - t;
            for (n;n < nextlen;n++) {
                html += '<li class="day disabled">' + nextmonth[n].day + '</li>';
            }
            this.days.innerHTML = html;
            return this;
        },
        drawEvents: function (events) {
            var _arguments = arguments;
            var day = void 0;
            pandora.each(events, function (index, marked) {
                day = $('[data-day-index="' + index + '"]', this.days).removeClass('events');
                if (marked) {
                    day.addClass('events');
                };
            }, this);
            return this;
        }
    });
    pandora.extend(pandora.app.Kalendar, {
        Clock: Clock
    });
    this.module.exports = app.Kalendar;
});
//# sourceMappingURL=Kalendar.js.map