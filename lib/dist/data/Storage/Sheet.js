/*!
 * tanguage script compiled code
 *
 * Datetime: Wed, 11 Jul 2018 12:54:49 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/arr/',
    '$_/obj/',
    '$_/data/Storage'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var Storage = pandora.ns('data.Storage', {});
    var _ = pandora;
    var doc = root.document;
    var console = root.console, location = root.location;
    var Storage = _.data.Storage, queryJSON = _.data.queryJSON;
    var infs = {};
    var tables = {};
    var metable = new Storage('pandora.data.Table');
    var namingExpr = /^[A-Z_]\w*$/i;
    var partlen = 1000 * 1000 * 5;
    function create (tablename, fields, primarykey, constraints) {
        var defaultStorageName = 'pandora.data.Table.' + tablename;
        return {
            ai: 0,
            length: 0,
            name: tablename,
            fields: fields,
            pk: primarykey,
            constraints: constraints,
            storages: [defaultStorageName]
        };
    }
    function update (tablename) {
        var storageName = void 0;
        var mateinfs = infs[tablename];
        var json = root.JSON.stringify(tables[tablename]);
        var parts = json.length/partlen;
        var i = 0;
        var storages = [];
        for (i;i < parts;i++) {
            storageName = 'pandora.data.Table.' + tablename + (i ? i:'');
            storages.push(storageName);
            new Storage(storageName).set('data', json.substr(partlen * i, partlen));
        }
        mateinfs.length = _.obj.length(tables[tablename]);
        mateinfs.storages = storages;
        metable.set(tablename, mateinfs);
    }
    function check (value, constraint) {
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
        };
    }
    function assign (mateinfs, data, _data) {
        var _arguments = arguments;
        pandora.each(mateinfs.fields, function (fieldname, value) {
            if ((fieldname != mateinfs.pk) && data.hasOwnProperty(fieldname)) {
                if (mateinfs.constraints && mateinfs.constraints[fieldname]) {
                    if (check(data[fieldname], mateinfs.constraints[fieldname])) {
                        _data[fieldname] = data[fieldname];
                    }
                    else {
                        if (!_data.hasOwnProperty(fieldname)) {
                            _data[fieldname] = value;
                        }
                    }
                }
                else {
                    _data[fieldname] = data[fieldname];
                }
            }
            else {
                if (!_data.hasOwnProperty(fieldname)) {
                    _data[fieldname] = value;
                }
            };
        }, this);
        return _data;
    }
    pandora.declareClass('data.Storage.Sheet', {
        _init: function (tablename, fields, primarykey, constraints) {
            var _arguments = arguments;
            if (namingExpr.test(tablename)) {
                this.tablename = tablename;
                if (!tables[tablename]) {
                    var mateinfs = metable.get(tablename);
                    if (!mateinfs) {
                        if (fields) {
                            mateinfs = create(tablename, fields, primarykey, constraints);
                            metable.set(tablename, mateinfs);
                        }
                        else {
                            mateinfs = create(tablename, {'id': 0}, 'id',  {});
                            metable.set(tablename, mateinfs);
                        }
                    }
                    var json = '';
                    pandora.each(mateinfs.storages, function (i, storageName) {
                        json += new Storage(storageName).get('data');
                    }, this);
                    infs[tablename] = mateinfs;
                    try {
                        tables[tablename] = root.JSON.parse(json);
                    }
                    catch (e) {
                        tables[tablename] = {};
                    }
                    console.log(mateinfs);
                }
            }
            else {
                _.error('Error Tablename');
            };
        },
        add: function (fieldname, value, constraint) {
            var _arguments = arguments;
            var tablename = this.tablename;
            var mateinfs = infs[tablename];
            if (!mateinfs.fields.hasOwnProperty(fieldname)) {
                mateinfs.fields[fieldname] = value = value || '';
                if (constraint && constraint.type) {
                    mateinfs.constraints[fieldname] = constraint;
                }
                pandora.each(tables[tablename], function (id, row) {
                    row[fieldname] = value;
                }, this);
                update(tablename);
            }
            return this;
        },
        drop: function (fieldname) {
            var _arguments = arguments;
            var tablename = this.tablename;
            var mateinfs = infs[tablename];
            if (fieldname) {
                if (mateinfs.fields.hasOwnProperty(fieldname)) {
                    delete mateinfs.fields[fieldname];
                    delete mateinfs.constraints[fieldname];
                    pandora.each(tables[tablename], function (id, row) {
                        delete row[fieldname];
                    }, this);
                    update(this.tablename);
                }
                return this;
            }
            pandora.each(mateinfs.storages, function (i, storageName) {
                new Storage(storageName).clear(true);
            }, this);
            metable.set(tablename);
            delete infs[tablename];
            delete tables[tablename];
            return null;
        },
        alter: function (fieldname, newname, value) {
            var _arguments = arguments;
            var tablename = this.tablename;
            var mateinfs = infs[tablename];
            if (fieldname) {
                if (mateinfs.fields.hasOwnProperty(fieldname)) {
                    mateinfs.fields[newname] = value === undefined ? mateinfs.fields[fieldname]: value;
                    delete mateinfs.fields[fieldname];
                    mateinfs.constraints[newname] = mateinfs.constraints[fieldname];
                    delete mateinfs.constraints[fieldname];
                    pandora.each(tables[tablename], function (id, row) {
                        row[newname] = row[fieldname];
                        delete row[fieldname];
                    }, this);
                    update(tablename);
                }
                return this;
            }
            return this;
        },
        insert: function (data) {
            var _arguments = arguments;
            var tablename = this.tablename;
            var mateinfs = infs[tablename];
            pandora.each(arguments, function (i, data) {
                data = assign(mateinfs, data,  {});
                data[mateinfs.pk] = ++mateinfs.ai;
                tables[tablename][mateinfs.ai] = data;
            }, this);
            update(tablename);
            return mateinfs.ai;
        },
        update: function (id, data) {
            var tablename = this.tablename;
            var mateinfs = infs[tablename];
            if (id && tables[tablename].hasOwnProperty(id) && data) {
                tables[tablename][id] = assign(mateinfs, data, tables[tablename][id]);
                update(tablename);
            }
            return this;
        },
        select: function (id) {
            var _arguments = arguments;
            var tablename = this.tablename;
            if (id) {
                rs = [];
                pandora.each(arguments, function (i, id) {
                    if (tables[tablename][id]) {
                        rs.push(tables[tablename][id]);
                    };
                }, this);
                return rs;
            }
            return _.obj.toArray(tables[tablename]);
        },
        delete: function (id) {
            var _arguments = arguments;
            var tablename = this.tablename;
            if (id) {
                pandora.each(arguments, function (i, id) {
                    delete tables[tablename][id];
                }, this);
                update(tablename);
            }
            return this;
        },
        fields: function () {
            var _arguments = arguments;
            var fields = {};
            var mateinfs = infs[this.tablename];
            if (mateinfs) {
                pandora.each(mateinfs.fields, function (fieldname, value) {
                    fields[fieldname] = {
                        default: value,
                        constraint: mateinfs.constraints && mateinfs.constraints[fieldname],
                        isPKey: fieldname === mateinfs.pk
                    };
                }, this);
                return fields;
            }
            return false;
        },
        render: function (width, border, context) {
            var that = this;
            _.ab([
                '$_/see/see.css',
                '$_/dom/'
            ], function () {
                var _arguments = arguments;
                var mateinfs = infs[that.tablename];
                if (mateinfs) {
                    if (width) {
                        _width = ' width="' + width + '"';
                    }
                    else {
                        _width = '';
                    }
                    if (border) {
                        _border = ' border="' + border + '"';
                    }
                    else {
                        _border = '';
                    }
                    var rows = tables[that.tablename];
                    var html = '<table class="table" ' + _width + _border + '><tbody><tr class="head-row"><th>' + mateinfs.pk + '</th>';
                    pandora.each(mateinfs.fields, function (fieldname) {
                        if (fieldname != mateinfs.pk) {
                            html += '<th>' + fieldname + '</th>';
                        };
                    }, this);
                    pandora.each(rows, function (id, row) {
                        html += '</tr><tr><td>' + id + '</td>';
                        pandora.each(row, function (fieldname, value) {
                            if (fieldname != mateinfs.pk) {
                                html += '<td>' + value + '</td>';
                            };
                        }, this);
                    }, this);
                    html += '</tr></tbody></table>';
                    if (context) {
                        _.dom.addClass(context, 'tang-see');
                        _.dom.append(context, html);
                    }
                    else {
                        _.dom.append(doc.body, html);
                    }
                }
                return false;
            });
        }
    });
    pandora.extend(pandora.data.Storage.Sheet, {
        exec: function (str) {
            var _arguments = arguments;
            var matchs = str.match(/^(select|delete|update|insert)([\w\,\*\s]+from\s+|\s+from\s+|\s+into\s+|\s+)([A-Z_]\w*)\s+(.+)/i);
            if (matchs) {
                var mateinfs = infs[matchs[3]];
                if (mateinfs) {
                    var type = matchs[1];
                    var table = 'json.' + matchs[3];
                    switch (type) {
                        case 'select':
                        var sql = 'select ' + matchs[2] + table + ' ' + matchs[4];
                        return queryJSON(sql, tables);
                        case 'delete':
                        var sql = 'select * from ' + table + ' ' + matchs[4];
                        var result = queryJSON(sql, tables);
                        if (result.length) {
                            var table = new _.data.Storage.Sheet(matchs[3]);
                            pandora.each(result, function (i, row) {
                                table.delete(row[mateinfs.pk]);
                            }, this);
                        }
                        return result.length;
                        case 'update':
                        var mas = matchs[4].match(/^set\s+(\{.+\})\s+(where\s+\(.+\))$/i);
                        if (mas) {
                            try {
                                eval('var data = ' + mas[1]);
                                if (typeof(data)) {
                                    var sql = 'select * from ' + table + ' ' + mas[2];
                                    var result = queryJSON(sql, tables);
                                    if (result.length) {
                                        var table = new _.data.Storage.Sheet(matchs[3]);
                                        pandora.each(result, function (i, row) {
                                            table.update(row[mateinfs.pk], data);
                                        }, this);
                                    }
                                    return result.length;
                                }
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                        return 0;
                        case 'insert':
                        var mas = matchs[4].match(/^values\s+(\{.+\})\s*$/i);
                        if (mas) {
                            try {
                                eval('var data = [' + mas[1] + ']');
                                if (typeof(data)) {
                                    var table = new _.data.Storage.Sheet(matchs[3]);
                                    return table.insert.apply(table, data);
                                }
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                        return 0;
                    }
                }
            }
            return false;
        }
    });
    this.module.exports = Storage.Sheet;
});
//# sourceMappingURL=Sheet.js.map