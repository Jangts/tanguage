/*!
 * tanguage framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
ns {
        commands = {
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

    regMethod('insertHTM', (val) {
        return this.execCommand('insert', val);
    });

    _.each(commands, (cmd, handler) {
        regCommand(cmd, handler);
    });
}