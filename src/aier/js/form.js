define(function (require, exports, module) {
  'use strict';
  var $ = require("$");
  require("../lib/formValidate")($);
  require('./cityData')
  var common = require("module/common")
  var shareUtils = require("module/share")
  var utils = require("module/utils");
  require("./shareContent")

  var getUrlParams = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
  };

  var _pageType = getUrlParams('page_type') || 'page_1'

  _ft_.push(['pv', _pageType])

  $(function () {

    var provinceList = []
    var cityList = []
    var location = []
    var $province = $('[name=province]')

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

    cityData.forEach(function (city) {
      if (city.pid === '0') {
        provinceList.push('<option value="'+city.name+','+city.id+'">'+ city.name +'</option>')
      }
    })

    $province.append(provinceList.join())

    $province.change(function (e) {
      var $city = $('[name=city]')
      var $location = $('[name=location]')
      cityList = []
      $city.empty().append('<option value="">市</option>')
      location = []
      $location.empty().append('<option value="">区</option>')
      cityData.forEach(function (city) {
        if (e.target.value.split(',')[1] === city.pid) {
          cityList.push('<option value="'+city.name+','+city.id+'">'+city.name+'</option>')
        }
      })
      $city.append(cityList.join())
      $('[name=city]').change(function (e) {
        var $location = $('[name=location]')
        location = []
        $location.empty().append('<option value="">区</option>')
        cityData.forEach(function (city) {
          if (e.target.value.split(',')[1] === city.pid) {
            location.push('<option value="'+city.name+','+city.id+'">'+city.name+'</option>')
          }
        })
        $location.append(location.join())
      })
    })
    var timer = null
    var showPrompt = function (data) {
      var $prompt = $('.prompt');
      $prompt.css({ display: 'block' });
      $prompt.text(data);
      timer = setTimeout(function () {
        $prompt.css({ display: 'none' });
        clearTimeout(timer);
      }, 1500);
    };

    var getUrlParams = function(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURIComponent(r[2]);
      return null;
    };

    var validate = $('form').validate();

    $('.form-submit').click(function () {
      var name = $('.name').val();
      var phone = $('.phone').val();
      var age = $('[name=age]').val();
      var city = $('[name=city]').val().split(',')[0];
      var province = $('[name=province]').val().split(',')[0];
      var location = $('[name=location]').val().split(',')[0];
      var answer = getUrlParams('answer')

      if (validate.inspect()) {
        return;
      }

      var params = {
        name: name,
        phone: phone,
        age: age,
        city: city,
        province: province,
        location: location,
        page_type: _pageType,
        answer: answer,
      };

      if (utils.env.isQTT && !utils.env.isIphone) {
        sendGold()
      }

      $.ajax({
        url: '//openapi.xiawan8.com/api/create?project=aier_new',
        type: 'post',
        processData: true,
        data: params,
        dataType: 'json',
        success: function (res) {
          if (res.code === 0) {
            showPrompt('提交成功');
            setTimeout(function () {
              window.location.href = './success.html?page_type=' + _pageType
            }, 300)

            _ft_.push(['action', 'submit_success', {
              page_type: _pageType,
            }]);
          } else {
            _ft_.push(['action', 'submit_error',  {
              page_type: _pageType,
            }]);
            showPrompt(res.message);
          }
        }
      });
    })

  });
});
