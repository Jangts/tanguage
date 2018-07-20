/** 获取运行环境信息 */
core: {
    /**
     * 获取开始时间
     *
     * @return float
     */
    startTime () {
        return startTime;
    },
    /**
     * 获取tanguage全名
     *
     * @return string
     */
    name () {
        return name;
    },
    /**
     * 获取当前版本信息
     *
     * @param string
     */
    version () {
        return version;
    },
    /**
     * 转到tanguage官网
     *
     * @return undefined
     */
    website () {
        open(website, name);
    },
    /**
     * 获取当前文件URL
     *
     * @return string
     */
    url () {
        return storage.core.Pathname;
    }
},