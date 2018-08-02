/*!
 * tanguage framework source code
 *
 * extend_static_methods draw/Charts/components/MultiTooltip
 *
 * Date: 2015-09-04
 */
;
class Animation {
    curFrame = null
    // default number of steps
    fps = 36

    // the easing to use for this animation
    easing = ""

    // render function used by the animation service
    render = null

    // user specified callback to fire on each step of the animation
    onAnimationProgress = null

    // user specified callback to fire when the animation finishes
    onAnimationComplete = null

    // calls startDigest with the proper context
    digestWrapper () {
        this.startDigest();
    }

    startDigest () {
        var startTime = Date.now();
        var framesToDrop = 0;

        if (this.dropFrames > 1) {
            framesToDrop = Math.floor(this.dropFrames);
            this.dropFrames -= framesToDrop;
        }

        for (var i = 0; i < animations.length; i++) {
            if (animations[i].animationObject.curFrame === null) {
                animations[i].animationObject.curFrame = 0;
            }

            animations[i].animationObject.curFrame += 1 + framesToDrop;
            if (animations[i].animationObject.curFrame > animations[i].animationObject.frames) {
                animations[i].animationObject.curFrame = animations[i].animationObject.frames;
            }

            animations[i].animationObject.render(animations[i].chartInstance, animations[i].animationObject);

            // Check if executed the last frame.
            if (animations[i].animationObject.curFrame == animations[i].animationObject.frames) {
                // Call onAnimationComplete
                animations[i].animationObject.onAnimationComplete.call(animations[i].chartInstance);
                // Remove the animation.
                animations.splice(i, 1);
                // Keep the index in place to offset the splice
                i--;
            }
        }

        var endTime = Date.now();
        var delay = endTime - startTime - this.frameDuration;
        var frameDelay = delay / this.frameDuration;

        if (frameDelay > 1) {
            this.dropFrames += frameDelay;
        }

        // Do we have more stuff to animate?
        var that = this;
        if (animations.length > 0) {
            requestAnimFrame(() {
                that.digestWrapper();
            }, this.fps);
        }
    }
}