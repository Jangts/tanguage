generate() {
    // console.log(this.replacements);
    // console.log(this.ast.body);
    let ast = this.ast;
    this.ast = {};

    let head = [];
    let neck = [];
    let body = [];
    let foot = [];

    this.fixVariables(ast.vars);
    this.pushCodes(body, ast.vars, ast.body, 1, this.namespace);

    if (this.isNativeCode) {
        this.pushNativeHeader(head);
        this.useDeclare && this.pushDeclare(neck);
        if (this.useDeclare) {
            this.pushEach(neck);
            this.pushExtends(neck);
            this.pushDeclare(neck);
        }
        else if (this.useExtends) {
            this.pushEach(neck);
            this.pushExtends(neck);
        }
        else if (this.useEach){
            this.pushEach(neck);
        }
        this.useLoop && this.pushLoop(neck);
    } else {
        let imports = this.imports;
        let alias = this.using_as;
        this.imports = [];
        this.using_as = {};
        this.pushBlockHeader(head, imports);
        this.pushAlias(neck, ast.vars, alias);
        imports = undefined;
        alias = undefined;
    }
    
    this.pushFooter(foot, ast.vars);
    ast = undefined;

    let preoutput = head.join('') + neck.join('') + this.trim(body.join('')) + foot.join('');
    head = neck = body = foot = undefined;
    this.output = this.pickUpMap(this.restoreStrings(preoutput, true)).replace(/[\s;]+;/g, ';');
    preoutput = undefined;
    // console.log(this.output);
    return this;
}
pushPostionsToMap(position, codes[] | undefined = undefined) {
    if (position && (typeof position === 'object')) {
        let index = this.posimap.length;
        this.posimap.push(position);
        let replace = '/* @posi' + index + ' */';
        index = undefined;
        if (codes) {
            codes.push(replace);
        }
        return replace;
    }
    return '';
}
pickUpMap(string) {
    let lines = string.split(/\r{0,1}\n/);
    let _lines = [];
    let mappings = [];
    for (let l = 0; l < lines.length; l++) {
        let line = lines[l];
        lines[l] = undefined;
        let mapping = [];
        let match;
        while (match = line.match(/\/\*\s@posi(\d+)\s\*\//)) {
            let index = match.index;
            // console.log(line, match);
            
            if (match[1] < this.posimap.length - 1 ){
                let i = parseInt(match[1]) + 1;
                let position = this.posimap[i];
                this.posimap[i] = undefined;
                mapping.push([index, position.o[0], position.o[1], position.o[2], 0]);
            }else{
                // console.log(match);
            }
            line = line.replace(match[0], '');
        }
        _lines.push(line);
        mappings.push(mapping);
        line = mapping = undefined;
    }
    this.posimap = undefined;
    mappings[0][0] = [0,0,0,0,0]
    this.mappings = mappings;
    mappings = undefined;
    // console.log(mappings)
    // return string;
    return _lines.join("\r\n");
}
@include 'pushcodes/nativecodes';
@include 'pushcodes/blockcodes';
@include 'pushcodes/elements';
@include 'pushcodes/array';
@include 'pushcodes/calls';
@include 'pushcodes/class';
@include 'pushcodes/functions';
@include 'pushcodes/object';
@include 'pushcodes/classexpands';
@include 'pushcodes/expression';
pushFooter(codes[], vars)[] {
    // console.log(vars.root.public);
    for (const name in vars.root.public) {
        codes.push("\r\n    pandora('" + this.namespace + name + "', " + vars.root.public[name] + ");");
    }
    if (this.isMainBlock) {
        codes.push("\r\n" + '}, true);');
    } else {
        codes.push("\r\n" + '});');
    }
    return codes;
}
@include 'pushcodes/variables';
patchNamespace(node, vars) {
    if (node === '.') {
        return 'pandora';
    }
    if (vars.root.namespace) {
        return ('pandora.' + vars.root.namespace).replace(/\.+$/, '');
    }
    // console.log(this.namespace);
    return ('pandora.' + this.namespace).replace(/\.+$/, '');
}
@include 'pushcodes/decode';
@include 'pushcodes/trim';