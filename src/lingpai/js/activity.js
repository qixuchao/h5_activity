define(function (require, exports, module) {
  'use strict';
  var $ = require("$");
  var utils = require("module/utils")
  var shareUtils = require("module/share")
  require("clipboard");
  require("../lib/formValidate");
  require("Swiper");
  require("../lib/MD5")
  require("../lib/imgLazyLoad")

  // 初始化图片加载器
  lazyLoad.init({
    offset:window.innerHeight
  })

  // 初始化分享
  var query = utils.getUrlObj()

  shareUtils.initShare({ openUrl: utils.addParam('http://static.xiawan8.com/activity/baicmotor/20190528/index.html', {qttToken: window.SSO_TOKEN}) })

  $('.share')
    .attr('data-clipboard-text', 'http://static.xiawan8.com/activity/baicmotor/20190528/index.html' + $("[name=\"share-title\"]").attr('content'))
    .click(function(){
      _ft_.push(['action', 'share'])
      new ClipboardJS('.share');
      shareUtils.open({})
  })

  _ft_.push(['action', 'land', {
    env: query.env || ''
  }])

  // 给元素添加指定动画，执行animate动画
  var runAnimate = function ($container) {
    $container.find("[data-animate-class]").each(function () {
      $(this).addClass($(this).attr("data-animate-class"))
        .one("animationend", function () {
          $(this).removeClass($(this).attr("data-animate-class"));
        });
    });
  };

  $(function () {
    setTimeout(function () {
      runAnimate($('.swiper-slide').eq(0));
    });
  });

  $('.J-modal-close').click(function () {
    $('.modal').hide()
  })

  new Swiper('#page', {
    direction: 'vertical',
    on: {
      slideChangeTransitionStart: function () {
        runAnimate($('.swiper-slide').eq(this.activeIndex));
      },
      slideChangeTransitionEnd: function () {
        lazyLoad.check()
        if (this.activeIndex < $('.swiper-slide').length - 1) {
          $('.page-next').show();
        } else {
          $('.page-next').hide();
        }
      },
    }
  });

  var dealerList = $.map(dealer, function (list) {
    return '<option value="' + list['经销商简称'] + '">' + list['经销商简称'] + '</option>';
  });

  $('.dealer').append(dealerList.join());

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

  $('select, input').blur(function () {
    'use strict';
    $(window).scrollTop(0);
    document.body.scrollTop = 0;
  });

  // form表单显示，提交功能
  var validate = $('form').validate();

  $('.form-submit').click(function (e) {
    e.preventDefault()

    _ft_.push(['action', 'submit'])

    var name = $('.name').val();
    var gender = $("[name='gender']").val();
    var phone = $('.phone-num').val();
    var province = $('#province').val();
    var city = $('#city').val();
    var dealerId = $('#dealer').val();
    var car = $('#car').val();


    if (validate.inspect()) {
      return;
    }

    var params = {
      name: name,
      gender: gender,
      phone: phone,
      province: province,
      city: city,
      dealer: dealerId,
      car: car
    };

    var goldParam = {
      activity_id: 13,
      amount: 34,
      client_id: 1,
      token: window.SSO_TOKEN || query.qttToken,
    }
    if (utils.env.isQTT || utils.env.isQuickApp) {
      $.ajax({
        url: 'http://gold.qtt.fancydsp.com/api/h5/sendGold',
        type: 'get',
        headers: {
          token: $.md5('307f073efb4ca727fa55597a7ads4567' + decodeURIComponent(utils.param(goldParam)) + '307f073efb4ca727fa55597a7ads4567')
        },
        data: goldParam,
        contentType: 'application/json',
        success: function (res) {
          if (res.code === 0) {
            showPrompt('200金币也到账')
          } else {
            showPrompt(res.errorMessage)
          }
        }
      })
    }

    $.ajax({
      url: 'http://openapi.fancysmp.com/api/create?project=beiqi',
      type: 'post',
      processData: true,
      data: params,
      dataType: 'json',
      success: function (res) {
        if (res.code === 0) {
          _ft_.push(['action', 'submit_success'])

          var currentDealer = {};
          $.each(dealer, function (index, list) {
            if (list['经销商简称'] === params.dealer) {
              currentDealer = list;
              return false;
            }
          });
          $('#page').hide();
          $('.page-next').hide();
          $('.page15').show().addClass('animated fadeIn');
          $('.dealer-address').text(currentDealer['经销商地址']);
          $('.dealer-phone').text(currentDealer['销售热线']);
        } else {
          _ft_.push(['action', 'submit_error'])

          showPrompt(res.message);
        }
      }
    });
  });
});
