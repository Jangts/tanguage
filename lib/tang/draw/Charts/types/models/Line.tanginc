class Line extends Charts.Type {
    defaults = defaultConfig

    initialize (options) {
        var instance = this.instance,
            options = deepMerge(this.defaults, options);
            // clog this.defaults, options;
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

            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>",
        };

        this.lines = [];
        this.segments = [];
        this.grid = this.instance.grid;
        this.LineClass = class extends Charts.sharps.Line {
            ctx = this.ctx
            grid = this.grid
            bezierCurve = this.options.bezierCurve
            bezierCurveTension = this.options.bezierCurveTension
            lineWidth = this.options.datasetStrokeWidth
            strokeStyle = this.options.strokeColor
            datasetStroke = this.options.datasetStroke
        }
        this.PointClass = class extends Charts.sharps.Point {
            type = this.grid.status
            ctx = this.ctx
            grid = this.grid
            itemLabel = this.options.name
            display = this.options.pointDot
            emphasisDisplay = true
            fillColor = this.options.pointColor
            emphasisFill = this.options.pointEmphasisFill || this.options.pointColor
            radius = this.options.pointDotRadius
            emphasisRadius = this.options.pointEmphasisRadius
            strokeColor = this.options.pointStrokeColor
            emphasisStroke = this.options.pointEmphasisStroke || this.options.pointStrokeColor
            strokeWidth = this.options.pointDotStrokeWidth
            emphasisStrokeWidth = this.options.pointEmphasisStrokeWidth
            hitDetectionRadius = this.options.pointHitDetectionRadius
            strictHover = this.instance.options.tooltip.strictHover
        }
        this.buildSegment(options.data);
    }
    
    buildSegment (data) {
        each(data as index, value) {
            this.addSegment(index, value);
        }
        each(this.lines as index, line) {
            line.previous = this.lines[index - 1] || line;
            line.next = this.lines[index + 1] || line;
            line.siblings = this.lines.length;
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
        each(this.lines as index, line) {
            line.previous = this.lines[index - 1] || line;
            line.next = this.lines[index + 1] || line;
            line.siblings = this.lines.length;
        }
    }

    addSegment (index, value) {
        var segment = new this.PointClass({
                type: this.grid.status,
                value: value,
                label: (this.grid.status === 1) ? this.grid.yLabels[index] : this.grid.xLabels[index],
            }),
            line = new this.LineClass({
                index: index,
                point: segment
            });
        // console.log(this.grid.status);
        this.lines.push(line);
        this.segments.push(segment);
        this.calculate(index, segment);
        _.extend(segment, true, {
            x: this.segments[index - 1] ? this.segments[index - 1].X : segment.X,
            y: this.segments[index - 1] ? this.segments[index - 1].Y : segment.Y,
            titleLabel: segment.label
        });
        segment.save();
    }

    calculate (index, segment) {
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
        }
    }

    removeSegment (index) {
        index = parseInt(index) || 0;
        this.segments.splice(index, 1);
    }

    getSegmentsAtEvent (e, charts) {
        var segmentsArray = [],
            eventPosition = helpers.getRelativePosition(e);
        each(this.segments as index, segment) {
            if (segment.inRange(eventPosition.x, eventPosition.y, (charts === undefined))) {
                if (charts && charts.length) {
                    each(charts as i, chart) {
                        segmentsArray.push(chart.segments[index]);
                    }
                } else {
                    segmentsArray.push(segment);
                }
                @return;
            }
        }
        return segmentsArray;
    }

    draw (ease) {
        var easingDecimal = ease || 1,
            ctx = this.ctx,
            points = [];

        each(this.segments as index, segment) {
            if (segment.hasValue()) {
                segment.transition({
                    x: segment.X,
                    y: segment.Y

                }, easingDecimal);
                this.lines[index].draw();
                points.push(segment);
            }
        }

        if (this.options.datasetFill && (points.length > 0) && ((this.grid.status === 0) || (this.grid.status === 1))) {
            if (this.grid.status === 0) {
                canvas.to(ctx, points[points.length - 1].x, this.grid.baseY, 1);
                canvas.to(ctx, points[0].x, this.grid.baseY, 1);
            } else {
                canvas.to(ctx, this.grid.baseX, points[points.length - 1].y, 1);
                canvas.to(ctx, this.grid.baseX, points[0].y, 1);
            }
            ctx.globalAlpha = 0.85;
            ctx.fillStyle = this.options.fillColor;
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        each(points as index, point) {
            point.draw();
        }
    }
}