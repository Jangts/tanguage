/*!
 * tanguage framework source code
 *
 * static data
 *
 * Date 2017-04-06
 */
;
static transfer (file, options, method) {
    if (_.util.isFile(file)) {
        options = options || {};
        options.url = options.url || location.href;
        options.data = options.data || {};
        var form = new FormData();
        for (var i in options.data) {
            form.append(i, options.data[i]);
        }
        if (typeof options.filefield == 'string') {
            form.append(options.filefield, file);
        } else {
            form.append('myfile', file);
        }
        form.append('enctype', 'multipart/form-data');
    } else if (_.util.isFiles(file)) {
        options = options || {};
        options.data = options.data || {};
        var form = new FormData();
        for (var i in options.data) {
            form.append(i, options.data[i]);
        }
        if (typeof options.filefield == 'string') {
            filefield = options.filefield + '[]';
        } else {
            filefield = 'myfile[]';
        }
        for (var i = 0; i < file.length; i++) {
            form.append(filefield, file[i]);
        }
        form.append('enctype', 'multipart/form-data');
    } else if (_.util.isForm(file)) {
        options = options || {};
        var form = file;
        for (var i in options.data) {
            form.append(i, options.data[i]);
        }
    } else {
        return _.debug('Must Give Transfer A File.');
    }
    if (method) {
        form.append('http_method', method);
    }
    options.url = options.url || location.href;
    options.handlers = options.handlers || {};
    fileTransfer.call(this, options.url, form, options.handlers);
}