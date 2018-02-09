$(function() {
  var query = jskit.utils.getUrlObj();
  if(!query.headimgurl){
    jskit.toLogin();
  }
  var HeadImgUrl = query.headimgurl;
  var NickName = query.real_name;
  var writeTxt = true;

  $('.J-Header').find('img').attr('src', HeadImgUrl)
  $('.J-user-name').html(NickName)
  $('#page03Img').attr('src', HeadImgUrl)

  var mySwiper = new Swiper ('.swiper-container', {
    on: {
      init: function(){
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
    $('.J-inp-content-inp').show()
    $('.J-inp-content-inp').focus()
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

  $('.J-go-next').on('click', function() {
    var myTxt = '新年快乐'
    if (writeTxt) {
      // 手写祝福语
      myTxt = $('.J-inp-content-inp').val()
    } else {
      // 选择祝福语
      myTxt = $('.J-choice-txt').html()
    }
    $('.J-page2-txt').html(myTxt)
  })


  var h = $(window).height() - $('.J-txt-b').offset().top - $('.J-txt-b').height()
  $('.J-c').css({height: h + 'px'})

  setTimeout(function() {
    $('.bling').show().addClass('bling-bling-bling')
  }, 1300)
  setTimeout(function() {
    $('.J-inp-content, .J-txt-b').fadeIn(800)
    var h = $(window).height() - $('.J-txt-b').offset().top - $('.J-txt-b').height()
    $('.J-c').css({height: h + 'px'})
  }, 2300)

  // var canvas = document.getElementById('page03Canvas'); // 获取canvas
  // var ctx = canvas.getContext("2d"); // 对应的CanvasRenderingContext2D对象(画笔)
  // var img = new Image();  // 创建新的图片对象
  // var base64 = '' ; // base64
  // canvas.setAttribute('height', '130');
  // canvas.setAttribute('width', '130');
  // img.setAttribute("crossOrigin",'Anonymous') // HeadImgUrl
  // img.src = HeadImgUrl // 'http://wx.qlogo.cn/mmopen/vi_32/NfSUuFVlu2eAtj032vsxlEHoCOAr1picyCFBic1FcukUmDrvVmFCopYBmCsC2pcXseYEXazYSOtHJRW2mJfhmjpw/132';
  // img.onload = function() {//图片加载完，再draw 和 toDataURL
  //   ctx.drawImage(img,0,0);
  //   base64 = canvas.toDataURL("image/png");
  //   $('#page03Img').attr('src', base64)
  // };




  $('.J-create-image').on('click', function(){
    var page2Txt = $('.J-page2-txt').html()
    $('.J-page3-txt').html(page2Txt)
    $('.J-loader').show()
    //  html2canvas
    html2canvas(document.getElementById('pageThree')).then(function(canvas) {
      var image = new Image();
      image.src = canvas.toDataURL("image/jpg");
      $('.J-image-page').html(image)
      $('.J-page-02').hide()
      $('.J-image-page').show()
      $('.J-share-txt').show()
      $('.J-loader').hide()
    });
  })

  jskit.openShare && jskit.openShare({
    title: "吉祥航空",
    desc: "快来发送祝福给朋友吧",
    imgUrl: "http://static.xiawan8.com/activity/juneyao_new_year/image/wx_title.jpg",
    link: location.href
  });

})
