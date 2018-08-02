/*!
 * tanguage framework source code
 *
 * extend_static_methods draw/Charts/util
 *
 * Date: 2015-09-04
 */
;
let hovers = {};
public getRelativePosition = (evt) {
    var mouseX, mouseY;
    var e = evt.originalEvent || evt,
        canvas = evt.currentTarget || evt.srcElement,
        boundingRect = canvas.getBoundingClientRect();

    if (e.touches) {
        mouseX = e.touches[0].clientX - boundingRect.left;
        mouseY = e.touches[0].clientY - boundingRect.top;

    } else {
        mouseX = e.clientX - boundingRect.left;
        mouseY = e.clientY - boundingRect.top;
    }

    return {
        x: mouseX,
        y: mouseY
    };
},
bindEvents = (instance, arrayOfEvents, handler) {
    // Create the events object if it's not already present
    if (!instance.events) {
        instance.events = {};
    }
    each(arrayOfEvents as index, eventName) {
        instance.events[eventName] = () {
            // clog arguments;
            handler.apply(instance, arguments);
        };
        dom.events.add(instance.HTMLElement, eventName, null, null, instance.events[eventName]);
    }
},
unbindEvents = (instance, arrayOfEvents) {
    each(arrayOfEvents as eventName, handler) {
        dom.removeEvents(instance.HTMLElement, eventName, null, handler);
    }
},
bindHover = (instance, callback) {
    if (!hovers[instance.id]) {
        hovers[instance.id] = {
            eventTypes: arr.merge(instance.options.tooltip.triggerOn, instance.options.tooltip.triggerOff),
            exceptEventTypes: instance.options.tooltip.triggerOff,
            trigger(evt) {
                // clog evt, arguments;
                if (hovers[instance.id].exceptEventTypes.indexOf(evt.type) < 0) {
                    _.each(hovers[instance.id].handlers, function(i, handler) {
                        handler(evt);
                    });
                } else {
                    if (instance.options.tooltip.show) {
                        instance.showTooltip([]);
                    }
                }
            },
            handlers: [(evt) {
                instance.actived = 0;
            }]
        };
        bindEvents(instance, hovers[instance.id].eventTypes, hovers[instance.id].trigger);
    } else {
        if (typeof callback === 'function') {
            hovers[instance.id].handlers.push(function(evt) {
                if (instance.actived == 0) {
                    callback.call(instance, evt);
                }
            });
        }
    }
}