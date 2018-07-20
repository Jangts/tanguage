/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 20 Jul 2018 18:22:36 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/dom/',
    '$_/obj/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var _ = pandora;
    var doc = root.document;
    var console = root.console, File = root.File, FileList = root.FileList, FormData = root.FormData;
    var IntExpr = /^(\+|-)?\d+$/;
    function typeOfObj (object) {
        if (!object) {
            return 'Null';
        }
        if (isGlobal(object)) {
            return 'Global';
        }
        if (isDoc(object)) {
            return 'HTMLDocument';
        }
        if (isElement(object)) {
            return 'Element';
        }
        if (isElements(object)) {
            return 'Elements';
        }
        if (isArray(object)) {
            return 'Array';
        }
        if (isRegExp(object)) {
            return 'RegExp';
        }
        return nativetype(object);
    }
    function nativetype (object) {
        if (!object) {
            return 'Null';
        }
        var match = Object.prototype.toString.call(object).match(/\[object (\w+)\]/);
        if (match) {
            return match[1];
        }
        return 'Object';
    }
    function isGlobal (object) {
        return object === window;
    }
    function isDoc (object) {
        return object === document;
    }
    function isElement (object) {
        return object && typeof object === 'object' && ((HTMLElement && (object instanceof HTMLElement)) || (object.nodeType === 1) || (DocumentFragment && (object instanceof DocumentFragment)) || (object.nodeType === 11));
    }
    function isElFragment (object) {
        return object && typeof object === 'object' && ((DocumentFragment && (object instanceof DocumentFragment)) || (object.nodeType === 11));
    }
    function isElements (object) {
        if (object && typeof object === 'object') {
            if (HTMLCollection && (object instanceof HTMLCollection)) {
                return true;
            }
            if (NodeList && (object instanceof NodeList)) {
                return true;
            }
            if ((object instanceof Array) || (Object.prototype.toString.call(object) === '[object Array]') || ((typeof(object.length) === 'number') && ((typeof(object.item) === 'function') || (typeof(object.splice) != 'undefined')))) {
                for (var i = 0;i < object.length;i++) {
                    if (!isElement(object[i])) {
                        return false;
                    }
                }
                return true;
            }
        };
    }
    function isArray (object) {
        return Object.prototype.toString.call(object) === '[object Array]';
    }
    function isRegExp (object) {
        return object instanceof RegExp;
    }
    function typeOfStr (string) {
        if (isIntStr(string)) {
            return 'StringInteger';
        }
        if (isFloatStr(string)) {
            return 'StringFloat';
        }
        return 'String';
    }
    function isIntStr (string) {
        return IntExpr.test(string);
    }
    function isFloatStr (string) {
        if (/^[-\+]{0,1}[\d\.]+$/.test(string)) {
            if (string.split('.').length === 2 && string.split('.')[1] != '') {
                return true;
            }
        }
        return false;
    }
    function isInteger (number) {
        if (typeof Number.isInteger === 'function') {
            return Number.isInteger(number);
        }
        else {
            return Math.floor(number) === number;
        };
    }
    function gettype (object, returnSubType) {
        switch (typeof object) {
            case 'object':
            return returnSubType ? typeOfObj(object):(object == null ? 'Null':((typeOfObj(object) === 'Array') ? 'Array':'Object'));
            case 'function':
            case 'boolean':
            case 'undefined':
            return (typeof object).replace(/(\w)/, function (v) {
                return v.toUpperCase();
            });
            case 'number':
            return returnSubType ? (isInteger(object) ? 'Integer':'Float'):'Number';
            case 'string':
            return returnSubType ? typeOfStr(object):'String';
        };
    }
    pandora.ns('util', {
        IntExpr: IntExpr,
        gettype: gettype,
        nativetype: nativetype,
        fastype: function (obj) {
            return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
        },
        typeOfObj: typeOfObj,
        typeOfStr: typeOfStr,
        truthy: function (value) {
            return !!value;
        },
        is: function (obj, __class) {
            return _.util.isObj(obj) && obj instanceof __class;
        },
        isObj: function (obj) {
            return typeof obj === 'object' && obj;
        },
        isGlobal: isGlobal,
        isWin: isGlobal,
        isDoc: isDoc,
        isElement: isElement,
        isEl: isElement,
        isVisi: function (elem) {
            return _.dom.getStyle(elem, 'display') != 'none';
        },
        isHide: function (elem) {
            return _.dom.getStyle(elem, 'display') === 'none';
        },
        isElements: isElements,
        isEls: isElements,
        isArray: isArray,
        isArr: isArray,
        isFile: function (file) {
            return _.util.isObj(file) && file instanceof File;
        },
        isFiles: function (files) {
            return _.util.isObj(files) && files instanceof FileList;
        },
        isForm: function (data) {
            return _.util.isObj(data) && data instanceof FormData;
        },
        isNul: function (obj) {
            if (obj) {
                return false;
            }
            else {
                return true;
            };
        },
        isStr: function (str) {
            return typeof str === 'string';
        },
        isIntStr: isIntStr,
        isFloatStr: isFloatStr,
        isOuterHTML: function (str) {
            return /^<(\w+)[\s\S]+<\/\1>$/.test(str) || /^<(\w+)[^>]*\/\s*>$/.test(str);
        },
        isPercent: function (str) {
            return (typeof str === 'string') && (/^[-\+]{0,1}(\d+(\.\d+){0,1}|\.\d+)\%$/.test(str));
        },
        isUrl: function (str) {
            var strRegex = "^((https|http|ftp|rtsp|mms|wss|ws)?://)"
    + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
    + "(([0-9]{1,3}\.){3}[0-9]{1,3}"
    + "|"
    + "([0-9a-z_!~*'()-]+\.)*"
    + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\."
    + "[a-z]{2,6})"
    + "(:[0-9]{1,4})?"
    + "((/?)|"
    + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var re = new RegExp(strRegex);
            if (re.test(str)) {
                return true;
            }
            else {
                return false;
            };
        },
        isHttpMethod: function (method) {
            if (typeof method !== 'string') {
                return false;
            }
            method = method.toUpperCase();
            return _.util.inArr(method, ['GET', 'CONNECT', 'COPY', 'DELETE', 'HEAD', 'LINK', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'TRACE', 'UNLINK', 'UPDATE', 'WRAPPED']) && method;
        },
        isRegExp: isRegExp,
        isReg: isRegExp,
        isInt: function (num) {
            return _.util.isInteger(num) || _.util.isIntStr(num);
        },
        isNum: function (num) {
            return typeof num === 'number';
        },
        isNumber: function (num) {
            return !isNaN(parseFloat(num)) && isFinite(num);
        },
        isFinite: function (num) {
            return isFinite(num);
        },
        isNumeric: function (num) {
            return typeof num === 'number' || _.util.isIntStr(num) || _.util.isFloatStr(num);
        },
        isInteger: isInteger,
        isScala: function (vari) {
            return typeof vari === 'boolean'|| typeof vari === 'string'|| typeof vari === 'number';
        },
        isBool: function (vari) {
            return typeof vari === 'boolean';
        },
        isFn: function (obj) {
            return typeof obj === 'function';
        },
        isSupportCanvas: function () {
            return typeof CanvasRenderingContext2D != "undefined";
        },
        isWebkit: function () {
            var reg = /webkit/i;
            return reg.test(this._ua);
        },
        isIE: function () {
            return 'ActiveXObject' in window;
        },
        isAndroid: function () {
            var android = false;
            var sAgent = navigator.userAgent;
            if (/android/i.test(sAgent)) {
                android = true;
                var aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);
                if (aMat && aMat[1]) {
                    android = parseFloat(aMat[1]);
                }
            }
            return android;
        },
        hasProp: _.obj.hasProp,
        hasStr: _.hasString,
        in: function (elem, object) {
            if (_.util.isArray(object)) {
                return _.arr.has(object, elem);
            }
            if (_.util.isObj(object)) {
                return _.obj.has(object, elem);
            }
            return false;
        },
        inArr: function (elem, array, ignoreType) {
            if (ignoreType) {
                for (var i = 0;i < array.length;i++) {
                    if (array[i] == elem) {
                        return true;
                    }
                }
                return false;
            }
            return _.arr.has(array, elem);
        }
    });
    this.module.exports = pandora.util;
});
//# sourceMappingURL=util.js.map