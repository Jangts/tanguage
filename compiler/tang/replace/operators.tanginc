replaceOperators(string) {
    let on = true;
    while (on) {
        on = false;
        string = string.replace(operators.owords, (match, posi, word) => {
            // console.log(match);
            on = true;
            let index = this.replacements.length;
            this.pushBuffer([' ' + word + ' ']);
            return '@boundary_' + index + '_as_operator::';
        });
    }

    // console.log(string);
    on = true;
    while (on) {
        on = false;
        string = string.replace(operators.swords, (match, before, word, right) => {
            // console.log(match, before, word);
            on = true;
            let index = this.replacements.length;
            if (word === 'instanceof') {
                // console.log(match, before, word)
                this.pushBuffer([' ' + word + ' ']);
                before = before.trim()
                return before + '@boundary_' + index + '_as_operator::' + right;
            } else {
                this.pushBuffer([word + ' ']);
            }
            return before + '@boundary_' + index + '_as_preoperator::' + right;
        });
    }

    on = true;
    while (on) {
        // console.log(string);
        on = false;
        string = string.replace(operators.mixed, (match, left, posi, op, right, posir, sign) => {
            // console.log(string);
            // console.log(match, left, op, right, sign);
            on = true;
            if (sign) {
                let _index = sign === '+' ? 3 : 4;
                right = right.replace(sign, '@boundary_' + _index + '_as_preoperator::');
            }
            let index = this.replacements.length;
            this.pushBuffer([' ' + op + '= ', posi]);
            return left + '@boundary_' + index + '_as_operator::' + right;
        });
    }

    on = true;
    while (on) {
        on = false;
        string = string.replace(operators.bool, (match, left, posi, op, right, posir, sign) => {
            // console.log(match);
            on = true;
            if (sign) {
                let _index = sign === '+' ? 3 : 4;
                right = right.replace(sign, '@boundary_' + _index + '_as_preoperator::');
            }
            let index = this.replacements.length;
            this.pushBuffer([' ' + op + ' ', posi]);
            return left + '@boundary_' + index + '_as_operator::' + right;
        });
    }

    on = true;
    while (on) {
        on = false;
        // console.log(string);
        string = string.replace(operators.op, (match, left, posi, op, right, posir, sign) => {
            // console.log(match);
            on = true;
            if (sign) {
                let _index = sign === '+' ? 3 : 4;
                right = right.replace(sign, '@boundary_' + _index + '_as_preoperator::');
            }
            let index = this.replacements.length;
            this.pushBuffer([' ' + op + ' ', posi]);
            // console.log(left + '@boundary_' + index + '_as_operator::' + right);
            return left + '@boundary_' + index + '_as_operator::' + right;
        });
    }

    on = true;
    while (on) {
        on = false;
        string = string.replace(operators.sign, (match, before, sign, number) => {
            on = true;
            // let index = this.replacements.length;
            // this.pushBuffer(' ' + sign);
            let index = sign === '+' ? 3 : 4;
            return before + '@boundary_' + index + '_as_preoperator::' + number;
        });
    }

    on = true;
    while (on) {
        on = false;
        string = string.replace(operators.before, (match, op, number) => {
            on = true;
            let index = this.replacements.length;
            this.pushBuffer([op]);
            return '@boundary_' + index + '_as_preoperator::' + number;
        });
    }

    on = true;
    while (on) {
        on = false;
        string = string.replace(operators.after, (match, number, posi, op) => {
            on = true;
            let index = this.replacements.length;
            this.pushBuffer([op]);
            return number + (posi||'') + '@boundary_' + index + '_as_aftoperator::';
        });
    }
    return string.replace(operators.error, (match, before, op, after) => {
        // console.log(string, match);
        if (after && after.indexOf('>') === 0) {
            return match;
        }
        this.error('Unexpected `' + op + '` in `' + this.decode(match) + '`');
        return '';
    });
}