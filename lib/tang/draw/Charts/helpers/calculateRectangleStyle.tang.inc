/*!
 * tanguage framework source code
 *
 * extend_static_methods draw/Charts/util
 *
 * Date: 2015-09-04
 */
;
public calculateRectangleStyle = (options, width, height) {
        var top,
            right,
            bottom,
            left;
        if (util.isNumeric(options.top)) {
            top = parseFloat(options.top);
        } else if (util.isPercent(options.top)) {
            top = height * parseFloat(options.top) / 100;
        } else {
            top = 0;
        }

        if (util.isNumeric(options.right)) {
            right = parseFloat(options.right);
        } else if (util.isPercent(options.right)) {
            right = width * parseFloat(options.right) / 100;
        } else {
            right = 0;
        }

        if (util.isNumeric(options.width)) {
            width = parseFloat(options.width);
            left = width - right - width;
        } else if (util.isPercent(options.width)) {
            width = width * parseFloat(options.width) / 100;
            left = width - right - width;
        } else {
            if (util.isNumeric(options.left)) {
                left = parseFloat(options.left);
            } else if (util.isPercent(options.left)) {
                left = width * parseFloat(options.left) / 100;
            } else {
                left = 100;
            }
            width = width - right - left;
        }
        if (util.isNumeric(options.height)) {
            height = parseFloat(options.height);
        } else if (util.isPercent(options.height)) {
            height = height * parseFloat(options.height) / 100;
        } else {
            if (util.isNumeric(options.bottom)) {
                bottom = parseFloat(options.bottom);
            } else if (util.isPercent(options.bottom)) {
                bottom = height * parseFloat(options.bottom) / 100;
            } else {
                bottom = 0;
            }
            height = height - top - bottom;
        }
        return {
            width: width,
            height: height,
            top: top,
            left: left
        }
    };