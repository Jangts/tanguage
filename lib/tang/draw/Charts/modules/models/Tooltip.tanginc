/*!
 * tanguage framework source code
 *
 * extend_static_methods draw/Charts/components/Tooltip
 *
 * Date: 2015-09-04
 */
;
class Tooltip extends draw.Charts.Component {
    draw() {

        var ctx = this.ctx;

        ctx.font = draw.canvas.fontString(this.fontSize, this.fontStyle, this.fontFamily);

        this.xAlign = "center";
        this.yAlign = "above";

        //Distance between the actual element.y position and the start of the tooltip caret
        var caretPadding = this.caretPadding = 2;

        var tooltipWidth = ctx.measureText(this.text).width + 2 * this.xPadding,
            tooltipRectHeight = this.fontSize + 2 * this.yPadding,
            tooltipHeight = tooltipRectHeight + this.caretHeight + caretPadding;

        if (this.x + tooltipWidth / 2 > this.chart.width) {
            this.xAlign = "left";
        } else if (this.x - tooltipWidth / 2 < 0) {
            this.xAlign = "right";
        }

        if (this.y - tooltipHeight < 0) {
            this.yAlign = "below";
        }

        var tooltipX = this.x - tooltipWidth / 2,
            tooltipY = this.y - tooltipHeight;

        ctx.globalAlpha = 0.75;
        ctx.fillStyle = this.fillColor;

        // Custom Tooltips
        if (this.custom) {
            ctx.globalAlpha = 1;
            this.custom(this);
        } else {
            switch (this.yAlign) {
                case "above":
                    //Draw a caret above the x/y
                    draw.canvas.line(ctx, this.x, this.y - caretPadding, this.x + this.caretHeight, this.y - (caretPadding + this.caretHeight), false, false, ()=>{
                        draw.canvas.to(ctx, this.x - this.caretHeight, this.y - (caretPadding + this.caretHeight), 1);
                    });
                    ctx.fill();
                    break;
                case "below":
                    tooltipY = this.y + caretPadding + this.caretHeight;
                    //Draw a caret below the x/y
                    ctx.fill();
                    draw.canvas.line(ctx, this.x, this.y + caretPadding, this.x + this.caretHeight, this.y + caretPadding + this.caretHeight, false, false, ()=>{
                        draw.canvas.to(ctx, this.x - this.caretHeight, this.y + caretPadding + this.caretHeight, 1);
                    });
                    ctx.fill();
                    break;
            }

            switch (this.xAlign) {
                case "left":
                    tooltipX = this.x - tooltipWidth + (this.cornerRadius + this.caretHeight);
                    break;
                case "right":
                    tooltipX = this.x - (this.cornerRadius + this.caretHeight);
                    break;
            }

            draw.canvas.drawRoundedRectangle(ctx, tooltipX, tooltipY, tooltipWidth, tooltipRectHeight, this.cornerRadius);

            ctx.fill();
            ctx.globalAlpha = 1;

            ctx.fillStyle = this.textColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.text, tooltipX + tooltipWidth / 2, tooltipY + tooltipRectHeight / 2);
        }
    }
}