/*!
 * tanguage framework source code
 *
 * class app.Scrollbar.Abstract
 *
 * Date 2017-04-06
 */
;
class Abstract {
    disabled = false;
    protect = true;
    HTMLElement;
    document;
    vertical;
    horizontal;
    buttonUp;
    buttonRight;
    buttonDown;
    buttonLeft;
    horizontalRail;
    horizontalDragger;
    verticalRail;
    verticalDragger;

    resize () {
        if (this.HTMLElement) {
            this.document = this.document || this.HTMLElement;
            this.amount();
        }
        return this;
    }

    amount () {
        //Horizontal
        if (this.horizontal) {
            this.WinWidth = parseInt(getStyle(this.HTMLElement, 'width'));
            this.DocWidth = getSize(this.document, 'box').width;
            this.documentLeft = this.style(this.document, 'left', getStyle(this.document, 'left') || 0);
            if (this.buttonLeft && this.buttonRight) {
                this.RailWidth = this.style(this.horizontalRail, 'width', this.WinWidth - parseInt(getStyle(this.buttonLeft, 'width')) - parseInt(getStyle(this.buttonRight, 'width')));
            } else {
                this.RailWidth = this.style(this.horizontalRail, 'width', this.WinWidth);
            }
            this.DragWidth = this.style(this.horizontalDragger, 'width', parseInt(getStyle(this.horizontalRail, 'width')) * this.WinWidth / this.DocWidth);
            this.LeftMin = this.WinWidth - this.DocWidth;
            this.DraggerLeft = this.style(this.horizontalDragger, 'left', Math.abs(this.documentLeft / this.DocWidth * this.RailWidth));
            this.DraggerLeftMax = this.RailWidth - this.DragWidth;
            if (this.RailWidth <= this.DragWidth) {
                this.horizontalActived = false;
                this.toLeft();
                setStyle(this.horizontal, 'display', 'none');
            } else {
                this.horizontalActived = true;
                setStyle(this.horizontal, 'display', 'block');
            }
        } else {
            this.horizontalActived = false;
        }

        //Vertical
        if (this.vertical) {
            this.WinHeight = parseInt(getStyle(this.HTMLElement, 'height'));
            this.DocHeight = getSize(this.document, 'box').height;
            this.documentTop = this.style(this.document, 'top', parseInt(getStyle(this.document, 'top')) || 0);
            if (this.buttonUp && this.buttonDown) {
                this.RailHeight = this.style(this.verticalRail, 'height', this.WinHeight - parseInt(getStyle(this.buttonUp, 'height')) - parseInt(getStyle(this.buttonDown, 'height')));
            } else {
                this.RailHeight = this.style(this.verticalRail, 'height', this.WinHeight);
            }
            this.DragHeight = this.style(this.verticalDragger, 'height', parseInt(getStyle(this.verticalRail, 'height')) * this.WinHeight / this.DocHeight);
            this.TopMin = this.WinHeight - this.DocHeight;
            this.DraggerTop = this.style(this.verticalDragger, 'top', Math.abs(this.documentTop / this.DocHeight * this.RailHeight));
            this.DraggerTopMax = this.RailHeight - this.DragHeight;
            if (this.RailHeight <= this.DragHeight) {
                this.verticalActived = false;
                this.toTop();
                setStyle(this.vertical, 'display', 'none');
            } else {
                this.verticalActived = true;
                setStyle(this.vertical, 'display', 'block');
            }
        } else {
            this.verticalActived = false;
        }
        return this;
    }

    toTop () {
        this.documentTop = this.style(this.document, 'top', 0);
        this.DraggerTop = this.style(this.verticalDragger, 'top', 0);
        return this;
    }

    toBottom () {
        this.documentTop = this.style(this.document, 'top', this.WinHeight - this.DocHeight < 0 ? this.WinHeight - this.DocHeight : 0);
        this.DraggerTop = this.style(this.verticalDragger, 'top', Math.abs(this.documentTop / this.DocHeight * this.RailHeight));
        return this;
    }

    toLeft () {
        this.documentLeft = this.style(this.document, 'left', 0);
        this.DraggerLeft = this.style(this.horizontalDragger, 'left', 0);
        return this;
    }

    toRight () {
        this.documentLeft = this.style(this.document, 'left', this.WinWidth - this.DocWidth < 0 ? this.WinWidth - this.DocWidth : 0);
        this.DraggerLeft = this.style(this.horizontalDragger, 'left', Math.abs(this.documentLeft / this.DocWidth * this.RailWidth));
        return this;
    }

    style (elem, prop, val) {
        setStyle(elem, prop, val);
        return val;
    }

    @include 'events/bind';
    @include 'events/mousewheel';
    @include 'events/mousemove';
}