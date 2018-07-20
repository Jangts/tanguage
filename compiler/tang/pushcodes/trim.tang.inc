trim(string) {
    // 此处的replace在整理完成后，将进行分析归纳，最后改写为callback形式的
    // console.log(string);
    string = this.replaceStrings(string, true);
    // console.log(string);

    // 去除多余标注
    string = string.replace(/\s*(@boundary_\d+_as_comments::)?@(ownprop|return)[; \t]*/g, () => {
        return '';
    });
    string = string.replace(/((@boundary_\d+_as_comments::)\s*)+(@boundary_\d+_as_comments::)/g, "$3");
    // 去除多余符号
    string = string.replace(/\s*;(\s*;)*[\t \x0B]*/g, ";");
    string = string.replace(/(.)(\{|\[|\(|\.|\:)\s*[,;]+/g, (match, before, mark) => {
        if ((before === mark) && (before === ':')) {
            return match;
        }
        return before + mark;
    });
    // console.log(string);
    string = string.replace(/[;\s]*[\r\n]+(\t*)[ ]*(@boundary_\d+_as_comments::)(@boundary_\d+_as_operator::)\s*/g, (match, white, comments, midword) => {
        return "\r\n" + white.replace(/\t/g, '    ') + '   ' + comments + midword;
    });
    // console.log(string);
    string = string.replace(/\s*(@boundary_\d+_as_operator::)[;\s]*[\r\n]+(\t*)[ ]*(@boundary_\d+_as_comments::)/g, "\r\n$2   $3 $1 ");
    // console.log(string);
    string = string.replace(/(}*[;\s]*)[\r\n]+([ \t]*)[ ]*(@boundary_\d+_as_comments::)(@boundary_\d+_as_midword::)\s*/g, (match, pre, white, comments, midword) => {
        // console.log([match, pre, white, comments, midword]);
        return pre.replace(/\s+/g, '').replace(/\};/g, '}') + "\r\n" + white.replace(/\t/g, '    ') + comments + midword;
    });
    // console.log(string);
    // 格式化相应符号
    string = string.replace(/[;\s]*(\=|\?)[;\s]*/g, " $1 ");

    string = string.replace(/\s+(\:)[;\s]*/g, " $1 ");
    string = string.replace(/[;\s]+(@boundary_\d+_as_comments::)(\:)[;\s]*/g, " $2 $1");
    // console.log(string);
    string = string.replace(/[^\:\S]+(\:)\s*(@boundary_\d+_as_comments::)/g, " $1 $2");
    // console.log(string);
    // 删除多余空白与换行
    // string = string.replace(/[ ]+/g, " ");
    string = string.replace(/\s+[\r\n]([ \t])/g, (match, white)=>{
        return "\r\n"+white.replace(/\t/g, '    ');
    });
    string = string.replace(/\{\s+\}/g, '{}');
    string = string.replace(/\[\s+\]/g, '[]');
    string = string.replace(/\(\s+\)/g, '()');
    // 运算符处理
    string = string.replace(/(\s*)(@boundary_(\d+)_as_(operator|aftoperator|keyword|midword)::)\s*/g, (match, pregap, operator, index) => {
        // console.log(this.replacements[index]);
        if (this.replacements[index][1]) {
            // console.log(this.replacements[index]);
            return pregap + operator;
        }
        return operator;
    });
    // this.replacements = undefined;
    string = string.replace(/(@boundary_\d+_as_(preoperator)::)(\s*;+|(\s+([^;])))/g, (match, operator, word, right, afterwithgap, after) => {
        if (after) {
            return operator + after;
        }
        return operator;
    });
    return string;
}