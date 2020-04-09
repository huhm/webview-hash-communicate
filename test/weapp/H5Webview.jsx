import Taro from '@tarojs/taro'
import { WebView } from '@tarojs/components'
import {
  getCurrentChannelEventHash,
  resetChannelHash,
} from './WebViewHashChannelData'
import { unpackUrl,packUrl } from '../../src/core/UrlHelper'

const DEFAULT_WEB_PATH = 'https://xxx.x.com/xxx' // to 参数默认的域名前缀
/**
 * 小程序Page页面
 * @param to 要跳转的h5页面地址 e.g:/xxx/xxx or 完整地址 https://xxx....
 * @param title 要跳转的h5页面标题
 */
export default class H5WebView extends Taro.Component {
  config = {
    navigationBarTitleText: ' ',
  }

  state = {
    url: '', // url不支持Hash
    hash: '',
  }

  isBack = false

  shareOption = {
    title: null,
    path: null,
  }

  componentWillMount() {
    this.isBack = false
    const to = decodeURIComponent(this.$router.params.to || '')
    const urlObj = unpackUrl(to)
    let url = urlObj.pathWithSearch
    let hash = urlObj.hash
    let title = this.$router.params.title
    if (title) {
      title = decodeURIComponent(title)
      Taro.setNavigationBarTitle({ title: title })
    }
    this.setState({
      url,
      hash,
    })
    console.log('[H5WebView] mount', url, hash)
  }

  componentDidShow() {
    // onShow
    if (this.isBack) {
      // 小程序页面回退，通知h5
      let channelEventHash = getCurrentChannelEventHash()
      // if (!channelEventHash) {// TODO 仅白名单的页面增加backPush 通过postMessage??
      //     channelEventHash = getBackEventHash();// 通知游戏，上层的Page 移走了
      // }
      this.setState({
        hash: channelEventHash,
      })
      // 通知完毕 重置
      resetChannelHash()
      console.log('[H5WebView] show set hash', channelEventHash, this.state.url)
    } else {
      console.log('[H5WebView] show first')
    }
    this.isBack = true
  }
 
  _getLastData(itemList, type) {
    if (!itemList || itemList.length === 0) {
      return null
    }
    let lastIdx = itemList.length - 1
    while (lastIdx >= 0) {
      let item = itemList[lastIdx]
      if (item && item.type === type) {
        return item
      }
    }
  }
  handleMessage(e) {
    let { data } = e.detail
    // 设置最后一条share
    let shareOption = this._getLastData(data, 'setShareOption')
    if (shareOption) {
      this.shareOption = {
        title: shareOption.title,
        imageUrl: shareOption.imageUrl,
        path: shareOption.path,
      }
    }
    console.log('withWV handleMessage', data)
  }

  /**
   * 支持分享消息
   */
  onShareAppMessage() {
    if (this.shareOption) {
      let path = null
      if (this.shareOption.path) {
        path = packUrl(this.$router.path, {
          to: this.shareOption.path,
          title: this.shareOption.title,
        })
      }
      return {
        title: this.shareOption.title,
        path,
        imageUrl: this.shareOption.imageUrl,
      }
    }
  }

  onWebViewLoad(e) {
    console.log('withWV onWebViewLoad', e.detail.src, this.state.hash)
    this.shareOption.path = e.detail.src //默认分享页面为当前页面
  }

  _normalizeTo() {
    let to = this.state.url
    if (!to) {
      return null
    }
    if (to.substr(0, 4) !== 'http') {
      to = DEFAULT_WEB_PATH + to
    }
    if (this.state.hash) {
      to += '#' + this.state.hash
    }
    return to
  }

  render() {
    let to = this._normalizeTo()
    if (!to) {
      return null
    }
    return (
      <WebView
        src={to}
        onMessage={this.handleMessage}
        onLoad={this.onWebViewLoad}
      />
    )
  }
}
