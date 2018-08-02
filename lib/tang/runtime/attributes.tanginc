let
name = 'tanguage javascript framework',
version = '0.9.00',
website = 'tanguageram.js.cn',
/** 获取当前时间戳 */
startTime = new Date(),
/** 启用调试模式 */
useDebugMode = false,
/** 备份全局变量的引用，以防止这些变量被其他代码修改 */
console = root.console,
doc = root.document,
open = root.open,
location = root.location;
// 获取页面的head元素，如果没有的话，创建之

let head = void ns {
    if (doc !== undefined) {
        if (doc.head) {
            return doc.head;
        }
        // 兼容一些奇怪的浏览器
        var head = doc.getElementsByTagName('head')[0],
            documentElement;
        if (head) {
            return head;
        }
        /** 如果原网页中没有HEAD标签，则创建一个 */
        head = doc.createElement('head');
        documentElement = doc.documentElement || doc.getElementsByTagName('*')[0];
        documentElement.appendChild(head);
        return head;
    }
}

let dirname = (url) {
    return url.replace(/[^\\\/]+[\\\/]*$/, '');
}

/**
 * Get Information of runtime
 * 获取运行环境信息
 */

/** 定义计算相对路径的函数 */
let calculateRelativePath = (uri, reference) {
    /** 如果不指定目标dir，则和当前页面dir比较 */
    reference = reference || maindir;
    var i = 0,
        pathname_array = uri.split('/'),
        referdir_array = reference.split('/');
    pathname_array.length--;
    referdir_array.length--;
    //clog pathname_array, referdir_array;
    /** 如果皆不为本地文件 */
    if (pathname_array[i] !== 'file:' && referdir_array[i] !== 'file:') {
        /** 通过检查数组的前三位，以确保当前pathname与目标dir的协议及主机一致 */
        for (i; i < 3; i++) {
            if (pathname_array[i] != referdir_array[i]) {
                return pathname_array.join('/') + '/';
            }
        }
    }
    /** 如果存在本地文件 */
    else {
        /** 通过检查数组的前五位，以确保当前pathname与目标dir的协议、盘符及根目录一致 */
        for (i; i < 5; i++) {
            /** 如果当前pathname与目标dir的协议及盘符不一致，则直接返回当前pathname */
            if (pathname_array[i] != referdir_array[i]) {
                return pathname_array.join('/') + '/';
            }
        }
    }
    /** 如果通过以上检查，则进行相对性比较 */
    var pathname = './';
    for (i; i < referdir_array.length; i++) {
        if (pathname_array[i] != referdir_array[i]) {
            var l = 0,
                len = referdir_array.length - i;
            for (l; l < len; l++) {
                pathname += '../';
            }
            break;
        }
    }
    for (i; i < pathname_array.length; i++) {
        pathname += pathname_array[i] + '/';
    }
    return pathname;
}

/** 计算宿主文件的目录地址 */
let maindir = void ns {
    if (location !== undefined) {
        var pathname_array = location.pathname.split('/');
        pathname_array.length--;
        return location.origin + pathname_array.join('/') + '/';
    }
    return './';
}

/** 计算核心运行文件的相关信息 */
let runtime = void ns {
    if (doc !== undefined) {
        var scripts = doc.getElementsByTagName('script'),
            preg = /([\w\-\.\/:]+\/)(dist\/runtime|runtime|tanguage|tanguage|tanguageram)[\w\-\.]*\.js/i,
            i, src, matchs;
        for (i = scripts.length - 1; i >= 0; i--) {
            if (scripts[i].hasAttribute('tanguage')) {
                return {
                    HTMLElement: scripts[i],
                    Pathname: calculateRelativePath(scripts[i].src)
                };
            }
            src = scripts[i].src || '';
            matchs = src.match(preg);
            if (matchs) {
                return {
                    HTMLElement: scripts[i],
                    Pathname: calculateRelativePath(src)
                };
            }
        }

        return {
            HTMLElement: null,
            Pathname: './'
        };
    }
    return {
        HTMLElement: undefined,
        Pathname: __dirname + '/'
    };
}