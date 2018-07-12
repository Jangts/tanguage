class Pie extends Charts.Type {
    defaults = defaultConfig

    initialize (options) {
        var instance = this.instance,
            options = deepMerge(this.defaults, options),
            barStrokeWidth = parseInt(options.itemStyle.normal.barBorderWidth),
            emphasisRadius;


        var style = helpers.calculateDoughnutStyle(options, instance.width, instance.height),
            maxRadius = style.maxRadius,
            innerRadius = style.innerRadius,
            outerRadius = style.outerRadius,
            x = style.x,
            y = style.y;

        if (isArr(options.radius) && options.radius[2]) {
            if (isPercent(options.radius[2])) {
                emphasisRadius = maxRadius * parseInt(options.radius[2]) / 100
            } else if (isNumeric(options.radius[2])) {
                emphasisRadius = parseFloat(options.radius[1]);
            } else {
                emphasisRadius = outerRadius + 5;
            }
        } else {
            emphasisRadius = outerRadius + 5;
        }

        this.options = {
            index: options.index,
            name: options.name,
            animateRotate: options.animateRotate,
            animateScale: options.animateScale,

            innerRadius: innerRadius,
            outerRadius: outerRadius,
            emphasisRadius: emphasisRadius,
            fillColor: options.itemStyle.normal.color,
            emphasisFill: options.itemStyle.emphasis.color,
            center: [x, y],

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
        } else {
            this.options.type = 'pie';
        }

        this.ArcClass = class extends Charts.sharps.Arc {
            ctx = this.ctx
            showStroke = this.options.segmentShowStroke
            strokeWidth = this.options.segmentStrokeWidth
            strokeColor = this.options.segmentStrokeColor
            x = x
            y = y
            innerRadius = this.options.animateScale ? 0 : this.options.innerRadius
            emphasisRadius = this.options.animateScale ? 0 : this.options.emphasisRadius
            //oRadius = (this.options.outerRadius - this.options.innerRadius)
            iRadius = this.options.innerRadius
            eRadius = this.options.emphasisRadius
            startAngle = Math.PI * 1.5
        }

        this.segments = [];
        this.buildSegment(options.data);

    }
    
    buildSegment (data) {
        this.calculateTotalAndMax(data);
        each(data as index, elem) {
            this.addSegment(index, elem, data.length);
        }
    }

    update (data) {
        this.calculateTotalAndMax(data);
        var leng = max([data.length, this.segments.length]);
        each(this.segments as index, segment) {
            segment.value = data && data[index] && data[index].value || 0;
            segment.restore(['fillColor', 'oRadius']);
            segment.outerRadius = this.options.outerRadius;
            segment.innerRadius = this.options.innerRadius;
            segment.emphasisRadius = this.options.emphasisRadius;
            segment.save();
        }
        for (var index = this.segments.length; index < data.length; index++) {
            this.addSegment(index, data[index], leng);
        }
    }

    addSegment (index, elem, leng) {
        var h = (360 * index / leng + 350) % 360,
            s = [70, 85, 60, 35, 40, 35, 100, 95, 30, 35, 10, 65],
            l = [60, 60, 60, 50, 50, 50, 40, 40, 35, 60, 70, 60],
            e = [70, 70, 70, 60, 60, 60, 50, 50, 50, 70, 75, 70],
            i = Math.floor((h + 15) / 30),
            angle = this.calculateCircumference(elem.value),
            radius = this.calculateRadius(elem.value),
            fillColor, emphasisFill;

        if (elem.itemStyle && elem.itemStyle.normal && elem.itemStyle.normal.color) {
            fillColor = elem.itemStyle.normal.color;
        } else {
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
        } else {
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
    }

    calculateTotalAndMax (data) {
        var values = [];
        if (this.options.type === 'area') {
            each(data as index, segment) {
                values.push(Math.sqrt(segment.value));
            }
        } else {
            each(data as index, segment) {
                values.push(parseFloat(segment.value));
            }
        }
        this.length = data.length;
        this.total = sum(values);
        this.max = max(values);
    }

    calculateCircumference (value) {
        if (this.total > 0) {
            switch (this.options.type) {
                case 'area':
                    return (Math.PI * 2) * (Math.sqrt(value) / this.total);
                case 'radius':
                    return (Math.PI * 2) * (1 / this.length);
                case 'angle':
                case 'pie':
                    return (Math.PI * 2) * (value / this.total);
            }
        } else {
            return 0;
        }
    }

    calculateRadius (value) {
        if (this.total > 0) {
            switch (this.options.type) {
                case 'area':
                    return (this.options.outerRadius - this.options.innerRadius) * (Math.sqrt(value) / this.max) + this.options.innerRadius;
                case 'radius':
                case 'angle':
                    return (this.options.outerRadius - this.options.innerRadius) * (value / this.max) + this.options.innerRadius;
                case 'pie':
                    return this.options.outerRadius;
            }
        } else {
            return 0;
        }
    }

    removeSegment (index) {
        index = parseInt(index) || 0;
        this.segments.splice(index, 1);
    }

    getSegmentsAtEvent (e) {
        var segmentsArray = [];
        var location = helpers.getRelativePosition(e);
        each(this.segments as index, segment) {
            if (segment.inRange(location.x, location.y))
                segmentsArray.push(segment);
            segment.restore(['fillColor', 'oRadius']);
        }
        return segmentsArray;
    }

    draw (easeDecimal) {
        var animDecimal = (easeDecimal) ? easeDecimal : 1;
        each(this.segments as index, segment) {
            segment.transition({
                circumference: this.calculateCircumference(segment.value),
                outerRadius: this.calculateRadius(segment.value),
                innerRadius: segment.iRadius
            }, animDecimal);
            segment.endAngle = segment.startAngle + segment.circumference;
            if (index < this.segments.length - 1) {
                this.segments[index + 1].startAngle = segment.endAngle;
            }
            segment.draw();
        }
    }
}