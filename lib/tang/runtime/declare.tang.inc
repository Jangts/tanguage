/**
 * The tanguage class factory
 * tanguage类工厂
 */
let
/** 构造函数模板 */
template = 'if(this instanceof constructor){' +
'this._private = {};' +
'this._init.apply(this, arguments);' +
'}else{' +
'var instance=new constructor();' +
'instance._private = {};' +
'instance._init.apply(instance, arguments);' +
'return instance;}',
/** 祖先类 */
blockClass = {
    _public: storage.classesSharedSpace,
    _init () {},
    _extends: Identifier.prototype._extends,
    _clone: Identifier.prototype._clone
};

/** 准备类的成员 */
prepareClassMembers (target, data, start) {
    for (start; start < data.length; start++) {
        if (data[start] && typeof data[start] === 'object') {
            extend(target, true, data[start]);
        } else {
            break;
        }
    }
    return target;
}

/** 定义类的方法 */
produceClass (classname, superclass, members) {
    var
    Class = () {},
    name,
    constructor;

    // clog classname, superclass, members;
    Class.prototype = superclass;
    // clog new Class;
    if (classname) {
        name = classname.replace(/\.[A-Za-z]/g, (s) {
            return s.replace('.', '').toUpperCase();
        });
        eval('constructor=function ' + name + '(){' + template + '}');
        constructor.prototype = new Class();
        storage.classes[classname] = constructor.prototype;
        var old = namespace(classname, {});
        namespace(classname, constructor);
        namespace(classname, old);
    } else {
        constructor () {
            if (this instanceof constructor) {
                this._private = {};
                return this._init.apply(this, arguments);
            } else {
                var instance = new constructor();
                instance._private = {};
                instance._init.apply(instance, arguments);
                return instance;
            }
        };
        constructor.prototype = new Class();
    };

    members._parent = superclass;
    if (members._getters) {
        ( () {
            each(members._getters, (prop, get) {
                if (typeof get === 'function') {
                    if (members._setters && (typeof members._setters[prop] === 'function')) {
                        Object.defineProperty(constructor.prototype, prop, {
                            get: get,
                            set: members._setters[prop],
                            enumerable: true,
                            configurable: true
                        });
                        delete members._setters[prop];
                    } else {
                        Object.defineProperty(constructor.prototype, prop, {
                            get: get,
                            enumerable: true,
                            configurable: true
                        });
                    }
                }
            });
        }());
        delete members._getters;
    }
    if (members._setters) {
        ( () {
            each(members._setters, (prop, set) {
                // if (members.hasOwnProperty(prop))
                if (typeof set === 'function') {
                    Object.defineProperty(constructor.prototype, prop, {
                        set: set,
                        enumerable: true,
                        configurable: true
                    });
                }
            });
            delete members._setters;
        }());
    }
    // clog members;
    extend(constructor.prototype, true, members);
    return constructor;
}

/** 定义类的通用接口 */
var declareClass = storage.pandora.declareClass = () {
    let classname, superclass, members = {};
    // clog arguments;
    if (arguments.length > 0) {
        if (typeof arguments[0] === 'string' && namingExpr.test(arguments[0])) {
            if (storage.classes[arguments[0]]) {
                return error('Can not redeclare class "' + arguments[0] + '".');
            } else {
                classname = arguments[0];
                if (typeof arguments[1] === 'function') {
                    superclass = arguments[1].prototype || blockClass;
                    members = prepareClassMembers(members, arguments, 2);
                } else {
                    superclass = blockClass;
                    members = prepareClassMembers(members, arguments, 1);
                }
            }
        } else {
            classname = false;
            if (typeof arguments[0] === 'function') {
                superclass = arguments[0].prototype || blockClass;
                members = prepareClassMembers(members, arguments, 1);
            } else {
                superclass = blockClass;
                members = prepareClassMembers(members, arguments, 0);
            }
        }
    } else {
        classname = false;
        superclass = blockClass;
        members = {};
    }
    return produceClass(classname, superclass, members);
};