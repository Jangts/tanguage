/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 10:48:48 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/obj/',
    '$_/str/hash'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var data = pandora.ns('data', {});
    var _ = pandora;
    var doc = root.document;
    var console = root.console, location = root.location, localStorage = root.localStorage;
    var database = {};
    pandora.declareClass('data.Storage', {
        _init: function (name) {
            if (name && (typeof name === 'string')) {
                this.id = _.str.hash.md5.pseudoIdentity(name);
            }
            else {
                this.id = new _.Identifier(name,1).toString();
            }
            try {
                database[this.id] = root.JSON.parse(localStorage[this.id]);
                this.length = _.obj.length(database[this.id], true);
            }
            catch (e) {
                database[this.id] = {};
                localStorage[this.id] = '{}';
                this.length = 0;
            }
            return this;
        },
        set: function (key, value) {
            if (key && typeof key === 'string') {
                if (value === undefined) {
                    if (database[this.id].hasOwnProperty(key)) {
                        delete database[this.id][key];
                        localStorage[this.id] = root.JSON.stringify(database[this.id]);
                        this.length = _.obj.length(database[this.id], true);
                    }
                }
                else {
                    database[this.id][key] = value;
                    localStorage[this.id] = root.JSON.stringify(database[this.id]);
                    this.length = _.obj.length(database[this.id], true);
                }
            }
            return this;
        },
        get: function (key) {
            if (key === undefined) {
                return database[this.id];
            }
            if (key && typeof key === 'string') {
                if (database[this.id].hasOwnProperty(key)) {
                    return database[this.id][key];
                }
            }
            return undefined;
        },
        clear: function (del) {
            if (del) {
                delete database[this.id];
                delete localStorage[this.id];
            }
            else {
                database[this.id] = {};
                localStorage[this.id] = '{}';
            }
            return null;
        }
    });
    this.module.exports = data.Storage;
});
//# sourceMappingURL=Storage.js.map