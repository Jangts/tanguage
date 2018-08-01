restoreStrings(string, last) {
    let that = this;
    if (last) {
        var pattern = this.lastPattern;
    } else {
        var pattern = this.trimPattern;
    }
    return string.replace(pattern, function () {
        if (arguments[5]) {
            return that.readBuffer(arguments[5]);
        }
        return that.readBuffer(arguments[2] || arguments[4]);
    }).replace(this.markPattern, function () {
        return that.readBuffer(arguments[1]);
    }).replace(/(@\d+L\d+P\d+O?\d*:::)/g, '');
}
decode(string) {
    string = string.replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
    let matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
    while (matches) {
        // console.log(matches, this.replacements[matches[2]]);
        string = string.replace(matches[0], this.readBuffer(matches[2])).replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
        matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
    }
    matches = string.match(/@boundary_(\d+)_as_[a-z]+::/);
    while (matches) {
        // console.log(matches, this.replacements[matches[2]]);
        string = string.replace(matches[0], thisreadBuffer(matches[1])).replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
        matches = string.match(/@boundary_(\d+)_as_[a-z]+::/);
    }
    matches = undefined;
    // console.log(string);
    return string.replace(/(@\d+L\d+P\d+O?\d*:::)/g, '');
}