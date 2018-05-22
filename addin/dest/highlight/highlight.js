/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 22 May 2018 02:31:30 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/util/bool',
	'$_/util/type',
	'$_/dom/'
], function (pandora, root, imports, undefined) {
	var _ = pandora;
	var query = _.dom.sizzle || _.dom.selector;
	var doc = global.document;
	var console = global.console, location = global.location;global;
	var uniqueId = 0;
	var Token = declare({
		_init: function (type, content, alias, matchedStr, greedy) {
			this.type = type;
			this.content = content;
			this.alias = alias;
			this.matchedStr = matchedStr || null;
			this.greedy = !!greedy;
		}
	});
	Token.stringify = function (o, language, parent) {
		if (_.util.bool.isStr(o)) {
			return o;
		}
		if (_.util.type.Obj.native(o) === 'Array') {
			return o.map(function (element) {
				return Token.stringify(element, language, o);
			}).join('');
		}
		var env = {
			type: o.type,
			content: Token.stringify(o.content, language, parent),
			tag: 'span',
			classes: ['ib-hl', o.type],
			attributes:  {},
			language: language,
			parent: parent
		};
		if (env.type == 'comment') {
			env.attributes['spellcheck'] = 'true';
		}
		if (o.alias) {
			var aliases = _.util.type.Obj.native(o.alias) === 'Array' ? o.alias : [o.alias];
			Array.prototype.push.apply(env.classes, aliases);
		}
		_.highlight.hooks.run('wrap', env);
		var attributes = '';
		_.each(env.attributes, function (name) {
			attributes += (attributes ? ' ':'') + name + '="' + (env.attributes[name] || '') + '"';
		});
		return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';
	};
	_('highlight', {
		util: {
			encode: function (tokens) {
				if (tokens instanceof Token) {
					return new Token(tokens.type, _.highlight.util.encode(tokens.content), tokens.alias);
				}
				if (_.util.type.Obj.native(tokens) === 'Array') {
					return tokens.map(_.highlight.util.encode);
				}
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			},
			objId: function (obj) {
				if (!obj['__id']) {
					Object.defineProperty(obj, '__id', {
						value: ++uniqueId
					});
				}
				return obj['__id'];
			}
		},
		languages: {
			extend: function (id, redef) {
				var lang = _.copy(_.highlight.languages[id]);
				_.each(redef, function (key, val) {
					lang[key] = val;
				});
				return lang;
			},
			insertBefore: function (inside, before, insert, root) {
				root_17 = root_17 || _.highlight.languages;
				var grammar = root_17[inside];
				if (arguments.length == 2) {
					insert = arguments[1];
					_.each(insert, function (newToken, val) {
						if (insert.hasOwnProperty(newToken)) {
							grammar[newToken] = val;
						};
					});
					return grammar;
				}
				var ret = {};
				_.each(grammar, function (token) {
					if (grammar.hasOwnProperty(token)) {
						if (token == before) {
							_.each(insert, function (newToken, val) {
								if (insert.hasOwnProperty(newToken)) {
									ret[newToken] = val;
								};
							});
						}
						ret[token] = grammar[token];
					};
				});
				_.highlight.languages.DFS(_.highlight.languages, function (key, value) {
					if (value === root[inside] && key != inside) {
						this[key] = ret;
					};
				});
				return root_17[inside] = ret;
			},
			DFS: function (o, callback, type, visited) {
				visited = visited || {}
				for (var i in o) {
					if (o.hasOwnProperty(i)) {
						callback.call(o, i, o[i], type || i);
						if (_.util.type.Obj.native(o[i]) === 'Object'&& !visited[_.highlight.objId(o[i])]) {
							visited[_.highlight.objId(o[i])] = true;
							_.highlight.languages.DFS(o[i], callback, null, visited);
						}
						else if (_.util.type.Obj.native(o[i]) === 'Array'&& !visited[_.highlight.objId(o[i])]) {
							visited[_.highlight.objId(o[i])] = true;
							_.highlight.languages.DFS(o[i], callback, i, visited);
						};
					}
				};
			}
		},
		plugins:  {},
		renderAll: function (callback) {
			var env = {
				callback: callback,
				selector: 'code[data-language], [data-language] code, code[data-lang], [data-lang] code'
			};
			_.highlight.hooks.run("before-highlightall", env);
			var elements = env.elements || query(env.selector);
			for (var i = 0, element = void 0;element = elements[i++];) {
				_.highlight.renderElement(element, env.callback);
			};
		},
		renderElement: function (element, callback) {
			var language = void 0;var grammar = void 0;var parent = element;
			while (parent && parent.hasAttribute && !(parent.hasAttribute('data-language') || parent.hasAttribute('data-lang'))) {
				parent = parent.parentNode;
			}
			if (parent) {
				language = _.dom.getData(parent, 'language') || _.dom.getData(parent, 'lang') || '';
				grammar = _.highlight.languages[language];
			}
			_.dom.setData(element, 'language', language);
			parent = element.parentNode;
			if (parent && /pre/i.test(parent.nodeName)) {
				_.dom.setData(parent, 'language', language);
			}
			var code = element.textContent;
			var env = {
				element: element,
				language: language,
				grammar: grammar,
				code: code
			};
			if (!code || !grammar) {
				_.highlight.hooks.run('complete', env);
				return;;
			}
			_.highlight.hooks.run('before-highlight', env);
			env.highlightedCode = _.highlight.highlight(env.code, env.grammar, env.language);
			_.highlight.hooks.run('before-insert', env);
			env.element.innerHTML = env.highlightedCode;(typeof callback === 'function') && callback.call(element);
			_.highlight.hooks.run('after-highlight', env);
			_.highlight.hooks.run('complete', env);
		},
		render: function (element, callback) {
			if (_.util.type(element) === 'Element') {
				_.highlight.renderElement(element, callback);
			}
			else {
				_.highlight.renderAll(element);
			};
		},
		highlight: function (text, grammar, language) {
			var tokens = _.highlight.tokenize(text, grammar);
			return Token.stringify(_.highlight.util.encode(tokens), language);
		},
		tokenize: function (text, grammar, language) {
			var _Token = Token;
			var strarr = [text];
			var rest = grammar.rest;
			if (rest) {
				for (var token in rest) {
					grammar[token] = rest[token];
				}
				delete grammar.rest;
			}
			tokenloop:
			for (var token in grammar) {
				if (!grammar.hasOwnProperty(token)|| !grammar[token]) {
					continue;;
				}
				var patterns = grammar[token];
				patterns = (_.util.type.Obj.native(patterns) === "Array") ? patterns : [patterns];
				for (var j = 0;j < patterns.length;++j) {
					var pattern = patterns[j];
					var inside = pattern.inside;
					var lookbehind = !!pattern.lookbehind;
					var greedy = !!pattern.greedy;
					var lookbehindLength = 0;
					var alias = pattern.alias;
					pattern = pattern.pattern || pattern;
					for (var i = 0;i < strarr.length;i++) {
						var str = strarr[i];
						if (strarr.length > text.length) {
							break;;
							tokenloop;
						}
						if (str instanceof _Token) {
							continue;;
						}
						pattern.lastIndex = 0;
						var match = pattern.exec(str);
						var delNum = 1;
						if (!match && greedy && i != strarr.length - 1) {
							var nextToken = strarr[i + 1].matchedStr || strarr[i + 1];
							var combStr = str + nextToken;
							if (i < strarr.length - 2) {
								combStr += strarr[i + 2].matchedStr || strarr[i + 2];
							}
							pattern.lastIndex = 0;
							match = pattern.exec(combStr);
							if (!match) {
								continue;;
							}
							var from = match.index + (lookbehind ? match[1].length:0);
							if (from >= str.length) {
								continue;;
							}
							var to = match.index + match[0].length;
							var len = str.length + nextToken.length;
							delNum = 3;
							if (to <= len) {
								if (strarr[i + 1].greedy) {
									continue;;
								}
								delNum = 2;
								combStr = combStr.slice(0, len);
							}
							str = combStr;
						}
						if (!match) {
							continue;;
						}
						if (lookbehind) {
							lookbehindLength = match[1].length;
						}
						var from = match.index + lookbehindLength;
						var match = match[0].slice(lookbehindLength);
						var to = from + match.length;
						var before = str.slice(0, from);
						var after = str.slice(to);
						var args = [i, delNum];
						if (before) {
							args.push(before);
						}
						var wrapped = new _Token(token, inside ? _.highlight.tokenize(match, inside): match, alias, match, greedy);
						args.push(wrapped);
						if (after) {
							args.push(after);
						}
						Array.prototype.splice.apply(strarr, args);
					}
				}
			}
			return strarr;
		},
		hooks: {
			all:  {},
			add: function (name, callback) {
				var hooks = _.highlight.hooks.all;
				hooks[name] = hooks[name] || [];
				hooks[name].push(callback);
			},
			run: function (name, env) {
				var callbacks = _.highlight.hooks.all[name];
				if (!callbacks || !callbacks.length) {
					return;;
				}
				for (var i = 0, callback = void 0;callback = callbacks[i++];) {
					callback(env);
				};
			}
		}
	});
}, true);
//# sourceMappingURL=highlight.js.map