define(function(require, exports, module) {
  // var env = require("module/env")
  var jskit = require("jskit");
  var $ = require("$");
  require("qttBridge");
  var utils = require("module/utils");
  var QApp = require("QApp");

  var title = $('[name="share-title"]').attr("content");
  var desc = $('[name="share-desc"]').attr("content");
  var url = $('[name="share-url"]').attr("content") || location.href;
  var imgUrl = $('[name="share-imgUrl"]').attr("content");
  var openUrl = $('[name="open-url"]').attr("content") || location.href;

  var qttShareParams = {
    title: title,
    desc: desc,
    url: utils.addParam(url, { env: "qtt" }),
    target: 1, // 1 微信 3 QQ
    type: "URL",
    icon: imgUrl,
    pics: [],
    wayType: "sys", // 分享方式： sys 系统
    appid: "appid1"
  };

  var quickShareParams = {
    pkg: "com.fancy.simple",
    path: "/share",
    page_title: title,
    url: openUrl, // 快应用打开的页面
    title: title,
    summary: desc,
    imagePath: imgUrl,
    targetUrl: utils.addParam(url, { env: "qApp" }) // 分享的页面
  };

  var wechatShareParams = {
    title: title, // 分享标题
    desc: desc, // 分享描述
    link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: imgUrl, // 分享图标设置成功
    success: function() {
      $(".wechat-mask").hide();
    }
  };

  exports.initShare = function(params) {
    if (jskit.isWechat) {
      wechatShareParams = Object.assign(
        {
          link: url
        },
        wechatShareParams,
        params
      );
      jskit.openShare(wechatShareParams, true);
    } else if (jskit.isAndroid && QTTB.isQTT) {
      quickShareParams.url = params.openUrl;
      quickShareParams.imagePath = params.imgUrl || imgUrl;
      quickShareParams.targetUrl = params.link || url;

      QApp.openQuickApp(quickShareParams);
    }
  };

  /**
   *
   * @param params
   *  params.title     分享的标题
   *  params.desc      分享的描述
   *  params.url       分享的链接
   *  params.openUrl 针对快应用打开的页面与分享的链接不一致(这是快应用打开的页面链接)
   *  params.imgUrl    分享的图标
   */
  exports.open = function(params) {
    if (jskit.isWechat) {
      wechatShareParams = Object.assign(
        {
          link: url
        },
        wechatShareParams,
        params
      );
      jskit.openShare(wechatShareParams, false);
    } else if (QApp.isQuickApp) {
      var _params = {
        imagePath: params.imgUrl || imgUrl,
        summary: params.desc || desc,
        targetUrl: params.link || url,
        url: params.openUrl || openUrl,
        title: params.title || title,
        auto_share: 1
      };
      Object.assign(quickShareParams, _params);

      QApp.openShare(quickShareParams);
    } else if (QTTB.isQTT && QTTB.isQukan && !QTTB.isIphone) {
      qttShareParams.url = params.link;
      qttShareParams.title = params.title;
      qttShareParams.target = params.target || 1;

      QTTB.share(qttShareParams);
    } else if (QTTB.isCPC) {
      QApp.openQuickApp(Object.assign(quickShareParams, params));

      setTimeout(function() {
        if (!document.hidden) {
          $(".share-modal").show();
        }
      }, 2000);
    } else {
      $(".share-modal").show();
    }
  };
});
