/*!
 * tanguage script compiled code
 *
 * Datetime: Wed, 18 Jul 2018 07:00:18 GMT
 */;
// tang.config({});
tang.init().block([
    '$_/math/',
    '$_/draw/Charts/'
], function (pandora, root, imports, undefined) {
    var module = this.module;
    var draw = pandora.ns('draw', {});
    var math = imports['$_/math/'];
    var Charts = imports['$_/draw/charts/'];
    var _ = pandora;
    var doc = root.document;
    var console = root.console;
    var helpers = draw.Charts.helpers;
    var requestAnimFrame = helpers.requestAnimFrame, cancelAnimFrame = helpers.cancelAnimFrame;
    var animations = [];
    function findNextWhere (arrayToSearch, filterCallback, startIndex) {
        if (!startIndex) {
            startIndex =  -1;
        }
        for (var i = startIndex + 1;i < arrayToSearch.length;i++) {
            var currentItem = arrayToSearch[i];
            if (filterCallback(currentItem)) {
                return currentItem;
            }
        };
    }
    var Animation = pandora.declareClass({
        curFrame: null,
        fps: 36,
        easing: "",
        render: null,
        onAnimationProgress: null,
        onAnimationComplete: null,
        digestWrapper: function () {
            this.startDigest();
        },
        startDigest: function () {
            var startTime = Date.now();
            var framesToDrop = 0;
            if (this.dropFrames > 1) {
                framesToDrop = Math.floor(this.dropFrames);
                this.dropFrames -= framesToDrop;
            }
            for (var i = 0;i < animations.length;i++) {
                if (animations[i].animationObject.curFrame === null) {
                    animations[i].animationObject.curFrame = 0;
                }
                animations[i].animationObject.curFrame += 1 + framesToDrop;
                if (animations[i].animationObject.curFrame > animations[i].animationObject.frames) {
                    animations[i].animationObject.curFrame = animations[i].animationObject.frames;
                }
                animations[i].animationObject.render(animations[i].chartInstance, animations[i].animationObject);
                if (animations[i].animationObject.curFrame == animations[i].animationObject.frames) {
                    animations[i].animationObject.onAnimationComplete.call(animations[i].chartInstance);
                    animations.splice(i, 1);
                    i--;
                }
            }
            var endTime = Date.now();
            var delay = endTime - startTime - this.frameDuration;
            var frameDelay = delay/this.frameDuration;
            if (frameDelay > 1) {
                this.dropFrames += frameDelay;
            }
            var that = this;
            if (animations.length > 0) {
                requestAnimFrame(function () {
                    that.digestWrapper();
                }, this.fps);
            };
        }
    });
    pandora.extend(pandora.draw.Charts.prototype, true, {
        dropFrames: 0,
        addAnimation: function (duration) {
            var animationObject = new Animation();
            animationObject.animationDuration = duration || this.options.animationDuration || 1000;
            animationObject.frames = Math.ceil(animationObject.animationDuration * animationObject.fps/1000);
            animationObject.frameDuration = 1000/animationObject.fps;
            animationObject.easing = this.options.animationEasing;
            animationObject.render = function (instance, animation) {
                var easingFunction = math.easing.all[animation.easing];
                var stepDecimal = animation.curFrame/animation.frames;
                var easeDecimal = easingFunction(stepDecimal, 0, 1, 1);
                instance.draw(easeDecimal, stepDecimal, animation.curFrame);
            }
            animationObject.onAnimationProgress = this.options.onAnimationProgress;
            animationObject.onAnimationComplete = this.options.onAnimationComplete;
            for (var index = 0;index < animations.length;++index) {
                if (animations[index].chartInstance === this) {
                    animations[index].animationObject = animationObject;
                    return;
                }
            }
            animations.push({
                chartInstance: this,
                animationObject: animationObject
            });
            if (animations.length == 1) {
                requestAnimFrame(function () {
                    animationObject.digestWrapper();
                }, animationObject.fps);
            };
        },
        cancelAnimation: function () {
            var index = findNextWhere(animations, function (animationWrapper) {
                return animationWrapper.chartInstance === this;
            });
            if (index) {
                animations.splice(index, 1);
            };
        }
    });
    
});