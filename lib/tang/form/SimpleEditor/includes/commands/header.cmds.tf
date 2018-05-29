/*!
 * tanguage framework source code
 *
 * commands forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
ns {
        commands = {
            header(val) {
                this.selection.getRange().execCommand('formatblock', '<' + val + '>');
            },
            h1(val) {
                this.selection.getRange().execCommand('formatblock', '<h1>');
            },
            h2(val) {
                this.selection.getRange().execCommand('formatblock', '<h2>');
            },
            h3(val) {
                this.selection.getRange().execCommand('formatblock', '<h3>');
            },
            h4(val) {
                this.selection.getRange().execCommand('formatblock', '<h4>');
            },
            h5(val) {
                this.selection.getRange().execCommand('formatblock', '<h5>');
            },
            h6(val) {
                this.selection.getRange().execCommand('formatblock', '<h6>');
            }
        };


    _.each(commands, (cmd, handler) {
        regCommand(cmd, handler);
    });

    regCreater('header', () {
        var html = '<ul class="se-pick">';
        for (var i = 1; i < 7; i++) {
            html += '<li class="se-h' + i + ' data-se-cmd" data-se-cmd="header" data-se-val="h' + i + '"><h' + i + '>Header ' + i + '</h' + i + '></li>';
        }
        html += '</ul>';
        return html;
    }, true);
}