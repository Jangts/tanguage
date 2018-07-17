bind () {
    var that = this;
    var _mousewheel = doc.onmousewheel;
    new Events(this.Element)
        .push('resize', null, null, () {
            that.resize;
        })
        .push('mousewheel', null, null, (event) {
            var elem = event.target;
            if (that.protect) {
                doc.onmousewheel = (event) {
                    return false;
                };
            }
            that.mousewheel.call(that, event);
        })
        .push('mouseout', null, null, () {
            doc.onmousewheel = _mousewheel;
        });
    if (this.vertical) {
        new Events(this.verticalDragger)
            .push('mousedown', null, null, () {
                doc.body.onselectstart = doc.body.ondrag = (event) {
                    return false;
                }
                that.verticalDraggerActived = true;
                this.y = event.y;
            });
        new Events(this.verticalRail)
            .push('click', null, null, (event) {
                that.DraggerTop = that.style(that.verticalDragger, 'top', Math.abs(event.offsetY / that.RailHeight * that.DraggerTopMax));
                that.documentTop = that.style(that.document, 'top', event.offsetY / that.RailHeight * that.TopMin);
            });
    }
    if (this.horizontal) {
        new Events(this.horizontalDragger)
            .push('mousedown', null, null, (event) {
                doc.body.onselectstart = doc.body.ondrag = () {
                    return false;
                }
                that.horizontalDraggerActived = true;
                this.x = event.x;
            });
        new Events(this.horizontal)
            .push('click', null, null, () {
                that.DraggerLeft = that.style(that.horizontalDragger, 'left', Math.abs(event.offsetX / that.RailWidth * that.DraggerLeftMax));
                that.documentLeft = that.style(that.document, 'left', event.offsetX / that.RailWidth * that.LeftMin);
            });
    }
    new Events(document)
        .push('mouseup', null, null, () {
            that.verticalDraggerActived = that.horizontalDraggerActived = doc.body.onselectstart = doc.body.ondrag = false;
        })
        .push('mousemove', null, null, (event) {
            that.mousemove.call(that, event)
        });
    return this;
}