/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 20 Jul 2018 14:51:49 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/arr/',
    '$_/obj/',
    '$_/util/',
    '$_/draw/Charts/',
    '$_/draw/Charts/sharps/Arc'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var Charts = pandora.ns('draw.Charts', {});
    var sum = imports['$_/arr/'] && imports['$_/arr/']['sum'];
    var max = imports['$_/arr/'] && imports['$_/arr/']['max'];
    var deepMerge = imports['$_/obj/'] && imports['$_/obj/']['deepMerge'];
    var isArr = imports['$_/util/'] && imports['$_/util/']['isArr'];
    var isPercent = imports['$_/util/'] && imports['$_/util/']['isPercent'];
    var isNumeric = imports['$_/util/'] && imports['$_/util/']['isNumeric'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var helpers = Charts.helpers;
    var defaultConfig = {
        name: '',
        zIndex: 0,
        center: ['50%', '50%'],
        radius: [0, '75%', '80%'],
        roseType: false,
        itemStyle: {
            normal: {
                color: null,
                borderColor: '#000',
                borderWidth: 0
            },
            emphasis: {
                color: null,
                borderColor: null,
                borderWidth: 1
            }
        },
        label: {
            normal: {
                show: false,
                position: 'outside',
                formatter: '',
                textStyle: {
                    color: '#fff',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontFamily: '\'Microsoft YaHei\', \'Hiragino Sans\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
                    fontSize: 12
                }
            },
            emphasis: {
                show: false,
                formatter: '',
                textStyle: {
                    color: '#fff',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontFamily: '\'Microsoft YaHei\', \'Hiragino Sans\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
                    fontSize: 12
                }
            }
        },
        animateRotate: true,
        animateScale: false,
        data: []
    }
    function getMax (steps, value) {
        var stepValue = Math.ceil(value/steps);
        return stepValue * steps;
    }
    var PieStyle = pandora.declareClass({
        _init: function (configuration) {
            _.extend(this, true, configuration);
        },
        update: function (newProps) {
            _.extend(this, true, newProps);
            return this;
        },
        fit: function (options) {
            if (isArr(options.radius) && options.radius[2]) {
                if (isPercent(options.radius[2])) {
                    this.emphasisRadius = this.maxRadius * parseInt(options.radius[2])/100;
                }
                else if (isNumeric(options.radius[2])) {
                    this.emphasisRadius = parseFloat(options.radius[1]);
                }
                else {
                    this.emphasisRadius = this.outerRadius + 5;
                }
            }
            else {
                this.emphasisRadius = this.outerRadius + 5;
            }
            return this;
        }
    });
    var Pie = pandora.declareClass(Charts.Type, {
        defaults: defaultConfig,
        polar: undefined,
        initialize: function (options) {
            var instance = this.instance;
            var options = deepMerge(this.defaults, options);
            var barStrokeWidth = parseInt(options.itemStyle.normal.barBorderWidth);
            var emphasisRadius = void 0;
            var style = this.style = new PieStyle(helpers.calculateDoughnutStyle(options, instance.width, instance.height));
            style.fit(options);
            this.options = {
                index: options.index,
                name: options.name,
                animateRotate: options.animateRotate,
                animateScale: options.animateScale,
                radius: options.radius,
                fillColor: options.itemStyle.normal.color,
                emphasisFill: options.itemStyle.emphasis.color,
                center: options.center,
                segmentShowStroke: (barStrokeWidth > 0),
                segmentStrokeColor: options.itemStyle.normal.borderColor || '#FFFFFF',
                segmentStrokeWidth: barStrokeWidth,
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>"
            };
            if (options.roseType) {
                switch (options.roseType) {
                    case 'area':
                    this.options.type = 'area';
                    break;
                    case 'angle':
                    this.options.type = 'angle';
                    break;
                    default:
                    this.options.type = 'radius';
                }
            }
            else {
                this.options.type = 'pie';
            }
            this.ArcClass = pandora.declareClass(Charts.sharps.Arc, {
                ctx: this.ctx,
                showStroke: this.options.segmentShowStroke,
                strokeWidth: this.options.segmentStrokeWidth,
                strokeColor: this.options.segmentStrokeColor,
                x: style.x,
                y: style.y,
                innerRadius: this.options.animateScale ? 0 : style.innerRadius,
                emphasisRadius: this.options.animateScale ? 0 : style.emphasisRadius,
                iRadius: style.innerRadius,
                eRadius: style.emphasisRadius,
                startAngle: Math.PI * 1.5
            })
            this.segments = [];
            this.buildSegment(options.data);
        },
        buildSegment: function (data) {
            var _arguments = arguments;
            this.calculateTotalAndMax(data);
            pandora.each(data, function (index, elem) {
                this.addSegment(index, elem, data.length);
            }, this);
        },
        resetStyle: function () {
            this.style.update(helpers.calculateDoughnutStyle(this.options, this.instance.width, this.instance.height)).fit(this.options);
            return this;
        },
        update: function (data) {
            var _arguments = arguments;
            this.calculateTotalAndMax(data);
            var leng = max([data.length, this.segments.length]);
            pandora.each(this.segments, function (index, segment) {
                segment.value = data && data[index] && data[index].value || 0;
                segment.restore(['fillColor', 'oRadius']);
                segment.outerRadius = this.style.outerRadius;
                segment.innerRadius = this.style.innerRadius;
                segment.x = this.style.x;
                segment.y = this.style.y;
                segment.iRadius = this.style.innerRadius;
                segment.emphasisRadius = this.style.emphasisRadius;
                segment.save();
            }, this);
            for (var index = this.segments.length;index < data.length;index++) {
                this.addSegment(index, data[index], leng);
            };
        },
        addSegment: function (index, elem, leng) {
            var h = (360 * index/leng + 350) % 360;
            var s = [70, 85, 60, 35, 40, 35, 100, 95, 30, 35, 10, 65];
            var l = [60, 60, 60, 50, 50, 50, 40, 40, 35, 60, 70, 60];
            var e = [70, 70, 70, 60, 60, 60, 50, 50, 50, 70, 75, 70];
            var i = Math.floor((h + 15)/30);
            var angle = this.calculateCircumference(elem.value);
            var radius = this.calculateRadius(elem.value);
            var fillColor = void 0;var emphasisFill = void 0;
            if (elem.itemStyle && elem.itemStyle.normal && elem.itemStyle.normal.color) {
                fillColor = elem.itemStyle.normal.color;
            }
            else {
                switch (this.options.fillColor) {
                    case 'object':
                    fillColor = this.options.fillColor[index];
                    break;
                    case 'string':
                    fillColor = this.options.fillColor;
                    break;
                    default:
                    fillColor = 'hsl(' + h + ', ' + s[i % 12] + '%, ' + l[i % 12] + '%)';
                }
            }
            if (elem.itemStyle && elem.itemStyle.emphasis && elem.itemStyle.emphasis.color) {
                emphasisFill = elem.itemStyle.emphasis.color;
            }
            else {
                switch (this.options.emphasisFill) {
                    case 'object':
                    emphasisFill = this.options.emphasisFill[index];
                    break;
                    case 'string':
                    emphasisFill = this.options.emphasisFill;
                    break;
                    default:
                    emphasisFill = 'hsl(' + h + ', ' + s[i % 12] + '%, ' + e[i % 12] + '%)';
                }
            }
            var segment = new this.ArcClass({
                value: elem.value,
                label: elem.name,
                fillColor: fillColor,
                emphasisFill: emphasisFill,
                circumference: this.options.animateRotate ? 0 : angle,
                outerRadius: this.options.animateScale ? 0 : radius,
                oRadius: radius
            });
            this.segments.push(segment);
            segment.save();
        },
        calculateTotalAndMax: function (data) {
            var _arguments = arguments;
            var values = [];
            if (this.options.type === 'area') {
                pandora.each(data, function (index, segment) {
                    values.push(Math.sqrt(segment.value));
                }, this);
            }
            else {
                pandora.each(data, function (index, segment) {
                    values.push(parseFloat(segment.value));
                }, this);
            }
            this.length = data.length;
            this.total = sum(values);
            this.max = max(values);
        },
        calculateCircumference: function (value) {
            if (this.total > 0) {
                switch (this.options.type) {
                    case 'area':
                    return (Math.PI * 2) * (Math.sqrt(value)/this.total);
                    case 'radius':
                    return (Math.PI * 2) * (1/this.length);
                    case 'angle':
                    case 'pie':
                    return (Math.PI * 2) * (value/this.total);
                }
            }
            else {
                return 0;
            };
        },
        calculateRadius: function (value) {
            if (this.total > 0) {
                switch (this.options.type) {
                    case 'area':
                    return (this.style.outerRadius - this.style.innerRadius) * (Math.sqrt(value)/this.max) + this.style.innerRadius;
                    case 'radius':
                    case 'angle':
                    return (this.style.outerRadius - this.style.innerRadius) * (value/this.max) + this.style.innerRadius;
                    case 'pie':
                    return this.style.outerRadius;
                }
            }
            else {
                return 0;
            };
        },
        removeSegment: function (index) {
            index = parseInt(index) || 0;
            this.segments.splice(index, 1);
        },
        getSegmentsAtEvent: function (e) {
            var _arguments = arguments;
            var segmentsArray = [];
            var location = helpers.getRelativePosition(e);
            pandora.each(this.segments, function (index, segment) {
                if(segment.inRange(location.x, location.y)) segmentsArray.push(segment);
                segment.restore(['fillColor', 'oRadius']);
            }, this);
            return segmentsArray;
        },
        draw: function (easeDecimal) {
            var _arguments = arguments;
            var animDecimal = (easeDecimal) ? easeDecimal : 1;
            pandora.each(this.segments, function (index, segment) {
                segment.transition({
                    circumference: this.calculateCircumference(segment.value),
                    outerRadius: this.calculateRadius(segment.value),
                    innerRadius: segment.iRadius,
                    x: segment.x,
                    y: segment.y
                }, animDecimal);
                segment.endAngle = segment.startAngle + segment.circumference;
                if (index < this.segments.length - 1) {
                    this.segments[index + 1].startAngle = segment.endAngle;
                }
                segment.draw();
            }, this);
        }
    });
    Charts.prototype.pie = function () {
        var _arguments = arguments;
        var chart = void 0;
        var chartName = void 0;
        var id = 0;
        pandora.each(this.series.pie, function (i, options) {
            chartName = this.getChartName(options.name);
            if (this.historyCharts[chartName] && this.historyCharts[chartName].type == 'pie') {
                chart = this.historyCharts[chartName];
                chart.resetStyle().update(options.data, options.index);
            }
            else {
                chart = new Pie(options, this, options.zIndex);
                chart.type = 'pie';
                this.historyCharts[chartName] = chart;
                helpers.bindHover(this, function (evt) {
                    var _arguments = arguments;
                    var activeSegments = [];
                    pandora.loop(this.activedCharts, function (i, chart) {
                        activeSegments = chart.getSegmentsAtEvent(evt);
                        if (activeSegments.length) {
                            pandora.loop.out();
                            return;
                        };
                    }, this);
                    pandora.each(activeSegments, function (index, activeSegment) {
                        activeSegment.fillColor = activeSegment.emphasisFill;
                        activeSegment.oRadius = activeSegment.eRadius;
                    }, this);
                    if (this.options.tooltip.show) {
                        this.showTooltip(activeSegments);
                    }
                    if (activeSegments.length > 0) {
                        this.actived = 1;
                        _.dom.setStyle(this.Element, 'cursor', 'pointer');
                    }
                    else {
                        this.actived = 0;
                        _.dom.setStyle(this.Element, 'cursor', 'default');
                    };
                });
            }
            this.activedCharts.push(chart);
        }, this);
    };
});
//# sourceMappingURL=pie.js.map