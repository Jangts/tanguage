walkClass(index, display, vars = true) {
    // console.log(this.replacements[index]);
    let matches = this.readBuffer(index).match(matchExpRegPattern.class);
    // console.log(matches);
    let type = matches[1];
    let namespace = vars.root.namespace || this.namespace;
    let cname = matches[3];
    let subtype = 'stdClass';
    if (matches[2]) {
        if (matches[2].length !== 2) {
            cname = namespace + cname;
        }
    } else {
        if (type === 'dec') {
            if (cname) {
                if (this.isNativeCode) {
                    this.error('Native Code Not Support Standard Class Expression');
                }
                cname = namespace + cname;
            } else if (namespace) {
                if (this.isNativeCode) {
                    this.error('Native Code Not Support Standard Class Expression');
                }
                cname = namespace.replace(/\.$/, '');
            } else {
                subtype = 'anonClass'; 
            }
        }
        else {
            subtype = 'anonClass';
        }
    }
    let basename = matches[6];
    let position = this.getPosition(this.replacements[index][1]);
    if (type === 'class') {
        this.useDeclare = true;
        if ((subtype === 'anonClass') && cname && cname.match(namingExpr)){
            this.pushVariableToVars(vars, 'var', cname, position);
        }
        if (matches[5]) {
            if (matches[5].length === 2) {
                basename = 'pandora.' + basename;
            } else {
                basename = 'pandora.' + namespace + basename;
            }
        }
    }else{
        this.useExtends = true;
        if (matches[4] ==='ignore') {
            basename = true;
        }else{
            basename = false;
        }
    }

    namespace = undefined;
    return {
        type: type,
        posi: position,
        display: display,
        subtype: subtype,
        cname: cname,
        base: basename,
        vars: vars,
        body: this.checkClassBody(vars, matches[7] || '')
    };
}