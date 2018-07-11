/*!
 * tanguage framework source code
 * Date: 2015-09-04
 */
;
tang.init().block([
    '$_/obj/',
    '$_/draw/Charts/Charts',
    '$_/draw/Charts/util/helpers',
    '$_/draw/Charts/util/events',
    '$_/draw/Charts/util/defaults'
], function(pandora, root, imports, undefined) {
    var _ = pandora,
        declare = pandora.declareClass,

        doc = root.document,
        console = root.console;

    var helpers = _.draw.Charts.util.helpers,
        events = _.draw.Charts.util.events,
        anim = undefined,
        getMaximumWidth = function(domNode) {
            return _.dom.getSize(domNode, 'max').width;
        };
    declare('draw.Charts.types.Abstract', {
        _init: function(options, charts, zIndex) {
            this.instance = charts;
            this.ctx = charts.getLayer(zIndex).getContext("2d");
            this.initialize(options);
        },
        initialize: function() {
            return this;
        },
        reflow: helpers.noop,
        generateLegend: function() {
            return helpers.template(this.options.legendTemplate, {
                datasets: this.datasets
            });
        },
        destroy: function() {
            this.stop();
            this.clear();
            unbindEvents(this, this.events);
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
        },
        toBase64Image: function() {
            return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);
        }
    });
});