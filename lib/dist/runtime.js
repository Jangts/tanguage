/*!
 * tanguage script compiled code
 *
 * Datetime: Wed, 01 Aug 2018 06:04:22 GMT
 */;
void

function(root, factory) {
    if (typeof exports === 'object') {
        root.console = console;
        exports = factory(root);
        if (typeof module === 'object') {
            module.exports = exports;
        }
    }
    else if (typeof root.define === 'function' && root.define.amd) {
        root.define(function () {
            return factory(root);
        });
    }
    else if (typeof root.tang === 'object' && typeof root.tang.init === 'function') {
        root.tang.init();
        root.tang.module.exports = factory(root);
    }
    else {
        factory(root)
    }
}(typeof window === 'undefined' ? global : window, function(root, undefined) {
    var pandora = {};
    var name = 'tanguage javascript framework';
    var version = '0.9.00';
    var website = 'tanguageram.js.cn';
    var startTime = new Date();
    var useDebugMode = false;
    var console = root.console;
    var doc = root.document;
    var open = root.open;
    var location = root.location;
    var head = (function () {
        if (doc !== undefined) {
            if (doc.head) {
                return doc.head;
            }
            var head = doc.getElementsByTagName('head')[0];
            var documentElement = void 0;
            if (head) {
                return head;
            }
            head = doc.createElement('head');
            documentElement = doc.documentElement || doc.getElementsByTagName('*')[0];
            documentElement.appendChild(head);
            return head;
        }
    }());
    var dirname = function (url) {
        return url.replace(/[^\\\/]+[\\\/]*$/, '');
    }
    var calculateRelativePath = function (uri, reference) {
        reference = reference || maindir;
        var i = 0;
        var pathname_array = uri.split('/');
        var referdir_array = reference.split('/');
        pathname_array.length--;
        referdir_array.length--;
        if (pathname_array[i] !== 'file:' && referdir_array[i] !== 'file:') {
            for (i;i < 3;i++) {
                if (pathname_array[i] != referdir_array[i]) {
                    return pathname_array.join('/') + '/';
                }
            }
        }
        else {
            for (i;i < 5;i++) {
                if (pathname_array[i] != referdir_array[i]) {
                    return pathname_array.join('/') + '/';
                }
            }
        }
        var pathname = './';
        for (i;i < referdir_array.length;i++) {
            if (pathname_array[i] != referdir_array[i]) {
                var l = 0;
                var len = referdir_array.length - i;
                for (l;l < len;l++) {
                    pathname += '../';
                }
                break;
            }
        }
        for (i;i < pathname_array.length;i++) {
            pathname += pathname_array[i] + '/';
        }
        return pathname;
    }
    var maindir = (function () {
        if (location !== undefined) {
            var pathname_array = location.pathname.split('/');
            pathname_array.length--;
            return location.origin + pathname_array.join('/') + '/';
        }
        return './';
    }());
    var runtime = (function () {
        if (doc !== undefined) {
            var scripts = doc.getElementsByTagName('script');
            var preg = /([\w\-\.\/:]+\/)(dist\/runtime|runtime|tanguage|tanguage|tanguageram)[\w\-\.]*\.js/i;
            var i = void 0;var src = void 0;var matchs = void 0;
            for (i = scripts.length - 1;i >= 0;i--) {
                if (scripts[i].hasAttribute('tanguage')) {
                    return {
                        Element: scripts[i],
                        Pathname: calculateRelativePath(scripts[i].src)
                    };
                }
                src = scripts[i].src || '';
                matchs = src.match(preg);
                if (matchs) {
                    return {
                        Element: scripts[i],
                        Pathname: calculateRelativePath(src)
                    };
                }
            }
            return {
                Element: null,
                Pathname: './'
            };
        }
        return {
            Element: undefined,
            Pathname: __dirname + '/'
        };
    }());
    function slice (arrayLike, startIndex, endIndex) {
        startIndex = parseInt(startIndex) || 0;
        return Array.prototype.slice.call(arrayLike, startIndex, endIndex);
    }
    function error (str) {
        throw "tanguage Error: " + str;
    }
    function debug (str) {
        if (useDebugMode) {
            
            error(str);
        }
        else {
            return false;
        };
    }
    function each (obj, handler, that, hasOwnProperty) {
        if (typeof(obj) == 'object' && obj) {
            var addArgs = slice(arguments, 3);
            if (hasOwnProperty) {
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                    }
                }
            }
            else if ((obj instanceof Array) || (Object.prototype.toString.call(obj) === '[object Array]') || ((typeof(obj.length) === 'number') && ((typeof(obj.item) === 'function') || (typeof(obj.splice) != 'undefined')))) {
                for (var i = 0;i < obj.length;i++) {
                    handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                }
            }
            else {
                for (var i in obj) {
                    handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                }
            }
        };
    }
    var loop = (function () {
        var BREAK = false;
        loop.out = function () {
            BREAK = true;
        }
        function loop (obj, handler, that, hasOwnProperty) {
            if (typeof(obj) == 'object' && obj) {
                var addArgs = slice(arguments, 3);
                BREAK = false;
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
                else if ((obj instanceof Array) || (Object.prototype.toString.call(obj) === '[object Array]') || ((typeof(obj.length) === 'number') && ((typeof(obj.item) === 'function') || (typeof(obj.splice) != 'undefined')))) {
                    for (var i = 0;i < obj.length;i++) {
                        if (BREAK) {
                            BREAK = false;
                            break;
                        }
                        handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                    }
                }
                else {
                    for (var i in obj) {
                        if (BREAK) {
                            BREAK = false;
                            break;
                        }
                        handler.apply(that || obj[i], [i, obj[i]].concat(addArgs));
                    }
                }
            };
        }
        return loop;
    }());
    function deep (source) {
        var type = Object.prototype.toString.call(source).match(/\[object (\w+)\]/)[1];
        if (type === 'Object') {
            var clone = {};
            
            each(source, function (key) {
                if (source.hasOwnProperty(key)) {
                    clone[key] = deep(source[key]);
                };
            });
            return clone;
        }
        if (type === 'Array') {
            return source.map && source.map(function (v) {
                return deep(v);
            });
        }
        return source;
    }
    function shallow (source) {
        var target = {};
        
        each(source, function (key, value) {
            target[key] = value;
        }, root, true);
        return target;
    }
    function extend (base) {
        base = (base && (typeof(base) === 'object' || typeof(base) === 'function')) ? base : root;
        var rewrite = (arguments[1] === 1 || arguments[1] === true) ? true : false;
        
        each(slice(arguments, 1), function (index, source) {
            
            each(source, function (key, value) {
                if (source.hasOwnProperty(key)) {
                    if (typeof base[key] === 'undefined' || rewrite) {
                        base[key] = value;
                    }
                };
            });
        });
        return base;
    }
    function update (base) {
        base = (base && (typeof(base) === 'object' || typeof(base) === 'function')) ? base : root;
        
        each(slice(arguments, 1), function (index, source) {
            
            each(source, function (key, value) {
                if ((base[key] !== undefined) && source.hasOwnProperty(key)) {
                    base[key] = value;
                };
            });
        });
        return base;
    }
    var storage = {
        maps: {
            linkTags: {},
            sourceTypes: {
                js: {
                    tag: 'script',
                    source: 'src'
                },
                css: {
                    tag: 'link',
                    source: 'href',
                    attrs: {
                        type: 'text/css',
                        rel: 'stylesheet'
                    }
                },
                img: {
                    tag: 'img',
                    source: 'src'
                }
            },
            identifiersReg: [],
            identifiersMap: {}
        },
        classes: {},
        classesSharedSpace: {},
        locales: {
            _public: {}
        },
        core: runtime,
        addinUrl: runtime.Pathname + '../../addin/',
        common_module: {
            exports: {}
        },
        blocks: {
            temp: [],
            mains: [],
            requires: {}
        },
        mainUrl: './',
        afters: []
    };
    var zero2z = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    function getUid (radix) {
        var uid = new Array(36);
        for (var i = 0;i < 36;i++) {
            uid[i] = zero2z[Math.floor(Math.random() * radix)];
        }
        uid[8] = uid[13] = uid[18] = uid[23] = '-';
        return uid.join('');
    }
    function loadURL (url, callback, parent, type) {
        var Element = void 0;var source = void 0;var loadType = storage.maps.sourceTypes[type] || storage.maps.sourceTypes.js;
        var callback = typeof callback === 'function' ? callback : function () {
            root.console.log(source + ' loaded.');
        }
        if (doc) {
            parent = (parent&&typeof parent.appendChild === 'function') ? parent : head;
            Element = doc.createElement(loadType.tag);
            Element[loadType.source] = url;
            source = Element[loadType.source];
            if (storage.maps.linkTags[source]) {
                Element = storage.maps.linkTags[source];
                if (Element.alreadyLoaded) {
                    
                    setTimeout(function () {
                        
                        callback(Element, true, source);
                    }, 0);
                    return;
                }
            }
            else {
                storage.maps.linkTags[source] = Element;
                Element.setAttribute('async', '');
                if (loadType.attrs) {
                    
                    each(loadType.attrs, function (attr, val) {
                        Element[attr] = val;
                    });
                }
                parent.appendChild(Element);
            }
            if (typeof(Element.onreadystatechange) === 'object') {
                Element.attachEvent('onreadystatechange', function () {
                    if (Element.readyState === 'loaded' || Element.readyState === 'complete') {
                        if (Element.alreadyLoaded) {
                            
                            callback(Element, true, source);
                        }
                        else {
                            Element.alreadyLoaded = true;
                            
                            callback(Element, false, source);
                        }
                    };
                });
            }
            else if (typeof(Element.onload) === 'object') {
                Element.addEventListener('load', function () {
                    if (Element.alreadyLoaded) {
                        
                        callback(Element, true, source);
                    }
                    else {
                        Element.alreadyLoaded = true;
                        
                        callback(Element, false, source);
                    };
                });
            };
        }
        else {
            
            error('blocks only load on browser, plase use require() on node.js');
        };
    }
    function Identifier (salt, type) {
        this._init(salt, type);
    }
    storage.classes.Identifier = Identifier.prototype = {
        _protecte: storage.classesSharedSpace,
        _init: function (salt, type) {
            if (typeof salt != 'string') {
                type = salt;
                salt = undefined;
            }
            if (typeof storage.maps.identifiersMap[salt] != 'undefined') {
                var uid = storage.maps.identifiersMap[salt];
            }
            else {
                var radix = 36;
                if (type == 0) {
                    radix = 10;
                }
                else if (type == 2) {
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
            this.toString = function () {
                return uid;
            };
        },
        _extends: function (members, strict) {
            if (strict) {
                
                update(this, members);
            }
            else {
                
                extend(this, true, members);
            }
            return this;
        },
        _clone: function () {
            return deep(this);
        }
    };
    function Iterator (obj, onlyKey) {
        this._init(obj, onlyKey);
    }
    storage.classes.Iterator = Iterator.prototype = new Array;
    
    extend(Iterator.prototype, true, {
        _protected: storage.classesSharedSpace,
        _extends: Identifier.prototype._extends,
        _clone: Identifier.prototype._clone,
        _init: function (obj, onlyKey) {
            if ((obj instanceof Array) || (Object.prototype.toString.call(obj) === '[object Array]') || ((typeof(obj.length) === 'number') && ((typeof(obj.item) === 'function') || (typeof(obj.splice) != 'undefined')))) {
                for (var i = 0;i < obj.length;i++) {
                    this.push(obj[i]);
                }
            }
            else {
                
                each(obj, function (index, val) {
                    if (onlyKey) {
                        this.push(index);
                    }
                    else {
                        this.push([index, val]);
                    };
                }, this);
            }
            this.__ =  -1;
        },
        point: function (index) {
            if (index < 0) {
                this.__ = 0;
            }
            else if (index >= this.length) {
                this.__ = this.length - 1;
            }
            return this[this.__];
        },
        first: function () {
            this.__ = 0;
            return this[this.__];
        },
        last: function () {
            this.__ = this.length - 1;
            return this[this.__];
        },
        hasNext: function () {
            var next = this.__ + 1;
            if (next < 0 || next >= this.length || null == this[next]) {
                return false;
            }
            return true;
        },
        get: function () {
            return this[this.__];
        },
        set: function (elem) {
            this[this.__] = elem;
            return elem;
        },
        next: function () {
            if (this.hasNext()) {
                return this[++this.__];
            }
            return undefined;
        },
        each: function (callback) {
            var BREAK = false;
            var lastReturn = void 0;
            this.out = function () {
                BREAK = true;
            }
            for (var i = 0;i < this.length;i++) {
                if (BREAK) {
                    BREAK = false;
                    delete this.out;
                    return lastReturn;
                }
                lastReturn = callback.call(this, this[i]);
            }
            return true;
        },
        map: function (callback) {
            for (var i = 0;i < this.length;i++) {
                this[i] = callback.call(this, this[i]);
            }
            return this;
        }
    });
    var namingExpr = /^[A-Z_\$][\w\$]*(\.[A-Z_\$][\w\$]*)*$/i;
    var namespace = storage.pandora = (function () {
        var namespace = function (name, value, update) {
            name = name.trim();
            if (namingExpr.test(name)) {
                value = value || {}
                var object = storage.pandora;
                var NameSplit = name.split('.');
                for (var i = 0;i < NameSplit.length && object;i++) {
                    var subname = NameSplit[i].trim();
                    if (i == NameSplit.length - 1) {
                        subname = subname || 'default';
                        if (object[subname] === undefined) {
                            object[subname] = value;
                            object = object[subname];
                        }
                        else if (typeof value !== 'object') {
                            var _value = object[subname];
                            object[subname] = value;
                            object = object[subname];
                            for (var k in _value) {
                                if (_value.hasOwnProperty(k)) {
                                    object[k] = _value[k];
                                }
                            }
                        }
                        else {
                            object = object[subname];
                            for (var k in value) {
                                if (value.hasOwnProperty(k)) {
                                    object[k] = update ? value[k]: object[k] || value[k];
                                }
                            }
                        }
                    }
                    else if (subname != '') {
                        object[subname] = object[subname] || {}
                        object = object[subname];
                    }
                }
                return object;
            }
            return error('Can not reset \'' + name + '\' as pandora namespace.');
        }
        return extend(namespace, {
            core: {
                startTime: function () {
                    return startTime;
                },
                name: function () {
                    return name;
                },
                version: function () {
                    return version;
                },
                website: function () {
                    
                    open(website, name);
                },
                url: function () {
                    return storage.core.Pathname;
                }
            },
            storage: {
                get: function (key1, key2) {
                    if (key2) {
                        var values = [];
                        for (var index = 0;index < arguments.length;index++) {
                            values.push(storage.locales._public[arguments[index]]);
                        }
                        return values;
                    }
                    return storage.locales._public[key1];
                },
                set: function (value1, value2) {
                    if (value2) {
                        var keys = [];
                        for (var index = 0;index < arguments.length;index++) {
                            var key = new Identifier().toString();
                            storage.locales._public[key] = arguments[index];
                            keys.push(key);
                        }
                        return keys;
                    }
                    var key = new Identifier().toString();
                    storage.locales._public[key] = value1;
                    return key;
                }
            },
            locales: function (ns) {
                if (ns && (typeof ns === 'string')) {
                    ns = ns.toLowerCase();
                    switch (arguments.length) {
                        case 1:
                        if (typeof storage.locales[ns] === 'object') {
                            return deep(storage.locales[ns]);
                        }
                        return undefined;
                        case 2:
                        if (typeof arguments[1] === 'object') {
                            if (typeof storage.locales[ns] !== 'object') {
                                storage.locales[ns] = {};
                            }
                            
                            each(arguments[1], function (lang, value) {
                                lang = lang.toLowerCase();
                                if (storage.locales[ns][lang] === undefined) {
                                    storage.locales[ns][lang] = value;
                                    var la = lang.substr(0, 2);
                                    if (storage.locales[ns][la] === undefined) {
                                        storage.locales[ns][la] = value;
                                    }
                                };
                            });
                            return true;
                        }
                        default:
                        if ((typeof storage.locales[ns] === 'object') && (typeof arguments[1] === 'string')) {
                            var lang = arguments[1].toLowerCase();
                            var value = void 0;
                            if (storage.locales[ns][lang]) {
                                value = storage.locales[ns][lang];
                            }
                            else {
                                var la = lang.substr(0, 2);
                                if (storage.locales[ns][la]) {
                                    value = storage.locales[ns][la];
                                }
                                else {
                                    return undefined;
                                }
                            }
                            var i = 2;
                            while ((typeof value === 'object') && (typeof arguments[i] === 'string')) {
                                value = value[arguments[i++]];
                            }
                            switch (typeof value) {
                                case 'object':;
                                return deep(value);
                                case 'string':;
                                return value;
                            }
                        }
                    }
                }
                return undefined;
            },
            error: error,
            debug: debug,
            relativePath: calculateRelativePath,
            slice: slice,
            remove: function (object, prop) {
                if (object && object.hasOwnProperty && object.hasOwnProperty(prop)) {
                    var value = object[prop];
                    delete object[prop];
                    return value;
                }
                return null;
            },
            each: each,
            loop: loop,
            clone: function (source, deeply) {
                if (deeply === true || deeply === 1) {
                    return deep(source);
                }
                else {
                    return shallow(source);
                };
            },
            copy: function (source, shallowly) {
                if (shallowly === true || shallowly === 1) {
                    return shallow(source);
                }
                else {
                    return deep(source);
                };
            },
            extend: extend,
            update: update,
            load: loadURL,
            Iterator: Iterator,
            Identifier: Identifier,
            dirname: dirname,
            mainUrl: function () {
                return storage.mainUrl;
            },
            namingExpr: namingExpr,
            checkClass: function (list) {
                list = list || [];
                
                each(list, function (i, classname) {
                    if (!storage.classes[classname]) {
                        return false;
                    };
                });
                return true;
            },
            checknamespace: function (list) {
                list = list || [];
                
                each(list, function (i, objName) {
                    var names = objName.split('.');
                    var object = storage.pandora;
                    
                    each(names, function (index, name) {
                        object = object[name];
                        if (!object) {
                            return false;
                        };
                    });
                });
                return true;
            },
            asyncBlocks: function (includes, callback) {
                return block(includes, callback, true);
            },
            ab: function (includes, callback) {
                return block(includes, callback, true);
            },
            ns: function (name, callback) {
                if (typeof callback === 'object') {
                    return namespace(name, callback, true);
                }
                if (typeof callback === 'function') {
                    var ns = namespace(name);
                    var members = callback.call(ns);
                    if (members && (typeof members === 'object')) {
                        for (var m in members) {
                            ns[m] = members[m];
                        }
                    }
                    return ns;
                }
                
                error('ns method(namespace.ns) must be given a function or an object.');
            },
            render: function (style, innerHTML, rewritebody) {
                if (rewritebody) {
                    doc.body.innerHTML = '';
                }
                style = (typeof style === 'object') ? style : {};
                innerHTML = (typeof style === 'string') ? style : (innerHTML || '');
                var el = doc.createElement('div');
                
                each(style, function (p, v) {
                    el.style[p] = v;
                });
                el.innerHTML = innerHTML;
                doc.body.appendChild(el);
                return el;
            },
            self: function () {
                return this;
            }
        });
    }());
    var template = 'if(this instanceof constructor){' + 'this._private = {};' + 'this._init.apply(this, arguments);' + '}else{' + 'var instance=new constructor();' + 'instance._private = {};' + 'instance._init.apply(instance, arguments);' + 'return instance;}';
    var blockClass = {
        _public: storage.classesSharedSpace,
        _init: function () {},
        _extends: Identifier.prototype._extends,
        _clone: Identifier.prototype._clone
    };
    function prepareClassMembers (target, data, start) {
        for (start;start < data.length;start++) {
            if (data[start]&& typeof data[start] === 'object') {
                
                extend(target, true, data[start]);
            }
            else {
                break;
            }
        }
        return target;
    }
    function produceClass (classname, superclass, members) {
        var Class = function () {}
        var name = void 0;
        var constructor = void 0;
        Class.prototype = superclass;
        if (classname) {
            name = classname.replace(/\.[A-Za-z]/g, function (s) {
                return s.replace('.', '').toUpperCase();
            });
            
            eval('constructor=function ' + name + '(){' + template + '}');
            constructor.prototype = new Class();
            storage.classes[classname] = constructor.prototype;
            var old = namespace(classname,  {});
            
            namespace(classname, constructor);
            
            namespace(classname, old);
        }
        else {
            constructor = function () {
                if (this instanceof constructor) {
                    this._private = {};
                    this._init.apply(this, arguments);
                    return this;
                }
                else {
                    var instance = new constructor();
                    instance._private = {};
                    instance._init.apply(instance, arguments);
                    return instance;
                };
            }
            constructor.prototype = new Class();
        }
        members._parent = superclass;
        if (members._getters) {
            (function () {
                
                each(members._getters, function (prop, get) {
                    if (typeof get === 'function') {
                        if (members._setters && (typeof members._setters[prop] === 'function')) {
                            Object.defineProperty(constructor.prototype, prop, {
                                get: get,
                                set: members._setters[prop],
                                enumerable: true,
                                configurable: true
                            });
                            delete members._setters[prop];
                        }
                        else {
                            Object.defineProperty(constructor.prototype, prop, {
                                get: get,
                                enumerable: true,
                                configurable: true
                            });
                        }
                    };
                });
            }())
            delete members._getters;
        }
        if (members._setters) {
            (function () {
                
                each(members._setters, function (prop, set) {
                    if (typeof set === 'function') {
                        Object.defineProperty(constructor.prototype, prop, {
                            set: set,
                            enumerable: true,
                            configurable: true
                        });
                    };
                });
                delete members._setters;
            }())
        }
        
        extend(constructor.prototype, true, members);
        return constructor;
    }
    var declareClass = storage.pandora.declareClass = function () {
        var classname = void 0;var superclass = void 0;var members = {};
        if (arguments.length > 0) {
            if (typeof arguments[0] === 'string' && namingExpr.test(arguments[0])) {
                if (storage.classes[arguments[0]]) {
                    return error('Can not redeclare class "' + arguments[0] + '".');
                }
                else {
                    classname = arguments[0];
                    if (typeof arguments[1] === 'function') {
                        superclass = arguments[1].prototype || blockClass;
                        members = prepareClassMembers(members, arguments, 2);
                    }
                    else {
                        superclass = blockClass;
                        members = prepareClassMembers(members, arguments, 1);
                    }
                }
            }
            else {
                classname = false;
                if (typeof arguments[0] === 'function') {
                    superclass = arguments[0].prototype || blockClass;
                    members = prepareClassMembers(members, arguments, 1);
                }
                else {
                    superclass = blockClass;
                    members = prepareClassMembers(members, arguments, 0);
                }
            }
        }
        else {
            classname = false;
            superclass = blockClass;
            members = {};
        }
        return produceClass(classname, superclass, members);
    }
    var mainPointer = 0;
    var requireCount = 0;
    var loadedCount = 0;
    function block (includes, callback, blockname) {
        return new Block(includes, callback, blockname).result;
    }
    function fireblock (block) {
        if (block.uid) {
            return;
        }
        
        each(block.imports, function (id, blocks) {
            var isAlisa = (typeof blocks === 'string');
            if (isAlisa) {
                var require = storage.blocks.requires[blocks];
            }
            else {
                var require = storage.blocks.requires[id];
            }
            if (require.status === 'loaded') {
                require.status = 'fired';
                
                each(require.blocks, function (i, block) {
                    
                    fireblock(block);
                });
            }
            block.imports[id] = require.exports;
        });
        block.uid = new Identifier().toString();
        storage.locales[block.uid] = block._parent;
        return block.callback(storage.pandora, root, block.imports);
    }
    var BlockCore = declareClass({
        url: storage.mainUrl,
        _init: function (callback) {
            this.imports = {};
            this.module = null;
            this.callback = callback;
        },
        get: function (key) {
            return this._private[key];
        },
        set: function (value) {
            var key = new Identifier().toString();
            this._private[key] = value;
            return key;
        }
    });
    var Block = declareClass({
        _init: function (includes, callback, blockname) {
            this.requires = [];
            this.onload = 0;
            this.loaded = 0;
            switch (typeof includes) {
                case 'string':;
                this.requires.push(includes);
                
                if(typeof callback === 'function') this.callback = callback;
                break;
                case 'object':;
                
                if(includes instanceof Array) this.requires = includes;
                
                if(typeof callback === 'function') this.callback = callback;
                break;
                case 'function':;
                this.callback = includes;
                blockname = callback;
                break;
            }
            requireCount += this.requires.length;
            this.core = new BlockCore(this.callback);
            var that = this;
            if (blockname) {
                if (blockname === true) {
                    
                    setTimeout(function () {
                        that.mainid = storage.blocks.mains.push(that.core) - 1;
                        that.listene();
                    }, 0);
                }
                else if (typeof(blockname) === 'string') {
                    storage.blocks.requires[blockname.toLowerCase()] = {
                        blocks: [this.core],
                        status: 'loaded'
                    };
                }
                tanguage.init();
            }
            else {
                if (blockname !== false) {
                    storage.blocks.temp.push(this.core);
                }
                this.mainid =  -1;
            }
            
            setTimeout(function () {
                that.listene();
            }, 0);
        },
        callback: function () {
            root.console.log('tanguage has loaded some require libraries.');
        },
        loadnext: function () {
            var that = this;
            var filetype = void 0;var arr = void 0;var url = void 0;
            if (this.requires[this.onload]) {
                arr = this.requires[this.onload].split(/\s+as\s+/);
                if (arr[0].match(/^~/)) {
                    url = arr[0].replace(/^~/, dirname(this.core.url));
                    var id = this.core.url + arr[0].toLowerCase();
                }
                else {
                    url = arr[0].replace(/^\$_\//, storage.core.Pathname).replace(/^\$\.\//, storage.mainUrl).replace(/^\$\+\//, storage.addinUrl);
                    var id = arr[0].toLowerCase();
                }
                if (url.match(/\.css$/) || url.match(/^[^\?]+\.css\?$/)) {
                    filetype = 'css';
                }
                else if (url.match(/\.js$/) || url.match(/\.json$/) || url.match(/^[^\?]+\.js\?/) || url.match(/^[^\?]+\.json\?/)) {
                    filetype = 'js';
                }
                else {
                    url = url + '.js';
                    filetype = 'js';
                }
                url = url.replace(/([\w\$]+)\/.js$/, '$1/$1.js');
                if (arr[1]) {
                    that.core.imports[arr[1]] = id;
                }
                this.core.imports[id] = [];
                this.onload++;
                if (!!storage.blocks.requires[id]) {
                    this.loaded++;
                    loadedCount++;
                    this.listene();
                }
                else {
                    storage.blocks.requires[id] = {
                        status: 'loading',
                        blocks: []
                    };
                    
                    loadURL(url, function (script, alreadyLoaded, url) {
                        that.loaded++;
                        loadedCount++;
                        if (alreadyLoaded) {
                            var sid = script.getAttribute('data-tanguage-id');
                            storage.blocks.requires[id] = storage.blocks.requires[sid];
                        }
                        else {
                            script.setAttribute('data-tanguage-id', id);
                            storage.blocks.requires[id].status = 'loaded';
                            storage.blocks.requires[id].blocks = storage.blocks.temp;
                            storage.blocks.requires[id].exports = storage.common_module.exports;
                            
                            each(storage.blocks.requires[id].blocks, function (i, block) {
                                block.module = storage.blocks.requires[id];
                                block.url = url;
                            });
                        }
                        tanguage.init();
                        that.listene();
                    }, false, filetype);
                }
            }
            else {
                this.onload++;
                this.loaded++;
                loadedCount++;
                that.listene();
            };
        },
        listene: function () {
            if (this.loaded === this.requires.length) {
                this.result.status = 0;
                if (loadedCount === requireCount) {
                    var mainCount = storage.blocks.mains.length;
                    for (mainPointer;mainPointer < mainCount;) {
                        
                        each(fireblock(storage.blocks.mains[mainPointer++]), function (index, value) {
                            root[index] = value;
                        });
                        if (mainPointer === storage.blocks.mains.length) {
                            
                            each(storage.afters, function (i, codes) {
                                
                                codes(root, undefined);
                            });
                            storage.afters = [];
                        }
                    }
                }
            }
            else if (this.onload < this.requires.length) {
                this.loadnext();
            };
        },
        result: {
            status: 1
        }
    });
    var tanguage = {
        block: block,
        config: function (options) {
            options = options || {}
            useDebugMode = options.useDebugMode ? true : false;
            if (options.addinUrl) {
                storage.addinUrl = options.addinUrl;
            }
            if (options.mainUrl) {
                var _maindir = maindir;
                var anchor = doc.createElement('a');
                anchor.href = options.mainUrl + '/';
                maindir = anchor.href;
                storage.mainUrl = calculateRelativePath(anchor.href, _maindir).replace(/[\/\\]+$/, '/');
            }
            if (options.corePath) {
                if (doc) {
                    if (storage.core.Element === null) {
                        var anchor = doc.createElement('a');
                        anchor.href = (options.corePath + '/').replace(/[\/\\]+$/, '/');
                        root.console.log(anchor.href);
                        var src = anchor.href;
                        storage.core.Pathname = calculateRelativePath(src);
                        storage.core.Element = undefined;
                    }
                }
                else {
                    storage.core.Pathname = calculateRelativePath((options.corePath + '/').replace(/[\/\\]+$/, '/'));
                }
            }
            return block;
        },
        auto: function (includes, callback) {
            return block(includes, callback, true);
        },
        init: function () {
            if (this === tanguage) {
                storage.blocks.temp = [];
                storage.common_module.exports = {};
                this.module = storage.common_module;
                this.exports = storage.common_module.exports;
                return this;
            }
            
            error('cannot call a private method from another object');
        },
        pandora: function () {
            return storage.pandora;
        },
        ready: function (codes) {
            
            codes(root, undefined);
        },
        after: function (codes) {
            storage.afters.push(codes);
        }
    };
    if (storage.core.Element) {
        var config = storage.core.Element.getAttribute('data-config');
        var mains = storage.core.Element.getAttribute('data-mains');
        var debug = storage.core.Element.getAttribute('data-tanguage-debug');
        if (config) {
            var url = url + '.js';
            
            loadURL(url, '$Config');
        }
        if (root.blockConfiguration) {
            tanguage.config(root.blockConfiguration);
        }
        if (mains) {
            var mArr = mains.split(/,\s*/);
            
            each(mArr, function (i, url) {
                var url = url + '.js';
                
                loadURL(url, '$Main_' + i);
            });
        }
        if (debug != null) {
            useDebugMode = true;
        }
    }
    if (useDebugMode) {
        root.console.log(storage);
    }
    root.console.log(storage);
    if (!root.parent || root.parent == root) {
        root.console.log('[' + startTime.toLocaleString() + '] tanguage framework Start Working!');
    }
    Object.defineProperty(storage.pandora, 'storage', {
        writable: false,
        enumerable: false,
        configurable: true
    });
    return root.tang = tanguage;
});
//# sourceMappingURL=runtime.js.map