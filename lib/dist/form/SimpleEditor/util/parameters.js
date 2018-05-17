/*!
 * tanguage framework source code
 *
 * class forms/SimpleEditor
 * 
 * Date: 2015-09-04
 */
;
tang.init().block([], function(pandora, root, imports, undefined) {
    var _ = pandora,

        basePath = _.core.url() + 'form/SimpleEditor/';

    var parameters = {
        basePath: basePath,
        langPath: basePath + 'Lang/',
        langType: 'zh_CN',
        minWidth: 650,
        minHeight: 100,
        emoticonsTable: 'default',
        emoticonsCodeFormat: '[CODE]'
    };
    pandora.storage.set(parameters, 'EDITOR_PARAMS');
});