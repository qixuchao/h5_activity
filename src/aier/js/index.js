define(function (require, exports, module) {
  'use strict';
  var $ = require("$");
  var shareUtils = require("module/share")
  var utils = require("module/utils");
  require("./shareContent")
  var symptom = {
    1: '您或您的家人如存在<br/>'+
      '<Strong>近视、近视度数近期猛增</Strong> 等问题，<br/>'+
      '填写以下问卷了解眼睛状况<br/>' ,
    2: '您或您的家人如存在<br/>'+
      '<Strong>眼干眼涩、畏光流泪</Strong> 等问题，<br/>'+
      '填写以下问卷了解眼睛状况<br/>' ,
    3: '您或您的家人有<strong>视物浑浊、</strong><br/>'+
      '<Strong>模糊、</Strong> 总是感到眼前<strong>朦朦胧胧、雾蒙感</strong>，<br/>'+
      '填写以下问卷了解眼睛状况<br/>' ,
    4: '您或您的家人有<strong>糖尿病问题、</strong><br/>'+
      '近视高达<Strong>600度</Strong>以上，<br/>'+
      '填写以下问卷了解眼睛状况<br/>' ,
  }

  var getUrlParams = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
  };

  var _pageType = getUrlParams('page_type') || 'page_1'

  _ft_.push(['pv', _pageType])

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

    $('.question-button').click(function () {
      window.location.href = './question.html?page_type=' + _pageType
    })

    var pageType = ['page_1', 'page_2', 'page_3', 'page_4']

    pageType.forEach(function (val, index) {
      if (_pageType === val) {
        $('.question-desc').html(symptom[index + 1])
      }
    })

  });
});
