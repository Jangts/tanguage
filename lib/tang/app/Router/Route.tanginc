class Route {
    uid;
    type = 'path';
    events = [];

    _init (configuration) {
        ..extend(this, true, configuration);
        this.events = [];
    }

    oncall (callback, data) {
        if(isFn(callback)){
            this.events.push({callback, data});
        }
        return this;
    }

    call (path) {
        if(path===this.uid){
            each (this.events as index, event) {
                event.callback({
                    $path: path
                }, event.data);
            }
        }
    }
}
