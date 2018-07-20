/** 自动配置 */
if (storage.core.Element) {
    var config = storage.core.Element.getAttribute('data-config'),
        mains = storage.core.Element.getAttribute('data-mains'),
        debug = storage.core.Element.getAttribute('data-tanguage-debug');
    if (config) {
        var url = url + '.js';
        loadURL(url, '$Config');
    };
    if (root.blockConfiguration) {
        tanguage.config(root.blockConfiguration);
    }
    if (mains) {
        var mArr = mains.split(/,\s*/);
        each(mArr, (i, url) {
            var url = url + '.js';
            loadURL(url, '$Main_' + i);
        });
    };
    if (debug != null) {
        useDebugMode = true;
    }
}
/** 检查是否调试模式 */
if (useDebugMode) {
    clog storage;
}
clog storage;

/** 打卡 */
if (!root.parent || root.parent == root) {
    clog '[' + startTime.toLocaleString() + '] tanguage framework Start Working!';
}

/** 监听storage.pandora.storage */
Object.defineProperty(storage.pandora, 'storage', {
    writable: false,
    enumerable: false,
    configurable: true
});