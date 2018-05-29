/*!
 * tanguage framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
(() {

    regMethod('insertVideo', (val) {
        return this.execCommand('insertvideo', val);
    });

    var videoHTML = {
        'swf'(src, width, height) {
            var html = '<embed src="' + src + '"';
            html += ' allowFullScreen="true" quality="high"';
            if (width) {
                html += ' width="' + width + '"';
            };
            if (height) {
                html += ' height="' + height + '"';
            };
            html += ' align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>';
            return html;
        },
        'webm'(src, width, height) {
            var html = '<video src="' + src + '" controls="controls"';
            if (width) {
                html += ' width="' + width + '"';
            };
            if (height) {
                html += ' height="' + height + '"';
            };
            html += '>您的浏览器不支持 video 标签。</video>';
            return html;
        },
        'mp4'(src, width, height) {
            var html = '<video src="' + src + '" controls="controls"';
            if (width) {
                html += ' width="' + width + '"';
            };
            if (height) {
                html += ' height="' + height + '"';
            };
            html += '>您的浏览器不支持 video 标签。</video>';
            return html;
        },
        'ogg'(src, width, height) {
            var html = '<video src="' + src + '" controls="controls"';
            if (width) {
                html += ' width="' + width + '"';
            };
            if (height) {
                html += ' height="' + height + '"';
            };
            html += '>您的浏览器不支持 video 标签。</video>';
            return html;
        }
    };

    regCommand('insertvideo', (val) {
        if (val) {
            if (val.code && val.code != '') {
                this.execCommand('insert', val.code);
                this.collapse();
                return this;
            }
            if (val.url) {
                var html = videoHTML[val.type || 'swf'](val.url, val.width, val.height);
                this.execCommand('insert', html);
                this.collapse();
            }
        }
        return this;
    });

    regCreater('insertvideo', () {
        var html = '<dialog class="se-dialog">';
        // html += '<span class="se-title">Insert Video</span>';
        html += '<textarea class="se-code" placeholder="Embedded code"></textarea>';
        html += '<div class="se-url">';
        html += '<label><i>Enter URL</i><input type="text" class="se-input" placeholder="Video URL" /></label>';
        html += '</div>';
        html += '<div class="se-attr"><div class="se-attr-left">';
        html += '<label><i class="size">Size</i><input type="number" class="se-vidoe-width" placeholder="640"></label>';
        html += '<span>×</span><input type="number" class="se-vidoe-height" placeholder="480">';
        html += '</div><div class="se-attr-right">';
        html += '<label><i>Type</i><select class="se-vidoe-type"></label>';
        html += '<option value="swf" selected="selected">swf</option>';
        html += '<option value="webm">webm</option>';
        html += '<option value="mp4">mp4</option>';
        html += '<option value="ogg">ogg</option>';
        html += '</select></div></div>';
        html += '<div class="se-btns">';
        html += '<button type="button" class="data-se-cmd" data-se-cmd="insertvideo">OK</button>';
        html += '</div>';
        html += '</dialog>';
        return html;
    });

    regDialog('insertvideo', (btn) {
        var dialog = _.dom.closest(btn, 'dialog');
        var textarea = query('.se-code', dialog)[0];
        if (textarea && textarea.value != '') {
            return {
                code: textarea.value
            }
        }
        var input = query('.se-url .se-input', dialog)[0];
        var widthInput = query('.se-attr .se-vidoe-width', dialog)[0];
        var heightInput = query('.se-attr .se-vidoe-height', dialog)[0];
        var typeInput = query('.se-attr .se-vidoe-type', dialog)[0];
        if (input && input.value != '') {
            return {
                url: input.value,
                type: typeInput.value,
                width: widthInput.value == '' ? null : widthInput.value,
                height: heightInput.value == '' ? null : heightInput.value
            };
        }
        return null;
    });
}());