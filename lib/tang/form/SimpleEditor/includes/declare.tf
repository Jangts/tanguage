/**
 * forms inspection and submission and ect.
 * @class 'SimpleEditor'
 * @constructor
 * @param {Mix, Object }
 */
class .SimpleEditor {
    cElement= null;
    mainareas= null;
    richareas= null;
    textareas= null;
    loadmasks= null;
    statebar= null;
    toolbar= null;
    selection= null;
    attachment_type= null;
    upload_maxsize= 1024 * 1024 * 20;
    transfer= null;
    _init(elem, options, textareas) {
        if (_.util.bool.isEl(elem)) {
            options = options || {};
            this.options = {};
            this.uid = new _.Identifier();
            for (var i in options) {
                this.options[i] = options[i];
            }
            if (options.uploader) {
                this.upload_maxsize = options.uploader.maxsize;
                this.attachment_type = options.uploader.sfixs;
                this.transfer = options.uploader.transfer;
            }

            if (elem.tagName.toUpperCase() === 'TEXTAREA' || elem.tagName.toUpperCase() === 'INPUT') {
                textareas = elem;
                this.cElement = builders.initEl(elem.parentNode, options, textareas);
            } else {
                this.cElement = builders.initEl(elem, options, textareas);
            }

            this.textareas = [];
            if (textareas) {
                if (_.util.bool.isEl(textareas)) {
                    this.textareas = [builders.textarea(textareas)];
                } else if (_.util.bool.isEls(textareas)) {
                    _.each(textareas, (i, textarea) {
                        this.textareas.push(builders.textarea(textarea));
                    }, this);
                } else if (_.util.bool.isArr(textareas)) {
                    _.each(textareas, (i, textarea) {
                        console.log(textarea);
                        if (_.util.bool.isEl(textarea)) {
                            this.textareas.push(builders.textarea(textarea));
                        }
                    }, this);
                }
            } else {
                _.each(query('textarea, input', this.cElement.Element), (i, el) {
                    this.textareas.push(builders.textarea(el));
                }, this);
            }

            this.mainareas = [];
            if (this.textareas.length) {
                _.each(this.textareas, (i, textarea) {
                    // console.log(textarea, textarea.getText());
                    this.mainareas.push(builders.mainarea.call(this, options, textarea.getText()));
                }, this);
            } else {
                var text = this.cElement.Element.innerHTML;
                this.cElement.Element.innerHTML = '';
                this.mainareas.push(builders.mainarea.call(this, options, text));
            }

            this.toolbar = builders.toolbar.call(this, options);

            this.richareas = [];
            this.loadmasks = [];
            var isBuildStateBar = (this.mainareas.length === 1);
            _.each(this.mainareas, (i, mainarea) {
                builders.workspace.call(this, mainarea, options, isBuildStateBar);
            }, this);

            this.selection = new _.form.SimpleEditor.Selection(this);
            SimpleEditors[this.uid] = this.listen();
        } else {
            return _.error('@param "elem" must be an element!');
        }
    }
    focus(index) {
        index = parseInt(index) || 0;
        this.selection.createEmptyRange(index);
    }
    execCommand(cmd, val) {
        cmd = cmd.toLowerCase();
        if (conmands[cmd]) {
            conmands[cmd].call(this, val);
        }
        return this;
    }
    setValue(value, index) {
        index = parseInt(index) || 0;
        if (this.textareas[index]) {
            value = this.textareas[index].setText(value);
        }
        this.richareas[index] && (this.richareas[index].innerHTML = value);
        this.selection.createEmptyRange(index);
        return this.onchange();
    }
    resetValue() {
        _.each(this.mainareas, (index, mainarea) {
            this.richareas[index].innerHTML = mainarea.resetText;
        }, this);
    }
    getValue(index) {
        index = parseInt(index) || 0;
        _.each(this.textareas, (i, textarea) {
            textarea.setText(this.richareas[i].innerHTML);
        }, this);

        return this.richareas[index] ? this.richareas[index].innerHTML : '';
    }
    getContentTxt(index) {
        index = parseInt(index) || 0;
        var _range = this.selection.getRange();
        this.selection.createEmptyRange(index);
        this.selection.range.execCommand('selectall');
        this.selection.saveRange();
        var _text = this.selection.range.text;
        this.selection.saveRange(_range);
        return _text;
    }
    getText(index) {
        index = parseInt(index) || 0;
        return this.selection.getSelectionText();
    }
    inForm(formElement) {
        return (formElement === this.cElement.Element) || _.dom.contain(formElement, this.cElement.Element);
    }
    hideExtTools() {
        _.each(query('.se-tool.data-se-dialog, .se-tool.data-se-cmds', this.toolbar), (i, el) {
            _.dom.toggleClass(this, 'active', false);
        });
        return this;
    }
    showDialog(dialog) {
        this.hideExtTools();
        if (dialog) {
            var button = arguments[1] || query('.se-tool[data-se-dialog=' + dialog + ']', this.toolbar)[0];
            _.dom.toggleClass(button, 'active');
        };
        return this;
    }
    showPick(cmds) {
        this.hideExtTools();
        if (cmds) {
            var button = arguments[1] || query('.se-tool[data-se-cmds=' + cmds + ']', this.toolbar)[0],
                list = query('.se-pick', button)[0]

            if (_.dom.contain(this.mainareas[0], this.toolbar) && list) {
                var height = _.dom.getHeight(this.richareas[0], 'box');
                _.dom.toggleClass(button, 'active');
                _.dom.setStyle(list, 'max-height', height - 15);
            }
        };
        return this;
    }
    listen() {
        var editor = this,
            listeners = {
                toolbar: new _.dom.Events(this.toolbar),
                workspaces: new _.dom.Events(this.cElement.Element)
            };
        _.each(listeners, (name, listener) {
            _.each(events[name], (eventType, handler) {
                if (_.util.bool.isFn(handler)) {
                    listener.push(eventType, null, editor, handler);
                } else if (_.util.bool.isObj(handler)) {
                    _.each(handler, (selector, cb) {
                        listener.push(eventType, selector, editor, cb);
                    });
                }
            })
        });
        return this;
    }
    collapse(toStart) {
        this.selection.getRange().collapse(toStart);
    }
    onchange() {
        _.each(checks, (check, handler) {
            handler.call(this);
        }, this);
        return this;
    }
}