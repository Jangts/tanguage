if (Array.prototype.includes == undefined) {
    Array.prototype.includes = function(searchElement, fromIndex) {
        fromIndex = parseInt(fromIndex) || 0;
        for (fromIndex; fromIndex < this.length; fromIndex++) {
            if (this[fromIndex] === searchElement) {
                return true;
            }
        }
        return false;
    }
}

let Buf;
if(typeof Buffer === 'function'){
    Buf = Buffer;
}else{
    Buf = function (string) {
        this.value = string;
    }
    Buf.prototype.toString = function () {
        return this.value;
    }
}