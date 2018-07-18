/*!
 * tanguage framework source code
 *
 * extend_static_methods draw/Charts/util
 *
 * Date: 2015-09-04
 */
;
public calculateCircleStyle = (options, width, height) {
    var maxRadius = arr.min([width, height]) / 2;
    radius = maxRadius * 0.75,
        x = width / 2,
        y = height / 2;

    if (options.radius) {
        if (util.isPercent(options.radius)) {
            radius = maxRadius * parseInt(options.radius) / 100
        } else if (util.isNumeric(options.radius)) {
            radius = parseFloat(options.radius);
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
    return {maxRadius, radius, x, y}
};