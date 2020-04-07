import Taro from "@tarojs/taro";
import { WebView } from "@tarojs/components";
import { getCurrentChannelEventHash, resetChannelHash } from './WebviewHashChannelData';
import { unpackUrl } from '../../src/core/UrlHelper';

const DEFAULT_WEB_PATH = 'https://xxx.x.com/xxx';// to 参数默认的域名前缀
/**
 * 小程序Page页面
 * @param to 要跳转的h5页面地址 e.g:/xxx/xxx or 完整地址 https://xxx....
 * @param title 要跳转的h5页面标题
 */
export default class H5WebView extends Taro.Component {
  config = {
    navigationBarTitleText: " "
  };

  state = {
    url: "", // url不支持Hash
    hash: ""
  };

  isBack = false;
  componentWillMount() {
    this.isBack = false;
    const to = decodeURIComponent(this.$router.params.to || "");
    const urlObj = unpackUrl(to);
    let url = urlObj.pathWithSearch;
    let hash = urlObj.hash;
    let title = this.$router.params.title;
    if (title) {
      title = decodeURIComponent(title);
      Taro.setNavigationBarTitle({ title: title });
    }
    this.setState({
      url,
      hash
    });
    console.log("[H5WebView] mount", url, hash);
  }

  componentDidShow() {// onShow
    if (this.isBack) {
      // 小程序页面回退，通知h5
      let channelEventHash = getCurrentChannelEventHash();
      // if (!channelEventHash) {// TODO 仅白名单的页面增加backPush 通过postMessage??
      //     channelEventHash = getBackEventHash();// 通知游戏，上层的Page 移走了
      // }
      this.setState({
        hash: channelEventHash
      });
      // 通知完毕 重置
      resetChannelHash();
      console.log("[H5WebView] show set hash", channelEventHash, this.state.url);
    } else {
      console.log("[H5WebView] show first");
    }
    this.isBack = true;
  }

  _normalizeTo() {
    let to = this.state.url;
    if (!to) {
      return null;
    }
    if (to.substr(0, 4) !== "http") {
      to = DEFAULT_WEB_PATH + to;
    }
    if (this.state.hash) {
      to += "#" + this.state.hash;
    }
    return to;
  }

  render() {
    let to = this._normalizeTo();
    if (!to) {
      return null;
    }
    return (
      <WebView src={to}/>
    );
  }
}
