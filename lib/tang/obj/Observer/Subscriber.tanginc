/*!
 * tanguage framework source code
 *
 * class obj.Observer.Subscriber
 *
 * Date 2017-04-06
 */
;

/**
 * 创建订阅器，用于联通obj.Observer实例和监听它属性的obj.Observer.Listener实例
 * 
 */
class Subscriber {
    _init() {
        this.listeners = [];
    },
    watch(listener) {
        this.listeners.push(listener);
    },
    notify(isWriting, silentlyWriting) {
        if (isWriting) {
            each(this.listeners as i,o) {
                this.onwrite(silentlyWriting);
            }
        } else {
            each(this.listeners as i,o) {
                this.onread();
            }
        }
    }
}