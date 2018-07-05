/*!
 * tanguage framework source code
 *
 * class see.Photos
 *
 * Date: 2017-04-06
 */
;
tang.init().block([
    '$_/util/XHR',
    '$_/util/query',
    '$_/util/',
    '$_/dom/'
], function(pandora, root, imports, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,

        doc = root.document,
        console = root.console;

    declare('see.Photos', {
        _init: function(stage, images) {
            this.Element = _.util.isStr(stage) ? _.dom.selector.byId(stage) : stage;
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
                    } else {
                        this.loadFolder(images);
                    }
                    break;
            };
        },
        images: [],
        loadArray: function(images) {
            this.images = images;
            this.length = images.length;
        },
        loadJson: function(url, callback) {
            var that = this;
            var callback = callback || function(arr) {
                that.loadArray(arr);
            };
            new _.async.Request({
                url: url
            }).done(function(data) {
                var array = eval(data);
                if (_.util.isArr(array)) {
                    callback(array);
                }
            }).send();
        },
        loadFolder: function(info) {
            this.images = [];
            if (info && info.imagePath) {
                this.length = info.totalImages || 36;
                this.cur = info.defaultImageNumber || this.cur;
                var type = info.imageExtension || 'png';
                var path = info.imagePath;
                for (var i = 1; i <= this.length; i++) {
                    this.images.push(path + i + '.' + type);
                }
            }
        }
    });
});