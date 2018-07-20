replaceIncludes(string) {
    if (this.sources.length) {
        let on = true;
        let id = this.sources.length - 1;
        let str;
        while (on) {
            on = false;
            string = string.replace(replaceExpRegPattern.include, (match, type, index) => {
                // console.log(match, this.readBuffer(index));
                // console.log(this.sources);
                // console.log(id, this.sources[id].src);
                on = true;
                let context = this.sources[id].src.replace(/[^\/\\]+$/, '');
                let src = this.readBuffer(index).replace(/('|"|`)/g, '').trim();
                switch (type){
                    case 'template':
                        if (this.isNativeCode) {
                            this.error('Native Code Not Support TPL File');
                        }
                        str = this.getTplContent(src, context);
                        // console.log(str, this.replacements[index]);
                        this.replacements[index][0] = "'" + escape(str) + "'";
                        return 'new ..dom.Template(unescape(___boundary_' + this.uid + '_' + index + '_as_string___));';

                    case 'include':
                        str = this.onReadFile(src, context);
                        str = this.markPosition(str, this.sources.length - 1);
                        // console.log(str);
                        str = this.replaceStrings(str);
                        // console.log(str);
                        str = this.replaceIncludes(str);
                        return str + "\r\n";//this.onReadFile(match);
                }
            });
        }
    } else {
        // console.log('FOOOO', this.sources,  string);
        // let on = true;
        // while (on) {
        //     on = false;
        //     string = string.replace(replaceExpRegPattern.include, (match, type, index) => {
        //         // console.log(match);
        //         on = true;
        //         let src = this.readBuffer(index).replace(/('|"|`)/g, '').trim();
        //         return this.onReadFile(this.readBuffer(index).replace(/('|"|`)/g, '').trim());
        //     });
        // }
    }
    return string
}
onReadFile(source, context = void 0) {
    // console.log(match, source);
    return "/* include '" + source + "' not be supported. */\r\n";
}
getTplContent(source, context = void 0) {
    return "";
}