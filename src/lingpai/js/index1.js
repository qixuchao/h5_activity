var HOST = 'http://avalon.test.fancydsp.com';
var get_province_url = HOST + '/openapi/getprovince';
var get_city_url = HOST + '/openapi/dealercity';
var get_dealer_url = HOST + '/openapi/dealer';
var get_car_url = HOST + '/Openapi/getSeries';
var get_models_url = HOST + '/Openapi/getModel';
var get_buying_time_url = HOST + '/Openapi/SetClues/buyingTime';
var post_formData = HOST + '/openapi/postLead';

Zepto(function ($) {
  /Mobile/i.test(navigator.userAgent) || $(document.body).addClass("pc");
  var $cars = $('.swiper-children');
  var swiperVideo = new Swiper('#container-video', {
    pagination: {
      el: '.swiper-pagination'
    },
  });
  var swiperTable = new Swiper('#container-config', {
    noSwiping: true
  });
  var swiperCar = new Swiper('#container-car', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      slideChangeTransitionEnd: function () {
        $cars.removeClass('activity');
        $cars.eq(this.activeIndex).addClass('activity');
        swiperDesc.slideTo(this.activeIndex, 0, false);
      }
    }
  });
  var swiperDesc = new Swiper('#container-desc')

  var treatyValue = 1
  var $treaty = $('#treaty')

  $treaty.click(function(){
    treatyValue = !treatyValue
    $treaty.val(+treatyValue)
  })

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
  var $player = $('.img-palyer');
  $player.click(function () {
    $('.container').css({ display: 'none' });
    $('#player-modal').css({ display: 'flex' });
    $('#example_video_1')[0].play()
    // location.href = './video.html'
  });
  $('#close').click(function () {
    $('#example_video_1')[0].pause()
    $('#player-modal').css({ display: 'none' });
    $('.container').css({ display: 'block' });
  });
  $('#car-config').change(function(e){
    console.log(e.target.value)
    swiperTable.slideTo(e.target.value - 1)
  })
  $cars.click(function (e) {
    $('.swiper-children').removeClass('activity');
    this.className = 'swiper-children activity';
    swiperCar.slideTo($(e.currentTarget).index(), 500, false);
    swiperDesc.slideTo($(e.currentTarget).index(), 500, false);
  });

  $('#check-treaty').click(function(){
    $('.container').css({ display: 'none' });
    $('#treaty-modal').css({ display: 'flex' });
  })
  $('#treaty-close').click(function(){
    $('#treaty-modal').css({ display: 'none' });
    $('.container').css({ display: 'block' });
  })

  var provinceList = [];
  var cityList = [];
  var dealerList = [];
  var carList = [];
  var seriesList = []
  var timeList = [];

  $.ajax({
    type: "post",
    url: get_province_url,
    processData: false,
    data: JSON.stringify({}),
    contentType: 'application/json',
    success: function (msg) {
      provinceList = $.map(msg.data, function (value) {
        return '<option value=' + value.id + ',' + value.name + ' >' + value.name + '</option >';
      });
      $('#province').append(provinceList);
    }
  });


  $.ajax({
    type: "post",
    url: get_models_url,
    processData: false,
    data: JSON.stringify({
      params: {
        key: 'id',
        value: '33',
      }
    }),
    contentType: 'application/json',
    dataType: 'json',
    success: function (msg) {
      $.each(msg.data, function (n, value) {
        // if (value.vehicleSeriesId === '33') {
          carList.push('<option value=' + value.id + ',' + value.name + ' >' + value.name + '</option >')
        // }
      });
      $('#car').append(carList);
    }
  });

  $("#province").change(function (e) {
    var $city = $("#city");
    var $dealer = $("#dealer");
    $city.replaceWith('<select id="city"><option value="">请选择市/区</option></select>');
    $dealer.replaceWith('<select id="dealer"><option value="">请选择经销商</option></select>');
    $.ajax({
      type: "post",
      url: get_city_url,
      processData: false,
      data: JSON.stringify({
        params: {
          key: 'cid',
          value: e.target.value.split(',')[0],
        }
      }),
      contentType: 'application/json',
      success: function (msg) {
        cityList = $.map(msg.data, function (value) {
          return '<option value=' + value.cid + ',' + value.name + ' >' + value.name + '</option >';
        });
        $('#city').append(cityList);
      }
    });

    $("#city").change(function (e) {
      var $dealer = $("#dealer");
      $dealer.replaceWith('<select id="dealer"><option value="">请选择经销商</option></select>');
      $.ajax({
        type: "post",
        url: get_dealer_url,
        processData: false,
        data: JSON.stringify({
          params: {
            key: 'cid',
            value: e.target.value.split(',')[0],
          }
        }),
        contentType: 'application/json',
        success: function (msg) {
          dealerList = $.map(msg.data, function (value) {
            return '<option value=' + value.code + ',' + value.name + ' >' + value.name + '</option >';
          });
          $('#dealer').append(dealerList);
        }
      });
      // $('#dealer').change(function (e) {
      //   var $car = $("#car");
      //   $car.replaceWith('<select id="car"><option value="">请选择车型</option></select>');
      //   $.ajax({
      //     type: "post",
      //     url: get_models_url,
      //     processData: false,
      //     data: JSON.stringify({
      //       params: {
      //         key: 'id',
      //         value: '33',
      //       }
      //     }),
      //     contentType: 'application/json',
      //     success: function (msg) {
      //       carList = $.map(msg.data, function (value) {
      //         return '<option value=' + value.cid + ',' + value.name + ' >' + value.name + '</option >';
      //       });
      //       $('#dealer').append(carList);
      //     }
      //   });
      //
      // });
    });
  });
  $('.form-submit').click(function () {
    var name = $('.name').val();
    var sex = $('.gender').val();
    var phone = $('.phone-num').val();
    var provinceId = $('#province').val();
    var cityId = $('#city').val();
    var dealerId = $('#dealer').val();
    var seriesId = $('#car').val() || 33;
    var orderTime = $('.order-time').val();
    var driveTime = $('.buy-time').val();
    var message = '';
    if (!name) {
      message = '用户名必需填写';
    } else if (!sex) {
      message = '性别必需填写';
    } else if (!(phone && phone.length === 11)) {
      message = '手机号格式错误';
    } else if (!provinceId) {
      message = '省份必需填写';
    } else if (!cityId) {
      message = '市区必需填写';
    } else if (!dealerId) {
      message = '经销商必需填写';
    } else if (!seriesId) {
      message = '车型必需填写';
    } else if (!orderTime) {
      message = '预约到店时间必需填写';
    } else if (!driveTime) {
      message = '计划的购车时间必需填写';
    } else if ($treaty.val() != '1') {
      message = '请同意隐私政策'
    }
    if (message) {
      showPrompt(message);
      return;
    }
    var params = {
      datas: [{
        activity: 505,
        channelKeyId: 1,
        mediaLeadType: '2019年3-5月亚洲龙APP投放',
        name: name,
        sex: +sex,
        phone: phone,
        provinceId: +provinceId.split(',')[0],
        cityId: +cityId.split(',')[0],
        dealerId: dealerId.split(',')[0],
        orderTime: orderTime,
        seriesId: 33,
        driveTime: driveTime,
      }]
    };
    var localParams = {
      activity: 505,
      channelKeyId: 1,
      mediaLeadType: '2019年3-5月亚洲龙APP投放',
      name: name,
      sex: sex,
      phone: phone,
      provinceId: provinceId,
      cityId: cityId,
      seriesId: 33,
      dealerId: dealerId,
      orderTime: orderTime,
      driveTime: driveTime,
      id: Number(phone + dealerId.split(',')[0])
    };
    $.ajax({
      url: 'http://openapi.fancysmp.com/api/create?project=yzl',
      type: 'post',
      processData: true,
      data: localParams,
      dataType: 'json',
      success: function (response) {
        if (response.code) {
          showPrompt(response.message);
        } else {
          params.datas[0].mediaLeadId = response.data.data_id.$oid;
          $.ajax({
            url: post_formData,
            type: 'post',
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify({datas: params.datas}),
            dataType: 'json',
            success: function (res) {
              if (res.code === 0) {
                showPrompt('提交成功')
              } else {
                showPrompt(res.errorMessage);
              }
            }
          });
        }
      },
      error: function (err) {
        showPrompt(err.massage);
      }
    });
  });
});
