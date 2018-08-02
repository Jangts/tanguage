/**
 * The pandora's box
 * 潘多拉盒子
 */

/** 潘多拉拓展接口 */
let namespace = storage.pandora = void ns {
    @include 'pandora/namespace';

    /** 初始化潘多拉接口 */
    return extend(namespace, {
        @include 'pandora/core';
        @include 'pandora/storage';
        @include 'pandora/locales';
        
        /**
         * 强制报错
         * 中止脚本，并抛出相应的文字描述
         *
         * @param string str 需要抛出的信息
         * @return undefined
         */
        error: error,
        /**
         * 调试报错
         * 调试模式下，中止脚本，并抛出相应的文字描述
         * 生产模式下，返回一个布尔值false，对进程不产生影响
         *
         * @param string str 需要抛出的信息
         * @return undefined|bool
         */
        debug: debug,
        /**
         * 计算相对路径
         * 比较两个url，计算他们的相对路径（如果确实存在的话）
         *
         * @param string            uri        进行比较的url
         * @param string|undefined  reference  被比较的url，可以留空，默认为当前页面的url
         * @return string
         */
        relativePath: calculateRelativePath,
        /**
         * 转换为数组，并截取之
         *
         * @param object            arrayLike       数组或类似数组的对象
         * @param int               startIndex      截取的起始位置，可留空，默认值为0
         * @param int|undefined     endIndex        截取的结束位置，可留空，默认为截取的结尾位置
         * @return undefined
         */
        slice: slice,
        remove (object, prop) {
            if (object && object.hasOwnProperty && object.hasOwnProperty(prop)) {
                var value = object[prop];
                // clog object, prop, value;
                delete object[prop];
                return value;
            }
            return null;
        },
        /**
         * 一般遍历：用以遍历对象，并执行相应操作
         *
         * @param object    obj         遍历的对象
         * @param function  handler     处理元素的回调函数
         * @param object    that        指定一个回调函数的调用对象
         * @return undefined
         */
        each: each,
        /**
         * 可控遍历：相比通用遍历：多了一个中断方法
         *
         * @param object    obj         遍历的对象
         * @param function  handler     处理元素的回调函数
         * @param object    that        指定一个回调函数的调用对象
         * @return array
         */
        loop: loop,
        /**
         * 复制对象
         *
         * @param object        source      源对象
         * @param bool|int      deeply      是否深拷贝，默认为否
         * @return object
         */
        clone (source, deeply) {
            if (deeply === true || deeply === 1) {
                return deep(source);
            } else {
                return shallow(source);
            }
        },
        /**
         * 拷贝对象
         *
         * @param object        source      源对象
         * @param bool|int      shallowly   是否浅拷贝，默认为否
         * @return object
         */
        copy (source, shallowly) {
            if (shallowly === true || shallowly === 1) {
                return shallow(source);
            } else {
                return deep(source);
            }
        },
        /**
         * 对象拓展：复制一些对象的元素到指定的对象
         *
         * @param object base 被拓展的对象
         * @return object
         */
        extend: extend,
        /**
         * 对象更新：仅当对象含有该元素且其值不为undefined时有效
         *
         * @param object base 被更新的对象
         * @return object
         */
        update: update,
        /**
         * 加载URL
         *
         * @param string    url         加载文件的路径
         * @param function  callback    加载成功后的回调函数
         * @param object    parent      加载资源的存放元素，默认为head元素
         * @param string    type        加载资源的类型，支持js、css、img，默认为js
         * @return undefined
         */
        load: loadURL,
        /**
         * @class Iterator
         * 迭代器类
         */
        Iterator: Iterator,
        /**
         * @class Identifier
         * 标识符类
         */
        Identifier: Identifier,
        /**
         * 返回文件或目录所在目录的地址
         *
         * @return string
         */
        dirname: dirname,
        /**
         * 返回当前URL
         *
         * @return string
         */
        mainUrl () {
            return storage.mainUrl;
        },
        /** 私有缓存区操作 */
        // locker: lockerHandlers,
        /** 命名正则 */
        namingExpr: namingExpr,
        /**
         * 检查具名类
         *
         * @param array list
         * @return bool
         */
        checkClass (list) {
            list = list || [];
            each(list, (i, classname) {
                if (!storage.classes[classname]) {
                    return false;
                }
            });
            return true;
        },
        /**
         * 检查潘多拉盒子
         *
         * @param array list
         * @return bool
         */
        checknamespace (list) {
            list = list || [];
            each(list, (i, objName) {
                var names = objName.split('.');
                var object = storage.pandora;
                each(names, (index, name) {
                    object = object[name];
                    if (!object) {
                        return false;
                    }
                });
            });
            return true;
        },
        /**
         * 异步代码块
         *
         * @param array     includes
         * @param function  callback
         * @return object
         */
        asyncBlocks (includes, callback) {
            return block(includes, callback, true);
        },
        /**
         * 异步代码块别名
         *
         * @param array     includes
         * @param function  callback
         * @return object
         */
        ab (includes, callback) {
            return block(includes, callback, true);
        },
        ns (name, callback) {
            if (typeof callback === 'object') {
                return namespace(name, callback, true);
            }
            // 执行函数
            if (typeof callback === 'function') {
                var ns = namespace(name);
                var members = callback.call(ns);
                // clog name, ns, members;
                if (members && (typeof members === 'object')) {
                    for (var m in members) {
                        ns[m] = members[m];
                    }
                }
                return ns;
            }
            error('ns method(namespace.ns) must be given a function or an object.');
        },
        /**
         * 简易渲染
         *
         * @param object    style           样式
         * @param string    innerHTML       DIV元素的content
         * @param string    rewritebody     是否重写整个body
         * @return array
         */
        render (style, innerHTML, rewritebody) {
            if (rewritebody) {
                doc.body.innerHTML = '';
            }
            style = (typeof style === 'object') ? style : {};
            innerHTML = (typeof style === 'string') ? style : (innerHTML || '');
            var el = doc.createElement('div');
            each(style, (p, v) {
                el.style[p] = v;
            });
            el.innerHTML = innerHTML;
            doc.body.appendChild(el);
            return el;
        },
        /**
         * 通用空操作
         *
         * @return object
         */
        self () {
            return this;
        }
    });
}