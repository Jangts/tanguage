/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 10:48:48 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/util/Promise'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var data = pandora.ns('data', {});
    var Promise = imports['$_/util/promise'];
    var _ = pandora;
    var console = root.console, location = root.location, XMLHttpRequest = root.XMLHttpRequest, ActiveXObject = root.ActiveXObject, FormData = root.FormData;
    pandora.declareClass('data.Request', Promise, {
        readyState: 0,
        statusCode: 0,
        statusText: '',
        _init: function (options) {
            options = options || {}
            var strReg = /^((https:|http:)?\/\/){1}/;
            var url = options.url || location.href;
            var domain = void 0;
            if (strReg.test(url)) {
                domain = url.replace(strReg, '').split('/')[0];
            }
            else {
                domain = url.split('/')[0].indexOf(':') > 0 ? url.split('/')[0]: location.host;
            }
            this.PromiseStatus = 'pending';
            if (location.host) {
                if (domain === location.host) {
                    var method = options.method && _.util.isHttpMethod(options.method) || 'GET';
                    var async = options.async || true;
                    this.url = url;
                    this.xmlhttp = XMLHttpRequest ? new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
                    this.xmlhttp.open(method, url, async);
                    this.readyState = 1;
                }
                else {
                    this.readyState = 0;
                    this.PromiseValue = 'tanguageXHR Unable to perform cross domain operation.';
                }
            }
            else {
                _.error('tanguageXHR Unable to perform local file operation.');
            }
            this.handlers = {
                always: [],
                done: [],
                fail: [],
                progress: []
            };
        },
        setRequestHeader: function (name, value) {
            this.xmlhttp && this.xmlhttp.setRequestHeader(name, value);
            return this;
        },
        send: function (data) {
            if (this.xmlhttp) {
                this.responseHeaders = {};
                var Promise = this;
                this.xmlhttp.onreadystatechange = function () {
                    Promise.readyState = this.readyState;
                    if (this.readyState < 3) {
                        Promise.PromiseValue = 'pending';
                    }
                    else if (this.readyState == 3) {
                        var headers = this.getAllResponseHeaders().split("\n");
                        var header = void 0;
                        for (var i in headers) {
                            if (headers[i]) {
                                header = headers[i].split(': ');
                                Promise.responseHeaders[header.shift()] = header.join(': ').trim();
                            }
                        }
                    }
                    else if (this.readyState == 4) {
                        Promise.statusText = this.statusText;
                        Promise.statusCode = this.status;
                        if ((this.status >= 200 && this.status < 300) || this.status == 304) {
                            Promise.PromiseStatus = 'resolved';
                        }
                        else {
                            Promise.PromiseStatus = 'rejected';
                        }
                        Promise.PromiseValue = this.responseText;
                    }
                    Promise.listener();
                }
                this.xmlhttp.onerror = function () {}
                this.xmlhttp.send(data);
                delete this.xmlhttp;
            }
            else {
                this.PromiseStatus = 'rejected';
                this.listener();
            }
            return this;
        },
        getAllResponseHeaders: function () {
            var result = this.responseHeaders ? '': null;
            for (var key in this.responseHeaders) {
                result += key + ' : ' + this.responseHeaders[key] + ' \n';
            }
            return result;
        },
        getResponseHeader: function (key) {
            return this.responseHeaders ? this.responseHeaders[key]: null;
        },
        progress: function (progressCallbacks) {
            for (var i in arguments) {
                typeof arguments[i] == 'function' && this.handlers.progress.push(arguments[i]);
            }
            this.listener();
            return this;
        },
        done: function (doneCallbacks) {
            for (var i in arguments) {
                typeof arguments[i] == 'function' && this.handlers.done.push(arguments[i]);
            }
            this.listener();
            return this;
        },
        fail: function (doneCallbacks) {
            for (var i in arguments) {
                typeof arguments[i] == 'function' && this.handlers.fail.push(arguments[i]);
            }
            this.listener();
            return this;
        },
        always: function (alwaysCallbacks) {
            for (var i in arguments) {
                typeof arguments[i] == 'function' && this.handlers.always.push(arguments[i]);
            }
            this.listener();
            return this;
        },
        reSetUrl: function (url) {
            this._init({
                url: url
            });
            return this;
        }
    });
    this.module.exports = data.Request;
});
//# sourceMappingURL=Request.js.map