class Pie extends Charts.Type {
    defaults = defaultConfig
    polar

    initialize (options) {
        var instance = this.instance,
            options = deepMerge(this.defaults, options),
            barStrokeWidth = parseInt(options.itemStyle.normal.barBorderWidth),
            emphasisRadius;

        var style = this.style = new PieStyle(helpers.calculateDoughnutStyle(options, instance.width, instance.height));
        style.fit(options);

        clog helpers.calculateDoughnutStyle(options, instance.width, instance.height), style;

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
        } else {
            this.options.type = 'pie';
        }

        this.ArcClass = class extends Charts.sharps.Arc {
            ctx = this.ctx
            showStroke = this.options.segmentShowStroke
            strokeWidth = this.options.segmentStrokeWidth
            strokeColor = this.options.segmentStrokeColor
            x = style.x
            y = style.y
            innerRadius = this.options.animateScale ? 0 : style.innerRadius
            emphasisRadius = this.options.animateScale ? 0 : style.emphasisRadius
            // oRadius = (style.outerRadius - style.innerRadius)
            iRadius = style.innerRadius
            eRadius = style.emphasisRadius
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

    resetStyle (){
         this.style.update(helpers.calculateDoughnutStyle(this.options, this.instance.width, this.instance.height)).fit(this.options);
         return this;
    }

    update (data) {
        this.calculateTotalAndMax(data);
        var leng = max([data.length, this.segments.length]);
        each(this.segments as index, segment) {
            segment.value = data && data[index] && data[index].value || 0;
            segment.restore(['fillColor', 'oRadius']);
            segment.outerRadius = this.style.outerRadius;
            segment.innerRadius = this.style.innerRadius;
            segment.x = this.style.x;
            segment.y = this.style.y;
            segment.iRadius = this.style.innerRadius
            segment.emphasisRadius = this.style.emphasisRadius;
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
                    return (this.style.outerRadius - this.style.innerRadius) * (Math.sqrt(value) / this.max) + this.style.innerRadius;
                case 'radius':
                case 'angle':
                    return (this.style.outerRadius - this.style.innerRadius) * (value / this.max) + this.style.innerRadius;
                case 'pie':
                    return this.style.outerRadius;
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
            // clog segment.x, segment.y, segment.iRadius;
            segment.transition({
                circumference: this.calculateCircumference(segment.value),
                outerRadius: this.calculateRadius(segment.value),
                innerRadius: segment.iRadius,
                x: segment.x,
                y: segment.y,
            }, animDecimal);
            segment.endAngle = segment.startAngle + segment.circumference;
            if (index < this.segments.length - 1) {
                this.segments[index + 1].startAngle = segment.endAngle;
            }
            segment.draw();
        }
    }
}