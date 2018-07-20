pushBodyToAST(body = [], vars, code, inOrder = false) {
    let lines = code ? this.getLines(code, vars, inOrder) : [];
    // console.log(code, lines);
    for (let index = 0; index < lines.length; index++) {
        switch (lines[index].subtype) {
            case 'sentence':
                const code = lines[index].value.trim()
                // console.log(lines[index].display === 'block', line);
                // console.log(lines[index]);
                this.pushSentencesToAST(body, vars, code, !inOrder && (lines[index].display === 'block'), lines[index].posi);
                break;

            case 'variable':
            // case 'assignment':
                body.push({
                    type: 'code',
                    posi: lines[index].posi,
                    display: inOrder ? 'inline' : lines[index].display,
                    vars: vars,
                    value: lines[index].value
                });
                break;
            default:
                body.push(this.walk({
                    index: lines[index].index,
                    display: inOrder ? 'inline' : 'block',
                    type: lines[index].subtype
                }, vars, inOrder));
                break;
        }
    }
    // console.log(body);
    lines = undefined;
    return body;
}
pushSentencesToAST(body = [], vars, code, isblock = true, lineposi) {
    if (code) {
        // console.log(isblock, lineposi);
        let inline = [];
        const statements = code.split('___boundary_' + this.uid);
        while (!statements[0].trim()) {
            statements.shift();
        }
        // console.log(statements)
        if (statements.length === 1) {
            this.pushReplacementsToAST(inline, vars, statements[0], isblock, lineposi);
        } else {
            for (let s = 0; s < statements.length; s++) {
                this.pushReplacementsToAST(inline, vars, statements[s], false, (s === 0) && lineposi);
            }
        }
        if (inline.length === 1) {
            body.push(inline[0]);
        } else {
            body.push({
                type: 'codes',
                vars: vars,
                body: inline
            });
        }
        inline = undefined;
    }
    return body;
}
pushReplacementsToAST(body, vars, code, isblock, lineposi) {
    // console.log(code);
    // code = code.trim();
    if (code.trim()) {
        let match_as_statement = code.match(matchExpRegPattern.index3);
        // console.log(match_as_statement);
        // console.log(code, match_as_statement, isblock, lineposi);
        if (match_as_statement) {
            let array = this.pickTretOfMatch(match_as_statement, isblock);
            if (array) {
                body.push(this.walk(array[0], vars, true));
                this.pushRowsToAST(body, vars, array[1], false, undefined);
            } else {
                body.push(this.walk({
                    index: match_as_statement[1],
                    display: isblock ? 'block' : 'inline',
                    type: match_as_statement[2]
                }, vars, true));
            }
            array = undefined;
        } else {
            this.pushRowsToAST(body, vars, code, isblock, lineposi);
        }
        match_as_statement = undefined;
    }
    return body;
}
pushRowsToAST(body, vars, code, isblock, lineposi) {
    var rows = code.split(/[\r\n]+/);
    // console.log(array);
    for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        if (row.trim()) {
            this.pushCodeToAST(body, vars, row, isblock, (r === 0) && lineposi);
        }
    }
    rows = undefined;
    return body;
}
pushCodeToAST(body, vars, code, isblock, lineposi) {
    let display = isblock ? 'block' : 'inline';
    let position = this.getPosition(code) || lineposi;
    if (position) {
        var element = code.replace(position.match, '');
    } else {
        var element = code;
    }
    // console.log(element, position);
    if (element) {
        body.push({
            type: 'code',
            posi: position,
            vars: vars,
            display: display,
            value: element
        });
    }
    display = position = element = undefined;
    return body;
}