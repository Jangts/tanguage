build(options) {
    options = options || {};
    if (_.byCn('ib-photo-actor', this.Element)[0]) {
        this.Actor = _.byCn('ib-photo-actor', this.Element)[0];
        var size = _.dom.getSize(this.Actor);
        this.ActorWidth = size.width;
        this.ActorHeight = size.height;

    } else {
        var size = options.maxSize || _.dom.getSize(this.Element);
        this.Actor = _.dom.create('div', this.Element, {
            className: 'ib-photo-actor',
            style: size
        });
    };
    this.ActorWidth = size.width;
    this.ActorHeight = size.height;
    this.Picture = _.byCn('ib-photo-image', this.Actor)[0] || _.dom.create('img', this.Actor, {
        className: 'ib-photo-image',
        style: {
            position: 'absolute',
            width: this.ActorWidth,
            height: this.ActorHeight,
            left: 0,
            top: 0
        }
    });
    this.Notice = _.byCn('ib-photo-notice', this.Actor)[0] || _.dom.create('div', this.Actor, {
        className: 'ib-photo-notice',
        style: {
            position: 'absolute',
            width: this.ActorWidth / 2,
            height: 30,
            left: this.ActorWidth / 4,
            top: this.ActorHeight / 2,
            marginTop: -15,
            background: '#000',
            color: '#FFF',
            textAlign: 'center',
            overflow: 'hidden',
            opacity: .8,
            display: 'none',
            lineHeight: 30
        }
    });
    this.ratio = this.ActorWidth / this.ActorHeight;
    this.AnimTrans = options.AnimTrans;
    this.duration = options.duration || 500;
    this.trigger = options.trigger || 'none';
    this.defaultImage = options.defaultImage;
    this.Nav = query('.ib-photo-nav ul', this.Element)[0];
    if (this.Nav) this.thumbNum = options.thumbNum || 10;
    this.bind();
}