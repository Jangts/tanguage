/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 20 Jul 2018 14:51:46 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/util/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var _ = pandora;
    pandora.ns('arr', {
        merge: function () {
            var _arguments = arguments;
            if (arguments.length > 0) {
                var array = [];
                for (var a = 0;a < arguments.length;a++) {
                    if (typeof arguments[a] == 'object' && arguments[a] instanceof Array) {
                        pandora.each(arguments[a], function (index, elememt) {
                            if (array.indexOf(elememt) < 0) {
                                array.push(elememt);
                            };
                        }, this);
                    }
                }
            }
            else {
                var array = [];
            }
            return array;
        },
        beObject: function (array1, array2) {
            var object = {};
            if (array2) {
                for (var i = 0;i < array1.length;i++) {
                    object[array1[i]] = array2[i] || null;
                }
            }
            else {
                for (var i = 0;i < array1.length;i++) {
                    object[i] = array1[i];
                }
            }
            return object;
        },
        each: function (array, handler) {
            if (_.util.isArray(array)) {
                for (var i = 0;i < array.length;i++) {
                    handler.call(array[i], i, array[i]);
                }
            };
        },
        eachReverse: function (array, handler) {
            if (_.util.isArray(array)) {
                for (var i = array.length - 1;i >  -1;i--) {
                    handler.call(array[i], i, array[i]);
                }
            };
        },
        has: function (array, elem) {
            for (var i = 0;i < array.length;i++) {
                if (array[i] === elem) {
                    return i;
                }
            }
            return false;
        },
        push: function (elem, array, index) {
            index = parseInt(index);
            if (index >= 0 && index < array.length) {
                var _array = array;
                array.length = index;
            }
            else {
                var _array = [];
            }
            array.push(elem);
            for (var i = index + 1;i < _array.length;i++) {
                array.push(_array[i]);
            }
            return array;
        },
        remove: function (array, elem) {
            var result = [];
            for (var i = 0;i < array.length;i++) {
                array[i] == elem || result.push(array[i]);
            }
            return result;
        },
        removeByIndex: function (array, index) {
            var result = [];
            for (var i = 0;i < array.length;i++) {
                i == index || result.push(array[i]);
            }
            return result;
        },
        index: function (array, elem) {
            if (Array.prototype.indexOf) {
                return array.indexOf(elem);
            }
            else {
                for (var i = 0;i < array.length;i++) {
                    if(array[i] === elem)return i;
                }
                return  -1;
            };
        },
        search: function (elem, array) {
            return _.arr.index(array, elem);
        },
        where: function (array, filter) {
            var _arguments = arguments;
            var filtered = [];
            pandora.each(array, function (index, elem) {
                if (filter(elem)) {
                    filtered.push(elem);
                };
            }, this);
            return filtered;
        },
        unique: function (array) {
            var _arguments = arguments;
            var result = [];
            pandora.each(array, function (i, elem) {
                if (_.arr.has(result, elem) === false) {
                    result.push(elem);
                };
            }, this);
            return result;
        },
        sum: function (array) {
            return eval(array.join('+'));
        },
        max: function (array) {
            return Math.max.apply(Math, array);
        },
        min: function (array) {
            return Math.min.apply(Math, array);
        },
        indexOfMax: function (array) {
            return _.arr.index(array, Math.max.apply(Math, array));
        },
        indexOfMin: function (array) {
            return _.arr.index(array, Math.min.apply(Math, array));
        },
        slice: _.slice
    });
    pandora.ns('arr', function () {
        var getItemKey = function (item, key) {
            if(!item || !key)return void 666;
            return typeof key === 'string' ? item[key]:key(item);
        }
        var makeKeyIndexAndFree = function (list, key) {
            var keyIndex = {};
            var free = [];
            for (var i = 0, len = list.length;i < len;i++) {
                var item = list[i];
                var itemKey = getItemKey(item, key);
                if (itemKey) {
                    keyIndex[itemKey] = i;
                }
                else {
                    free.push(item);
                }
            }
            return {
                keyIndex: keyIndex,
                free: free
            };
        }
        var diff = function (oldList, newList, key) {
            var oldMap = makeKeyIndexAndFree(oldList, key);
            var newMap = makeKeyIndexAndFree(newList, key);
            var newFree = newMap.free;
            var oldKeyIndex = oldMap.keyIndex;
            var newKeyIndex = newMap.keyIndex;
            var moves = [];
            var children = [];
            var i = 0;
            var item = void 0;
            var itemKey = void 0;
            var freeIndex = 0;
            var remove = function (index) {
                var move = {
                    index: index,
                    type: 0
                };
                moves.push(move);
            }
            var insert = function (index, item) {
                var move = {
                    index: index,
                    item: item,
                    type: 1
                };
                moves.push(move);
            }
            var removeSimulate = function (index) {
                simulateList.splice(index, 1);
            }
            while (i < oldList.length) {
                item = oldList[i];
                itemKey = getItemKey(item, key);
                if (itemKey) {
                    if (!newKeyIndex.hasOwnProperty(itemKey)) {
                        children.push(null);
                    }
                    else {
                        var newItemIndex = newKeyIndex[itemKey];
                        children.push(newList[newItemIndex]);
                    }
                }
                else {
                    var freeItem = newFree[freeIndex++];
                    children.push(freeItem || null);
                }
                i++;
            }
            var simulateList = children.slice(0);
            i = 0;
            while (i < simulateList.length) {
                if (simulateList[i] === null) {
                    remove(i);
                    removeSimulate(i);
                }
                else {
                    i++;
                }
            }
            var j = i = 0;
            while (i < newList.length) {
                item = newList[i];
                itemKey = getItemKey(item, key);
                var simulateItem = simulateList[j];
                var simulateItemKey = getItemKey(simulateItem, key);
                if (simulateItem) {
                    if (itemKey === simulateItemKey) {
                        j++;
                    }
                    else {
                        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
                            insert(i, item);
                        }
                        else {
                            var nextItemKey = getItemKey(simulateList[j + 1], key);
                            if (nextItemKey === itemKey) {
                                remove(i);
                                removeSimulate(j);
                                j++;
                            }
                            else {
                                insert(i, item);
                            }
                        }
                    }
                }
                else {
                    insert(i, item);
                }
                i++;
            }
            return {
                moves: moves,
                children: children
            };
        }
        return {
            makeKeyIndexAndFree: makeKeyIndexAndFree,
            diff: diff
        }
    });
    this.module.exports = pandora.arr;
});
//# sourceMappingURL=arr.js.map