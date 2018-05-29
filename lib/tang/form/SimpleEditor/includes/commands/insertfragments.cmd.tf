/*!
 * tanguage framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
(() {
    var codesFragments = [];

    regCommand('insertfragments', (val) {
        if (val && codesFragments[val]) {
            this.execCommand('insert', codesFragments[val]);
        }
        return this;
    });

    regCreater('insertfragments', () {
        var fragments = this.options.fragments || [];
        if (fragments.length) {
            var html = '<ul class="se-pick">';
            _.each(fragments, (i, fragment) {
                codesFragments.push(fragment.code);
                html += '<li class="se-font data-se-cmd" data-se-cmd="insertfragments" data-se-val="' + i + '">' + fragment.name + '</li>';
            });
            html += '</ul>';
            return html;
        }
        return '';
    }, true);
}());