pushSentencesToPREAST(preast = [], vars, code, display = 'block', lineposi) {
    if (code) {
        let inline = [];
        const statements = code.split('___boundary_' + this.uid);
        while (!statements[0].trim()) {
            statements.shift();
        }
        // console.log(statements)
        for (let s = 0; s < statements.length; s++) {
            let statement = statements[s];
            if (statement.trim()) {
                let match_as_statement = statement.match(matchExpRegPattern.index3);
                // console.log(match_as_statement);
                if (match_as_statement) {
                    let array = this.pickTretOfMatch(match_as_statement, display === 'block');
                    if (array) {
                        inline.push(array[0]);
                        this.pushRowsToAST(inline, vars, array[1], false, undefined);
                    } else {
                        // console.log(lines[index].display);
                        inline.push({
                            index: match_as_statement[1],
                            display: (statements.length === 1) ? display : 'inline',
                            type: match_as_statement[2]
                        });
                    }
                    array = undefined;
                } else {
                    if ((statements.length === 1) && (display === 'block')) {
                        this.pushRowsToAST(inline, vars, statements[0], true, lineposi);
                    } else {
                        this.pushRowsToAST(inline, vars, statements[0], false, lineposi);
                    }
                }
                match_as_statement = undefined;
            }
            statement = undefined;
        }
        preast.push(inline);
        inline = undefined;
        return preast;
    }
}
buildAST(preast, vars) {
    // console.log(preast);
    let ast = {
        type: 'codes',
        vars: vars,
        body: []
    };
    for (let index = 0; index < preast.length; index++) {
        let block = preast[index];
        if (block.length === 1) {
            var element = block[0];
            if (element.type === 'code') {
                ast.body.push(element);
            } else {
                ast.body.push(this.walk(element, vars, false));
            }
        } else {
            let codes = {
                type: 'codes',
                vars: vars,
                body: []
            };
            for (let b = 0; b < block.length; b++) {
                const el = block[b];
                if (el.type === 'code') {
                    codes.body.push(el);
                } else {
                    codes.body.push(this.walk(el, vars, true));
                }
            }
            ast.body.push(codes);
        }
        block = undefined;
    }
    this.ast = ast;
    ast = undefined;
    return this;
}