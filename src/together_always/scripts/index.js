var queue = new createjs.LoadQueue();
queue.on("complete", handleComplete, this);
queue.on("progress", function(e) {
  var loaded = parseInt(e.loaded * 100, 10) + '';

  var loadeds = loaded.split(''),
    html = '';
  for (var i = 0, len = loadeds.length; i < len; i++) {
    html += '<span class="sprite number number-' + loadeds[i] + '"></span>'
  }

  html += '<span class="sprite number number-sign"></span>'

  $('.number-box').html(html)
}, this);
queue.loadManifest([
  "./images/page1/fogether.png",
  "./images/page1/always.png",
  "./images/page1/subtitle.png",
  "./images/page1/fence.png",
  "./images/page1/tree.png",
  "./images/page1/play.png",
  "./images/page1/role.png",
  "./images/bg.jpg",
  "./images/page1/river.jpg",
  "./images/page2/role.png",
  "./images/page2/left.png",
  "./images/page2/right.png",
  "./images/page6/small_stone.png",
  "./images/page4/bg.jpg",
  "./images/page5/bg.jpg",
  "./images/page6/bg.jpg",
  "./images/page5/bg_tree.png",
  "./images/page5/left_tree.png",
  "./images/page5/right_tree.png",
  "./images/page5/center_tree.png",
  {
    id: "sound",
    src: "./media/Together-Always.mp3",
  },
]);

function handleComplete() {
  var sounds = [{
    src: "./media/Together-Always.mp3",
    data: {
      audioSprite: [
        { id: "sound1", startTime: 5000, duration: 18000 },
        { id: "sound2", startTime: 24000, duration: 8220 },
        { id: "sound2.2", startTime: 55250, duration: 10520 },
        { id: "sound3", startTime: 66180, duration: 2990 },
        { id: "sound4", startTime: 70014, duration: 1999 },
        { id: "sound5", startTime: 72014, duration: 2006 },
        { id: "sound6", startTime: 89021, duration: 5999 }, //page3
        { id: "sound7", startTime: 95021, duration: 1880 },
        { id: "sound7.1", startTime: 98027, duration: 6987 },
        { id: "sound8", startTime: 105015, duration: 2993 },
        { id: "sound9", startTime: 110010, duration: 2713 },
        { id: "sound10", startTime: 114002, duration: 1027 },
        { id: "sound11", startTime: 115030, duration: 2973 },
        { id: "sound12", startTime: 118004, duration: 21021 }, //page4
        { id: "sound13", startTime: 139026, duration: 2489 }, //page5
        { id: "sound14", startTime: 142017, duration: 2604 },
        { id: "sound32", startTime: 145228, duration: 2800 },
        { id: "sound15", startTime: 149028, duration: 2899 },
        { id: "sound15.1", startTime: 153201, duration: 2320 },
        { id: "sound16", startTime: 157004, duration: 2520 },
        { id: "sound17", startTime: 159725, duration: 3975 },
        { id: "sound18", startTime: 163001, duration: 41021 }, //page6
        { id: "sound19", startTime: 233824, duration: 9979 }, //page7
        { id: "sound20", startTime: 258002, duration: 9425 },
        { id: "sound21", startTime: 267828, duration: 3989 }, //page8
        { id: "sound21.1", startTime: 274003, duration: 3420 }, //page8
        { id: "sound33", startTime: 274000, duration: 3820 },
        { id: "sound22", startTime: 272819, duration: 1983 },
        { id: "sound23", startTime: 279003, duration: 1321 },
        { id: "sound24", startTime: 311014, duration: 13610 }, //page9
        { id: "sound25", startTime: 324825, duration: 3199 },
        { id: "sound26", startTime: 329024, duration: 3580 },
        { id: "sound27", startTime: 333814, duration: 2188 },
        { id: "sound27.1", startTime: 337024, duration: 1990 },
        { id: "sound28", startTime: 338915, duration: 2193 },
        { id: "sound28.1", startTime: 342512, duration: 2000 },
        { id: "sound29", startTime: 344713, duration: 17991 }, //page10
        { id: "sound30", startTime: 362705, duration: 2609 },
        { id: "sound31", startTime: 365015, duration: 2996 },
      ]
    }
  }];
  createjs.Sound.registerSounds(sounds);

  $('.loading-page').hide();

  $('[original-src]').each(function() {
    $(this).attr('src', $(this).attr('original-src'))
  });

  $('.pages').show();

  FastClick.attach(document.body);
};

$(function() {
  $('.pages').width(window.innerWidth * $('.pages .page').length)

  $('.pages .page').width(window.innerWidth)

  $(document).on('touchmove', function(e) {
    e.preventDefault()
    return false;
  })

  $(window).on('deviceorientation', function(e) {

    if (e.gamma != null && e.beta != null) {

      var minusG = Math.abs(e.gamma) / e.gamma
      var minusB = Math.abs(e.beta) / e.beta
      var x = Math.min(Math.abs(e.gamma), 90);
      var y = Math.min(Math.abs(e.beta), 90);

      x = minusG * x
      y = minusG * y

      $('.layer').each(function() {
        var $this = $(this);
        var direction = Number($this.attr('data-direction') || 1)
        var friction = Number($this.attr('data-friction') || 1) //摩擦

        $this.css("transform", "translate3d(" + (x * friction) + "px," + (y * friction) + "px,0)")
      });
    }
  });

  function Pages() {
    this.current = 0;
    this.$container = $('.pages')
    this.$pages = this.$container.find('.page');

    this.onBind();
  }

  Pages.prototype = {
    onBind: function() {
      var that = this
      this.$container.on('transformEnd webkitTransitionEnd', function() {
        that.$pages.eq(that.current).addClass('current')
        that.$pages.eq(that.last).removeClass('current')
        if (that.current != 0) {
          $('.page-tools').show()
        } else {
          $('.page-tools').hide()
        }
      })
    },
    move: function(dir) {
      dir = dir || 1;
      var leavelCls = dir > 0 ? 'leavel' : '';
      //this.$pages.eq(this.current).addClass(leavelCls)

      this.last = this.current;

      var current = this.current - dir;

      var x = current * window.innerWidth * -1;

      this.$container.css({
        transform: 'translateX(' + x + 'px)'
      })

      this.current = current;
    },
    next: function(next) {
      if (this.current == this.$pages.length - 1) {
        return false;
      }
      this.move(-1)
    },
    pre: function(pre) {

      this.move(1)
    }
  }

  pages = new Pages();
  $('#play').on('click', function() {
    pages.next()
  });

  $('.next-page').on('click', function() {
    pages.next()
  })

  $('.pre-page').on('click', function() {
    pages.pre()
  });

  $('.play-button').on('click', function() {
    var number = $(this).attr('data-sound');
    play(number)
    console.log('play sound' + number)
  });

  $('.talk-box').on('click', '.talk-btn', function() {

    var $parent = $(this).parent();
    var index = $parent.data('index') || 0;

    $parent.find('[data-talk="' + index + '"]').hide();
    index++;

    $(this).hide();


    if (index > $parent.attr('data-talk-cout')) {
      index = 0;
      if ($parent.find('[daga-talk="1"]').hasClass('talk-dialog-talk1')) {
        $parent.find('.talk-dialog-hold2').show()
      } else {
        $parent.find('.talk-dialog-hold1').show()
      }
    } else {
      if (index != $parent.attr('data-talk-cout')) {
        if ($(this).hasClass('talk-dialog-talk1') || $(this).hasClass('talk-dialog-hold1')) {
          $parent.find('.talk-dialog-hold2').show()
        } else {
          $parent.find('.talk-dialog-hold1').show()
        }
      }


      var $next = $parent.find('[data-talk="' + index + '"]');
      $next.show();

      if ($next.attr('data-sound')) {
        play($next.attr('data-sound'))
      }
    }

    $parent.data('index', index);
  });

  function play(number) {
    console.log('play', number)
    createjs.Sound.stop();
    var play = createjs.Sound.play("sound" + number)
    console.log(play)
    play.addEventListener('complete', function() {
      if (number == 2) {
        createjs.Sound.play("sound2.2")
      } else if (number == 7) {
        createjs.Sound.play("sound7.1")
      } else if (number == 15) {
        createjs.Sound.play("sound15.1")
      } else if (number == 19) {
        createjs.Sound.play("sound20")
      } else if (number == 21) {
        createjs.Sound.play("sound21.1")
      }
    });
  }

})
