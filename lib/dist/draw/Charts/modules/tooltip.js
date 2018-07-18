/*!
 * tanguage script compiled code
 *
 * Datetime: Wed, 18 Jul 2018 07:00:18 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/arr/',
    '$_/math/',
    '$_/util/',
    '$_/draw/Charts/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var draw = pandora.ns('draw', {});
    var arr = imports['$_/arr/'];
    var math = imports['$_/math/'];
    var util = imports['$_/util/'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var defaults = draw.Charts.defaults, helpers = draw.Charts.helpers;
    var Tooltip = pandora.declareClass(draw.Charts.Component, {
        draw: function () {
            var _this = this;
            var _arguments = arguments;
            var ctx = this.ctx;
            ctx.font = draw.canvas.fontString(this.fontSize, this.fontStyle, this.fontFamily);
            this.xAlign = "center";
            this.yAlign = "above";
            var caretPadding = this.caretPadding = 2;
            var tooltipWidth = ctx.measureText(this.text).width + 2 * this.xPadding;
            var tooltipRectHeight = this.fontSize + 2 * this.yPadding;
            var tooltipHeight = tooltipRectHeight + this.caretHeight + caretPadding;
            if (this.x + tooltipWidth/2 > this.chart.width) {
                this.xAlign = "left";
            }
            else if (this.x - tooltipWidth/2 < 0) {
                this.xAlign = "right";
            }
            if (this.y - tooltipHeight < 0) {
                this.yAlign = "below";
            }
            var tooltipX = this.x - tooltipWidth/2;
            var tooltipY = this.y - tooltipHeight;
            ctx.globalAlpha = 0.75;
            ctx.fillStyle = this.fillColor;
            if (this.custom) {
                ctx.globalAlpha = 1;
                this.custom(this);
            }
            else {
                switch (this.yAlign) {
                    case "above":
                    draw.canvas.line(ctx, this.x, this.y - caretPadding, this.x + this.caretHeight, this.y - (caretPadding + this.caretHeight), false, false, function () {
                        draw.canvas.to(ctx, _this.x - _this.caretHeight, _this.y - (caretPadding + _this.caretHeight), 1);
                    });
                    ctx.fill();
                    break;
                    case "below":
                    tooltipY = this.y + caretPadding + this.caretHeight;
                    ctx.fill();
                    draw.canvas.line(ctx, this.x, this.y + caretPadding, this.x + this.caretHeight, this.y + caretPadding + this.caretHeight, false, false, function () {
                        draw.canvas.to(ctx, _this.x - _this.caretHeight, _this.y + caretPadding + _this.caretHeight, 1);
                    });
                    ctx.fill();
                    break;
                }
                switch (this.xAlign) {
                    case "left":
                    tooltipX = this.x - tooltipWidth + (this.cornerRadius + this.caretHeight);
                    break;
                    case "right":
                    tooltipX = this.x - (this.cornerRadius + this.caretHeight);
                    break;
                }
                draw.canvas.drawRoundedRectangle(ctx, tooltipX, tooltipY, tooltipWidth, tooltipRectHeight, this.cornerRadius);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.fillStyle = this.textColor;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(this.text, tooltipX + tooltipWidth/2, tooltipY + tooltipRectHeight/2);
            };
        }
    });
    var MultiTooltip = pandora.declareClass(draw.Charts.Component, {
        initialize: function () {
            this.font = draw.canvas.fontString(this.fontSize, this.fontStyle, this.fontFamily);
            this.titleFont = draw.canvas.fontString(this.titleFontSize, this.titleFontStyle, this.titleFontFamily);
            this.titleHeight = this.title ? this.titleFontSize * 1.5 : 0;
            this.height = (this.labels.length * this.fontSize) + ((this.labels.length - 1) * (this.fontSize/2)) + (this.yPadding * 2) + this.titleHeight;
            this.ctx.font = this.titleFont;
            var titleWidth = this.ctx.measureText(this.title).width;
            var labelWidth = draw.canvas.longestText(this.ctx, this.font, this.labels) + this.fontSize + 3;
            var longestTextWidth = arr.max([labelWidth, titleWidth]);
            this.width = longestTextWidth + (this.xPadding * 2);
            var halfHeight = this.height/2;
            if (this.y - halfHeight < 0) {
                this.y = halfHeight;
            }
            else if (this.y + halfHeight > this.chart.height) {
                this.y = this.chart.height - halfHeight;
            }
            if (this.x > this.chart.width/2) {
                this.x -= this.xOffset + this.width;
            }
            else {
                this.x += this.xOffset;
            };
        },
        getLineHeight: function (index) {
            var baseLineHeight = this.y - (this.height/2) + this.yPadding;
            var afterTitleIndex = index - 1;
            if (index === 0) {
                return baseLineHeight + this.titleHeight/3;
            }
            else {
                return baseLineHeight + ((this.fontSize * 1.5 * afterTitleIndex) + this.fontSize/2) + this.titleHeight;
            };
        },
        draw: function () {
            var _arguments = arguments;
            if (this.custom) {
                this.custom(this);
            }
            else {
                draw.canvas.drawRoundedRectangle(this.ctx, this.x, this.y - this.height/2, this.width, this.height, this.cornerRadius);
                var ctx = this.ctx;
                ctx.globalAlpha = 0.75;
                ctx.fillStyle = this.fillColor;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.closePath();
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.fillStyle = this.titleTextColor;
                ctx.font = this.titleFont;
                ctx.fillText(this.title, this.x + this.xPadding, this.getLineHeight(0));
                ctx.font = this.font;
                pandora.each(this.labels, function (index, label) {
                    ctx.fillStyle = this.textColor;
                    ctx.fillText(label, this.x + this.xPadding + this.fontSize + 3, this.getLineHeight(index + 1));
                    ctx.fillStyle = this.legendColors[index].fill;
                    ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/4, this.fontSize * 2/3, this.fontSize * 2/3);
                }, this);
            };
        }
    });
    pandora.extend(defaults, {
        tooltip:{
            show: true,
            type: 'item',
            zIndex: 0,
            triggerOn: ["mousemove", "touchstart", "touchmove"],
            triggerOff: ["mouseout"],
            onTrigger: null,
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: '#333',
            borderWidth: 0,
            padding: 5,
            formatter: '<%if (label){%><%=label%> : <%}%><%= value %>',
            axisFormatter: '<%= itemLabel %> : <%= value %>',
            caretSize: 8,
            cornerRadius: 6,
            xOffset: 10,
            textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: '\'Microsoft YaHei\', \'Hiragino Sans\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
                fontSize: 14
            },
            titleFormatter: '<%= titleLabel%>',
            titleStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'blod',
                fontFamily: '\'Microsoft YaHei\', \'Hiragino Sans\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
                fontSize: 14
            },
            strictHover: false,
            legendBackgroundColor: '#fff'
        }
    });
    pandora.extend(pandora.draw.Charts.prototype, true, {
        showTooltip: function (segments, forceRedraw, showMulti) {
            if (typeof this.activeElements === 'undefined') {
                this.activeElements = [];
            }
            var isChanged = (function (Elements) {
                var _arguments = arguments;
                var changed = false;
                if (Elements.length !== this.activeElements.length) {
                    changed = true;
                    return changed;
                }
                pandora.each(Elements, function (index, element) {
                    if (element !== this.activeElements[index]) {
                        changed = true;
                    };
                }, this);
                return changed;
            }).call(this, segments);
            if (!isChanged && !forceRedraw) {
                return;
            }
            else {
                this.activeElements = segments;
            }
            var tooltip = this.options.tooltip;
            var options = {
                showTooltips: (tooltip.show == true),
                zIndex: tooltip.zIndex,
                customTooltips: tooltip.onTrigger,
                tooltipFillColor: tooltip.backgroundColor,
                tooltipFontFamily: tooltip.textStyle.fontFamily,
                tooltipFontSize: tooltip.textStyle.fontSize,
                tooltipFontStyle: tooltip.textStyle.fontStyle,
                tooltipFontWeight: tooltip.textStyle.fontWeight,
                tooltipFontColor: tooltip.textStyle.color,
                tooltipTitleFontFamily: tooltip.titleStyle.fontFamily,
                tooltipTitleFontSize: tooltip.titleStyle.fontSize,
                tooltipTitleFontStyle: tooltip.titleStyle.fontStyle,
                tooltipTitleFontWeight: tooltip.titleStyle.fontWeight,
                tooltipTitleFontColor: tooltip.titleStyle.color,
                tooltipTemplate: tooltip.formatter,
                multiTooltipTemplate: tooltip.axisFormatter,
                tooltipTitleTemplate: tooltip.titleFormatter,
                tooltipXPadding: util.isArr(tooltip.padding) ? tooltip.padding[0]:(util.isNumeric(tooltip.padding) ? parseFloat(tooltip.padding):5),
                tooltipYPadding: util.isArr(tooltip.padding) ? tooltip.padding[1]:(util.isNumeric(tooltip.padding) ? parseFloat(tooltip.padding):5),
                tooltipCaretSize: tooltip.caretSize,
                tooltipCornerRadius: tooltip.cornerRadius,
                tooltipXOffset: tooltip.xOffset,
                multiTooltipKeyBackground: tooltip.legendBackgroundColor
            }
            this.draw();
            if (segments.length > 0) {
                if (showMulti) {
                    var tooltipLabels = [];
                    var tooltipColors = [];
                    var medianPosition = (function () {
                        var _arguments = arguments;
                        var Elements = [];
                        var dataCollection = void 0;
                        var xPositions = [];
                        var yPositions = [];
                        var xMax = void 0;
                        var yMax = void 0;
                        var xMin = void 0;
                        var yMin = void 0;
                        pandora.each(segments, function (index, element) {
                            xPositions.push(element.x);
                            yPositions.push(element.y);
                            tooltipLabels.push(helpers.template(options.multiTooltipTemplate, element));
                            tooltipColors.push({
                                fill: element._saved.fillColor || element.fillColor,
                                stroke: element._saved.strokeColor || element.strokeColor
                            });
                        }, this);
                        yMin = math.minOfArr(yPositions);
                        yMax = math.maxOfArr(yPositions);
                        xMin = math.minOfArr(xPositions);
                        xMax = math.maxOfArr(xPositions);
                        return {
                            x: (xMin + xMax)/ 2, //(xMin > this.width/2) ? xMin : xMax,
                            y: (yMin + yMax)/2
                        };
                    }).call(this);
                    new MultiTooltip({
                        x: medianPosition.x,
                        y: medianPosition.y,
                        xPadding: options.tooltipXPadding,
                        yPadding: options.tooltipYPadding,
                        xOffset: options.tooltipXOffset,
                        fillColor: options.tooltipFillColor,
                        textColor: options.tooltipFontColor,
                        fontFamily: options.tooltipFontFamily,
                        fontStyle: options.tooltipFontStyle,
                        fontSize: options.tooltipFontSize,
                        titleTextColor: options.tooltipTitleFontColor,
                        titleFontFamily: options.tooltipTitleFontFamily,
                        titleFontStyle: options.tooltipTitleFontStyle,
                        titleFontSize: options.tooltipTitleFontSize,
                        cornerRadius: options.tooltipCornerRadius,
                        labels: tooltipLabels,
                        legendColors: tooltipColors,
                        legendColorBackground: options.multiTooltipKeyBackground,
                        title: helpers.template(options.tooltipTitleTemplate, segments[0]),
                        chart: this,
                        ctx: this.getLayer(options.zIndex).getContext("2d"),
                        custom: options.customTooltips
                    }).draw();
                }
                else {
                    var Element = segments[0];
                    var tooltipPosition = Element.tooltipPosition();
                    new Tooltip({
                        x: Math.round(tooltipPosition.x),
                        y: Math.round(tooltipPosition.y),
                        xPadding: options.tooltipXPadding,
                        yPadding: options.tooltipYPadding,
                        fillColor: options.tooltipFillColor,
                        textColor: options.tooltipFontColor,
                        fontFamily: options.tooltipFontFamily,
                        fontStyle: options.tooltipFontStyle,
                        fontSize: options.tooltipFontSize,
                        caretHeight: options.tooltipCaretSize,
                        cornerRadius: options.tooltipCornerRadius,
                        text: helpers.template(options.tooltipTemplate, Element),
                        chart: this,
                        ctx: this.getLayer(options.zIndex).getContext("2d"),
                        custom: options.customTooltips
                    }).draw();
                }
            }
            return this;
        }
    });
    
});