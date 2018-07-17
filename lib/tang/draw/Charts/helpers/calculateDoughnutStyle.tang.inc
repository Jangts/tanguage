/*!
 * tanguage framework source code
 *
 * extend_static_methods draw/Charts/util
 *
 * Date: 2015-09-04
 */
;
public calculateDoughnutStyle = (options, width, height) {
    // clog width, height;
    var maxRadius = arr.min([width, height]) / 2;
    innerRadius = 0,
        outerRadius = maxRadius * 0.75,
        x = width / 2,
        y = height / 2;
    if (util.isArr(options.radius)) {
        if (options.radius[0]) {
            if (util.isPercent(options.radius[0])) {
                innerRadius = maxRadius * parseInt(options.radius[0]) / 100
            } else if (util.isNumeric(options.radius[0])) {
                innerRadius = parseFloat(options.radius[0]);
            }
        }
        if (options.radius[1]) {
            if (util.isPercent(options.radius[1])) {
                outerRadius = maxRadius * parseInt(options.radius[1]) / 100
            } else if (util.isNumeric(options.radius[1])) {
                outerRadius = parseFloat(options.radius[1]);
            }
        }

    }

    if (util.isArr(options.center) && options.center.length === 2) {
        if (util.isPercent(options.center[0])) {
            x = width * parseInt(options.center[0]) / 100
        } else if (util.isNumeric(options.center[0])) {
            x = parseFloat(options.center[0]);
        }
        if (util.isPercent(options.center[1])) {
            y = height * parseInt(options.center[1]) / 100
        } else if (util.isNumeric(options.center[1])) {
            y = parseFloat(options.center[1]);
        }
    }
    // clog width, height, x, y;
    return {
        maxRadius: maxRadius,
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        x: x,
        y: y
    }
};