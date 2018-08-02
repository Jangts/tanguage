let BlockCore = declareClass({
    url: storage.mainUrl,
    _init (callback) {
        this.imports = {};
        this.module = null;
        this.callback = callback;
    },
    get (key) {
        return this._private[key];
    },
    set (value) {
        var key = new Identifier().toString();
        this._private[key] = value;
        return key;
    }
});