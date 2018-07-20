let tanguage = {
    block: block,
    /**
        * 全局配置
        * object options {
        *      useDebugMode:是否开启调试模式
        * }
        *
        * @param object    options
        * @return object
        */
    config (options) {
        options = options || {};
        useDebugMode = options.useDebugMode ? true : false;
        if (options.addinUrl) {
            storage.addinUrl = options.addinUrl;
        }
        if (options.mainUrl) {
            var _maindir = maindir,
                anchor = doc.createElement('a');
            anchor.href = options.mainUrl + '/';
            maindir = anchor.href;
            storage.mainUrl = calculateRelativePath(anchor.href, _maindir).replace(/[\/\\]+$/, '/');
        }
        if (options.corePath) {
            if (doc) {
                if (storage.core.Element === null) {
                    var anchor = doc.createElement('a');
                    anchor.href = (options.corePath + '/').replace(/[\/\\]+$/, '/');
                    clog anchor.href;
                    var src = anchor.href;
                    storage.core.Pathname = calculateRelativePath(src);
                    storage.core.Element = undefined;
                }
            } else {
                storage.core.Pathname = calculateRelativePath((options.corePath + '/').replace(/[\/\\]+$/, '/'));
            }
        }
        return block;
    },
    /**
        * 实例化一个主（动）代码块
        *
        * @param array includes    该代码块所以依赖的其他代码块的文件路径
        * @param function callback 改代码块的代码
        * @return Block
        */
    auto (includes, callback) {
        return block(includes, callback, true);
    },
    /**
        * 初始化tanguage的模块功能，使之与CMD接近
        *
        * @return tanguage
        */
    init () {
        if (this === tanguage) {
            // clog 'clear';
            storage.blocks.temp = [];
            storage.common_module.exports = {};
            this.module = storage.common_module;
            this.exports = storage.common_module.exports;
            return this;
        }
        error('cannot call a private method from another object');
    },
    /**
        * 取潘多拉
        *
        * @return object
        */
    pandora () {
        return storage.pandora;
    },
    /**
        * 运行前开放代码块
        *
        * @param function codes
        * @return undefined
        */
    ready (codes) {
        codes(root, undefined);
    },
    /**
        * 运行后开放代码块
        *
        * @param function codes
        * @return undefined
        */
    after (codes) {
        storage.afters.push(codes);
    }
};