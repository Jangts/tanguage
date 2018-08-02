/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 09:53:45 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/draw/canvas'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var Charts = pandora.ns('draw.Charts', {});
    var canvas = imports['$_/draw/canvas'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var helpers = Charts.helpers;
    pandora.declareClass('draw.Charts.sharps.Line', Charts.Component, {
        ctx: undefined,
        index: 0,
        bezierCurve: false,
        bezierCurveTension: 0.4,
        datasetStroke: true,
        draw: function (closePath) {
            var ctx = this.ctx;
            if (this.bezierCurve) {
                var tension = (this.index > 0 && this.index < this.siblings - 1) ? this.bezierCurveTension : 0;
                this.controlPoints = helpers.splineCurve(
                    this.previous.point,
                    this.point,
                    this.next.point,
                    tension);
                if (this.grid) {
                    switch (this.grid.status) {
                        case 0:
                        if (this.controlPoints.outer.y > this.grid.bottomPoint) {
                            this.controlPoints.outer.y = this.grid.bottomPoint;
                        }
                        else if (this.controlPoints.outer.y < this.grid.topPoint) {
                            this.controlPoints.outer.y = this.grid.topPoint;
                        }
                        if (this.controlPoints.inner.y > this.grid.bottomPoint) {
                            this.controlPoints.inner.y = this.grid.bottomPoint;
                        }
                        else if (this.controlPoints.inner.y < this.grid.topPoint) {
                            this.controlPoints.inner.y = this.grid.topPoint;
                        }
                        break;
                        case 1:
                        if (this.controlPoints.outer.x > this.grid.rightPoint) {
                            this.controlPoints.outer.x = this.grid.rightPoint;
                        }
                        else if (this.controlPoints.outer.x < this.grid.leftPoint) {
                            this.controlPoints.outer.x = this.grid.leftPoint;
                        }
                        if (this.controlPoints.inner.x > this.grid.rightPoint) {
                            this.controlPoints.inner.x = this.grid.rightPoint;
                        }
                        else if (this.controlPoints.inner.x < this.grid.leftPoint) {
                            this.controlPoints.inner.x = this.grid.leftPoint;
                        }
                        break;
                    }
                }
            }
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.strokeStyle;
            if (this.radar && this.datasetStroke) {
                if (this.index === 0) {
                    ctx.beginPath();
                }
                switch (this.lineType) {
                    case 'dashed':;
                    return canvas.drawDashLine(ctx, this.previous.point.x, this.previous.point.y, this.point.x, this.point.y, ctx.lineWidth * 3);
                    case 'dotted':;
                    return canvas.drawDashLine(ctx, this.previous.point.x, this.previous.point.y, this.point.x, this.point.y, ctx.lineWidth);
                }
            }
            if (this.index === 0) {
                ctx.beginPath();
                canvas.to(ctx, this.point.x, this.point.y, 0);
            }
            else {
                if (this.bezierCurve) {
                    ctx.bezierCurveTo(
                        this.previous.controlPoints.outer.x,
                        this.previous.controlPoints.outer.y,
                        this.controlPoints.inner.x,
                        this.controlPoints.inner.y,
                        this.point.x,
                        this.point.y);
                }
                else {
                    canvas.to(ctx, this.point.x, this.point.y, 1);
                }
            }
            if ((this.index === this.siblings - 1) && this.datasetStroke) {
                if (closePath) {
                    ctx.closePath();
                }
                ctx.stroke();
            };
        }
    });
    
});
//# sourceMappingURL=Line.js.map