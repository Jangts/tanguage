/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 10 Aug 2018 04:01:27 GMT
 */
;
// tang.config({});
tang.init().block([
    '$_/util/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var draw = pandora.ns('draw', {});
    var _ = pandora;
    var doc = root.document;
    var console = root.console, location = root.location;
    function getBeveling (x, y) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
    function checkX (ctx, x) {
        if (x  < 0) {
            return 0;
        }
        else if (x  > ctx.canvas.width) {
            return ctx.canvas.width;
        }
        return x;
    }
    function checkY (ctx, y) {
        if (y  < 0) {
            return 0;
        }
        else if (y  > ctx.canvas.height) {
            return ctx.canvas.height;
        }
        return y;
    }
    pandora.ns('draw.canvas', {
        to: function (ctx, x, y, method) {
            if (method === void 0) { method = 'move';}
            x = checkX(ctx, x);
            y = checkY(ctx, y);
            switch (method) {
                case 1:
                case '1':;
                case 'line':;
                ctx.lineTo(x, y);
                break;;
                case 2:
                case '2':;
                case 'stroke':;
                ctx.lineTo(x, y);
                ctx.stroke();
                break;;
                default:
                ctx.moveTo(x, y);
                break;;
            };
        },
        line: function (ctx, x1, y1, x2, y2, stroke, smooth, beforeClose) {
            ctx.beginPath();
            if (smooth) {
                x = checkX(ctx, x1);
                y = checkY(ctx, y1);
                x = checkX(ctx, x2);
                y = checkY(ctx, y2);
                ctx.quadraticCurveTo(x1, y1, x2, y2);
                stroke  && ctx.stroke();
            }
            else {
                draw.canvas.to(ctx, x1, y1, 0);
                draw.canvas.to(ctx, x2, y2, (stroke ? 2:1));
            }
            beforeClose  && beforeClose(draw.canvas.to, draw.canvas.line);
            ctx.closePath();
        },
        clear: function (ctx, width, height) {
            ctx.clearRect(0, 0, width, height);
        },
        fontString: function (pixelSize, fontStyle, fontFamily) {
            return fontStyle  + " " + pixelSize  + "px " + fontFamily;
        },
        longestText: function (ctx, font, arrayOfStrings) {
            var _arguments = arguments;
            ctx.font = font;
            var longest = 0;
            pandora.each(arrayOfStrings, function (index, string) {
                var textWidth = ctx.measureText(string).width;
                longest = (textWidth > longest) ? textWidth : longest;
            }, this);
            return longest;
        },
        drawRoundedRectangle: function (ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x  + radius, y);
            ctx.lineTo(x  + width  - radius, y);
            ctx.quadraticCurveTo(x  + width, y, x  + width, y  + radius);
            ctx.lineTo(x  + width, y  + height  - radius);
            ctx.quadraticCurveTo(x  + width, y  + height, x  + width  - radius, y  + height);
            ctx.lineTo(x  + radius, y  + height);
            ctx.quadraticCurveTo(x, y  + height, x, y  + height  - radius);
            ctx.lineTo(x, y  + radius);
            ctx.quadraticCurveTo(x, y, x  + radius, y);
            ctx.closePath();
        },
        drawDashLine: function (ctx, x1, y1, x2, y2, dashLen) {
            dashLen = dashLen  === undefined ? 5 : dashLen;
            var beveling = getBeveling(x2  - x1, y2  - y1);
            var num = Math.floor(beveling /dashLen);
            for (var i = 0;i  < num;i++) {
                ctx[i % 2 == 0 ? 'moveTo':'lineTo'](x1  + (x2 - x1)/num  * i, y1  + (y2 - y1)/num  * i);
            }
            ctx.stroke();
        },
        urlToBase64: function (url, callback, mime) {
            var canvas = doc.createElement('CANVAS');
            var ctx = canvas.getctx('2d');
            var img = new Image;
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL(mime  || 'image/png');
                callback.call(this, dataURL);
                canvas = null;
            }
            img.src = url;
        },
        fileToBlob: function (file) {
            return root.URL.createObjectURL(file);
        },
        fileToBase64: function (file, callback) {
            var reader = new FileReader();
            reader.onload = function (e) {
                Base64URL = reader.result;
                _.util.isFn(callback) && callback.call(reader, Base64URL);
            }
            reader.readAsDataURL(file);
            return 0;
        }
    });
    this.module.exports = draw.canvas;
});
//# sourceMappingURL=canvas.js.map