restoreStrings(string, last) {
    let that = this;
    if (last) {
        var pattern = this.lastPattern;
    } else {
        var pattern = this.trimPattern;
    }
    return string.replace(pattern, function () {
        if (arguments[5]) {
            return that.replacements[arguments[5]][0].toString();
        }
        return that.replacements[arguments[2] || arguments[4]][0].toString();
    }).replace(this.markPattern, function () {
        return that.replacements[arguments[1]][0].toString();
    }).replace(/(@\d+L\d+P\d+O?\d*:::)/g, '');
}
decode(string) {
    string = string.replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
    let matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
    while (matches) {
        // console.log(matches, this.replacements[matches[2]]);
        string = string.replace(matches[0], this.replacements[matches[2]][0].toString()).replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
        matches = string.match(/___boundary_([A-Z0-9_]{37})?(\d+)_as_[a-z]+___/);
    }
    matches = string.match(/@boundary_(\d+)_as_[a-z]+::/);
    while (matches) {
        // console.log(matches, this.replacements[matches[2]]);
        string = string.replace(matches[0], this.replacements[matches[1]][0].toString()).replace(/@\d+L\d+P\d+(O\d+)?:*/g, '');
        matches = string.match(/@boundary_(\d+)_as_[a-z]+::/);
    }
    matches = undefined;
    // console.log(string);
    return string.replace(/(@\d+L\d+P\d+O?\d*:::)/g, '');
}