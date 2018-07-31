/*!
 * tanguage script compiled code
 *
 * Datetime: Tue, 31 Jul 2018 16:53:08 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/obj/',
    '$_/draw/Charts/',
    '$_/draw/Charts/modules/grid',
    '$_/draw/Charts/sharps/Point'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var Charts = pandora.ns('draw.Charts', {});
    var deepMerge = imports['$_/obj/'] && imports['$_/obj/']['deepMerge'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var helpers = Charts.helpers;
    var defaultConfig = {
        name: '',
        zIndex: 0,
        showPoint: true,
        symbolSize: 10,
        itemStyle: {
            normal: {
                color: null,
                borderColor: null,
                borderWidth: 0
            },
            emphasis: {
                color: null,
                borderColor: null,
                borderWidth: 0
            }
        },
        hitDetectionRadius: 10,
        data: []
    }
    var Scatter = pandora.declareClass(Charts.Type, {
        defaults: defaultConfig,
        initialize: function (options) {
            var instance = this.instance;
            var options = deepMerge(this.defaults, options);
            this.options = {
                index: options.index,
                name: options.name,
                pointDot: options.showPoint,
                pointColor: options.itemStyle.normal.color || this.instance.options.lineColorDefaults[options.index % this.instance.options.lineColorDefaults.length],
                symbolSize: options.symbolSize,
                pointStrokeColor: options.itemStyle.normal.borderColor || '#FFFFFF',
                pointDotStrokeWidth: options.itemStyle.normal.borderWidth,
                pointEmphasisFill: options.itemStyle.emphasis.color || '#FFFFFF',
                pointEmphasisStroke: options.itemStyle.emphasis.borderColor || options.itemStyle.normal.borderColor || this.instance.options.lineColorDefaults[options.index % this.instance.options.lineColorDefaults.length],
                pointEmphasisStrokeWidth: options.itemStyle.emphasis.borderWidth,
                pointHitDetectionRadius: options.hitDetectionRadius,
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>"
            };
            this.segments = [];
            this.grid = this.instance.grid;
            this.PointClass = pandora.declareClass(Charts.sharps.Point, {
                type: this.grid.status,
                ctx: this.ctx,
                grid: this.grid,
                itemLabel: this.options.name,
                display: this.options.pointDot,
                radius: 1,
                globalAlpha: 0.85,
                emphasisDisplay: true,
                fillColor: this.options.pointColor,
                emphasisFill: this.options.pointEmphasisFill || this.options.pointColor,
                emphasisRadius: this.options.pointEmphasisRadius,
                strokeColor: this.options.pointStrokeColor,
                emphasisStroke: this.options.pointEmphasisStroke || this.options.pointStrokeColor,
                strokeWidth: this.options.pointDotStrokeWidth,
                emphasisStrokeWidth: this.options.pointEmphasisStrokeWidth,
                hitDetectionRadius: this.options.pointHitDetectionRadius,
                strictHover: true
            })
            this.buildSegment(options.data);
        },
        buildSegment: function (data) {
            var _arguments = arguments;
            pandora.each(data, function (index, value) {
                this.addSegment(index, value);
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
            };
        },
        addSegment: function (index, value) {
            var segment = new this.PointClass({
                type: this.grid.status,
                value: value,
                label: (this.grid.status === 1) ? this.grid.yLabels[index]: this.grid.xLabels[index]
            });
            this.segments.push(segment);
            this.calculate(index, segment);
            segment.x = segment.X;
            segment.y = segment.Y;
            segment.emphasisRadius = segment.R * 1.2;
            segment.save();
        },
        calculate: function (index, segment) {
            _.extend(segment, true, {
                X: this.grid.calculateX(segment.value[0]),
                Y: this.grid.calculateY(segment.value[1]),
                R: (function (symbolSize, value) {
                    if (typeof symbolSize === 'number') {
                        return symbolSize/2;
                    }
                    if (typeof symbolSize === 'function') {
                        var val = symbolSize(value);
                        if (typeof val === 'number') {
                            return val/2;
                        }
                    }
                    return 5;
                })(this.options.symbolSize, segment.value)
            });
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
                if (segment.inRange(eventPosition.x, eventPosition.y)) {
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
            pandora.each(this.segments, function (index, segment) {
                segment.transition({
                    x: segment.X,
                    y: segment.Y,
                    radius: segment.R
                }, easingDecimal).draw();
            }, this);
        }
    });
    Charts.prototype.scatter = function () {
        var _arguments = arguments;
        var chart = void 0;
        var chartName = void 0;
        var id = 0;
        var grid = this.grid;
        grid.charts.scatters = grid.charts.scatters || [];
        if (grid) {
            _.extend(grid, true, {
                calculateRadius: function () {
                    var xWidth = this.calculateBaseWidth(valueSpacing);
                    var xAbsolute = this.calculateX(barIndex) - (xWidth/2);
                    var barWidth = this.calculateBarWidth(datasetCount, datasetSpacing, valueSpacing);
                    return xAbsolute + (barWidth * datasetIndex) + (datasetIndex * datasetSpacing) + barWidth/2;
                }
            });
            pandora.each(this.series.scatter, function (i, options) {
                options.index = id++;
                chartName = this.getChartName(options.name);
                if (this.historyCharts[chartName] && this.historyCharts[chartName].type == 'scatter') {
                    chart = this.historyCharts[chartName];
                    chart.update(options.data, options.index);
                }
                else {
                    chart = new Scatter(options, this, options.zIndex);
                    chart.type = 'scatter';
                    this.historyCharts[chartName] = chart;
                }
                grid.charts.scatters.push(chart);
                this.activedCharts.push(chart);
            }, this);
        };
    };
});