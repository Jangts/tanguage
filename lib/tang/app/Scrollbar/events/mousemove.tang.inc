mousewheel(event) {
    if (!this.disabled) {
        if (this.verticalActived) {
            var WinHeight = parseInt(getStyle(this.HTMLElement, 'height'));
            var DocHeight = getSize(this.document, 'box').height;
            if (WinHeight != this.WinHeight || DocHeight != this.DocHeight) {
                this.amount();
            }
            if (event.wheelDelta < 0) {
                if (parseInt(getStyle(this.document, 'top')) + event.wheelDelta > this.TopMin) {
                    if (this.documentTop + event.wheelDelta * 0.5 > this.TopMin) {
                        this.documentTop = this.style(this.document, 'top', this.documentTop + event.wheelDelta * 0.5);
                    } else {
                        this.documentTop = this.style(this.document, 'top', this.TopMin);
                    }
                } else if (parseInt(getStyle(this.document, 'top')) > this.TopMin) {
                    this.documentTop = this.style(this.document, 'top', this.TopMin);
                } else {
                    //doc.onmousewheel = null;
                }
            }
            if (event.wheelDelta > 0) {
                if (parseInt(getStyle(this.document, 'top')) + event.wheelDelta < 0) {
                    if (this.documentTop + event.wheelDelta * 0.5 < 0) {
                        this.documentTop = this.style(this.document, 'top', this.documentTop + event.wheelDelta * 0.5);
                    } else {
                        this.documentTop = this.style(this.document, 'top', 0);
                    }
                } else if (parseInt(getStyle(this.document, 'top')) < 0) {
                    this.documentTop = this.style(this.document, 'top', 0);
                } else {
                    //doc.onmousewheel = null;
                }
            }
            this.DraggerTop = this.style(this.verticalDragger, 'top', Math.abs(this.documentTop / this.DocHeight * this.RailHeight));
        } else if (this.horizontalActived) {
            var WinWidth = parseInt(getStyle(this.HTMLElement, 'width'));
            var DocWidth = getSize(this.document, 'box').width;
            if (WinWidth != this.WinWidth || DocWidth != this.DocWidth) {
                this.amount();
            }
            if (event.wheelDelta < 0) {
                if (parseInt(getStyle(this.document, 'left')) + event.wheelDelta > this.LeftMin) {
                    if (this.documentLeft + event.wheelDelta * 0.5 > this.LeftMin) {
                        this.documentLeft = this.style(this.document, 'left', this.documentLeft + event.wheelDelta * 0.5);
                    } else {
                        this.documentLeft = this.style(this.document, 'left', this.LeftMin);
                    }
                } else if (parseInt(getStyle(this.document, 'left')) > this.LeftMin) {
                    this.documentLeft = this.style(this.document, 'left', this.LeftMin);
                } else {
                    //doc.onmousewheel = null;
                }
            }
            if (event.wheelDelta > 0) {
                if (parseInt(getStyle(this.document, 'left')) + event.wheelDelta < 0) {
                    if (this.documentLeft + event.wheelDelta * 0.5 < 0) {
                        this.documentLeft = this.style(this.document, 'left', this.documentLeft + event.wheelDelta * 0.5);
                    } else {
                        this.documentLeft = this.style(this.document, 'left', 0);
                    }
                } else if (parseInt(getStyle(this.document, 'left')) < 0) {
                    this.documentLeft = this.style(this.document, 'left', 0);
                } else {
                    //doc.onmousewheel = null;
                }
            }
            this.DraggerLeft = this.style(this.horizontalDragger, 'left', Math.abs(this.documentLeft / this.DocWidth * this.RailWidth));
        }
    }
}