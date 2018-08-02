let zero2z = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

/** 获取随机标识符 */
getUid (radix) {
    var uid = new Array(36);
    for (var i = 0; i < 36; i++) {
        uid[i] = zero2z[Math.floor(Math.random() * radix)];
    }
    uid[8] = uid[13] = uid[18] = uid[23] = '-';
    return uid.join('');
}

/** URL加载函数 */
loadURL (url, callback, parent, type) {
    var Element, source, loadType = storage.maps.sourceTypes[type] || storage.maps.sourceTypes.js,
        callback = typeof callback === 'function' ? callback : () {
            clog source + ' loaded.';
        };
    if (doc) {
        parent = (parent && typeof parent.appendChild === 'function') ? parent : head;
        Element = doc.createElement(loadType.tag);
        Element[loadType.source] = url;
        source = Element[loadType.source];

        // clog url, source, storage.maps.linkTags[source];

        if (storage.maps.linkTags[source]) {
            Element = storage.maps.linkTags[source];
            // clog url, Element.alreadyLoaded;
            if (Element.alreadyLoaded) {
                // clog url, Element;
                // return;
                setTimeout(() {
                    callback(Element, true, source);
                }, 0);
                return;
            }
        } else {
            storage.maps.linkTags[source] = Element;
            Element.setAttribute('async', '');
            if (loadType.attrs) {
                each(loadType.attrs, (attr, val) {
                    Element[attr] = val;
                });
            }
            parent.appendChild(Element);
        }
        if (typeof(Element.onreadystatechange) === 'object') {
            Element.attachEvent('onreadystatechange', () {
                // clog url, Element.alreadyLoaded;
                if (Element.readyState === 'loaded' || Element.readyState === 'complete') {
                    if (Element.alreadyLoaded) {
                        callback(Element, true, source);
                    } else {
                        Element.alreadyLoaded = true;
                        callback(Element, false, source);
                    }
                }
            });
        } else if (typeof(Element.onload) === 'object') {
            Element.addEventListener('load', () {
                if (Element.alreadyLoaded) {
                    callback(Element, true, source);
                } else {
                    Element.alreadyLoaded = true;
                    callback(Element, false, source);
                }
            });
        }
    } else {
        error('blocks only load on browser, plase use require() on node.js');
    }
}