/*!
 * tanguage framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
void ns {
    var codesFragments = [];

    builders.regCommand('insertfragments', (val) {
        if (val && codesFragments[val]) {
            this.execCommand('insert', codesFragments[val]);
        }
        return this;
    });

    builders.regCreater('insertfragments', () {
        var fragments = this.options.fragments || [];
        if (fragments.length) {
            var html = '<ul class="se-pick">';
            each(fragments as i, fragment) {
                codesFragments.push(fragment.code);
                html += '<li class="se-font data-se-cmd" data-se-cmd="insertfragments" data-se-val="' + i + '">' + fragment.name + '</li>';
            }
            html += '</ul>';
            return html;
        }
        return '';
    }, true);
}