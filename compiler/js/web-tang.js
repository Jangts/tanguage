/*!
 * tanguage script compiler
 * Web Entrance
 *
 * Written and Designed By Jang Ts
 * https://github.com/Jangts/tanguage/wiki
 */
;
this.tang.init().auto([
    '$_/data/',
    // '$_/../../compiler/js/tanguage_script as tanguage_script'
    '$_/../../compiler/js/script as tanguage_script'
], function (_, root, imports) {
    var tanguage_script = imports.tanguage_script, tangs = [], scripts = document.getElementsByTagName('script');
    // console.log(imports);
    // console.log(scripts);
    for (var index = 0; index < scripts.length; index++) {
        var script = scripts[index];
        // console.log(script.type);
        if (script.type === "text/tanguage") {
            if (script.src) {
                console.log(script.src);
                // console.log(script.src, _.data.ajax);
                var src = script.src;
                var i = 0;
                _.data.ajax(src, function (data) {
                    // console.log(data);
                    // console.log(tanguage_script(data).compile());
                    var tang = tanguage_script(data).compile().run(function (content) {
                        console.log(this.ast);
                        // console.log(this.posimap, this.mappings);
                        console.log(true, content);
                        // console.log(data);
                        // console.log(this.min());
                    }, function () {
                        // console.log(this.ast);
                        // console.log(this.replacements);
                    });
                });
                // ;
            }
            else {
                // console.log(script.innerHTML);
                tanguage_script(script.innerHTML).compile().run(function (content) {
                    console.log(this.ast);
                    console.log(content);
                }, function () {
                    console.log(this.ast);
                    // console.log(this.replacements);
                });
            }
        }
    }
});
//# sourceMappingURL=web-tang.js.map