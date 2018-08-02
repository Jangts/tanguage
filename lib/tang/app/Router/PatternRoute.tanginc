class PatternRoute extends Route {
    pattern;
    params = [];

    call (path) {
        if(match = path.match(this.pattern)){
            let args = {};
            for (let i=0; i < match.length; i++) {
                args[this.params[i]] = match[i]
            }
            each (this.callbacks as index, callback) {
                callback(args);
            }
        }
    }
}