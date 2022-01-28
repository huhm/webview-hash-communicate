import Event from "../core/Event";
import { unpackUrlSearch } from "../core/UrlHelper";

const HASH_EVENT_TAG = '?_iswebviewpush=';

type IWebViewHashPushChannelEventCb = {

  // [eventName: string]: { type: typeof eventName } & Record<string, unknown>,
  // 相关事件的返回定义（自行定义）
  'pay': {
    code: string,
    data?: string,
    msg?: string,
    type: string
  },
}
/**
 * 和webview的hash通信工具类
 * 注: 进行跳转前一定要先初始化
 */
export default class WebViewHashPushChannel extends Event<IWebViewHashPushChannelEventCb> {
  private static Instance: WebViewHashPushChannel;

  static getInstance() {
    if (!WebViewHashPushChannel.Instance) {
      WebViewHashPushChannel.Instance = new WebViewHashPushChannel();
    }
    return WebViewHashPushChannel.Instance;
  }

  private constructor() {
    super();
    this.init();
  }

  private isInited = false;
  private init() {
    if (this.isInited) {
      return;
    }
    this.isInited = true;
    // TODO:小程序支持该形式才做处理 if 平台判断
    console.log('start listen to hashchange');
    window.addEventListener("hashchange", this.onHashChange.bind(this));
  }

  private dealHashEvent() {
    let hash = location.hash;
    console.log('onHashChange', hash);
    if (!hash) {
      return;
    }
    if (hash) {
      hash = hash.substr(1);// remove #
    }
    const queryObj = unpackUrlSearch(hash);
    if (!queryObj.type) {
      return;
    }
    this.emit(queryObj.type as (keyof IWebViewHashPushChannelEventCb), queryObj as IWebViewHashPushChannelEventCb['pay']);
  }

  private isHashEvent() {
    return location.hash.indexOf(HASH_EVENT_TAG) > 0;
  }

  private onHashChange() {
    this.dealHashEvent();
    if (this.isHashEvent()) {// 事件推送，恢复堆栈
      history.back();
    }
  }
}