class Route {
    uid;
    type = 'path';
    callbacks = [];

    _init (configuration) {
        _.extend(this, true, configuration);
        this.callbacks = [];
    }

    oncall (callback) {
        if(isFn(callback)){
            this.callbacks.push();
        }
        return this;
    }

    call (path) {
        if(path===this.uid){
            each (this.callbacks as index, callback) {
                callback({
                    $path: path
                });
            }
        }
    }
}
