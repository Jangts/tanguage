/*!
 * tanguage framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
void ns {
    var commands = {
        'insert'(val) {
            this.selection.getRange().insert(val);
            this.selection.saveRange();
            this.onchange();
            return this;
        },
        // 'p'(val) {
        //     this.selection.getRange().execCommand('formatblock', '<p>');
        // },
        'blockquote'(val) {
            this.selection.getRange().execCommand('formatblock', '<blockquote>');
            this.selection.saveRange();
            this.onchange();
            return this;
        }
    };

    builders.regMethod('insertHTM', (val) {
        return this.execCommand('insert', val);
    }

    each(commands as cmd, handler) {
        builders.regCommand(cmd, handler);
    }
}