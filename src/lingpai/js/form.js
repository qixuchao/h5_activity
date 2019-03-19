var host = 'http://crider.test.fancydsp.com/'

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

  var showPrompt = function (data) {
    var $prompt = $('.prompt');
    $prompt.css({ display: 'block' });
    $prompt.text(data);
    timer = setTimeout(function () {
      $prompt.css({ display: 'none' });
      clearTimeout(timer);
    }, 1500);
  };

  province = $.map(Object.keys(datas), function(value) {
    return '<option value='+datas[value].code+','+datas[value].name+'>'+datas[value].name+'</option>'
  })
  $('#province').append(province)

  $('#province').change(function(e){
    var $city = $("#city");
    var $dealer = $("#dealer");
    provinceCode = e.target.value && e.target.value.split(',')[0]
    $city.replaceWith('<select id="city"><option value="">请选择市/区</option></select>');
    $dealer.replaceWith('<select id="dealer"><option value="">请选择经销商</option></select>');
    var provinceChild = e.target.value ? datas[e.target.value.split(',')[0]]: {}
    var data = Object.keys(provinceChild.child)
    city = $.map(data, function(value) {
      return '<option value='+provinceChild.child[value].code+','+provinceChild.child[value].name+'>'+provinceChild.child[value].name+'</option>'
    })
    $('#city').append(city)
    $('#city').change(function(e){
      var $dealer = $("#dealer");
      $dealer.replaceWith('<select id="dealer"><option value="">请选择经销商</option></select>');
      var cityChild = e.target.value ? datas[provinceCode].child[e.target.value.split(',')[0]] : {}
      dealer = $.map(Object.keys(cityChild.child), function(value){
        return '<option value='+cityChild.child[value].code+','+cityChild.child[value].name+'>'+cityChild.child[value].name+'</option>'
      })
      $('#dealer').append(dealer)
    })
  })

  $('.form-submit').click(function () {
    var name = $('.name').val();
    var phone = $('.phone-num').val();
    var provinceId = $('#province').val();
    var cityId = $('#city').val();
    var dealerId = $('#dealer').val();
    var message = '';
    if (!name) {
      message = '用户名必需填写';
    } else if (!(phone && phone.length === 11)) {
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
        PROVINCE: +provinceId.split(',')[0],
        CITY: +cityId.split(',')[0],
        DEALER: dealerId.split(',')[0],
        SERIES: '4374B1D6-6F2E-4892-AFC6-2B06E76248A0',
        LEAD_TYPE: '771A1CF7-0E2C-440B-9D0E-5F5D792431DC',
        CREATED_TIME: (new Date()).Format('YYYY-MM-DD hh:mm:ss'),
        MARKETING_NUMBER: '1-54383317'
      }]
    };
    var localParams = {
      TRUE_NAME: name,
      MOBILE: phone,
      PROVINCE: provinceId,
      CITY: cityId,
      DEALER: dealerId,
      SERIES: '4374B1D6-6F2E-4892-AFC6-2B06E76248A0',
      LEAD_TYPE: '771A1CF7-0E2C-440B-9D0E-5F5D792431DC',
      MARKETING_NUMBER: '1-54383317'
    };
    $.ajax({
      url: host+'AdLeadsService.asmx',
      type: 'post',
      processData: true,
      data: params,
      contentType: 'application/json',
      dataType: 'json',
      success: function (response) {
        if (response.code === 0) {
          showPrompt('提交成功');
          setTimeout(function(){
            location.href = './success.html'
          }, 500)
          // $.ajax({
          //   url: '',
          //   type: 'post',
          //   processData: false,
          //   contentType: 'application/json',
          //   data: JSON.stringify({datas: params.datas}),
          //   dataType: 'json',
          // });
        }
      },
    });
  });
})
