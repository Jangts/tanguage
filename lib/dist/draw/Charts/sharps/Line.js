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
                    case 'dashed':
                    return pandora.draw.canvas.drawDashLine(ctx, this.previous.point.x, this.previous.point.y, this.point.x, this.point.y, ctx.lineWidth * 3);
                    case 'dotted':
                    return pandora.draw.canvas.drawDashLine(ctx, this.previous.point.x, this.previous.point.y, this.point.x, this.point.y, ctx.lineWidth);
                }
            }
            if (this.index === 0) {
                ctx.beginPath();
                ctx.moveTo(this.point.x, this.point.y);
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
                    ctx.lineTo(this.point.x, this.point.y);
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