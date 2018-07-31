/*!
 * tanguage script compiled code
 *
 * Datetime: Mon, 30 Jul 2018 22:32:40 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/data/Request',
    '$_/dom/',
    '$_/util/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var app = pandora.ns('app', {});
    var XHR = imports['$_/data/request'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    pandora.declareClass('app.Photo', {
        images: undefined,
        _init: function (stage, images) {
            this.Element = _.util.isStr(stage) ? _.dom.selector.byId(stage): stage;
            this.images = [];
            _.dom.setStyle(this.Element, {
                cursor: 'default'
            });
            switch (typeof images) {
                case 'string':
                this.loadBox();
                this.loadJson(images);
                break;
                case 'object':
                this.loadBox();
                if (_.util.isArr(Array)) {
                    this.loadArray(images);
                }
                else {
                    this.loadFolder(images);
                }
                break;
            };
        },
        loadArray: function (images) {
            this.images = images;
            this.length = images.length;
        },
        loadJson: function (url, callback) {
            var that = this;
            var callback = callback || function (arr) {
                that.loadArray(arr);
            }
            new XHR({
                url: url
            }).done(function (data) {
                var array = eval(data);
                if (_.util.isArr(array)) {
                    callback(array);
                };
            }).send();
        },
        loadFolder: function (info) {
            this.images = [];
            if (info && info.imagePath) {
                this.length = info.totalImages || 36;
                this.cur = info.defaultImageNumber || this.cur;
                var type = info.imageExtension || 'png';
                var path = info.imagePath;
                for (var i = 1;i <= this.length;i++) {
                    this.images.push(path + i + '.' + type);
                }
            };
        }
    });
    this.module.exports = app.Photos;
});
//# sourceMappingURL=Photos.js.map