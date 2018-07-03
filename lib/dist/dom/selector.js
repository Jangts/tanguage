/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 03 Jul 2018 08:25:15 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/str/',
	'$_/arr/',
	'$_/obj/'
], function (pandora, root, imports, undefined) {
	var doc = root.document;
	var idExpr = /^([\w-]+)?#([\w-]+)/;
	var classExpr = /^([\w-]+)?\.([\w-]+)/;
	var attrExpr = /^([\w-]+)?\[([\w-]+)([|*~\$!]*)(?:=(?:['"]?)(\w+)(?:['"]?))?\]/;
	var gtExpr = /^([\w-#.]+)(?:\s*)(\>)(?:\s*)([\w#.-]+)/;
	var onlyIdExpr = /^#[\w-_]*$/i;
	var onlyNameExpr = /^@[\w-_]+$/i;
	function selector (selector, context) {
		var _arguments = arguments;
		context = context || document;
		var result = [];
		if (onlyIdExpr.test(selector)) {
			selector = selector.replace(/#/, "");
			var elem = doc.getElementById(selector);
			if (elem) {
				if (context == document || hasChildNode(context, elem)) {
					return [elem];
				}
			}
			return [];
		}
		if (onlyNameExpr.test(selector)) {
			selector = selector.replace(/@/, "");
			return context.getElementsByName(selector);
		}
		if (doc.querySelectorAll) {
			context = context.querySelectorAll ? context : document;
			if (selector.match(/\[[\w-]+=("|')[^\1]*\1[^\]]*\1\]/g)) {
				return [];
			}
			selector = selector.replace(/\[[\w-]+=[^'"=\]]+\]/g, function (attr) {
				return attr.replace("=", '="').replace("]", '"]');
			}).replace(/\[+/, '[').replace(/\]+/, ']');
			result = context.querySelectorAll(selector);
		}
		else {
			pandora.each(selector.split(','), function (_index, s) {
				result = result.concat(filters(s, context));
			}, this);
			result = pandora.arr.unique(result);
		}
		return result;
	}
	function filters (selector, context) {
		var _arguments = arguments;
		var result = [];
		var splits = selector.match(gtExpr);
		if (splits) {
			return childFilters(splits, context);
		}
		splits = selector.split(/\s+/);
		var ps = find(splits[0], context);
		if (!splits[1]) {
			return ps;
		}
		pandora.each(ps, function (_index, elem) {
			result = result.concat(find(splits[1], elem));
		}, this);
		return result;
	}
	function childFilters (splits, context) {
		var _arguments = arguments;
		var result = [];
		pandora.each(find(splits[1]), function (_index, context) {
			pandora.each(context.childNodes, function (_index, child) {(child.nodeType == 1 && (child.tagName == splits[3].toUpperCase() || "#" + child.id == splits[3] || pandora.str.has(child.className, splits[3].replace('.', '')))) && result.push(child);
			}, this);
		}, this);
		return result;
	}
	function find (selector, context) {
		var result = [];
		var className = selector.match(classExpr);
		var id = !className && selector.match(idExpr);
		var attr = !id && selector.match(attrExpr);
		if (id) {
			var elem = byId(id[2], context, id[1]);
			if (elem) {
				result.push(elem);
			}
		}
		else if (className) {
			result = byClass(className[2], context, className[1]);
		}
		else if (attr) {
			result = byAttr(attr[2], attr[4], context, attr[1], attr[3]);
		}
		else {
			result = byTagName(selector, context);
		}
		return pandora.uitl.obj.toArray(result);
	}
	function byId (id, context, tagName) {
		context = context || document;
		var elem = doc.getElementById(id);
		if (tagName && elem && elem.tagName != tagName.toUpperCase()) {
			return undefined;
		}
		if (!hasChildNode(context, elem)) {
			return undefined;
		}
		return elem;
	}
	function hasChildNode (elem, node) {
		if (node && elem) {
			node = node.parentNode;
			while (node != undefined && node != null) {
				if (node === elem) {
					return true;
				}
				node = node.parentNode;
			}
		}
		return false;
	}
	function byClass (className, context, tagName) {
		context = context || document;
		if (doc.getElementsByClassName && !tagName) {
			return context.getElementsByClassName(className);
		}
		if (doc.querySelectorAll) {
			return context.querySelectorAll((tagName || "") + "." + className);
		}
		return byAttr("class", className, context, tagName, '~');
	}
	function byAttr (name, val, context, tagName, sign) {
		var _arguments = arguments;
		name = name == 'class' && 'className';
		var result = [];
		var vl = val ? val.length : 0;
		var vi = !val ?  -1 : (!sign ? 0:' |*~$!'.indexOf(sign));
		pandora.each(byTagName(tagName,context), function (_index, elem) {
			var v = elem[name] || elem.getAttribute(name);
			if (elem.nodeType == 1 && v) {
				var exprs = [true, v == val, v.substr(0, vl) == val, v.indexOf(val) >  -1, pandora.str.has(v, val), v.substr(v.length - vl) == val, v != val];
				if(exprs[vi + 1]) result.push(elem);
			};
		}, this);
		return result;
	}
	function byTagName (tagName, context) {
		tagName = tagName || "*";
		context = context || document;
		return context.getElementsByTagName(tagName);
	}
	function byAttrsObject (Attrs, context) {
		var str = '';
		if(Attrs.tagName) str = Attrs.tagName;
		if(Attrs.id) str += '#' + Attrs.id;
		if (Attrs.className) {
			if (typeof(Attrs.className) == 'string') {
				str += '.' + Attrs.className;
			}
			else if (pandora.util.type(Attrs.className) == 'Array') {
				for (var i in Attrs.className) {
					str += '.' + Attrs.className[i];
				}
			};
		}
		if(Attrs.name) str += '[name=' + Attrs.name + ']';
		for (var i in Attrs) {
			if (i != 'tagName' && i != 'id' && i != 'className' && i != 'name') {
				str += '[' + i + '=' + Attrs[i] + ']';
			}
		}
		return selector(str, context);
	}
	pandora.ns('dom', {
		selector: selector,
		hasChildNode: hasChildNode,
		hasParentNode: function (elem, node) {
			return hasChildNode(node, elem);
		}
	});
	pandora.ns('dom.selector', {
		byId: byId,
		byAttr: byAttrsObject,
		byTag: byTagName,
		byClass: byClass
	});
	pandora.extend(pandora, {
		byId: byId,
		byCn: byClass,
		selector: pandora.dom.sizzle || query
	});
	
}, true);
//# sourceMappingURL=selector.js.map