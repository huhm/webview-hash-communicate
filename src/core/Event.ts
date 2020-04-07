
/*
 * 定义Event
 * 可链式访问
 * 支持on,once,off,emit
 */
export default class Event {
    private __handlers = {};
    constructor() {
        this.__handlers = {};
    }

    emit(event: string, ...restArgs: any[]) {
        this.__handlers = this.__handlers || {};
        // let args = [].slice.call(arguments, 1);
        let callbacks = this.__handlers[event];

        if (callbacks) {
            callbacks = callbacks.slice(0);
            for (let i = 0, len = callbacks.length; i < len; ++i) {
                callbacks[i].apply(this, restArgs);
            }
        }
        return this;
    }

    once(event: string, fn: Function) {
        let self = this;
        this.__handlers = this.__handlers || {};

        function on() {
            self.off(event, on);
            fn.apply(this, arguments);
        }

        on.fn = fn;
        this.on(event, on);
        return this;
    }
    on(event: string, fn: Function) {
        this.__handlers = this.__handlers || {};
        (this.__handlers[event] = this.__handlers[event] || []).push(fn);
        return this;
    }
    off(event?: string, fn?: Function) {
        this.__handlers = this.__handlers || {};
        // all 移除所有事件
        if (0 === arguments.length) {
            this.__handlers = {};
            return this;
        }

        // specific event
        let callbacks = this.__handlers[event];
        if (!callbacks) return this;

        // remove all handlers
        if (1 === arguments.length) {
            delete this.__handlers[event];
            return this;
        }

        // remove specific handler 只移除第一个
        let cb;
        for (let i = 0; i < callbacks.length; i++) {
            cb = callbacks[i];
            if (cb === fn || cb.fn === fn) {
                // on 或once
                callbacks.splice(i, 1);
                break;
            }
        }
        return this;
    }
};
