import { unpackUrlSearch } from "../core/UrlHelper";
import Event from "../core/Event"; 

const HASH_EVENT_TAG = '_isweapppush';
/**
 * 和webview的hash通信工具类
 * 注: 进行跳转前一定要先初始化
 */
export default class WebViewHashPushChannel extends Event{
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
        console.log('开始监听hashchange');
        window.addEventListener("hashchange",this.onHashChange.bind(this));
    }

    private dealHashEvent() { 
        let hash = location.hash;
        console.log('收到Hash通知', hash);
        if (!hash) {
            return;
        }
        if (hash) {
            hash = hash.substr(1);// remove #
        }
        let queryObj = unpackUrlSearch(hash);
        if (!queryObj.type) {
            return;
        }
        this.emit(queryObj.type, queryObj);
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