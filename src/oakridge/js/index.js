define(function (require, exports, module) {
  'use strict';
  var $ = require("$");
  // var utils = require("module/utils")
  require("../lib/formValidate")($);
  require("Swiper");
  require("../lib/imgLazyLoad");
  require("../lib/cityPicker")($);
  $(function () {
    // 初始化图片加载器
    lazyLoad.init({
      offset: window.innerHeight
    });

    // 初始化分享
    var query = {};
    _ft_.push(['action', 'land', {
      env: query.env || ''
    }]);

    // 给元素添加指定动画，执行animate动画
    var runAnimate = function ($container) {
      $container.find("[data-animate-class]").each(function () {
        $(this).addClass($(this).attr("data-animate-class"))
          .one("animationend", function () {
            $(this).removeClass($(this).attr("data-animate-class"));
          });
      });
    };


    setTimeout(function () {
      runAnimate($('.swiper-slide').eq(0));
    });

    $('.city').CityPicker();

    new Swiper('#page', {
      direction: 'vertical',
      on: {
        slideChangeTransitionStart: function () {
          runAnimate($('.swiper-slide').eq(this.activeIndex));
        },
        slideChangeTransitionEnd: function () {
          lazyLoad.check();
          if (this.activeIndex === 4) {
            new Swiper('#page1', {
              direction: 'horizontal',
              loop: true,
              on: {

              },
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
            });
            $('.J-swiper-button').show();

          } else if (this.activeIndex === 5) {
            new Swiper('#page2', {
              direction: 'horizontal',
              loop: true,
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
            });
          }
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
