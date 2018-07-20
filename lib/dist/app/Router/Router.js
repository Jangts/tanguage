/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 20 Jul 2018 16:00:38 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/app/',
    '$_/util/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var app = pandora.ns('app', {});
    var isFn = imports['$_/util/'] && imports['$_/util/']['isFn'];
    var replaceSpecialSymbols = /(\/|\.|\?)/g;
    var replaceSlashes = /[\\\/]+/g;
    var matchREST = replaceREST = /\/:[$_A-Za-z][\w_]*\//g;
    var matchQS = replaceQS = /\=:[$_A-Za-z][\w_]*(&|$)/g;
    var matchAsterisk = /[^\*:]+\/\*$/;
    var replaceAsterisk = /\/\*$/;
    var configurations = {};
    function formatPath (path) {
        return path.replace(replaceSlashes, '/').replace(/\/$/, '');
    }
    function getConfiguration (path) {
        var _arguments = arguments;
        path = formatPath(path);
        if(configurations[path]) return configurations[path];
        var match = void 0;
        if (match = path.match(matchREST)) {
            var params = ['$path'];
            var pattern = new RegExp('^' + path.replace(replaceREST, '/([^\/]+)/').replace(replaceSpecialSymbols, "\\$1").replace(replaceAsterisk, '\/.*') + '$');
            pandora.each(match, function (_index, element) {
                params.push(element.replace(/(\/|:)/g, ''));
            }, this);
            configurations[path] = {
                uid: path,
                type: 'pattern',
                params: params,
                pattern: pattern
            };
        }
        else if (match = path.match(matchQS)) {
            var params = ['$path'];
            var pattern = new RegExp('^' + path.replace(replaceQS, '/([^&]+)/').replace(replaceSpecialSymbols, "\\$1") + '$');
            pandora.each(match, function (_index, element) {
                params.push(element.replace(/(\/|:)/g, ''));
            }, this);
            configurations[path] = {
                uid: path,
                type: 'pattern',
                params: params,
                pattern: pattern
            };
        }
        else if (path.match(matchAsterisk)) {
            var pattern = new RegExp('^' + path.replace('*', '.*$').replace('/', '\/'));
            configurations[path] = {
                uid: path,
                type: 'pattern',
                params: ['$path'],
                pattern: pattern
            };
        }
        else {
            configurations[path] = {
                uid: path,
                type: 'path'
            };
        }
        return configurations[path];
    }
    var Route = pandora.declareClass({
        uid: undefined,
        type: 'path',
        events: [],
        _init: function (configuration) {
            pandora.extend(this, true, configuration);
            this.events = [];
        },
        oncall: function (callback, data) {
            if (isFn(callback)) {
                this.events.push({
                    callback: callback,
                    data: data
                });
            }
            return this;
        },
        call: function (path) {
            var _arguments = arguments;
            if (path === this.uid) {
                pandora.each(this.events, function (index, event) {
                    event.callback({
                        $path: path
                    }, event.data);
                }, this);
            };
        }
    });
    var PatternRoute = pandora.declareClass(Route, {
        pattern: undefined,
        params: [],
        call: function (path) {
            var _arguments = arguments;
            if (match = path.match(this.pattern)) {
                var args = {};
                for (var i = 0;i < match.length;i++) {
                    args[this.params[i]] = match[i];
                }
                pandora.each(this.callbacks, function (index, callback) {
                    callback(args);
                }, this);
            };
        }
    });
    function listen (path, data, callback) {
        if (!isFn(callback)) {
            if (isFn(data)) {
                callback = data;
                data = null;
            }
            else {
                return this;
            }
        }
        var route = void 0;var config = getConfiguration(path);
        if (config.type === 'pattern') {
            route = this.routes.pattern[config.uid] = this.routes.pattern[config.uid] || new PatternRoute(config);
        }
        else {
            route = this.routes.path[config.uid] = this.routes.path[config.uid] || new Route(config);
        }
        route.oncall(callback, null);
        return this;
    }
    var listend = false;
    routers = [];
    function fireEvents () {
        var _arguments = arguments;
        root.console.log('bar');
        pandora.each(routers, function (_index, router) {
            router.checkHash();
        }, this);
    }
    function bindEvents () {
        root.console.log('foo');
        root.addEventListener('load', fireEvents, false);
        root.addEventListener('hashchange', fireEvents, false);
    }
    pandora.declareClass('app.Router', {
        currentURL: undefined,
        routes: {},
        _init: function (routes) {
            var _arguments = arguments;
            routers.push(this);
            this.routes = {
                path:  {},
                pattern:  {}
            };
            if (routes) {
                pandora.each(routes, function (path, callback) {
                    this.listen(path, callback);
                }, this);
            }
            if (!listend) {
                listend = true;
                bindEvents();
            };
        },
        listen: listen,
        reg: listen,
        checkHash: function (reload) {
            if (reload === void 0) { reload = false;}
            var newURL = formatPath(location.hash.slice(1) || '/index');
            if (newURL === this.currentURL) {
                if (reload) {
                    this.call(this.currentURL, true);
                }
            }
            else {
                this.currentURL = newURL;
                this.call(this.currentURL, true);
            };
        },
        pushHash: function () {},
        changeHash: function () {},
        call: function (path, ignoreFormat) {
            var _arguments = arguments;
            if(!ignoreFormat) path = formatPath(path);
            if (this.routes.path[path]) {
                this.routes.path[path].call(path);
            }
            pandora.each(this.routes.pattern, function (id, route) {
                route.call(path);
            }, this);
        }
    });
    module.exports = app.Router;
});
//# sourceMappingURL=Router.js.map