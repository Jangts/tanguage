/**
 * @class Identifier
 * 定义标识符类
 */
Identifier (salt, type) {
    if (this instanceof Identifier) {
        this._private = {};
        this._init(salt, type);
    } else {
        return new Identifier(salt, type);
    }
}

/** 为标识符构造器绑定原型 */
storage.classes.Identifier = Identifier.prototype = {
    _protecte: storage.classesSharedSpace,

    /**
     * 标识符构造函数
     *
     * @param string|int    salt    其值为字串时，为自定义标识；为数字时为返值类型
     * @param int           type    返值类型，当salt为字串时有效
     * @return 构造函数，无返值
     */
    _init (salt, type) {
        if (typeof salt != 'string') {
            type = salt;
            salt = undefined;
        }
        if (typeof storage.maps.identifiersMap[salt] != 'undefined') {
            var uid = storage.maps.identifiersMap[salt];
        } else {
            var radix = 36;
            if (type == 0) {
                radix = 10;
            } else if (type == 2) {
                radix = 62;
            }
            uid = getUid(radix);
            while (storage.maps.identifiersReg.indexOf(uid) >= 0) {
                uid = getUid(radix);
            }
            storage.maps.identifiersReg.push(uid);
            if (salt) {
                storage.maps.identifiersMap[salt] = uid;
            }
        }
        this.toString = () {
            return uid;
        };
    },

    /**
     * 批量拓展实例的属性和元素
     *
     * @param array     members
     * @param bool      strict
     * @return Identifier
     */
    _extends (members, strict) {
        if (strict) {
            update(this, members);
        } else {
            extend(this, true, members);
        }
        return this;
    },

    /**
     * 拷贝实例
     *
     * @return object
     */
    _clone () {
        return deep(this);
    }
};