/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 07:22:59 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/util/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var u = imports['$_/util/'];
    var _ = pandora;
    var console = root.console;
    var isFn = u.isFn;
    var Subscriber = pandora.declareClass({
        _init: function () {
            this.listeners = [];
        },
        watch: function (listener) {
            this.listeners.push(listener);
        },
        notify: function (isWriting, silentlyWriting) {
            var _arguments = arguments;
            if (isWriting) {
                pandora.each(this.listeners, function (i, o) {
                    this.onwrite(silentlyWriting);
                }, this);
            }
            else {
                pandora.each(this.listeners, function (i, o) {
                    this.onread();
                }, this);
            };
        }
    });
    var Listener = pandora.declareClass({
        _init: function (observer, property, writeCallback, readCallback) {
            this.observer = observer;
            this.data = observer.data;
            this.property = property;
            this.writeCallback = writeCallback;
            this.readCallback = readCallback;
            this.observer.listener = this;
            this.value = observer.data[property];
            this.observer.listener = null;
        },
        onread: function () {
            _.util.isFn(this.readCallback) && this.readCallback.call(this.data, this.value, this.property);
        },
        onwrite: function (silently) {
            this.observer.silently = true;
            var value = this.data[this.property];
            this.observer.silently = silently;
            if (value !== this.value) {
                this.value = value;
                silently || (isFn(this.writeCallback) && this.writeCallback.call(this.data, this.value, this.property));
            };
        }
    });
    function observe (data) {
        if (data && typeof data === 'object') {
            return new Observer(data);
        }
        return false;
    }
    function activeListen (observer, key, val) {
        var subscriber = new Subscriber();
        observe(val);
        Object.defineProperty(observer.data, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                if (observer.listener) {
                    subscriber.watch(observer.listener);
                }
                else if (observer.silently === false) {
                    subscriber.notify(false, false);
                }
                return val;
            },
            set: function (value) {
                if (value === val) {
                    return;
                }
                val = value;
                _.util.isObj(value) && observe(value);
                if (observer.silently === false) {
                    subscriber.notify(true, false);
                }
                else {
                    subscriber.notify(true, true);
                };
            }
        });
    }
    var Observer = pandora.declareClass({
        listener: null,
        silently: false,
        _init: function (data) {
            this.data = data;
            this.walk(data);
        },
        walk: function (data) {
            var _arguments = arguments;
            pandora.each(data, function (key, val) {
                if (data.hasOwnProperty(key)) {
                    activeListen(this, key, val, true);
                };
            }, this);
            data._observer = this;
        },
        listen: function (property, writeCallback, readCallback) {
            if (_.util.isStr(property) && _.util.hasProp(this.data, property)) {
                return new Listener(this, property, writeCallback, readCallback);
            }
            if (_.util.isFn(property)) {
                readCallback = writeCallback;
                writeCallback = property;
            }
            _.each(this.data, function (property) {
                if (property !== '_observer' && _.util.hasProp(this.data, property)) {
                    new Listener(this, property, writeCallback, readCallback);
                };
            }, this);
        },
        on: function (eventType, property, callback) {
            if (eventType === 'read') {
                return new Listener(this, property, null, callback);
            }
            if (eventType === 'read') {
                return new Listener(this, property, callback, null);
            };
        }
    });
    pandora.extend(Observer, {
        create: undefined
    });
    pandora.ns('obj', {
        observe: observe,
        Observer: Observer
    });
    
});
//# sourceMappingURL=Observer.js.map