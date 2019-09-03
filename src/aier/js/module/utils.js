define(function(require, exports, module) {
  var $ = require("$");
  // var utils = require("module/utils");
  require("jweixin");
  var jskit = require("jskit");
  require("qttBridge");
  //var commonUtils = require("module/common")
  var QApp = require("QApp");
  var base64EncodeChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  var pathname = location.pathname.split("/");
  pathname.pop();
  pathname = pathname.join("/");

  var BASE_HOST = location.protocol + "//" + location.host + pathname + "/";

  var base64encode = function(str) {
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
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
        out += base64EncodeChars.charAt((c2 & 0xf) << 2);
        out += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
      out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
      out += base64EncodeChars.charAt(c3 & 0x3f);
    }
    return out;
  };
  // 获取指定长度的随机数
  var getRandom = function(num) {
    var _num = num || 1;
    return parseInt(Math.random() * _num);
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
        str.push(i + "=" + encodeURIComponent(paramObj[i]));
      }
    }
    return str.join("&");
  };
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

    url = url || "";
    var search = {},
      searchMatch = url.match(SEARCH_REG);

    if (searchMatch) {
      search = parseUrl(searchMatch[0]);
    }

    //合并当前search参数
    search = Object.assign(search, params);

    searchStr = "?" + param(search);

    //是否存在search
    if (SEARCH_REG.test(url)) {
      url = url.replace(SEARCH_REG, searchStr);
    } else {
      //是否存在hash
      if (HASH_REG.test(url)) {
        url = url.replace(HASH_REG, searchStr + "#" + url.match(HASH_REG)[1]);
      } else {
        url += searchStr;
      }
    }
    return url;
  };

  var copyLink = function(link) {
    console.log("======复制链接======");
    var input = document.createElement("input");
    input.value = link;
    input.style.opacity = "0";
    input.style.position = "absolute";
    input.style.left = "-9999999";
    document.body.appendChild(input);
    input.focus();
    input.setSelectionRange(0, input.value.length);
    document.execCommand("copy", false, null);
    if(window.clipboardData){
      clipboardData.setData("Text",link);
    }
    input.remove();
    showPrompt("已复制链接！");
    // $(".share-modal").show();
  };

  var ua = window.navigator.userAgent;
  var env = {
    isWechat: /MicroMessenger/i.test(ua),
    isIphone: /iPhone/gi.test(ua),
    isAndroid: /Android|Linux/.test(ua),
    isIos: /\(i[^;]+;( U;)? CPU.+Mac OS X/gi.test(ua),
    isQTT: /qukan|clicash/.test(ua),
    isQuickApp: /com.fancy.simple/.test(ua)
  };

  var getUrlParams = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
  };
  var parseUrl = function(str, isNoCaseSensitive) {
    var arr,
      part,
      url = {};
    //去掉首位空格
    if (!(str || "").replace(/^\s+|\s+$/, "")) {
      return {};
    }

    str = str.replace(/\S*\?/, "");

    if (str) {
      if (isNoCaseSensitive) {
        str = str.toLocaleLowerCase();
      }

      arr = str.split("&");
      for (var i in arr) {
        part = arr[i].split("=");
        url[part[0]] = decodeURIComponent(part[1]);
      }
    }
    return url;
  };

  var getUrlObj = function(isNoCaseSensitive) {
    return parseUrl(location.search, !!isNoCaseSensitive);
  };

  //写cookies
  var setCookie = function(name, value, expire) {
    expire = expire || 0;
    var exp = new Date();
    exp.setTime(exp.getTime() + expire);
    document.cookie =
      name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  };

  //读取cookies
  var getCookie = function(name) {
    var arr,
      reg = new RegExp(name + "=([^;]*)");
    if ((arr = document.cookie.match(reg))) return unescape(arr[1]);
    else return null;
  };

  //删除cookies
  var delCookie = function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  };

  var SSO_TOKEN_KEY = "SSO_TOKEN";
  function saveToken(val) {
    setCookie(SSO_TOKEN_KEY, val, 3 * 24 * 60 * 60 * 1000);
  }

  function getToken() {
    return getCookie(SSO_TOKEN_KEY);
  }

  var timer = null;
  var showPrompt = function(data, time) {
    time = time || 1500;
    var $prompt = $('<div class="ui-prompt">' + data + "</div>");
    $("body").append($prompt);
    timer = setTimeout(function() {
      $prompt.remove();
    }, time);
  };

  var ajax = function(params) {
    $.ajax({
      url: params.url,
      type: params.method || "get",
      data: params.data,
      contentType: "application/json",
      success: function(response) {
        if (response.code === 501) {
          //commonUtils.toLogin()
          jskit.toLogin(
            BASE_HOST +
            "middlePage.html?ret=" +
            encodeURIComponent(
              addParam(location.href, {
                SSO_TOKEN: ""
              })
            )
          );
        }
        params.callback(response);
      },
      error: function(error) {
        // showPrompt(error);
      }
    });
  };

  var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
  var chnUnitChar = ["", "十", "百", "千"];

  function sectionToChinese(section) {
    var strIns = "",
      chnStr = "";
    var unitPos = 0;
    var zero = true;
    while (section > 0) {
      var v = section % 10;
      if (v === 0) {
        if (!zero) {
          zero = true;
          chnStr = chnNumChar[v] + chnStr;
        }
      } else {
        zero = false;
        strIns = chnNumChar[v];
        strIns += chnUnitChar[unitPos];
        chnStr = strIns + chnStr;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }
    return chnStr;
  }

  function numberToChinese(num) {
    var unitPos = 0;
    var strIns = "",
      chnStr = "";
    var needZero = false;

    if (num === 0) {
      return chnNumChar[0];
    }

    while (num > 0) {
      var section = num % 10000;
      if (needZero) {
        chnStr = chnNumChar[0] + chnStr;
      }
      strIns = sectionToChinese(section);
      strIns += section !== 0 ? chnUnitSection[unitPos] : chnUnitSection[0];
      chnStr = strIns + chnStr;
      needZero = section < 1000 && section > 0;
      num = Math.floor(num / 10000);
      unitPos++;
    }

    return chnStr;
  }

  // 检测微信头像是不是暂无显示
  window.checkHeadImage = function(e) {
    e.onload = null;
    if (e.naturalHeight == 120 && e.naturalWidth == 120) {
      e.src = "//static.xiawan8.com/activity/common/default_avatar.png";
    }
  };

  module.exports = {
    copyLink: copyLink,
    getUrlParams: getUrlParams,
    ajax: ajax,
    getUrlObj: getUrlObj,
    setCookie: setCookie,
    getCookie: getCookie,
    getToken: getToken,
    saveToken: saveToken,
    env: env,
    SSO_TOKEN_KEY: SSO_TOKEN_KEY,
    addParam: addParam,
    param: param,
    showPrompt: showPrompt,
    getRandom: getRandom,
    numberToChinese: numberToChinese
  };
});
