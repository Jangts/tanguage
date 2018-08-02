/*!
 * tanguage framework source code
 *
 * class Time.Month extends Iterator
 *
 * Date 2017-04-06
 */
;
/**
 * 一个月份构建类，其实例同时是一个数组对象，可以遍历其中的日期
 * 同时该类是_.Iterator的子类，这使得他自带迭代器的功能，可以自遍历
 * 
 * @param   {number, string}    month          月份，0-11的数或数字
 * @param   {number, string}    year           年份
 *  
 */
class Month extends _.Iterator {
    year = 1970;
    month = 0;
    days = [];
    firstDay = 0;
    lastDay = 0;

    _init(month, year) {
        var month = getMonth(month, year);
        this.year = month[1];
        this.month = month[0];
        getDays(month[0], month[1], this);
    }

    prevMonth(createNewInstance) {
        if (createNewInstance === false) {
            this._init(this.month, this.year);
            return this;
        }
        return new Month(this.month, this.year);
    }

    nextMonth(createNewInstance) {
        if (createNewInstance === false) {
            this._init(this.month + 2, this.year);
            return this;
        }
        return new Month(this.month + 2, this.year);
    }

    prevYear(createNewInstance) {
        if (createNewInstance === false) {
            this._init(this.month, this.year - 1);
            return this;
        }
        return new Month(this.month, this.year - 1);
    }

    nextYear(createNewInstance) {
        if (createNewInstance === false) {
            this._init(this.month, this.year + 1);
            return this;
        }
        return new Month(this.month, this.year + 1);
    }

    static format = getStr;
}