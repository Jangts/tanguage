#!/usr/bin/env node
;
var fs = require('fs');
var glob = require("glob");
var path = require('path');
var getDirName = require('path').dirname;
var tanguage_script = require('./script.js');
var vlq = require('./vlq.js');
var commands = ['compile', 'test', 'cdir', 'build', 'help', 'version'];
// console.log(process.argv);
var mapBuilder = function (omappings, filename, osources, version) {
    if (version === void 0) { version = 3; }
    var lines = [];
    var sources = [];
    var last = [0, 0, 0, 0, 0];
    for (var s = 0; s < osources.length; s++) {
        // console.log(filename, osources[s].src, path.relative(filename, osources[s].src));
        sources.push(path.relative(getDirName(filename), osources[s].src).replace(/\\/g, '/'));
    }
    for (var index_1 = 0; index_1 < omappings.length; index_1++) {
        var points = [];
        var linemap = omappings[index_1];
        for (var point = 0; point < linemap.length; point++) {
            var numbers = [];
            var pointmap = linemap[point];
            for (var n = 0; n < pointmap.length; n++) {
                numbers.push(vlq.encode(pointmap[n] - last[n]));
            }
            points.push(numbers.join(''));
            last = pointmap;
        }
        lines.push(points.join(','));
    }
    var mappings = {
        "version": version,
        "file": path.basename(filename),
        "sourceRoot": "",
        "sources": sources,
        "names": [],
        "mappings": lines.join(';')
    };
    return JSON.stringify(mappings);
};
var onReadFile = function (src, context) {
    // console.log(src, context.source);
    var source = path.resolve(context + src + '.tang.inc');
    if (this.sources[source]) {
        this.error('source ' + source + ' had already been loaded.');
    }
    this.sources.push({
        id: this.sources.length,
        src: source
    });
    this.sources[source] = true;
    // console.log('src: ' + source);
    return fs.readFileSync(source, 'utf-8');
}, getTplContent = function (src, context) {
    // console.log(src, context.source);
    var source = path.resolve(context + src + '.tang.tpl');
    return fs.readFileSync(source, 'utf-8');
};
var options = {
    command: 'compile',
    inputDir: '',
    outputDir: '',
    containSubDir: false,
    generateSourceMap: false,
    safemode: false,
    compileMin: false
};
var script, sugar;
var handlers = {
    compile: function (i, o) {
        if (i === void 0) { i = null; }
        if (o === void 0) { o = null; }
        if (i) {
            o = o || i + '.js';
        }
        else if (options.inputDir) {
            i = options.inputDir;
            o = options.outputDir;
        }
        else {
            console.log('must input a filename');
            return;
        }
        i = path.resolve(i);
        o = path.resolve(o);
        console.log('compile tang file ' + i + '...');
        script = fs.readFileSync(i, 'utf-8');
        sugar = tanguage_script(script, i);
        sugar.onReadFile = onReadFile;
        sugar.getTplContent = getTplContent;
        sugar.compile();
        sugar.positions = sugar.replacements = sugar.imports = sugar.using_as = sugar.ast = sugar.astconfiginfo = sugar.posimap = undefined;
        if (!fs.existsSync(getDirName(o))) {
            fs.mkdirSync(getDirName(o));
        }
        if (options.generateSourceMap) {
            var output = sugar.output + "\r\n//# sourceMappingURL=" + path.basename(o) + '.map';
            var mappings = mapBuilder(sugar.mappings, o, sugar.sources);
            fs.writeFileSync(o + '.map', mappings);
        }
        else {
            var output = sugar.output;
        }
        sugar = null;
        fs.writeFileSync(o, output);
        console.log('file ' + o + ' compiled completed!');
    },
    test: function () {
        // console.log('Hello, world!');
        handlers.compile('./test/main.tang', './test/script.js');
    },
    cdir: function () {
        // console.log(options.outputDir);
        var indir = path.resolve(options.inputDir);
        var outdir = options.outputDir ? path.resolve(options.outputDir) : indir;
        var pattern;
        // console.log(indir, outdir);
        if (options.containSubDir) {
            pattern = indir + '/**/*.tang';
        }
        else {
            pattern = indir + '/*.tang';
        }
        glob(pattern, function (er, files) {
            // files 是匹配到的文件的数组.
            // 如果 `nonull` 选项被设置为true, 而且没有找到任何文件,那么files就是glob规则本身,而不是空数组
            // er是当寻找的过程中遇的错误
            // console.log(files);
            for (var index_2 = 0; index_2 < files.length; index_2++) {
                var tang = files[index_2];
                if (/\.test.tang$/.test(tang)) {
                    continue;
                }
                tang = path.resolve(tang);
                if (options.safemode) {
                    var js = tang.replace(indir, outdir) + '.js';
                }
                else {
                    var js = tang.replace(indir, outdir).replace(/.tang$/, '.js');
                }
                handlers.compile(tang, js);
            }
        });
    },
    build: function () {
        console.log('Hello, world!');
    },
    help: function () {
        console.log('Hello, world!');
    },
    version: function () {
        console.log('Hello, world!');
    }
};
if (commands['includes'](process.argv[2])) {
    options.command = process.argv[2];
    var index = 3;
}
else {
    var index = 2;
}
process.argv.slice(index).forEach(function (item) {
    switch (item) {
        case "-c":
            options.containSubDir = true;
            break;
        case "-m":
            options.compileMin = true;
            break;
        case "-map":
            options.generateSourceMap = true;
            break;
        case "-v":
            options.command = 'version';
            break;
        case "-s":
            options.safemode = true;
            break;
        default:
            if (options.inputDir) {
                if (!options.outputDir) {
                    options.outputDir = item;
                }
            }
            else {
                options.inputDir = item;
            }
            break;
    }
});
// console.log('Hello, world!');
switch (options.command) {
    case 'compile':
        handlers.compile();
        break;
    case 'test':
        handlers.test();
        break;
    case 'cdir':
        handlers.cdir();
        break;
    case 'build':
        break;
    case 'help':
        break;
    case 'version':
    default:
        break;
}
// node ./../../compiler/js/node-tang.js test -map
// node-tang cdir ./tang/ ./dist/ -map -c
// node ./../compiler/js/node-tang.js cdir ./tang/ ./dist/ -map -c
// node-tang cdir  ./tang/app/Slider/ ./dist/app/Slider/ -c -map
// node ./../compiler/js/node-tang.js cdir ./tang/app/Slider/ ./dist/app/Slider/ -c -map
// node ./../compiler/js/node-tang.js cdir ./tang/app/Slider/ ./dist/app/Slider/ -map
// node ./../compiler/js/node-tang.js cdir ./tang/dom/ ./dist/dom/ -c -map
//# sourceMappingURL=node-tang.js.map