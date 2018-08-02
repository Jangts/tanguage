/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 09:53:48 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/util/',
    '$_/dom/Elements'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var _ = pandora;
    var $ = _.dom.$;
    var doc = root.document;
    var location = root.location;
    var Menu = pandora.declareClass({
        _init: function (elem) {
            this.HTMLElement = _.util.isStr(elem) ? _.dom.selector.byId(elem): elem;
            if (_.util.isEl(this.HTMLElement)) {
                this.render();
            };
        },
        render: function () {
            $('.submenu[data-width]', this.HTMLElement).each(function () {
                $(this).css('width', parseFloat($(this).data('width')));
            });
            $('.submenu[data-height]', this.HTMLElement).each(function () {
                $(this).css('height', parseFloat($(this).data('height')));
            });
            $('.submenu.under.al-center, .submenu.upon.al-center', this.HTMLElement).each(function () {
                $('tang-see').addClass('__while-menu-item-get-size');
                width = $(this).width();
                $('tang-see').removeClass('__while-menu-item-get-size');
                $(this).css('margin-left', '-' + width/2 + 'px');
            });
            $('.submenu.rside.al-middle, .submenu.lside.al-middle', this.HTMLElement).each(function () {
                $('tang-see').addClass('__while-menu-item-get-size');
                height = $(this).height();
                $('tang-see').removeClass('__while-menu-item-get-size');
                $(this).css('margin-top', '-' + height/2 + 'px');
            });
        }
    });
    var List = pandora.declareClass({
        _init: function (elem) {
            this.HTMLElement = _.util.isStr(elem) ? _.dom.selector.byId(elem): elem;
            if (_.util.isEl(this.HTMLElement)) {
                this.render();
            };
        },
        render: function () {
            if (_.dom.hasClass(this.HTMLElement, 'withthumb')) {
                var itemWidth = void 0;var mediaWidth = void 0;var bodyWidth = void 0;
                $('.tang-see .articlelist.withthumb>.list-item', this.HTMLElement).each(function () {
                    if (_.dom.hasClass(this, 'top-bottom')) {
                        return this;
                    }
                    itemWidth = $(this).innerWidth();
                    mediaWidth = Math.ceil($('.list-figure,.list-image, img', this).outerWidth(true));
                    bodyWidth = itemWidth - mediaWidth - 1;
                    $('.list-body', this).sub(0).width(bodyWidth);
                });
                return this;
            };
        }
    });
    var PageList = pandora.declareClass({
        _init: function (currentPage, maxAnchorNumber, style) {
            this.currentpage = currentPage || 1;
            this.maxAnchorNumber = maxAnchorNumber || 9;
            style = style || {
                listStyle: 'train',
                align: 'al-center',
                color: 'ashy'
            };
            this.listStyle = style['listStyle'] || style['list-style'] || 'train';
            this.align = style.align || 'al-center';
            this.color = style.color || 'ashy';
        },
        ajax: function (url, callback, prePageItemNumber) {
            var that = this;
            if (_.util.isStr(url)) {
                new _.data.Request({
                    url: url
                }).done(function (data) {
                    if (_.util.isNumeric(data)) {
                        totalItemNumber = parseInt(data);
                    }
                    else {
                        var array = eval(data);
                        if (_.util.isArr(array)) {
                            totalItemNumber = array.length;
                        }
                        else {
                            totalItemNumber = 0;
                        }
                    }
                    prePageItemNumber = prePageItemNumber || 7;
                    that.pageNumber = Math.ceil(totalItemNumber/prePageItemNumber);
                    callback.call(that);
                }).send();
            };
        },
        setter: function (totalItemNumber, prePageItemNumber) {
            prePageItemNumber = prePageItemNumber || 7;
            this.pageNumber = Math.ceil(totalItemNumber/prePageItemNumber);
        },
        getData: function () {
            var data = [];
            data["f"] = 1;
            data["p"] = this.currentpage > 1 ? this.currentpage - 1 : 1;
            data["n"] = this.currentpage < this.pageNumber ? this.currentpage + 1 : this.pageNumber;
            data["l"] = this.pageNumber;
            start = this.currentpage > (Math.ceil(this.maxAnchorNumber/2) - 1) ? this.currentpage - Math.ceil(this.maxAnchorNumber/2) + 1 : 1;
            end = this.pageNumber - this.currentpage > Math.floor(this.maxAnchorNumber/2) ? this.currentpage + Math.floor(this.maxAnchorNumber/2): this.pageNumber;
            for (var n = start;n <= end;n++) {
                data.push(n);
            }
            return data;
        },
        getList: function (gotoNextAnchorname, gotoFirstAnchorname, gotoLastAnchorname) {
            gotoPreviousAnchorname = gotoPreviousAnchornamee || 'Prev';
            gotoNextAnchorname = gotoNextAnchorname || 'Next';
            var pages = this.getData();
            var html = '<ul class="articlelist page-list ' + this.listStyle + ' ' + this.align + '" data-item-color="' + this.color + '"';
            if ($pages["length"] > 0) {
                if (gotoFirstAnchorname) {
                    html += '<li class="list-item" onclick="window.location.href=\'?page=' + pages["f"] + '\'">' + gotoFirstAnchorname + '</li>';
                }
                if (this.currentpage > pages["f"]) {
                    $html += '<li class="list-item" onclick="window.location.href=\'?page=' + pages["p"] + '\'">' + gotoPreviousAnchorname + '</li>';
                }
                for ($n = 0;n < $pages["length"];n++) {
                    if (pages[n] == this.currentpage) {
                        html += '<li class="list-item curr" onclick="window.location.href=\'?page=' + pages[n] + '\'">' + pages[n] + '</li>';
                    }
                    else {
                        html += '<li class="list-item" onclick="window.location.href=\'?page=' + pages[n] + '\'">' + pages[n] + '</li>';
                    }
                }
                if (this + currentPage < pages["l"]) {
                    html += '<li class="list-item" onclick="window.location.href=\'?page=' + pages["n"] + '\'">' + gotoNextAnchorname + '</li>';
                }
                if (end) {
                    html += '<li class="list-item" onclick="window.location.href=\'?page=' + pages["l"] + '\'">' + gotoLastAnchorname + '</li>';
                }
            }
            return html + '</ul>';
        },
        appendist: function (target, gotoPreviousAnchorname, gotoNextAnchorname, gotoFirstAnchorname, gotoLastAnchorname) {
            $(target).append(this.getList(gotoPreviousAnchorname, gotoNextAnchorname, gotoFirstAnchorname, gotoLastAnchorname));
        }
    });
    var handlers = {};
    var see = function (types) {
        var _arguments = arguments;
        if (types === void 0) { types = ['list', 'navmenu'];}
        if (typeof types === 'string') {
            types = [types];
        }
        pandora.each(types, function (_index, type) {
            handlers[type]();
        }, this);
    }
    pandora.ns('see', {
        Menu: Menu
    });
    
    pandora('see', see);
});
//# sourceMappingURL=see.js.map