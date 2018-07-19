/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 19 Jul 2018 02:41:40 GMT
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
    function getConfiguration (path) {
        var _arguments = arguments;
        path = path.replace(replaceSlashes, '/');
        var match = void 0;
        if (match = path.match(matchREST)) {
            var params = ['$path'];
            var pattern = new RegExp('^' + path.replace(replaceREST, '/([^\/]+)/').replace(replaceSpecialSymbols, "\\$1").replace(replaceAsterisk, '\/.*') + '$');
            pandora.each(match, function (_index, element) {
                params.push(element.replace(/(\/|:)/g, ''));
            }, this);
            return {
                uid: path,
                type: 'pattern',
                params: params,
                pattern: pattern
            };
        }
        else if (match = path.match(matchQS)) {
            var params_4 = ['$path'];
            var pattern_4 = new RegExp('^' + path.replace(replaceQS, '/([^&]+)/').replace(replaceSpecialSymbols, "\\$1") + '$');
            pandora.each(match, function (_index, element) {
                params.push(element.replace(/(\/|:)/g, ''));
            }, this);
            return {
                uid: path,
                type: 'pattern',
                params: params_4,
                pattern: pattern_4
            };
        }
        else if (path.match(matchAsterisk)) {
            var pattern_6 = new RegExp('^' + path.replace('*', '.*$').replace('/', '\/'));
            return {
                uid: path,
                type: 'pattern',
                params: ['$path'],
                pattern: pattern_6
            };
        }
        else {
            return {
                uid: path,
                type: 'path'
            };
        };
    }
    var Route = pandora.declareClass({
        uid: undefined,
        type: 'path',
        callbacks: [],
        _init: function (configuration) {
            _.extend(this, true, configuration);
            this.callbacks = [];
        },
        oncall: function (callback) {
            if (isFn(callback)) {
                this.callbacks.push();
            }
            return this;
        },
        call: function (path) {
            var _arguments = arguments;
            if (path === this.uid) {
                pandora.each(this.callbacks, function (index, callback) {
                    callback({
                        $path: path
                    });
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
                    args_16[this.params[i]] = match[i];
                }
                pandora.each(this.callbacks, function (index, callback) {
                    callback(args);
                }, this);
            };
        }
    });
    function listen (path, callback) {
        var route = void 0;var config = getConfiguration(path);
        if (config.type === 'pattern') {
            route = this.routes.pattern[config.uid] || new PatternRoute(config);
        }
        else {
            route = this.routes.path[config.uid] || new Route(config);
        }
        route.oncall(callback);
        return this;
    }
    pandora.declareClass('app.Router', {
        currentURL: undefined,
        routes: {},
        _init: function (routes) {
            this.routes = {
                path:  {},
                pattern:  {}
            };
        },
        listen: listen,
        reg: listen,
        refresh: function (reload) {
            if (reload === void 0) { reload = false;}
            var newURL = location.hash.slice(1) || '/index';
            if (newURL === this.currentURL) {
                if (reload) {
                    this.routes[this.currentURL]();
                }
            }
            else {
                this.currentURL = newURL;
                this.routes[this.currentURL]();
            };
        },
        call: function (path) {
            var _arguments = arguments;
            if (this.routes.path[path]) {
                this.routes.path[path].call(path);
            }
            pandora.each(this.routes.pattern, function (id, route) {
                route.call(path);
            }, this);
        },
        bindEvents: function () {
            root.addEventListener('load', this.refresh.bind(this), false);
            root.addEventListener('hashchange', this.refresh.bind(this), false);
        }
    });
    
});
//# sourceMappingURL=Router.js.map