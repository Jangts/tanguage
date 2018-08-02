/*!
 * tanguage framework source code
 *
 * class .data.Uploader
 *
 * Date 2017-04-06
 */
;
normalFormatter(attributes) {
    return {
        base: attributes.type,
        type: attributes.type,
        length: attributes.length || 0,
        default: attributes.default || '',
        range: attributes.range || null
    };
}
notNullFormatter(attributes) {
    return {
        base: attributes.type.split(' ')[0],
        type: attributes.type,
        length: attributes.length || 0,
        default: attributes.default || null,
        range: attributes.range || null
    };
}
timeFormatter(attributes) {
    return {
        base: 'time',
        type: attributes.type,
        default: attributes.default || null
    };
}
modelsConstrutor(input) {
    var keys = _.obj.keysArray(input).sort(),
        props = {};
    each (input as prop, attributes) {
        if (attributes.type && formatter[attributes.type]) {
            input[prop] = formatter[attributes.type](attributes);
        } else {
            input[prop] = formatter['scala'](attributes);
        }
    }
    each (keys as i, prop) {
        props[prop] = input[prop];
    }
    return props;
}
uidMaker(props) {
    var josn = JSON.stringify(props);
    return _.str.hash.md5(josn);
}
check(property, value) {
    switch (property.base) {
        case 'string':
            return checkString(property, value);

        case 'time':
            return checkTime(property, value);

        case 'int':
        case 'number':
            return checkNumber(property, value);

        case 'bool':
            return checkBoolean(value);

        case 'any':
            return checkAny(property, value);
    }
    return false;
}
checkString(property, value) {
    if (value || property.type === 'string') {
        return _.util.isStr(value) && checkLength(property.length, value) && checkRange(property.range, value);
    }
    return false;
}
checkTime(property, value) {
    if (_.util.isStr(value)) {
        switch (property.type) {
            case 'fulldate':
                return /^\s*\d{4}\-\d{1,2}\-\d{1,2}\s*$/.test(value);
            case 'month':
                return /^\s*\d{4}\-\d{1,2}\s*$/.test(value);
            case 'dayofyear':
                return /^\s*\d{1,2}\-\d{1,2}\s*$/.test(value);
            case 'timeofday':
                return /^\s*\d{1,2}\:\d{1,2}\:\d{1,2}\s*$/.test(value);
            case 'hourminute':
                return /^\s*\d{1,2}\:\d{1,2}\s*$/.test(value);
            default:
                return /^\s*\d{4}\-\d{1,2}\-\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}\s*$/.test(value);
        }
    }
    return false;
}
checkNumber(property, value) {
    switch (property.type) {
        case 'int not null':
            if (!value && value != 0) {
                return false;
            }
        case 'int':
            return _.util.isInt(value) && checkLength(property.length, value.toString()) && checkRange(property.range, value);

        case 'number not null':
            if (!value && value != 0) {
                return false;
            }
        default:
            return _.util.isNumeric(value) && checkLength(property.length, value.toString()) && checkRange(property.range, value);
    }
}
checkBoolean(value) {
    return _.util.isBool(value);
}
checkAny(property, value) {
    if (property.type === 'any') {
        return true;
    }
    switch (typeof value) {
        case 'string':
            return checkLength(property.length, value) && checkRange(property.range, value);

        case 'number':
            return checkLength(property.length, value.toString()) && checkRange(property.range, value);

        case 'boolean':
            if (value) {
                return checkLength(property.length, 'true') && checkRange(property.range, value);
            }
            return checkLength(property.length, 'false') && checkRange(property.range, value);
    }
    return false;
}
checkLength(length, value) {
    if (length) {
        return value.length <= length;
    }
    return true;
}
checkRange(range, value) {
    if (range && range.length) {
        return _.util.inArr(value, range, true);
    }
    return true;
}