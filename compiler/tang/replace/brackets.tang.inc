replaceBrackets(string) {
    let left = string.indexOf('[');
    let right = string.indexOf(']');
    let count = 0;
    while ((count < this.stringReplaceTimes) && (left >= 0)) {
        count++;
        // console.log(left, right);
        // console.log(left, right, string);
        if (left < right) {
            string = string.replace(replaceExpRegPattern.array, (match, posi, elements) => {
                // console.log(match, elements);
                let index = this.replacements.length;
                this.pushBuffer(['[' + elements + ']', posi && posi.trim()]);
                return '___boundary_' + this.uid + '_' + index + '_as_list___';
            }).replace(replaceExpRegPattern.arraylike, (match, posi, elements) => {
                // console.log(match);
                elements = this.replaceBraces(elements);
                elements = this.replaceParentheses(elements);
                let index = this.replacements.length;
                this.pushBuffer(['[' + elements + ']', posi && posi.trim()]);
                return '___boundary_' + this.uid + '_' + index + '_as_arraylike___';
            });
            left = string.indexOf('[');
            right = string.indexOf(']');
        } else {
            if (right >= 0) {
                var index = right;
            } else {
                var index = left;
            }
            this.error('Unexpected `' + (right >= 0 ? ']' : '[') + '` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
        }
    }
    if (right >= 0) {
        var index = right;
        // console.log(left, right, string);
        this.error('Unexpected `]` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
    }
    return string;
}
replaceBraces(string) {
    let left = string.indexOf('{');
    let right = string.indexOf('}');
    let count = 0;
    while ((count < this.stringReplaceTimes) && (left >= 0)) {
        count++;
        // console.log(left, right);
        if (left < right) {
            string = this.replaceCodeSegments(string);
            string = this.recheckFnOrCallLikes(string)
            left = string.indexOf('{');
            right = string.indexOf('}');
        } else {
            if (right >= 0) {
                var index = right;
            } else {
                var index = left;
            }
            // console.log(left, right, string.substr(index, 256));
            this.error('Unexpected `' + (right >= 0 ? '}' : '{') + '` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
        }
    }
    if (right >= 0) {
        var index = right;
        // console.log(string);
        this.error('Unexpected `}` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
    }
    return string;
}
@include 'codes';
replaceParentheses(string) {
    string = this.replaceWords(string);
    let left = string.indexOf('(');
    let right = string.indexOf(')');
    let count = 0;
    while ((count < this.stringReplaceTimes) && (left >= 0)) {
        count++;
        // console.log(left, right);
        if (left < right) {
            string = string.replace(replaceExpRegPattern.parentheses, (match, posi, argslike) => {
                argslike = this.replaceOperators(argslike);
                argslike = this.replaceCalls(argslike);
                argslike = this.replaceArrowFunctions(argslike);
                let index = this.replacements.length;
                this.pushBuffer(['(' + argslike + ')', posi && posi.trim()]);
                return '___boundary_' + this.uid + '_' + index + '_as_parentheses___';
            });
            // console.log(string);
            string = this.recheckFnOrCallLikes(string);
            left = string.indexOf('(');
            right = string.indexOf(')');
        } else {
            if (right >= 0) {
                var index = right;
            } else {
                var index = left;
            }
            // console.log(string);
            this.error('Unexpected `' + (right >= 0 ? ')' : '(') + '` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
        }
    }
    if (right >= 0) {
        var index = right;
        this.error('Unexpected `)` in `' + this.decode(string.substr(index)).substr(0, 256) + '`');
    }
    string = this.replaceOperators(string);
    string = this.replaceCalls(string);
    string = this.replaceArrowFunctions(string);
    return string;
}