/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 09:53:50 GMT
 */;
// tang.config({});
tang.init().block([], function (pandora, root, imports, undefined) {
    var module = this.module;
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var doubleDigit = function (n) {
        return n < 10 ? "0" + n : n;
    }
    var patterns = [[/^\d+$/, function (time) {
        return parseInt(time);
    }], [/^[A-z]+\s+\d{1,2},\d{3,4}(\s+\d{1,2}:\d{1,2}:\d{1,2}){0,1}$/, function (time) {
        return Date.parse(time.replace(/\s+/g, ' '));
    }], [/^\d{1,2}\/\d{1,2}\/\d{3,4}(\s+\d{1,2}:\d{1,2}:\d{1,2}){0,1}$/, function (time) {
        return Date.parse(time.replace(/\s+/g, ' '));
    }], [/^\d{1,2}-\d{1,2}-\d{3,4}(\s+\d{1,2}:\d{1,2}:\d{1,2}){0,1}$/, function (time) {
        return Date.parse(time.replace(/-/g, "/").replace(/\s+/g, ' '));
    }], [/^\d{3,4}\/\d{1,2}\/\d{1,2}(\s+\d{1,2}:\d{1,2}:\d{1,2}){0,1}$/, function (time) {
        var tempStrs = time.split(/\s+/);
        var dateStrs = tempStrs[0].split('/');
        var year = parseInt(dateStrs[0], 10);
        var month = parseInt(dateStrs[1], 10) - 1;
        var day = parseInt(dateStrs[2], 10);
        var timeStrs = tempStrs[1] ? tempStrs[1].split(':'):[0, 0, 0];
        var hour = parseInt(timeStrs[0], 10);
        var minute = parseInt(timeStrs[1], 10) - 1;
        var second = parseInt(timeStrs[2], 10);
        return [year, month, day, hour, minute, second];
    }], [/^\d{3,4}-\d{1,2}-\d{1,2}(\s+\d{1,2}:\d{1,2}:\d{1,2}){0,1}$/, function (time) {
        var tempStrs = time.split(/\s+/);
        var dateStrs = tempStrs[0].split('-');
        var year = parseInt(dateStrs[0], 10);
        var month = parseInt(dateStrs[1], 10) - 1;
        var day = parseInt(dateStrs[2], 10);
        var timeStrs = tempStrs[1] ? tempStrs[1].split(':'):[0, 0, 0];
        var hour = parseInt(timeStrs[0], 10);
        var minute = parseInt(timeStrs[1], 10);
        var second = parseInt(timeStrs[2], 10);
        return [year, month, day, hour, minute, second];
    }]];
    var months = [];
    var mons = [];
    var match = {
        year: function (Y) {
            if ((typeof Y === 'number') || ((typeof m === 'string') && (/^\d{3,4}$/.test(Y)))) {
                return parseInt(Y);
            }
            return 1;
        },
        month: function (m) {
            if ((typeof m === 'number') || ((typeof m === 'string') && (/^\d{1,2}$/.test(m)))) {
                return parseInt(m);
            }
            if ((typeof m === 'string') && (months.indexOf(m) >= 0)) {
                return months.indexOf(m);
            }
            if ((typeof m === 'string') && (mons.indexOf(m) >= 0)) {
                return mons.indexOf(m);
            }
            return 1;
        },
        day: function (d) {
            if ((typeof d === 'number') || ((typeof d === 'string') && (/^\d{1,2}$/.test(d)))) {
                return parseInt(d);
            }
            return 1;
        },
        time: function (t) {
            if ((typeof t === 'number') || ((typeof t === 'string') && (/^\d{1,2}$/.test(t)))) {
                return parseInt(t);
            }
            return 0;
        }
    };
    var getArray = function (year, month, day, hour, minute, second) {
        return [match.year(year),
            match.month(month) - 1,
            match.day(day),
            match.time(hour),
            match.time(minute),
            match.time(second)
        ];
    }
    var codes = {};
    var units = {
        d: 1000 * 60 * 60 * 24,
        H: 1000 * 60 * 60,
        i: 1000 * 60,
        s: 1000,
        ms: 1
    };
    var dates = [];
    pandora.declareClass('util.Time', {
        _init: function (time) {
            var _arguments = arguments;
            var t = void 0;var date = void 0;
            switch (arguments.length) {
                case 1:
                switch (typeof time) {
                    case 'object':;
                    if (time instanceof Array) {
                        t = getArray(time[0], time[1], time[2], time[3], time[4], time[5]);
                    }
                    else if ((typeof time.year === 'number') || /^\d{3,4}$/.test(time.year)) {
                        t = getArray(time.year, time.month, time.day, time.hour, time.minute, time.second);
                    }
                    else if ((typeof time.Y === 'number') || /^\d{3,4}$/.test(time.Y)) {
                        t = getArray(time.Y, time.m, time.d, time.H, time.i, time.s);
                    };
                    break;
                    case 'string':;
                    if (codes[time]) {
                        t = codes[time]();
                    }
                    pandora.loop(patterns, function (i, type) {
                        if (type[0].test(time)) {
                            t = type[1](time);
                            pandora.loop.out();
                            return;
                        };
                    }, this);
                    t = time;
                    break;
                    case 'number':;
                    t = parseInt(time);
                    break;
                }
                break;
                case 2:
                t = getArray(arguments[0], arguments[1]);
                break;
                case 3:
                t = getArray(arguments[0], arguments[1], arguments[2]);
                break;
                case 4:
                t = getArray(arguments[0], arguments[1], arguments[2], arguments[3]);
                break;
                case 5:
                t = getArray(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                break;
                case 6:
                t = getArray(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                break;
            }
            switch (typeof t) {
                case 'number':;
                date = new Date(t);
                break;
                case 'object':;
                date = new Date(t[0], t[1], t[2], t[3], t[4], t[5]);
                break;
                case 'string':;
                date = new Date(t);
                break;
                case 'undefined':;
                date = new Date();
                break;
            }
            this.id = dates.push(date) - 1;
        },
        update: function () {
            dates[this.id] = new Date();
            return this;
        },
        date: function () {
            return dates[this.id];
        },
        parse: function () {
            return dates[this.id].getTime();
        },
        year: function (val) {
            if (typeof val == 'number') {
                dates[this.id].setFullYear(val);
                return this;
            }
            return dates[this.id].getFullYear();
        },
        month: function (val) {
            if (typeof val == 'number') {
                dates[this.id].setMonth(val);
                return this;
            }
            return dates[this.id].getMonth() + 1;
        },
        dayofweek: function (val) {
            if (typeof val == 'number') {
                dates[this.id].setDay(val);
                return this;
            }
            return dates[this.id].getDay();
        },
        day: function (val) {
            if (typeof val == 'number') {
                dates[this.id].setDate(val);
                return this;
            }
            return dates[this.id].getDate();
        },
        hour: function (val) {
            if (typeof val == 'number') {
                dates[this.id].setHours(val);
                return this;
            }
            return dates[this.id].getHours();
        },
        minute: function (val) {
            if (typeof val == 'number') {
                dates[this.id].setFullMinutes(val);
                return this;
            }
            return dates[this.id].getMinutes();
        },
        second: function (val) {
            if (typeof val == 'number') {
                dates[this.id].setSeconds(val);
                return this;
            }
            return dates[this.id].getSeconds();
        },
        ms: function (val) {
            if (typeof val == 'number') {
                dates[this.id].setMilliseconds(val);
                return this;
            }
            return dates[this.id].getMilliseconds();
        },
        when: function (hour) {
            hour = typeof hour == 'number' ? hour : this.hour();
            switch (hour) {
                case 1:
                case 2:
                case 3:
                case 4:
                return 'WEE';
                case 5:
                case 6:
                return 'DWN';
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                return 'MRN';
                case 12:
                case 13:
                return 'NOON';
                case 14:
                case 15:
                case 16:
                case 17:
                return 'AFTN';
                case 18:
                case 19:
                case 20:
                case 21:
                return 'EVN';
                case 22:
                case 23:
                case 0:
                return 'NIT';
            };
        },
        utc: function (sets) {
            if (sets) {
            (typeof sets.day === 'number') && dates[this.id].setUTCDate(sets.day);(typeof sets.week === 'number') && dates[this.id].setUTCDay(sets.week);(typeof sets.month === 'number') && dates[this.id].setUTCMonth(sets.month - 1);(typeof sets.year === 'number') && dates[this.id].setUTCFullYear(sets.year);(typeof sets.hour === 'number') && dates[this.id].setUTCHours(sets.hour);(typeof sets.minute === 'number') && dates[this.id].setUTCMinutes(sets.minute);(typeof sets.second === 'number') && dates[this.id].setUTCSeconds(sets.second);(typeof sets.ms === 'number') && dates[this.id].setUTCMilliseconds(sets.ms);
                return this;
            }
            return {
                day: dates[this.id].getUTCDate(),
                week: dates[this.id].getUTCDay(),
                month: dates[this.id].getUTCMonth() + 1,
                year: dates[this.id].getUTCFullYear(),
                hour: dates[this.id].getUTCHours(),
                minute: dates[this.id].getUTCMinutes(),
                second: dates[this.id].getUTCSeconds(),
                ms: dates[this.id].getUTCMilliseconds()
            };
        },
        toString: function (type) {
            switch (type) {
                case 'source':;
                return dates[this.id].toSource();
                case 'time':;
                return dates[this.id].toTimeString();
                case 'date':;
                return dates[this.id].toDateString();
                case 'GMT':;
                case 'UTC':;
                return dates[this.id].toUTCString();
                case 'local':;
                return dates[this.id].toLocaleString();
                case 'localtime':;
                return dates[this.id].toLocaleTimeString();
                case 'localdate':;
                return dates[this.id].toLocaleDateString();
            }
            return dates[this.id].toString();
        },
        val: function () {
            return dates[this.id].valueOf();
        },
        prev: function (t, unit) {
            t = typeof t == 'number' ? t : 1;
            ms = units[unit] ? units[unit] * t : 1000 * t;
            return this.ms(this.ms() - ms);
        },
        next: function (t, unit) {
            t = typeof t == 'number' ? t : 1;
            ms = units[unit] ? units[unit] * t : 1000 * t;
            return this.ms(this.ms() + ms);
        },
        now: function () {
            this.update();
            return {
                year: this.year(),
                month: this.month(),
                day: this.day(),
                hour: this.hour(),
                minute: this.minute(),
                second: this.second()
            };
        },
        format: function (format, times) {
            format = format || 'yyyy/MM/dd  hh:mm:ss';
            times = times || {}
            var yyyy = times.year || this.year();
            var M = times.month || this.month();
            var d = times.day || this.day();
            var H = times.hour || this.hour();
            var h = H % 12;
            var m = times.minute || this.minute();
            var s = times.second || this.second();
            var matchs = {
                yyyy: yyyy,
                yy: yyyy % 100,
                MM: doubleDigit(M),
                M: M,
                dd: doubleDigit(d),
                d: d,
                HH: doubleDigit(H),
                H: H,
                hh: doubleDigit(h),
                h: h,
                mm: doubleDigit(m),
                m: m,
                ss: doubleDigit(s),
                s: s
            };
            for (var i in matchs) {
                format = format.replace(i, matchs[i]);
            }
            return format;
        },
        loop: function (callback, duration, update) {
            var that = this;
            _.util.Time.loop(function () {
                update && that.update();
                callback.call(that);
            }, duration);
        },
        process: function (callback, time, unit) {
            if (typeof time == 'string') {
                var regp = /^(\d{3,4}\/\d{2}\/\d{2})(\s+(\d{2}:\d{2})(:\d{2}){0,1}){0,1}$/;
                var time = str.replace('-', '/').replace(/\*/, ' ').replace(/\/(\d)/, '/0$1');
                var duration = 0;
                if (time.match(regp)) {
                    duration = new Date().getTime(time) - this.time();
                }
            }
            else if (typeof time == 'number') {
                duration = units[unit] ? units[unit] * time : 1000 * time;
            }
            duration = (duration >= 0) ? duration : 0;
            setTimeout(callback, duration);
        }
    });
    pandora.extend(pandora.util.Time, {
        stamp: function () {
            var timestamp = Date.parse(new Date());
            return timestamp/1000;
        },
        loop: function (callback, duration, times) {
            callback = typeof callback == 'function' ? callback:function () {}
            duration = typeof duration == 'number' ? duration : 1000;
            times = typeof times == 'number' ? times : 0;
            var that = this;
            if (times == 0) {
                setInterval(callback, duration);
            }
            else if (times == 1) {
                setTimeout(callback, duration);
            }
            else {
                var timer = function () {
                    setTimeout(function () {
                        callback();
                        --times && timer();
                    }, duration);
                }
                times > 0 && timer();
            };
        }
    });
    this.module.exports = _.util.Time;
});
//# sourceMappingURL=Time.js.map