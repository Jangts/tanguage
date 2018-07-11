/*!
 * tanguage framework source code
 *
 * class .Component
 *
 * Date 2017-04-06
 */
;
create (tablename, fields, primarykey, constraints) {
    var defaultStorageName = 'pandora.data.Table.' + tablename;
    return {
        ai: 0,
        length: 0,
        name: tablename,
        fields: fields,
        pk: primarykey,
        constraints: constraints,
        storages: [defaultStorageName]
    }
}
update (tablename) {
    var storageName,
        mateinfs = infs[tablename],
        json = root.JSON.stringify(tables[tablename]),
        parts = json.length / partlen,
        i = 0,
        storages = [];
    for (i; i < parts; i++) {
        storageName = 'pandora.data.Table.' + tablename + (i ? i : '');
        storages.push(storageName);
        new Storage(storageName).set('data', json.substr(partlen * i, partlen));
    }
    mateinfs.length = _.obj.length(tables[tablename]);
    mateinfs.storages = storages;
    metable.set(tablename, mateinfs);
}
check (value, constraint) {
    switch (constraint.type) {
        case 'boolean':
            return _.arr.has([true, false, 1, 0], value);

        case 'object':
            return (typeof value === 'object');

        case 'string':
            if (typeof value === 'string') {
                if (constraint.length) {
                    if (value.length > constraint.length) {
                        return false;
                    }
                }
                if (constraint.pattern) {
                    var patt = new RegExp(constraint.pattern);
                    return patt.test(value);
                }
                return true;
            }

            return false;

        case 'number':
            if (typeof value === 'number') {
                if (constraint.max) {
                    if (value.length > constraint.length) {
                        return false;
                    }
                }
                if (constraint.min) {
                    if (value.length < constraint.min) {
                        return false;
                    }
                }
                return true;
            }
            return false;

        default:
            return true;
    }
}
assign (mateinfs, data, _data) {
    each (mateinfs.fields as fieldname, value) {
        if ((fieldname != mateinfs.pk) && data.hasOwnProperty(fieldname)) {
            if (mateinfs.constraints && mateinfs.constraints[fieldname]) {
                if (check(data[fieldname], mateinfs.constraints[fieldname])) {
                    _data[fieldname] = data[fieldname];
                } else {
                    if (!_data.hasOwnProperty(fieldname)) {
                        _data[fieldname] = value;
                    }
                }
            } else {
                _data[fieldname] = data[fieldname];
            }
        } else {
            if (!_data.hasOwnProperty(fieldname)) {
                _data[fieldname] = value;
            }
        }
    }
    return _data;
}