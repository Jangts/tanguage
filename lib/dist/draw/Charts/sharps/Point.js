/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 09:53:45 GMT
 */;
// tang.config({});
tang.init().block([], function (pandora, root, imports, undefined) {
    var module = this.module;
    var Charts = pandora.ns('draw.Charts', {});
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    pandora.declareClass('draw.Charts.sharps.Point', Charts.Component, {
        ctx: undefined,
        display: true,
        strictHover: false,
        type: 0,
        radius: 5,
        globalAlpha: 1,
        draw: function () {
            if (this.display) {
                var ctx = this.ctx;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.closePath();
                ctx.globalAlpha = this.globalAlpha;
                ctx.fillStyle = this.fillColor;
                ctx.fill();
                ctx.globalAlpha = 1;
                if (this.strokeWidth > 0) {
                    ctx.strokeStyle = this.strokeColor;
                    ctx.lineWidth = this.strokeWidth;
                    ctx.stroke();
                }
            };
        },
        inRange: function (X, Y, strictHover) {
            if (strictHover) {
                var hitDetectionRange = this.hitDetectionRadius + this.radius;
                return ((Math.pow(X - this.x, 2) + Math.pow(Y - this.y, 2)) < Math.pow(hitDetectionRange, 2));
            }
            else {
                switch (this.type) {
                    case 0:
                    var hitDetectionRange = this.hitDetectionRadius + this.radius;
                    return (Math.pow(X - this.x, 2) < Math.pow(hitDetectionRange, 2));
                    break;
                    case 1:
                    var hitDetectionRange = this.hitDetectionRadius + this.radius;
                    return (Math.pow(Y - this.y, 2) < Math.pow(hitDetectionRange, 2));
                    break;
                    default:
                    var hitDetectionRange = this.hitDetectionRadius + this.radius;
                    return ((Math.pow(X - this.x, 2) + Math.pow(Y - this.y, 2)) < Math.pow(hitDetectionRange, 2));
                }
            };
        }
    });
    
});
//# sourceMappingURL=Point.js.map