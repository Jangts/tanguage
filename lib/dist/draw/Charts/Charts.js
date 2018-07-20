/*!
 * tanguage script compiled code
 *
 * Datetime: Fri, 20 Jul 2018 16:00:41 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/arr/',
    '$_/dom/',
    '$_/math/',
    '$_/math/easing',
    '$_/obj/',
    '$_/util/',
    '$_/draw/canvas'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var draw = pandora.ns('draw', {});
    var arr = imports['$_/arr/'];
    var dom = imports['$_/dom/'];
    var obj = imports['$_/obj/'];
    var util = imports['$_/util/'];
    var defaults = {
        minWidth: 150,
        backgroundColor: 'transparent',
        barColorDefaults: ['#A6CEE3', '#1F78B4', '#B2DF8A', '#33A02C', '#FB9A99', '#E31A1C', '#FDBF6F', '#FF7F00', '#CAB2D6', '#6A3D9A', '#B4B482', '#B15928'],
        barColorDefaultsEmphasis: ['#CEF6FF', '#47A0DC', '#DAFFB2', '#5BC854', '#FFC2C1', '#FF4244', '#FFE797', '#FFA728', '#F2DAFE', '#9265C2', '#DCDCAA', '#D98150'],
        lineColorDefaults: ['#C23531', '#2F4554', '#61A0A8', '#D48265', '#91C7AE', '#749F83', '#CA8622', '#BDA29A', '#6E7074', '#546570', '#C4CCD3'],
        areaColorDefaults: ['rgba(194,53,49,0.3)', 'rgba(47,69,84,0.3)', 'rgba(97,160,168,0.3)', 'rgba(212,130,101,0.3)', 'rgba(145,199,174,0.3)', 'rgba(116,159,131,0.3)', 'rgba(202,134,34,0.3)', 'rgba(189,162,154,0.3)', 'rgba(110,112,116,0.3)', 'rgba(84,101,112,0.3)', 'rgba(196,204,211,0.3)'],
        pointColorDefaults: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', '#B15928', '#B4B482', '#6A3D9A', '#CAB2D6', '#FF7F00'],
        pointColorDefaultsEmphasis: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774', '#D98150', '#DCDCAA', '#9265C2', '#F2DAFE', '#FFA728'],
        textStyle: {
            color: '#fff',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontFamily: '\'Microsoft YaHei\', \'Hiragino Sans\', \'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
            fontSize: 12
        },
        animation: true,
        animationDuration: 1000,
        animationEasing: 'easeOutQuart',
        responsive: false,
        maintainAspectRatio: false,
        onAnimationProgress: function () {},
        onAnimationComplete: function () {},
        responsive: true
    }
    var helpers = (function () {
        var getComputeDimension = function (parentNode) {
            return dom.getSize(parentNode, 'inner');
        }
        var getMaximumWidth = function (parentNode) {
            return dom.getSize(parentNode, 'inner').width;
        }
        var getMaximumHeight = function (parentNode) {
            return dom.getSize(parentNode, 'inner').height;
        }
        var aliasPixel = function (pixelWidth) {
            return (pixelWidth % 2 === 0) ? 0 : 0.5;
        }
        var animationLoop = function (callback, totalSteps, easingString, onProgress, onComplete, chartInstance) {
            var currentStep = 0;
            var easingFunction = easingEffects[easingString] || easingEffects.linear;
            function animationFrame () {
                currentStep++;
                var stepDecimal = currentStep/totalSteps;
                var easeDecimal = easingFunction(stepDecimal, 0, 1, 1);
                callback.call(chartInstance, easeDecimal, stepDecimal, currentStep);
                onProgress.call(chartInstance, easeDecimal, stepDecimal);
                if (currentStep < totalSteps) {
                    chartInstance.animationFrame = requestAnimFrame(animationFrame);
                }
                else {
                    onComplete.apply(chartInstance);
                };
            }
            requestAnimFrame(animationFrame);
        }
        var calculateOrderOfMagnitude = function (val) {
            return Math.floor(Math.log(val)/Math.LN10);
        }
        var requestAnimFrame = (function () {
            return root.requestAnimationFrame
    || root.webkitRequestAnimationFrame
    || root.mozRequestAnimationFrame
    || root.oRequestAnimationFrame
    || root.msRequestAnimationFrame
    || function (callback, fps) {
                return root.setTimeout(callback, 1000/fps, this);
            }
        }());
        var cancelAnimFrame = (function () {
            return window.cancelAnimationFrame
    || window.webkitCancelAnimationFrame
    || window.mozCancelAnimationFrame
    || window.oCancelAnimationFrame
    || window.msCancelAnimationFrame
    || function (callback) {
                return window.clearTimeout(callback, 1000/60);
            }
        }());
        var generateLabels = function (templateString, numberOfSteps, graphMin, stepValue) {
            var labelsArray = new Array(numberOfSteps);
            if (templateString) {
                _.each(labelsArray, function (index, val) {
                    labelsArray[index] = template(templateString, {
                        value: (graphMin + (stepValue * (index + 1)))
                    });
                });
            }
            return labelsArray;
        }
        var getAngleFromPoint = function (centrePoint, anglePoint) {
            var distanceFromXCenter = anglePoint.x - centrePoint.x;
            var distanceFromYCenter = anglePoint.y - centrePoint.y;
            var radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
            var angle = Math.PI * 2 + Math.atan2(distanceFromYCenter, distanceFromXCenter);
            if (distanceFromXCenter < 0 && distanceFromYCenter < 0) {
                angle += Math.PI * 2;
            }
            return {
                angle: angle,
                distance: radialDistanceFromCenter
            };
        }
        var noop = function () {}
        var splineCurve = function (FirstPoint, MiddlePoint, AfterPoint, t) {
            var d01 = Math.sqrt(Math.pow(MiddlePoint.x - FirstPoint.x, 2) + Math.pow(MiddlePoint.y - FirstPoint.y, 2));
            var d12 = Math.sqrt(Math.pow(AfterPoint.x - MiddlePoint.x, 2) + Math.pow(AfterPoint.y - MiddlePoint.y, 2));
            var fa = t * d01/(d01 + d12);
            var fb = t * d12/(d01 + d12);
            return {
                inner: {
                    x: MiddlePoint.x - fa * (AfterPoint.x - FirstPoint.x),
                    y: MiddlePoint.y - fa * (AfterPoint.y - FirstPoint.y)
                },
                outer: {
                    x: MiddlePoint.x + fb * (AfterPoint.x - FirstPoint.x),
                    y: MiddlePoint.y + fb * (AfterPoint.y - FirstPoint.y)
                }
            };
        }
        var template = function (templateString, valuesObject) {
            if (templateString instanceof Function) {
                return templateString(valuesObject);
            }
            var cache = {};
            function trim (str) {
                return str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'");
            }
            function tmpl (str, data) {
                var fn = !/\W/.test(str) ? cache[str]:function (obj) {
                    var p = [];
                    function print () {
                        p.push.apply(p, arguments);
                    }
                    with (obj) {
                        eval("p.push('" + trim(str) + "');");
                    }
                    return p.join('');
                }
                return data ? fn(data): fn;
            }
            return tmpl(templateString, valuesObject);
        }
        var calculateCircleStyle = function (options, width, height) {
            var maxRadius = arr.min([width, height])/2;
            radius = maxRadius * 0.75
            x = width/2
            y = height/2;
            if (options.radius) {
                if (util.isPercent(options.radius)) {
                    radius = maxRadius * parseInt(options.radius)/100;
                }
                else if (util.isNumeric(options.radius)) {
                    radius = parseFloat(options.radius);
                };
            }
            if (util.isArr(options.center) && options.center.length === 2) {
                if (util.isPercent(options.center[0])) {
                    x = width * parseInt(options.center[0])/100;
                }
                else if (util.isNumeric(options.center[0])) {
                    x = parseFloat(options.center[0]);
                };
                if (util.isPercent(options.center[1])) {
                    y = height * parseInt(options.center[1])/100;
                }
                else if (util.isNumeric(options.center[1])) {
                    y = parseFloat(options.center[1]);
                };
            }
            return {
                maxRadius: maxRadius,
                radius: radius,
                x: x,
                y: y
            };
        }
        var calculateDoughnutStyle = function (options, width, height) {
            var maxRadius = arr.min([width, height])/2;
            innerRadius = 0
            outerRadius = maxRadius * 0.75
            x = width/2
            y = height/2;
            if (util.isArr(options.radius)) {
                if (options.radius[0]) {
                    if (util.isPercent(options.radius[0])) {
                        innerRadius = maxRadius * parseInt(options.radius[0])/100;
                    }
                    else if (util.isNumeric(options.radius[0])) {
                        innerRadius = parseFloat(options.radius[0]);
                    };
                }
                if (options.radius[1]) {
                    if (util.isPercent(options.radius[1])) {
                        outerRadius = maxRadius * parseInt(options.radius[1])/100;
                    }
                    else if (util.isNumeric(options.radius[1])) {
                        outerRadius = parseFloat(options.radius[1]);
                    };
                }
            }
            if (util.isArr(options.center) && options.center.length === 2) {
                if (util.isPercent(options.center[0])) {
                    x = width * parseInt(options.center[0])/100;
                }
                else if (util.isNumeric(options.center[0])) {
                    x = parseFloat(options.center[0]);
                };
                if (util.isPercent(options.center[1])) {
                    y = height * parseInt(options.center[1])/100;
                }
                else if (util.isNumeric(options.center[1])) {
                    y = parseFloat(options.center[1]);
                };
            }
            return {
                maxRadius: maxRadius,
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                x: x,
                y: y
            };
        }
        var calculateRectangleStyle = function (options, width, height) {
            var top = void 0;
            var right = void 0;
            var bottom = void 0;
            var left = void 0;
            if (util.isNumeric(options.top)) {
                top = parseFloat(options.top);
            }
            else if (util.isPercent(options.top)) {
                top = height * parseFloat(options.top)/100;
            }
            else {
                top = 0;
            }
            if (util.isNumeric(options.right)) {
                right = parseFloat(options.right);
            }
            else if (util.isPercent(options.right)) {
                right = width * parseFloat(options.right)/100;
            }
            else {
                right = 0;
            }
            if (util.isNumeric(options.width)) {
                width = parseFloat(options.width);
                left = width - right - width;
            }
            else if (util.isPercent(options.width)) {
                width = width * parseFloat(options.width)/100;
                left = width - right - width;
            }
            else {
                if (util.isNumeric(options.left)) {
                    left = parseFloat(options.left);
                }
                else if (util.isPercent(options.left)) {
                    left = width * parseFloat(options.left)/100;
                }
                else {
                    left = 100;
                }
                width = width - right - left;
            }
            if (util.isNumeric(options.height)) {
                height = parseFloat(options.height);
            }
            else if (util.isPercent(options.height)) {
                height = height * parseFloat(options.height)/100;
            }
            else {
                if (util.isNumeric(options.bottom)) {
                    bottom = parseFloat(options.bottom);
                }
                else if (util.isPercent(options.bottom)) {
                    bottom = height * parseFloat(options.bottom)/100;
                }
                else {
                    bottom = 0;
                }
                height = height - top - bottom;
            }
            width = width > options.minWidth ? width : options.minWidth;
            return {
                width: width,
                height: height,
                top: top,
                left: left
            };
        }
        var calculateScaleRange = function (valuesArray, drawingSize, textSize, startFromZero, integersOnly, isXoA, isPolar) {
            if (isPolar && isXoA) {
                var minSteps = 4;
                var maxSteps = Math.floor((Math.PI * drawingSize * 2)/(textSize * 1.5));
                var skipFitting = (minSteps >= maxSteps);
            }
            else {
                var minSteps = 2;
                var maxSteps = Math.floor(drawingSize/(textSize * 1.5));
                var skipFitting = (minSteps >= maxSteps);
            }
            var minValue = arr.min(valuesArray);
            var maxValue = arr.max(valuesArray);
            if (maxValue === minValue) {
                maxValue += 0.5;
                if (minValue >= 0.5 && !startFromZero) {
                    minValue -= 0.5;
                }
                else {
                    maxValue += 0.5;
                }
            }
            var valueRange = Math.abs(maxValue - minValue);
            var rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange);
            var graphMax = Math.ceil(maxValue/(1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
            var graphMin = (startFromZero) ? 0 : Math.floor(minValue/(1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
            var graphRange = graphMax - graphMin;
            var stepValue = Math.pow(10, rangeOrderOfMagnitude);
            var numberOfSteps = Math.round(graphRange/stepValue);
            while ((numberOfSteps > maxSteps || (numberOfSteps * 2) < maxSteps)&& !skipFitting) {
                if (numberOfSteps > maxSteps) {
                    stepValue *= 2;
                    numberOfSteps = Math.round(graphRange/stepValue);
                    if (numberOfSteps % 1 !== 0) {
                        skipFitting = true;
                    }
                }
                else {
                    if (integersOnly && rangeOrderOfMagnitude >= 0) {
                        if (stepValue/2 % 1 === 0) {
                            stepValue/=2;
                            numberOfSteps = Math.round(graphRange/stepValue);
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        stepValue/=2;
                        numberOfSteps = Math.round(graphRange/stepValue);
                    }
                }
            }
            if (skipFitting) {
                numberOfSteps = minSteps;
                stepValue = graphRange/numberOfSteps;
            }
            if (isPolar) {
                return [numberOfSteps, stepValue];
            }
            if (isXoA) {
                return {
                    xSteps: numberOfSteps,
                    xStepValue: stepValue,
                    minX: graphMin,
                    maxX: graphMin + (numberOfSteps * stepValue)
                };
            }
            return {
                ySteps: numberOfSteps,
                yStepValue: stepValue,
                minY: graphMin,
                maxY: graphMin + (numberOfSteps * stepValue)
            };
        }
        var hovers = {};
        var getRelativePosition = function (evt) {
            var mouseX = void 0;var mouseY = void 0;
            var e = evt.originalEvent || evt;
            var canvas = evt.currentTarget || evt.srcElement;
            var boundingRect = canvas.getBoundingClientRect();
            if (e.touches) {
                mouseX = e.touches[0].clientX - boundingRect.left;
                mouseY = e.touches[0].clientY - boundingRect.top;
            }
            else {
                mouseX = e.clientX - boundingRect.left;
                mouseY = e.clientY - boundingRect.top;
            }
            return {
                x: mouseX,
                y: mouseY
            };
        }
        var bindEvents = function (instance, arrayOfEvents, handler) {
            var _arguments = arguments;
            if (!instance.events) {
                instance.events = {};
            }
            pandora.each(arrayOfEvents, function (index, eventName) {
                instance.events[eventName] = function () {
                    handler.apply(instance, arguments);
                }
                dom.events.add(instance.Element, eventName, null, null, instance.events[eventName]);
            }, this);
        }
        var unbindEvents = function (instance, arrayOfEvents) {
            var _arguments = arguments;
            pandora.each(arrayOfEvents, function (eventName, handler) {
                dom.removeEvents(instance.Element, eventName, null, handler);
            }, this);
        }
        var bindHover = function (instance, callback) {
            if (!hovers[instance.id]) {
                hovers[instance.id] = {
                    eventTypes: arr.merge(instance.options.tooltip.triggerOn, instance.options.tooltip.triggerOff),
                    exceptEventTypes: instance.options.tooltip.triggerOff,
                    trigger: function (evt) {
                        if (hovers[instance.id].exceptEventTypes.indexOf(evt.type) < 0) {
                            _.each(hovers[instance.id].handlers, function (i, handler) {
                                handler(evt);
                            });
                        }
                        else {
                            if (instance.options.tooltip.show) {
                                instance.showTooltip([]);
                            }
                        };
                    },
                    handlers: [function (evt) {
                        instance.actived = 0;
                    }]
                };
                bindEvents(instance, hovers[instance.id].eventTypes, hovers[instance.id].trigger);
            }
            else {
                if (typeof callback === 'function') {
                    hovers[instance.id].handlers.push(function (evt) {
                        if (instance.actived == 0) {
                            callback.call(instance, evt);
                        };
                    });
                }
            };
        }
        return {
            getComputeDimension: getComputeDimension,
            getMaximumWidth: getMaximumWidth,
            getMaximumHeight: getMaximumHeight,
            aliasPixel: aliasPixel,
            animationLoop: animationLoop,
            calculateOrderOfMagnitude: calculateOrderOfMagnitude,
            requestAnimFrame: requestAnimFrame,
            cancelAnimFrame: cancelAnimFrame,
            generateLabels: generateLabels,
            getAngleFromPoint: getAngleFromPoint,
            noop: noop,
            splineCurve: splineCurve,
            template: template,
            calculateCircleStyle: calculateCircleStyle,
            calculateDoughnutStyle: calculateDoughnutStyle,
            calculateRectangleStyle: calculateRectangleStyle,
            calculateScaleRange: calculateScaleRange,
            getRelativePosition: getRelativePosition,
            bindEvents: bindEvents,
            unbindEvents: unbindEvents,
            bindHover: bindHover
        }
    }());
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var instances = {};
    var handler = (function () {
        var timeout = void 0;
        return function () {
            timeout = setTimeout(function () {
                var _arguments = arguments;
                pandora.each(instances, function (index, instance) {
                    if (instance.options.responsive) {
                        instance.resize(instance.render, true);
                    };
                }, this);
            }, 20);
        }
    }());
    var Component = pandora.declareClass({
        _init: function (configuration) {
            _.extend(this, true, configuration);
            this.initialize.apply(this, arguments);
            this.save();
        },
        initialize: function () {
            var _arguments = arguments;
            pandora.each(this, function (key, value) {
                this[key] = value;
            }, this);
        },
        restore: function (props) {
            var _arguments = arguments;
            if (!props) {
                _.extend(this, true, this._saved);
            }
            else {
                pandora.each(props, function (_index, key) {
                    this[key] = this._saved[key];
                }, this);
            }
            return this;
        },
        save: function () {
            this._saved = _.obj.clone(this);
            delete this._saved._saved;
            return this;
        },
        update: function (newProps) {
            var _arguments = arguments;
            pandora.each(newProps, function (key, value) {
                this._saved[key] = this[key];
                this[key] = value;
            }, this);
            return this;
        },
        transition: function (props, ease) {
            var _arguments = arguments;
            pandora.each(props, function (key, value) {
                this[key] = ((value - this._saved[key]) * ease) + this._saved[key];
            }, this);
            return this;
        },
        tooltipPosition: function () {
            return {
                x: this.x,
                y: this.y
            };
        },
        hasValue: function () {
            return util.isNumber(this.value);
        }
    });
    var Type = pandora.declareClass({
        _init: function (options, charts, zIndex) {
            this.instance = charts;
            this.ctx = charts.getLayer(zIndex).getContext("2d");
            this.initialize(options);
        },
        initialize: function () {
            return this;
        },
        reflow: undefined,
        generateLegend: function () {
            return helpers.template(this.options.legendTemplate, {
                datasets: this.datasets
            });
        },
        destroy: function () {
            this.stop();
            this.clear();
            helpers.unbindEvents(this, this.events);
            var canvas = this.chart.canvas;
            canvas.width = this.chart.width;
            canvas.height = this.chart.height;
            if (canvas.style.removeProperty) {
                canvas.style.removeProperty('width');
                canvas.style.removeProperty('height');
            }
            else {
                canvas.style.removeAttribute('width');
                canvas.style.removeAttribute('height');
            }
            delete _.draw.Charts.instances[this.id];
        },
        toBase64Image: function () {
            return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);
        }
    });
    pandora.declareClass('draw.Charts', {
        Element: undefined,
        ctx: undefined,
        canvas: undefined,
        width: 0,
        height: 0,
        ratio: 1,
        _init: function (elem, theme, options) {
            if (util.isElement(elem)) {
                this.id = new _.Identifier().toString();
                this.historyCharts = {};
                instances[this.id] = this;
                if (theme && draw.Charts.theme[theme]) {
                    this.options = obj.deepMerge(defaults, draw.Charts.theme[theme]);
                }
                else {
                    this.options = _.copy(defaults);
                }
                dom.setAttr(elem, 'data-chart-id', this.id);
                dom.setStyle(elem, {
                    '-webkit-tap-highlight-color': 'transparent',
                    '-webkit-user-select': 'none',
                    'position': 'relative',
                    'background-color': 'transparent'
                });
                this.Element = elem;
                var computeDimension = dom.getSize(elem, 'inner');
                this.width = computeDimension.width > this.options.minWidth ? computeDimension.width : this.options.minWidth;
                this.height = computeDimension.height;
                this.layers = {};
                this.ratio = this.width/this.height;
                if (options) {
                    this.setOption(options);
                }
            }
            else {
                _.error('No Element');
            };
        },
        setOption: function (options) {
            var _arguments = arguments;
            options = options || {}
            if (options.radar) {
                this.radarpolar = this.radarpolar || null;
            }
            else {
                this.grid = this.grid || null;
            }
            this.series = {};
            this.options = obj.deepMerge(this.options || {}, options);
            if (options.backgroundColor) {
                dom.setStyle(this.Element, 'backgroundColor', options.backgroundColor);
            }
            helpers.bindHover(this);
            if (options.series) {
                pandora.each(options.series, function (i, chart) {
                    if (chart.type) {
                        if (this[chart.type]) {
                            this.series[chart.type] = this.series[chart.type] || [];
                            this.series[chart.type].push(chart);
                        }
                        else {
                            _.error('Loading chart type \'' + chart.type + '\' first.');
                        }
                    }
                    else {
                        _.error('Unspecified type of one or more charts.');
                    };
                }, this);
            }
            this.build();
        },
        build: function (animaless) {
            var _arguments = arguments;
            this.activedCharts = [];
            this.activedNamesCount = {};
            if (this.grid || this.grid === null) {
                this.options.grid && this.options.grid.show && (typeof this.buildGrid === 'function') && this.buildGrid();
            }
            if (this.radarpolar || this.radarpolar === null) {
                this.options.radar && this.options.radar.show && (typeof this.buildRadar === 'function') && this.buildRadar();
            }
            var types = ['bar', 'polareare', 'line', 'scatter', 'radar', 'pie'];
            pandora.each(types, function (i, type) {
                this[type] && this[type]();
            }, this);
            animaless ? this.draw(): this.render();
        },
        getChartName: function (pre) {
            pre = typeof pre === 'string' ? pre : '';
            this.activedNamesCount[pre] = this.activedNamesCount[pre] || 0;
            return pre + this.activedNamesCount[pre]++;
        },
        getLayer: function (zIndex) {
            zIndex = zIndex || 0;
            if (!this.layers[zIndex]) {
                var canvas = dom.create('canvas', this.Element, {
                    width: this.width,
                    height: this.height,
                    style: {
                        'position': 'absolute',
                        'left': '0px',
                        'top': '0px',
                        'width': this.width + 'px',
                        'height': this.height + 'px',
                        '-webkit-user-select': 'none',
                        '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)'
                    }
                });
                canvas.width = this.width;
                canvas.height = this.height;
                this.layers[zIndex] = canvas;
            }
            return this.layers[zIndex];
        },
        retinaScale: function () {
            var _arguments = arguments;
            if (window.devicePixelRatio) {
                pandora.each(this.layers, function (zIndex, canvas) {
                    var ctx = canvas.getContext("2d");
                    var width = ctx.canvas.width;
                    var height = ctx.canvas.height;
                    ctx.canvas.style.width = width + "px";
                    ctx.canvas.style.height = height + "px";
                    ctx.canvas.height = height * window.devicePixelRatio;
                    ctx.canvas.width = width * window.devicePixelRatio;
                    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
                }, this);
            }
            return this;
        },
        clear: function () {
            var _arguments = arguments;
            pandora.each(this.layers, function (zIndex, canvas) {
                var ctx = canvas.getContext("2d");
                var width = ctx.canvas.width;
                var height = ctx.canvas.height;
                draw.canvas.clear(ctx, width, height);
            }, this);
            return this;
        },
        stop: function () {
            if (this.cancelAnimation) {
                this.cancelAnimation();
            }
            return this;
        },
        render: function () {
            this.clear();
            if (this.addAnimation && this.options.animation) {
                this.addAnimation();
            }
            else {
            (typeof this.options.onAnimationComplete === 'function') && this.options.onAnimationComplete();
            }
            return this;
        },
        draw: function (ease) {
            var _arguments = arguments;
            var easingDecimal = ease || 1;
            this.clear();
            this.grid && this.grid.draw(easingDecimal);
            this.radarpolar && this.radarpolar.draw(easingDecimal);
            this.polar && this.polar.draw(easingDecimal);
            pandora.each(this.activedCharts, function (i, chart) {
                chart.draw(ease);
            }, this);
            return this;
        },
        resize: function () {
            var _arguments = arguments;
            this.stop();
            this.clear();
            var newWidth = helpers.getMaximumWidth(this.Element);
            var newWidth = newWidth > this.options.minWidth ? newWidth : this.options.minWidth;
            var newHeight = this.options.maintainAspectRatio ? newWidth/this.ratio : draw.Charts.helpers.getMaximumHeight(this.Element);
            this.width = newWidth;
            this.height = newHeight;
            pandora.each(this.layers, function (zIndex, canvas) {
                canvas.width = newWidth;
                canvas.height = newHeight;
            }, this);
            this.retinaScale();
            return this.build(true);
        }
    });
    pandora.extend(pandora.draw.Charts, {
        defaults: defaults,
        helpers: helpers,
        theme: {},
        sharp: {},
        Type: Type,
        type: {},
        Component: Component,
        component: {}
    });
    dom.events.add(window, "resize", null, null, handler);
    this.module.exports = draw.Charts;
});
//# sourceMappingURL=Charts.js.map