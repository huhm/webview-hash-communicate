

import { packUrlSearch } from "../../src/core/UrlHelper";
import CHANNEL_EVENT_TYPE from '../constant/CHANNEL_EVENT_TYPE';
//'?_iswebviewpush=时间戳&type=类型&其他参数&_t=xxx'


const CHANNEL_EVENT_NONE = '';
let channelEventHash = CHANNEL_EVENT_NONE;


function convertChannelEventHash(data) {
    // 保证_iswebviewpush位置,可以附加到原来的#xxx上
    return  `?_iswebviewpush=${new Date().getTime()}&`+packUrlSearch(data,'');
    // return packUrlSearch({
    //     ...data,
    //     _iswebviewpush:new Date().getTime()
    // });
}

function setChannelEventHash(data) {
    channelEventHash = convertChannelEventHash(data);
}


//#region 支付页面示例
/**
 在页面onShow|componentDidMount 中调用
emitPayStart();

在支付成功后调用,参数为购买成功的数量
emitPayOk(40)

在支付失败后调用:
emitPayFail(msg)
 */


export function emitPayStart() {
    // channelEventHash = CHANNEL_EVENT_NONE;
    emitPayFail('用户未购买');// 初始化状态为用户未购买（关闭后通知webview）
}

/**
 *
 * @param {*} buyItemCount 购买成功的数量
 */
export function emitPayOk(buyItemCount) {
    setChannelEventHash({
        type: CHANNEL_EVENT_TYPE.PAY,
        code: '0',
        data: buyItemCount
    })
}

export function emitPayFail(msg) {
    setChannelEventHash({
        type: CHANNEL_EVENT_TYPE.PAY,
        code: '1',
        msg: msg
    });
}
//#endregion


export function getCurrentChannelEventHash() {
    return channelEventHash;
}
export function getBackEventHash() {
    return convertChannelEventHash({ type: CHANNEL_EVENT_TYPE.BACK });
}

export function resetChannelHash() {
    channelEventHash = CHANNEL_EVENT_NONE;
}
