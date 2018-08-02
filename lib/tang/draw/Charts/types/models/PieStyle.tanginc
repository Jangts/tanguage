/*!
 * tanguage framework source code
 *
 * extend_static_methods draw/Charts/util
 * 
 * Date: 2015-09-04
 */
;
getMax(steps, value) {
    var stepValue = Math.ceil(value / steps);
    return stepValue * steps;
}

class PieStyle {
    _init (configuration) {
        _.extend(this, true, configuration);
    }
    
    update (newProps) {
        _.extend(this, true, newProps);
        return this;
    }

    fit (options){
        if (isArr(options.radius) && options.radius[2]) {
            if (isPercent(options.radius[2])) {
                this.emphasisRadius = this.maxRadius * parseInt(options.radius[2]) / 100
            } else if (isNumeric(options.radius[2])) {
                this.emphasisRadius = parseFloat(options.radius[1]);
            } else {
                this.emphasisRadius = this.outerRadius + 5;
            }
        } else {
            this.emphasisRadius = this.outerRadius + 5;
        }
        return this;
    }
}