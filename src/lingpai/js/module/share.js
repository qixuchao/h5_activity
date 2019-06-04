define(function(require, exports, module) {
  // var env = require("module/env")
  var jskit = require("jskit")
  var $ = require("$");
  require("qttBridge")
  var utils = require('module/utils')
  var QApp = require("QApp")
  var title = $("[name=\"share-title\"]").attr('content')
  var desc = $("[name=\"share-desc\"]").attr('content')
  var url = $("[name=\"share-url\"]").attr('content')
  var imgUrl = $("[name=\"share-imgUrl\"]").attr('content')
  var openUrl = $("[name=\"open-url\"]").attr('content')

  exports.qttShareParams = {
    title: title,
    desc: desc,
    url:utils.addParam(url, { env: 'qtt'}),
    target: 1, // 1 微信 3 QQ
    type: "URL",
    icon: imgUrl,
    pics: [],
    wayType: "sys", // 分享方式： sys 系统
    appid: "appid1"
  }

  exports.quickShareParams = {
    pkg: 'com.fancy.simple',
    path: '/share',
    page_title: title,
    url: openUrl, // 快应用打开的页面
    title: title,
    summary: desc,
    imagePath: imgUrl,
    targetUrl: utils.addParam(url, { env: 'qApp'}), // 分享的页面
  }

  exports.wechatShareParams = {
    title: title, // 分享标题
    desc: desc, // 分享描述
    link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: imgUrl, // 分享图标设置成功
  }

  exports.initShare = function(params){
    'use strict';
    if(jskit.isWechat){
      jskit.openShare(Object.assign(exports.wechatShareParams, params), true);
    } else if (jskit.isAndroid && QTTB.isQTT ) {
      exports.quickShareParams.imagePath = params.imgUrl || imgUrl
      exports.quickShareParams.summary = params.desc || desc
      exports.quickShareParams.targetUrl = params.url || url
      exports.quickShareParams.url = params.openUrl || openUrl
      exports.quickShareParams.page_title = params.title || title
      exports.quickShareParams.title = params.title || title
      QApp.openQuickApp(exports.quickShareParams);
    }
  }

  /**
   *
   * @param params
   *  params.title     分享的标题
   *  params.desc      分享的描述
   *  params.url       分享的链接
   *  params.openUrl 针对快应用打开的页面与分享的链接不一致(这是快应用打开的页面链接)
   *  params.imgUrl    分享的图标
   */
  exports.open = function(params){
    if(jskit.isWechat){
      jskit.openShare(Object.assign(exports.wechatShareParams, params), false);
    } else if(QApp.isQuickApp){
      exports.quickShareParams.imagePath = params.imgUrl || imgUrl
      exports.quickShareParams.summary = params.desc || desc
      exports.quickShareParams.targetUrl = params.url || url
      exports.quickShareParams.url = params.openUrl || openUrl
      exports.quickShareParams.page_title = params.title || title
      exports.quickShareParams.title = params.title || title
      exports.quickShareParams.auto_share = 1
      QApp.openShare(exports.quickShareParams)
    } else if(QTTB.isQTT && QTTB.isQukan){
      exports.qttShareParams.icon = params.imgUrl || imgUrl
      QTTB.share(Object.assign(exports.qttShareParams, params))
    } else {
      $('.share-modal').show()
    }
  }

})
