define(function (require, modules, exports) {
  var $ = require('$')
  require('Swiper')
  var shareUtils = require("module/share")
  var utils = require("module/utils");
  require("./shareContent")

  /*
  * 主要是解决在js中使用图片的应用地址时，打包后图片找不到的问题
  * seajs.resolve(url)返回的图片地址的后缀会以.js结尾
  * */
  function getImgResolve(url){
    return seajs.resolve(url).replace(/.js$/, '')
  }

  var questionList = {
    page_1: [{
      titleImg: './images/aier_question_img1.jpg',
      questionLabel: '1. 您家中的小孩是否近视？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }, {
      titleImg: './images/aier_question_img2.jpg',
      questionLabel: '2. 您家中小孩近视的度数？',
      answers: {
        A: 'A. 100-200度',
        B: 'B. 200-500度',
        C: 'C. 500度以上',
      },
    }, {
      titleImg: './images/aier_question_img3.jpg',
      questionLabel: '3. 您是否知道如何防控小孩的近视？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }, {
      titleImg: './images/aier_question_img4.jpg',
      questionLabel: '4. 您小孩的近视问题是否在近一年内出现？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }, {
      titleImg: './images/aier_question_img5.jpg',
      questionLabel: '5. 您是否了解过爱尔眼科？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }],
    page_2: [{
      titleImg: './images/aier_question_img1.jpg',
      questionLabel: '1. 您/您家人是否长期使用手机、电脑等电子产品？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }, {
      titleImg: './images/aier_question_img2.jpg',
      questionLabel: '2. 您/您家人是否在工作和生活中存在长期熬夜的现象？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }, {
      titleImg: './images/aier_question_img3.jpg',
      questionLabel: '3. 您/您家人是否长期佩戴隐形眼镜？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }, {
      titleImg: './images/aier_question_img4.jpg',
      questionLabel: '4. 您/您家人是否饲养或者长期接触猫狗等宠物？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }, {
      titleImg: './images/aier_question_img5.jpg',
      questionLabel: '5. 您/您家人是否愿意接受专业全面的眼部检查？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }],
    page_3: [{
      titleImg: './images/aier_question_img3.jpg',
      questionLabel: '1. 您或您的家人视力是否有以下症状？',
      answers: {
        A: 'A. 视物浑浊、模糊',
        B: 'B. 看东西重影',
      },
    }, {
      titleImg: './images/aier_question_img6.jpg',
      questionLabel: '2. 您或您的家人是否有以下病史？',
      answers: {
        A: 'A. 眼部外伤史',
        B: 'B. 眼部炎症史',
        C: 'C. 眼部手术史',
      },
    }, {
      titleImg: './images/aier_question_img7.jpg',
      questionLabel: '3. 您或您的家人是否患有白内障',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }, {
      titleImg: './images/aier_question_img8.jpg',
      questionLabel: '4. 您/您家人是了解过爱尔眼科医院？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }, {
      titleImg: './images/aier_question_img4.jpg',
      questionLabel: '5. 您/您家人是否愿意接受专业全面的眼科手术治疗？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }],
    page_4: [{
      titleImg: './images/aier_question_content.png',
      questionLabel: '1. 您或您的家人视力是否有以下症状？',
      answers: {
        A: 'A. 视物浑浊、模糊',
        B: 'B. 看东西重影',
      },
    }, {
      titleImg: './images/aier_question_img9.jpg',
      questionLabel: '2. 您/您家人是了解过爱尔眼科？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }, {
      titleImg: './images/aier_question_img7.jpg',
      questionLabel: '3. 您/您家人的视力问题是否在近一年内出现？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }, {
      titleImg: './images/aier_question_img1.jpg',
      questionLabel: '4. 您/您家人是否愿意接受专业全面的眼部检查？',
      answers: {
        A: 'A. 是',
        B: 'B. 否',
      },
    }]
  }

  var getUrlParams = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
  };

  var _pageType = getUrlParams('page_type') || 'page_1'

  _ft_.push(['pv', _pageType])

  $(function ($) {

    var answer = {}

    // 初始化分享微信
    if (utils.env.isWechat) {
      shareUtils.initShare({
        title: shareContent[_pageType].title,
        desc: shareContent[_pageType].desc,
        link: shareContent[_pageType].link,
        success: function (e) {
          _ft_.push(["action", "share_success"]);
        },
        cancel: function (e) {
          _ft_.push(["action", "share_cancel"]);
        }
      });
    }

    $(document).on('click', '.ui-radio', function (e) {
      var questionClassName = $(e.currentTarget).parents()[3].className
      $('.'+questionClassName+' .ui-radio').removeClass('ui-radio-select')
      $('.'+questionClassName+' .J-next').removeClass('ui-disable').attr('disabled', null)
      answer[questionClassName.split('-')[1]] = $(this).addClass('ui-radio-select').attr('currentValue')
    })

    var pageType = ['page_1', 'page_2', 'page_3', 'page_4']

    pageType.forEach(function (val, index) {
      if (new RegExp(val).test(_pageType)) {
        var questionCard = []
        questionList[val].forEach(function (value, index) {
          var _answer = Object.keys(value.answers)
          var answerHtml = _answer.map(function (an) {
            var _answerHtml = '<button class="ui-btn ui-radio" currentValue="'+an+'" >'+value.answers[an]+'</button >'
            if (_answer.length > 2) {
              _answerHtml = '<button class="ui-btn ui-radio multi-radio" currentValue="'+an+'" >'+value.answers[an]+'</button >'
            }
            return _answerHtml
          })

          var jumpButton = '<button class="ui-btn ui-jump-btn J-prev" >上一题</button >\n' +
            '<button class="ui-btn ui-jump-btn ui-disable J-next" disabled >下一题</button >'

          if (index + 1 === questionList[val].length) {
            jumpButton = '<button class="ui-btn ui-jump-btn J-prev" >上一题</button >\n' +
              '<button class="ui-btn ui-question-submit ui-disable J-next not-wechat is-wechat" disabled >提交问卷</button >'+
              '<button class="ui-btn ui-question-submit ui-disable J-next qtt" disabled >提交问卷领取金币</button >'
          }

          if (index === 0) {
            jumpButton = '<button class="ui-btn ui-jump-btn J-prev ui-disable" disabled>上一题</button >\n' +
              '<button class="ui-btn ui-jump-btn ui-disable J-next" disabled >下一题</button >'
          }

          var questionHtml = ' <div class="swiper-slide swiper-no-swiping" >\n' +
          '        <div class="question-'+(index + 1)+'" >\n' +
          '          <p class="question-total" >第'+(index+1)+'题/共'+questionList[val].length+'题</p >\n' +
          '          <div class="question-card" >\n' +
          '            <div class="question-img" >\n' +
          '              <img src="'+getImgResolve(value.titleImg)+'" alt="" >\n' +
          '            </div >\n' +
          '            <div class="content" >\n' +
          '              <p class="question-content" >\n' + value.questionLabel+
          '              </p >\n' +
          '              <div class="question-select" >\n' + answerHtml.join(' ') +
          '              </div >\n' +
          '              <div class="jump-btn" >\n' +jumpButton+
          '              </div >\n' +
          '            </div >\n' +
          '          </div >\n' +
          '        </div >\n' +
          '      </div >'

          if (val === 'page_4' && index === 0) {
            questionHtml = ' <div class="swiper-slide swiper-no-swiping" >\n' +
              '        <div class="question-'+(index + 1)+'" >\n' +
              '          <p class="question-total" >第'+(index+1)+'题/共'+questionList[val].length+'题</p >\n' +
              '          <div class="question-card" >\n' +
              '            <div class="question-img" >\n' +
              '              <p>1、按以下步骤进行自测，选择您所看到的图像</p>' +
              '              <p><span class="question-step">步骤一:</span> 把方格表放在视平线30厘米处，保证周围光线清晰、平均；' +
              '                 <span class="question-step">步骤二:</span> 老花或近视者需佩戴原有眼镜进行测试；' +
              '                 <span class="question-step">步骤三:</span> 用手遮盖左眼，右眼凝视方格表中心黑点；步骤四: 重复步骤1~3检查右眼。</p>' +
              '            </div >\n' +
              '            <div class="content content-img" >\n' +
              '              <div class="question-select" >\n' +
              '                <img alt="" src="'+getImgResolve(value.titleImg)+'"/>\n'+
              '              </div >\n'+
              '              <p>如您自测结果为B\\C\\D图像，则可能提示眼底存在病变,请继续填写问卷</p>'+
              '              <div class="jump-btn" >\n'+
              '               <button class="ui-btn ui-jump-btn J-prev ui-disable" disabled>上一题</button >\n' +
              '               <button class="ui-btn ui-jump-btn J-next" >下一题</button >'+
              '              </div >\n' +
              '            </div >\n' +
              '          </div >\n' +
              '        </div >\n' +
              '      </div >'
          }

          questionCard.push(questionHtml)

        })

        $('.swiper-wrapper').empty().append(questionCard.join(''))
        new Swiper('#question', {
          navigation: {
            nextEl: '.J-next',
            prevEl: '.J-prev',
          },
        })
      }
    })

    var param = function(paramObj) {
      var str = [];
      for (var i in paramObj) {
        if (paramObj[i] !== undefined) {
          str.push(i + "=" + encodeURIComponent(paramObj[i]));
        }
      }
      return str.join("&");
    };

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

    $('.ui-question-submit').click(function () {
      location.href = addParam('./form.html', {answer: JSON.stringify(answer), page_type: _pageType})
    })
  })
})
