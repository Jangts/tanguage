/*!
 * tanguage framework source code
 * Date: 2015-09-04
 */
;
class Type {
    _init(options, charts, zIndex) {
        this.instance = charts;
        this.ctx = charts.getLayer(zIndex).getContext("2d");
        this.initialize(options);
    }
    
    initialize() {
        return this;
    }
    
    reflow: helpers.noop
    
    generateLegend() {
        return helpers.template(this.options.legendTemplate, {
            datasets: this.datasets
        });
    }
    
    destroy() {
        this.stop();
        this.clear();
        helpers.unbindEvents(this, this.events);
        var canvas = this.chart.canvas;

        // Reset canvas height/width attributes starts a fresh with the canvas context
        canvas.width = this.chart.width;
        canvas.height = this.chart.height;

        // < IE9 doesn't support removeProperty
        if (canvas.style.removeProperty) {
            canvas.style.removeProperty('width');
            canvas.style.removeProperty('height');
        } else {
            canvas.style.removeAttribute('width');
            canvas.style.removeAttribute('height');
        }

        delete _.draw.Charts.instances[this.id];
    }

    toBase64Image() {
        return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);
    }
}