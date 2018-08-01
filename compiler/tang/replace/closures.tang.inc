replaceClosures(string) {
    return string.replace(replaceExpRegPattern.closure, (match, posi1, word, posi3, closure) => {
        // console.log(match, '|', word, '|', posi2, '|', posi3, '|', closure);
        // if (!word && match.match(/\s*\{\s*\}/)) {
        //     console.log(posi2, '|', posi3);
        //     return '@boundary_0_as_mark::';
        // }
        closure = this.replaceParentheses(closure);
        // closure = this.replaceOperators(closure, false);
        // console.log(closure);
        posi1 = posi1 ? posi1.trim() : '';
        posi3 = posi3 ? posi3.trim() : '';
        let index = this.replacements.length;
        let index2;
        switch (word) {
            case undefined:
                // console.log(word, closure);
                // console.log(closure.indexOf(';') >= 0);
                // console.log(!closure.match(/^\s*(@\d+L\d+P\d+O?\d*:::)?(___boundary_[A-Z0-9_]{36}_\d+_as_function___|[\$a-zA-Z_][\$\w]*\s*(,|:|$))/));
                if ((closure.indexOf(';') >= 0) ||
                    !closure.match(/^\s*(@\d+L\d+P\d+O?\d*:::)?(___boundary_[A-Z0-9_]{36}_\d+_as_function___|[\$a-zA-Z_][\$\w]*\s*(,|:|$))/)) {
                    // console.log('foo');
                    this.pushBuffer(['{' + closure + '}', posi3]);
                    return posi1 + (word || '') + posi3 + ' ___boundary_' + this.uid + '_' + index + '_as_closure___';
                }
                if (closure.match(/^\s*___boundary_[A-Z0-9_]{36}_\d+_as_function___\s*$/)) {
                    // console.log('bar');
                    this.pushBuffer(['{' + closure + '}', posi3]);
                    return posi1 + (word || '') + posi3 + ' ___boundary_' + this.uid + '_' + index + '_as_objlike___';
                }
                // console.log(closure);
                // console.log(word, '|', posi2, '|', posi3);
                this.pushBuffer(['{' + closure + '}', posi3]);
                return '___boundary_' + this.uid + '_' + index + '_as_object___';

            case ':':
            case ':::':
            case '=':
                this.pushBuffer(['{' + closure + '}']);
                return word + ' ___boundary_' + this.uid + '_' + index + '_as_object___';

            case '@config':
                if (this.configinfo === '{}') {
                    this.configinfo_posi = posi1 || posi3;
                    this.configinfo = this.decode(match.replace('@config', ''));
                }
                return '';

            case 'return':
            case 'typeof':
                this.pushBuffer([word + ' ', posi1]);
                index2 = this.replacements.length;
                this.pushBuffer(['{' + closure + '}']);
                return '@boundary_' + index + '_as_preoperator::___boundary_' + this.uid + '_' + index2 + '_as_object___';

            case 'do':
            case 'try':
                this.pushBuffer([word + ' ', posi1]);
                index2 = this.replacements.length;
                this.pushBuffer(['{' + closure + '}', posi3]);
                return '; @boundary_' + index + '_as_keyword::___boundary_' + this.uid + '_' + index2 + '_as_closure___;';

            case 'else':
            case 'finally':
                this.pushBuffer([word + ' ', posi1]);
                index2 = this.replacements.length;
                this.pushBuffer(['{' + closure + '}', posi3]);
                return "\r\n" + '@boundary_' + index + '_as_midword::___boundary_' + this.uid + '_' + index2 + '_as_closure___';

            default:
                if (word.indexOf('(') === 0) {
                    // console.log(true, word);
                    this.pushBuffer(['{' + closure + '}', posi3]);
                    return word + '___boundary_' + this.uid + '_' + index + '_as_object___';
                }
                // console.log(word, closure);
                this.pushBuffer(['{' + closure + '}', posi3]);
                return posi1 + word + "\r\n" + posi3 + '___boundary_' + this.uid + '_' + index + '_as_closure___';
        }
    });
}