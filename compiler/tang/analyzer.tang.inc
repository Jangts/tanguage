@include 'buildast/positions';
pickTretOfMatch(match_as_statement[], isblock = true) {
    let tret_of_match = match_as_statement[3].trim();
    if (
        tret_of_match
        && !(tret_of_match === ';' && ['closure', 'if']['includes'](match_as_statement[2]))
        && !(tret_of_match === ';' && !isblock && ['class', 'function']['includes'](match_as_statement[2]))
    ) {
        return [{
            index: match_as_statement[1],
            display: 'inline',
            type: match_as_statement[2]
        }, tret_of_match];
    }
    return null;
}
getLines(string, vars, inOrder = false) {
    // console.log(string);
    string = string
        .replace(/:::(var|let|const|public)\s+(@\d+L\d+P(\d+O)?0:::)/g, ':::$1 ')
        .replace(/([^,;\s])\s*(@\d+L\d+P(\d+O)?0:::[^\.\(\[)])/g, '$1;$2')
        .replace(/(___boundary_[A-Z0-9_]{36}_\d+_as_(if)___)[;\s]*/g, "$1 ")
        .replace(/[;\r\n]+(___boundary_[A-Z0-9_]{36}_\d+_as_(expression|if|class|function|extends|call|log|object|objlike|closure|parentheses)___)/g, ";$1")
        .replace(/(___boundary_[A-Z0-9_]{36}_\d+_as_(log|closure|function)___)[;\r\n]+/g, "$1;\r\n")
        .replace(/[;\r\n]+((@\d+L\d+P\d+O?\d*:::)?___boundary_[A-Z0-9_]{36}_\d+_as_(callschain)___)/g, "$1")
        .trim();
    const sentences = string.split(/\s*;+\s*/);
    let lines = [];
    // console.log(string, sentences);
    for (let s = 0; s < sentences.length; s++) {
        const sentence = sentences[s].trim();
        // console.log(sentence);
        if (sentence) {
            const array = sentence.split(/:::(var|let|const|public)\s+/);
            // console.log(array, sentence);
            if (array.length === 1) {
                let definition = sentence.match(/(^|\s+)(var|let|const|public)(\s+|$)/);
                if (definition) {
                    let definitions = sentence.match(/(@boundary_\d+_as_midword::|(@boundary_\d+_as_midword::\s*)?___boundary_[A-Z0-9_]{36}_\d+_as_(if|closure)___)\s*(var|let|const|public)\s+([\s\S]+)/);
                    // console.log(definitions);
                    if (definitions) {
                        this.pushSentenceToLines(lines, definitions[1], 'inline');
                        this.pushVariablesToLines(lines, vars, undefined, definitions[5], definitions[4], true);
                        continue;
                    }
                    // console.log(sentence);
                    this.error('Unexpected `' + definition[1] + '` in `' + this.decode(sentence) + '`.');
                } else {
                    // console.log(sentence);
                    this.pushSentenceToLines(lines, sentence, (inOrder && (s===sentences.length-1)) ? 'inline' : 'block');
                }
                definition = undefined;
            } else if (array.length === 3) {
                this.pushVariablesToLines(lines, vars, array[0], array[2], array[1], inOrder);
                // console.log(spilitarray, sentences);
            } else {
                // console.log(spilitarray[3], spilitarray);
                var position = this.getPosition(array[2]);
                this.error('Unexpected `' + array[3] + '` at char ' + position.col + ' on line ' + position.line + '， near ' + this.decode(array[2]) + '.');
            }
        }
    }
    // console.log(lines);
    return lines;
}
@include 'buildast/pushtolines';
@include 'buildast/pushvariables';
@include 'buildast/pushtovars';
@include 'buildast/ast';
@include 'buildast/pushtoast';