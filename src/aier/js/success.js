define(function (require, exports, module) {
  'use strict';
  var $ = require("$");
  var shareUtils = require("module/share")
  var utils = require("module/utils")
  var common = require("module/common")
  require("./shareContent")
  require("clipboard");

  $(function ($) {

    // 初始化分享微信
    if (utils.env.isWechat) {
      shareUtils.initShare({
        title: shareContent[_pageType].title,
        desc: shareContent[_pageType].desc,
        link: shareContent[_pageType].link,
        success: function (e) {
          _ft_.push(["action", "share_success"]);
        },
        cancel: function (e) {
          _ft_.push(["action", "share_cancel"]);
        }
      });
    }

    function sendGold() {
      var data = {
        activity_id: common.activityId,
        user_token: common.getToken(),
        channel_type: common.getChannelType()
      };
      utils.ajax({
        url: common.HOST + "/api/sendGold",
        method: "post",
        data: JSON.stringify(data),
        callback: function(res) {
          _ft_.push(["action", "send-gold"]);
        }
      });
    }

    new ClipboardJS(".ui-radio", {
      text: function(trigger) {
        return (
          shareContent[_pageType].title +
          shareContent[_pageType].link
        );
      }
    });

    $('.question-button').click(function () {
      window.location.href = './question.html?page_type=' + _pageType
    })

    $('.J-modal-close').click(function () {
      $('.J-modal').hide()
    })

    $('.ui-radio').click(function (e) {
      if (utils.env.isQTT) {
        sendGold()
      }
      shareUtils.open({
        title: shareContent[_pageType].title,
        desc: shareContent[_pageType].desc,
        link: shareContent[_pageType].link,
        page_title: '爱尔眼科',
      })
    })

  });
});
