/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 31 Jul 2018 16:35:33 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/obj/',
    '$_/util/',
    '$_/dom/',
    '$_/data/Request'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var Request = imports['$_/data/request'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console, location = root.location, FormData = root.FormData;
    var query = _.dom.sizzle || _.dom.selector;
    var sqlengine = {
        parse: function (json, ops) {
            var o = {
                fields: ["*"],
                from: "json",
                where: "",
                orderby: [],
                order: "asc",
                limit: []
            };
            for (i in ops)o[i] = ops[i];
            var result = [];
            result = sqlengine.returnFilter(json, o);
            result = sqlengine.returnOrderBy(result, o.orderby, o.order);
            result = sqlengine.returnLimit(result, o.limit);
            return result;
        },
        returnFilter: function (json, jsonsql_o) {
            var jsonsql_scope = eval(jsonsql_o.from);
            var jsonsql_result = [];
            var jsonsql_rc = 0;
            if(jsonsql_o.where == "") jsonsql_o.where = "true";
            for (var jsonsql_i in jsonsql_scope) {
                with (jsonsql_scope[jsonsql_i]) {
                    if (eval(jsonsql_o.where)) {
                        jsonsql_result[jsonsql_rc++] = sqlengine.returnFields(jsonsql_scope[jsonsql_i], jsonsql_o.fields);
                    }
                }
            }
            return jsonsql_result;
        },
        returnFields: function (scope, fields) {
            if(fields.length == 0) fields = ["*"];
            if(fields[0] == "*") return scope;
            var returnobj = {};
            for(var i in fields);
            returnobj[fields[i]] = scope[fields[i]];
            return returnobj;
        },
        returnOrderBy: function (result, orderby, order) {
            if(orderby.length == 0) return result;
            result.sort(function (a, b) {
                switch (order.toLowerCase()) {
                    case "desc":
                    return (eval('a.' + orderby[0] + ' < b.' + orderby[0])) ? 1 :  -1;
                    case "asc":
                    return (eval('a.' + orderby[0] + ' > b.' + orderby[0])) ? 1 :  -1;
                    case "descnum":
                    return (eval('a.' + orderby[0] + ' - b.' + orderby[0]));
                    case "ascnum":
                    return (eval('b.' + orderby[0] + ' - a.' + orderby[0]));
                };
            });
            return result;
        },
        returnLimit: function (result, limit) {
            switch (limit.length) {
                case 0:
                return result;
                case 1:
                return result.splice(0, limit[0]);
                case 2:
                return result.splice(limit[0] - 1, limit[1]);
            };
        }
    };
    pandora.ns('data', {
        encodeJSON: function (data) {
            try {
                return JSON.stringify(data);
            }
            catch (error) {
                console.log(error, data);
                return '';
            };
        },
        decodeJSON: function (txt) {
            try {
                return JSON.parse(txt);
            }
            catch (error) {
                console.log(error, text);
                return false;
            };
        },
        queryJSON: function (sql, json) {
            var returnfields = sql.match(/^(select)\s+([a-z0-9_\,\.\s\*]+)\s+from\s+([a-z0-9_\.]+)(?: where\s+\((.+)\))?\s*(?:order\sby\s+([a-z0-9_\,]+))?\s*(asc|desc|ascnum|descnum)?\s*(?:limit\s+([0-9_\,]+))?/i);
            var ops = {
                fields: returnfields[2].replace(' ', '').split(','),
                from: returnfields[3].replace(' ', ''),
                where: (returnfields[4] == undefined) ? "true": returnfields[4],
                orderby: (returnfields[5] == undefined) ? []: returnfields[5].replace(' ', '').split(','),
                order: (returnfields[6] == undefined) ? "asc": returnfields[6],
                limit: (returnfields[7] == undefined) ? []: returnfields[7].replace(' ', '').split(',')
            };
            return sqlengine.parse(json, ops);
        },
        reBuildUrl: function (url, data) {
            if (typeof url === 'object') {
                data = url;
                url = location.href;
            }
            if (url.indexOf('?') !==  -1) {
                return url + "&" + _.obj.toQueryString(data);
            }
            return url + "?" + _.obj.toQueryString(data);
        },
        cookie: function (name, value, prop) {
            var c = doc.cookie;
            var ret = null;
            if (arguments.length == 1) {
                if (c && c !== '') {
                    var cookies = c.split(';');
                    for (var i = 0, l = cookies.length;i < l;i++) {
                        var cookie = JY.trim(cookies[i]);
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            ret = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
            }
            else {
                prop = prop || {}
                var expires = '';
                if (prop.expires) {
                    var date = void 0;
                    switch (prop.expires.constructor) {
                        case Number:
                        {
                            date = new Date();
                            date.setTime(date.getTime() + (prop.expires * 1000 * 60 * 60 * 24));
                            date = date.toUTCString();
                        }
                        break;
                        case String:
                        {
                            date = prop.expires;
                        }
                        break;
                        default:
                        {
                            date = prop.expires.toUTCString();
                        }
                        break;
                    }
                    expires = '; expires=' + date;
                }
                var path = prop.path ? '; path=' + (prop.path):'';
                var domain = prop.domain ? '; domain=' + (prop.domain):'';
                var secure = prop.secure ? '; secure': '';
                doc.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            }
            return ret;
        },
        loadCSS: function (href, callback) {
            var link = query('link[href="' + href + '"]')[0] || _.dom.create('link', doc.getElementsByTagName('head')[0], {
                type: 'text/css',
                rel: 'stylesheet',
                async: 'async'
            });
            if (!_.dom.getAttr(link, 'href')) {
                link.href = href;
            }
            if (_.dom.getAttr(link, 'loaded') === 'loaded') {
                setTimeout(function () {
                    _.util.isFn(callback) && callback();
                }, 0);
            }
            else {
                if (typeof(link.onreadystatechange) === 'object') {
                    link.attachEvent('onreadystatechange', function () {
                        if (link.readyState === 'loaded' || link.readyState === 'complete') {
                            _.dom.setAttr(link, 'loaded', 'loaded');
                            _.util.isFn(callback) && callback();
                        }
                        else {
                            console.log(link.readyState);
                        };
                    });
                }
                else if (typeof(link.onload) !== 'undefined') {
                    link.addEventListener('load', function () {
                        _.dom.setAttr(link, 'loaded', 'loaded');
                        _.util.isFn(callback) && callback();
                    });
                };
            };
        },
        loadScript: function (src, callback) {
            var script = query('script[src="' + src + '"]')[0] || _.dom.create('script', doc.getElementsByTagName('head')[0], {
                type: 'application/javascript',
                async: 'async'
            });
            if (!_.dom.getAttr(script, 'src')) {
                script.src = src;
            }
            if (_.dom.getAttr(script, 'loaded')) {
                _.util.isFn(callback) && callback();
            }
            else {
                if (typeof(script.onreadystatechange) === 'object') {
                    script.attachEvent('onreadystatechange', function () {
                        if (script.readyState === 'loaded' || script.readyState === 'complete') {
                            _.dom.setAttr(script, 'loaded', 'loaded');
                            _.util.isFn(callback) && callback();
                        };
                    });
                }
                else if (typeof(script.onload) === 'object') {
                    script.addEventListener('load', function () {
                        _.dom.setAttr(script, 'loaded', '');
                        _.util.isFn(callback) && callback();
                    });
                };
            };
        },
        ajax: function (url, options) {
            switch (arguments.length) {
                case 2:
                if (!_.util.isObj(options)) {
                    if (_.util.isFn(options)) {
                        options = {
                            success: options
                        };
                    }
                    else {
                        options = {};
                    }
                }
                if (_.util.isStr(url)) {
                    options.url = url;
                }
                break;
                case 1:
                if (_.util.isObj(url)) {
                    options = url;
                }
                else if (_.util.isStr(url)) {
                    options = {
                        url: url,
                        method: 'GET'
                    };
                };
                break;
                case 0:
                options = {
                    url: location.href,
                    method: 'GET'
                };
                break;
                default:
                return undefined;
            }
            if (!options.method) {
                if ((typeof options.data === 'object') || (typeof options.data === 'string')) {
                    options.method = 'POST';
                }
                else {
                    options.method = 'GET';
                    options.data = undefined;
                }
            }
            if (options.data && (options.method.toUpperCase() === 'GET')) {
                if (typeof options.data == 'object') {
                    options.data = _.obj.toQueryString(options.data);
                }
                if (typeof options.data == 'string') {
                    if (options.url.indexOf('?') !==  -1) {
                        options.url = options.url + "&" + options.data;
                    }
                    else {
                        options.url = options.url + "?" + options.data;
                    }
                }
                options.data = undefined;
            }
            var promise = new Request(options);
            promise.success = promise.done;
            promise.error = promise.fail;
            promise.complete = promise.always;
            if (options.beforeSend && typeof options.beforeSend == 'function') {
                options.beforeSend(promise.xmlhttp);
            }
            promise.progress(options.progress).success(options.success).error(options.fail).complete(options.complete);
            if (!options.charset) {
                options.charset = 'UTF-8';
            }
            if (options.data) {
                if (typeof options.data == 'object') {
                    if (!options.mime) {
                        options.mime = 'multipart/form-data';
                    }
                    if (!_.util.isForm(options.data)) {
                        if (options.mime === 'application/json') {
                            return promise.setRequestHeader('Content-Type', 'application/json; charset=' + options.charset).send(JSON.stringify(options.data));
                        }
                        var formData = new FormData();
                        for (var i in options.data) {
                            formData.append(i, options.data[i]);
                        }
                        options.data = formData;
                    }
                    return promise.send(options.data);
                }
                if (typeof options.data == 'string') {
                    if (!options.mime) {
                        options.mime = 'application/x-www-form-urlencoded';
                    }
                    return promise.setRequestHeader('Content-Type', options.mime + '; charset=' + options.charset).send(options.data);
                }
            }
            else {
                promise.setRequestHeader('Content-Type', 'text/html; charset=' + options.charset).send();
            };
        },
        json: function (url, doneCallback, failCallback) {
            _.data.ajax({
                url: url,
                success: function (txt) {
                    doneCallback(JSON.parse(txt));
                },
                fail: failCallback
            });
        }
    });
    this.module.exports = pandora.data;
});
//# sourceMappingURL=data.js.map