getYear (year) {
    switch (gettype(year, true)) {
        case 'Integer':
        case 'StringInteger':
            var y = parseInt(year)
            if (y) {
                return y;
            }
            return new Date().getFullYear();
        default:
            return new Date().getFullYear();
    }
}

getMonth (month, year) {
    switch (gettype(month, true)) {
        case 'Integer':
        case 'StringInteger':
            var m = parseInt(month) - 1;
            if (m >= 0 && m < 12) {
                return [m, getYear(year)];
            }
            if (year != undefined) {
                if (m >= 12) {
                    var inc = parseInt(m / 12);
                    m = m % 12;
                    return [m, getYear(year) + inc];
                }
                if (m < 0) {
                    var inc = parseInt(m / 12) - 1;
                    m = m % 12 + 12;
                    return [m, getYear(year) + inc];
                }

            }

        case 'Float':
        case 'StringFloat':
            var date = new Date(parseFloat(month));
            return [date.getMonth(), date.getFullYear()];

        case 'String':
            var m = has(months, month);
            if (m !== false) {
                return [m, getYear(year)];
            }
            m = has(mons, month);
            if (m !== false) {
                return [m, getYear(year)];
            }
            var date = new Date(month);
            m = date.getMonth();
            if (m) {
                return [m, date.getFullYear()];
            }
            var date = new Date();
            return [date.getMonth(), date.getFullYear()];

        case 'Array':
            return getMonth(month[0], month[1]);
        default:
            var date = new Date();
            return [date.getMonth(), date.getFullYear()];
    }
}

getStr (num) {
    if (num > 9) {
        return num.toString();
    }
    return '0' + num;
}

getDays (month, year, days) {
    var day, lastdate;
    days.length = 0;
    days.firstDay = new Date(year, month, 1).getDay();
    month++;
    lastdate = new Date(year, month, 0);
    days.lastDay = lastdate.getDay();
    lastdate = lastdate.getDate();
    for (day = 1; day <= lastdate; day++) {
        var arr = [year.toString(), getStr(month), getStr(day)];
        arr.year = year;
        arr.month = month - 1;
        arr.day = day;
        arr.dow = (days.firstDay + day - 1) % 7;
        days.push(arr);
    }
}

removeByIndex (array, index) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
        i == index || result.push(array[i]);
    }
    return result;
}