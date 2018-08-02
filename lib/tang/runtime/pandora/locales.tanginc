/**
 * 本地化语言包数据读写操作
 *
 * @param string ns
 * @return mixed
 */
locales (ns) {
    if (ns && (typeof ns === 'string')) {
        ns = ns.toLowerCase();
        switch (arguments.length) {
            case 1:
                if (typeof storage.locales[ns] === 'object') {
                    return deep(storage.locales[ns]);
                }
                return undefined;
            case 2:
                if (typeof arguments[1] === 'object') {
                    if (typeof storage.locales[ns] !== 'object') {
                        storage.locales[ns] = {};
                    }
                    each(arguments[1], (lang, value) {
                        lang = lang.toLowerCase();
                        if (storage.locales[ns][lang] === undefined) {
                            storage.locales[ns][lang] = value;
                            var la = lang.substr(0, 2);
                            if (storage.locales[ns][la] === undefined) {
                                storage.locales[ns][la] = value;
                            }
                        }
                    });
                    return true;
                }
            default:
                if ((typeof storage.locales[ns] === 'object') && (typeof arguments[1] === 'string')) {
                    var lang = arguments[1].toLowerCase(),
                        value;
                    if (storage.locales[ns][lang]) {
                        value = storage.locales[ns][lang];
                    } else {
                        var la = lang.substr(0, 2);
                        if (storage.locales[ns][la]) {
                            value = storage.locales[ns][la];
                        } else {
                            return undefined;
                        }
                    }
                    var i = 2;
                    while ((typeof value === 'object') && (typeof arguments[i] === 'string')) {
                        value = value[arguments[i++]];
                    }
                    switch (typeof value) {
                        case 'object':
                            return deep(value);
                        case 'string':
                            return value;
                    }
                }
        }
    }
    return undefined;
},