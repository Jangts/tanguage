/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 10 Aug 2018 04:01:30 GMT
 */
;
// tang.config({});
tang.init().block([
    '$_/util/',
    '$_/util/Color',
    '$_/dom/',
    '$_/dom/HTMLCloser',
    '$_/see/fa.css',
    '~style.css'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var query = _.dom.sizzle  || _.dom.selector;
    pandora.ns('form', function () {
        var isGetSelection = window.getSelection ? true : false;
        var getRangeHtml = function (range) {
            var div = doc.createElement('div');
            div.appendChild(range.cloneContents());
            return div.innerHTML;
        }
        var getSelectionRange = function (selection) {
            if (selection.rangeCount  > 0) {
                this.originRange = selection.getRangeAt(0);
                this.commonNode = this.originRange.commonAncestorContainer;
                this.startNode = this.originRange.startContainer  || selection.anchorNode;
                this.startOffset = this.originRange.startOffset  || selection.anchorOffset;
                this.endNode = this.originRange.endContainer  || selection.focusNode;
                this.endOffset = this.originRange.endOffset  || selection.focusOffset;
                this.text = this.originRange.toString();
                this.html = getRangeHtml(this.originRange);
                this.type = selection.type;
                this.collapsed = this.originRange.collapsed;
            }
            else {
                this.originRange = undefined;
                this.commonNode = null;
                this.startNode = null;
                this.startOffset = 0;
                this.endNode = null;
                this.endOffset = 0;
                this.text = '';
                this.html = '';
                this.type = 'Caret';
                this.collapsed = true;
            };
        }
        var docSelectionRange = function () {
            this.originRange = doc.selection.createRange();
            this.commonNode = this.originRange.parentElement();
            this.startNode = null;
            this.startOffset = 0;
            this.endNode = null;
            this.endOffset = 0;
            this.text = this.originRange.text;
            this.html = this.originRange.htmlText;
            if (this.originRange.text  == '') {
                this.type = 'Caret';
                this.collapsed = true;
            }
            else {
                this.type = 'Range';
                this.collapsed = false;
            };
        }
        var Range = pandora.declareClass({
            isGetSelection: isGetSelection,
            originRange: undefined,
            type: 'Caret',
            collapsed: true,
            commonNode: null,
            commonElem: null,
            startNode: null,
            startOffset: 0,
            endNode: null,
            endOffset: 0,
            text: '',
            html: '',
            _init: function (range) {
                if (isGetSelection) {
                    var selection = window.getSelection();
                    if (range  && range.originRange) {
                        selection.removeAllRanges();
                        selection.addRange(range.originRange);
                    }
                    getSelectionRange.call(this, selection);
                }
                else {
                    if (range.originRange  && range.originRange.select) {
                        range.originRange.select();
                    }
                    docSelectionRange.call(this);
                }
                this.commonElem = this.commonNode  && (_.util.isEl(this.commonNode) ? this.commonNode:this.commonNode.parentNode) || null;
            },
            isBelongTo: function (textElem) {
                if (this.commonNode) {
                    var elem = this.commonNode.nodeType  === 1 ? this.commonNode : this.commonNode.parentNode;
                    return textElem  && elem  && (textElem === elem || _.dom.contain(textElem, elem));
                }
                return false;
            },
            isEmpty: function () {
                if (this.originRange  && this.startNode) {
                    if (this.startNode  === this.endNode) {
                        if (this.startOffset  === this.endOffset) {
                            return true;
                        }
                    }
                }
                return false;
            },
            selectElem: function (elem, toStart, isContent) {
                if (!elem) {
                    return 
                }
                if (this.originRange.selectNode) {
                    getSelectionRange.call(this, window.getSelection());
                    if (isContent) {
                        this.originRange.selectNodeContents(elem);
                    }
                    else {
                        this.originRange.selectNode(elem);
                    }
                }
                else if (this.originRange.insertNode) {
                    this.insertElem(this.originRange.createContextualFragment(elem.outerHTML));
                }
                else if (range.pasteHTML) {
                    this.originRange.pasteHTML(elem.outerHTML);
                }
                if (typeof toStart  === 'boolean') {
                    this.collapse(toStart);
                }
                return this;
            },
            selectInput: function (input, toStart) {
                if (input && typeof input.focus  == 'function') {
                    input.focus();
                    this._init();
                }
                if (typeof toStart  === 'boolean') {
                    this.collapse(toStart);
                }
                return null;
            },
            collapse: function (toStart) {
                if (toStart  == null) {
                    toStart = false;
                }
                if (window.getSelection) {
                    if (this.originRange.collapse) {
                        this.originRange.collapse(toStart);
                    }
                    else {
                        var selection = window.getSelection();
                        if (toStart) {
                            selection.collapse(this.startNode, this.startOffset);
                        }
                        else {
                            selection.collapse(this.endNode, this.endOffset);
                        }
                        getSelectionRange.call(this, selection);
                    }
                }
                else if (this.originRange.select) {
                    this.originRange.collapse(toStart);
                    this.originRange.select();
                };
            },
            setEnd: function (node, offse) {
                if (this.originRange.setEnd) {
                    this.originRange.setEnd(node, offset);
                }
                return this;
            },
            queryCommandValue: function (name) {
                if (doc.queryCommandValue) {
                    return doc.queryCommandValue(name);
                }
                return '';
            },
            queryCommandState: function (name) {
                if (doc.queryCommandState) {
                    return doc.queryCommandState(name);
                }
                return false;
            },
            queryCommandSupported: function (name) {
                if (doc.queryCommandSupported) {
                    return doc.queryCommandSupported(name);
                }
                return false;
            },
            execCommand: function (cmd, val, isDialog) {
                isDialog = isDialog  || false;
                if (isGetSelection) {
                    doc.execCommand(cmd, isDialog, val);
                }
                else {
                    this.originRange.execCommand(cmd, isDialog, val);
                }
                return this;
            },
            insert: function (text) {
                if (this.originRange.insertNode) {
                    var fragment = this.originRange.createContextualFragment(text);
                    this.originRange.deleteContents();
                    this.originRange.insertNode(fragment);
                }
                else if (range.pasteHTML) {
                    this.originRange.pasteHTML(text);
                };
            },
            changeCase: function (tolower) {
                if (this.html) {
                    if (tolower) {
                        var text = this.html.toLowerCase();
                    }
                    else {
                        var text = this.html.toUpperCase();
                    }
                    if (this.originRange.insertNode) {
                        this.insertElem(this.originRange.createContextualFragment(text));
                        this.originRange.setStart(this.startNode, this.startOffset);
                    }
                    else if (range.pasteHTML) {
                        this.originRange.pasteHTML(text);
                    }
                };
            },
            insertHTML: function (html) {
                var test = /^<.+>$/.test(html);
                if (!test && !_.util.isWebkit()) {
                    throw new Error('执行 insertHTML 命令时传入的参数必须是 html 格式');
                }
                if (this.queryCommandSupported('insertHTML')) {
                    this.execCommand('insertHTML', html);
                }
                else if (this.originRange.insertNode) {
                    var fragment = this.originRange.createContextualFragment(html);
                    this.originRange.deleteContents();
                    this.originRange.insertNode(fragment);
                }
                else if (range.pasteHTML) {
                    this.originRange.pasteHTML(html);
                };
            },
            insertElem: function (elem) {
                if (this.originRange.insertNode) {
                    this.originRange.deleteContents();
                    this.originRange.insertNode(elem);
                };
            }
        });
        var Selection = pandora.declareClass({
            editor: null,
            range: null,
            _init: function (editor) {
                this.editor = editor;
            },
            restoreSelection: function () {
                if (this.range) {
                    this.range = new Range(this.range);
                }
                else {
                    this.createEmptyRange();
                };
            },
            getRange: function () {
                this.restoreSelection();
                return this.range;
            },
            saveRange: function (range) {
                if (!range) {
                    range = new Range();
                }
                else {
                    new Range(range);
                }
                var i = 0;
                var richareas = this.editor.richareas;
                for (i;i  < richareas.length;i++) {
                    if (range.isBelongTo(richareas[i])) {
                        this.range = range;
                        break;;
                    }
                }
                return this.range;
            },
            collapseRange: function (toStart) {
                if (this.range) {
                    this.range.collapse(toStart);
                }
                return this;
            },
            getSelectionText: function () {
                if (this.range) {
                    return this.range.text;
                }
                return '';
            },
            getSelectionContainerElem: function (range) {
                range = range  || this.range;
                if (range) {
                    var elem = range.commonNode;
                    return (elem != null) && (elem.nodeType === 1 ? elem:elem.parentNode);
                };
            },
            getSelectionStartElem: function (range) {
                range = range  || this.range;
                if (range) {
                    var elem = range.startNode;
                    return (elem != null) && (elem.nodeType === 1 ? elem:elem.parentNode);
                };
            },
            getSelectionEndElem: function (range) {
                range = range  || this.range;
                if (range) {
                    var elem = range.endNode;
                    return (elem != null) && (elem.nodeType === 1 ? elem:elem.parentNode);
                };
            },
            isSelectionEmpty: function () {
                if (this.range) {
                    return this.range.isEmpty();
                }
                return false;
            },
            createEmptyRange: function (index) {
                var editor = this.editor;
                var range = new Range();
                var elem = void 0;
                index = parseInt(index) || 0;
                range.selectInput(this.editor.richareas[index], false);
                this.collapseRange().saveRange(range);
                if (!this.isSelectionEmpty()) {
                    return;;
                }
                try {
                    if (_.util.isWebkit()) {
                        range.insertHTML('&#8203;');
                        range.setEnd(range.endNode, range.endOffset  + 1);
                        range.collapse(false);
                    }
                    else {
                        var elem = _.dom.createByString('<strong>&#8203;</strong>');
                        range.insertElem(elem);
                        this.range.selectElem(elem, false);
                    }
                }
                catch (ex) {};
            },
            createRangeByElem: function (elem, toStart, isContent) {
                if (!elem) {
                    return 
                }
                this.saveRange(this.range.selectElem(elem, toStart, isContent));
            }
        });
        var SimpleEditors = {};
        var conmands = {};
        var creators = {};
        var dialogs = {};
        var basePath = _.core.url() + 'form/SimpleEditor/';
        var parameters = {
            basePath: basePath,
            langPath: basePath  + 'Lang/',
            langType: 'zh_CN',
            minWidth: 650,
            minHeight: 100,
            emoticonsTable: 'default',
            emoticonsCodeFormat: '[CODE]'
        };
        var builders = (function () {
            var tooltypes = {};
            var toolbaritems = [['bold', 'italic', 'underline', 'strikethrough'], ['fontsize', 'forecolor', 'backcolor'], ['createlink', 'unlink', 'inserttable', 'insertfile', 'insertvideo', 'insertimage', 'insertemoticon'], ['header', 'blockquote', 'insertunorderedlist', 'insertorderedlist'], ['justifyleft', 'justifycenter', 'justifyright', 'justifyfull'], ['removeformat', 'insertfragments']];
            var statusTypes = {
                fontstatus: ['<label>color: <input type="text" class="se-color-input" data-name="fontcolor" value="#000000"></label>'],
                tablestatus: ['<label>width<input type="number" class="se-tablewidth-input" data-name="tablewidth" value="1"></label>', '<label>rows: <input class="se-rowslen" value="1" readonly></label>', '<i class="se-table-adddata se-table-addrow">Add Row</i>', '<label>cols: <input class="se-colslen" value="1" readonly></label>', '<i class="se-table-adddata se-table-addcol">Add Column</i>', '<label>border: <input type="number" class="se-border-input" data-name="tableborder" value="0"></label>'],
                imagestatus: ['<label>width: <input type="number" class="se-imgwidth-input" data-name="imgwidth" value="1"></label>', '<label>height: <input type="number" class="se-imgheight-input" data-name="imgheight" value="1"></label>', '<label>border: <input type="number" class="se-border-input" data-name="imgborder" value="0"></label>', '<i class="se-imgsize" data-size="3">L</i>'
     + '<i class="se-imgsize" data-size="2">M</i>'
     + '<i class="se-imgsize" data-size="1">S</i>'
     + '<i class="se-imgsize" data-size="0">O</i>', '<i class="se-imgfloat" data-float="none">No Float</i>'
     + '<i class="se-imgfloat" data-float="left">Pull Left</i>'
     + '<i class="se-imgfloat" data-float="right">Pull Right</i>']
            };
            var builders = {
                tools: {
                    optionalitem: function (tool) {
                        var html = '<div class="se-tool ' + tool  + ' data-se-cmds" data-se-cmds="' + tool  + '" title="' + tool  + '"><i class="se-icon"></i>';
                        html  += creators[tool].call(this);
                        html  += '</div>';
                        return html;
                    },
                    dialogitem: function (tool) {
                        var html = '<div class="se-tool ' + tool  + ' data-se-dialog" data-se-dialog="' + tool  + '" title="' + tool  + '"><i class="se-icon"></i>';
                        html  += creators[tool].call(this);
                        html  += '</div>';
                        return html;
                    },
                    defaultitem: function (tool) {
                        return '<div class="se-tool ' + tool  + ' data-se-cmd" data-se-cmd="' + tool  + '" title="' + tool  + '"><i class="se-icon"></i></div>';
                    }
                },
                initEl: function (elem, options, textarea) {
                    var width = void 0;var height = void 0;
                    if (textarea) {
                        width = textarea.offsetWidth;
                        height = textarea.offsetHeight;
                    }
                    else {
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
                        HTMLElement: elem,
                        width: width,
                        height: height
                    };
                },
                textarea: function (textarea) {
                    var text = void 0;
                    var htmlclose = new _.dom.HTMLCloser();
                    _.dom.setStyle(textarea, 'display', 'none');
                    return {
                        HTMLElement: textarea,
                        getText: function () {
                            if (textarea.value) {
                                text = textarea.value;
                            }
                            else {
                                text = textarea.innerHTML;
                            }
                            if (!text) {
                                text = '<div><br></div>';
                            }
                            return text;
                        },
                        setText: function (value) {
                            if (textarea.value) {
                                text = textarea.value = htmlclose.compile(value).replace(/_selected(="\w")?/, '');
                            }
                            else {
                                text = textarea.innerHTML = htmlclose.compile(value).replace(/_selected(="\w")?/, '');
                            }
                            return text;
                        }
                    };
                },
                mainarea: function (options, text) {
                    var width = this.cElement.width;
                    var mainarea = _.dom.create('div', this.cElement.HTMLElement, {
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
                workspace: function (mainarea, options, isBuildStateBar) {
                    var width = this.cElement.width;
                    var height = this.cElement.height;
                    this.richareas.push(_.dom.create('div', mainarea, {
                        className: 'tangram se-richarea',
                        placeholder: options.placeholder  || '',
                        contenteditable: 'true',
                        spellcheck: 'false',
                        talistenex: 1,
                        style: {
                            'width': width  - 10,
                            'min-height': height,
                            'height': height  - 10,
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
                        var statusHTML = '<div class="se-fontstatus" title="Font Style"><section>'
     + statusTypes.fontstatus.join('</section><section>')
     + '</section></div><div class="se-tablestatus" title="Table Style"><section>'
     + statusTypes.tablestatus.join('</section><section>')
     + '</section></div><div class="se-imagestatus" title="Image Style"><section>'
     + statusTypes.imagestatus.join('</section><section>')
     + '</section></div>';
                        this.statebar = _.dom.create('div', mainarea, {
                            className: 'tangram se-statebar',
                            innerHTML: statusHTML
                        });
                    };
                },
                toolbar: function (options) {
                    if (options.toolarea  && _.util.isEl(options.toolarea)) {
                        options.toolarea.innerHTML = '';
                        _.dom.addClass(options.toolarea, 'tang-simpleeditor');
                        _.dom.setStyle(options.toolarea, {
                            'border-color': (options.border && options.border.color) || '#CCCCCC',
                            'border-style': (options.border && options.border.style) || 'solid',
                            'border-width': (options.border && options.border.width) || '1px',
                            'overflow': 'visible'
                        });
                        var toolbar = _.dom.create('div', options.toolarea);
                    }
                    else {
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
                    for (var i = 0;i  < toolbaritems.length;i++) {
                        html  += '<div class="se-toolgroup">';
                        for (var j = 0;j  < toolbaritems[i].length;j++) {
                            html  += builders.tools[tooltypes[toolbaritems[i][j]]].call(this, toolbaritems[i][j]);
                        }
                        html  += '</div>';
                    }
                    toolbar.innerHTML = html;
                    _.dom.setAttr(toolbar, 'class', 'tangram se-toolbar');
                    return toolbar;
                },
                regMethod: function (object, rewrite) {
                    _.extend(_.form.SimpleEditor.prototype, rewrite, object);
                },
                regCommand: function (cmd, handler) {
                    if (conmands[cmd] === undefined) {
                        conmands[cmd] = handler;
                        tooltypes[cmd] = 'defaultitem';
                    };
                },
                regCreater: function (cmd, handler, optional) {
                    if (creators[cmd] === undefined) {
                        if (_.util.isFn(handler)) {
                            creators[cmd] = handler;
                            if (optional) {
                                tooltypes[cmd] = 'optionalitem';
                            }
                        }
                        else if (_.util.isStr(handler) && builders.tools[handler]) {
                            tooltypes[cmd] = handler;
                        };
                    };
                },
                regDialog: function (cmd, handler) {
                    if (dialogs[cmd] === undefined) {
                        dialogs[cmd] = handler;
                        tooltypes[cmd] = 'dialogitem';
                    };
                }
            };
            return builders;
        }());
        var checks = (function () {
            var rbgaToHexadecimal = function (rgba) {
                var arr = rgba.split(/\D+/);
                var num = Number(arr[1]) * 65536  + Number(arr[2]) * 256  + Number(arr[3]);
                var hex = num.toString(16);
                while (hex.length  < 6) {
                    hex = "0" + hex;
                }
                return "#" + hex.toUpperCase();
            }
            var inheritDecoration = function (node, textDecorationLine) {
                while (node  != undefined  && node  != null) {
                    var _inheritDecoration = _.dom.getStyle(node).textDecorationLine;
                    if (_inheritDecoration  && (_inheritDecoration == textDecorationLine)) {
                        return true;
                    }
                    node = node.parentNode;
                }
                return false;
            }
            var checkFontFormat = function (style) {
                var _arguments = arguments;
                var range = this.selection.range;
                if (range  && range.commonElem) {
                    pandora.each(query('.se-pick li',this.toolbar), function (i, el) {
                        _.dom.toggleClass(this, 'selected', false);
                    }, this);
                    selector = ", .fontsize .se-font[data-se-val=\"" + style.fontSize  + "\"]";
                    selector  += ", .forecolor .se-color[data-se-val=\"" + rbgaToHexadecimal(style.color) + "\"]";
                    selector  += ", .backcolor .se-color[data-se-val=\"" + rbgaToHexadecimal(style.backgroundColor) + "\"]";
                    pandora.each(query(selector,this.toolbar), function (i, el) {
                        _.dom.toggleClass(this, 'selected', true);
                    }, this);
                };
            }
            var checkFormat = function () {
                var _arguments = arguments;
                var range = this.selection.range;
                if (range  && range.commonElem) {
                    pandora.each(query('.bold, .italic, .underline, .strikethrough, .justifyleft, .justifycenter, .justifyright, .justifyfull, .blockquote, .insertunorderedlist, .insertorderedlist',this.toolbar), function (i, el) {
                        _.dom.toggleClass(this, 'active', false);
                    }, this);
                    var style = _.dom.getStyle(range.commonElem);
                    var selector = [];
                    if (style.fontWeight  === 'bold' || style.fontWeight  == 700) {
                        selector.push('.bold');
                    }
                    if (style.fontStyle  == 'italic') {
                        selector.push('.italic');
                    }
                    if (inheritDecoration(range.commonElem, 'line-through')) {
                        selector.push('.strikethrough');
                    }
                    if (inheritDecoration(range.commonElem, 'underline')) {
                        selector.push('.underline');
                    }
                    switch (style.textAlign) {
                        case 'start':;
                        case 'left':;
                        selector.push('.justifyleft');
                        break;;
                        case 'center':;
                        selector.push('.justifycenter');
                        break;;
                        case 'end':;
                        case 'right':;
                        selector.push('.justifyright');
                        break;;
                        case 'justify':;
                        selector.push('.justifyfull');
                        break;;
                    }
                    if (_.dom.getClosestParent(range.commonElem, 'ul', true)) {
                        selector.push('.insertunorderedlist');
                    }
                    if (_.dom.getClosestParent(range.commonElem, 'ol', true)) {
                        selector.push('.insertorderedlist');
                    }
                    if (_.dom.getClosestParent(range.commonElem, 'blockquote', true)) {
                        selector.push('.blockquote');
                    }
                    if (selector.length  > 0) {
                        pandora.each(query(selector.join(', '),this.toolbar), function (i, el) {
                            _.dom.toggleClass(this, 'active', true);
                        }, this);
                    }
                    checkFontFormat.call(this, style);
                };
            }
            var checkStatus = function () {
                var _arguments = arguments;
                if (this.statebar) {
                    var range = this.selection.range;
                    if (range  && range.commonElem) {
                        var style = _.dom.getStyle(range.commonElem);
                        var node = _.dom.getClosestParent(range.commonElem, 'table');
                        var row = _.dom.getClosestParent(range.commonElem, 'tr');
                        var cell = _.dom.getClosestParent(range.commonElem, 'td', true);
                        query('.se-fontstatus .se-color-input',this.statebar)[0].value = _.util.Color.rgbFormat(style.color, 'hex6');
                        if (node  && row) {
                            query('.se-tablestatus',this.statebar)[0].style.display = 'block';
                            var rowslen = node.rows.length;
                            var colslen = row.cells.length;
                            this.selectedTable = node;
                            this.selectedTableRow = row;
                            this.selectedTableCell = cell;
                            query('.se-tablestatus .se-tablewidth-input',this.statebar)[0].value = node.offsetWidth;
                            query('.se-tablestatus .se-rowslen',this.statebar)[0].value = rowslen;
                            query('.se-tablestatus .se-colslen',this.statebar)[0].value = colslen;
                            query('.se-tablestatus .se-border-input',this.statebar)[0].value = node.border  || 0;
                        }
                        else {
                            query('.se-tablestatus',this.statebar)[0].style.display = 'none';
                        }
                        if (this.selectedImage) {
                            query('.se-imagestatus',this.statebar)[0].style.display = 'block';
                            query('.se-imagestatus .se-imgwidth-input',this.statebar)[0].value = this.selectedImage.offsetWidth;
                            query('.se-imagestatus .se-imgheight-input',this.statebar)[0].value = this.selectedImage.offsetHeight;
                            query('.se-imagestatus .se-border-input',this.statebar)[0].value = this.selectedImage.border  || 0;
                            var nodes = query('.se-imagestatus .se-imgfloat', this.statebar);
                            var select = this.selectedImage.style.float ? this.selectedImage.style.float : 'none';
                            pandora.each(nodes, function (i, node) {
                                _.dom.toggleClass(node, 'active', false);
                            }, this);
                            if (_.arr.has(['left', 'right', 'none'], select) === false) {
                                select = 'none';
                            }
                            _.dom.toggleClass(query('.se-imagestatus .se-imgfloat[data-float=' + select + ']',this.statebar)[0], 'active', true);
                            if (!this.selectedImage.border) {
                                _.dom.setAttr(this.selectedImage, '_selected', '_selected');
                            }
                        }
                        else {
                            query('.se-imagestatus',this.statebar)[0].style.display = 'none';
                        }
                    }
                };
            }
            return {
                format: checkFormat,
                status: checkStatus
            };
        }());
        var events = (function () {
            var resetStateBar = function (editor) {
                var _arguments = arguments;
                pandora.each(editor.richareas, function (i, richarea) {
                    pandora.each(query('img[_selected=_selected]',richarea), function (i, elem) {
                        _.dom.removeAttr(elem, '_selected');
                    }, this);
                }, this);
                if (editor.statebar) {
                    query('.se-imagestatus',editor.statebar)[0].style.display = 'none';
                }
                if (event.target.tagName  === 'IMG') {
                    editor.selectedImage = event.target;
                }
                else {
                    editor.selectedImage = undefined;
                };
            }
            var downrich = function (event) {
                event.data.mousedown = true;
            }
            var outrich = function (event) {
                var editor = event.data;
                if (editor.mousedown  && (_.util.inArr(event.target, editor.richareas) !== false)) {
                    editor.mouseout = true;
                    resetStateBar(editor);
                };
            }
            var muprich = function (event) {
                var editor = event.data;
                editor.hideExtTools();
                editor.mousedown = false;
                resetStateBar(editor);
                editor.selection.saveRange();
                editor.onchange();
            }
            var kuprich = function (event) {
                var editor = event.data;
                resetStateBar(editor);
                editor.selection.saveRange();
                editor.onchange();
            }
            var inputs = {};
            return {
                'toolbar': {
                    'mouseup': {}
                },
                'workspaces': {
                    'mousedown': {
                        '.se-richarea': downrich
                    },
                    'mouseup': {
                        '.se-richarea': muprich
                    },
                    'mouseout': {
                        '.se-richarea': outrich
                    },
                    'keyup': {
                        '.se-richarea': kuprich
                    },
                    'change': {}
                }
            };
        }());
        pandora.declareClass('form.SimpleEditor', {
            cElement: null,
            mainareas: null,
            richareas: null,
            textareas: null,
            loadmasks: null,
            statebar: null,
            toolbar: null,
            selection: null,
            attachment_type: null,
            upload_maxsize: 1024  * 1024  * 20,
            transfer: null,
            _init: function (elem, options, textareas) {
                var _arguments = arguments;
                if (_.util.isEl(elem)) {
                    options = options  || {}
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
                    }
                    else {
                        this.cElement = builders.initEl(elem, options, textareas);
                    }
                    this.textareas = [];
                    if (textareas) {
                        if (_.util.isEl(textareas)) {
                            this.textareas = [builders.textarea(textareas)];
                        }
                        else if (_.util.isEls(textareas)) {
                            pandora.each(textareas, function (i, textarea) {
                                this.textareas.push(builders.textarea(textarea));
                            }, this);
                        }
                        else if (_.util.isArr(textareas)) {
                            pandora.each(textareas, function (i, textarea) {
                                if (_.util.isEl(textarea)) {
                                    this.textareas.push(builders.textarea(textarea));
                                };
                            }, this);
                        };
                    }
                    else {
                        pandora.each(query('textarea, input',this.cElement.HTMLElement), function (i, el) {
                            this.textareas.push(builders.textarea(el));
                        }, this);
                    }
                    this.mainareas = [];
                    if (this.textareas.length) {
                        pandora.each(this.textareas, function (i, textarea) {
                            this.mainareas.push(builders.mainarea.call(this, options, textarea.getText()));
                        }, this);
                    }
                    else {
                        var text = this.cElement.HTMLElement.innerHTML;
                        this.cElement.HTMLElement.innerHTML = '';
                        this.mainareas.push(builders.mainarea.call(this, options, text));
                    }
                    this.toolbar = builders.toolbar.call(this, options);
                    this.richareas = [];
                    this.loadmasks = [];
                    var isBuildStateBar = (this.mainareas.length === 1);
                    pandora.each(this.mainareas, function (i, mainarea) {
                        builders.workspace.call(this, mainarea, options, isBuildStateBar);
                    }, this);
                    this.selection = new Selection(this);
                    SimpleEditors[this.uid] = this.listen();
                }
                else {
                    return _.error('@param "elem" must be an element!');
                };
            },
            focus: function (index) {
                index = parseInt(index) || 0;
                this.selection.createEmptyRange(index);
            },
            execCommand: function (cmd, val) {
                cmd = cmd.toLowerCase();
                if (conmands[cmd]) {
                    conmands[cmd].call(this, val);
                }
                return this;
            },
            setValue: function (value, index) {
                index = parseInt(index) || 0;
                if (this.textareas[index]) {
                    value = this.textareas[index].setText(value);
                }
                this.richareas[index] && (this.richareas[index].innerHTML = value);
                this.selection.createEmptyRange(index);
                return this.onchange();
            },
            resetValue: function () {
                var _arguments = arguments;
                pandora.each(this.mainareas, function (index, mainarea) {
                    this.richareas[index].innerHTML = mainarea.resetText;
                }, this);
            },
            getValue: function (index) {
                var _arguments = arguments;
                index = parseInt(index) || 0;
                pandora.each(this.textareas, function (i, textarea) {
                    textarea.setText(this.richareas[i].innerHTML);
                }, this);
                return this.richareas[index] ? this.richareas[index].innerHTML : '';
            },
            getContentTxt: function (index) {
                index = parseInt(index) || 0;
                var _range = this.selection.getRange();
                this.selection.createEmptyRange(index);
                this.selection.range.execCommand('selectall');
                this.selection.saveRange();
                var _text = this.selection.range.text;
                this.selection.saveRange(_range);
                return _text;
            },
            getText: function (index) {
                index = parseInt(index) || 0;
                return this.selection.getSelectionText();
            },
            inForm: function (formElement) {
                return (formElement === this.cElement.HTMLElement) || _.dom.contain(formElement, this.cElement.HTMLElement);
            },
            hideExtTools: function () {
                var _arguments = arguments;
                pandora.each(query('.se-tool.data-se-dialog, .se-tool.data-se-cmds',this.toolbar), function (i, el) {
                    _.dom.toggleClass(el, 'active', false);
                }, this);
                return this;
            },
            showDialog: function (dialog) {
                this.hideExtTools();
                if (dialog) {
                    var button = arguments[1] || query('.se-tool[data-se-dialog=' + dialog + ']',this.toolbar)[0];
                    _.dom.toggleClass(button, 'active');
                }
                return this;
            },
            showPick: function (cmds) {
                this.hideExtTools();
                if (cmds) {
                    var button = arguments[1] || query('.se-tool[data-se-cmds=' + cmds + ']',this.toolbar)[0];
                    var list = query('.se-pick',button)[0];
                    if (_.dom.contain(this.mainareas[0], this.toolbar) && list) {
                        var height = _.dom.getHeight(this.richareas[0], 'box');
                        _.dom.toggleClass(button, 'active');
                        _.dom.setStyle(list, 'max-height', height  - 15);
                    }
                }
                return this;
            },
            listen: function () {
                var _arguments = arguments;
                var editor = this;
                var listeners = {
                    toolbar: new _.dom.Events(this.toolbar),
                    workspaces: new _.dom.Events(this.cElement.HTMLElement)
                };
                pandora.each(listeners, function (name, listener) {
                    pandora.each(events[name], function (eventType, handler) {
                        if (_.util.isFn(handler)) {
                            listener.push(eventType, null, editor, handler);
                        }
                        else if (_.util.isObj(handler)) {
                            pandora.each(handler, function (selector, cb) {
                                listener.push(eventType, selector, editor, cb);
                            }, this);
                        };
                    }, this);
                }, this);
                return this;
            },
            collapse: function (toStart) {
                this.selection.getRange().collapse(toStart);
            },
            onchange: function () {
                var _arguments = arguments;
                pandora.each(checks, function (check, handler) {
                    handler.call(this);
                }, this);
                return this;
            }
        });
        (function () {
            var presets = ['bold', 'italic', 'insertorderedlist', 'insertunorderedlist', 'justifycenter', 'justifyfull', 'justifyleft', 'justifyright', 'removeformat', 'strikethrough', 'underline', 'unlink'];
            pandora.each(presets, function (index, cmd) {
                builders.regCommand(cmd, function (val) {
                    this.selection.getRange().execCommand(cmd, val);
                    this.selection.saveRange();
                    this.onchange();
                });
            }, this);
        }());
        (function () {
            var defaults = {
                colorTable: [['#000000', '#444444', '#666666', '#999999', '#CCCCCC', '#EEEEEE', '#F3F3F3', '#FFFFFF'], 
                    [], ['#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9900FF', '#FF00FF'], 
                    [], ['#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#CFE2F3', '#D9D2E9', '#EAD1DC'], ['#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#9FC5E8', '#B4A7D6', '#D5A6BD'], ['#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6FA8DC', '#8E7CC3', '#C27BA0'], ['#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3D85C6', '#674EA7', '#A64D79'], ['#990000', '#B45F06', '#BF9000', '#38771D', '#134F5C', '#0B5394', '#351C75', '#741B47'], ['#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#073763', '#201211', '#4C1130']],
                fontSizeTable: {
                    '1': '10px',
                    '2': '13px',
                    '3': '16px',
                    '4': '18px',
                    '5': '24px',
                    '6': '33px',
                    '7': '48px'
                }
            };
            var currentElem = function (range) {
                if (range.commonElem  === range.commonNode) {
                    if (range.startNode  === range.commonNode) {
                        if (_.dom.contain(this.richarea, range.commonElem)) {
                            return range.commonElem;
                        }
                    }
                };
            }
            var commands = {};
            var creators = {};
            pandora.each(commands, function (cmd, handler) {
                builders.regCommand(cmd, handler);
            }, this);
            pandora.each(creators, function (cmd, handler) {
                builders.regCreater(cmd, handler, true);
            }, this);
        }());
        (function () {
            var commands = {
                header: function (val) {
                    this.selection.getRange().execCommand('formatblock', '<' + val  + '>');
                },
                h1: function (val) {
                    this.selection.getRange().execCommand('formatblock', '<h1>');
                },
                h2: function (val) {
                    this.selection.getRange().execCommand('formatblock', '<h2>');
                },
                h3: function (val) {
                    this.selection.getRange().execCommand('formatblock', '<h3>');
                },
                h4: function (val) {
                    this.selection.getRange().execCommand('formatblock', '<h4>');
                },
                h5: function (val) {
                    this.selection.getRange().execCommand('formatblock', '<h5>');
                },
                h6: function (val) {
                    this.selection.getRange().execCommand('formatblock', '<h6>');
                }
            };
            pandora.each(commands, function (cmd, handler) {
                builders.regCommand(cmd, handler);
            }, this);
            builders.regCreater('header', function () {
                var html = '<ul class="se-pick">';
                for (var i = 1;i  < 7;i++) {
                    html  += '<li class="se-h' + i  + ' data-se-cmd" data-se-cmd="header" data-se-val="h' + i  + '"><h' + i  + '>Header ' + i  + '</h' + i  + '></li>';
                }
                html  += '</ul>';
                return html;
            }, true);
        }());
        (function () {
            builders.regMethod('createLink', function (val) {
                return this.execCommand('createlink', val);
            });
            builders.regCommand('createlink', function (val) {
                var _arguments = arguments;
                if (val  && _.util.isUrl(val.url)) {
                    var url = 'http://temp.';
                    url  += new _.Identifier();
                    url  += '.com';
                    if (this.selection.getRange().type  === 'Caret') {
                        this.execCommand('insert', val.url);
                    }
                    this.selection.getRange().execCommand('createlink', url);
                    this.selection.collapseRange();
                    var a = query('a[href="' + url  + '"]');
                    pandora.each(a, function (_index, el) {
                        this.href = val.url;
                        if (val.isNew) {
                            this.target = '_blank';
                        };
                    }, this);
                    this.selection.restoreSelection();
                    this.onchange();
                }
                return this;
            });
            builders.regCreater('createlink', function () {
                var html = '<dialog class="se-dialog">';
                html  += '<div class="se-url">';
                html  += '<label><i>Enter URL</i><input type="text" class="se-input createlink" placeholder="http://www.yangram.com/tanguage/" /></label>';
                html  += '</div>';
                html  += '<div class="se-check">';
                html  += '<label><input type="checkbox" class="se-checkbox" checked="checked">Open in new tab</label>';
                html  += '</div>';
                html  += '<div class="se-btns">';
                html  += '<button type="button" class="data-se-cmd" data-se-cmd="createlink">OK</button>';
                html  += '</div>';
                html  += '</dialog>';
                return html;
            });
            builders.regDialog('createlink', function (btn) {
                var dialog = _.dom.getClosestParent(btn, 'dialog');
                var input = query('.se-url .se-input',dialog)[0];
                var checkbox = query('.se-check .se-checkbox',dialog)[0];
                if (input  && input.value  != '') {
                    return {
                        url: input.value,
                        isNew: checkbox  && checkbox.checked
                    };
                }
                return null;
            });
        }());
        (function () {
            var commands = {};
            builders.regMethod('insertHTM', function (val) {
                return this.execCommand('insert', val);
            });
            pandora.each(commands, function (cmd, handler) {
                builders.regCommand(cmd, handler);
            }, this);
        }());
        (function () {
            builders.regMethod('insertTable', function (val) {
                return this.execCommand('inserttable', val);
            });
            builders.regCommand('inserttable', function (val) {
                if (val) {
                    var rows = parseInt(val.rows) || 1;
                    var columns = parseInt(val.columns) || 1;
                    if (val.width  && parseInt(val.width)) {
                        var html = '<table data-se-temp width="' + parseInt(val.width) + val.unit  + '"><tbody>';
                    }
                    else {
                        var html = '<table data-se-temp><tbody>';
                    }
                    for (var r = 0;r  < rows;r++) {
                        html  += '<tr>';
                        for (var c = 0;c  < columns;c++) {
                            html  += '<td>&nbsp;</td>';
                        }
                        html  += '</tr>';
                    }
                    html  += '</tbody></table>';
                    this.execCommand('insert', html);
                    var table = query('table[data-se-temp]')[0];
                    _.dom.removeAttr(table, 'data-se-temp');
                    window.getSelection  && window.getSelection().selectAllChildren(query('td',table)[0]);
                    this.selection.saveRange().collapse(true);
                    this.onchange();
                }
                return this;
            });
            builders.regCreater('inserttable', function () {
                var html = '<dialog class="se-dialog">';
                html  += '<div class="se-attr"><div class="se-attr-left">';
                html  += '<label><i class="size">Size</i><input type="number" class="se-table-rows" placeholder="1"></label>';
                html  += '<span>×</span><input type="number" class="se-table-columns" placeholder="1">';
                html  += '</div><div class="se-attr-right">';
                html  += '<label><i>Width</i><input type="number" class="se-table-width" placeholder="100"></label>';
                html  += '<select class="se-table-unit">';
                html  += '<option value="%" selected="selected">%</option>';
                html  += '<option value="">px</option>';
                html  += '</select></div></div>';
                html  += '<div class="se-btns">';
                html  += '<button type="button" class="data-se-cmd" data-se-cmd="inserttable">OK</button>';
                html  += '</div>';
                html  += '</dialog>';
                return html;
            });
            builders.regDialog('inserttable', function (btn) {
                var dialog = _.dom.getClosestParent(btn, 'dialog');
                var rowsInput = query('.se-attr .se-table-rows',dialog)[0];
                var columnsInput = query('.se-attr .se-table-columns',dialog)[0];
                var widthInput = query('.se-attr .se-table-width',dialog)[0];
                var unitInput = query('.se-attr .se-table-unit',dialog)[0];
                if (rowsInput  && columnsInput) {
                    return {
                        rows: rowsInput.value  == '' ? 1 : rowsInput.value,
                        columns: columnsInput.value  == '' ? 1 : columnsInput.value,
                        width: widthInput.value  == '' ? null : widthInput.value,
                        unit: unitInput.value
                    };
                }
                return null;
            });
        }());
        (function () {
            builders.regMethod('insertFile', function (val, name) {
                return this.execCommand('insertfile', [name, val]);
            });
            builders.regCommand('insertfile', function (file) {
                var name = file[0];
                var val = file[1];
                if (_.util.isStr(val)) {
                    name = name  || this.options.aaa;
                    if (_.util.isStr(name)) {
                        var html = '<a href="' + val  + '" target="_blank" title="click to download" class="se-attachment">' + name  + '</a><br />';
                    }
                    else {
                        var html = 'Attachment : <a href="' + val  + '" target="_blank" title="click to download" class="se-attachment">' + val  + '</a><br />';
                    }
                    this.execCommand('insert', html);
                    this.collapse();
                    return this;
                }
                return this;
            });
            builders.regCreater('insertfile', function () {
                var html = '<dialog class="se-dialog">';
                html  += '<div class="se-aaa">';
                html  += '<label><i>Alias</i><input type="text" class="se-input" placeholder="Enter Attachment Anchor Alias" /></label>';
                html  += '</div>';
                html  += '<div class="se-url">';
                html  += '<label><i>File URL</i><input type="text" class="se-input" placeholder="Enter URL" /></label>';
                html  += '</div>';
                html  += '<input type="file" class="se-files" value="" hidden="" />';
                html  += '<div class="se-btns">';
                html  += '<input type="button" class="data-se-cmd" data-se-cmd="insertfile" value="Insert Url"/>';
                html  += '<input type="button" class="data-se-cmd" data-se-cmd="uploadfile" value="Or Upload"/>';
                html  += '</div>';
                html  += '</dialog>';
                return html;
            });
            builders.regDialog('insertfile', function (btn) {
                var dialog = _.dom.getClosestParent(btn, 'dialog');
                var n_input = query('.se-aaa .se-input',dialog)[0];
                var v_input = query('.se-url .se-input',dialog)[0];
                if (v_input  && v_input.value) {
                    return [n_input && n_input.value, v_input.value];
                }
                return null;
            });
            builders.regDialog('uploadfile', function (btn) {
                var dialog = _.dom.getClosestParent(btn, 'dialog');
                var input = query('.se-files',dialog)[0];
                var that = this;
                input.onchange = function () {
                    var _arguments = arguments;
                    var file = this.files[0];
                    if (that.attachment_type) {
                        var reg = new RegExp('\.(' + that.attachment_type.join('|') + ')$', i);
                        if (!reg.test(file)) {
                            return alert('Unsupported File Format');
                        }
                    }
                    if (that.upload_maxsize) {
                        if (file.size  > that.upload_maxsize) {
                            return alert('Exceed Maximum Size Allowed Upload');
                        }
                    }
                    if (_.util.isFn(that.transfer)) {
                        that.transfer([file], function (val, failed) {
                            var _arguments = arguments;
                            if (failed) {
                                alert('attachment upload failed');
                            }
                            else {
                                var n_input = query('.se-aaa .se-input',dialog)[0];
                                if (n_input  && n_input.value) {
                                    that.insertFile(val[0], n_input.value);
                                }
                                else {
                                    that.insertFile(val[0], file.name);
                                }
                            }
                            pandora.each(that.loadmasks, function (i, loadmask) {
                                _.dom.toggleClass(loadmask, 'on', false);
                            }, this);
                        });
                        pandora.each(that.loadmasks, function (i, loadmask) {
                            _.dom.toggleClass(loadmask, 'on', true);
                        }, this);
                    }
                    else {
                        alert('No Upload Configuration');
                    };
                }
                input.click();
            });
        }());
        (function () {
            builders.regMethod('insertImage', function (val) {
                return this.execCommand('insertimage', val);
            });
            builders.regCommand('insertimage', function (val) {
                if (_.util.isStr(val)) {
                    var html = '<img src="' + val  + '" />';
                    this.execCommand('insert', html);
                    this.collapse();
                    return this;
                }
                if (_.util.isArr(val)) {
                    var html = '';
                    for (var i = 0;i  < val.length;i++) {
                        html  += '<img src="' + val[i] + '" />';
                    }
                    this.execCommand('insert', html);
                    this.collapse();
                }
                return this;
            });
            builders.regCreater('insertimage', function () {
                var html = '<dialog class="se-dialog">';
                html  += '<div class="se-url">';
                html  += '<label><i>Enter URL</i><input type="text" class="se-input" placeholder="Image URL" /></label>';
                html  += '</div>';
                html  += '<input type="file" class="se-files" value="" hidden="" multiple />';
                html  += '<div class="se-show"><span>click to upload</span></div>';
                html  += '<div class="se-btns">';
                html  += '<input type="button" class="data-se-cmd" data-se-cmd="insertimage" value="Insert Web Picture"/>';
                html  += '<input type="button" class="data-se-cmd" data-se-cmd="uploadimage" value="Upload And Insert"/>';
                html  += '</div>';
                html  += '</dialog>';
                return html;
            });
            builders.regDialog('insertimage', function (btn) {
                var dialog = _.dom.getClosestParent(btn, 'dialog');
                var input = query('.se-url .se-input',dialog)[0];
                if (input  && input.value) {
                    return [input.value];
                }
                return null;
            });
            builders.regDialog('uploadimage', function (btn) {
                var _arguments = arguments;
                var dialog = _.dom.getClosestParent(btn, 'dialog');
                var images = query('.se-show',dialog)[0];
                var files = images.files;
                if (files  && files.length  > 0) {
                    var that = this;
                    if (_.util.isFn(this.transfer)) {
                        this.transfer(files, function (val, failed) {
                            var _arguments = arguments;
                            if (failed) {
                                alert(failed  + 'pictures upload failed');
                            }
                            that.execCommand('insertimage', val);
                            pandora.each(that.loadmasks, function (i, loadmask) {
                                _.dom.toggleClass(loadmask, 'on', false);
                            }, this);
                        });
                        pandora.each(that.loadmasks, function (i, loadmask) {
                            _.dom.toggleClass(loadmask, 'on', true);
                        }, this);
                    }
                    else {
                        var url = void 0;
                        pandora.each(files, function (i, file) {
                            _.draw.canvas.fileToBase64(file, function (url) {
                                that.execCommand('insertimage', url);
                            });
                        }, this);
                    }
                    images.files = undefined;
                };
            });
        }());
        (function () {
            builders.regMethod('insertVideo', function (val) {
                return this.execCommand('insertvideo', val);
            });
            var videoHTML = {};
            builders.regCommand('insertvideo', function (val) {
                if (val) {
                    if (val.code  && val.code  != '') {
                        this.execCommand('insert', val.code);
                        this.collapse();
                        return this;
                    }
                    if (val.url) {
                        var html = videoHTML[val.type || 'swf'](val.url, val.width, val.height);
                        this.execCommand('insert', html);
                        this.collapse();
                    }
                }
                return this;
            });
            builders.regCreater('insertvideo', function () {
                var html = '<dialog class="se-dialog">';
                html  += '<textarea class="se-code" placeholder="Embedded code"></textarea>';
                html  += '<div class="se-url">';
                html  += '<label><i>Enter URL</i><input type="text" class="se-input" placeholder="Video URL" /></label>';
                html  += '</div>';
                html  += '<div class="se-attr"><div class="se-attr-left">';
                html  += '<label><i class="size">Size</i><input type="number" class="se-vidoe-width" placeholder="640"></label>';
                html  += '<span>×</span><input type="number" class="se-vidoe-height" placeholder="480">';
                html  += '</div><div class="se-attr-right">';
                html  += '<label><i>Type</i><select class="se-vidoe-type"></label>';
                html  += '<option value="swf" selected="selected">swf</option>';
                html  += '<option value="webm">webm</option>';
                html  += '<option value="mp4">mp4</option>';
                html  += '<option value="ogg">ogg</option>';
                html  += '</select></div></div>';
                html  += '<div class="se-btns">';
                html  += '<button type="button" class="data-se-cmd" data-se-cmd="insertvideo">OK</button>';
                html  += '</div>';
                html  += '</dialog>';
                return html;
            });
            builders.regDialog('insertvideo', function (btn) {
                var dialog = _.dom.getClosestParent(btn, 'dialog');
                var textarea = query('.se-code',dialog)[0];
                if (textarea  && textarea.value  != '') {
                    return {
                        code: textarea.value
                    };
                }
                var input = query('.se-url .se-input',dialog)[0];
                var widthInput = query('.se-attr .se-vidoe-width',dialog)[0];
                var heightInput = query('.se-attr .se-vidoe-height',dialog)[0];
                var typeInput = query('.se-attr .se-vidoe-type',dialog)[0];
                if (input  && input.value  != '') {
                    return {
                        url: input.value,
                        type: typeInput.value,
                        width: widthInput.value  == '' ? null : widthInput.value,
                        height: heightInput.value  == '' ? null : heightInput.value
                    };
                }
                return null;
            });
        }());
        (function () {
            var codesFragments = [];
            builders.regCommand('insertfragments', function (val) {
                if (val  && codesFragments[val]) {
                    this.execCommand('insert', codesFragments[val]);
                }
                return this;
            });
            builders.regCreater('insertfragments', function () {
                var _arguments = arguments;
                var fragments = this.options.fragments  || [];
                if (fragments.length) {
                    var html = '<ul class="se-pick">';
                    pandora.each(fragments, function (i, fragment) {
                        codesFragments.push(fragment.code);
                        html  += '<li class="se-font data-se-cmd" data-se-cmd="insertfragments" data-se-val="' + i  + '">' + fragment.name  + '</li>';
                    }, this);
                    html  += '</ul>';
                    return html;
                }
                return '';
            }, true);
        }());
        (function () {
            var emoticons = {};
            builders.regMethod('insertEmoticon', function (val) {
                return this.execCommand('insertemoticon', val);
            });
            builders.regCommand('insertemoticon', function (val) {
                if (val  && val.pack  && val.name) {
                    if (emoticons[val.pack] && emoticons[val.pack][val.name]) {
                        if (this.options.emoticonsType  == 'code') {
                            var code = val.pack  + '/' + val.name;
                            var codeFormat = this.options.emoticonsCodeFormat  || parameters.emoticonsCodeFormat;
                            code = codeFormat.replace('CODE', code);
                            this.execCommand('insert', code);
                        }
                        else {
                            var src = parameters.basePath  + 'emoticons/' + val.pack  + '/' + emoticons[val.pack][val.name];
                            var html = '<img src="' + src  + '" class="se-emoticon" />';
                            this.execCommand('insert', html);
                        }
                        this.collapse();
                    }
                }
                return this;
            });
            builders.regCreater('insertemoticon', function () {
                var pack = this.options.emoticonsTable  && emoticons[this.options.emoticonsTable] ? this.options.emoticonsTable : parameters.emoticonsTable;
                var emtb = emoticons[pack];
                var path = parameters.basePath  + 'emoticons/' + pack  + '/';
                var html = '<dialog class="se-dialog"><ul class="se-emoticons tang se-emoticons-' + pack  + '">';
                for (var i in emtb) {
                    html  += '<li class="se-emoticon data-se-cmd" data-se-cmd="insertemoticon" data-se-val="' + pack  + ', ' + i  + '" title="' + i  + '"><img src="' + path  + emtb[i] + '"></li>';
                }
                html  += '</ul></dialog>';
                return html;
            });
            builders.regDialog('insertemoticon', function (val) {
                if (val) {
                    var arr = val.split(/,\s*/);
                    if (arr.length  > 1) {
                        return {
                            pack: arr[0],
                            name: arr[1]
                        };
                    }
                }
                return null;
            });
            function regEmoticon (theme, images) {
                if (emoticons[theme] === undefined) {
                    emoticons[theme] = images;
                };
            }
            (function () {
                regEmoticon('default', {
                    '微笑': 'wx.gif',
                    '晕': 'y.gif',
                    '心花怒放': 'xhnf.gif',
                    '鼓掌': 'gz.gif',
                    '哈欠': 'hax.gif',
                    '憨笑': 'sx.gif',
                    '汗': 'han.gif',
                    '吃惊': 'cj.gif',
                    '鄙视': 'bs.gif',
                    '闭嘴': 'bz.gif',
                    '呲牙': 'cy.gif',
                    '害羞': 'hx.gif',
                    '衰': 'shuai.gif',
                    '偷笑': 'tx.gif',
                    '折磨': 'zm.gif',
                    '难过': 'ng.gif',
                    '示爱': 'sa.gif',
                    '可爱': 'ka.gif',
                    '泪': 'lei.gif',
                    '酷': 'cool.gif'
                });
            }());
        }());
        var careatEditor = function (elem, options) {
            return new _.form.SimpleEditor(elem, options);
        }
        var careatEditors = function (selector, options) {
            var _arguments = arguments;
            var editors = [];
            pandora.each(query(selector), function (i, el) {
                editors.push(_.form.careatEditor(el, options));
            }, this);
            return editors;
        }
        var getEditorById = function (id) {
            return id  && SimpleEditors[id];
        }
        return {
            careatEditor: careatEditor,
            careatEditors: careatEditors,
            getEditorById: getEditorById
        }
    });
    
});
//# sourceMappingURL=SimpleEditor.js.map