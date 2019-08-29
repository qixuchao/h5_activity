define(function (require, exports, module) {
  'use strict';
  var $ = require("$");
  var symptom = {
    1: '您或您的家人如存在<br/>'+
      '<Strong>近视、近视度数近期猛增</Strong> 等问题，<br/>'+
      '填写以下问卷可获得一张,',
    2: '您或您的家人如存在<br/>'+
      '<Strong>眼干眼涩、畏光流泪</Strong> 等问题，<br/>'+
      '填写以下问卷可获得一张,',
    3: '您或您的家人有<strong>视物浑浊、</strong><br/>'+
      '<Strong>模糊、</Strong> 总是感到眼前<strong>朦朦胧胧、雾蒙感</strong>，<br/>'+
      '填写以下问卷可获得一张,',
    4: '您或您的家人有<strong>糖尿病问题、</strong><br/>'+
      '近视高达<Strong>600度</Strong>以上，<br/>'+
      '填写以下问卷可获得一张,',
  }
  $(function ($) {
    $('.question-button').click(function () {
      window.location.href = './question.html?page_type=' + getUrlParams('page_type')
    })

    var pageType = ['page_1', 'page_2', 'page_3', 'page_4']

    var getUrlParams = function(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURIComponent(r[2]);
      return null;
    };

    pageType.forEach(function (val, index) {
      if (getUrlParams('page_type') === val) {
        $('.question-desc').html(symptom[index + 1])
      }
    })

  });
});
