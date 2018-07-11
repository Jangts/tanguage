/*!
 * tanguage framework source code
 *
 * commands forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
void ns {
    var presets = [
        'bold', 'italic', 'insertorderedlist', 'insertunorderedlist',
        'justifycenter', 'justifyfull', 'justifyleft', 'justifyright',
        'removeformat', 'strikethrough', 'underline', 'unlink'
    ];

    each(presets as index, cmd) {
        // clog index, cmd;
        builders.regCommand(cmd, (val) {
            this.selection.getRange().execCommand(cmd, val);
            this.selection.saveRange();
            this.onchange();
        });
    }
}