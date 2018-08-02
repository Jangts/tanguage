/*!
 * tanguage script compiled code
 *
 * Datetime: Thu, 02 Aug 2018 10:48:50 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/arr/',
    '$_/dom/',
    '$_/obj/',
    '$_/math/',
    '$_/util/',
    '$_/draw/Charts/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var draw = pandora.ns('draw', {});
    var arr = imports['$_/arr/'];
    var dom = imports['$_/dom/'];
    var deepMerge = imports['$_/obj/'] && imports['$_/obj/']['deepMerge'];
    var keysArray = imports['$_/obj/'] && imports['$_/obj/']['keysArray'];
    var math = imports['$_/math/'];
    var util = imports['$_/util/'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var defaults = draw.Charts.defaults, helpers = draw.Charts.helpers;
    function getMax (steps, value) {
        var stepValue = Math.ceil(value/steps);
        return stepValue * steps;
    }
    var Polar = pandora.declareClass(draw.Charts.Component, {
        _init: function (configuration) {
            _.extend(this, true, configuration);
            this.drawingAreaR = (this.display) ? this.radius - (this.radiusLabelFontSize/2 + this.backdropPaddingY): this.radius;
            this.save();
            this.fit();
        },
        update: function (newProps) {
            _.extend(this, true, newProps);
            return this.fit();
        },
        fit: function () {
            this.charts = {};
            this.getValues();
            this.calculateAngleRange();
            this.calculateRadiusRange();
            this.buildAngleLabels();
            this.buildRadiusLabels();
            this.fitDrawingAreaR();
        },
        getValues: function () {
            var _arguments = arguments;
            this.angleValues = [];
            this.radiusValues = [];
            if (this.status === 6) {
                var max = [];
                var min = [];
                pandora.each(this.angleLabels, function (_index, j) {
                    this.radiusValues.push([]);
                }, this);
                pandora.each(this.instance.series.radar, function (i, chart) {
                    max.push(arr.max(chart.data));
                    min.push(arr.min(chart.data));
                    pandora.each(chart.data, function (j, v) {
                        if (typeof v === 'number') {
                            this.radiusValues[j] && this.radiusValues[j].push(v);
                        };
                    }, this);
                }, this);
                this.radiusAxisMax = arr.max(max);
                this.radiusAxisMin = arr.min(min);
            }
            else {
                pandora.each(this.instance.series.line, function (i, chart) {
                    var data = [];
                    pandora.each(chart.data, function (j, v) {(typeof v === 'number') && data.push(v);
                    }, this);
                    this.radiusValues = merge(this.radiusValues, data);
                }, this);
                pandora.each(this.instance.series.scatter, function (i, chart) {
                    var angleData = [];
                    var radiusData = [];
                    pandora.each(chart.data, function (j, v) {
                        if (typeof v === 'object' && v instanceof Array) {
                        (typeof v[0] === 'number') && angleData.push(v[0]);(typeof v[1] === 'number') && radiusData.push(v[1]);
                        };
                    }, this);
                    switch (this.status) {
                        case 0:
                        this.radiusValues = merge(this.radiusValues, radiusData);
                        break;
                        case 4:
                        this.angleValues = merge(this.angleValues, angleData);
                        this.radiusValues = merge(this.radiusValues, radiusData);
                        break;
                    };
                }, this);
                this.radiusAxisMax = arr.max(this.radiusValues);
                this.radiusAxisMin = arr.min(this.radiusValues);
                root.console.log(this.radiusAxisMax, this.radiusAxisMax, this.radiusValues);
            }
            if (this.angleValues.length < 1) {
                this.angleValues = [1];
            }
            if (this.radiusValues.length < 1) {
                this.radiusValues = [1];
            };
        },
        calculateAngleRange: function () {
            if (this.status === 0 || this.status === 5 || this.status === 6) {
                this.angleSteps = this.angleLabels.length;
            }
            else {
                if ((typeof(this.angleAxisMax) === 'number') && (typeof(this.angleAxisMin) === 'number')) {
                    var valuesArray = [this.angleAxisMax, this.angleAxisMin];
                }
                else if (typeof(this.angleAxisMax) === 'number') {
                    var valuesArray = [this.angleAxisMax, arr.min(this.angleValues)];
                }
                else if (typeof(this.yAxisMin) === 'number') {
                    var valuesArray = [this.angleAxisMin, arr.max(this.angleValues)];
                }
                else {
                    var valuesArray = this.angleValues;
                }
                this.angleSteps = helpers.calculateScaleRange(
                    valuesArray,
                    this.drawingAreaR,
                    this.angleLabelFontSize,
                    this.angleBeginAtZero,
                    this.angleIntegersOnly,
                    true,
                    true);
                root.console.log(valuesArray, this.angleSteps);
            }
            _.extend(this, {
                angleSteps: this.angleSteps,
                angleStepValue: 1,
                minAngle: 0,
                maxAngle: Math.PI
            });
        },
        calculateRadiusRange: function () {
            if (this.status === 1 || this.status === 5) {
                this.splitNumber = this.radiusLabels.length;
                this.radiusStepValue = 1;
            }
            else if (this.status === 0 || this.status === 4) {
                if ((typeof(this.radiusAxisMax) === 'number') && (typeof(this.radiusAxisMin) === 'number')) {
                    var valuesArray = [this.radiusAxisMax, this.radiusAxisMin];
                }
                else if (typeof(this.radiusAxisMax) === 'number') {
                    var min = arr.min(this.radiusValues);
                    var valuesArray = [this.radiusAxisMax, min < this.radiusAxisMax ? min:this.radiusAxisMax - 1];
                }
                else if (typeof(this.radiusAxisMin) === 'number') {
                    var max = arr.max(this.radiusValues);
                    var valuesArray = [this.radiusAxisMin, max > this.radiusAxisMin ? max:this.radiusAxisMin + 1];
                }
                else {
                    var valuesArray = this.radiusValues;
                }
                var updatedRanges = helpers.calculateScaleRange(
                    valuesArray,
                    this.drawingAreaR,
                    this.radiusLabelFontSize,
                    this.radiusBeginAtZero,
                    this.radiusIntegersOnly,
                    false,
                    true);
                this.splitNumber = updatedRanges[0];
                this.radiusStepValue = updatedRanges[1];
            }
            else {
                _.extend(this, true, {
                    radiusSteps: this.splitNumber,
                    radiusStepValue: this.radiusAxisMax/this.splitNumber,
                    minRadius: 0,
                    maxRadius: this.radiusAxisMax
                });
            };
        },
        buildAngleLabels: function () {
            if (this.status === 1 || this.status === 4) {
                this.angleLabels = [];
                var stepDecimalPlaces = math.getDecimalPlaces(this.angleStepValue);
                for (var i = 0;i <= this.angleSteps;i++) {
                    this.radiusLabels.push(helpers.template(this.angleTemplateString, {
                        value: (this.minAngle + (i * this.angleStepValue)).toFixed(stepDecimalPlaces)
                    }));
                }
            };
        },
        buildRadiusLabels: function () {
            if (this.status === 0 || this.status === 4 || this.status === 6) {
                this.radiusLabels = [];
                var stepDecimalPlaces = math.getDecimalPlaces(this.radiusStepValue);
                for (var i = 0;i <= this.radiusSteps;i++) {
                    this.radiusLabels.push(helpers.template(this.radiusTemplateString, {
                        value: (this.minRadius + (i * this.radiusStepValue)).toFixed(stepDecimalPlaces)
                    }));
                }
            };
        },
        fitDrawingAreaR: function () {
            var largestPossibleRadius = this.radius - this.radiusLabelFontSize - 5;
            var pointPosition = void 0;
            var i = void 0;
            var txet = void 0;
            var textWidth = void 0;
            var halfTextWidth = void 0;
            var furthestRight = this.radius * 2;
            var furthestRightIndex = void 0;
            var furthestRightAngle = void 0;
            var furthestLeft = 0;
            var furthestLeftIndex = void 0;
            var furthestLeftAngle = void 0;
            var xProtrusionLeft = void 0;
            var xProtrusionRight = void 0;
            var radiusReductionRight = void 0;
            var radiusReductionLeft = void 0;
            var maxWidthRadius = void 0;
            this.ctx.font = draw.canvas.fontString(this.angleLabelFontSize, this.angleLabelFontStyle, this.angleLabelFontFamily);
            for (i = 0;i < this.angleSteps;i++) {
                pointPosition = this.getPointPosition(this.calculateAngle(i), this.calculateRadius(largestPossibleRadius));
                txet = helpers.template(this.angleTemplateString, {
                    value: this.angleLabels[i]
                });
                textWidth = this.ctx.measureText(txet).width + 5;
                if (i === 0 || i === this.angleSteps/2) {
                    halfTextWidth = textWidth/2;
                    if (pointPosition.x + halfTextWidth > furthestRight) {
                        furthestRight = pointPosition.x + halfTextWidth;
                        furthestRightIndex = i;
                    }
                    if (pointPosition.x - halfTextWidth < furthestLeft) {
                        furthestLeft = pointPosition.x - halfTextWidth;
                        furthestLeftIndex = i;
                    }
                }
                else if (i < this.angleSteps/2) {
                    if (pointPosition.x + textWidth > furthestRight) {
                        furthestRight = pointPosition.x + textWidth;
                        furthestRightIndex = i;
                    }
                }
                else if (i > this.angleSteps/2) {
                    if (pointPosition.x - textWidth < furthestLeft) {
                        furthestLeft = pointPosition.x - textWidth;
                        furthestLeftIndex = i;
                    }
                }
            }
            xProtrusionLeft = furthestLeft;
            xProtrusionRight = Math.ceil(furthestRight - this.width);
            furthestRightAngle = this.calculateAngle(furthestRightIndex);
            furthestLeftAngle = this.calculateAngle(furthestLeftIndex);
            radiusReductionRight = xProtrusionRight/Math.sin(furthestRightAngle + Math.PI/2);
            radiusReductionLeft = xProtrusionLeft/Math.sin(furthestLeftAngle + Math.PI/2);
            radiusReductionRight = (util.isNumber(radiusReductionRight)) ? radiusReductionRight : 0;
            radiusReductionLeft = (util.isNumber(radiusReductionLeft)) ? radiusReductionLeft : 0;
            this.drawingAreaR = largestPossibleRadius - (radiusReductionLeft + radiusReductionRight)/2;
        },
        getPointPosition: function (angle, radius) {
            return {
                angle: angle,
                radius: radius,
                x: (Math.cos(angle) * radius) + this.xCenter,
                y: (Math.sin(angle) * radius) + this.yCenter
            };
        },
        calculateAngle: function (index) {
            var angleMultiplier = (Math.PI * 2)/this.angleSteps;
            return index * angleMultiplier - (Math.PI/2);
        },
        calculateRadius: function (index, value) {
            if (this.status === 5) {
                var scalingFactor = this.drawingAreaR/this.radiusSteps;
                return index * scalingFactor;
            }
            var scalingFactor = this.drawingAreaR/(this.maxRadius - this.minRadius);
            return (value - this.minRadius) * scalingFactor;
        },
        draw: function () {
            if (this.display) {
                this.drawAngle();
                this.drawRadius();
            };
        },
        drawRadius: function () {
            var _arguments = arguments;
            if (this.radiusAxisShow) {
                var ctx = this.ctx;
                pandora.each(this.radiusLabels, function (index, label) {
                    if (index > 0) {
                        var radius = index * (this.drawingAreaR/this.radiusSteps);
                        var radiusLabelCenter = this.yCenter - radius;
                        var pointPosition = void 0;
                        if (this.radiusLabelsShow) {
                            ctx.font = draw.canvas.fontString(this.radiusLabelFontSize, this.radiusLabelFontStyle, this.radiusLabelFontFamily);
                            ctx.textAlign = 'center';
                            ctx.textBaseline = "middle";
                            ctx.fillStyle = this.radiusLabelFontColor;
                            ctx.fillText(label, this.xCenter, radiusLabelCenter);
                        }
                        if ((this.radiusOnZero && label == '0') || (!this.radiusOnZero && (index === this.radiusLabels.length - 1))) {
                            if (this.radiusAxisLineShow && (this.radiusAxisLineWidth > 0)) {
                                ctx.strokeStyle = this.radiusAxisLineColor;
                                ctx.lineWidth = this.radiusAxisLineWidth;
                            }
                            else {
                                return;
                            }
                        }
                        else {
                            if (this.angleSplitLineWidth > 0) {
                                ctx.strokeStyle = this.angleSplitLineColor;
                                ctx.lineWidth = this.angleSplitLineWidth;
                            }
                            else {
                                return;
                            }
                        }
                        if (this.angleSplitLineArc) {
                            ctx.beginPath();
                            ctx.arc(this.xCenter, this.yCenter, radius, 0, Math.PI * 2);
                            ctx.closePath();
                            ctx.stroke();
                        }
                        else {
                            ctx.beginPath();
                            for (var i = 0;i < this.angleSteps;i++) {
                                pointPosition = this.getPointPosition(this.calculateAngle(i), this.calculateRadius(index, index * this.radiusStepValue));
                                draw.canvas.to(ctx, pointPosition.x, pointPosition.y, i === 0 ? 0 : 1);
                            }
                            ctx.closePath();
                            ctx.stroke();
                        }
                    };
                }, this);
            };
        },
        drawAngle: function () {
            var _this = this;
            var _arguments = arguments;
            if (this.angleAxisShow) {
                var ctx = this.ctx;
                for (var i = this.angleSteps - 1;i >= 0;i--) {
                    var radius = null;
                    var outerPosition = null;
                    if (((this.angleOnZero && this.angleLabels[i] == '0') || (!this.angleOnZero && i === 0)) && this.angleAxisLineShow && (this.angleAxisLineWidth > 0)) {
                        ctx.lineWidth = this.angleAxisLineWidth;
                        ctx.strokeStyle = this.angleAxisLineColor;
                    }
                    else {
                        ctx.lineWidth = this.radiusSplitLineWidth;
                        ctx.strokeStyle = this.radiusSplitLineColor;
                    }
                    if (this.radiusSplitLineWidth > 0) {
                        outerPosition = this.getPointPosition(this.calculateAngle(i), this.calculateRadius(i, this.maxRadius));
                        draw.canvas.line(ctx, this.xCenter, this.yCenter, outerPosition.x, outerPosition.y, true);
                    }
                    if (this.backgroundColors && this.backgroundColors.length == this.angleSteps) {
                        if(outerPosition == null) outerPosition = this.getPointPosition(this.calculateAngle(i), this.calculateRadius(i, this.maxRadius));
                        var previousOuterPosition = this.getPointPosition(this.calculateAngle(i === 0 ? this.angleSteps - 1 : i - 1), this.calculateRadius(i, this.maxRadius));
                        var nextOuterPosition = this.getPointPosition(this.calculateAngle(i === this.angleSteps - 1 ? 0 : i + 1), this.calculateRadius(i, this.maxRadius));
                        var previousOuterHalfway = {
                            x: (previousOuterPosition.x + outerPosition.x)/2,
                            y: (previousOuterPosition.y + outerPosition.y)/2
                        };
                        var nextOuterHalfway = {
                            x: (outerPosition.x + nextOuterPosition.x)/2,
                            y: (outerPosition.y + nextOuterPosition.y)/2
                        };
                        draw.canvas.line(ctx, this.xCenter, this.yCenter, previousOuterHalfway.x, previousOuterHalfway.y, false, false, function (to) {
                            to(ctx, outerPosition.x, outerPosition.y, 1);
                            to(ctx, nextOuterHalfway.x, nextOuterHalfway.y, 1);
                            ctx.fillStyle = _this.backgroundColors[i];
                            ctx.fill();
                        });
                    }
                    this.drawAngleLabels(ctx, i);
                }
            };
        },
        drawAngleLabels: function (ctx, i) {
            if (this.angleLabelsShow) {
                var pointLabelPosition = this.getPointPosition(this.calculateAngle(i), this.calculateRadius(i, this.maxRadius + 5));
                ctx.font = draw.canvas.fontString(this.angleLabelFontSize, this.angleLabelFontStyle, this.angleLabelFontFamily);
                ctx.fillStyle = this.angleLabelFont;
                var labelsCount = this.angleSteps;
                var halfLabelsCount = this.angleSteps/2;
                var quarterLabelsCount = halfLabelsCount/2;
                var upperHalf = (i < quarterLabelsCount || i > labelsCount - quarterLabelsCount);
                var exactQuarter = (i === quarterLabelsCount || i === labelsCount - quarterLabelsCount);
                if (i === 0) {
                    ctx.textAlign = 'center';
                }
                else if (i === halfLabelsCount) {
                    ctx.textAlign = 'center';
                }
                else if (i < halfLabelsCount) {
                    ctx.textAlign = 'left';
                }
                else {
                    ctx.textAlign = 'right';
                }
                if (exactQuarter) {
                    ctx.textBaseline = 'middle';
                }
                else if (upperHalf) {
                    ctx.textBaseline = 'bottom';
                }
                else {
                    ctx.textBaseline = 'top';
                }
                ctx.fillStyle = this.radiusLabelFontColor;
                ctx.fillText(this.angleLabels[i], pointLabelPosition.x, pointLabelPosition.y);
            };
        }
    });
    pandora.extend(defaults, {
        radar:{
            show: true,
            zIndex: 0,
            center: ['50%', '50%'],
            radius: '75%',
            shape: 'polygon',
            splitArea: {
                show: true,
                areaStyle: {
                    color: null
                }
            },
            axisLine: {
                show: true,
                onZero: false,
                lineStyle: {
                    color: "rgba(0,0,0,.2)",
                    width: 1
                }
            },
            splitNumber: 5,
            splitLine: {
                show: true,
                lineStyle: {
                    color: "rgba(0,0,0,.1)",
                    width: 1
                }
            },
            axisLabel: {
                show: true,
                formatter: "<%=value%>",
                textStyle: {
                    fontFamily: "'Microsoft YaHei', 'Hiragino Sans'",
                    fontSize: 12,
                    fontStyle: "normal",
                    fontColor: "#666"
                }
            },
            indicator: []
        }
    });
    pandora.extend(pandora.draw.Charts.prototype, true, {
        buildRadar: function () {
            var _arguments = arguments;
            var radar = deepMerge(draw.Charts.defaults.radar, this.options.radar || {});
            var style = helpers.calculateCircleStyle(radar, this.width, this.height);
            var labels = [];
            ranges = [];
            pandora.each(radar.indicator, function (i, indicator) {
                if (typeof indicator.name === 'string') {
                    labels.push(indicator.name);
                    ranges.push({
                        min: indicator.min || 0,
                        max: indicator.max
                    });
                };
            }, this);
            var polarOptions = {
                status: 6,
                ranges: ranges,
                splitNumber: radar.splitNumber,
                backgroundColors: radar.splitArea.show && radar.splitArea.areaStyle.color,
                display: (radar.show == true),
                hasBar: false,
                hasScatter: false,
                instance: this,
                ctx: this.getLayer(radar.zIndex).getContext("2d"),
                radius: style.radius,
                xCenter: style.x,
                yCenter: style.y,
                angleAxisMax: labels.length,
                angleAxisMin: 0,
                angleAxisShow: (radar.axisLine.show == true),
                angleAxisLineShow: (radar.axisLine.show == true),
                angleAxisLineWidth: radar.axisLine.lineStyle.width,
                angleAxisLineColor: radar.axisLine.lineStyle.color,
                angleSplitLineShow: (radar.splitLine.show == true),
                angleSplitLineArc: (radar.shape === 'circle'),
                angleSplitLineWidth: radar.splitLine.lineStyle.width,
                angleSplitLineColor: radar.splitLine.lineStyle.color,
                angleLabelsShow: (radar.axisLabel.show == true),
                angleLabelFontColor: radar.axisLabel.textStyle.fontColor,
                angleLabelFontSize: radar.axisLabel.textStyle.fontSize,
                angleLabelFontStyle: radar.axisLabel.textStyle.fontStyle,
                angleLabelFontFamily: radar.axisLabel.textStyle.fontFamily,
                angleLabels: labels,
                angleTemplateString: radar.axisLabel.formatter,
                angleOnZero: true,
                angleBeginAtZero: true,
                angleIntegersOnly: true,
                radiusAxisMax: null,
                radiusAxisMin: 0,
                radiusAxisShow: (radar.splitLine.show == true),
                radiusAxisLineShow: (radar.axisLine.show == true),
                radiusAxisLineWidth: radar.axisLine.lineStyle.width,
                radiusAxisLineColor: radar.axisLine.lineStyle.color,
                radiusSplitLineShow: (radar.splitLine.show == true),
                radiusSplitLineWidth: radar.splitLine.lineStyle.width,
                radiusSplitLineColor: radar.splitLine.lineStyle.color,
                radiusLabelsShow: false,
                radiusLabelFontColor: radar.axisLabel.textStyle.fontColor,
                radiusLabelFontSize: radar.axisLabel.textStyle.fontSize,
                radiusLabelFontStyle: radar.axisLabel.textStyle.fontSize,
                radiusLabelFontFamily: radar.axisLabel.textStyle.fontFamily,
                radiusLabels: [],
                radiusTemplateString: radar.axisLabel.formatter,
                radiusOnZero: true,
                radiusBeginAtZero: true,
                radiusIntegersOnly: true
            }
            if (this.radarpolar === null) {
                this.radarpolar = new Polar(polarOptions);
                _.extend(this.radarpolar, true,  {});
                helpers.bindHover(this, function (evt) {
                    var _arguments = arguments;
                    var actives = [];
                    var restores = {
                        'display': 'emphasisDisplay',
                        'fillColor': 'emphasisFill',
                        'radius': 'emphasisRadius',
                        'strokeColor': 'emphasisStroke',
                        'strokeWidth': 'emphasisStrokeWidth'
                    };
                    for (var i = 0;this.radarpolar.charts.radarpolar && i < this.radarpolar.charts.radarpolar.length && actives.length === 0;i++) {
                        var chart = this.radarpolar.charts.radarpolar[i];
                        var activeSegments = chart.getSegmentsAtEvent(evt);
                        pandora.each(chart.segments, function (index, segment) {
                            segment.restore(keysArray(restores));
                        }, this);
                        if (activeSegments.length > 0) {
                            pandora.each(activeSegments, function (index, activeSegment) {
                                actives.push(activeSegment);
                                pandora.each(restores, function (normal, emphasis) {
                                    activeSegment[normal] = activeSegment[emphasis];
                                }, this);
                            }, this);
                            break;
                        }
                    }
                    if (this.options.tooltip.show) {
                        this.showTooltip(actives, false, true);
                    }
                    if (actives.length > 0) {
                        this.actived = 1;
                        dom.setStyle(this.HTMLElement, 'cursor', 'pointer');
                    }
                    else {
                        this.actived = 0;
                        dom.setStyle(this.HTMLElement, 'cursor', 'default');
                    };
                });
            }
            else {
                this.radarpolar.update(polarOptions);
            };
        }
    });
    
});
//# sourceMappingURL=radar.js.map