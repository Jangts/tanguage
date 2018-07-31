/*!
 * tanguage script compiled code
 *
 * Datetime: Mon, 30 Jul 2018 22:32:46 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/obj/',
    '$_/draw/canvas',
    '$_/draw/Charts/',
    '$_/draw/Charts/modules/grid',
    '$_/draw/Charts/sharps/Line',
    '$_/draw/Charts/sharps/Point'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var Charts = pandora.ns('draw.Charts', {});
    var deepMerge = imports['$_/obj/'] && imports['$_/obj/']['deepMerge'];
    var canvas = imports['$_/draw/canvas'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var helpers = Charts.helpers;
    var defaultConfig = {
        name: '',
        zIndex: 0,
        showPoint: true,
        itemStyle: {
            normal: {
                color: null,
                radius: 3,
                borderColor: null,
                borderWidth: 1
            },
            emphasis: {
                color: null,
                radius: 4,
                borderColor: null,
                borderWidth: 1
            }
        },
        showLine: true,
        lineStyle: {
            normal: {
                borderColor: null,
                borderWidth: 2
            }
        },
        showArea: false,
        areaStyle: {
            color: null
        },
        hitDetectionRadius: 10,
        smooth: false,
        smoothTension: 0.4,
        data: []
    }
    var Line = pandora.declareClass(Charts.Type, {
        defaults: defaultConfig,
        initialize: function (options) {
            var instance = this.instance;
            var options = deepMerge(this.defaults, options);
            this.options = {
                index: options.index,
                name: options.name,
                pointDot: options.showPoint,
                pointColor: options.itemStyle.normal.color || this.instance.options.lineColorDefaults[options.index % this.instance.options.lineColorDefaults.length],
                pointDotRadius: options.itemStyle.normal.radius,
                pointStrokeColor: options.itemStyle.normal.borderColor || '#FFFFFF',
                pointDotStrokeWidth: options.itemStyle.normal.borderWidth,
                pointEmphasisFill: options.itemStyle.emphasis.color || '#FFFFFF',
                pointEmphasisRadius: options.itemStyle.emphasis.radius,
                pointEmphasisStroke: options.itemStyle.emphasis.borderColor || options.itemStyle.normal.borderColor || this.instance.options.lineColorDefaults[options.index % this.instance.options.lineColorDefaults.length],
                pointEmphasisStrokeWidth: options.itemStyle.emphasis.borderWidth,
                datasetStroke: options.showLine,
                datasetStrokeWidth: options.lineStyle.borderWidth,
                strokeColor: options.lineStyle.borderColor || this.instance.options.lineColorDefaults[options.index % this.instance.options.lineColorDefaults.length],
                datasetFill: options.showArea,
                fillColor: options.areaStyle.color || this.instance.options.areaColorDefaults[options.index % this.instance.options.areaColorDefaults.length],
                bezierCurve: options.smooth,
                bezierCurveTension: options.smoothTension,
                pointHitDetectionRadius: options.hitDetectionRadius,
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>"
            };
            this.lines = [];
            this.segments = [];
            this.grid = this.instance.grid;
            this.LineClass = pandora.declareClass(Charts.sharps.Line, {
                ctx: this.ctx,
                grid: this.grid,
                bezierCurve: this.options.bezierCurve,
                bezierCurveTension: this.options.bezierCurveTension,
                lineWidth: this.options.datasetStrokeWidth,
                strokeStyle: this.options.strokeColor,
                datasetStroke: this.options.datasetStroke
            })
            this.PointClass = pandora.declareClass(Charts.sharps.Point, {
                type: this.grid.status,
                ctx: this.ctx,
                grid: this.grid,
                itemLabel: this.options.name,
                display: this.options.pointDot,
                emphasisDisplay: true,
                fillColor: this.options.pointColor,
                emphasisFill: this.options.pointEmphasisFill || this.options.pointColor,
                radius: this.options.pointDotRadius,
                emphasisRadius: this.options.pointEmphasisRadius,
                strokeColor: this.options.pointStrokeColor,
                emphasisStroke: this.options.pointEmphasisStroke || this.options.pointStrokeColor,
                strokeWidth: this.options.pointDotStrokeWidth,
                emphasisStrokeWidth: this.options.pointEmphasisStrokeWidth,
                hitDetectionRadius: this.options.pointHitDetectionRadius,
                strictHover: this.instance.options.tooltip.strictHover
            })
            this.buildSegment(options.data);
        },
        buildSegment: function (data) {
            var _arguments = arguments;
            pandora.each(data, function (index, value) {
                this.addSegment(index, value);
            }, this);
            pandora.each(this.lines, function (index, line) {
                line.previous = this.lines[index - 1] || line;
                line.next = this.lines[index + 1] || line;
                line.siblings = this.lines.length;
            }, this);
        },
        update: function (data) {
            var _arguments = arguments;
            pandora.each(this.segments, function (index, segment) {
                segment.value = data && data[index] || 0;
                segment.base = this.grid.baseY;
                segment.restore(['display', 'fillColor', 'radius', 'strokeColor', 'strokeWidth']);
                segment.save();
                this.calculate(index, segment);
            }, this);
            for (var index = this.segments.length;index < data.length;index++) {
                this.addSegment(index, data[index]);
            }
            pandora.each(this.lines, function (index, line) {
                line.previous = this.lines[index - 1] || line;
                line.next = this.lines[index + 1] || line;
                line.siblings = this.lines.length;
            }, this);
        },
        addSegment: function (index, value) {
            var segment = new this.PointClass({
                type: this.grid.status,
                value: value,
                label: (this.grid.status === 1) ? this.grid.yLabels[index]: this.grid.xLabels[index]
            });
            var line = new this.LineClass({
                index: index,
                point: segment
            });
            this.lines.push(line);
            this.segments.push(segment);
            this.calculate(index, segment);
            _.extend(segment, true, {
                x: this.segments[index - 1] ? this.segments[index - 1].X : segment.X,
                y: this.segments[index - 1] ? this.segments[index - 1].Y : segment.Y,
                titleLabel: segment.label
            });
            segment.save();
        },
        calculate: function (index, segment) {
            switch (segment.type) {
                case 0:
                _.extend(segment, true, {
                    X: this.grid.calculateX(index),
                    Y: this.grid.calculateY(segment.value)
                });
                break;
                case 1:
                _.extend(segment, true, {
                    X: this.grid.calculateX(segment.value),
                    Y: this.grid.calculateY(index)
                });
                break;
            };
        },
        removeSegment: function (index) {
            index = parseInt(index) || 0;
            this.segments.splice(index, 1);
        },
        getSegmentsAtEvent: function (e, charts) {
            var _arguments = arguments;
            var segmentsArray = [];
            var eventPosition = helpers.getRelativePosition(e);
            pandora.loop(this.segments, function (index, segment) {
                if (segment.inRange(eventPosition.x, eventPosition.y, (charts === undefined))) {
                    if (charts && charts.length) {
                        pandora.each(charts, function (i, chart) {
                            segmentsArray.push(chart.segments[index]);
                        }, this);
                    }
                    else {
                        segmentsArray.push(segment);
                    }
                    pandora.loop.out();
                    return;
                };
            }, this);
            return segmentsArray;
        },
        draw: function (ease) {
            var _arguments = arguments;
            var easingDecimal = ease || 1;
            var ctx = this.ctx;
            var points = [];
            pandora.each(this.segments, function (index, segment) {
                if (segment.hasValue()) {
                    segment.transition({
                        x: segment.X,
                        y: segment.Y
                    }, easingDecimal);
                    this.lines[index].draw();
                    points.push(segment);
                };
            }, this);
            if (this.options.datasetFill && (points.length > 0) && ((this.grid.status === 0) || (this.grid.status === 1))) {
                if (this.grid.status === 0) {
                    canvas.to(ctx, points[points.length - 1].x, this.grid.baseY, 1);
                    canvas.to(ctx, points[0].x, this.grid.baseY, 1);
                }
                else {
                    canvas.to(ctx, this.grid.baseX, points[points.length - 1].y, 1);
                    canvas.to(ctx, this.grid.baseX, points[0].y, 1);
                }
                ctx.globalAlpha = 0.85;
                ctx.fillStyle = this.options.fillColor;
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = 1;
            }
            pandora.each(points, function (index, point) {
                point.draw();
            }, this);
        }
    });
    Charts.prototype.line = function () {
        var _arguments = arguments;
        var chart = void 0;
        var chartName = void 0;
        var id = 0;
        if (this.grid) {
            grid = this.grid;
            grid.charts.lines = grid.charts.lines || [];
            pandora.each(this.series.line, function (i, options) {
                options.index = id++;
                chartName = this.getChartName(options.name);
                if (this.historyCharts[chartName] && this.historyCharts[chartName].type == 'line') {
                    chart = this.historyCharts[chartName];
                    chart.update(options.data, options.index);
                }
                else {
                    chart = new Line(options, this, options.zIndex);
                    chart.type = 'line';
                    this.historyCharts[chartName] = chart;
                }
                grid.charts.lines.push(chart);
                this.activedCharts.push(chart);
            }, this);
        };
    };
});
//# sourceMappingURL=line.js.map