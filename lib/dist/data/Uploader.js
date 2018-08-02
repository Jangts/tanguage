/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 07:22:56 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/util/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var data = pandora.ns('data', {});
    var _ = pandora;
    var doc = root.document;
    var console = root.console, XMLHttpRequest = root.XMLHttpRequest, ActiveXObject = root.ActiveXObject, FormData = root.FormData;
    var toRegExp = function (array) {
        var str = array.join('|');
        str = str.replace(/(\/|\+|\.)/g, '\\$1');
        return new RegExp("^(" + str + ")$");
    }
    var fileTransfer = function (url, form, handlers) {
        var that = this;
        var onBeforeTransferring = handlers.before;
        var onAfterTransferring = handlers.after;
        var onUploadComplete = handlers.done;
        var onUploadFailed = handlers.fail;
        var uploader = XMLHttpRequest ? new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
        var response = void 0;
        if (uploader.upload) {
            var onTransferring = handlers.progress;
            var onSendStart = function (evt) {
                response = {
                    lengthComputable: evt.lengthComputable,
                    loaded: evt.loaded,
                    total: evt.total,
                    readyState: uploader.readyState,
                    status: uploader.status,
                    responseText: 'Transferring'
                };
                _.util.isFn(onBeforeTransferring) && onBeforeTransferring.call(that, response);
            }
            var onSendProgress = function (evt) {
                response = {
                    lengthComputable: evt.lengthComputable,
                    loaded: evt.loaded,
                    total: evt.total,
                    readyState: uploader.readyState,
                    status: uploader.status,
                    responseText: 'Transferring'
                };
                _.util.isFn(onTransferring) && onTransferring.call(that, response);
            }
            var onSendComplete = function (evt) {
                response = {
                    readyState: uploader.readyState,
                    status: uploader.status,
                    responseText: 'Transferred'
                };
                _.util.isFn(onAfterTransferring) && onAfterTransferring.call(that, response);
            }
            var onFailed = function (evt) {
                response = {
                    readyState: uploader.readyState,
                    status: uploader.status,
                    responseText: 'Transfailed'
                };
                _.util.isFn(onUploadFailed) && onUploadFailed.call(that, response);
            }
            var onTimeout = function (evt) {
                response = {
                    readyState: uploader.readyState,
                    status: uploader.status,
                    responseText: 'Timeout'
                };
                _.util.isFn(onUploadFailed) && onUploadFailed.call(that, response);
            }
        }
        var onStateChange = function () {
            if (this.readyState == 1) {
                response = {
                    lengthComputable: false,
                    loaded: 0,
                    total: 0,
                    readyState: this.readyState,
                    status: this.status,
                    responseText: 'Waiting'
                };
                _.util.isFn(onBeforeTransferring) && onBeforeTransferring.call(that, response);
            }
            else if (this.readyState == 2 || this.readyState == 3) {
                response = {
                    readyState: this.readyState,
                    status: this.status,
                    responseText: 'Processing'
                };
                _.util.isFn(onAfterTransferring) && onAfterTransferring.call(that, response);
            }
            else if (this.readyState == 4) {
                if (this.status == 200) {
                    response = {
                        readyState: this.readyState,
                        status: this.status,
                        responseText: this.responseText
                    };
                    _.util.isFn(onUploadComplete) && onUploadComplete.call(that, response);
                }
                else {
                    response = {
                        readyState: this.readyState,
                        status: this.status,
                        responseText: this.responseText
                    };
                    _.util.isFn(onUploadFailed) && onUploadFailed.call(that, response);
                }
            };
        }
        if (uploader.upload && typeof uploader.onprogress != 'undefined') {
            uploader.upload.onloadstart = onSendStart;
            uploader.upload.onprogress = onSendProgress;
            uploader.upload.onloadend = onSendComplete;
            uploader.upload.onerror = onFailed;
            uploader.upload.ontimeout = onTimeout;
        }
        uploader.onreadystatechange = onStateChange;
        uploader.open('POST', url, true);
        uploader.send(form);
    }
    pandora.declareClass('data.Uploader', {
        Element: null,
        fileTypeRegExp: null,
        fileNameRegExp: null,
        isOnlyFilter: true,
        _init: function (files, types, suffixs, maxSize) {
            this.files = files;
            if (_.util.isArr(types)) {
                this.fileTypeRegExp = toRegExp(types);
            }
            if (_.util.isArr(suffixs) && suffixs.length) {
                this.fileNameRegExp = new RegExp(".(" + suffixs.join('|') + ")$");
            }
            this.fileMaxSize = typeof maxSize == 'number' ? maxSize : 1024 * 1024 * 200;
        },
        checkType: function (doneCallback, failCallback) {
            var result = this.filesChecker(this.files);
            if (this.isOnlyFilter) {
                var result = this.filesFilter();
            }
            else {
                var result = this.filesChecker();
            }
            if (result[0]) {
                _.util.isFn(doneCallback) && doneCallback.call(this, result[1], result[2]);
            }
            else {
                _.util.isFn(failCallback) && failCallback.call(this, result[1], result[2]);
            };
        },
        filesFilter: function () {
            var array = [];
            for (var i = 0;i < this.files.length;i++) {
                if (this.checkSIZE(this.files[i])) {
                    if (this.checkTYPE(this.files[i]) || this.checkEXTN(this.files[i])) {
                        array.push(this.files[i]);
                    }
                }
            }
            if (array.length > 0) {
                if (this.files.length > array.length) {
                    return [true, array, 0];
                }
                return [true, array, 1];
            }
            else {
                return [false, 0, 2];
            };
        },
        filesChecker: function () {
            for (var i = 0;i < this.files.length;i++) {
                if (!(this.checkTYPE(this.files[i]) || this.checkEXTN(this.files[i]))) {
                    return [false, this.files[i], 0];
                }
                if (!this.checkSIZE(this.files[i])) {
                    return [false, this.files[i], 1];
                }
            }
            return [true, this.files, 1];
        },
        checkTYPE: function (file) {
            return this.fileTypeRegExp && this.fileTypeRegExp.test(file.type);
        },
        checkEXTN: function (file) {
            return this.fileNameRegExp && this.fileNameRegExp.test(file.name);
        },
        checkSIZE: function (file) {
            return file.size < this.fileMaxSize;
        },
        transfer: function (options, method) {
            if (this.files.length && this.files.length === 1) {
                _.data.Uploader.transfer.call(this, this.files[0], options, method);
            }
            else {
                _.data.Uploader.transfer.call(this, this.files, options, method);
            };
        }
    });
    pandora.extend(pandora.data.Uploader, {
        transfer: function (file, options, method) {
            if (_.util.isFile(file)) {
                options = options || {}
                options.url = options.url || location.href;
                options.data = options.data || {}
                var form = new FormData();
                for (var i in options.data) {
                    form.append(i, options.data[i]);
                }
                if (typeof options.filefield == 'string') {
                    form.append(options.filefield, file);
                }
                else {
                    form.append('myfile', file);
                }
                form.append('enctype', 'multipart/form-data');
            }
            else if (_.util.isFiles(file)) {
                options = options || {}
                options.data = options.data || {}
                var form = new FormData();
                for (var i in options.data) {
                    form.append(i, options.data[i]);
                }
                if (typeof options.filefield == 'string') {
                    filefield = options.filefield + '[]';
                }
                else {
                    filefield = 'myfile[]';
                }
                for (var i = 0;i < file.length;i++) {
                    form.append(filefield, file[i]);
                }
                form.append('enctype', 'multipart/form-data');
            }
            else if (_.util.isForm(file)) {
                options = options || {}
                var form = file;
                for (var i in options.data) {
                    form.append(i, options.data[i]);
                }
            }
            else {
                return _.debug('Must Give Transfer A File.');
            }
            if (method) {
                form.append('http_method', method);
            }
            options.url = options.url || location.href;
            options.handlers = options.handlers || {}
            fileTransfer.call(this, options.url, form, options.handlers);
        }
    });
    this.module.exports = data.Uploader;
});
//# sourceMappingURL=Uploader.js.map