/*!
 * tanguage framework source code
 *
 * class draw/Charts/Element
 *
 * Date: 2015-09-04
 */
;
class Component {
    _init (configuration) {
        _.extend(this, true, configuration);
        this.initialize.apply(this, arguments);
        this.save();
    }
    
    initialize () {}
    
    restore (props) {
        if (!props) {
            _.extend(this, true, this._saved);
        } else {
            each(props as index, key) {
                clog key, this._saved[key], this[key], this._saved[key] || this[key];
                // /if(this._saved[key]!== undefined){
                    this[key] = this._saved[key] || this[key];
                // }
                // clog this;
            }
        }
        return this;
    }
    
    save () {
        this._saved = _.obj.clone(this);
        delete this._saved._saved;
        return this;
    }
    
    update (newProps) {
        each(newProps as key, value) {
            this._saved[key] = this[key];
            this[key] = value;
        }
        return this;
    }
    
    transition (props, ease) {
        each(props as key, value) {
            this[key] = ((value - this._saved[key]) * ease) + this._saved[key];
        }
        return this;
    }
    
    tooltipPosition () {
        return {
            x: this.x,
            y: this.y
        };
    }
    
    hasValue () {
        return util.isNumber(this.value);
    }
}