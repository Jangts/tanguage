/*!
 * tanguage framework source code
 *
 * class .data.Uploader
 *
 * Date 2017-04-06
 */
;
var //Define Private Method 'toRegExp',  'fileTransfer'
toRegExp = (array) {
    var str = array.join('|');
    str = str.replace(/(\/|\+|\.)/g, '\\$1');
    return new RegExp("^(" + str + ")$");
},

fileTransfer = (url, form, handlers) {
    var that = this;
    var onBeforeTransferring = handlers.before;
    var onAfterTransferring = handlers.after;
    var onUploadComplete = handlers.done;
    var onUploadFailed = handlers.fail;
    var uploader = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    var response;
    if (uploader.upload) {
        var onTransferring = handlers.progress;
        var onSendStart = (evt) {
            response = {
                lengthComputable: evt.lengthComputable,
                loaded: evt.loaded,
                total: evt.total,
                readyState: uploader.readyState,
                status: uploader.status,
                responseText: 'Transferring'
            }
            _.util.isFn(onBeforeTransferring) && onBeforeTransferring.call(that, response);
        };
        var onSendProgress = (evt) {
            response = {
                lengthComputable: evt.lengthComputable,
                loaded: evt.loaded,
                total: evt.total,
                readyState: uploader.readyState,
                status: uploader.status,
                responseText: 'Transferring'
            }
            _.util.isFn(onTransferring) && onTransferring.call(that, response);
        };
        var onSendComplete = (evt) {
            response = {
                readyState: uploader.readyState,
                status: uploader.status,
                responseText: 'Transferred'
            }
            _.util.isFn(onAfterTransferring) && onAfterTransferring.call(that, response);
        };
        var onFailed = (evt) {
            response = {
                readyState: uploader.readyState,
                status: uploader.status,
                responseText: 'Transfailed'
            }
            _.util.isFn(onUploadFailed) && onUploadFailed.call(that, response);
        };
        var onTimeout = (evt) {
            response = {
                readyState: uploader.readyState,
                status: uploader.status,
                responseText: 'Timeout'
            }
            _.util.isFn(onUploadFailed) && onUploadFailed.call(that, response);
        }
    };
    var onStateChange = () {
        if (this.readyState == 1) {
            response = {
                lengthComputable: false,
                loaded: 0,
                total: 0,
                readyState: this.readyState,
                status: this.status,
                responseText: 'Waiting'
            }
            _.util.isFn(onBeforeTransferring) && onBeforeTransferring.call(that, response);
        } else if (this.readyState == 2 || this.readyState == 3) {
            response = {
                readyState: this.readyState,
                status: this.status,
                responseText: 'Processing'
            }
            _.util.isFn(onAfterTransferring) && onAfterTransferring.call(that, response);
        } else if (this.readyState == 4) {
            //console.log(url, data, handlers, this);
            if (this.status == 200) {
                response = {
                    readyState: this.readyState,
                    status: this.status,
                    responseText: this.responseText
                }
                _.util.isFn(onUploadComplete) && onUploadComplete.call(that, response);
            } else {
                response = {
                    readyState: this.readyState,
                    status: this.status,
                    responseText: this.responseText
                }
                _.util.isFn(onUploadFailed) && onUploadFailed.call(that, response);
            }
        }
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
    // console.log(form);
    uploader.send(form);
};