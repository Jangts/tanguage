markPosition(string, sourceid = 0) {
    let lines = string.split(/\r{0,1}\n/);
    // console.log(lines);
    let positions = [];
    for (let l = 0; l < lines.length; l++) {
        const elements = lines[l].split(/(,|;|\{|\[|\(|\}|\sas\s|->|=>)/);
        // console.log(elements);
        let newline = [];
        for (let c = 0, length = 0; c < elements.length; c++) {
            var element = elements[c];
            if (c === 0) {
                length = 0;
            }
            if (element === ',' || element === ';' || element === '{' || element === '[' || element === '(' || element === '}' || element === ' as ' || element === '->' || element === '=>') {
                newline.push(element);
            } else {
                newline.push('@' + sourceid + 'L' + l + 'P' + length + ':::' + element);
            }
            length += element.length;
        }
        positions.push(newline);
    }
    let newlines = positions.map((line) => {
        return line.join("");
    })
    // this.positions.push(positions);
    // console.log(newlines.join("\r\n"));
    lines = positions = undefined;
    return newlines.join("\r\n");
}
tidyPosition(string) {
    let on = true;
    while (on) {
        on = false;
        string = string.replace(/(@\d+L\d+P\d+O?\d*:::\s*)+(@\d+L\d+P0:::)/g, (match, last, newline) => {
            // console.log(match);
            on = true;
            return "\r\n" + newline;
        });
    }
    on = true;
    while (on) {
        on = false;
        string = string.replace(/[\r\n]*(@\d+L\d+P)0:::(\s+)/g, (match, pre, space) => {
            // console.log(pre, space);
            on = true;
            return "\r\n" + pre + space.length + 'O0:::';
        });
    }
    on = true;
    while (on) {
        on = false;
        string = string.replace(/(@\d+L\d+P)(\d+):::(\s+)/g, (match, pre, num, space) => {
            // console.log(pre, num, space);
            on = true;
            return pre + (parseInt(num) + space.length) + 'O' + num + ':::';
        });
    }
    on = true;
    while (on) {
        on = false;
        string = string.replace(/(\{|\[|\(|\)|\]|\})\s*@\d+L\d+P\d+O?\d*:::\s*(\)|\]|\})/g, (match, before, atfer) => {
            // console.log(match);
            on = true;
            return before + atfer;
        });
    }
    on = true;
    while (on) {
        on = false;
        string = string.replace(/(@\d+L\d+P\d+O?\d*:::\s*)+(\)|\]|\})/g, (match, posi, panbrackets) => {
            // console.log(match);
            on = true;
            return panbrackets;
        });
    }
    on = true;
    while (on) {
        on = false;
        string = string.replace(/(\s*@\d+L\d+P\d+O?\d*:::)+(,|;)/g, (match, posi, panstop) => {
            // console.log(match);
            on = true;
            return panstop;
        });
    }
    string = string.replace(/::::/g, '::: :');
    return string;
}