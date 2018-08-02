storage: {
    get (key1, key2) {
        if (key2) {
            var values = [];
            for (var index = 0; index < arguments.length; index++) {
                values.push(storage.locales._public[arguments[index]]);
            }
            return values;
        }
        return storage.locales._public[key1];
    },
    set (value1, value2) {
        if (value2) {
            var keys = [];
            for (var index = 0; index < arguments.length; index++) {
                var key = new Identifier().toString();
                storage.locales._public[key] = arguments[index];
                keys.push(key);
            }
            return keys;
        }
        var key = new Identifier().toString();
        storage.locales._public[key] = value1;
        return key;
    }
},