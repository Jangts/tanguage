/*!
 * tanguage framework source code
 *
 * extend_static_methods draw/Charts/util
 * 
 * Date: 2015-09-04
 */
;
getMax(steps, value) {
    var stepValue = Math.ceil(value / steps);
    return stepValue * steps;
}

class Polar extends draw.Charts.Component {
    _init (configuration) {
        _.extend(this, true, configuration);
        this.drawingAreaR = (this.display) ? this.radius - (this.radiusLabelFontSize / 2 + this.backdropPaddingY) : this.radius;
        this.save();
        this.fit();
    }
    
    update (newProps) {
        _.extend(this, true, newProps);
        //this.drawingAreaR = (this.display) ? this.radius - (this.radiusLabelFontSize / 2 + this.backdropPaddingY) : this.radius;
        //this.save();
        return this.fit();
    }
    
    fit () {
        this.charts = {};
        this.getValues();
        this.calculateAngleRange();
        this.calculateRadiusRange();
        this.buildAngleLabels();
        this.buildRadiusLabels();
        this.fitDrawingAreaR();
    }
    
    getValues () {
        this.angleValues = [];
        this.radiusValues = [];
        if (this.status === 6) {
            var max = [],
                min = [];
            each(this.angleLabels as j) {
                this.radiusValues.push([]);
            }
            each(this.instance.series.radar as i, chart) {
                max.push(arr.max(chart.data));
                min.push(arr.min(chart.data));
                each(chart.data as j, v) {
                    if (typeof v === 'number') {
                        this.radiusValues[j] && this.radiusValues[j].push(v);
                    }
                }
            }
            this.radiusAxisMax = arr.max(max);
            this.radiusAxisMin = arr.min(min);
        } else {
            each(this.instance.series.line as i, chart) {
                var data = [];
                each(chart.data as j, v) {
                    (typeof v === 'number') && data.push(v);
                }
                this.radiusValues = merge(this.radiusValues, data);
            }
            each(this.instance.series.scatter as i, chart) {
                var angleData = [],
                    radiusData = [];;
                each(chart.data as j, v) {
                    if (typeof v === 'object' && v instanceof Array) {
                        (typeof v[0] === 'number') && angleData.push(v[0]);
                        (typeof v[1] === 'number') && radiusData.push(v[1]);
                    }
                }
                switch (this.status) {
                    case 0:
                        this.radiusValues = merge(this.radiusValues, radiusData);
                        break;
                    case 4:
                        this.angleValues = merge(this.angleValues, angleData);
                        this.radiusValues = merge(this.radiusValues, radiusData);
                        break;
                }
            }
            //this.radiusAxisMax = arr.max(this.radiusValues);
            //this.radiusAxisMin = arr.min(this.radiusValues);
            this.radiusAxisMax = arr.max(this.radiusValues);
            this.radiusAxisMin = arr.min(this.radiusValues);
            clog this.radiusAxisMax, this.radiusAxisMax, this.radiusValues;
        }

        if (this.angleValues.length < 1) {
            this.angleValues = [1];
        }
        if (this.radiusValues.length < 1) {
            this.radiusValues = [1];
        }
    }
    
    calculateAngleRange () {
        if (this.status === 0 || this.status === 5 || this.status === 6) {
            // 角度为项，或角径皆为项
            this.angleSteps = this.angleLabels.length
        } else {
            if ((typeof(this.angleAxisMax) === 'number') && (typeof(this.angleAxisMin) === 'number')) {
                var valuesArray = [this.angleAxisMax, this.angleAxisMin];
            } else if (typeof(this.angleAxisMax) === 'number') {
                var valuesArray = [this.angleAxisMax, arr.min(this.angleValues)];
            } else if (typeof(this.yAxisMin) === 'number') {
                var valuesArray = [this.angleAxisMin, arr.max(this.angleValues)];
            } else {
                var valuesArray = this.angleValues;
            }
            this.angleSteps = helpers.calculateScaleRange(
                valuesArray,
                this.drawingAreaR,
                this.angleLabelFontSize,
                this.angleBeginAtZero,
                this.angleIntegersOnly,
                true, true);
            clog valuesArray, this.angleSteps;
        }
        _.extend(this, {
            angleSteps: this.angleSteps,
            angleStepValue: 1,
            minAngle: 0,
            maxAngle: Math.PI
        });
    }
    
    calculateRadiusRange () {
        if (this.status === 1 || this.status === 5) {
            this.splitNumber = this.radiusLabels.length;
            this.radiusStepValue = 1;
        } else if (this.status === 0 || this.status === 4) {
            if ((typeof(this.radiusAxisMax) === 'number') && (typeof(this.radiusAxisMin) === 'number')) {
                var valuesArray = [this.radiusAxisMax, this.radiusAxisMin];
            } else if (typeof(this.radiusAxisMax) === 'number') {
                var min = arr.min(this.radiusValues),
                    valuesArray = [this.radiusAxisMax, min < this.radiusAxisMax ? min : this.radiusAxisMax - 1];
            } else if (typeof(this.radiusAxisMin) === 'number') {
                var max = arr.max(this.radiusValues),
                    valuesArray = [this.radiusAxisMin, max > this.radiusAxisMin ? max : this.radiusAxisMin + 1];
            } else {
                var valuesArray = this.radiusValues;
            }
            var updatedRanges = helpers.calculateScaleRange(
                valuesArray,
                this.drawingAreaR,
                this.radiusLabelFontSize,
                this.radiusBeginAtZero,
                this.radiusIntegersOnly,
                false, true);
            this.splitNumber = updatedRanges[0];
            this.radiusStepValue = updatedRanges[1];
        } else {
            _.extend(this, true, {
                radiusSteps: this.splitNumber,
                radiusStepValue: this.radiusAxisMax / this.splitNumber,
                minRadius: 0,
                maxRadius: this.radiusAxisMax
            });
        }
    }
    
    buildAngleLabels () {
        if (this.status === 1 || this.status === 4) {
            this.angleLabels = [];
            var stepDecimalPlaces = math.getDecimalPlaces(this.angleStepValue);
            for (var i = 0; i <= this.angleSteps; i++) {
                this.radiusLabels.push(helpers.template(this.angleTemplateString, {
                    value: (this.minAngle + (i * this.angleStepValue)).toFixed(stepDecimalPlaces)
                }));
            }
        }
    }
    
    buildRadiusLabels () {
        if (this.status === 0 || this.status === 4 || this.status === 6) {
            this.radiusLabels = [];
            var stepDecimalPlaces = math.getDecimalPlaces(this.radiusStepValue);
            for (var i = 0; i <= this.radiusSteps; i++) {
                this.radiusLabels.push(helpers.template(this.radiusTemplateString, {
                    value: (this.minRadius + (i * this.radiusStepValue)).toFixed(stepDecimalPlaces)
                }));
            }
        }
    }
    
    fitDrawingAreaR () {
        var largestPossibleRadius = this.radius - this.radiusLabelFontSize - 5,
            pointPosition,
            i,
            txet,
            textWidth,
            halfTextWidth,
            furthestRight = this.radius * 2,
            furthestRightIndex,
            furthestRightAngle,
            furthestLeft = 0,
            furthestLeftIndex,
            furthestLeftAngle,
            xProtrusionLeft,
            xProtrusionRight,
            radiusReductionRight,
            radiusReductionLeft,
            maxWidthRadius;
        this.ctx.font = draw.canvas.fontString(this.angleLabelFontSize, this.angleLabelFontStyle, this.angleLabelFontFamily);
        for (i = 0; i < this.angleSteps; i++) {
            pointPosition = this.getPointPosition(this.calculateAngle(i), this.calculateRadius(largestPossibleRadius));
            txet = helpers.template(this.angleTemplateString, {
                value: this.angleLabels[i]
            })
            textWidth = this.ctx.measureText(txet).width + 5;
            if (i === 0 || i === this.angleSteps / 2) {
                halfTextWidth = textWidth / 2;
                if (pointPosition.x + halfTextWidth > furthestRight) {
                    furthestRight = pointPosition.x + halfTextWidth;
                    furthestRightIndex = i;
                }
                if (pointPosition.x - halfTextWidth < furthestLeft) {
                    furthestLeft = pointPosition.x - halfTextWidth;
                    furthestLeftIndex = i;
                }
            } else if (i < this.angleSteps / 2) {
                if (pointPosition.x + textWidth > furthestRight) {
                    furthestRight = pointPosition.x + textWidth;
                    furthestRightIndex = i;
                }
            } else if (i > this.angleSteps / 2) {
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
        radiusReductionRight = xProtrusionRight / Math.sin(furthestRightAngle + Math.PI / 2);
        radiusReductionLeft = xProtrusionLeft / Math.sin(furthestLeftAngle + Math.PI / 2);

        radiusReductionRight = (util.isNumber(radiusReductionRight)) ? radiusReductionRight : 0;
        radiusReductionLeft = (util.isNumber(radiusReductionLeft)) ? radiusReductionLeft : 0;
        this.drawingAreaR = largestPossibleRadius - (radiusReductionLeft + radiusReductionRight) / 2;
    }
    
    getPointPosition (angle, radius) {
        return {
            angle: angle,
            radius: radius,
            x: (Math.cos(angle) * radius) + this.xCenter,
            y: (Math.sin(angle) * radius) + this.yCenter
        };
    }
    
    calculateAngle (index) {
        var angleMultiplier = (Math.PI * 2) / this.angleSteps;
        return index * angleMultiplier - (Math.PI / 2);
    }
    
    calculateRadius (index, value) {
        if (this.status === 5) {
            var scalingFactor = this.drawingAreaR / this.radiusSteps;
            return index * scalingFactor;
        }
        //var value = index;
        var scalingFactor = this.drawingAreaR / (this.maxRadius - this.minRadius);
        return (value - this.minRadius) * scalingFactor;
    }
    
    draw () {
        if (this.display) {
            this.drawAngle();
            this.drawRadius();
        }
    }
    
    drawRadius () {
        if (this.radiusAxisShow) {
            var ctx = this.ctx;
            each(this.radiusLabels as index, label) {
                if (index > 0) {
                    var radius = index * (this.drawingAreaR / this.radiusSteps),
                        radiusLabelCenter = this.yCenter - radius,
                        pointPosition;

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
                        } else {
                            return;
                        }
                    } else {
                        if (this.angleSplitLineWidth > 0) {
                            ctx.strokeStyle = this.angleSplitLineColor;
                            ctx.lineWidth = this.angleSplitLineWidth;
                        } else {
                            return;
                        }
                    }
                    if (this.angleSplitLineArc) {
                        ctx.beginPath();
                        ctx.arc(this.xCenter, this.yCenter, radius, 0, Math.PI * 2);
                        ctx.closePath();
                        ctx.stroke();
                    } else {
                        ctx.beginPath();
                        for (var i = 0; i < this.angleSteps; i++) {
                            pointPosition = this.getPointPosition(this.calculateAngle(i), this.calculateRadius(index, index * this.radiusStepValue));
                            draw.canvas.to(ctx, pointPosition.x, pointPosition.y, i === 0 ? 0 : 1);
                        }
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
            }
        }
    }
    
    drawAngle () {
        if (this.angleAxisShow) {
            var ctx = this.ctx;

            for (var i = this.angleSteps - 1; i >= 0; i--) {
                var radius = null,
                    outerPosition = null;
                if (((this.angleOnZero && this.angleLabels[i] == '0') || (!this.angleOnZero && i === 0)) && this.angleAxisLineShow && (this.angleAxisLineWidth > 0)) {
                    ctx.lineWidth = this.angleAxisLineWidth;
                    ctx.strokeStyle = this.angleAxisLineColor;
                } else {
                    ctx.lineWidth = this.radiusSplitLineWidth
                    ctx.strokeStyle = this.radiusSplitLineColor;
                }
                if (this.radiusSplitLineWidth > 0) {
                    outerPosition = this.getPointPosition(this.calculateAngle(i), this.calculateRadius(i, this.maxRadius));
                    draw.canvas.line(ctx, this.xCenter, this.yCenter, outerPosition.x, outerPosition.y, true);
                }

                if (this.backgroundColors && this.backgroundColors.length == this.angleSteps) {
                    if (outerPosition == null)
                        outerPosition = this.getPointPosition(this.calculateAngle(i), this.calculateRadius(i, this.maxRadius));

                    var previousOuterPosition = this.getPointPosition(this.calculateAngle(i === 0 ? this.angleSteps - 1 : i - 1), this.calculateRadius(i, this.maxRadius));
                    var nextOuterPosition = this.getPointPosition(this.calculateAngle(i === this.angleSteps - 1 ? 0 : i + 1), this.calculateRadius(i, this.maxRadius));

                    var previousOuterHalfway = {
                        x: (previousOuterPosition.x + outerPosition.x) / 2,
                        y: (previousOuterPosition.y + outerPosition.y) / 2
                    };
                    var nextOuterHalfway = {
                        x: (outerPosition.x + nextOuterPosition.x) / 2,
                        y: (outerPosition.y + nextOuterPosition.y) / 2
                    };

                    draw.canvas.line(ctx, this.xCenter, this.yCenter, previousOuterHalfway.x, previousOuterHalfway.y, false, false, (to)=>{
                        to(ctx, outerPosition.x, outerPosition.y, 1);
                        to(ctx, nextOuterHalfway.x, nextOuterHalfway.y, 1);
                        ctx.fillStyle = this.backgroundColors[i];
                        ctx.fill();
                    });
                }
                this.drawAngleLabels(ctx, i);
            }
        }
    }
    
    drawAngleLabels (ctx, i) {
        if (this.angleLabelsShow) {
            // Extra 3px out for some label spacing
            var pointLabelPosition = this.getPointPosition(this.calculateAngle(i), this.calculateRadius(i, this.maxRadius + 5));
            ctx.font = draw.canvas.fontString(this.angleLabelFontSize, this.angleLabelFontStyle, this.angleLabelFontFamily);
            ctx.fillStyle = this.angleLabelFont;

            var labelsCount = this.angleSteps,
                halfLabelsCount = this.angleSteps / 2,
                quarterLabelsCount = halfLabelsCount / 2,
                upperHalf = (i < quarterLabelsCount || i > labelsCount - quarterLabelsCount),
                exactQuarter = (i === quarterLabelsCount || i === labelsCount - quarterLabelsCount);
            if (i === 0) {
                ctx.textAlign = 'center';
            } else if (i === halfLabelsCount) {
                ctx.textAlign = 'center';
            } else if (i < halfLabelsCount) {
                ctx.textAlign = 'left';
            } else {
                ctx.textAlign = 'right';
            }

            // Set the correct text baseline based on outer positioning
            if (exactQuarter) {
                ctx.textBaseline = 'middle';
            } else if (upperHalf) {
                ctx.textBaseline = 'bottom';
            } else {
                ctx.textBaseline = 'top';
            }

            ctx.fillStyle = this.radiusLabelFontColor;
            ctx.fillText(this.angleLabels[i], pointLabelPosition.x, pointLabelPosition.y);
        }
    }
}