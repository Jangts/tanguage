/**
 * @class Block
 * 代码块类
 */
let Block = declareClass({
    /**
        * 代码块类构造函数
        *
        * @param array     includes
        * @param function  callback
        * @param string    blockname
        * @return 构造函数，无返值
        */
    _init (includes, callback, blockname) {
        this.requires = [];
        this.onload = 0;
        this.loaded = 0;
        switch (typeof includes) {
            case 'string':
                this.requires.push(includes);
                if (typeof callback === 'function')
                    this.callback = callback;
                break;
            case 'object':
                if (includes instanceof Array)
                    this.requires = includes;
                if (typeof callback === 'function')
                    this.callback = callback;
                break;
            case 'function':
                this.callback = includes;
                blockname = callback;
                break;
        }

        requireCount += this.requires.length;
        this.core = new BlockCore(this.callback);
        var that = this;
        if (blockname) {
            if (blockname === true) {
                // this.core['type'] = 'caller';
                setTimeout( () {
                    that.mainid = storage.blocks.mains.push(that.core) - 1;
                    // clog true;
                    that.listene();
                }, 0);
            }
            // 可能废弃自定义块名，貌似没有实际意义
            // 只是在命名空间机制下没有实际意义，事实上在exports机制下还是有其作用的
            else if (typeof(blockname) === 'string') {
                storage.blocks.requires[blockname.toLowerCase()] = {
                    blocks: [this.core],
                    status: 'loaded'
                };
            }
            tanguage.init();
        } else {
            if (blockname !== false) {
                storage.blocks.temp.push(this.core);
                // clog '001';
            }
            this.mainid = -1;
        }
        // clog this.requires;
        setTimeout( () {
            that.listene();
        }, 0);
    },
    /**
        * 加载完成后的回调函数
        *
        * @return undefined
        */
    callback () {
        clog 'tanguage has loaded some require libraries.';
    },
    /**
        * 加载下一个
        *
        * @return undefined
        */
    loadnext () {
        var that = this,
            filetype, arr, url;
        if (this.requires[this.onload]) {
            arr = this.requires[this.onload].split(/\s+as\s+/);
            // clog arr;
            // clog storage;
            // clog this;
            if (arr[0].match(/^~/)) {
                // clog arr[0], this.core.url, dirname(this.core.url), this.core;
                url = arr[0].replace(/^~/, dirname(this.core.url));
                var id = this.core.url + arr[0].toLowerCase();
            } else {
                url = arr[0].replace(/^\$_\//, storage.core.Pathname).replace(/^\$\.\//, storage.mainUrl).replace(/^\$\+\//, storage.addinUrl);
                var id = arr[0].toLowerCase();
            }

            /** 检查引用文件类型 */
            if (url.match(/\.css$/) || url.match(/^[^\?]+\.css\?$/)) {
                filetype = 'css';
            } else if (url.match(/\.js$/) || url.match(/\.json$/) || url.match(/^[^\?]+\.js\?/) || url.match(/^[^\?]+\.json\?/)) {
                filetype = 'js';
            } else {
                url = url + '.js';
                filetype = 'js';
            }
            url = url.replace(/([\w\$]+)\/.js$/, '$1/$1.js');
            // clog this.id;

            if (arr[1]) {
                that.core.imports[arr[1]] = id;
            }
            this.core.imports[id] = [];
            this.onload++;
            if (!!storage.blocks.requires[id]) {
                this.loaded++;
                loadedCount++;
                this.listene();
            } else {
                storage.blocks.requires[id] = {
                    status: 'loading',
                    blocks: []
                };
                loadURL(url, (script, alreadyLoaded, url) {
                    that.loaded++;
                    loadedCount++;
                    // clog id, alreadyLoaded;
                    if (alreadyLoaded) {
                        var sid = script.getAttribute('data-tanguage-id');
                        storage.blocks.requires[id] = storage.blocks.requires[sid];
                    } else {
                        script.setAttribute('data-tanguage-id', id);
                        storage.blocks.requires[id].status = 'loaded';
                        storage.blocks.requires[id].blocks = storage.blocks.temp;
                        storage.blocks.requires[id].exports = storage.common_module.exports;
                        // clog '002';
                        each(storage.blocks.requires[id].blocks, (i, block) {
                            // block.type = 'called';
                            block.module = storage.blocks.requires[id];
                            block.url = url;
                        });
                    }
                    // clog storage.blocks.requires[id];
                    // clog '003';
                    tanguage.init();
                    that.listene();
                }, false, filetype);
            }
        } else {
            this.onload++;
            this.loaded++;
            loadedCount++;
            that.listene();
        }

    },
    /**
        * 监听加载状态
        *
        * @return undefined
        */
    listene () {
        // clog mainPointer, storage.blocks.mains.length;
        // clog this.loaded, this.requires.length, loadedCount, requireCount);
        if (this.loaded === this.requires.length) {
            this.result.status = 0;
            // clog loadedCount, requireCount, loadedCount === requireCount, mainPointer, storage.blocks.mains.length;
            if (loadedCount === requireCount) {
                // clog mainPointer, storage.blocks.mains.length;
                var mainCount = storage.blocks.mains.length;;
                for (mainPointer; mainPointer < mainCount;) {
                    // clog mainPointer, mainCount, 'call main block';
                    // 将主block的返值对象合并到全局变量window，以便在控制台调试
                    each(fireblock(storage.blocks.mains[mainPointer++]), (index, value) {
                        root[index] = value;
                    });
                    if (mainPointer === storage.blocks.mains.length) {
                        each(storage.afters, (i, codes) {
                            codes(root, undefined);
                        });
                        storage.afters = [];
                    }
                }
            }
        } else if (this.onload < this.requires.length) {
            this.loadnext();
        }
    },
    result: {
        status: 1
    }
});