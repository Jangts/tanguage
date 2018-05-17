/*!
 * tanguage framework syntactic sugar
 * Web Entrance
 *
 * Written and Designed By Jang Ts
 * http://tangram.js.cn
 */
;
this.tang.init().auto([
    '$_/async/',
    '$_/../../compiler/js/sugar as tanguage_script'
], function (_, root, imports) {
    var tanguage_script = imports.tanguage_script,
    sugars = [], scripts = document.getElementsByTagName('script');
    // console.log(imports);
    for (var index = 0; index < scripts.length; index++) {
        var script = scripts[index];
        if (script.type === "text/tanguage") {
            if (script.src) {
                var src = script.src;
                var i = 0;
                _.async.ajax(src, function (data) {
                    let sugar = tanguage_script(data).compile().run(function (content) {
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
            } else {
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
