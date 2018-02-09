$(function() {
  var cardNum = 0

  // 初始化swiper
  var mySwiper = new Swiper ('.swiper-container', {
    on: {
      init: function(){
        swiperAnimateCache(this); // 隐藏动画元素
        swiperAnimate(this); // 初始化完成开始动画
      },
    },
    loop: false,
    navigation: {
      nextEl: '.J-go-next',
      prevEl: '.J-go-prev',
    },
  })

  // 禁止swiper滑动  只有点击状态切换
  mySwiper.detachEvents();

  // 第一页 开始抽牌
  $('.J-go-page2').on('click', function() {
    // 随机一个 1-12之间的数
    cardNum = parseInt(Math.random()*12) + 1
    $('.J-choice-card').html('<img src="./image/card/card' + cardNum + '.jpg" />')
    // loader动画展示
    $('.J-loader-txt, .J-loader').show()
    setTimeout(function() {
      $('.J-card-content').show()
      $('.J-loader-txt, .J-loader').hide()
    }, 1500)
  })

  // 第二页  右侧按钮  再抽一次
  $('.J-start-again').on('click', function() {
    cardNum = parseInt(Math.random()*12) + 1
    $('.J-choice-card').html('<img src="./image/card/card' + cardNum + '.jpg" />')
    // 显示抽奖动画
    $('.J-loader-txt, .J-loader').show()
    // 隐藏卡片容器
    $('.J-card-content').hide()
    setTimeout(function() {
      // 显示卡片容器
      $('.J-card-content').show()
      // 隐藏抽奖动画
      $('.J-loader-txt, .J-loader').hide()
    }, 1500)
  })

  // 第二页  左侧按钮  分享情缘
  $('.J-share-btn').on('click', function() {
    $('.J-loader').show()
    var img = new Image() // 创建新的图片对象
    img.src = './image/page3/page3_'+ cardNum +'.jpg'
    img.onload = function() { // 图片加载完
      $('.J-page3-img').html(img)
      $('.J-page-3').fadeIn(400);
      $('.J-loader').hide()
    };
  })
})
