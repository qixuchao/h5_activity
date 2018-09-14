!(function(){
  var deviceWidth = window.innerWidth
  var dpi = deviceWidth/750*32
  var cakeConfig = {
    0: {
      text: '五仁',
      ele: ''
    },
    1: {
      text: '蛋黄',
      ele: ''
    },
    2: {
      text: '鲜肉',
      ele: ''
    }
  }
  var imgConfig = [
    {class: 'J-home-bottom', src: 'image/home/bottom.png', id: 'bottom'},
    {class: 'J-start-create-cake', src: 'image/home/btn1.png', id: 'btn1'},
    {class: 'J-home-title', src: 'image/home/title.png', id: 'title'},
    {class: 'J-home-lantern', src: 'image/home/lantern.png', id: 'lantern'},
    {class: 'J-home-bottom', src: 'image/home/bottom.png', id: 'bottom'},
    {class: 'J-close-modal-btn', src: 'image/public/close.png', id: 'close'},
    {class: 'J-rule-content', src: 'image/public/rule_bg.png', id: 'ruleBg'},
    {class: 'J-logo', src: 'image/public/logo.png', id: 'logo'},
    {class: 'J-tutorial-modal-desc', src: 'image/public/tutorial_desc.png', id: 'tutorialDesc'},
    {class: 'J-tutorial-modal-left-hand', src: 'image/public/left_hand.png', id: 'leftHand'},
    {class: 'J-tutorial-modal-right-hand', src: 'image/public/right_hand.png', id: 'rightHand'},
    {class: 'J-moon-bg', src: 'image/public/moon.png', id: 'moon'},
    {class: 'J-tuzi', src: 'image/game/tuzi.png', id: 'tuzi'},
    {class: 'J-page-cake-cloud', src: 'image/cake/cloud.png', id: 'cloud'},
    {class: 'J-curtain', src: 'image/cake/curtain.png', id: 'curtain'},
    {class: 'J-congratulations', src: 'image/cake/congratulations.png', id: 'congratulations'},
    {class: 'J-lantern-group', src: 'image/cake/lantern-group.png', id: 'lanternGroup'},
    {class: 'J-cake-bg', src: 'image/cake/cake.png', id: 'cake'},
    {class: 'J-btn-content-bg', src: 'image/cake/cake-btn.png', id: 'cakeBtn'},
    {class: false, src: 'image/cake/dh.png', id: 'dh'},
    {class: false, src: 'image/cake/xr.png', id: 'xr'},
    {class: false, src: 'image/cake/wr.png', id: 'wr'},
  ]

  // 预加载
  function PreloadImage(imgConfig) {
    this.imgConfig = imgConfig || []
    this.resource = this.imgConfig.map(function(item) {
      return {
        src: item.src,
        id: item.id
      }
    })
    this.init()
  }
  PreloadImage.prototype = {
    preload: '',
    init: function() {
      this.preload = new createjs.LoadQueue(true)
      this.preload.on("progress", this.handleFileProgress.bind(this))
      this.preload.on("complete", this.loadComplete.bind(this))
      this.preload.on("error", this.loadError.bind(this))
      this.preload.loadManifest(this.resource)
    },
    // 加载进度
    handleFileProgress: function() {
      $('.J-loading-txt').html((this.preload.progress*100|0) + " %")
    },
    //全部源加载完毕
    loadComplete: function(e) {
      var preload = this.preload
      this.imgConfig.forEach(function(item) {
        if (item.class) {
          $('.'+item.class).html(preload.getResult(item.id))
        }
      })
      cakeConfig[0].ele = preload.getResult("wr")
      cakeConfig[1].ele = preload.getResult("dh")
      cakeConfig[2].ele = preload.getResult("xr")
      $('.J-dialog').fadeOut(200).remove()
    },
    loadError: function() {
      //alert("加载出错，请检查网络！");
    },
  }

  new PreloadImage(imgConfig)

  function getRandom(min,max){
    return Math.floor(min+Math.random()*max)
  }

  function Material(config){
    this.config = config
    this.init(config)
    this.$container = $(config.container)
  }
  Material.prototype = {
    init: function(config) {
      this.$element = $('<img class="material" src="'+config.url+'">')
      this.$element.css({
        width:config.width/32+'rem',
        height:config.height/32+'rem',
        left:config.left/32+'rem'
      })

      this.$element.on('transitionEnd webkitTransitionEnd',function() {
        this.destroy()
      }.bind(this))
    },
    appendTo: function($container) {
      this.$container.append(this.$element)
    },
    getBoundingClientRect: function() {
      return this.$element[0].getBoundingClientRect()
    },
    destroy: function(){
      this.$element.remove()
    },
    run: function() {
      setTimeout(function(){
        this.$element.css({
          transform: 'translateY('+window.innerHeight/32*3+'rem)' // *parseInt(getRandom(1,2))
        })
      }.bind(this))
    }
  }

  /**
   *
   * @params
   * config
   *	container {String} 容器
   *   rowMax    {Number} 一行最大个数
   *   resource  {Array}  资源列表
   */
  function MaterialGroup(config) {
    this.config = config;
    this.materials = []
    this._currentIndex = 0;
    this.start()
  }
  MaterialGroup.prototype = {
    init: function() {

    },
    start: function() {
      this._isStart = true
      this.append()
    },
    getNextLeft: function() {
      var deviceWidth = window.innerWidth
      var gap = deviceWidth/this.config.rowMax
      var index = getRandom(1, this.config.rowMax+1)
      if(index == this.lastIndex){
        index = Math.min(index + 1,this.config.rowMax)
      }
      this.lastIndex = index
      return index * gap
    },
    append: function() {
      var index = getRandom(0, this.config.resource.length-1)
      var config = this.config.resource[index]
      config.top = 0
      config.container = config.container || '.play-stage'
      config.left = this.getNextLeft()
      var material = new Material(config)
      material.appendTo()
      material.run();
      this.materials.push(material)
      if (this._isStart) {
        setTimeout(function(){
          this.append()
        }.bind(this), getRandom(100,600))
      }
    },
    each: function (callback) {
      $.each(this.materials,callback)
    },
    stop: function() {
      this._isStart = false
    }
  }

  function Rabbit(container) {
    this.rabbit = $(container)
    this.init()
  }

  Rabbit.prototype = {
    gap: deviceWidth/7,
    init: function() {
      this.bindEvent()
    },
    getBoundingClientRect: function() {
      return this.rabbit[0].getBoundingClientRect()
    },
    move: function(dis) {
      var left = (parseInt(this.rabbit.css('left')) + dis * this.gap)/dpi
      left = Math.min(Math.max(0, left), (window.innerWidth-parseInt(this.rabbit.css('width')))/dpi)
      this.rabbit.animate({
        left: left + 'rem'
      }, 100)
    },
    bindEvent: function() {
      $('body').on('click', function(e) {
        var deviceWidth = document.body.offsetWidth;
        this.move(e.clientX < deviceWidth/2?-1:1)
      }.bind(this))
    }
  }

  function Game(config) {
    this._isStart = false
    this.config = config
    this.rabbit = new Rabbit('.tuzi')
  }
  Game.prototype = {
    count: 0,
    timerNumber: 15,
    timer: '',
    start: function() {
      this._isStart = true;
      this.init()
      this.collisionDetection()
    },
    init: function() {
      this.materialGroup = new MaterialGroup({
        container: this.config.stage,
        rowMax:6,
        resource: this.config.resource
      })
      this.initTimer()
    },
    initTimer: function() {
      this.timer = setInterval(function() {
        if (this.timerNumber == 0) {
          $('#timerSpan').html(this.timerNumber)
          this.gameOver()
        } else {
          this.timerNumber --
          $('#timerSpan').html(this.timerNumber)
        }
      }.bind(this), 1000)
    },
    clearTimer: function() {
      clearInterval(this.timer)
    },
    check: function (rect1,rect2) {
      return rect1.left <= rect2.right && rect1.right >= rect2.left
        && rect2.bottom >= rect1.top &&  rect2.top <= rect1.bottom ||
        (rect1.width < rect2.width && this.check(rect2,rect1))
    },
    collisionDetection: function() {
      let rabbitRect = this.rabbit.getBoundingClientRect()
      this.materialGroup.each(function(_, item) {
        if(item && this.check(rabbitRect, item.getBoundingClientRect())){
          this.count++
          item.destroy()
          item = null
          if (this.count > 7) {
            this.gameOver()
          }
        }
      }.bind(this))
      if(this._isStart) {
        requestAnimationFrame(this.collisionDetection.bind(this))
      }
    },
    gameOver: function() {
      this._isStart = false
      this.clearTimer()
      this.materialGroup.stop()
      var type = parseInt(getRandom(0, 3))
      $('.J-cake-text').html(cakeConfig[type].text)
      $('.J-cake-image').html(cakeConfig[type].ele)
      $('.page_game').fadeOut(300)
      $('.page_cake').fadeIn(300)
    }
  }

  function readyGo() {
    var timerNumber = 3
    var timer = setInterval(function() {
      if (timerNumber == 0) {
        clearInterval(timer)
        $('.J-moon-content').hide()
        $('.J-tutorial-modal').hide()
        var game = new Game({
          stage:".play-stage",
          rowMax:6,
          resource:[
            {width:115,height: 115,url:'image/material/1.png'},
            {width:121, height:73, url:'image/material/2.png'},
            {width:150,height: 130,url:'image/material/3.png'},
            {width:90, height:90, url:'image/material/4.png'},
            {width:110,height: 110,url :'image/material/5.png'},
            {width:90, height:110, url:'image/material/6.png'},
          ]
        })
        game.start()
      } else {
        timerNumber--
        $('.J-moon-timer').html(timerNumber)
      }
    }, 1000)
  }

  // 游戏引导 我知道了
  $('.J-ok').on('click', function() {
    $('.J-tutorial-modal').hide()
    readyGo()
  })
  // 查看游戏规则
  $('.J-activity-rule').on('click', function() {
    $('.J-rule-modal').fadeIn(300)
  })
  // 关闭 游戏规则
  $('.J-close-modal-btn').on('click', function() {
    $('.J-rule-modal').fadeOut(300)
  })
  // 开始做月饼
  $('.J-start-create-cake').on('click', function() {
    $('.J-home').hide()
    $('.J-tutorial-modal').show()
    $('.J-game').show()
  })
  // 点击领取红包
  $('.J-local-href').on('click', function() {
    window.location.href = 'https://m.jr.jd.com/spe/downloadApp/index.html?id=973&activityid=923'
  })
})();
