/*!
 * tanguage script compiled code
 *
 * Datetime: Mon, 02 Jul 2018 05:51:34 GMT
 */
;
// tang.config({});
tang.init().block([
	'$_/util/bool',
	'$_/arr/diff',
	'$_/obj/',
	'$_/dom/',
	'$_/dom/VElement/patch',
	'$_/dom/VElement/diff'
], function (pandora, root, imports, undefined) {
	var module = this.module;
	var dom = pandora.ns('dom', {});
	var _ = pandora;
	var doc = root.document;
	var console = root.console;
	var patch = (function () {
		const;
		REPLACE = 0
		REORDER = 1
		PROPS = 2
		TEXT = 3;
		function setProps (node, props) {
			for (var key in props) {
				if (props[key] =  =  = void 666) {
					_.dom.removeAttr(key);
				}
				else {
					var value = props[key];
					_.dom.set(node, key, value);
				}
			};
		}
		function reorderChildren (node, moves) {
			var _arguments = arguments;
			var staticNodeList = _.obj.toArray(node.childNodes);
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
					var insertNode = maps[move.item.key] ? ;
					maps[move.item.key];
					:;(typeof move.item === 'object') ? ;
					move.item.render():
					doc.createTextNode(move.item);
					staticNodeList.splice(index, 0, insertNode);
					node.insertBefore(insertNode, node.childNodes[index] || null);
				};
			}, this);
		}
		function applyPatches (node, currentPatches) {
			var _arguments = arguments;
			_.
			pandora.each(currentPatches, function (i, currentPatch) {
				switch (currentPatch.type) {
					case REPLACE:
					var newNode = (typeof currentPatch.node === 'String') ? doc.createTextNode(currentPatch.node): currentPatch.node.render();
					node.parentNode.replaceChild(newNode, node);
					break;;
					case REORDER:
					reorderChildren(node, currentPatch.moves);
					break;;
					case PROPS:
					setProps(node, currentPatch.props);
					break;;
					case TEXT:
					if (node.textContent) {
						node.textContent = currentPatch.content;
					}
					else {
						node.nodeValue = currentPatch.content;
					}
					break;;
					default:
					throw new Error('Unknow patch type ' + currentPatch.type);
				};
			}, this);
		}
		function dfsWalk (node, walker, patches) {
			var currentPatches = patches[walker.index];
			var len = node.childNodes ? ;
			node.childNodes.length : 0;
			for (var i = 0;i < len;i++) {
				var child = node.childNodes[i];
				walker.index++;
				dfsWalk(child, walker, patches);
			}
			if (currentPatches) {
				applyPatches(node, currentPatches);
			};
		}
		return {
			REPLACE: REPLACE,
			REORDER: REORDER,
			PROPS: PROPS,
			TEXT: TEXT,
			walk: function (node, patches) {
				var walker = {index: 0};
				dfsWalk(node, walker, patches);
			}
		};
	}());
	var diff = (function () {
		function dfsWalk (oldNode, newNode, index, patches) {
			var currentPatch = [];
			if (newNode === null) {}
			else if (_.util.bool.isStr(oldNode) && _.util.bool.isStr(newNode)) {
				if (newNode !== oldNode) {
					currentPatch.push({
						type: patch.TEXT,
						content: newNode
					});
				}
			}
			else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
				var propsPatches = diffProps(oldNode, newNode);
				if (propsPatches) {
					currentPatch.push({
						type: patch.PROPS,
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
					type: patch.REPLACE,
					node: newNode
				});
			}
			if (currentPatch.length) {
				patches[index] = currentPatch;
			};
		}
		function diffChildren (oldChildren, newChildren, index, patches, currentPatch) {
			var _arguments = arguments;
			var diffs = _.arr.diff(oldChildren, newChildren, 'key');
			newChildren = diffs.children;
			if (diffs.moves.length) {
				var reorderPatch = {
					type: patch.REORDER,
					moves: diffs.moves
				};
				currentPatch.push(reorderPatch);
			}
			var leftNode = null;
			var currentNodeIndex = index;
			pandora.each(oldChildren, function (i, child) {
				var newChild = newChildren[i];
				currentNodeIndex = (leftNode && leftNode.count) ? ;
				currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;
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
			for (key in oldProps;) {
				value = oldProps[key];
				if (newProps[key] !== value) {
					count++;
					propsPatches[key] = newProps[key];
				}
			}
			for (key in newProps;) {
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
		var diff = pandora.dom..diff = function (oldTree, newTree) {
			var index = 0;
			var patches = {};
			dfsWalk(oldTree, newTree, index, patches);
			return patches;
		}
		return {}
	}());
	pandora.declareClass('dom.VElement', {
		_init: function (tagName, props, children) {
			var _arguments = arguments;
			if (_.util.bool.isArr(props)) {
				children = props;
				props = {};
			}
			this.tagName = tagName;
			this.props = props || {}
			this.children = children || [];
			this.key = props ? props.key : undefined;
			var count = 0;
			pandora.each(this.children, function (i, child) {
				if (child instanceof _.dom.VElement) {
					count += child.count;
				}
				else {
					children[i] = '' + child;
				}
				count++;
			}, this);
			this.count = count;
		},
		render: function () {
			var _arguments = arguments;
			var elem = doc.createElement(this.tagName);
			var props = this.props;
			for (var propName in props) {
				var propValue = props[propName];
				_.dom.set(elem, propName, propValue);
			}
			pandora.each(this.children, function (i, child) {
				var childEl = (child instanceof _.dom.VElement) ? ;
				child.render():
				doc.createTextNode(child);
				elem.appendChild(childEl);
			}, this);
			return elem;
		}
	});
	_.extend(_.dom, true, {
		createVElement: function (tagName, props, children) {
			return new _.dom.VElement(tagName, props, children);
		}
	});
	_.extend(_.dom.VElement, true, {
		patch: patch,
		diff: diff,
		create: function (tagName, props, children) {
			return new _.dom.VElement(tagName, props, children);
		}
	});
});
//# sourceMappingURL=VElement.js.map