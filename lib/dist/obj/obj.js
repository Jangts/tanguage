/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 20 Jul 2018 14:51:52 GMT
 */;
// tang.config({});
tang.init().block([], function (pandora, root, imports, undefined) {
    var module = this.module;
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    function deepMerge (obj1, obj2) {
        var _arguments = arguments;
        if (obj1 && obj2) {
            pandora.each(obj2, function (key, val) {
                if ((typeof obj1[key] === 'object') && (typeof val === 'object')&& !(obj1[key] instanceof Array)&& !(val instanceof Array)) {
                    obj1[key] = deepMerge(obj1[key], val);
                }
                else {
                    obj1[key] = val;
                };
            }, this);
        }
        else {
            obj1 = obj2;
        }
        return obj1;
    }
    function toArray (obj) {
        var _arguments = arguments;
        var result = [];
        pandora.each(obj, function (index, elem) {
            result.push(elem);
        }, this);
        return result;
    }
    function toQueryString (obj) {
        obj = obj || {}
        var fields = [];
        for (var i in obj) {
            fields.push(i + "=" + encodeURIComponent(obj[i]));
        }
        return fields.join("&");
    }
    pandora.ns('obj', {
        hasProp: function (obj, property) {
            return obj && obj.hasOwnProperty && obj.hasOwnProperty(property);
        },
        merge: function () {
            var _arguments = arguments;
            if (arguments.length > 0) {
                var object = {};
                for (var a = 0;a < arguments.length;a++) {
                    if (typeof arguments[a] == 'object') {
                        pandora.each(arguments[a], function (index, elememt) {
                            object[index] = elememt;
                        }, this);
                    }
                }
            }
            else {
                var object = {};
            }
            return object;
        },
        deepMerge: function (obj1, obj2) {
            var _arguments = arguments;
            var object = {};
            if ((typeof obj1 === 'object') && (typeof obj2 === 'object')&& !(obj1 instanceof Array)&& !(obj2 instanceof Array)) {
                if (obj1 && obj2) {
                    object = _.copy(obj1);
                    pandora.each(obj2, function (key, val) {
                        if ((typeof object[key] === 'object') && (typeof val === 'object')&& !(object[key] instanceof Array)&& !(val instanceof Array)) {
                            object[key] = deepMerge(object[key], val);
                        }
                        else {
                            object[key] = val;
                        };
                    }, this);
                }
                else if (obj1) {
                    object = _.copy(obj1);
                }
                else if (obj2) {
                    object = _.copy(obj2);
                }
                else {
                    object = {};
                }
                return object;
            }
            else {
                _.error('Parameters must be two objects.');
            };
        },
        type: function (object, isDetail) {
            if (isDetail) {
                return _.util.gettype(object);
            }
            else {
                return typeof object;
            };
        },
        length: function (object, ownpropsonly) {
            var num = 0;
            for (var k in object) {
                if (ownpropsonly) {
                    if (object.hasOwnProperty(k)) {
                        num++;
                    }
                }
                else {
                    num++;
                }
            }
            return num;
        },
        clone: pandora.clone,
        has: function (object, elem) {
            for (var k in object) {
                if(object[k] == elem)return k;
            }
            return false;
        },
        toArray: toArray,
        toString: function (obj) {
            return obj == null ? '': typeof obj === 'object' ? JSON.stringify(obj, null, 2):String(obj);
        },
        toQueryString: toQueryString,
        valuesArray: toArray,
        keysArray: function (object) {
            var _arguments = arguments;
            var array = [];
            pandora.each(object, function (key) {
                array.push(key);
            }, this);
            return array;
        },
        encodeQueryString: toQueryString,
        decodeQueryString: function (str) {
            str = str.replace(/^(#|\?)/, '');
            var data = {};
            var fields = str.split('&');
            var i = 0;
            var filed = void 0;
            for (i;i < fields.length;i++) {
                filed = fields[i].split('=');
                data[filed[0]] = filed[1];
            }
            return data;
        }
    });
    this.module.exports = pandora.obj;
});
//# sourceMappingURL=obj.js.map