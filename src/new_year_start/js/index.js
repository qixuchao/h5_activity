$(function() {
  var cardSwiper = {};
  var checkedCard = false

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
    cardSwiper = new Swiper('.card-swiper-container', {
      speed: 13,
      effect : 'flip',
      autoplay: {delay: 13},
      loop : true,
    })
    checkedCard = false
    setTimeout(function() {
      cardSwiper.autoplay.stop()
      checkedCard = true
    }, 1500)
  })

  // 第二页  右侧按钮  再抽一次
  $('.J-start-again').on('click', function() {
    cardSwiper.autoplay.start()
    checkedCard = false
    setTimeout(function() {
      cardSwiper.autoplay.stop()
      checkedCard = true
    }, 1500)
  })

  // 第二页  左侧按钮  分享情缘
  $('.J-share-btn').on('click', function() {
    if (checkedCard) {
      var key = cardSwiper.activeIndex;
      if (key == 13) {
        key = 1
      }
      $('.J-loader').show()
      var img = new Image() // 创建新的图片对象
      img.src = './image/page3/page3_'+ key +'.jpg'
      img.onload = function() { // 图片加载完
        $('.J-page3-img').html(img)
        $('.J-page-3').fadeIn(400);
        $('.J-loader').hide()
      };
    } else {
      alert('请先抽取您的情缘，再进行分享噢~')
    }
  })

})
