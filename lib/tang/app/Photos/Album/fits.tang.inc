fit(origin) {
    origin.onload = origin.onerror = null;
    this.Notice.style.display = 'none';
    var ratio = origin.width / origin.height;
    if (ratio > this.ratio) {
        var width = origin.width < this.ActorWidth ? origin.width : this.ActorWidth;
        var height = width * ratio;
    } else {
        var height = origin.height < this.ActorHeight ? origin.height : this.ActorHeight;
        var width = height * ratio;
    }
    var left = (this.ActorWidth - width) / 2;
    var top = (this.ActorHeight - height) / 2;
    if (this.AnimTrans) {
        _.dom.stop(this.Picture, true);
        _.dom.play(this.Picture, {
            width: width,
            height: height,
            left: left,
            top: top
        }, this.duration);
    } else {
        _.dom.setStyle(this.Picture, {
            width: width,
            height: height,
            left: left,
            top: top
        });
    }
}

fitNav() {
    if (this.Nav) {
        each(query('li', this.Nav) as li) {
            _.dom.removeClass(li, 'actived');
        }
        _.dom.addClass(query('[data-photo-num=' + this.cur + ']', this.Nav)[0], 'actived');
        var thumbWidth = _.dom.getWidth(query('.ib-photo-nav', this.Element)[0]) / this.thumbNum;
        var midNum = Math.ceil(this.thumbNum / 2) - 1;
        if (this.cur < midNum) {
            this.Nav.style.left = '0px';
        } else if (this.cur < this.length - this.thumbNum + midNum) {
            this.Nav.style.left = '-' + thumbWidth * (this.cur - midNum) + 'px';
        } else {
            this.Nav.style.left = '-' + thumbWidth * (this.length - this.thumbNum) + 'px';
        }
    }
}