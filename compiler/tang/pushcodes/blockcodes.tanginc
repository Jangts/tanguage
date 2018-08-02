pushBlockHeader(codes, imports) {
    codes.push('/*!');
    codes.push("\r\n" + ' * tanguage script compiled code');
    codes.push("\r\n" + ' *');
    codes.push("\r\n" + ' * Datetime: ' + (new Date()).toUTCString());
    codes.push("\r\n" + ' */');
    codes.push("\r\n" + ';');

    codes.push("\r\n");
    if (this.configinfo === '{}') {
        codes.push("// ");
    } else {
        this.pushPostionsToMap(this.getPosition(this.configinfo_posi), codes);
    }
    codes.push('tang.config(' + this.configinfo + ');');
    if (this.isMainBlock) {
        codes.push("\r\n" + 'tang.init().block([');
    } else {
        codes.push("\r\n" + 'tang.init().block([');
    }
    if (imports.length) {
        let stropmi = [];
        for (let index = 0; index < imports.length; index += 2) {
            stropmi.push(this.pushPostionsToMap(this.getPosition(imports[index + 1])) + "'" + imports[index] + "'");
        }
        // console.log(imports, stropmi);
        codes.push("\r\n    " + stropmi.join(",\r\n    ") + "\r\n");
        stropmi = undefined;
    }
    if (this.isMainBlock) {
        codes.push('], function (pandora, root, imports, undefined) {');
    } else {
        codes.push('], function (pandora, root, imports, undefined) {');
        codes.push("\r\n    var module = this.module;");
    }
    if (this.namespace) {
        let namespace = this.namespace.replace(/\.$/, "");
        let name = namespace.replace(/^(.*\.)?([\$a-zA-Z_][\$\w]*)$/, "$2");
        codes.push("\r\n    var " + name + " = pandora.ns('" + namespace + "', {});");
        namespace = name = undefined;
    }
    return codes;
}
pushAlias(codes, vars, alias) {
    for (var key in vars.locals) {
        codes.push("\r\n    var " + vars.locals[key] + ' = ' + key + ';');
    }
    for (const key in alias) {
        // console.log(key);
        // let position = this.getPosition(key);
        // let _key = key.replace(position.match, '').trim();
        let value = alias[key][0].toLowerCase();
        codes.push("\r\n    " + this.pushPostionsToMap(alias[key][2]) + "var " + this.patchVariables(key, vars));
        codes.push(" = imports['" + value);
        if (alias[key][1] === '*') {
            codes.push("'];");
        } else {
            codes.push("'] && imports['" + value + "']['" + key + "'];");
        }
        value = undefined;
    }
    return codes;
}