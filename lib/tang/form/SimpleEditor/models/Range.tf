@module;

/*!
 * tanguage framework source code
 *
 * class form.Range
 *
 * Date: 2017-04-06
 */

use $ util/;
use $ dom/;

var _ = pandora,
doc = root.document,
console = root.console;

namespace form {
    var isGetSelection = window.getSelection ? true : false,
    getRangeHtml = (range) {
        var div = doc.createElement('div')
        div.appendChild(range.cloneContents());
        return div.innerHTML;
    },
    getSelectionRange = (selection) {
        if (selection.rangeCount > 0) {
            this.originRange = selection.getRangeAt(0);

            this.commonNode = this.originRange.commonAncestorContainer;
            this.startNode = this.originRange.startContainer || selection.anchorNode;
            this.startOffset = this.originRange.startOffset || selection.anchorOffset;
            this.endNode = this.originRange.endContainer || selection.focusNode;
            this.endOffset = this.originRange.endOffset || selection.focusOffset;

            this.text = this.originRange.toString();
            this.html = getRangeHtml(this.originRange);

            this.type = selection.type;
            this.collapsed = this.originRange.collapsed;

        } else {
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
        }
    },
    docSelectionRange = () {
        this.originRange = doc.selection.createRange();

        this.commonNode = this.originRange.parentElement();
        this.startNode = null;
        this.startOffset = 0;
        this.endNode = null;
        this.endOffset = 0;

        this.text = this.originRange.text;
        this.html = this.originRange.htmlText;


        if (this.originRange.text == '') {
            this.type = 'Caret';
            this.collapsed = true;
        } else {
            this.type = 'Range';
            this.collapsed = false;
        }
    };

    class .Range {
        isGetSelection= isGetSelection;
        originRange= undefined;
        type= 'Caret';
        collapsed= true;
        commonNode= null;
        commonElem= null;
        startNode= null;
        startOffset= 0;
        endNode= null;
        endOffset= 0;
        text= '';
        html= '';
        _init(range) {
            if (isGetSelection) {
                var selection = window.getSelection();
                if (range && range.originRange) {
                    selection.removeAllRanges();
                    selection.addRange(range.originRange);
                }
                getSelectionRange.call(this, selection);
            } else {
                if (range.originRange && range.originRange.select) {
                    range.originRange.select();
                }
                docSelectionRange.call(this);
            }
            this.commonElem = this.commonNode && (_.util.isEl(this.commonNode) ? this.commonNode : this.commonNode.parentNode) || null;
        }
        isBelongTo(textElem) {
            if (this.commonNode) {
                var elem = this.commonNode.nodeType === 1 ? this.commonNode : this.commonNode.parentNode;
                return textElem && elem && (textElem === elem || _.dom.contain(textElem, elem))
            }
            return false;
        }
        isEmpty() {
            if (this.originRange && this.startNode) {
                if (this.startNode === this.endNode) {
                    if (this.startOffset === this.endOffset) {
                        return true;
                    }
                }
            }
            return false;
        }
        selectElem(elem, toStart, isContent) {
            if (!elem) {
                return
            }
            if (this.originRange.selectNode) {
                getSelectionRange.call(this, window.getSelection());
                if (isContent) {
                    this.originRange.selectNodeContents(elem);
                } else {
                    this.originRange.selectNode(elem);
                }
            } else if (this.originRange.insertNode) {
                this.insertElem(this.originRange.createContextualFragment(elem.outerHTML))
            } else if (range.pasteHTML) {
                this.originRange.pasteHTML(elem.outerHTML);
            }
            if (typeof toStart === 'boolean') {
                this.collapse(toStart);
            }
            return this;
        }
        selectInput(input, toStart) {
            if (input && typeof input.focus == 'function') {
                input.focus();
                this._init();
            }
            if (typeof toStart === 'boolean') {
                this.collapse(toStart);
            }
            return null;
        }
        collapse(toStart) {
            if (toStart == null) {
                // 默认为 false
                toStart = false;
            }
            if (window.getSelection) {
                if (this.originRange.collapse) {
                    this.originRange.collapse(toStart);
                } else {
                    var selection = window.getSelection();
                    if (toStart) {
                        selection.collapse(this.startNode, this.startOffset);
                    } else {
                        selection.collapse(this.endNode, this.endOffset);
                    }
                    getSelectionRange.call(this, selection);
                }
            } else if (this.originRange.select) {
                this.originRange.collapse(toStart);
                this.originRange.select();
            }
        }
        setEnd(node, offse) {
            if (this.originRange.setEnd) {
                this.originRange.setEnd(node, offset);
            }
            return this;
        }
        // 封装 doc.queryCommandValue
        queryCommandValue(name) {
            if (doc.queryCommandValue) {
                return doc.queryCommandValue(name);
            }
            return '';
        }

        // 封装 doc.queryCommandState
        queryCommandState(name) {
            if (doc.queryCommandState) {
                return doc.queryCommandState(name);
            }
            return false;
        }

        // 封装 doc.queryCommandSupported
        queryCommandSupported(name) {
            if (doc.queryCommandSupported) {
                return doc.queryCommandSupported(name);
            }
            return false;
        }
        execCommand(cmd, val, isDialog) {
            //console.log(this);
            isDialog = isDialog || false;
            if (isGetSelection) {
                doc.execCommand(cmd, isDialog, val);
            } else {
                this.originRange.execCommand(cmd, isDialog, val);
            }
            return this;
        }
        insert(text) {
            if (this.originRange.insertNode) {
                var fragment = this.originRange.createContextualFragment(text);
                this.originRange.deleteContents();
                this.originRange.insertNode(fragment);
            } else if (range.pasteHTML) {
                this.originRange.pasteHTML(text)
            }
        }
        changeCase(tolower) {
            if (this.html) {
                if (tolower) {
                    var text = this.html.toLowerCase();
                } else {
                    var text = this.html.toUpperCase();
                }

                if (this.originRange.insertNode) {
                    this.insertElem(this.originRange.createContextualFragment(text));
                    this.originRange.setStart(this.startNode, this.startOffset);
                } else if (range.pasteHTML) {
                    this.originRange.pasteHTML(text)
                }
            }
        }
        insertHTML(html) {

            // 保证传入的参数是 html 代码
            var test = /^<.+>$/.test(html)
            if (!test && !_.util.isWebkit()) {
                // webkit 可以插入非 html 格式的文字
                throw new Error('执行 insertHTML 命令时传入的参数必须是 html 格式')
            }

            if (this.queryCommandSupported('insertHTML')) {
                // W3C
                this.execCommand('insertHTML', html)
            } else if (this.originRange.insertNode) {
                // IE
                var fragment = this.originRange.createContextualFragment(html);
                this.originRange.deleteContents();
                this.originRange.insertNode(fragment);
            } else if (range.pasteHTML) {
                // IE <= 10
                this.originRange.pasteHTML(html)
            }
        }
        insertElem(elem) {
            if (this.originRange.insertNode) {
                this.originRange.deleteContents();
                this.originRange.insertNode(elem);
            }
        }
    }
}

this.module.exports = ..form.Range;