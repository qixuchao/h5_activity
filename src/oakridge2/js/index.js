define(function (require, exports, module) {
  'use strict';
  var $ = require("$");
  // var utils = require("module/utils")
  require("../lib/formValidate")($);
  require("Swiper");
  require("../lib/imgLazyLoad");
  require("../lib/cityPicker")($);
  require("jweixin")
  var jskit = require("jskit")
  $(function () {

    if (jskit.isWechat) {
      jskit.openShare({
        title: '首付20万起入住橡树岭',
        desc: '拥抱温西品质生活的一次机会，完美学区，豪华配置，首付20万人民币起，永久产权，交房按揭。',
        link: location.href,
        imgUrl: 'http://static.xiawan8.com/activity/20190620/oakridge/images/oakridge_share_icon.png'
      }, true)
    }

    // 初始化图片加载器
    lazyLoad.init({
      offset: window.innerHeight
    });

    // 初始化分享
    var query = {};
    _ft_.push(['action', 'land', {
      env: query.env || ''
    }]);

    $('.city').CityPicker();

    new Swiper('#page', {
      direction: 'vertical',
      on: {
        slideChangeTransitionStart: function () {
        },
        slideChangeTransitionEnd: function () {
          lazyLoad.check();
        },
      }
    });

    var timer = null;
    var showPrompt = function (data) {
      var $prompt = $('.prompt');
      $prompt.css({ display: 'block' });
      $prompt.text(data);
      timer = setTimeout(function () {
        $prompt.css({ display: 'none' });
        clearTimeout(timer);
      }, 1500);
    };

    // $('input').blur(function () {
    //   'use strict';
    //   $(window).scrollTop(0);
    //   document.body.scrollTop = 0;
    // });

    // form表单显示，提交功能
    var validate = $('form').validate();

    $('.form-submit').click(function (e) {
      e.preventDefault();

      _ft_.push(['action', 'submit']);

      var name = $('.name').val();
      var phone = $('.phone').val();
      var email = $('.email').val();
      var city = $('.city').val();

      if (validate.inspect()) {
        return;
      }

      var params = {
        name: name,
        phone: phone,
        city: city,
        email: email,
      };
      $.ajax({
        url: 'http://openapi.fancysmp.com/api/create?project=oakridge',
        type: 'post',
        processData: true,
        data: params,
        dataType: 'json',
        success: function (res) {
          if (res.code === 0) {
            showPrompt('提交成功');
            _ft_.push(['action', 'submit_success']);
          } else {
            _ft_.push(['action', 'submit_error']);
            showPrompt(res.message);
          }
        }
      });
    });
  });
});
