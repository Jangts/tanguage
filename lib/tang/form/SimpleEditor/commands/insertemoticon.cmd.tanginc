/*!
 * tanguage framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
void ns {
    var emoticons = {};

    builders.regMethod('insertEmoticon', (val) {
        return this.execCommand('insertemoticon', val);
    });

    builders.regCommand('insertemoticon', (val) {
        if (val && val.pack && val.name) {
            if (emoticons[val.pack] && emoticons[val.pack][val.name]) {
                if (this.options.emoticonsType == 'code') {
                    var code = val.pack + '/' + val.name
                    var codeFormat = this.options.emoticonsCodeFormat || parameters.emoticonsCodeFormat;
                    code = codeFormat.replace('CODE', code);
                    this.execCommand('insert', code);
                } else {
                    var src = parameters.basePath + 'emoticons/' + val.pack + '/' + emoticons[val.pack][val.name];
                    var html = '<img src="' + src + '" class="se-emoticon" />';
                    this.execCommand('insert', html);
                }
                this.collapse();
            }
        }
        return this;
    });

    builders.regCreater('insertemoticon', () {
        var pack = this.options.emoticonsTable && emoticons[this.options.emoticonsTable] ? this.options.emoticonsTable : parameters.emoticonsTable;
        var emtb = emoticons[pack];
        var path = parameters.basePath + 'emoticons/' + pack + '/';
        var html = '<dialog class="se-dialog"><ul class="se-emoticons tang se-emoticons-' + pack + '">';
        for (var i in emtb) {
            html += '<li class="se-emoticon data-se-cmd" data-se-cmd="insertemoticon" data-se-val="' + pack + ', ' + i + '" title="' + i + '"><img src="' + path + emtb[i] + '"></li>';
        }
        html += '</ul></dialog>';
        return html;
    });

    builders.regDialog('insertemoticon', (val) {
        if (val) {
            var arr = val.split(/,\s*/);
            if (arr.length > 1) {
                return {
                    pack: arr[0],
                    name: arr[1]
                }
            }
        }
        return null;
    });

    // builders.regEmoticon:
    function regEmoticon (theme, images) {
        if (emoticons[theme] === undefined) {
            emoticons[theme] = images;
        }
    };

    // clog regEmoticon;

    @include 'emoticons/default';
}