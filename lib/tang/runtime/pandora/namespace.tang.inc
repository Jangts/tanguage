/**
 * 拓展潘多拉对象
 *
 * @param string    name    元素名称
 * @param mixed     value   元素值
 * @param bool      update  是否覆盖已有值
 * @return object
 */
let namespace = (name, value, update) {
    name = name.trim();
    if (namingExpr.test(name)) {
        // 检查传入值
        value = value || {};
        var
        // 将命名空间切到storage.pandora根空间
            object = storage.pandora,
            // 拆分命名字串
            NameSplit = name.split('.');

        // 遍历命名空间
        for (var i = 0; i < NameSplit.length && object; i++) {
            var subname = NameSplit[i].trim();
            // 达到最后一位
            if (i == NameSplit.length - 1) {
                subname = subname || 'default';
                // clog subname, object[subname], value;
                if (object[subname] === undefined) {
                    object[subname] = value;
                    object = object[subname];
                } else if (typeof value !== 'object') {
                    // clog subname, object[subname], value;
                    var _value = object[subname];
                    object[subname] = value;
                    object = object[subname];
                    // clog object, _value;
                    for (var k in _value) {
                        if (_value.hasOwnProperty(k)) {
                            object[k] = _value[k];
                        }
                    }
                } else {
                    object = object[subname];
                    for (var k in value) {
                        if (value.hasOwnProperty(k)) {
                            object[k] = update ? value[k] : object[k] || value[k];
                        }
                    }
                }
            }
            // 非末尾，排除空白
            else if (subname != '') {
                object[subname] = object[subname] || {};
                object = object[subname];
            }

        }

        return object;
    }
    return error('Can not reset \'' + name + '\' as pandora namespace.');
}