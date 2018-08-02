class Radar extends Charts.Type {
    defaults = defaultConfig

    initialize (options) {
        var instance = this.instance,
            options = deepMerge(this.defaults, options);
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

            datasetStrokeWidth: options.lineStyle.borderWidth,
            datasetStrokeType: options.lineStyle.type,
            strokeColor: options.lineStyle.borderColor || this.instance.options.lineColorDefaults[options.index % this.instance.options.lineColorDefaults.length],

            datasetFill: options.showArea,
            fillColor: options.areaStyle.color || this.instance.options.areaColorDefaults[options.index % this.instance.options.areaColorDefaults.length],

            bezierCurve: false,

            pointHitDetectionRadius: options.hitDetectionRadius
        };

        this.lines = [];
        this.segments = [];
        this.radar = this.instance.radarpolar;
        this.LineClass = class extends Charts.sharps.Line {
            ctx = this.ctx
            radar = this.radar
            bezierCurve = this.options.bezierCurve
            bezierCurveTension = this.options.bezierCurveTension
            lineWidth = this.options.datasetStrokeWidth
            lineType = this.options.datasetStrokeType
            strokeStyle = this.options.strokeColor
            datasetStroke = true
        }

        this.PointClass = class extends Charts.sharps.Point {
            type = this.radar.status
            ctx = this.ctx
            radar = this.radar
            titleLabel = this.options.name
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
            line.previous = this.lines[index - 1] || this.lines[this.lines.length - 1];
            line.next = this.lines[index + 1] || this.lines[0];
            line.siblings = this.lines.length;
        }
    }

    update (data) {
        each(this.segments as index, segment) {
            segment.value = data && data[index] || 0;
            segment.restore(['display', 'fillColor', 'radius', 'strokeColor', 'strokeWidth']);
            segment.save();
            this.calculate(index, segment);
        }
        for (var index = this.segments.length; index < data.length; index++) {
            this.addSegment(index, data[index]);
        }
        each(this.lines as index, line) {
            line.previous = this.lines[index - 1] || this.lines[this.lines.length - 1];
            line.next = this.lines[index + 1] || this.lines[0];
            line.siblings = this.lines.length;
        }
    }

    addSegment (index, value) {
        var segment = new this.PointClass({
                type: this.radar.status,
                value: value,
                label: this.radar.angleLabels[index],
            }),
            line = new this.LineClass({
                index: index,
                point: segment
            });
        this.lines.push(line);
        this.segments.push(segment);
        this.calculate(index, segment);
        _.extend(segment, true, {
            x: this.radar.xCenter,
            y: this.radar.yCenter,
            itemLabel: segment.label,
        });
        segment.save();
    }

    calculate (index, segment) {
        var position = this.radar.getPointPosition(this.radar.calculateAngle(index), this.radar.calculateRadius(index, segment.value))
        _.extend(segment, true, {
            X: position.x,
            Y: position.y
        });
    }

    getSegmentsAtEvent (e) {
        var segmentsArray = [],
            eventPosition = helpers.getRelativePosition(e);
        each(this.segments as index, segment) {
            if (segment.inRange(eventPosition.x, eventPosition.y)) {
                segmentsArray = this.segments;
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
                this.lines[index].draw(true);
                points.push(segment);
            }
        }
        if (this.options.datasetFill && (points.length === this.segments.length) && (this.radar.status === 6)) {
            ctx.globalAlpha = 0.85;
            ctx.fillStyle = this.options.fillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        each(points as index, point) {
            point.draw();
        }
    }
}