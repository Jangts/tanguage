/*!
 * tanguage framework source code
 *
 * static data
 *
 * Date 2017-04-06
 */
;
static exec(str) {
    var matchs = str.match(/^(select|delete|update|insert)([\w\,\*\s]+from\s+|\s+from\s+|\s+into\s+|\s+)([A-Z_]\w*)\s+(.+)/i);
    if (matchs) {
        var mateinfs = infs[matchs[3]];
        if (mateinfs) {
            var type = matchs[1],
                table = 'json.' + matchs[3];
            switch (type) {
                case 'select':
                    var sql = 'select ' + matchs[2] + table + ' ' + matchs[4];
                    return queryJSON(sql, tables);

                case 'delete':
                    var sql = 'select * from ' + table + ' ' + matchs[4],
                        result = queryJSON(sql, tables);
                    if (result.length) {
                        var table = new _.data.Storage.Sheet(matchs[3]);
                        each (result as i, row) {
                            table.delete(row[mateinfs.pk]);
                        }
                    }
                    return result.length

                case 'update':
                    var mas = matchs[4].match(/^set\s+(\{.+\})\s+(where\s+\(.+\))$/i);
                    if (mas) {
                        try {
                            eval('var data = ' + mas[1]);
                            if (typeof(data)) {
                                var sql = 'select * from ' + table + ' ' + mas[2],
                                    result = queryJSON(sql, tables);
                                if (result.length) {
                                    var table = new _.data.Storage.Sheet(matchs[3]);
                                    each (result as i, row) {
                                        table.update(row[mateinfs.pk], data);
                                    }
                                }
                                return result.length
                            }
                        } catch (e) {
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
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return 0;
            }
        }
    }
    return false;
}