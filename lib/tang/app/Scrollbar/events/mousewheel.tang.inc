mousemove(e) {
    if (!this.disabled) {
        if (this.verticalDraggerActived) {
            var moveY = event.y - this.verticalDragger.y;
            if (Math.abs(moveY) > 120) {
                if (this.DraggerTop + moveY >= 0 && this.DraggerTop + moveY <= this.DraggerTopMax) {
                    this.verticalDragger.y = event.y;
                    this.DraggerTop = this.style(this.verticalDragger, 'top', this.DraggerTop + moveY);
                } else if (this.DraggerTop + moveY < 0) {
                    this.verticalDragger.y = event.y + this.DraggerTop;
                    this.DraggerTop = this.style(this.verticalDragger, 'top', 0);
                } else if (this.DraggerTop + moveY > this.DraggerTopMax) {
                    this.verticalDragger.y = event.y + this.DraggerTop - this.DraggerTopMax;
                    this.DraggerTop = this.style(this.verticalDragger, 'top', this.DraggerTopMax);
                }
            }
            this.documentTop = this.style(this.document, 'top', Math.abs(this.DraggerTop / this.RailHeight * this.DocHeight) * -1);
        }
        if (this.horizontalDraggerActived) {
            var moveX = event.x - this.horizontalDragger.x;
            if (Math.abs(moveX) > 120) {
                if (this.DraggerLeft + moveX >= 0 && this.DraggerLeft + moveX <= this.DraggerLeftMax) {
                    this.horizontalDragger.x = event.x;
                    this.DraggerLeft = this.style(this.horizontalDragger, 'left', this.DraggerLeft + moveX);
                } else if (this.DraggerLeft + moveX < 0) {
                    this.horizontalDragger.x = event.x + this.DraggerLeft;
                    this.DraggerLeft = this.style(this.horizontalDragger, 'left', 0);
                } else if (this.DraggerLeft + moveX > this.DraggerLeftMax) {
                    this.horizontalDragger.x = event.x + this.DraggerLeft - this.DraggerLeftMax;
                    this.DraggerLeft = this.style(this.horizontalDragger, 'left', this.DraggerLeftMax);
                }
            }
            this.documentLeft = this.style(this.document, 'left', Math.abs(this.DraggerLeft / this.RailHeight * this.DocHeight) * -1);
        }
    }
}