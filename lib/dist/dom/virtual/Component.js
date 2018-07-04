/*!
 * tanguage script compiled code
 *
 * Datetime: Wed, 04 Jul 2018 07:24:11 GMT
 */;
// tang.config({});
tang.init().block([
	'$_/dom/virtual/Element'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var virtual = pandora.ns('dom.virtual', {});
	var REPLACE = 0;
	var REORDER = 1;
	var PROPS = 2;
	var TEXT = 3;
	var doc = root.document;
	var _ανώνυμος_variable_1 = pandora.util.bool;
	var is = _ανώνυμος_variable_1.is, isFn = _ανώνυμος_variable_1.isFn, isStr = _ανώνυμος_variable_1.isStr;
	var patch = (function () {
		function setProps (node, props) {
			for (var key in props) {
				if (props[key] === void 666) {
					pandora.dom.removeAttr(node, key);
				}
				else {
					var value = props[key]
					pandora.dom.set(node, key, value);
				}
			};
		}
		function reorderChildren (node, moves) {
			var _arguments = arguments;
			var staticNodeList = pandora.obj.toArray(node.childNodes);
			var maps = {};
			pandora.each(staticNodeList, function (i, node) {
				if (node.nodeType === 1) {
					var key = node.getAttribute('key');
					if (key) {
						maps[key] = node;
					}
				};
			}, this);
			pandora.each(moves, function (i, move) {
				var index = move.index;
				if (move.type === 0) {
					if (staticNodeList[index] === node.childNodes[index]) {
						node.removeChild(node.childNodes[index]);
					}
					staticNodeList.splice(index, 1);
				}
				else if (move.type === 1) {
					var insertNode = maps[move.item.key] ? maps[move.item.key] : (typeof move.item === 'object') ? move.item.render():
					doc.createTextNode(move.item);
					staticNodeList.splice(index, 0, insertNode);
					node.insertBefore(insertNode, node.childNodes[index] || null);
				};
			}, this);
		}
		function applyPatches (node, currentPatches) {
			var _arguments = arguments;
			pandora.each(currentPatches, function (i, currentPatch) {
				switch (currentPatch.type) {
					case REPLACE:
					var newNode = (typeof currentPatch.node === 'String') ? doc.createTextNode(currentPatch.node): currentPatch.node.render();
					node.parentNode.replaceChild(newNode, node);
					break;
					case REORDER:
					reorderChildren(node, currentPatch.moves);
					break;
					case PROPS:
					setProps(node, currentPatch.props);
					break;
					case TEXT:
					if (node.textContent) {
						node.textContent = currentPatch.content;
					}
					else {
						node.nodeValue = currentPatch.content;
					}
					break;
					default:
					throw new Error('Unknow patch type ' + currentPatch.type);
				};
			}, this);
		}
		function dfsWalk (node, walker, patches) {
			var currentPatches = patches[walker.index];
			var len = node.childNodes ? node.childNodes.length : 0;
			for (var i = 0;i < len;i++) {
				var child = node.childNodes[i];
				walker.index++;
				dfsWalk(child, walker, patches);
			}
			if (currentPatches) {
				applyPatches(node, currentPatches);
			};
		}
		return function (node, patches, walker) {
			dfsWalk(node, walker, patches);
		}
	}());
	var diff = (function () {
		function dfsWalk (oldNode, newNode, index, patches) {
			var currentPatch = [];
			if (newNode === null) {}
			else if (isStr(oldNode) && isStr(newNode)) {
				if (newNode !== oldNode) {
					currentPatch.push({
						type: TEXT,
						content: newNode
					});
				}
			}
			else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
				var propsPatches = diffProps(oldNode, newNode);
				if (propsPatches) {
					currentPatch.push({
						type: PROPS,
						props: propsPatches
					});
				}
				if (!isIgnoreChildren(newNode)) {
					diffChildren(
						oldNode.children,
						newNode.children,
						index,
						patches,
						currentPatch);
				}
			}
			else {
				currentPatch.push({
					type: REPLACE,
					node: newNode
				});
			}
			if (currentPatch.length) {
				patches[index] = currentPatch;
			};
		}
		function diffChildren (oldChildren, newChildren, index, patches, currentPatch) {
			var _arguments = arguments;
			var diffs = pandora.arr.diff(oldChildren, newChildren, 'key');
			newChildren = diffs.children;
			if (diffs.moves.length) {
				var reorderPatch = {
					type: REORDER,
					moves: diffs.moves
				};
				currentPatch.push(reorderPatch);
			}
			var leftNode = null;
			var currentNodeIndex = index;
			pandora.each(oldChildren, function (i, child) {
				var newChild = newChildren[i];
				currentNodeIndex = (leftNode && leftNode.count) ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;
				dfsWalk(child, newChild, currentNodeIndex, patches);
				leftNode = child;
			}, this);
		}
		function diffProps (oldNode, newNode) {
			var count = 0;
			var oldProps = oldNode.props;
			var newProps = newNode.props;
			var key = void 0;var value = void 0;
			var propsPatches = {};
			for (key in oldProps) {
				value = oldProps[key];
				if (newProps[key] !== value) {
					count++;
					propsPatches[key] = newProps[key];
				}
			}
			for (key in newProps) {
				value = newProps[key];
				if (!oldProps.hasOwnProperty(key)) {
					count++;
					propsPatches[key] = newProps[key];
				}
			}
			if (count === 0) {
				return null;
			}
			return propsPatches;
		}
		function isIgnoreChildren (node) {
			return (node.props && node.props.hasOwnProperty('ignore'));
		}
		return function (oldTree, newTree) {
			var index = 0;
			var patches = {};
			dfsWalk(oldTree, newTree, index, patches);
			return patches;
		}
	}());
	function createVDom (vNode) {
		switch (typeof vNode) {
			case 'string':
			return new virtual.Element(vNode);
			case 'object':
			return new virtual.Element(vNode.tagName, vNode.props || {}, vNode.childs);
			default:
			return new virtual.Element('div');
		};
	}
	pandora.declareClass('dom.virtual.Component', {
		Element: undefined,
		vNode: undefined,
		_init: function (options) {
			if (options === void 0) { options = {};}
			if (options.vNode) {
				if (is(options.vNode, virtual.Element)) {
					this.vNode = options.vNode;
				}
				else {
					this.vNode = createVDom(options.vNode);
				}
			}
			else {
				this.vNode = new virtual.Element('div');
			}
			this.Element = this.vNode.render();
			if (options.context) {
				if (isFn(options.context.appendChild)) {
					this.appendTo(options.context);
				}
				else {
					doc.body.appendChild(this.Element);
				}
			};
		},
		appendTo: function (context) {
			context.appendChild(this.Element);
			return this;
		},
		diff: function (vNode) {
			var _vNode = createVDom(vNode);
			return diff(this.vNode, _vNode);
		},
		patch: function (vNode, walker) {
			if (walker === void 0) { walker = {index: 0 };}
			var _vNode = createVDom(vNode);
			var patches = diff(this.vNode, _vNode);
			patch(this.Element, patches, walker);
			this.vNode = _vNode;
			return patches;
		}
	});
	pandora.extend(pandora.dom.virtual.Component, {
		REPLACE: REPLACE,
		REORDER: REORDER,
		PROPS: PROPS,
		TEXT: TEXT
	});
	
	pandora('dom.virtual.patch', patch);
	pandora('dom.virtual.diff', diff);
});
//# sourceMappingURL=Component.js.map