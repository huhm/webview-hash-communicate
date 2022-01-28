/*
 * 定义Event
 * 可链式访问
 * 支持on,once,off,emit
 */
export default class Event<T> {
  private __handlers: {
    [eventName in keyof T]?: ((value: T[eventName]) => void)[]
  } = {};
  constructor() {
    this.__handlers = {};
  }

  emit<K extends keyof T>(event: K, detail: T[K]) {
    this.__handlers = this.__handlers || {};
    // let args = [].slice.call(arguments, 1);
    let callbacks = this.__handlers[event];

    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (let i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].call(this, detail);
      }
    }
    return this;
  }

  once<K extends keyof T>(event: K, fn: (value: T[K]) => void) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.__handlers = this.__handlers || {};

    function on(detail: T[K]) {
      self.off(event, on);
      fn.call(self, detail);
    }

    on.fn = fn;
    this.on(event, on);
    return this;
  }
  on<K extends keyof T>(event: K, fn: (value: T[K]) => void) {
    this.__handlers = this.__handlers || {};
    const hList = this.__handlers[event] || [];
    (hList as unknown[]).push(fn);
    return this;
  }

  offAll() {
    // all 移除所有事件
    this.__handlers = {};
    return this;
  }

  off<K extends keyof T>(event: K, fn?: (value: T[K]) => void) {
    this.__handlers = this.__handlers || {};

    // specific event
    const callbacks = this.__handlers[event];
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (cb === fn || (cb as any).fn === fn) {
        // on 或once
        callbacks.splice(i, 1);
        break;
      }
    }
    return this;
  }
}
