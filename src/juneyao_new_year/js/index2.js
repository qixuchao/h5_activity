$(function() {
  var query = jskit.utils.getUrlObj();
  if (jskit.isWechat && !query.headimgurl) {
    jskit.toLogin();
  }
  var headImgUrl = query.headimgurl;
  var nickName = query.real_name || '珺_戲言';
  var writeTxt = true; // 是手写还是选择
  var myTxt = '新年快乐'

  headImgUrl = 'http://nana.xiawan8.com/transform/image?url=' + headImgUrl
  var str = '<p>吉祥航空携</p><p><span class="J-user-name">' + nickName + '</span></p><p class="zhunin">祝您:</p>';
  $('.J-txt-content').html(str)

  $('.J-Header').find('img').attr('src', headImgUrl)
  $('.J-user-name').html(nickName)
  $('.J-page3-img').attr('src', headImgUrl)

  var mySwiper = new Swiper('.swiper-container', {
    on: {
      init: function() {
        swiperAnimateCache(this); //隐藏动画元素
        swiperAnimate(this); //初始化完成开始动画
      },
      // slideChangeTransitionEnd: function(){
      //   swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
      // }
    },
    // direction: 'vertical',  // 竖向滚动
    loop: false,

    navigation: {
      nextEl: '.J-go-next',
      prevEl: '.J-go-prev',
    },

    // 如果需要分页器
    pagination: {
      el: '.swiper-pagination',
    },

  })
  mySwiper.detachEvents();

  // 点击 我的祝福语  祝福语隐藏 input输入框出现
  $('.J-inp-content-p').on('click', function() {
    $(this).hide()
    $('.J-inp-content-inp').show().focus()
  })

  // 点击快捷祝福语  隐藏我的祝福语  显示快捷祝福语
  $('.J-txt-b').on('click', function() {
    writeTxt = false
    $('.J-txt-content-2').show().removeClass('txt-hide-animation').addClass('txt-show-animation')
    $(this).hide()
    $('.click-show').hide()
    $('.click-hide').show()
    $('.J-inp-content').removeClass('txt-show-animation').addClass('txt-hide-animation')
    setTimeout(function() {
      $('.J-inp-content').hide()
      $('.J-txt-a').show()
      $('.J-drop-down').slideDown(500)
    }, 200)
  })

  // 点击我的祝福语  隐藏快捷祝福语  显示我的祝福语
  $('.J-txt-a').on('click', function() {
    writeTxt = true
    $('.J-drop-down').slideUp(500)
    $('.J-inp-content').show()
    $('.J-txt-a').hide()
    $('.J-inp-content').removeClass('txt-hide-animation').addClass('txt-show-animation')
    setTimeout(function() {
      $('.J-txt-content-2').removeClass('txt-show-animation').addClass('txt-hide-animation')
    }, 500)
    setTimeout(function() {
      $('.J-txt-content-2').hide()
      $('.J-txt-b').show()
    }, 700)
  })

  $('.J-txt-content-2, .click-show').on('click', function() {
    $('.J-drop-down').slideDown(500)
    $('.click-show').hide()
    $('.click-hide').show()
  })

  $('.click-hide').on('click', function() {
    setTimeout(function() {
      $('.J-drop-down').slideUp(300)
      $('.click-show').show()
      $('.click-hide').hide()
    }, 200)
  })

  // 选择祝福语 添加选择背景  收起卷帘
  $('.J-cp').on('click', function() {
    var txt = $(this).html()
    $(this).siblings('.J-cp').removeClass('activity')
    $(this).addClass('activity')
    $('.J-choice-txt').html(txt)
      // 选择完毕之后，收起卷帘
    setTimeout(function() {
      $('.J-drop-down').slideUp(300)
      $('.click-show').show()
      $('.click-hide').hide()
    }, 200)
  })

  $('.J-go-page2').on('click', function() {
    var str = '<p>吉祥航空携</p><p><span class="J-user-name">' + nickName + '</span></p><p class="zhunin">祝您:</p>';
    $('.J-txt-content').html(str)
    if (writeTxt) {
      // 手写祝福语
      myTxt = $('.J-inp-content-inp').val()
    } else {
      // 选择祝福语
      myTxt = $('.J-choice-txt').html()
    }
    $('.J-page2-txt').html(myTxt)

    // 判断是否是手写  如果是选择就做逗号分隔  第三页展示
    if (!writeTxt && myTxt && myTxt.length > 9) {
      var txtArr = []
      txtArr = myTxt.split('，')
      for (var i = 0; i < txtArr.length; i++) {
        var shtml = '<p>' + txtArr[i] + '</p>';
        $('.J-txt-content').append(shtml)
      }
    } else {
      var shtml = '<p class="txt-p">' + myTxt + '</p>'
      $('.J-txt-content').append(shtml)
    }

  })


  var h = $(window).height() - $('.J-txt-b').offset().top - $('.J-txt-b').height()
  $('.J-c').css({
    height: h + 'px'
  })

  setTimeout(function() {
    $('.bling').show().addClass('bling-bling-bling')
  }, 1300)
  setTimeout(function() {
    $('.J-inp-content, .J-txt-b').fadeIn(800)
    var h = $(window).height() - $('.J-txt-b').offset().top - $('.J-txt-b').height()
    $('.J-c').css({
      height: h + 'px'
    })
  }, 1300)

  var canvas = document.getElementById('page03Canvas'); // 获取canvas
  var ctx = canvas.getContext("2d"); // 对应的CanvasRenderingContext2D对象(画笔)
  var img = new Image(); // 创建新的图片对象
  var base64 = ''; // base64
  canvas.setAttribute('height', '130');
  canvas.setAttribute('width', '130');
  img.setAttribute("crossOrigin", 'Anonymous') // headImgUrl
  img.src = headImgUrl // 'http://wx.qlogo.cn/mmopen/vi_32/NfSUuFVlu2eAtj032vsxlEHoCOAr1picyCFBic1FcukUmDrvVmFCopYBmCsC2pcXseYEXazYSOtHJRW2mJfhmjpw/132';
  img.onload = function() { //图片加载完，再draw 和 toDataURL
    ctx.drawImage(img, 0, 0);
    base64 = canvas.toDataURL("image/png");
    $('.J-page3-img').attr('src', base64)
  };


  $('.J-create-image').on('click', function() {
    $('.J-loader').show()
      //  html2canvas
    // html2canvas(document.getElementById('pageThree')).then(function(canvas) {
    //   document.getElementById('sagte').append(canvas)
    //   var image = new Image();
    //   image.src = canvas.toDataURL("image/png", 0.3);
    //   console.log(canvas.toDataURL("image/png", 0.3))
    //   console.log(canvas.height)
    //   $('.J-image-page').html(image)
    //   $('.J-page-02').hide()
    //   $('.J-image-page').show()
    //   $('.J-share-txt').show()
    //   $('.J-loader').hide()
    // });
    drawImage(function(){
      $('.J-page-02').hide()
      $('.J-image-page').show()
      $('.J-share-txt').show()
      $('.J-loader').hide()
    })
    // var tempImg = new Image()
    // tempImg.onload = function(){
    //     $('.J-image-page').html(tempImg)
    //     $('.J-page-02').hide()
    //     $('.J-image-page').show()
    //     $('.J-share-txt').show()
    //     $('.J-loader').hide()
    // }
    // tempImg.src = 'http://sso.xiawan8.com/api/user/merge?client_id=100001&sso_token='+query.sso_token+'=&signature=2a849ff5e3cbd4bc97c8aae0099cbd414d1702d9&text='+encodeURIComponent($('.J-page2-txt').text())
  })

  jskit.openShare && jskit.openShare({
    title: "吉祥航空",
    desc: "快来发送祝福给朋友吧",
    imgUrl: "http://static.xiawan8.com/activity/juneyao_new_year/image/wx_title.jpg",
    link: "http://static.xiawan8.com/activity/juneyao_new_year/index.html"
  });

  function drawImage(callback) {
    function loadImage(src, callback) {
      var img = new Image();
      img.onload = callback;
      img.setAttribute("crossOrigin", 'Anonymous')
      img.src = src;
    }

    var canvas = document.createElement('canvas');
    canvas.width = 750;
    canvas.height = 1334;
    document.getElementById('sagte').append(canvas)
    var ctx = canvas.getContext('2d');

    loadImage('./image/bg.png?va=1', function() {
      ctx.drawImage(this, 0, 0, this.width, this.height);
      loadImage(headImgUrl, function() {
        ctx.drawImage(this, 298, 406, 178, 178);


        //    var pattern = ctx.createPattern(this, "no-repeat");
        // // 绘制一个圆
        // ctx.arc(100, 50, 50, 0, 2 * Math.PI);
        // // 填充绘制的圆
        // ctx.fillStyle = pattern;
        // ctx.fill();    

        ctx.fillStyle = '#fff'; // 文字填充颜色  
        ctx.font = '46px Adobe Heiti Std';
        var nickname = query.real_name;
        var x = (750 - nickname.length * 38) / 2
        ctx.fillText(nickname, x, 705);
        nickname = $('.J-page2-txt').text();
        x = (750 - nickname.length * 38) / 2
        ctx.fillText(nickname, x, 835);
        ctx.stroke();

        var img = document.createElement('img')
        img.src = canvas.toDataURL("image/png", 0.3);
        $('.J-image-page').html(img)

        callback()
      })
    })
  }

})