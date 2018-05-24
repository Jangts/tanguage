/*!
 * tanguage framework source code
 *
 * commands forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
tang.init().block([], function(pandora, root, imports, undefined) {
    var _ = pandora,

        console = root.console;

    var presets = [
            'bold', 'italic', 'insertorderedlist', 'insertunorderedlist',
            'justifycenter', 'justifyfull', 'justifyleft', 'justifyright',
            'removeformat', 'strikethrough', 'underline', 'unlink'
        ],

        regCommand = pandora.storage.get(new _.Identifier('EDITOR_REG_CMD').toString());

    _.each(presets, function(index, cmd) {
        regCommand(cmd, function(val) {
            this.selection.getRange().execCommand(cmd, val);
            this.selection.saveRange();
            this.onchange();
        });
    });
});