/**
 * @class Iterator
 * 定义迭代器类
 */
Iterator (obj, onlyKey) {
    if (this instanceof Iterator) {
        this._private = {};
        this._init(obj, onlyKey);
    } else {
        return new Iterator(obj, onlyKey);
    }
    
}

/** 为迭代器绑定原型 */
storage.classes.Iterator = Iterator.prototype = new Array;

/** 拓展迭代器的原型 */
extend(Iterator.prototype, true, {
    _protected : storage.classesSharedSpace,
    _extends : Identifier.prototype._extends,
    _clone : Identifier.prototype._clone,

    /**
     * 迭代器构造函数
     *
     * @param object    obj     用以初始化的对象
     * @param int       onlyKey 是否只录入对象的键
     * @return 构造函数，无返值
     */
    _init (obj, onlyKey) {
        if ((obj instanceof Array) || (Object.prototype.toString.call(obj) === '[object Array]') || ((typeof(obj.length) === 'number') && ((typeof(obj.item) === 'function') || (typeof(obj.splice) != 'undefined')))) {
            // if obj is an array object
            for (var i = 0; i < obj.length; i++) {
                this.push(obj[i]);
            }
        } else {
            // if obj is an normal object
            each(obj, (index, val) {
                if (onlyKey) {
                    this.push(index);
                } else {
                    this.push([index, val]);
                }
            }, this);
        }
        this.__ = -1;
    },

    /**
     * 指定指针位置
     *
     * @param int   index
     * @return mixed
     */
    point (index) {
        if (index < 0) {
            this.__ = 0;
        } else if (index >= this.length) {
            this.__ = this.length - 1;
        }
        return this[this.__];
    },

    /**
     * 读取第一个元素，同时指针也会跳到开始位置
     *
     * @return mixed
     */
    first () {
        this.__ = 0;
        return this[this.__];
    },

    /**
     * 读取最后一个元素，同时指针也会跳到最后
     * @return mixed
     */
    last () {
        this.__ = this.length - 1;
        return this[this.__];
    },

    /**
     * 判断是否存在下一个元素
     * @return array
     */
    hasNext () {
        var next = this.__ + 1;
        if (next < 0 || next >= this.length || null == this[next]) {
            return false;
        }
        return true;
    },

    /**
     * 读取当前元素
     *
     * @return array
     */
    get () {
        return this[this.__];
    },

    /**
     * 替换当前元素
     *
     * @param mixed elem    新元素
     * @return mixed
     */
    set (elem) {
        this[this.__] = elem;
        return elem;
    },

    /**
     * 读取下一个元素
     *
     * @return mixed
     */
    next () {
        if (this.hasNext()) {
            return this[++this.__];
        }
        return undefined;
    },

    /**
     * 一个可控遍历, 如果中途退出，则返回上次回调的返值
     *
     * @param function  callback    回调函数
     * @return mixed
     */
    each (callback) {
        var BREAK = false,
            lastReturn;
        this.out = () {
            BREAK = true;
        };
        for (var i = 0; i < this.length; i++) {
            if (BREAK) {
                BREAK = false;
                delete this.out;
                return lastReturn;
            }
            lastReturn = callback.call(this, this[i]);
        }
        return true;
    },

    /**
     * 更新这个迭代器的所有元素
     *
     * @param function  callback    回调函数
     * @return mixed
     */
    map (callback) {
        for (var i = 0; i < this.length; i++) {
            this[i] = callback.call(this, this[i]);
        }

        return this;
    }
});