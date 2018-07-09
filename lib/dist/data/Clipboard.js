/*!
 * tanguage script compiled code
 *
 * Datetime: Mon, 09 Jul 2018 21:03:10 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/util/',
    '$_/dom/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var data = pandora.ns('data', {});
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    function mouseUp () {
        var options = this.data.options;
        var clip = this.data.clip;
        if (_.util.isFn(options.copy) || _.util.isStr(options.copy)) {
            if (_.util.isFn(options.copy)) {
                var text = options.copy.call(this);
            }
else {
                var text = options.copy;
            }
            clip.setText(text).copy();
            if (_.util.isFn(options.done)) {
                options.done.call(this);
            }
        }
else {
            if (_.util.isFn(options.fail)) {
                options.fail.call(this);
            }
        };
    }
    var Clipboard = pandora.declareClass({
        Element: null,
        isValid: true,
        clipText: '',
        _init: function (elem) {
            if (_.util.isEl(elem) && (elem.tagName == 'INPUTS' || elem.tagName == 'TEXTAREA')) {
                this.Element = elem;
            }
else {
                this.Element = _.dom.create('textarea', doc.getElementsByTagName('body')[0], {
                    style: {
                        position: 'fixed',
                        top:  -2000,
                        left:  -2000
                    }
                });
            };
        },
        disable: function (cancel) {
            this.isValid = cancel ? true : false;
            return this;
        },
        setText: function (newText) {
            this.clipText = newText;
            this.Element.value = newText;
            return this;
        },
        copy: function () {
            if (_.util.isFn(this.Element.focus)) {
                this.Element.focus();
                if (window.getSelection) {
                    var selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        doc.execCommand('selectall', false, false);
                        doc.execCommand('copy', false, false);
                    }
else {
                        alert('Error');
                    }
                }
else if (doc.selection) {
                    var range = doc.selection.createRange();
                    range.execCommand('selectall', false, false);
                    range.execCommand('copy', false, false);
                }
else {
                    alert('Error');
                }
                this.Element.value = '';
                this.Element.blur();
            }
else {
                alert('Error');
            }
            return this;
        }
    });
    pandora.extend(Clipboard, {
        glue: function (selector, options, clip) {
            if (!_.util.isObj(clip)|| !(clip instanceof _.form.Clipboard)) {
                clip = new _.form.Clipboard();
            }
            _.dom.events.add(document, 'mouseup', selector, {
                options: options,
                clip: clip
            }, mouseUp);
        }
    });
    
});
//# sourceMappingURL=Clipboard.js.map