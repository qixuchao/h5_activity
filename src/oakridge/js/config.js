var pathname = location.pathname.split('/')
pathname.pop()
pathname = pathname.join("/")

seajs.config({
  alias:{
    jweixin:"https://res.wx.qq.com/open/js/jweixin-1.4.0.js",
    qttBridge:'//static.xiawan8.com/qttBridge/qttBridge.js',
    $:'//static.xiawan8.com/module/vendor/zepto.min.js',
    jquery:'//static.xiawan8.com/module/vendor/jquery-3.4.1.min.js',
    Swiper:"//static.xiawan8.com/module/vendor/swiper.min.js",
    jskit:"//static.xiawan8.com/module/jskit.js",
    QApp: "//static.xiawan8.com/module/qshare.js",
    clipboard: "//static.xiawan8.com/module/vendor/clipboard.min.js",
  },
  preload: [], // 预加载
  // 路径配置
  // paths: {
  //   'static': '//static.xiawan8.com/module'
  // },
  base: '//'+location.host+pathname+ '/js/',
})

