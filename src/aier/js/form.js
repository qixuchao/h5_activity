define(function (require, exports, module) {
  'use strict';
  var $ = require("$");
  require("../lib/formValidate")($);
  require('./cityData')
  $(function () {

    var provinceList = []
    var cityList = []
    var location = []
    var $province = $('[name=province]')

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
      var age = $('.age').val();
      var city = $('[name=city]').val();
      var province = $('[name=province]').val();
      var location = $('[name=location]').val();
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
        page_type: getUrlParams('page_type'),
        answer: answer,
      };
      $.ajax({
        url: 'http://openapi.fancysmp.com/api/create?project=aier_new',
        type: 'post',
        processData: true,
        data: params,
        dataType: 'json',
        success: function (res) {
          if (res.code === 0) {
            showPrompt('提交成功');
            setTimeout(function () {
              window.location.href = './success.html?page_type=' + getUrlParams('page_type')
            }, 300)

            _ft_.push(['action', 'submit_success']);
          } else {
            _ft_.push(['action', 'submit_error']);
            showPrompt(res.message);
          }
        }
      });
    })

  });
});
