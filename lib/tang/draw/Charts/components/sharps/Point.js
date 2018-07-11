/*!
 * tanguage framework source code
 * Date: 2015-09-04
 */
;
tang.init().block(['$_/draw/Charts/components/Abstract'], function(pandora, root, imports, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,

        doc = root.document,
        console = root.console;

    declare('draw.Charts.components.sharps.Point', _.draw.Charts.components.Abstract, {
        display: true,
        strictHover: false,
        type: 0,
        radius: 5,
        globalAlpha: 1,
        draw: function() {
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
            }
        },
        inRange: function(X, Y, strictHover) {
            if (strictHover) {
                var hitDetectionRange = this.hitDetectionRadius + this.radius;
                return ((Math.pow(X - this.x, 2) + Math.pow(Y - this.y, 2)) < Math.pow(hitDetectionRange, 2));
            } else {
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
            }
        }
    })
});