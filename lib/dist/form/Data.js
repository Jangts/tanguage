/*!
 * tanguage framework source code
 *
 * class forms/Form
 *
 * Date: 2017-04-06
 */
;
tang.init().block([
    '$_/util/bool',
    '$_/dom/',
    '$_/data/', '$_/async/'
], function(pandora, root, imports, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,

        doc = root.document,
        console = root.console,
        location = root.location,
        FormData = root.FormData,
        query = _.dom.sizzle || _.dom.selector;

    //Define Private Object 'validate'
    var validate = {},

        //Define Private Method 'validator'
        validator = function(valu, vali) {
            var arr = vali.split(/\s+/);
            for (var i in arr) {
                if (validate[arr[i]]) {
                    var date = validate[arr[i]];
                    if (date.patt) {
                        if (!validate.patt.test(valu)) return [false, validate.error];
                    }
                    if (validate.length) {
                        if (valu.length != validate.length) return [false, validate.error];
                    }
                    if (validate.maxlen) {
                        if (valu.length > validate.maxlen) return [false, validate.error];
                    }
                    if (validate.minlen) {
                        if (valu.length < validate.minlen) return [false, validate.error];
                    }
                    if (validate.val) {
                        if (valu != validate.val) return [false, validate.error];
                    }
                    if (validate.cant) {
                        if (valu == validate.cant) return [false, validate.error];
                    }
                    if (typeof validate.expression == "boolean") {
                        if (!validate.expression) return [false, validate.error];
                    }
                }
            }
            return [true, "success"];
        };

    //Define NameSpace 'forms'
    _('form');

    //Declare Class 'Form'
    /**
     * forms inspection and submission and ect.
     * @class 'form.Data'
     * @constructor
     * @param {String, Object<HTMLElement> } 
     */
    declare('form.Data', {
        useMultipartFormData: false,
        mime: undefined,
        action: undefined,
        _init: function(form, multipart) {
            this.forms = [];
            this.data = {};
            if (multipart === true) {
                this.useMultipartFormData = true;
                this.mime = 'multipart/form-data';
            }
            switch (typeof form) {
                case 'string':
                    if (form = query(form)[0]) {
                        this.action = _.dom.getAttr(form, 'action') || location.href;
                        return this.appendForm(form);
                    }
                    break;
                case 'object':
                    if (_.util.bool.isEl(form)) {
                        this.action = _.dom.getAttr(form, 'action') || location.href;
                        return this.appendForm(form);
                    }
                    break;
            }
        },
        append: function(name, value) {
            this.data[name] = [value];
        },
        appendForm: function(form) {
            var form = _.util.bool.isEl(form) ? form : document;
            var data = {};
            var selecteds = [];
            this.forms.push(form);
            _.each(query('input[name], select[name], textarea[name]', form), function(i, el) {
                var key = _.dom.getAttr(this, 'name');
                switch (this.tagName) {
                    case 'TEXTAREA':
                        data[key] = [this.value, _.dom.getAttr(this, 'data-tang-validate')];
                        break;
                    case 'SELECT':
                        if (this.selectedIndex >= 0 && this.options[this.selectedIndex]) {
                            data[key] = [this.options[this.selectedIndex].value, null];
                        }
                        break;
                    case 'INPUT':
                        $type = _.dom.getAttr(this, 'type') || 'text';
                        switch ($type.toLowerCase()) {
                            case 'checkbox':
                                if (this.checked) {
                                    selecteds[key].push(this.value);
                                }
                                break;
                            case 'radio':
                                if (data[key]) {
                                    if (this.checked) {
                                        data[key] = this.value;
                                    }
                                } else {
                                    data[key] = this.value;
                                }
                                break;
                            case 'hidden':
                            case 'password':
                            case 'text':
                            case 'url':
                            case 'number':
                            case 'range':
                            case 'month':
                            case 'week':
                            case 'time':
                            case 'datetime':
                            case 'datetime-local':
                            case 'search':
                            case 'color':
                                data[key] = [this.value, _.dom.getAttr(this, 'data-tang-validate')];
                                break;
                        }
                        break;
                };
            });
            for (var i in selecteds) {
                data[i] = [selecteds[i].join(","), null];
            }
            for (var i in data) {
                this.data[i] = data[i];
            }
            return this;
        },
        checkValue: function(doneCallback, failCallback) {
            var result;
            var error_arr = [];
            var error_num = 0;
            for (var i in this.data) {
                if (this.data[i][1]) {
                    result = validator(this.data[i][0], this.data[i][1]);
                    if (!result[0]) {
                        error_arr.push([i, result[1]]);
                        error_num++;
                    }
                }
            }
            if (error_num > 0) {
                _.util.bool.isFn(failCallback) && failCallback.call(this, error_arr);
            } else {
                _.util.bool.isFn(doneCallback) && doneCallback.call(this);
            }
            return this;
        },
        getNativeObject: function() {
            if (this.useMultipartFormData) {
                var formData = new FormData();
                for (var i in this.data) {
                    formData.append(i, this.data[i][0]);
                }
            } else {
                var formData = new Object();
                for (var i in this.data) {
                    formData[i] = this.data[i][0];
                }
            }
            return formData;
        },
        getQueryString: function() {
            var fields = []
            for (var i in this.data) {
                fields.push(i + "=" + encodeURIComponent(this.data[i][0]));
            }
            return fields.join("&");
        },
        submit: function(options) {
            if (options.defaultData) {
                for (var i in options.defaultData) {
                    if (!_.obj.has(this.data, i)) {
                        this.data[i] = [options.defaultData[i], null];
                    }
                }
            }
            if (options.correctData) {
                for (var i in options.correctData) {
                    this.data[i] = [options.correctData[i], null];
                }
            }
            var url = options.action || this.action;
            var doneCallback = function() {
                var method;
                if (options.method) {
                    method = options.method;
                } else {
                    var _method;
                    for (var i = 0; i < this.forms.length; i++) {
                        if (_method = _.dom.getAttr(this, 'method')) {
                            method = _method;
                            break;
                        }
                    }
                }

                method = _.util.bool.isHttpMethod(method) || 'POST';
                method = method.toUpperCase();
                if (method === 'GET') {
                    data = "";
                    if (url.indexOf('?')) {
                        url = url + "&" + this.getQueryString();
                    } else {
                        url = url + "?" + this.getQueryString();
                    }
                } else {
                    data = this.getQueryString();
                }
                _.async.ajax({
                    url: url,
                    data: data,
                    method: method,
                    mime: options.mime || this.mime || undefined,
                    ready: options.ready,
                    success: options.success,
                    fail: options.fail,
                });
            };
            var failCallback = options.mistake || function(err) {
                console.log(err);
            };
            return this.checkValue(doneCallback, failCallback);
        }
    });

    _.extend(_.form, {
        setValidates: function(date) {
            validate = date;
        },
        addValidates: function(date) {
            _.each(date, function(key, val) {
                validate[key] = val;
            });
        },
        removeValidate: function(key) {
            delete validate[key];
        }
    });
});