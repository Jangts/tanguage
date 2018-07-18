/*!
 * tanguage framework source code
 *
 * static dom.VElement.diff
 *
 * Date 2017-04-06
 */
;
public diff = void ns {
    dfsWalk(oldNode, newNode, index, patches) {
        var currentPatch = [];
        // Node is removed.
        if (newNode === null) {
            // Real DOM node will be removed when perform reordering, so has no needs to do anthings in here
            // TextNode content replacing
        } else if (isStr(oldNode) && isStr(newNode)) {
            if (newNode !== oldNode) {
                currentPatch.push({ type: TEXT, content: newNode });
            }
            // Nodes are the same, diff old node's props and children
        } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
            // Diff props
            var propsPatches = diffProps(oldNode, newNode);
            if (propsPatches) {
                currentPatch.push({ type: PROPS, props: propsPatches });
            }
            // Diff children. If the node has a `ignore` property, do not diff children
            if (!isIgnoreChildren(newNode)) {
                diffChildren(
                    oldNode.children,
                    newNode.children,
                    index,
                    patches,
                    currentPatch
                );
            }
            // Nodes are not the same, replace the old node with new node
        } else {
            currentPatch.push({ type: REPLACE, node: newNode });
        }

        if (currentPatch.length) {
            patches[index] = currentPatch;
        }
    }

    diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
        var diffs = ..arr.diff(oldChildren, newChildren, 'key');
        newChildren = diffs.children;

        if (diffs.moves.length) {
            var reorderPatch = { type: REORDER, moves: diffs.moves };
            currentPatch.push(reorderPatch);
        }

        var leftNode = null;
        var currentNodeIndex = index;
        each(oldChildren as i, child) {
            var newChild = newChildren[i];
            currentNodeIndex = (leftNode && leftNode.count) ?
                currentNodeIndex + leftNode.count + 1 :
                currentNodeIndex + 1;
            dfsWalk(child, newChild, currentNodeIndex, patches);
            leftNode = child;
        }
    }

    diffProps(oldNode, newNode) {
        var count = 0;
        var oldProps = oldNode.props;
        var newProps = newNode.props;

        var key, value;
        var propsPatches = {};

        // Find out different properties
        for (key in oldProps) {
            value = oldProps[key];
            if (newProps[key] !== value) {
                count++;
                propsPatches[key] = newProps[key];
            }
        }

        // Find out new property
        for (key in newProps) {
            value = newProps[key];
            if (!oldProps.hasOwnProperty(key)) {
                count++;
                propsPatches[key] = newProps[key];
            }
        }

        // If properties all are identical
        if (count === 0) {
            return null;
        }

        return propsPatches;
    }

    isIgnoreChildren(node) {
        return (node.props && node.props.hasOwnProperty('ignore'));
    }

    return (oldTree, newTree) {
        var index = 0;
        var patches = {};
        dfsWalk(oldTree, newTree, index, patches);
        return patches;
    }
}