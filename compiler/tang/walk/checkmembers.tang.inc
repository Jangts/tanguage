checkProp(vars, posi, type, attr[], array[]) {
    // console.log(posi);
    // console.log(type, posi, attr, array);
    let position = this.getPosition(posi);
    // position.head = false;
    // console.log(position);
    if (array.length > 1) {
        let body = [];
        if (attr[6]) {
            body.push({
                type: 'code',
                posi: void 0,
                display: 'inline',
                vars: vars,
                value: attr[6].trim()
            });
        }
        for (let index = 1; index < array.length; index++) {
            var element = array[index];
            const match_as_statement = element.trim().match(matchExpRegPattern.index3);
            // console.log(matches);
            if (match_as_statement) {
                body.push(this.walk({
                    index: match_as_statement[1],
                    type: match_as_statement[2]
                }, vars, true));
                if (match_as_statement[3]) {
                    body.push({
                        type: 'code',
                        posi: void 0,
                        display: 'inline',
                        vars: vars,
                        value: match_as_statement[3].trim()
                    });
                }
            } else {
                // console.log(element);
                body.push({
                    type: 'code',
                    posi: void 0,
                    display: 'inline',
                    vars: vars,
                    value: element.trim()
                });
            }
        }
        return {
            type: type,
            posi: position,
            display: 'inline',
            pname: attr[4].trim() || 'myAttribute',
            vars: vars,
            body: body
        };
    }
    return {
        type: type,
        posi: position,
        display: 'inline',
        pname: attr[4].trim() || 'myAttribute',
        vars: vars,
        body: [
            {
                type: 'code',
                posi: void 0,
                display: 'inline',
                vars: vars,
                value: attr[6].trim()
            }
        ]
    };
}
checkObjMember(vars, code) {
    let that = this, body = [],
        bodyIndex = -1,
        lastIndex = 0,
        array = code.split(/\s*[\{,\}]\s*/);
    // console.log(code, array);
    for (let index = 0; index < array.length; index++) {
        let element = array[index].trim();
        if (element) {
            var elArr = element.split('___boundary_' + this.uid);
            if (elArr[0] && elArr[0].trim()) {
                var match_0 = elArr[0].match(matchExpRegPattern.objectattr);
                if (match_0) {
                    if (match_0[5] != ':') {
                        if ((elArr.length === 1)) {
                            match_0[6] = match_0[4];
                        }
                        else {
                            // console.log(elArr);
                            continue;
                        }
                    }
                    // console.log(elArr);
                    body.push(this.checkProp(vars, match_0[1], 'objProp', match_0, elArr));
                    bodyIndex++;
                    continue;
                } else {
                    // console.log(elArr);
                }
            } else {
                // console.log(elArr);
                for (let i = 1; i < elArr.length; i++) {
                    const match_as_statement = elArr[i].trim().match(matchExpRegPattern.index3);
                    switch (match_as_statement[2]) {
                        case 'string':
                        case 'pattern':
                        case 'tamplate':
                            console.log(body, bodyIndex);
                            body[bodyIndex].body.push({
                                type: 'code',
                                posi: void 0,
                                display: 'inline',
                                vars: vars,
                                value: ',' + this.replacements[parseInt(match_as_statement[1])][0].toString().replace(this.markPattern, function () {
                                    return that.replacements[arguments[1]][0].toString();
                                })
                            });
                            if (match_as_statement[3]) {
                                body[bodyIndex].body.push({
                                    type: 'code',
                                    posi: void 0,
                                    display: 'inline',
                                    vars: vars,
                                    value: match_as_statement[3]
                                });
                            }
                            break;

                        case 'function':
                            if (elArr.length === 2) {
                                body.push(this.walkFnLike(parseInt(match_as_statement[1]), 'inline', vars, 'method'));
                                bodyIndex++;
                            }
                            break;
                    }
                }
            }
        }
        element = elArr = undefined;
    }
    that = bodyIndex = lastIndex = array = undefined;
    return body;
}