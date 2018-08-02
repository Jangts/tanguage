/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 09:53:49 GMT
 */;
// tang.config({});
tang.init().block([], function (pandora, root, imports, undefined) {
    var module = this.module;
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var charToInteger = {};
    var integerToChar = {};
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('').forEach(function (char, i) {
        charToInteger[char] = i;
        integerToChar[i] = char;
    });
    function decode (string) {
        var result = [];
        var shift = 0;
        var value = 0;
        for (var i = 0;i < string.length;i += 1) {
            var integer = charToInteger[string[i]];
            if (integer === undefined) {
                throw new Error('Invalid character (' + string[i] + ')');
            }
            var hasContinuationBit = integer & 32;
            integer &= 31;
            value += integer << shift;
            if (hasContinuationBit) {
                shift += 5;
            }
            else {
                var shouldNegate = value & 1;
                value >>= 1;
                result.push(shouldNegate ?  -value : value);
                value = shift = 0;
            }
        }
        return result;
    }
    function encode (value) {
        var result = void 0;
        if (typeof value === 'number') {
            result = encodeInteger(value);
        }
        else {
            result = '';
            for (var i = 0;i < value.length;i += 1) {
                result += encodeInteger(value[i]);
            }
        }
        return result;
    }
    function encodeInteger (num) {
        var result = '';
        if (num < 0) {
            num = ( -num << 1)| 1;
        }
        else {
            num <<= 1;
        }
        do {
            var clamped = num & 31;
            num >>= 5;
            if (num > 0) {
                clamped |= 32;
            }
            result += integerToChar[clamped];
        }while(num > 0);
        return result;
    }
    exports = {
        encode: encode,
        decode: decode
    };
    pandora.ns('str.vlq', {});
    this.module.exports = _.hash;
});
//# sourceMappingURL=vlq.js.map