# webview-hash-communicate

## webview事件通信示例

[文章](https://juejin.im/post/5e8c31946fb9a03c585bf74c)

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

微信小程序使用方式（见test/weapp/H5Webview.jsx）,示例使用Taro写的微信小程序，可以使用原生方式

