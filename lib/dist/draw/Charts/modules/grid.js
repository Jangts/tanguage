/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 10 Aug 2018 04:01:28 GMT
 */
;
// tang.config({});
tang.init().block([
    '$_/arr/',
    '$_/dom/',
    '$_/obj/',
    '$_/math/',
    '$_/draw/Charts/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var draw = pandora.ns('draw', {});
    var arr = imports['$_/arr/'];
    var dom = imports['$_/dom/'];
    var deepMerge = imports['$_/obj/'] && imports['$_/obj/']['deepMerge'];
    var keysArray = imports['$_/obj/'] && imports['$_/obj/']['keysArray'];
    var math = imports['$_/math/'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var defaults = draw.Charts.defaults, helpers = draw.Charts.helpers;
    var Grid = pandora.declareClass(draw.Charts.Component, {
        _init: function (configuration) {
            _.extend(this, true, configuration);
            switch (this.status) {
                case 0:
                this.xOffsetSplitLines = this.hasBar;
                this.yOffsetSplitLines = false;
                break;;
                case 1:
                this.xOffsetSplitLines = false;
                this.yOffsetSplitLines = this.hasBar  || this.hasScatter;
                break;;
                case 5:
                this.xOffsetSplitLines = false;
                this.yOffsetSplitLines = true;
                break;;
                default:
                this.xOffsetSplitLines = false;
                this.yOffsetSplitLines = false;
            }
            this.font = draw.canvas.fontString(this.xLabelFontSize, this.xLabelFontStyle, this.xLabelFontFamily);
            this.fit();
        },
        update: function (newProps) {
            _.extend(this, true, newProps);
            return this.fit();
        },
        fit: function () {
            this.charts = {};
            this.getValues();
            this.yScalePaddingTop = this.padding  + 3;
            if (this.display  && this.xLabelsShow) {
                this.yScalePaddingBottom = this.xLabelFontSize  * 1.5  + 5  + this.padding;
            }
            else {
                this.yScalePaddingBottom = this.padding;
            }
            this.topPoint = this.top  + this.yScalePaddingTop;
            this.bottomPoint = (this.display) ? this.height  - this.yScalePaddingBottom  + this.top : this.height  + this.top;
            var currentHeight = this.drawingAreaY;
            this.calculateYRange(currentHeight);
            this.buildYLabels();
            this.xScalePaddingRight = this.padding;
            if (this.display  && this.yLabelsShow) {
                this.xScalePaddingLeft = this.yLabelWidth  + this.padding;
            }
            else {
                this.xScalePaddingLeft = this.padding;
            }
            this.drawingAreaX = this.width  - (this.xScalePaddingLeft + this.xScalePaddingRight);
            this.drawingAreaY = this.height  - (this.yScalePaddingBottom + this.yScalePaddingTop);
            this.leftPoint = Math.round(this.xScalePaddingLeft) + this.left;
            this.rightPoint = this.width  + this.left;
            var currentWidth = this.drawingAreaX;
            this.calculateXRange(currentWidth);
            this.buildXLabels();
            if (this.status  === 1) {
                this.fit1();
            }
            else if (this.status  !== 5) {
                this.fit0();
            }
            return this;
        },
        getValues: function () {
            var _arguments = arguments;
            this.xValues = [];
            this.yValues = [];
            pandora.each(this.instance.series.line, function (i, chart) {
                var data = [];
                pandora.each(chart.data, function (j, v) {(typeof v === 'number') && data.push(v);
                }, this);
                switch (this.status) {
                    case 0:
                    this.yValues = arr.merge(this.yValues, data);
                    break;;
                    case 1:
                    this.xValues = arr.merge(this.xValues, data);
                    break;;
                };
            }, this);
            pandora.each(this.instance.series.bar, function (i, chart) {
                var data = [];
                pandora.each(chart.data, function (j, v) {
                    if (typeof v  === 'number') {
                        data.push(v);
                    }
                    else if (typeof v  === 'object' && v instanceof Array) {
                    (typeof v[0] === 'number') && data.push(v[0]);(typeof v[1] === 'number') && data.push(v[1]);
                    };
                }, this);
                switch (this.status) {
                    case 0:
                    this.yValues = arr.merge(this.yValues, data);
                    break;;
                    case 1:
                    this.xValues = arr.merge(this.xValues, data);
                    break;;
                };
            }, this);
            pandora.each(this.instance.series.scatter, function (i, chart) {
                var xData = [];
                var yData = [];
                pandora.each(chart.data, function (j, v) {
                    if (typeof v  === 'object' && v instanceof Array) {
                    (typeof v[0] === 'number') && xData.push(v[0]);(typeof v[1] === 'number') && yData.push(v[1]);
                    };
                }, this);
                switch (this.status) {
                    case 0:
                    this.yValues = arr.merge(this.yValues, yData);
                    break;;
                    case 1:
                    this.xValues = arr.merge(this.xValues, xData);
                    break;;
                    case 4:
                    this.xValues = arr.merge(this.xValues, xData);
                    this.yValues = arr.merge(this.yValues, yData);
                    break;;
                };
            }, this);
            if (this.xValues.length  < 1) {
                this.xValues = [1];
            }
            if (this.yValues.length  < 1) {
                this.yValues = [1];
            };
        },
        calculateYRange: function (currentHeight) {
            if (this.status  === 1  || this.status  === 5) {
                this.ySteps = this.yLabels.length;
                this.yStepValue = 1;
            }
            else {
                if ((typeof(this.yAxisMax) === 'number') && (typeof(this.yAxisMin) === 'number')) {
                    var valuesArray = [this.yAxisMax, this.yAxisMin];
                }
                else if (typeof(this.yAxisMax) === 'number') {
                    var min = arr.min(this.yValues);
                    var valuesArray = [this.yAxisMax, min < this.yAxisMax ? min:this.yAxisMax - 1];
                }
                else if (typeof(this.yAxisMin) === 'number') {
                    var max = arr.max(this.yValues);
                    var valuesArray = [this.yAxisMin, max > this.yAxisMin ? max:this.yAxisMin + 1];
                }
                else {
                    var valuesArray = this.yValues;
                }
                var updatedRanges = helpers.calculateScaleRange(
                    valuesArray,
                    currentHeight,
                    this.xLabelFontSize,
                    this.yBeginAtZero,
                    this.yIntegersOnly);
                _.extend(this, true, updatedRanges);
            };
        },
        buildYLabels: function () {
            if (this.status  === 0  || this.status  === 4) {
                this.yLabels = [];
                var stepDecimalPlaces = math.getDecimalPlaces(this.yStepValue);
                for (var i = 0;i  <= this.ySteps;i++) {
                    this.yLabels.push(helpers.template(this.yTemplateString, {
                        value: (this.minY + (i * this.yStepValue)).toFixed(stepDecimalPlaces)
                    }));
                }
            }
            this.yLabelWidth = (this.display && this.yLabelsShow) ? draw.canvas.longestText(this.ctx, this.font, this.yLabels) + 10 : 0;
            var yLabelHeight = (this.display && this.yLabelsShow) ? this.yLabelFontSize  * 1.5 : 0;
            var yLabelSteps = this.ySteps;
            var drawingAreaY = this.drawingAreaY;
            while (yLabelSteps  * yLabelHeight  > drawingAreaY) {
                yLabelSteps = Math.ceil(yLabelSteps /2);
            }
            this.yLabelStep = Math.ceil(this.ySteps /yLabelSteps);
            return this;
        },
        calculateXRange: function (currentWidth) {
            if (this.status  === 0  || this.status  === 5) {
                this.xSteps = this.xLabels.length;
                this.xStepValue = 1;
            }
            else {
                if ((typeof(this.xAxisMax) === 'number') && (typeof(this.xAxisMin) === 'number')) {
                    var valuesArray = [this.xAxisMax, this.xAxisMin];
                }
                else if (typeof(this.xAxisMax) === 'number') {
                    var valuesArray = [this.xAxisMax, arr.min(this.xValues)];
                }
                else if (typeof(this.yAxisMin) === 'number') {
                    var valuesArray = [this.xAxisMin, arr.max(this.xValues)];
                }
                else {
                    var valuesArray = this.xValues;
                }
                var updatedRanges = helpers.calculateScaleRange(
                    valuesArray,
                    currentWidth,
                    this.yLabelFontSize,
                    this.xBeginAtZero,
                    this.xIntegersOnly,
                    true);
                _.extend(this, true, updatedRanges);
            };
        },
        buildXLabels: function () {
            if (this.status  === 1  || this.status  === 4) {
                this.xLabels = [];
                var stepDecimalPlaces = math.getDecimalPlaces(this.xStepValue);
                for (var i = 0;i  <= this.xSteps;i++) {
                    this.xLabels.push(helpers.template(this.xTemplateString, {
                        value: (this.minX + (i * this.xStepValue)).toFixed(stepDecimalPlaces)
                    }));
                }
            }
            this.xLabelWidth = (this.display && this.xLabelsShow) ? draw.canvas.longestText(this.ctx, this.font, this.xLabels) + 4 : 0;
            var xLabelSteps = this.xSteps;
            var drawingAreaX = this.drawingAreaX;
            while (xLabelSteps  * this.xLabelWidth  > drawingAreaX) {
                xLabelSteps = Math.ceil(xLabelSteps /2);
            }
            this.xLabelStep = Math.ceil(this.xSteps /xLabelSteps);
            return this;
        },
        fit0: function () {
            if (this.maxY  * this.minY  >= 0) {
                if (this.minY  >= 0) {
                    this.baseY = this.bottomPoint;
                }
                else {
                    this.baseY = this.topPoint;
                }
            }
            else {
                var height = this.drawingAreaY;
                var difference = this.maxY  - this.minY;
                this.baseY = this.calculateY(0);
            };
        },
        fit1: function () {
            if (this.maxX  * this.minX  >= 0) {
                if (this.minX  >= 0) {
                    this.baseX = this.leftPoint;
                }
                else {
                    this.baseX = this.rightPoint;
                }
            }
            else {
                var width = this.drawingAreaY;
                var difference = this.maxX  - this.minX;
                this.baseX = this.calculateX(0);
            };
        },
        calculateX: function (index) {
            if (this.status  === 0  || this.status  === 5) {
                var innerWidth = this.width  - (this.xScalePaddingLeft + this.xScalePaddingRight);
                var valueWidth = innerWidth /Math.max((this.xSteps - ((this.xOffsetSplitLines) ? 0:1)), 1);
                var valueOffset = (valueWidth * index) + this.xScalePaddingLeft;
                if (this.xOffsetSplitLines) {
                    valueOffset  += (valueWidth/2);
                }
                return Math.round(valueOffset  + this.left);
            }
            var value = index;
            var scalingFactor = this.drawingAreaX /(this.maxX - this.minX);
            return this.leftPoint  + (scalingFactor * (value - this.minX));
        },
        calculateY: function (index) {
            if (this.status  === 1  || this.status  === 5) {
                var innerHeight = this.height  - (this.yScalePaddingTop + this.yScalePaddingBottom);
                var valueHeight = innerHeight /Math.max((this.ySteps - ((this.yOffsetSplitLines) ? 0:1)), 1);
                var valueOffset = (valueHeight * index) + this.yScalePaddingBottom;
                if (this.yOffsetSplitLines) {
                    valueOffset  += (valueHeight/2);
                }
                return Math.round(this.height  + this.top  - valueOffset);
            }
            var value = index;
            var scalingFactor = this.drawingAreaY /(this.maxY - this.minY);
            return this.bottomPoint  - (scalingFactor * (value - this.minY));
        },
        draw: function () {
            var xLabelGap = this.drawingAreaX /((this.xOffsetSplitLines || (this.status !== 0 && this.status !== 5)) ? this.xSteps:this.xSteps - 1);
            var yLabelGap = this.drawingAreaY /((this.yOffsetSplitLines || (this.status !== 1 && this.status !== 5)) ? this.ySteps:this.ySteps - 1);
            if (this.display) {
                this.drawYAxis(yLabelGap);
                this.drawXAxis(xLabelGap);
            };
        },
        drawYAxis: function (yLabelGap) {
            var _arguments = arguments;
            if (this.yAxisShow) {
                var ctx = this.ctx;
                ctx.fillStyle = this.xLabelFontColor;
                ctx.font = this.font;
                ctx.textAlign = "right";
                ctx.textBaseline = "middle";
                pandora.each(this.yLabels, function (index, labelString) {
                    var yLabelCenter = this.bottomPoint  - (yLabelGap * index);
                    var yLabelPos = this.yOffsetSplitLines ? yLabelCenter  - (yLabelGap * 0.5): yLabelCenter;
                    var linePositionY = Math.round(yLabelCenter);
                    if (((this.yOnZero && labelString == '0') || (!this.yOnZero && index === 0)) && this.yAxisLineShow) {
                        ctx.lineWidth = this.yAxisLineWidth;
                        ctx.strokeStyle = this.yAxisLineColor;
                        linePositionY  += helpers.aliasPixel(ctx.lineWidth);
                        draw.canvas.line(ctx, this.leftPoint  - 5, linePositionY, this.rightPoint, linePositionY, true);
                    }
                    else {
                        if (this.ySplitLineShow) {
                            ctx.lineWidth = this.xSplitLineWidth;
                            ctx.strokeStyle = this.xSplitLineColor;
                            linePositionY  += helpers.aliasPixel(ctx.lineWidth);
                            draw.canvas.line(ctx, this.leftPoint  - 5, linePositionY, this.rightPoint, linePositionY, true);
                        }
                    }
                    if (this.yLabelsShow  && (index % this.yLabelStep == Math.floor(this.yLabelStep /2))) {
                        ctx.save();
                        ctx.fillText(labelString, this.leftPoint  - 10, yLabelPos);
                        ctx.restore();
                    };
                }, this);
            };
        },
        drawXAxis: function (xLabelGap) {
            var _arguments = arguments;
            if (this.xAxisShow) {
                var ctx = this.ctx;
                ctx.fillStyle = this.xLabelFontColor;
                ctx.font = this.font;
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                pandora.each(this.xLabels, function (index, label) {
                    var xLabelCenter = this.leftPoint  + (xLabelGap * index);
                    var xLabelPos = this.xOffsetSplitLines ? xLabelCenter  + (xLabelGap * 0.5): xLabelCenter;
                    var linePositionX = Math.round(xLabelCenter);
                    if (((this.xOnZero && label == '0') || (!this.xOnZero && index === 0)) && this.xAxisLineShow) {
                        ctx.lineWidth = this.xAxisLineWidth;
                        ctx.strokeStyle = this.xAxisLineColor;
                        draw.canvas.line(ctx, linePositionX, this.bottomPoint  + 5, linePositionX, this.topPoint  - 3, true);
                    }
                    else {
                        if (this.xSplitLineShow) {
                            ctx.lineWidth = this.ySplitLineWidth;
                            ctx.strokeStyle = this.ySplitLineColor;
                            draw.canvas.line(ctx, linePositionX, this.bottomPoint  + 5, linePositionX, this.topPoint  - 3, true);
                        }
                    }
                    if (this.xLabelsShow  && (index % this.xLabelStep == Math.floor(this.xLabelStep /2))) {
                        ctx.save();
                        ctx.fillText(label, xLabelPos, this.bottomPoint  + 8);
                        ctx.restore();
                    };
                }, this);
            };
        }
    });
    pandora.extend(defaults, {
        grid:{
            show: true,
            zIndex: 0,
            left: '10%',
            top: 60,
            right: '10%',
            bottom: 60,
            width: 'auto',
            height: 'auto',
            minWidth: 120,
            padding: 10
        }
    });
    pandora.extend(defaults, {
        xAxis:{
            show: true,
            type: 'label',
            axisLine: {
                show: true,
                onZero: false,
                lineStyle: {
                    color: "rgba(0,0,0,.2)",
                    width: 1
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "rgba(0,0,0,.05)",
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
            max: null,
            min: null,
            data: null
        }
    });
    pandora.extend(defaults, {
        yAxis:{
            show: true,
            type: 'value',
            axisLine: {
                show: true,
                onZero: false,
                lineStyle: {
                    color: "rgba(0,0,0,.20)",
                    width: 1
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "rgba(0,0,0,.05)",
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
            max: null,
            min: null,
            data: null
        }
    });
    pandora.extend(pandora.draw.Charts.prototype, true, {
        buildGrid: function () {
            var grid = deepMerge(draw.Charts.defaults.grid, this.options.grid  || {});
            var xAxis = deepMerge(draw.Charts.defaults.xAxis, this.options.xAxis  || {});
            var yAxis = deepMerge(draw.Charts.defaults.yAxis, this.options.yAxis  || {});
            var style = helpers.calculateRectangleStyle(grid, this.width, this.height);
            var gridOptions = {
                display: (grid.show == true),
                hasBar: this.series.bar ? true : false,
                hasScatter: this.series.scatter ? true : false,
                instance: this,
                ctx: this.getLayer(grid.zIndex).getContext("2d"),
                width: style.width,
                height: style.height,
                top: style.top,
                left: style.left,
                padding: grid.padding,
                xAxisMax: xAxis.max,
                xAxisMin: xAxis.min,
                xAxisShow: (xAxis.show == true),
                xAxisLineShow: (xAxis.axisLine.show == true),
                xAxisLineWidth: xAxis.axisLine.lineStyle.width,
                xAxisLineColor: xAxis.axisLine.lineStyle.color,
                xSplitLineShow: (xAxis.splitLine.show == true),
                xSplitLineWidth: xAxis.splitLine.lineStyle.width,
                xSplitLineColor: xAxis.splitLine.lineStyle.color,
                xLabelsShow: (xAxis.axisLabel.show == true),
                xLabelFontColor: xAxis.axisLabel.textStyle.fontColor,
                xLabelFontSize: xAxis.axisLabel.textStyle.fontSize,
                xLabelFontStyle: xAxis.axisLabel.textStyle.fontStyle,
                xLabelFontFamily: xAxis.axisLabel.textStyle.fontFamily,
                xLabels: xAxis.data,
                xTemplateString: xAxis.axisLabel.formatter,
                xOnZero: xAxis.axisLine.onZero,
                xBeginAtZero: (xAxis.axisLine.beginAtZero == true),
                xIntegersOnly: true,
                yAxisMax: yAxis.max,
                yAxisMin: yAxis.min,
                yAxisShow: (yAxis.show == true),
                yAxisLineShow: (yAxis.axisLine.show == true),
                yAxisLineWidth: yAxis.axisLine.lineStyle.width,
                yAxisLineColor: yAxis.axisLine.lineStyle.color,
                ySplitLineShow: (yAxis.splitLine.show == true),
                ySplitLineWidth: yAxis.splitLine.lineStyle.width,
                ySplitLineColor: yAxis.splitLine.lineStyle.color,
                yLabelsShow: (yAxis.axisLabel.show == true),
                yLabelFontColor: yAxis.axisLabel.textStyle.fontColor,
                yLabelFontSize: yAxis.axisLabel.textStyle.fontSize,
                yLabelFontStyle: yAxis.axisLabel.textStyle.fontStyle,
                yLabelFontFamily: yAxis.axisLabel.textStyle.fontFamily,
                yLabels: yAxis.data,
                yTemplateString: yAxis.axisLabel.formatter,
                yOnZero: yAxis.axisLine.onZero,
                yBeginAtZero: (yAxis.axisLine.beginAtZero == true),
                yIntegersOnly: true
            }
            gridOptions.status = (gridOptions.xLabels && gridOptions.yLabels) ? 5 : (gridOptions.xLabels ? 0:(gridOptions.yLabels ? 1:4));
            if (this.grid  === null) {
                this.grid = new Grid(gridOptions);
                helpers.bindHover(this, function (evt) {
                    var _arguments = arguments;
                    var _this = this;
                    var actives = [];
                    var types = ['lines', 'bars', 'scatters'];
                    var restores = {
                        'lines': {
                            'display': 'emphasisDisplay',
                            'fillColor': 'emphasisFill',
                            'radius': 'emphasisRadius',
                            'strokeColor': 'emphasisStroke',
                            'strokeWidth': 'emphasisStrokeWidth'
                        },
                        'scatters': {
                            'radius': 'emphasisRadius'
                        },
                        'bars': {
                            'fillColor': 'emphasisFill',
                            'strokeColor': 'emphasisStroke',
                            'strokeWidth': 'emphasisWidth'
                        }
                    };
                    var charts = arr.merge(this.grid.charts.lines, this.grid.charts.bars, this.grid.charts.scatters);
                    pandora.each(types, function (_index, type) {
                        for (var i = 0;this.grid.charts[type] && i  < this.grid.charts[type].length  && actives.length  === 0;i++) {
                            var chart = this.grid.charts[type][i];
                            activeSegments = ((this.options.tooltip.type == 'axis') ? chart.getSegmentsAtEvent(evt, charts):chart.getSegmentsAtEvent(evt));
                            pandora.each(chart.segments, function (index, segment) {
                                segment.restore(keysArray(restores[type]));
                            }, this);
                            if (activeSegments.length  > 0) {
                                pandora.each(activeSegments, function (index, activeSegment) {
                                    actives.push(activeSegment);
                                    pandora.each(restores[type], function (normal, emphasis) {
                                        activeSegment[normal] = activeSegment[emphasis];
                                    }, this);
                                }, this);
                                break;;
                            }
                        };
                    }, this);
                    if (this.options.tooltip.show) {
                        this.showTooltip(actives, false, (this.options.tooltip.type == 'axis'));
                    }
                    if ((this.options.tooltip.type == 'axis') && (actives.length > 0) && (this.grid.charts.lines) && (this.grid.charts.lines.length > 0)) {
                        if (this.grid.status  === 0) {
                            var x = actives[0].x;
                            var y1 = this.grid.topPoint;
                            var y2 = this.grid.bottomPoint;
                            var ctx = this.grid.ctx;
                            ctx.translate(0.5, 0);
                            ctx.lineWidth = 1;
                            ctx.strokeStyle = '#FF0000';
                            draw.canvas.line(ctx, x, y1, x, y2, true, false, function () {
                                ctx.translate( -0.5, 0);
                            });
                        }
                        if (this.grid.status  === 1) {
                            var x1 = this.grid.leftPoint;
                            var x2 = this.grid.rightPoint;
                            var y = actives[0].y;
                            var ctx = this.grid.ctx;
                            ctx.translate(0, 0.5);
                            ctx.lineWidth = 1;
                            ctx.strokeStyle = '#FF0000';
                            draw.canvas.line(ctx, x1, y, x2, y, true, false, function () {
                                ctx.translate(0,  -0.5);
                            });
                        }
                    }
                    if (actives.length  > 0) {
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
                this.grid.update(gridOptions);
            };
        }
    });
    
});
//# sourceMappingURL=grid.js.map