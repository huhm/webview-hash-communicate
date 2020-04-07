import WebViewHashPushChannel from '../../src/bridge/WebViewHashPushChannel';

import CHANNEL_EVENT_TYPE from '../constant/CHANNEL_EVENT_TYPE';


// 初始化
WebViewHashPushChannel.getInstance();

// 监听事件推送
WebViewHashPushChannel.getInstance().once(CHANNEL_EVENT_TYPE.PAY, (res: {
    code: String,
    data?:String, 
    msg?:String
}) => {
    console.log('收到pay推送', res);
    // do something
})