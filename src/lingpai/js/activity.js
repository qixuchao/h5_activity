define(function (require, exports, module) {
  'use strict';
  var $ = require("$");

  require("../lib/formValidate");
  require("Swiper");

  new Swiper('#page', {
    direction: 'vertical',
    on: {
      slideChangeTransitionStart: function(){
        $($('.swiper-slide')[this.activeIndex]).addClass('animated fadeIn')
      },
      slideChangeTransitionEnd: function(){
        $($('.swiper-slide')[this.activeIndex]).removeClass('animated')
      },
    }
  });
  var dealerList = $.map(dealer, function(list){
    return '<option value="'+list['经销商简称']+'">'+list['经销商简称']+'</option>'
  })

  $('.dealer').append(dealerList.join())

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

  $('select').blur(function(){
    'use strict';
    $(window).scrollTop(0);
    document.body.scrollTop = 0
  })

  // form表单显示，提交功能
  var validate = $('form').validate();

  $('.form-submit').click(function () {
    console.log('....')
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

    $.ajax({
      url: 'http://openapi.fancysmp.com/api/create?project=beiqi',
      type: 'post',
      processData: true,
      data: params,
      dataType: 'json',
      success: function(res){
        if (res.code === 0) {
          var currentDealer = {}
          $.each(dealer, function(index,list) {
            if (list['经销商简称'] === params.dealer) {
              currentDealer = list
              return false
            }
          })
          $('#page').hide()
          $('.page15').show().addClass('animated fadeIn')
          $('.dealer-address').text(currentDealer['经销商地址'])
          $('.dealer-phone').text(currentDealer['销售热线'])
        } else {
          showPrompt(res.message)
        }
      }
    })
  });
});
