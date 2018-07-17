/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 17 Jul 2018 03:48:08 GMT
 */;
// tang.config({});
tang.init().block([], function (pandora, root, imports, undefined) {
    var module = this.module;
    var Charts = pandora.ns('draw.Charts', {});
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    pandora.declareClass('draw.Charts.sharps.Rectangle', Charts.Component, {
        ctx: undefined,
        type: 0,
        radius: 0,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        draw: function () {
            switch (this.type) {
                case 0:
                case 2:
                this.drawVertical();
                break;
                case 1:
                case 3:
                this.drawHorizontal();
                break;
            };
        },
        drawVertical: function () {
            var ctx = this.ctx;
            var halfWidth = this.radius;
            var leftX = this.x1 - halfWidth;
            var rightX = this.x2 + halfWidth;
            var startY = this.y1;
            var endY = this.y2;
            var halfStroke = this.strokeWidth/2;
            if (this.showStroke) {
                leftX += halfStroke;
                rightX -= halfStroke;
                endY = (endY < startY) ? endY + halfStroke : endY - halfStroke;
                if (this.type === 2) {
                    startY = (endY < startY) ? startY - halfStroke : startY + halfStroke;
                }
            }
            ctx.beginPath();
            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;
            ctx.moveTo(leftX, startY);
            ctx.lineTo(leftX, endY);
            ctx.lineTo(rightX, endY);
            ctx.lineTo(rightX, startY);
            if (this.type === 2) {
                ctx.lineTo(leftX, startY);
            }
            ctx.fill();
            if (this.showStroke) {
                ctx.stroke();
            };
        },
        drawHorizontal: function () {
            var ctx = this.ctx;
            var halfHeight = this.radius;
            var startX = this.x1;
            var endX = this.x2;
            var topY = this.y1 - halfHeight;
            var bottomY = this.y2 + halfHeight;
            var halfStroke = this.strokeWidth/2;
            if (this.showStroke) {
                topY += halfStroke;
                bottomY -= halfStroke;
                endX = (endX > startX) ? endX - halfStroke : endY + halfStroke;
                if (this.type === 4) {
                    startX = (endX > startX) ? startX + halfStroke : startX - halfStroke;
                }
            }
            ctx.beginPath();
            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;
            ctx.moveTo(startX, topY);
            ctx.lineTo(endX, topY);
            ctx.lineTo(endX, bottomY);
            ctx.lineTo(startX, bottomY);
            if (this.type === 2) {
                ctx.lineTo(startX, topY);
            }
            ctx.fill();
            if (this.showStroke) {
                ctx.stroke();
            };
        },
        hasValue: function () {
            return pandora.util.isNumber(this.value2);
        },
        inRange: function (X, Y) {
            switch (this.type) {
                case 0:
                case 2:
                return ((X >= (this.x1 - this.radius/2)) && (X <= (this.x1 + this.radius/2))) && ((Y >= this.y1 && Y <= this.y2) || (Y <= this.y1 && Y >= this.y2));
                break;
                case 1:
                case 3:
                return ((Y >= (this.y1 - this.radius/2)) && (Y <= (this.y1 + this.radius/2))) && ((X >= this.x1 && X <= this.x2) || (X <= this.x1 && X >= this.x2));
                break;
            };
        }
    });
    
});