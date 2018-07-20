let storage = {
    maps: {
        /** 链接标签映射 */
        linkTags: {},
        /** 缺省加载源类型 */
        sourceTypes: {
            js: {
                tag: 'script',
                source: 'src'
            },
            css: {
                tag: 'link',
                source: 'href',
                attrs: {
                    type: 'text/css',
                    rel: 'stylesheet'
                }
            },
            img: {
                tag: 'img',
                source: 'src'
            }
        },
        /** 标识符注册表 */
        identifiersReg: [],
        /** 标识符描述映射表 */
        identifiersMap: {},
    },
    classes: {},
    classesSharedSpace: {},
    locales: {
        _public: {}
    },
    core: runtime,
    addinUrl: runtime.Pathname + '../../addin/',
    /** 模块快速导出对象的临时缓存 */
    common_module: {
        exports: {}
    },
    blocks: {
        /** 代码块映射 */
        // map: {},
        /** 模块包含的代码块的临时缓存 */
        /** 与导出对象的临时缓存一样可能被滞留模块和对象污染，暂时并没有办法解决，自能寄希望余使用者*/
        temp: [],
        /** 主（动）代码块 */
        mains: [],
        /** 从（引用）代码块 */
        requires: {}
    },
    mainUrl: './',
    afters: []
};