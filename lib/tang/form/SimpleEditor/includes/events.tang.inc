/*!
 * tanguage framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;

var events = void ns {
    var resetStateBar = (editor) {
        each(editor.richareas as i, richarea) {
            each(query('img[_selected=_selected]', richarea) as i, elem) {
                _.dom.removeAttr(elem, '_selected');
            }
        }
        if (editor.statebar) {
            query('.se-imagestatus', editor.statebar)[0].style.display = 'none';
        }
        if (event.target.tagName === 'IMG') {
            editor.selectedImage = event.target;
        } else {
            editor.selectedImage = undefined;
        }
    },
    downrich = (event) {
        // console.log(event);
        event.data.mousedown = true;
    },
    outrich = (event) {
        // console.log(event);
        var editor = event.data;
        if (editor.mousedown && (_.util.inArr(event.target, editor.richareas) !== false)) {
            editor.mouseout = true;
            resetStateBar(editor);
        }
    },
    muprich = (event) {
        // console.log(event);
        var editor = event.data;
        editor.hideExtTools();
        editor.mousedown = false;
        resetStateBar(editor);
        editor.selection.saveRange();
        editor.onchange();
    },
    kuprich = (event) {
        // console.log(event);
        var editor = event.data;
        resetStateBar(editor);
        editor.selection.saveRange();
        editor.onchange();
    },
    inputs = {
        'fontsize'(editor, input) {
            editor.execCommand('fontsize', input.value);
        },
        'fontcolor'(editor, input) {
            editor.execCommand('forecolor', input.value);
        },
        'tablewidth'(editor, input) {
            var table = editor.selectedTable;
            table.style.width = parseInt(input.value) + 'px';
            table.width = parseInt(input.value);
            editor.selection.restoreSelection();
        },
        'tableborder'(editor, input) {
            var table = editor.selectedTable;
            table.style.borderTopWidth = parseInt(input.value) + 'px';
            table.style.borderRightWidth = parseInt(input.value) + 'px';
            table.style.borderBottomWidth = parseInt(input.value) + 'px';
            table.style.borderLeftWidth = parseInt(input.value) + 'px';
            table.style.borderStyle = table.style.borderStyle || 'solid';
            table.border = parseInt(input.value);
        },
        'imgwidth'(editor, input) {
            var img = editor.selectedImage;
            img.style.width = parseInt(input.value) + 'px';
            img.width = parseInt(input.value);
        },
        'imgheight'(editor, input) {
            var img = editor.selectedImage;
            img.style.height = parseInt(input.value) + 'px';
            img.height = parseInt(input.value);
        },
        'imgsize'(editor, size) {
            var css, attr, img = editor.selectedImage;
            switch (size) {
                case '3':
                    css = attr = '100%';
                    break;
                case '2':
                    css = attr = '50%';
                    break;
                case '1':
                    css = attr = '33%';
                    break;
                default:
                    css = 'auto';
                    attr = null;
                    break;
            }
            img.style.width = css;
            img.width = attr;
            img.style.height = 'auto';
            img.height = null;
        },
        'imgborder'(editor, input) {
            var img = editor.selectedImage;
            img.style.borderTopWidth = parseInt(input.value) + 'px';
            img.style.borderRightWidth = parseInt(input.value) + 'px';
            img.style.borderBottomWidth = parseInt(input.value) + 'px';
            img.style.borderLeftWidth = parseInt(input.value) + 'px';
            img.border = parseInt(input.value);
        }
    };
    return {
        'toolbar': {
            'mousedown'(event) {
                // console.log(event);
                var editor = event.data;
                editor.selection.restoreSelection();
                editor.onchange();
            },
            'mouseup': {
                '.data-se-dialog'(event) {
                    // console.log(event);
                    if (event.target.tagName == 'I') {
                        var editor = event.data,
                            dialog = _.dom.getAttr(this, 'data-se-dialog');
                        each(query('.se-tool.data-se-dialog input[type=text], .se-tool.data-se-dialog textarea, .se-tool.data-se-dialog input.se-files', editor.toolbar) as i, el) {
                            if (_.dom.hasClass(this, 'createlink')) {
                                // console.log(editor.selection, editor.selection.getRange());
                                var elem = editor.selection.getRange().commonElem;
                                if (!elem.tagName === 'A') {
                                    elem = _.dom.getClosestParent(elem, 'a');
                                }
                                if (elem) {
                                    this.value = _.dom.getAttr(elem, 'href');
                                } else {
                                    this.value = '';
                                }
                            } else {
                                this.value = '';
                            }
                        }

                        query('.se-tool.data-se-dialog .se-show', editor.toolbar)[0].innerHTML = '<span>click to upload</span>';
                        // log 'foo';
                        editor.showDialog(dialog, this);
                        editor.selection.restoreSelection();
                    };
                },
                '.data-se-cmds'(event) {
                    // console.log(event);
                    var editor = event.data,
                        cmds = _.dom.getAttr(this, 'data-se-cmds');
                    // editor.onchange();
                    editor.selection.restoreSelection();
                    editor.showPick(cmds, this);
                    editor.selection.restoreSelection();
                    editor.onchange();
                },
                '.data-se-cmd'(event) {
                    // console.log(event);
                    var editor = event.data;
                    editor.selection.restoreSelection();
                    // editor.onchange();
                    if (!_.dom.hasClass(this, 'invalid')) {
                        editor.hideExtTools();
                        var cmd = _.dom.getAttr(this, 'data-se-cmd');
                        switch (cmd) {
                            case 'createlink':
                            case 'inserttable':
                            case 'insertfile':
                            case 'insertvideo':
                            case 'insertimage':
                                var val = dialogs[cmd](this);
                                break;
                            case 'insertemoticon':
                                var val = dialogs[cmd](_.dom.getAttr(this, 'data-se-val'));
                                break;
                            case 'uploadfile':
                                return dialogs[cmd].call(editor, this);
                            case 'uploadimage':
                                return dialogs[cmd].call(editor, this);
                            default:
                                var val = _.dom.getAttr(this, 'data-se-val');
                                break;
                        }
                        editor.execCommand(cmd, val);
                        editor.onchange();
                    }
                },
                '.se-show span'(event) {
                    // console.log(event);
                    var editor = event.data;
                    var previewer = this.parentNode,
                        dialog = _.dom.getClosestParent(this, 'dialog'),
                        input = query('.se-files', dialog)[0];
                    input.onchange = () {
                        var doneCallback = (files) {
                            if (files.length < 6) {
                                var ul_class = 'tangram se-list-56'
                            } else if (files.length < 19) {
                                var ul_class = 'tangram se-list-28'
                            } else {
                                return alert('Cannot more than 18 images!');
                            }
                            var list = '<ul class="' + ul_class + '">';
                            each(files as file) {
                                list += '<li><img src="' + _.draw.canvas.fileToBlob(this) + '" /></li>';
                            }
                            list += '</ul>';
                            previewer.innerHTML = list;
                            previewer.files = files;
                        };
                        var failCallback = (file, errtype) {
                            switch (errtype) {
                                case 0:
                                    alert('Must Select Images!');
                                    break;
                                case 1:
                                    alert('Filesize OVER!');
                                    break;
                                case 2:
                                    alert('No Legal File Selected!');
                                    break;
                            };
                        };
                        var uploader = new _.async.Uploader(this.files, ['image/jpeg', 'image/pjpeg', 'image/gif', 'image/png'], ['jpg', 'png', 'gif'], editor.upload_maxsize);
                        uploader.isOnlyFilter = false;
                        uploader.checkType(doneCallback, failCallback);
                    }
                    input.click();
                }
            }
        },
        'workspaces': {
            'mousedown': {
                '.se-richarea': downrich
            },
            'mouseup': {
                '.se-statebar .se-imgfloat'(event) {
                    // console.log(event);
                    var float = _.dom.getAttr(this, 'data-float') || 'none',
                        img = event.data.selectedImage;
                    img.style.float = float;
                    // event.data.selection.restoreSelection();
                    event.data.onchange();
                },
                '.se-statebar .se-imgsize'(event) {
                    // console.log(event);
                    var size = _.dom.getAttr(this, 'data-size') || 'none';
                    inputs['imgsize'](event.data, size);
                    // event.data.selection.restoreSelection();
                    event.data.onchange();
                },
                '.se-statebar .se-table-addrow'(event) {
                    // console.log(event);
                    var editor = event.data,
                        table = editor.selectedTable,
                        row = editor.selectedTableRow,
                        len = row.cells.length;
                    _.dom.after(row, '<tr>' + _.str.repeat('<td>&nbsp;</td>', len) + '</tr>');
                    event.data.selection.restoreSelection();
                    event.data.onchange();
                },
                '.se-statebar .se-table-addcol'(event) {
                    // console.log(event);
                    var editor = event.data,
                        table = editor.selectedTable,
                        row = editor.selectedTableRow,
                        cell = editor.selectedTableCell,
                        index = _.dom.index(cell, row.cells);
                    each(table.rows as i, row) {
                        cell = row.cells[index] || row.cells[row.length - 1];
                        _.dom.after(row.cells[index], '<td>&nbsp;</td>');
                    }
                    event.data.selection.restoreSelection();
                    event.data.onchange();
                },
                '.se-richarea': muprich
            },
            'mouseout': {
                '.se-richarea': outrich
            },
            'keyup': {
                '.se-richarea': kuprich
            },
            'change': {
                '.se-statebar input'(event) {
                    // console.log(event);
                    var name = _.dom.getAttr(this, 'data-name');
                    if (_.util.isFn(inputs[name])) {
                        inputs[name](event.data, this);
                    }
                }
            }
        }
    };
}
