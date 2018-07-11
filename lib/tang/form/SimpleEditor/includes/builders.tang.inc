/*!
 * tanguage framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */

// dialogs = pandora.storage.get(new _.Identifier('EDITOR_DIALOGS').toString()),
var builders = void ns {
    var tooltypes = {};
    var toolbaritems = [
        ['bold', 'italic', 'underline', 'strikethrough'],
        ['fontsize', 'forecolor', 'backcolor'],
        ['createlink', 'unlink', 'inserttable', 'insertfile', 'insertvideo', 'insertimage', 'insertemoticon'],
        ['header', 'blockquote', 'insertunorderedlist', 'insertorderedlist'],
        ['justifyleft', 'justifycenter', 'justifyright', 'justifyfull'],
        ['removeformat', 'insertfragments']
    ],
    statusTypes = {
        fontstatus: [
            '<label>color: <input type="text" class="se-color-input" data-name="fontcolor" value="#000000"></label>'
        ],
        tablestatus: [
            '<label>width<input type="number" class="se-tablewidth-input" data-name="tablewidth" value="1"></label>',
            '<label>rows: <input class="se-rowslen" value="1" readonly></label>',
            '<i class="se-table-adddata se-table-addrow">Add Row</i>',
            '<label>cols: <input class="se-colslen" value="1" readonly></label>',
            '<i class="se-table-adddata se-table-addcol">Add Column</i>',
            '<label>border: <input type="number" class="se-border-input" data-name="tableborder" value="0"></label>'
        ],
        imagestatus: [
            '<label>width: <input type="number" class="se-imgwidth-input" data-name="imgwidth" value="1"></label>',
            '<label>height: <input type="number" class="se-imgheight-input" data-name="imgheight" value="1"></label>',
            '<label>border: <input type="number" class="se-border-input" data-name="imgborder" value="0"></label>',
            '<i class="se-imgsize" data-size="3">L</i>' +
            '<i class="se-imgsize" data-size="2">M</i>' +
            '<i class="se-imgsize" data-size="1">S</i>' +
            '<i class="se-imgsize" data-size="0">O</i>',
            '<i class="se-imgfloat" data-float="none">No Float</i>' +
            '<i class="se-imgfloat" data-float="left">Pull Left</i>' +
            '<i class="se-imgfloat" data-float="right">Pull Right</i>'
        ]
    },
    builders = {
        tools: {
            optionalitem(tool) {
                var html = '<div class="se-tool ' + tool + ' data-se-cmds" data-se-cmds="' + tool + '" title="' + tool + '"><i class="se-icon"></i>';
                html += creators[tool].call(this);
                html += '</div>';
                return html;
            },
            dialogitem(tool) {
                var html = '<div class="se-tool ' + tool + ' data-se-dialog" data-se-dialog="' + tool + '" title="' + tool + '"><i class="se-icon"></i>';
                html += creators[tool].call(this);
                html += '</div>';
                return html;
            },
            defaultitem(tool) {
                return '<div class="se-tool ' + tool + ' data-se-cmd" data-se-cmd="' + tool + '" title="' + tool + '"><i class="se-icon"></i></div>';
            }
        },
        initEl(elem, options, textarea) {
            var width, height;
            if (textarea) {
                width = textarea.offsetWidth;
                height = textarea.offsetHeight;
            } else {
                width = elem.offsetWidth;
                height = elem.offsetHeight;
            }
            if (options.width) {
                width = options.width;
            }
            if (options.height) {
                height = options.height;
            }
            _.dom.setStyle(elem, 'height', 'auto');
            return {
                Element: elem,
                width: width,
                height: height
            };
        },
        textarea(textarea) {
            var text,
                htmlclose = new _.dom.HTMLCloser();
            _.dom.setStyle(textarea, 'display', 'none');
            return {
                Element: textarea,
                getText() {
                    if (textarea.value) {
                        text = textarea.value;
                    } else {
                        text = textarea.innerHTML;
                    }
                    if (!text) {
                        text = '<div><br></div>';
                    }
                    return text;
                },
                setText(value) {
                    if (textarea.value) {
                        text = textarea.value = htmlclose.compile(value).replace(/_selected(="\w")?/, '');
                    } else {
                        text = textarea.innerHTML = htmlclose.compile(value).replace(/_selected(="\w")?/, '');
                    }
                    return text;
                }
            };
        },
        mainarea(options, text) {
            var width = this.cElement.width,
                mainarea = _.dom.create('div', this.cElement.Element, {
                    className: 'tang-simpleeditor',
                    style: {
                        'width': width,
                        'border-color': (options.border && options.border.color) || '#CCCCCC',
                        'border-style': (options.border && options.border.style) || 'solid',
                        'border-width': (options.border && options.border.width) || '1px'
                    }
                });
            mainarea.resetText = text;
            _.dom.setAttr(mainarea, 'data-se-id', this.uid);
            return mainarea;
        },
        workspace(mainarea, options, isBuildStateBar) {
            var width = this.cElement.width,
                height = this.cElement.height;
            this.richareas.push(_.dom.create('div', mainarea, {
                className: 'tangram se-richarea',
                placeholder: options.placeholder || '', // _.dom.getAttr(textarea.Element, 'placeholder'),
                contenteditable: 'true',
                spellcheck: 'false',
                talistenex: 1,
                style: {
                    'width': width - 10,
                    'min-height': height,
                    'height': height - 10,
                    'padding': '5px',
                    'outline': 'none'
                },
                innerHTML: mainarea.resetText
            }));
            this.loadmasks.push(_.dom.create('div', mainarea, {
                className: 'tangram se-loadmask',
                innerHTML: '<div class="se-spinner"><div class="se-rect1"></div><div class="se-rect2"></div><div class="se-rect3"></div><div class="se-rect4"></div><div class="se-rect5"></div></div>'
            }));
            if (isBuildStateBar) {
                var statusHTML =
                    '<div class="se-fontstatus" title="Font Style"><section>' +
                    statusTypes.fontstatus.join('</section><section>') +
                    '</section></div><div class="se-tablestatus" title="Table Style"><section>' +
                    statusTypes.tablestatus.join('</section><section>') +
                    '</section></div><div class="se-imagestatus" title="Image Style"><section>' +
                    statusTypes.imagestatus.join('</section><section>') +
                    '</section></div>';

                this.statebar = _.dom.create('div', mainarea, {
                    className: 'tangram se-statebar',
                    innerHTML: statusHTML
                });
            }

        },
        toolbar(options) {
            if (options.toolarea && _.util.isEl(options.toolarea)) {
                options.toolarea.innerHTML = '';
                _.dom.addClass(options.toolarea, 'tang-simpleeditor');
                _.dom.setStyle(options.toolarea, {

                    'border-color': (options.border && options.border.color) || '#CCCCCC',
                    'border-style': (options.border && options.border.style) || 'solid',
                    'border-width': (options.border && options.border.width) || '1px',
                    'overflow': 'visible'
                });
                var toolbar = _.dom.create('div', options.toolarea);
            } else {
                var toolbar = _.dom.create('div', this.mainareas[0], {
                    style: {
                        'width': this.cElement.width,
                        'border-bottom-color': (options.border && options.border.color) || '#CCCCCC',
                        'border-bottom-style': (options.border && options.border.style) || 'solid',
                        'border-bottom-width': (options.border && options.border.width) || '1px'
                    }
                });
            }

            var html = '';
            // clog builders, tooltypes;
            for (var i = 0; i < toolbaritems.length; i++) {
                html += '<div class="se-toolgroup">';
                // clog toolbaritems[i];
                for (var j = 0; j < toolbaritems[i].length; j++) {
                    // clog toolbaritems[i][j], tooltypes[toolbaritems[i][j]];
                    html += builders.tools[tooltypes[toolbaritems[i][j]]].call(this, toolbaritems[i][j]);
                }
                html += '</div>';
            }
            // html += '<div class="se-clear"></div>';
            toolbar.innerHTML = html;
            _.dom.setAttr(toolbar, 'class', 'tangram se-toolbar');
            return toolbar;
        },
        regMethod(object, rewrite) {
            _.extend(_.form.SimpleEditor.prototype, rewrite, object);
        },
        regCommand(cmd, handler) {
            if (conmands[cmd] === undefined) {
                conmands[cmd] = handler;
                tooltypes[cmd] = 'defaultitem';
            }
        },
        regCreater(cmd, handler, optional) {
            if (creators[cmd] === undefined) {
                if (_.util.isFn(handler)) {
                    creators[cmd] = handler;
                    if (optional) {
                        tooltypes[cmd] = 'optionalitem';
                    }
                } else if (_.util.isStr(handler) && builders.tools[handler]) {
                    tooltypes[cmd] = handler;
                }
            }
        },
        regDialog(cmd, handler) {
            if (dialogs[cmd] === undefined) {
                dialogs[cmd] = handler;
                tooltypes[cmd] = 'dialogitem';
            }
        }
    };

    return builders;
}