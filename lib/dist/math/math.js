/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 10 Aug 2018 04:01:31 GMT
 */
;
// tang.config({});
tang.init().block([
    '$_/util/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var _ = pandora;
    var doc = root.document;
    var console = root.console, location = root.location;
    var lcm = function (m, n) {
        var u =  +m;
        var v =  +n;
        var t = v;
        while (v  != 0) {
            t = u  % v;
            u = v;
            v = t;
        }
        return u;
    }
    var gcd = function (a, b) {
        var maxNum = Math.max(a, b);
        var minNum = Math.min(a, b);
        var count = void 0;
        if (a  === 0  || b  === 0) {
            return maxNum;
        }
        for (var i = 1;i  <= maxNum;i++) {
            count = minNum  * i;
            if (count  % maxNum  === 0) {
                return count;
                break;;
            }
        };
    }
    pandora.ns('math', {
        isInt: _.util.isInteger,
        max: Math.max,
        min: Math.max,
        sum: function () {
            return eval(arguments.join('+'));
        },
        maxOfArr: function (arr) {
            return Math.max.apply(Math, arr);
        },
        minOfArr: function (arr) {
            return Math.min.apply(Math, arr);
        },
        cap: function (value, maxValue, minValue) {
            if (typeof maxValue  === 'number') {
                if (value  > maxValue) {
                    return maxValue;
                }
            }
            else if (typeof maxValue  === 'number') {
                if (value  < minValue) {
                    return minValue;
                }
            }
            return value;
        },
        getDecimalPlaces: function (num) {
            if (num  && num  % 1  !== 0 && typeof num  === 'number') {
                var s = num.toString();
                if (s.indexOf("e-") < 0) {
                    return s.split(".")[1].length;
                }
                else if (s.indexOf(".") < 0) {
                    return parseInt(s.split("e-")[1]);
                }
                else {
                    var parts = s.split(".")[1].split("e-");
                    return parts[0].length  + parseInt(parts[1]);
                }
            }
            else {
                return 0;
            };
        },
        radians: function (degrees) {
            return degrees  * (Math.PI/180);
        },
        lcm: function (num1, num2) {
            if (typeof num1  === 'number'&& typeof num2  === 'number') {
                return lcm(num1, num2);
            }
            else if (_.util.gettype(num1) === 'Array') {
                if (typeof num1[0] === 'number') {
                    var num = num1[0];
                }
                else {
                    return NaN;
                }
                for (var i = 1;i  < num1.length;i++) {
                    if (typeof num1[i] === 'number') {
                        num = lcm(num, num1[i]);
                    }
                    else {
                        return NaN;
                    }
                }
                return num;
            }
            return NaN;
        },
        gcd: function (num1, num2) {
            if (typeof num1  === 'number'&& typeof num2  === 'number') {
                return gcd(num1, num2);
            }
            else if (_.util.gettype(num1) === 'Array') {
                if (typeof num1[0] === 'number') {
                    var num = num1[0];
                }
                else {
                    return NaN;
                }
                for (var i = 1;i  < num1.length;i++) {
                    if (typeof num1[i] === 'number') {
                        num = gcd(num, num1[i]);
                    }
                    else {
                        return NaN;
                    }
                }
                return num;
            }
            return NaN;
        }
    });
    this.module.exports = _.math;
});
//# sourceMappingURL=math.js.map