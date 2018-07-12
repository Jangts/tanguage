class Scatter extends Charts.Type {
    defaults = defaultConfig

    initialize (options) {
        var instance = this.instance,
            options = deepMerge(this.defaults, options);
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

            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>",
        };

        this.segments = [];
        this.grid = this.instance.grid;
        this.PointClass = class extends Charts.sharps.Point {
            type = this.grid.status
            ctx = this.ctx
            grid = this.grid
            itemLabel = this.options.name
            display = this.options.pointDot
            radius = 1
            globalAlpha = 0.85
            emphasisDisplay = true
            fillColor = this.options.pointColor
            emphasisFill = this.options.pointEmphasisFill || this.options.pointColor
            emphasisRadius = this.options.pointEmphasisRadius
            strokeColor = this.options.pointStrokeColor
            emphasisStroke = this.options.pointEmphasisStroke || this.options.pointStrokeColor
            strokeWidth = this.options.pointDotStrokeWidth
            emphasisStrokeWidth = this.options.pointEmphasisStrokeWidth
            hitDetectionRadius = this.options.pointHitDetectionRadius
            strictHover = true
        }
        this.buildSegment(options.data);
    }
    
    buildSegment (data) {
        each(data as index, value) {
            this.addSegment(index, value);
        }
    }

    update (data) {
        each(this.segments as index, segment) {
            segment.value = data && data[index] || 0;
            segment.base = this.grid.baseY;
            segment.restore(['display', 'fillColor', 'radius', 'strokeColor', 'strokeWidth']);
            segment.save();
            this.calculate(index, segment);
        }
        for (var index = this.segments.length; index < data.length; index++) {
            this.addSegment(index, data[index]);
        }
    }

    addSegment (index, value) {
        var segment = new this.PointClass({
            type: this.grid.status,
            value: value,
            label: (this.grid.status === 1) ? this.grid.yLabels[index] : this.grid.xLabels[index]
        });
        this.segments.push(segment);
        this.calculate(index, segment);
        segment.x = segment.X;
        segment.y = segment.Y;
        segment.emphasisRadius = segment.R * 1.2;
        // clog value, segment;
        segment.save();
    }

    calculate (index, segment) {
        _.extend(segment, true, {
            X: this.grid.calculateX(segment.value[0]),
            Y: this.grid.calculateY(segment.value[1]),
            R: ((symbolSize, value) {
                // console.log(typeof symbolSize, symbolSize);
                if (typeof symbolSize === 'number') {
                    return symbolSize / 2;
                }
                if (typeof symbolSize === 'function') {
                    var val = symbolSize(value);
                    if (typeof val === 'number') {
                        return val / 2;
                    }
                }
                return 5;
            })(this.options.symbolSize, segment.value)
        });
    },
    removeSegment (index) {
        index = parseInt(index) || 0;
        this.segments.splice(index, 1);
    }

    getSegmentsAtEvent (e, charts) {
        var segmentsArray = [],
            eventPosition = helpers.getRelativePosition(e);
        _.loop(this.segments, (index, segment) {
            if (segment.inRange(eventPosition.x, eventPosition.y)) {
                if (charts && charts.length) {
                    each(charts as i, chart) {
                        segmentsArray.push(chart.segments[index]);
                    }
                } else {
                    segmentsArray.push(segment);
                }
                _.loop.out();
            }
        }, this);
        return segmentsArray;
    }

    draw (ease) {
        var easingDecimal = ease || 1;
        var ctx = this.ctx;

        each(this.segments as index, segment) {
            segment.transition({
                x: segment.X,
                y: segment.Y,
                radius: segment.R
            }, easingDecimal).draw();
        }
    }
}