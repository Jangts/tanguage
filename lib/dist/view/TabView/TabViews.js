/*!
 * tanguage framework source code
 *
 * class see.Tabs,
 * class see.Tabs.Auto
 *
 * Date: 2017-04-06
 */
;
tang.init().block([
    '$_/util/bool',
    '$_/dom/Elements'
], function(pandora, root, imports, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,

        doc = root.document,
        location = root.location,
        query = _.dom.sizzle || _.dom.selector,
        $ = _.dom.select;

    declare('see.Tabs.TabViews', {
        startTabName: 'STARTPAGE',
        currTabName: '',
        Tabs: {},
        trigger: 'click',
        _init: function(elem, options) {
            this.Element = elem;
            this.options = query('ul,tab-options', this.Element)[0];
            this.sections = query('.tab-sections', this.Element)[0];
            this.build(options);
            this.bind().start();
        },
        build: function(options) {
            this.tabs = {};
            options = options || {};
            if (_.util.bool.isStr(options.starttab)) {
                this.startTabName = options.starttab.toUpperCase();
            }
            if (_.util.bool.isFn(options.start)) {
                this.start = options.start;
            }
            if (_.util.bool.isFn(options.onbeforeunload)) {
                this.onbeforeunload = options.onbeforeunload;
            }
            if (_.util.bool.isFn(options.onbeforewrite)) {
                this.onbeforewrite = options.onbeforewrite;
            }
            if (_.util.bool.isFn(options.onbeforecut)) {
                this.onbeforecut = options.onbeforecut;
            }
            if (_.util.bool.isFn(options.onaftercut)) {
                this.onaftercut = options.onaftercut;
            }

            if (_.util.bool.isFn(options.onafterdestroy)) {
                this.onafterdestroy = options.onafterdestroy;
            }
            return this;
        },
        create: function(tabName, tabAlias) {
            this.tabs[tabName] = {
                option: _.dom.create('li', this.options, {
                    dataTabName: tabName,
                    html: tabName === this.startTabName ? '<div calss="tab-option starttab">' + (tabAlias || tabName) + '</div>' : '<div calss="tab-option">' + (tabAlias || tabName) + '</div><i class="tab-closer">×</i class="tab-closer">'
                }),
                section: _.dom.create('section', this.sections, {
                    dataTabName: tabName
                }),
                tag: {
                    origin: '',
                    trimed: '',
                    path: []
                }
            }
            return this.resize();
        },
        destroy: function(tabName) {
            if (tabName !== this.startTabName) {
                this.tabs[tabName] = null;
                delete this.tabs[tabName];
                $('[data-tab-name=' + tabName + ']', this.Element).remove();
            }
            return this.aftrtDestroy(tabName);
        },
        aftrtDestroy: function(tabName) {
            return this.cutTo(this.startTabName);
        },
        trimTag: function(tag) {
            var trimed = tag.split('?')[0] + '/';
            return {
                origin: tag,
                trimed: trimed.replace(/\/+/g, '').toUpperCase(),
                path: trimed.split(/\/+/)
            }
        },
        start: function() {
            return this;
        },
        open: function(tabName, tag, force, tabAlias) {
            if (this.Element) {
                tabName = tabName.toUpperCase();
                if (!this.tabs[tabName]) {
                    this.create(tabName, tabAlias);
                }
                var option = this.tabs[tabName].option,
                    section = this.tabs[tabName].section,
                    oldTag = this.tabs[tabName].tag,
                    newTag = this.trimTag(tag);

                if (!oldTag.origin || force) {
                    this.onbeforewrite(tabName, newTag);
                } else if (newTag.origin != oldTag.origin) {
                    if (tabName === this.startTabName) {
                        this.cutTo(tabName, newTag);
                    } else {
                        this.onbeforeunload(tabName, oldTag, newTag);
                    }
                } else {
                    this.cutTo(tabName, newTag);
                }
                return this;
            }
            return null;
        },
        onbeforeunload: function(tabName, oldTag, newTag) {
            return this.onbeforewrite(tabName, newTag);
        },
        onbeforewrite: function(tabName, tag) {
            return this;
        },
        write: function(tabName, tag, txt) {
            this.tabs[tabName].section.innerHTML = txt;
            return this.cutTo(tabName, tag);
        },
        onbeforecut: function(tag) {
            return this;
        },
        cutTo: function(tabName, tag) {
            if (!tag) {
                if (!this.tabs[tabName]) {
                    //console.log(this.tabs, this.startTabName);
                    if (!this.tabs[this.startTabName]) {
                        return this.start();
                    }
                    tabName = this.startTabName;
                }
                tag = this.tabs[tabName].tag;
            }
            this.onbeforecut(tag);
            this.currTabName = tabName.toUpperCase();
            this.tabs[tabName].tag = tag;
            $('[data-tab-name]', this.Element).removeClass('curr');
            $('[data-tab-name=' + this.currTabName + ']', this.Element).addClass('curr');
            return this.onaftercut(tag).resize();
        },
        onaftercut: function(tag) {
            return this;
        },
        resize: function() {
            _.dom.setStyle(this.options, {
                width: $('item[data-tab-name]', this.options).widths() + 1
            });
            return this;
        },
        onoptionclick: function(option, target) {
            var tabName = YangRAM.attr(option, 'data-tab-name').toUpperCase();
            if (target.tagName == 'DIV') {
                that.cutTo(tabName);
            }
            if (target.tagName == 'I') {
                this.destroy(tabName);
            }
            return this;
        },
        bind: function() {
            var that = this;
            $(this.options).on(this.trigger, '[data-tab-name]', null, function() {
                var target = event.relatedTarget  ||  event.srcElement  ||  event.target  || event.currentTarget;
                that.onoptionclick(this, target);
            });
            return this;
        }
    });
});