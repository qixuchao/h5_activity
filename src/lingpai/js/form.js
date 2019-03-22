// var host = 'http://crider.test.fancydsp.com/'
var host = 'http://crider.h5.fancydsp.com/'
// var goldHost = 'http://gold_test.qtt.fancydsp.com/'
var goldHost = 'http://gold.qtt.fancydsp.com/'
var geoUrl = 'http://geo.test.amnetapi.com/ade/v1/geoParse/getGeoInfo'
// var geoUrl = 'http://geo.hayseen.com/ade/v1/geoParse/getGeoInfo/'

Zepto(function($){
  var province = []
  var city = []
  var dealer = []
  var provinceCode = null
  Date.prototype.Format = function(fmt) {
    var o = {
      "M+" : this.getMonth()+1,                 //月份
      "d+" : this.getDate(),                    //日
      "h+" : this.getHours(),                   //小时
      "m+" : this.getMinutes(),                 //分
      "s+" : this.getSeconds(),                 //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
      if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
  }
  var qttToken = null
  if (QTTB.isQTT) {
    QTTB.getToken(function(token) {
      qttToken = token
    })
  }
  var showPrompt = function (data) {
    var $prompt = $('.prompt');
    $prompt.css({ display: 'block' });
    $prompt.text(data);
    timer = setTimeout(function () {
      $prompt.css({ display: 'none' });
      clearTimeout(timer);
    }, 1500);
  };
  var getData = function(data) {
    return $.map(Object.keys(data), function(value) {
      return '<option value='+data[value].code+','+data[value].name+'>'+data[value].name+'</option>'
    })
  }

  $('#province').append(getData(datas))
  var ip = null
  $.ajax({
    url: geoUrl,
    jsonp: 'jsonp',
    dataType: 'jsonp',
    success: function(response){
      if (response.error_message === 'success') {
        var cityList = {}
        ip = response.data.ip
        Object.keys(datas).forEach(function(value){
          if (datas[value].name === response.data.province_str) {
            $('#province').val(datas[value].code+','+datas[value].name)
            provinceCode = datas[value].code
            cityList = datas[value].child
            $('#city').append(getData(cityList))
          }
        })


        Object.keys(cityList).forEach(function (value) {
          console.log(cityList)
          if (cityList[value].name === response.data.city_str) {
            $('#city').val(cityList[value].code+','+cityList[value].name)
            $('#dealer').append(getData(cityList[value].child))
          }
        })
      }
    }
  })

  $('#province').change(function(e){
    var $city = $("#city");
    var $dealer = $("#dealer");
    provinceCode = e.target.value && e.target.value.split(',')[0]
    $city.replaceWith('<select id="city"><option value="">请选择市/区</option></select>');
    $dealer.replaceWith('<select id="dealer"><option value="">请选择经销商</option></select>');
    var provinceChild = e.target.value ? datas[e.target.value.split(',')[0]]: {}
    var data = provinceChild.child
    $('#city').append(getData(data))

    $('#city').change(function(e){
      var $dealer = $("#dealer");
      $dealer.replaceWith('<select id="dealer"><option value="">请选择经销商</option></select>');
      var cityChild = e.target.value ? datas[provinceCode].child[e.target.value.split(',')[0]] : {}
      $('#dealer').append(getData(cityChild.child))
    })
  })
  $('#city').change(function(e){
    var $dealer = $("#dealer");
    $dealer.replaceWith('<select id="dealer"><option value="">请选择经销商</option></select>');
    var cityChild = e.target.value ? datas[provinceCode].child[e.target.value.split(',')[0]] : {}
    $('#dealer').append(getData(cityChild.child))
  })

  var parseUrl = function(str, isNoCaseSensitive) {
    var arr,
      part,
      url = {};
    //去掉首位空格
    if (!(str || '').replace(/^\s+|\s+$/, '')) {
      return {};
    }

    str = str.replace(/\S*\?/,'');

    if (str) {

      if (isNoCaseSensitive) {
        str = str.toLocaleLowerCase();
      }

      arr = str.split('&');
      for (var i in arr) {
        part = arr[i].split('=');
        url[part[0]] = decodeURIComponent(part[1]);
      }
    }
    return url;
  }

  var param = function(paramObj) {
    var str = [];
    for (var i in paramObj) {
      if (paramObj[i] !== undefined) {
        str.push(i + '=' + encodeURIComponent(paramObj[i]));
      }
    }
    return str.join('&');
  }
  $('.form-submit').click(function () {
    var name = $('.name').val();
    var phone = $('.phone-num').val();
    var provinceId = $('#province').val();
    var cityId = $('#city').val();
    var dealerId = $('#dealer').val();
    var message = '';
    if (!name) {
      message = '用户名必需填写';
    } else if (!(phone && /1\d{10}/.test(phone))) {
      message = '手机号格式错误';
    } else if (!provinceId) {
      message = '省份必需填写';
    } else if (!cityId) {
      message = '市区必需填写';
    } else if (!dealerId) {
      message = '经销商必需填写';
    }
    if (message) {
      showPrompt(message);
      return;
    }
    var params = {
      Key: 'b918c114c1454bac88f9d09b8f670692',
      RequestObjectList: [{
        TRUE_NAME: name,
        MOBILE: phone,
        PROVINCE: provinceId.split(',')[0],
        CITY: cityId.split(',')[0],
        DEALER: dealerId.split(',')[0],
        SERIES: '4374B1D6-6F2E-4892-AFC6-2B06E76248A0',
        LEAD_TYPE: '771A1CF7-0E2C-440B-9D0E-5F5D792431DC',
        CREATED_TIME: (new Date()).Format('yyyy-MM-dd hh:mm:ss'),
        MARKETING_NUMBER: '1-54383317'
      }]
    };
    var localParams = {
      TRUE_NAME: name,
      MOBILE: phone,
      PROVINCE: provinceId,
      CITY: cityId,
      DEALER: dealerId,
      source: parseUrl(location.search).source || '',
      SERIES: '4374B1D6-6F2E-4892-AFC6-2B06E76248A0',
      LEAD_TYPE: '771A1CF7-0E2C-440B-9D0E-5F5D792431DC',
      MARKETING_NUMBER: '1-54383317'
    };
    var goldParams = {
      activity_id: 7,
      amount: 17,
      client_id: 1,
      ip: ip,
      token: qttToken,
    }
    $.ajax({
      url: 'http://openapi.fancysmp.com/api/create?project=lingpai',
      type: 'post',
      processData: true,
      data: localParams,
      dataType: 'json',
      success: function (response) {
        if (response.code === 0) {
          $.ajax({
            url: host+'api/sendLeads',
            type: 'post',
            processData: false,
            data: JSON.stringify(params),
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
              if (response.code === 0) {
                setTimeout(function(){
                  location.href = './success.html'
                }, 1500)
              }
            },
          });
        } else {
          showPrompt(response.message)
        }
      }
    })
    if (QTTB.isQTT && qttToken) {
      $.ajax({
        url: goldHost + 'api/h5/sendGold',
        type: 'get',
        headers: {
          token: $.md5('307f073efb4ca727fa55597a7ads4567' + decodeURIComponent(param(goldParams)) + '307f073efb4ca727fa55597a7ads4567')
        },
        data: Object.assign(goldParams, {
          valid_content: JSON.stringify([{
            key: 'tel',
            value: phone,
            require: true
          }])
        }),
        contentType: 'application/json',
        dataType: 'json',
        success: function (res) {
          if (res.code === 0) {
            showPrompt('领取金币成功')

          } else {
            showPrompt(res.errorMessage)
          }
        }
      })
    }
  });
})
