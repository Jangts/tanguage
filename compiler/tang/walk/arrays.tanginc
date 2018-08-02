walkArray(index, display, vars) {
    let body = [],
        elems = [],
        position = this.getPositionByIndex(index),
        clauses = this.readBuffer(index).replace(/([\[\s\]])/g, '').split(',');
    // console.log(this.replacements[index], clauses);
    for (let c = 0; c < clauses.length; c++) {
        let posi;
        if (c) {
            posi = this.getPosition(clauses[c]);
        } else {
            posi = this.getPosition(clauses[c]) || position;
        }
        let value = clauses[c].replace(posi, '');
        let match = value.match(/\.\.\.(\w+)/);
        if (match){
            // console.log(match[1]);
            if (elems.length){
                body.push({
                    type: "arrEls",
                    posi,
                    vars,
                    elems: elems
                });
            }
            body.push({
                type: "arrVar", 
                posi, 
                vars,
                aname: match[1]
            });
            elems = [];
        } else {
            this.pushSentencesToAST(elems, vars, clauses[c], false, posi);
            if (c === clauses.length-1){
                body.push({
                    type: "arrEls",
                    posi,
                    vars,
                    elems: elems
                });
            }
        }
    }
    // console.log(body);
    return {
        type: 'arraylike',
        posi: position,
        display: display,
        vars: vars,
        body: body
    };
}