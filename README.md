# webview-hash-communicate

## webview事件通信示例

用于小程序推送事件给webview
如支付成功后，推送支付事件给webview中的页面


H5端使用方式（见test/h5/index.ts）:

``` ts
// 初始化
WebViewHashPushChannel.getInstance();

// 监听事件推送
WebViewHashPushChannel.getInstance().once(CHANNEL_EVENT_TYPE.PAY, (res: {
    code: String,
    data?:String, 
    msg?:String
}) => {
    console.log('收到pay推送', data);
    // do something
})
```

微信小程序使用方式（见test/weapp/H5Webview.jsx）