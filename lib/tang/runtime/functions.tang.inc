/**
 * Array Slicing
 * 数组截断
 */
slice (arrayLike, startIndex, endIndex) {
    startIndex = parseInt(startIndex) || 0;
    return Array.prototype.slice.call(arrayLike, startIndex, endIndex);
}


/**
 * Exception Handling
 * 错误处理
 */

/** 强制报错：当方法被调用时抛出相应的错误描述 */
error (str) {
    throw "tanguage Error: " + str;
}
/** 调式报错：只有tanguage处于调试模式时，才会抛出相应的错误描述，否则返回一个布尔值 */
debug (str) {
    if (useDebugMode) {
        error(str);
    } else {
        return false;
    }
}


/**
 * Traversal and Copy
 * 遍历与拷贝
 */

/** 一般遍历：用以遍历对象，并执行相应操作 */
each (obj, handler, that, hasOwnProperty) {
    /** 首先检查是否为空对象或空值。 */
    if (typeof(obj) == 'object' && obj) {
        /** 截取传入的不定参数 */
        var addArgs = slice(arguments, 3);
        /** 判断是否为数组对象 */
        if (hasOwnProperty) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    // if(obj===root) clog i, obj;
                    handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                }
            }
        } else if ((obj instanceof Array) || (Object.prototype.toString.call(obj) === '[object Array]') || ((typeof(obj.length) === 'number') && ((typeof(obj.item) === 'function') || (typeof(obj.splice) != 'undefined')))) {
            for (var i = 0; i < obj.length; i++) {
                handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
            }
        } else {
            for (var i in obj) {
                // clog i, obj;
                handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
            }
        }
    }
}

/** 可控遍历：相比通用遍历：多了一个中断方法 */
let loop = void ns {
    /** 高级遍历方法的中断参数，当其值为是时，将中断当前遍历 */
    var BREAK = false;
    /** 高级遍历方法的中断：其作用是将终端参数的值设为是 */
    loop.out = () {
        BREAK = true;
    };

    loop(obj, handler, that, hasOwnProperty) {
        /** 首先检查是否为空对象或空值。 */
        if (typeof(obj) == 'object' && obj) {
            /** 截取传入的不定参数 */
            var addArgs = slice(arguments, 3);
            /** 初始化中断参数 */
            BREAK = false;
            /** 判断是否为数组对象 */
            if (hasOwnProperty) {
                for (var i in obj) {
                    if (BREAK) {
                        BREAK = false;
                        break;
                    }
                    if (obj.hasOwnProperty(i)) {
                        handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                    }
                }
            }
            /** 判断是否为数组对象 */
            else if ((obj instanceof Array) || (Object.prototype.toString.call(obj) === '[object Array]') || ((typeof(obj.length) === 'number') && ((typeof(obj.item) === 'function') || (typeof(obj.splice) != 'undefined')))) {
                for (var i = 0; i < obj.length; i++) {
                    if (BREAK) {
                        BREAK = false;
                        break;
                    }
                    handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                }
            } else {
                for (var i in obj) {
                    if (BREAK) {
                        BREAK = false;
                        break;
                    }
                    handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                }
            }
        }
    }
    return loop;
}

/** 深度拷贝：复制一个对象时逐层复制每一个子对象 */
deep (source) {
    var type = Object.prototype.toString.call(source).match(/\[object (\w+)\]/)[1];
    if (type === 'Object') {
        var clone = {};
        each(source, (key) {
            if (source.hasOwnProperty(key)) {
                // clog key;
                clone[key] = deep(source[key]);
            }
        });
        return clone;
    }
    if (type === 'Array') {
        return source.map && source.map((v) {
            return deep(v);
        });
    }
    return source;
}

/** 影子拷贝：复制一个对象时只复制对象的基本类型 */
shallow (source) {
    var target = {};
    each(source, (key, value) {
        target[key] = value;
    }, root, true);
    return target;
}

/** 对象拓展：复制一些对象的元素到指定的对象 */
extend (base) {
    base = (base && (typeof(base) === 'object' || typeof(base) === 'function')) ? base : root;
    var rewrite = (arguments[1] === 1 || arguments[1] === true) ? true : false;
    each(slice(arguments, 1), (index, source) {
        each(source, (key, value) {
            if (source.hasOwnProperty(key)) {
                /** 判断是否需要覆盖 */
                if (typeof base[key] === 'undefined' || rewrite) {
                    base[key] = value;
                }
            }
        });
    });
    return base;
}

/** 对象更新：仅当对象含有该元素且其值不为undefined时有效 */
update (base) {
    base = (base && (typeof(base) === 'object' || typeof(base) === 'function')) ? base : root;
    each(slice(arguments, 1), (index, source) {
        each(source, (key, value) {
            if ((base[key] !== undefined) && source.hasOwnProperty(key)) {
                base[key] = value;
            }
        });
    });
    return base;
}