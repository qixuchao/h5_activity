define(function(require, exports, module) {
  var $ = require("$");
  var utils = require("module/utils");
  var jskit = require("jskit");
  require("qttBridge");
  var token = null;

  var pathname = location.pathname.split("/");
  pathname.pop();
  pathname = pathname.join("/");

  var isTestENV = /test/.test(location.pathname)

  var BASE_HOST = location.protocol + "//" + location.host + pathname; //'//static.xiawan8.com/activity/20190606/honor/'
  var toLogin = function() {
    "use strict";
    jskit.toLogin(
      BASE_HOST +
      "/middlePage.html?ret=" +
      encodeURIComponent(
        utils.addParam(location.href, {
          SSO_TOKEN: ""
        })
      )
    );
  };

  var activityId = isTestENV ? "c122def0-92a5-4531-8425-e8078f67834b" : "a3b0e759-b180-4ec4-a3ba-70e436015354";

  var HOST = isTestENV ? "http://pre.api.share.h5.fancydsp.com" : '//api.share.h5.fancydsp.com';

  var checkLogin = function(callback) {
    try {
      if (QTTB.isQTT) {
        console.log("======趣头条环境======");
        token = QTTB.getToken();
        console.log(token);
        callback(token);
      } else if (jskit.isWechat) {
        console.log("======微信环境======");
        //token = utils.getUrlParams(utils.SSO_TOKEN_KEY);
        if (token) {
          utils.saveToken(token);
        } else {
          token = utils.getToken();
          if (!token) {
            if (jskit.toLogin) {
              console.log("======微信登录======");
              toLogin();
            }
            return;
          }
        }
        callback(token);
      } else {
        token = utils.getToken();
        callback();
      }
    } catch (e) {
      console.log(e);
      callback();
    }
  };

  QTTB.isQTT && checkLogin(function(token) {
    console.log(token);
  });

  // 给元素添加指定动画，执行animate动画
  var runAnimate = function($container) {
    $container.find("[data-animate-class]").each(function() {
      $(this)
        .addClass($(this).attr("data-animate-class"))
        .one("animationend", function() {
          $(this).removeClass($(this).attr("data-animate-class"));
        });
    });
  };

  function noSlide(e){
    e.preventDefault();
    return false;
  }

  $(document).on("click", ".J-open-modal", function() {
    var $target = $($(this).attr("data-modal-target")).show();

    runAnimate($target);

    // $("body").on('touchmove',noSlide)
    // $('body,.container').css({
    //   overflow:'hidden'
    // })
  });

  $(".J-modal-close").click(function() {
    $(".J-modal").hide();
    // $("body").off('touchmove',noSlide)
    // $('body,.container').css({
    //   overflow:'auto'
    // })
  });

  // $(".f-modal-wrap").on("touchmove", function(e) {
  //   //e.preventDefault()
  //   return false
  // });


  // // 阻止掉弹窗最外层的滚动事件
  // // 通过这个可以解决form显示错误的问题
  // $(".f-modal").on("touchmove", function(e) {
  //   e.stopPropagation()
  //   return false
  // });

  // 通用布码点击监控
  $('.container').on("click", function(e) {
    var action = $(e.target).attr("data-action");
    if (window._ft_ && action) {
      _ft_.push(["action", action]);
    }
  });

  module.exports = {
    checkLogin: checkLogin,
    BASE_HOST: BASE_HOST,
    getToken: function() {
      return token;
    },
    getChannelType: function() {
      var ua = navigator.userAgent;
      return /MicroMessenger/i.test(ua)
        ? 2
        : /qukan|clicash|com\.fancy\.simple/i.test(ua) ? 1 : 0;
    },
    toLogin: toLogin,
    runAnimate: runAnimate,
    HOST: HOST,
    activityId: activityId,
    isWechat:/MicroMessenger/i.test(navigator.userAgent)
  };
});
