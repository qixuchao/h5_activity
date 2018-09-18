
var createTimer, // 创建月饼素材时间 计时器
    timer, // 倒计时 15秒 计时器
    timerNumber = 15,
    count = 0,
    playDiv = document.getElementById('playDiv'),
    leftBtn = document.getElementById('leftBtn'),
    rightBtn = document.getElementById('rightBtn'),
    cakeMaterialType = 200; // 根据这个变量来判断创建素材的种类


var requestAnimaFrame = function (callback) {
  return window.requestAnimationFrame(callback) ||
    window.webkitRequestAnimationFrame(callback) ||
    window.mozRequestAnimationFrame(callback) ||
    window.oRequestAnimationFrame(callback) ||
    window.msRequestAnimationFrame(callback) ||
    function (callback) {
      setInterval(callback, 1000);
    }
}

var Create = function(height, width, url, hp, speeds) {
  this.init(height, width, url, hp, speeds)
}
Create.prototype = {
  cakeEle: {},
  // 初始化
  init: function(height, width, url, hp, speeds) {
    this.cakeEle = document.createElement("img")
    this.cakeEle.src = url
    this.cakeEle.hp = 1
    this.cakeEle.style.height = height/32+"rem"
    this.cakeEle.style.width = width/32+"rem"
    this.cakeEle.style.position = "absolute"
    this.cakeEle.style.top = -height/32+"rem"
    this.cakeEle.speeds = speeds
    this.cakeEle.isDead = false
    this.cakeEle.style.left = Math.floor(Math.random()*(750-width)/32)+"rem"
    playDiv.appendChild(this.cakeEle)
    this.move()
  },
  // 移动元素
  move: function() {
    var ele = this.cakeEle
    var self = this
    setInterval(function() {
      self.update(ele, self)
      self.impact()
    }, 30)
  },
  // 卸载
  unInit: function(ele) {
    ele.parentNode.removeChild(ele)
  },
  // 更新元素位置
  update: function(ele, self) {
    if (!ele.isDead) {
      ele.style.top = ele.offsetTop + ele.speeds+"px"
      if(ele.offsetTop >= 2500) {
        ele.isDead = true
        self.unInit(ele)
      }
    }
  },
  // 检测碰撞
  impact: function() {
    var tuzi = document.getElementById('tuzi')
    var ele = this.cakeEle
    if(
      tuzi.offsetTop<ele.offsetTop+ele.offsetHeight&&
      (
        (tuzi.offsetLeft<ele.offsetLeft+ele.offsetWidth &&
          tuzi.offsetLeft > ele.offsetLeft) ||

        (tuzi.offsetLeft+tuzi.offsetWidth<ele.offsetLeft+ele.offsetWidth &&
          tuzi.offsetLeft+tuzi.offsetWidth>ele.offsetLeft) ||

        (tuzi.offsetLeft<ele.offsetLeft &&
          tuzi.offsetLeft+tuzi.offsetWidth > ele.offsetLeft+ele.offsetWidth)
      )
    ) {
      count++
      this.unInit(this.cakeEle)
    }
  }
}

function startGame() {
  clearInterval(createTimer)
  clearInterval(timer)
  createTimer = setInterval(function() {
    cakeMaterialType++
    if (count > 8 || timerNumber < 1) {
      // 当分数为8分 或者倒计时结束  做月饼
      clearInterval(createTimer)
      clearInterval(timer)
      //alert('做月饼')
    } else {
      switch (cakeMaterialType%100) {
        // 注：这个理面只能选取质数，否则有可能创建两个相同的实例
        case  3: new Create(115, 115, "image/1.png", 1, 15); break;
        case  13: new Create(75, 121, "image/2.png", 1, 15); break;
        case  17: new Create(150, 130, "image/3.png", 1, 10); break;
        case  21: new Create(90, 90, "image/4.png", 1, 13); break;
        case  23: new Create(110, 110, "image/5.png", 1, 5); break;
        case  19: new Create(90, 110, "image/6.png", 1, 18); break;
      }
    }
  }, 30)

  // requestAnimaFrame(function() {
  //   if (timerNumber < 1) {
  //     clearInterval(timer)
  //     document.getElementById('timerSpan').innerHTML = timerNumber
  //   } else {
  //     timerNumber --
  //     document.getElementById('timerSpan').innerHTML = timerNumber
  //   }
  // })
  timer = setInterval(function() {
    if (timerNumber < 1) {
      clearInterval(timer)
      document.getElementById('timerSpan').innerHTML = timerNumber
    } else {
      timerNumber --
      document.getElementById('timerSpan').innerHTML = timerNumber
    }
  }, 1000)
}
//startGame()

// 向左移动兔子
leftBtn.onclick = function() {
  var tuzi = document.getElementById('tuzi')
  if (tuzi.offsetLeft >= 80) {
    tuzi.style.left = tuzi.offsetLeft/32 - 2 + 'rem'
  } else {
    tuzi.style.left = 0
  }
}
// 向右移动兔子
rightBtn.onclick = function() {
  var tuzi = document.getElementById('tuzi')
  if (tuzi.offsetLeft < 510) {
    tuzi.style.left = tuzi.offsetLeft/32 + 2 + 'rem'
  } else {
    tuzi.style.left = 540/32 + 'rem'
  }
}
