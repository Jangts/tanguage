/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 10 Aug 2018 04:01:29 GMT
 */
;
// tang.config({});
tang.init().block([], function (pandora, root, imports, undefined) {
    var module = this.module;
    var Charts = pandora.ns('draw.Charts', {});
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var helpers = Charts.helpers;
    pandora.declareClass('draw.Charts.sharps.Arc', Charts.Component, {
        inRange: function (chartX, chartY) {
            var pointRelativePosition = helpers.getAngleFromPoint(this, {
                x: chartX,
                y: chartY
            });
            var pointRelativeAngle = pointRelativePosition.angle  % (Math.PI * 2);
            var startAngle = (Math.PI * 2 + this.startAngle) % (Math.PI * 2);
            var endAngle = (Math.PI * 2 + this.endAngle) % (Math.PI * 2) || 360;
            var betweenAngles = (endAngle < startAngle) ? pointRelativeAngle  <= endAngle  || pointRelativeAngle  >= startAngle : pointRelativeAngle  >= startAngle  && pointRelativeAngle  <= endAngle;
            var withinRadius = (pointRelativePosition.distance >= this.innerRadius && pointRelativePosition.distance <= this.outerRadius);
            return (betweenAngles && withinRadius);
        },
        tooltipPosition: function () {
            var centreAngle = this.startAngle  + ((this.endAngle - this.startAngle)/2);
            var rangeFromCentre = (this.outerRadius - this.innerRadius)/2  + this.innerRadius;
            return {
                x: this.x  + (Math.cos(centreAngle) * rangeFromCentre),
                y: this.y  + (Math.sin(centreAngle) * rangeFromCentre)
            };
        },
        draw: function (animationPercent) {
            var easingDecimal = animationPercent  || 1;
            var ctx = this.ctx;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.outerRadius  < 0 ? 0 : this.outerRadius, this.startAngle, this.endAngle);
            ctx.arc(this.x, this.y, this.innerRadius  < 0 ? 0 : this.innerRadius, this.endAngle, this.startAngle, true);
            ctx.closePath();
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;
            ctx.fillStyle = this.fillColor;
            ctx.fill();
            ctx.lineJoin = 'bevel';
            if (this.showStroke) {
                ctx.stroke();
            };
        }
    });
    
});
//# sourceMappingURL=Arc.js.map