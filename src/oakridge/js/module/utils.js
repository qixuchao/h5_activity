define(function (require, exports, module) {
  var $ = require("$");
  // var utils = require("module/utils");
  require("jweixin");
  var jskit = require("jskit");
  require("qttBridge");
  var QApp = require("QApp")
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  var base64encode = function (str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i === len) {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
        out += "==";
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i === len) {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
        out += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
  };
  /**
   * 将对象url参数化
   * @param  {object} paramObj 参数对象
   * @return {string}          url query param
   */
  var param = function(paramObj) {
    var str = [];
    for (var i in paramObj) {
      if (paramObj[i] !== undefined) {
        str.push(i + '=' + encodeURIComponent(paramObj[i]));
      }
    }
    return str.join('&');
  }
  /**
   * 增加参数
   *
   * @param {string}  url
   * @param {object}  params
   * @param {boolean} isAddAuth 是否增加认证
   */
  var addParam = function(url, params) {
    var SEARCH_REG = /\?([^#]*)/,
      HASH_REG = /#(.*)/,
      searchStr;

    url = url || '';
    var search = {},
      searchMatch = url.match(SEARCH_REG);

    if (searchMatch) {
      search = parseUrl(searchMatch[0]);
    }

    //合并当前search参数
    search = Object.assign(search, params);

    searchStr = '?' + param(search);

    //是否存在search
    if (SEARCH_REG.test(url)) {
      url = url.replace(SEARCH_REG, searchStr);
    } else {
      //是否存在hash
      if (HASH_REG.test(url)) {
        url = url.replace(HASH_REG, searchStr + '#' + url.match(HASH_REG)[1]);
      } else {
        url += searchStr;
      }
    }
    return url;
  }

  var copyLink = function (link) {
    console.log('======复制链接======');
    var input = document.createElement('input');
    input.value = link;
    input.style.opacity = '0';
    input.style.position = 'absolute';
    input.style.left = '-9999999';
    document.body.appendChild(input);
    input.focus();
    input.setSelectionRange(0, input.value.length);
    document.execCommand("copy", false, null);
    input.remove();
    showToast('已复制链接！');
    $('#modal').show();
  };

  var ua = window.navigator.userAgent;
  var env = {
    isWechat: /MicroMessenger/i.test(ua),
    isIphone: /iPhone/ig.test(ua),
    isAndroid: /Android|Linux/.test(ua),
    isIos: /\(i[^;]+;( U;)? CPU.+Mac OS X/ig.test(ua),
    isQTT: /qukan|clicash/.test(ua),
    isQuickApp: /com.fancy.simple/.test(ua)
  };

  var getUrlParams = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
  };
  var parseUrl = function (str, isNoCaseSensitive) {
    var arr,
      part,
      url = {};
    //去掉首位空格
    if (!(str || '').replace(/^\s+|\s+$/, '')) {
      return {};
    }

    str = str.replace(/\S*\?/, '');

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
  };

  var getUrlObj = function (isNoCaseSensitive) {
    return parseUrl(location.search, false, isNoCaseSensitive);
  };

  var checkLogin = function (callback) {
    try {
      var activityRecordId = getUrlParams('activityRecordId');
      if (activityRecordId) {
        sessionStorage.setItem('activityRecordId', activityRecordId);
      }

      window.activityRecordId = sessionStorage.getItem('activityRecordId');

      if (QTTB.isQTT) {
        console.log('======趣头条环境======');
        callback(QTTB.getToken());
      } else if (jskit.isWechat) {
        console.log('======微信环境======');
        var token = getUrlParams('sso_token') || sessionStorage.getItem('sso_token');
        if (!token) {
          if (jskit.toLogin) {
            console.log('======微信登录======');
            jskit.toLogin('http://static.xiawan8.com/activity/model/middlePage.html?ret=' + encodeURIComponent(location.href));
          }
        } else {
          if (getUrlParams('sso_token')) {
            sessionStorage.setItem('sso_token', token);
            history.replaceState('', document.title, window.location.pathname);
          }
          callback(token);
        }
      } else {
        callback();
      }
    } catch (e) {
      console.log(e);
      callback();
    }
  };

  var ajax = function (params) {
    $.ajax({
      url: params.url,
      type: params.method || 'get',
      data: params.data,
      contentType: 'application/json',
      success(response) {
        params.callback(response);
      },
      error(error) {
        'use strict';
        showToast(error);
      }
    });
  };

  checkLogin(function (token) {
    window.SSO_TOKEN = token;
    window.ENCODE_TOKEN = jskit.isWechat ? '' : base64encode(token || '12424114241');
    $(window.init);
  });

  var showToast = function (message) {
    var node = $('<div class="toast">' + message + '</div>');
    node.appendTo(document.body);
    setTimeout(function () {
      node.fadeOut(300, function () {
        node.remove();
      });
    }, 1500);
  };
  module.exports = {
    showToast: showToast,
    checkLogin: checkLogin,
    copyLink: copyLink,
    getUrlParams: getUrlParams,
    ajax: ajax,
    getUrlObj: getUrlObj,
    env: env,
    addParam: addParam,
    param: param,
  };
});
