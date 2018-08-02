/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 01:36:16 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/util/',
    '$_/dom/',
    '$_/dom/Template'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var app = pandora.ns('app', {});
    var isStr = imports['$_/util/'] && imports['$_/util/']['isStr'];
    var Events = imports['$_/dom/'] && imports['$_/dom/']['Events'];
    var create = imports['$_/dom/'] && imports['$_/dom/']['create'];
    var selector = imports['$_/dom/'] && imports['$_/dom/']['selector'];
    var setStyle = imports['$_/dom/'] && imports['$_/dom/']['setStyle'];
    var getStyle = imports['$_/dom/'] && imports['$_/dom/']['getStyle'];
    var getSize = imports['$_/dom/'] && imports['$_/dom/']['getSize'];
    var addClass = imports['$_/dom/'] && imports['$_/dom/']['addClass'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console, location = root.location;
    var Abstract = pandora.declareClass({
        disabled: false,
        protect: true,
        Element: undefined,
        document: undefined,
        vertical: undefined,
        horizontal: undefined,
        buttonUp: undefined,
        buttonRight: undefined,
        buttonDown: undefined,
        buttonLeft: undefined,
        horizontalRail: undefined,
        horizontalDragger: undefined,
        verticalRail: undefined,
        verticalDragger: undefined,
        resize: function () {
            if (this.Element) {
                this.document = this.document || this.Element;
                this.amount();
            }
            return this;
        },
        amount: function () {
            if (this.horizontal) {
                this.WinWidth = parseInt(getStyle(this.Element, 'width'));
                this.DocWidth = getSize(this.document, 'box').width;
                this.documentLeft = this.style(this.document, 'left', getStyle(this.document, 'left') || 0);
                if (this.buttonLeft && this.buttonRight) {
                    this.RailWidth = this.style(this.horizontalRail, 'width', this.WinWidth - parseInt(getStyle(this.buttonLeft, 'width')) - parseInt(getStyle(this.buttonRight, 'width')));
                }
                else {
                    this.RailWidth = this.style(this.horizontalRail, 'width', this.WinWidth);
                }
                this.DragWidth = this.style(this.horizontalDragger, 'width', parseInt(getStyle(this.horizontalRail, 'width')) * this.WinWidth/this.DocWidth);
                this.LeftMin = this.WinWidth - this.DocWidth;
                this.DraggerLeft = this.style(this.horizontalDragger, 'left', Math.abs(this.documentLeft/this.DocWidth * this.RailWidth));
                this.DraggerLeftMax = this.RailWidth - this.DragWidth;
                if (this.RailWidth <= this.DragWidth) {
                    this.horizontalActived = false;
                    this.toLeft();
                    
                    setStyle(this.horizontal, 'display', 'none');
                }
                else {
                    this.horizontalActived = true;
                    
                    setStyle(this.horizontal, 'display', 'block');
                }
            }
            else {
                this.horizontalActived = false;
            }
            if (this.vertical) {
                this.WinHeight = parseInt(getStyle(this.Element, 'height'));
                this.DocHeight = getSize(this.document, 'box').height;
                this.documentTop = this.style(this.document, 'top', parseInt(getStyle(this.document, 'top')) || 0);
                if (this.buttonUp && this.buttonDown) {
                    this.RailHeight = this.style(this.verticalRail, 'height', this.WinHeight - parseInt(getStyle(this.buttonUp, 'height')) - parseInt(getStyle(this.buttonDown, 'height')));
                }
                else {
                    this.RailHeight = this.style(this.verticalRail, 'height', this.WinHeight);
                }
                this.DragHeight = this.style(this.verticalDragger, 'height', parseInt(getStyle(this.verticalRail, 'height')) * this.WinHeight/this.DocHeight);
                this.TopMin = this.WinHeight - this.DocHeight;
                this.DraggerTop = this.style(this.verticalDragger, 'top', Math.abs(this.documentTop/this.DocHeight * this.RailHeight));
                this.DraggerTopMax = this.RailHeight - this.DragHeight;
                if (this.RailHeight <= this.DragHeight) {
                    this.verticalActived = false;
                    this.toTop();
                    
                    setStyle(this.vertical, 'display', 'none');
                }
                else {
                    this.verticalActived = true;
                    
                    setStyle(this.vertical, 'display', 'block');
                }
            }
            else {
                this.verticalActived = false;
            }
            return this;
        },
        toTop: function () {
            this.documentTop = this.style(this.document, 'top', 0);
            this.DraggerTop = this.style(this.verticalDragger, 'top', 0);
            return this;
        },
        toBottom: function () {
            this.documentTop = this.style(this.document, 'top', this.WinHeight - this.DocHeight < 0 ? this.WinHeight - this.DocHeight : 0);
            this.DraggerTop = this.style(this.verticalDragger, 'top', Math.abs(this.documentTop/this.DocHeight * this.RailHeight));
            return this;
        },
        toLeft: function () {
            this.documentLeft = this.style(this.document, 'left', 0);
            this.DraggerLeft = this.style(this.horizontalDragger, 'left', 0);
            return this;
        },
        toRight: function () {
            this.documentLeft = this.style(this.document, 'left', this.WinWidth - this.DocWidth < 0 ? this.WinWidth - this.DocWidth : 0);
            this.DraggerLeft = this.style(this.horizontalDragger, 'left', Math.abs(this.documentLeft/this.DocWidth * this.RailWidth));
            return this;
        },
        style: function (elem, prop, val) {
            
            setStyle(elem, prop, val);
            return val;
        },
        bind: function () {
            var that = this;
            var _mousewheel = doc.onmousewheel;
            new Events(this.Element)
                .push('resize', null, null, function () {
                    that.resize;
                })
                .push('mousewheel', null, null, function (event) {
                    var elem = event.target;
                    if (that.protect) {
                        doc.onmousewheel = function (event) {
                            return false;
                        }
                    }
                    that.mousewheel.call(that, event);
                })
                .push('mouseout', null, null, function () {
                    doc.onmousewheel = _mousewheel;
                });
            if (this.vertical) {
                new Events(this.verticalDragger)
                    .push('mousedown', null, null, function () {
                        doc.body.onselectstart = doc.body.ondrag = function (event) {
                            return false;
                        }
                        that.verticalDraggerActived = true;
                        this.y = event.y;
                    });
                new Events(this.verticalRail)
                    .push('click', null, null, function (event) {
                        that.DraggerTop = that.style(that.verticalDragger, 'top', Math.abs(event.offsetY/that.RailHeight * that.DraggerTopMax));
                        that.documentTop = that.style(that.document, 'top', event.offsetY/that.RailHeight * that.TopMin);
                    });
            }
            if (this.horizontal) {
                new Events(this.horizontalDragger)
                    .push('mousedown', null, null, function (event) {
                        doc.body.onselectstart = doc.body.ondrag = function () {
                            return false;
                        }
                        that.horizontalDraggerActived = true;
                        this.x = event.x;
                    });
                new Events(this.horizontal)
                    .push('click', null, null, function () {
                        that.DraggerLeft = that.style(that.horizontalDragger, 'left', Math.abs(event.offsetX/that.RailWidth * that.DraggerLeftMax));
                        that.documentLeft = that.style(that.document, 'left', event.offsetX/that.RailWidth * that.LeftMin);
                    });
            }
            new Events(document)
                .push('mouseup', null, null, function () {
                    that.verticalDraggerActived = that.horizontalDraggerActived = doc.body.onselectstart = doc.body.ondrag = false;
                })
                .push('mousemove', null, null, function (event) {
                    that.mousemove.call(that, event);
                });
            return this;
        },
        mousemove: function (e) {
            if (!this.disabled) {
                if (this.verticalDraggerActived) {
                    var moveY = event.y - this.verticalDragger.y;
                    if (Math.abs(moveY) > 120) {
                        if (this.DraggerTop + moveY >= 0 && this.DraggerTop + moveY <= this.DraggerTopMax) {
                            this.verticalDragger.y = event.y;
                            this.DraggerTop = this.style(this.verticalDragger, 'top', this.DraggerTop + moveY);
                        }
                        else if (this.DraggerTop + moveY < 0) {
                            this.verticalDragger.y = event.y + this.DraggerTop;
                            this.DraggerTop = this.style(this.verticalDragger, 'top', 0);
                        }
                        else if (this.DraggerTop + moveY > this.DraggerTopMax) {
                            this.verticalDragger.y = event.y + this.DraggerTop - this.DraggerTopMax;
                            this.DraggerTop = this.style(this.verticalDragger, 'top', this.DraggerTopMax);
                        }
                    }
                    this.documentTop = this.style(this.document, 'top', Math.abs(this.DraggerTop/this.RailHeight * this.DocHeight) *  -1);
                }
                if (this.horizontalDraggerActived) {
                    var moveX = event.x - this.horizontalDragger.x;
                    if (Math.abs(moveX) > 120) {
                        if (this.DraggerLeft + moveX >= 0 && this.DraggerLeft + moveX <= this.DraggerLeftMax) {
                            this.horizontalDragger.x = event.x;
                            this.DraggerLeft = this.style(this.horizontalDragger, 'left', this.DraggerLeft + moveX);
                        }
                        else if (this.DraggerLeft + moveX < 0) {
                            this.horizontalDragger.x = event.x + this.DraggerLeft;
                            this.DraggerLeft = this.style(this.horizontalDragger, 'left', 0);
                        }
                        else if (this.DraggerLeft + moveX > this.DraggerLeftMax) {
                            this.horizontalDragger.x = event.x + this.DraggerLeft - this.DraggerLeftMax;
                            this.DraggerLeft = this.style(this.horizontalDragger, 'left', this.DraggerLeftMax);
                        }
                    }
                    this.documentLeft = this.style(this.document, 'left', Math.abs(this.DraggerLeft/this.RailHeight * this.DocHeight) *  -1);
                }
            };
        },
        mousewheel: function (event) {
            if (!this.disabled) {
                if (this.verticalActived) {
                    var WinHeight = parseInt(getStyle(this.Element, 'height'));
                    var DocHeight = getSize(this.document, 'box').height;
                    if (WinHeight != this.WinHeight || DocHeight != this.DocHeight) {
                        this.amount();
                    }
                    if (event.wheelDelta < 0) {
                        if (parseInt(getStyle(this.document, 'top')) + event.wheelDelta > this.TopMin) {
                            if (this.documentTop + event.wheelDelta * 0.5 > this.TopMin) {
                                this.documentTop = this.style(this.document, 'top', this.documentTop + event.wheelDelta * 0.5);
                            }
                            else {
                                this.documentTop = this.style(this.document, 'top', this.TopMin);
                            }
                        }
                        else if (parseInt(getStyle(this.document, 'top')) > this.TopMin) {
                            this.documentTop = this.style(this.document, 'top', this.TopMin);
                        }
                        else {}
                    }
                    if (event.wheelDelta > 0) {
                        if (parseInt(getStyle(this.document, 'top')) + event.wheelDelta < 0) {
                            if (this.documentTop + event.wheelDelta * 0.5 < 0) {
                                this.documentTop = this.style(this.document, 'top', this.documentTop + event.wheelDelta * 0.5);
                            }
                            else {
                                this.documentTop = this.style(this.document, 'top', 0);
                            }
                        }
                        else if (parseInt(getStyle(this.document, 'top')) < 0) {
                            this.documentTop = this.style(this.document, 'top', 0);
                        }
                        else {}
                    }
                    this.DraggerTop = this.style(this.verticalDragger, 'top', Math.abs(this.documentTop/this.DocHeight * this.RailHeight));
                }
                else if (this.horizontalActived) {
                    var WinWidth = parseInt(getStyle(this.Element, 'width'));
                    var DocWidth = getSize(this.document, 'box').width;
                    if (WinWidth != this.WinWidth || DocWidth != this.DocWidth) {
                        this.amount();
                    }
                    if (event.wheelDelta < 0) {
                        if (parseInt(getStyle(this.document, 'left')) + event.wheelDelta > this.LeftMin) {
                            if (this.documentLeft + event.wheelDelta * 0.5 > this.LeftMin) {
                                this.documentLeft = this.style(this.document, 'left', this.documentLeft + event.wheelDelta * 0.5);
                            }
                            else {
                                this.documentLeft = this.style(this.document, 'left', this.LeftMin);
                            }
                        }
                        else if (parseInt(getStyle(this.document, 'left')) > this.LeftMin) {
                            this.documentLeft = this.style(this.document, 'left', this.LeftMin);
                        }
                        else {}
                    }
                    if (event.wheelDelta > 0) {
                        if (parseInt(getStyle(this.document, 'left')) + event.wheelDelta < 0) {
                            if (this.documentLeft + event.wheelDelta * 0.5 < 0) {
                                this.documentLeft = this.style(this.document, 'left', this.documentLeft + event.wheelDelta * 0.5);
                            }
                            else {
                                this.documentLeft = this.style(this.document, 'left', 0);
                            }
                        }
                        else if (parseInt(getStyle(this.document, 'left')) < 0) {
                            this.documentLeft = this.style(this.document, 'left', 0);
                        }
                        else {}
                    }
                    this.DraggerLeft = this.style(this.horizontalDragger, 'left', Math.abs(this.documentLeft/this.DocWidth * this.RailWidth));
                }
            };
        }
    });
    pandora.declareClass('app.Scrollbar', Abstract, {
        Element: document,
        template: new pandora.dom.Template(unescape('%3Ca%20href%3D%22javascript%3Avoid%280%29%3B%22%20class%3D%22scroll-button-prev%22%20oncontextmenu%3D%22return%20false%3B%22%3E%3C/a%3E%0D%0A%3Cdiv%20class%3D%22scroll-bar%22%3E%0D%0A%20%20%20%20%3Cdiv%20class%3D%22scroll-dragger%22%20oncontextmenu%3D%22return%20false%3B%22%3E%3C/div%3E%0D%0A%20%20%20%20%3Cdiv%20class%3D%22scroll-rail%22%3E%3C/div%3E%0D%0A%3C/div%3E%0D%0A%3Ca%20href%3D%22javascript%3Avoid%280%29%3B%22%20class%3D%22scroll-button-next%22%20oncontextmenu%3D%22return%20false%3B%22%3E%3C/a%3E')),
        _init: function (elem, options) {
            options = _.extend(options || {}, false, {
                theme: 'default-dark',
                uesVertical: true,
                uesHorizontal: false
            });
            this.Element = isStr(elem) ? selector.byId(elem): elem;
            
            addClass(this.Element, 'tang')
                .addClass(this.Element, 'scrollbar')
                .addClass(this.Element, options.theme || 'light');
            this.build(options.uesVertical, options.uesHorizontal);
            this.resize();
            this.bind();
        },
        build: function (uesVertical, uesHorizontal) {
            this.content = this.Element.innerHTML;
            
            setStyle(this.Element, 'overflow', 'hidden');
            if (pandora.byCn('scroll-doc-container',this.Element)[0]) {
                this.document = pandora.byCn('scroll-doc-container',this.Element)[0];
            }
            else {
                this.Element.innerHTML = '';
                this.document = create('div', this.Element, {
                    className: 'scroll-doc-container',
                    innerHTML: this.content
                });
                
                setStyle(this.document, {
                    width: this.Element.scrollWidth,
                    height: this.Element.scrollHeight
                });
            }
            if (uesVertical) {
                if (pandora.byCn('scroll-bar-vertical',this.Scrollbar)[0]) {
                    this.vertical = pandora.byCn('scroll-bar-vertical',this.Scrollbar)[0];
                }
                else {
                    this.vertical = create('div', this.Element, {
                        className: 'scroll-bar-vertical',
                        innerHTML: this.template.complie( {}).echo()
                    });
                }
            }
            if (uesHorizontal) {
                if (pandora.byCn('scroll-bar-horizontal',this.Scrollbar)[0]) {
                    this.horizontal = pandora.byCn('scroll-bar-horizontal',this.Scrollbar)[0];
                }
                else {
                    this.horizontal = create('div', this.Element, {
                        className: 'scroll-bar-horizontal',
                        innerHTML: this.template.complie( {}).echo()
                    });
                }
            }
            this.buttonUp = pandora.byCn('scroll-button-prev',this.Scrollbar)[0];
            this.buttonRight = pandora.byCn('scroll-button-next',this.Scrollbar)[0];
            this.buttonDown = pandora.byCn('scroll-button-next',this.Scrollbar)[0];
            this.buttonLeft = pandora.byCn('scroll-button-prev',this.Scrollbar)[0];
            this.horizontalRail = pandora.byCn('scroll-rail',this.horizontal)[0];
            this.horizontalDragger = pandora.byCn('scroll-dragger',this.horizontal)[0];
            this.verticalRail = pandora.byCn('scroll-rail',this.vertical)[0];
            this.verticalDragger = pandora.byCn('scroll-dragger',this.vertical)[0];
        }
    });
    pandora.extend(pandora.app.Scrollbar, {
        Abstract: Abstract
    });
    this.module.exports = app.Scrollbar;
});
//# sourceMappingURL=Scrollbar.js.map