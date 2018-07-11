/*!
 * tanguage framework source code
 *
 * extend_static_methods draw/Charts/util
 *
 * Date: 2015-09-04
 */
;
ns {
    public
    getMaximumWidth = (parentNode) {
        return dom.getSize(parentNode, 'inner').width;
    },

    getMaximumHeight = (parentNode) {
        return dom.getSize(parentNode, 'inner').height;
    },

    aliasPixel = (pixelWidth) {
        return (pixelWidth % 2 === 0) ? 0 : 0.5;
    },

    animationLoop = (callback, totalSteps, easingString, onProgress, onComplete, chartInstance) {
        var currentStep = 0,
            easingFunction = easingEffects[easingString] || easingEffects.linear;

        animationFrame () {
            currentStep++;
            var stepDecimal = currentStep / totalSteps;
            var easeDecimal = easingFunction(stepDecimal, 0, 1, 1);

            callback.call(chartInstance, easeDecimal, stepDecimal, currentStep);
            onProgress.call(chartInstance, easeDecimal, stepDecimal);
            if (currentStep < totalSteps) {
                chartInstance.animationFrame = requestAnimFrame(animationFrame);
            } else {
                onComplete.apply(chartInstance);
            }
        };
        requestAnimFrame(animationFrame);
    },

    calculateOrderOfMagnitude = (val) {
        return Math.floor(Math.log(val) / Math.LN10);
    },

    requestAnimFrame = void ns {
        return root.requestAnimationFrame 
            || root.webkitRequestAnimationFrame 
            || root.mozRequestAnimationFrame 
            || root.oRequestAnimationFrame 
            || root.msRequestAnimationFrame 
            || (callback, fps) {
                return root.setTimeout(callback, 1000 / fps, this);
            };
    },

    cancelAnimFrame = void ns {
        return window.cancelAnimationFrame 
            || window.webkitCancelAnimationFrame
            || window.mozCancelAnimationFrame
            || window.oCancelAnimationFrame
            || window.msCancelAnimationFrame
            || (callback) {
                return window.clearTimeout(callback, 1000 / 60);
            };
    },
    
    generateLabels = (templateString, numberOfSteps, graphMin, stepValue) {
        var labelsArray = new Array(numberOfSteps);
        if (templateString) {
            _.each(labelsArray, function(index, val) {
                labelsArray[index] = template(templateString, {
                    value: (graphMin + (stepValue * (index + 1)))
                });
            });
        }
        return labelsArray;
    },

    // Gets the angle from vertical upright to the point about a centre.
    getAngleFromPoint = (centrePoint, anglePoint) {
        var distanceFromXCenter = anglePoint.x - centrePoint.x,
            distanceFromYCenter = anglePoint.y - centrePoint.y,
            radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);

        var angle = Math.PI * 2 + Math.atan2(distanceFromYCenter, distanceFromXCenter);

        //If the segment is in the top left quadrant, we need to add another rotation to the angle
        if (distanceFromXCenter < 0 && distanceFromYCenter < 0) {
            angle += Math.PI * 2;
        }

        return {
            angle: angle,
            distance: radialDistanceFromCenter
        };
    },

    noop = () {},

    splineCurve = (FirstPoint, MiddlePoint, AfterPoint, t) {
        var d01 = Math.sqrt(Math.pow(MiddlePoint.x - FirstPoint.x, 2) + Math.pow(MiddlePoint.y - FirstPoint.y, 2)),
            d12 = Math.sqrt(Math.pow(AfterPoint.x - MiddlePoint.x, 2) + Math.pow(AfterPoint.y - MiddlePoint.y, 2)),
            fa = t * d01 / (d01 + d12),
            // scaling factor for triangle Ta
            fb = t * d12 / (d01 + d12);
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
    },

    template = (templateString, valuesObject) {
        if (templateString instanceof Function) {
            return templateString(valuesObject);
        }

        var cache = {};

        trim(str) {
            return str.replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t")
                .join("');")
                .split("%>")
                .join("p.push('")
                .split("\r")
                .join("\\'");
        }

        tmpl(str, data) {
            var fn = !/\W/.test(str) ? cache[str] : (obj) {
                var p = [],
                    print () {
                        p.push.apply(p, arguments);
                    };
                with(obj) {
                    eval("p.push('" + trim(str) + "');");
                }
                return p.join('');
            };

            return data ? fn(data) : fn;
        }
        return tmpl(templateString, valuesObject);
    };

    @include 'helpers/calculateCircleStyle';
    @include 'helpers/calculateDoughnutStyle';
    @include 'helpers/calculateRectangleStyle';
    @include 'helpers/calculateScaleRange';
    
    @include 'helpers/events';
}