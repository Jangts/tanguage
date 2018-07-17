class Bar extends Charts.Type {
    defaults = defaultConfig
    
    initialize (options) {
        var options = deepMerge(this.defaults, options),
            barStrokeWidth = parseInt(options.itemStyle.normal.barBorderWidth);
        this.options = {
            index: options.index,
            name: options.name,
            barShowStroke: (barStrokeWidth > 0),
            barStrokeWidth: barStrokeWidth,
            barValueSpacing: options.barGap,
            barDatasetSpacing: options.barCategoryGap,
            fillColor: options.itemStyle.normal.color || this.instance.options.barColorDefaults[options.index % this.instance.options.barColorDefaults.length],
            strokeColor: options.itemStyle.normal.barBorderColor,
            emphasisFill: options.itemStyle.emphasis.color || this.instance.options.barColorDefaultsEmphasis[options.index % this.instance.options.barColorDefaultsEmphasis.length],
            emphasisStroke: options.itemStyle.emphasis.barBorderColor,
            emphasisStrokeWidth: options.itemStyle.emphasis.barBorderWidth,

            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>"
        }
        this.segments = []
        this.grid = this.instance.grid;
        this.BarClass = class extends Charts.sharps.Rectangle {
            ctx = this.ctx
            grid = this.grid
            itemLabel = this.options.name
            showStroke = this.options.barShowStroke
            fillColor = this.options.fillColor
            emphasisFill = this.options.emphasisFill
            strokeColor = this.options.strokeColor
            emphasisStroke = this.options.emphasisStroke
            strokeWidth = this.options.barStrokeWidth
            emphasisStrokeWidth = this.options.emphasisStrokeWidth

            // initialize () {
                
            // }
        }
        this.buildSegments(options.data);

    }
    
    buildSegments (data) {
        each(data as index, value) {
            this.addSegment(index, value);
        }
    }

    update (data, datasetIndex) {
        data = data || [];
        each(this.segments as index, segment) {
            segment.value1 = ((segment.type === 2) || (segment.type === 3)) ? data[index][0] : 0;
            segment.value2 = ((segment.type === 2) || (segment.type === 3)) ? data[index][1] : data[index];
            segment.restore(['fillColor', 'strokeColor', 'strokeWidth']);
            segment.save();
            // clog segment
            this.calculate(index, segment);
        }
        for (var index = this.segments.length; index < data.length; index++) {
            this.addSegment(index, data[index]);
        }
    }

    addSegment (index, value) {
        if (this.grid.status < 4) {
            if (typeof value === 'number') {
                var segment = new this.BarClass({
                    type: this.grid.status,
                    value1: 0,
                    value2: value,
                    value: value
                });
            } else if (typeof value === 'object') {
                if (value.value) {
                    if (typeof value.value === 'number') {
                        var segment = new this.BarClass({
                            type: this.grid.status,
                            value1: 0,
                            value2: value.value,
                            value: value.value
                        });
                    } else if (typeof value.value === 'object') {
                        var segment = new this.BarClass({
                            type: this.grid.status + 2,
                            value1: value.value[0],
                            value2: value.value[1],
                            value: value.value
                        });
                    }
                    if (value.itemStyle && value.itemStyle.normal && value.itemStyle.normal.color) {
                        segment.fillColor = value.itemStyle.normal.color;
                    }
                    if (value.itemStyle && value.itemStyle.emphasis && value.itemStyle.emphasis.color) {
                        segment.emphasisFill = value.itemStyle.emphasis.color;
                    }
                } else {
                    var segment = new this.BarClass({
                        type: this.grid.status + 2,
                        value1: value[0],
                        value2: value[1],
                        value: value
                    });
                }
            }
            segment.label = (segment.grid.status === 1) ? segment.grid.yLabels[index] : segment.grid.xLabels[index];
            segment.titleLabel = segment.label;
            this.segments.push(segment);
            this.calculate(index, segment);
            segment.save();
        }
    }

    calculate (index, segment) {
        var length = this.instance.series.bar.length;
        var setGap = this.options.barDatasetSpacing;
        var valGap = this.options.barValueSpacing;
        switch (segment.type) {
            case 0:
                var width = segment.grid.calculateBarWidth(length, setGap, valGap),
                    x = segment.grid.calculateBarX(length, this.options.index, index, setGap, valGap),
                    y = segment.grid.calculateY(segment.value2);
                _.extend(segment, true, {
                    radius: width / 2,
                    x: x,
                    y: y,
                    X: x,
                    Y: y,
                    x1: x,
                    y1: segment.grid.baseY,
                    x2: x,
                    y2: segment.grid.baseY,
                });
                break;
            case 1:
                var height = segment.grid.calculateBarHeight(length, setGap, valGap),
                    x = segment.grid.calculateX(segment.value2),
                    y = segment.grid.calculateBarY(length, this.options.index, index, setGap, valGap);
                _.extend(segment, true, {
                    radius: height / 2,
                    x: x,
                    y: y,
                    X: x,
                    Y: y,
                    x1: segment.grid.baseX,
                    y1: y,
                    x2: segment.grid.baseX,
                    y2: y
                });
                break;
            case 2:
                var width = segment.grid.calculateBarWidth(length, setGap, valGap),
                    x = segment.grid.calculateBarX(length, this.options.index, index, setGap, valGap),
                    y1 = segment.grid.calculateY(segment.value1),
                    y2 = segment.grid.calculateY(segment.value2);
                _.extend(segment, true, {
                    radius: width / 2,
                    x: x,
                    y: (y1 + y2) / 2,
                    X: x,
                    Y: y2,
                    x1: x,
                    y1: y1,
                    x2: x,
                    y2: y1
                });
                break;
            case 3:
                var height = segment.grid.calculateBarHeight(length, setGap, valGap),
                    x1 = segment.grid.calculateX(segment.value1);
                x2 = segment.grid.calculateX(segment.value2);
                y = segment.grid.calculateBarY(length, this.options.index, index, setGap, valGap);
                _.extend(segment, true, {
                    radius: height / 2,
                    x: (x1 + x2) / 2,
                    y: y,
                    X: x2,
                    Y: y,
                    x1: x1,
                    y1: y,
                    x2: x1,
                    y2: y
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
            if (segment.inRange(eventPosition.x, eventPosition.y)) {
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
        var easingDecimal = ease || 1;
        var ctx = this.ctx,
            datasetIndex = this.options.index;
        var length = this.instance.series.bar.length;
        var setGap = this.options.barDatasetSpacing;
        var valGap = this.options.barValueSpacing;

        if (this.grid.status === 1) {
            each(this.segments as index, segment) {
                if (segment.hasValue()) {
                    segment.transition({
                        radius: segment.grid.calculateBarHeight(length, setGap, valGap) / 2,
                        x1: segment.x1,
                        y1: segment.y,
                        x2: segment.X,
                        y2: segment.Y
                    }, easingDecimal).draw();
                }
            }
        } else {
            each(this.segments as index, segment) {
                if (segment.hasValue()) {
                    segment.transition({
                        radius: segment.grid.calculateBarWidth(length, setGap, valGap) / 2,
                        x1: segment.x,
                        y1: segment.y1,
                        x2: segment.X,
                        y2: segment.Y
                    }, easingDecimal).draw();
                }
            }
        }
    }
}