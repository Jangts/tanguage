#!/usr/bin/env node

/*!
 * tanguage script compiler
 * Node.JS Entrance
 *
 * Written and Designed By Jang Ts
 * https://github.com/Jangts/tanguage/wiki
 */
;

const fs = require('fs');
const glob = require("glob");
const path = require('path');
const getDirName = require('path').dirname;
// const tanguage_script = require('./script.js');
const tanguage_script = require('./tanguage_script.js');
const vlq = require('./vlq.js');
const commands = ['compile', 'test', 'cdir', 'build', 'help', 'version'];

// console.log(process.argv);
const mapBuilder = (omappings: any[], filename: string, osources:any[], version: number | string = 3)=>{
    let lines = [];
    let _lines = {};
    let sources:string[] = [];
    let last = [0, 0, 0, 0, 0];
    for (let s = 0; s < osources.length; s++) {
        // console.log(filename, osources[s].src, path.relative(filename, osources[s].src));
        sources.push(path.relative(getDirName(filename), osources[s].src).replace(/\\/g, '/'));
    }
    for (let index = 0; index < omappings.length; index++) {
        let points = [];
        let linemap = omappings[index]
        for (let point = 0; point < linemap.length; point++) {
            let numbers = [];
            let pointmap = linemap[point];
            for (let n = 0; n < pointmap.length; n++) {
                numbers.push(vlq.encode(pointmap[n] - last[n]));
            }
            points.push(numbers.join(''));
            last = pointmap;
        }
        lines.push(points.join(','));
    }
    
    let mappings = {
        "version": version,
        "file": path.basename(filename),
        "sourceRoot": "",
        "sources": sources,
        "names": [],
        "mappings": lines.join(';')
    };

    return JSON.stringify(mappings);
}

const onReadFile = function (src: string, context): string {
    // console.log(src, context.source);
    let source = path.resolve(context + src + '.tanginc');
    if (this.sources[source]) {
        this.error('source ' + source + ' had already been loaded.');
    }
    this.sources.push({
        id: this.sources.length,
        src: source
    });
    this.sources[source] = true;
    // console.log('READ SRC: ' + source);
    // console.log(new Date());
    return fs.readFileSync(source, 'utf-8');
},
getTplContent = function (src: string, context): string {
    // console.log(src, context.source);
    let source = path.resolve(context + src + '.ttpml');
    return fs.readFileSync(source, 'utf-8');
}

let options = {
    command: 'compile',
    inputDir: '',
    outputDir: '',
    containSubDir: false,
    generateSourceMap: false,
    safemode: false,
    compileMin: false
}

let script, sugar;

let handlers = {
    compile(i = null, o = null) {
        if (i) {
            o = o || i + '.js';
        } else if (options.inputDir) {
            i = options.inputDir;
            o = options.outputDir;
        } else {
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
            // console.log(sugar.sources);
            var output: string = sugar.output + "\r\n//# sourceMappingURL=" + path.basename(o) + '.map';
            let mappings = mapBuilder(sugar.mappings, o, sugar.sources);
            fs.writeFileSync(o + '.map', mappings);
        } else {
            var output: string = sugar.output;
        }
        sugar = null;
        fs.writeFileSync(o, output);
        console.log('file ' + o + ' compiled completed!');
    },
    test() {
        // console.log('Hello, world!');
        handlers.compile('./test/main.tang', './test/script.js');
    },
    cdir() {
        // console.log(options.outputDir);
        let indir = path.resolve(options.inputDir);
        let outdir = options.outputDir ? path.resolve(options.outputDir) : indir;
        let pattern;
        // console.log(indir, outdir);
        if (options.containSubDir) {
            pattern = indir + '/**/*.tang';
        } else {
            pattern = indir + '/*.tang';
        }
        glob(pattern, function (er, files) {
            // files 是匹配到的文件的数组.
            // 如果 `nonull` 选项被设置为true, 而且没有找到任何文件,那么files就是glob规则本身,而不是空数组
            // er是当寻找的过程中遇的错误
            // console.log(files);
            for (let index = 0; index < files.length; index++) {
                let tang = files[index];
                if (/\.test.tang$/.test(tang)){
                    continue;
                }
                tang = path.resolve(tang);
                if (options.safemode) {
                    var js: string = tang.replace(indir, outdir) + '.js';
                } else {
                    var js: string = tang.replace(indir, outdir).replace(/.tang$/, '.js');
                }
                handlers.compile(tang, js);
            }
        });
    },
    build() {
        console.log('Hello, world!');
    },
    help() {
        console.log('Hello, world!');
    },
    version() {
        console.log('Hello, world!');
    }
}

if (commands['includes'](process.argv[2])) {
    options.command = process.argv[2];
    var index = 3;
} else {
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
            } else {
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