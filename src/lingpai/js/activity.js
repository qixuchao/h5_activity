Zepto(function ($) {
  var pageSwiper = new Swiper('#page', {
    direction: 'vertical',
  });
  var $playerModal = $('#player-modal')
  var $previewModal = $('#preview-modal')
  $('.view-video1').click(function (e) {
    $playerModal.css({ display: 'flex' })
    $('#example_video_1').attr('src', './video/video1.mov')
  });
  $('.view-video2').click(function (e) {
    $playerModal.css({ display: 'flex' })
    $('#example_video_1').attr('src', './video/video2.mov')
  });
  $('.view-video3').click(function (e) {
    $playerModal.css({ display: 'flex' })
    $('#example_video_1').attr('src', './video/video3.mov')
  });
  $('#close-video').click(function () {
    $('#example_video_1')[0].pause()
    $('.player-modal').css({ display: 'none' });
  });
  $('#close').click(function () {
    $('.container').show()
    $('#preview-modal').hide();
  });
  $('#close1').click(function () {
    $('.container').show()
    $('#preview1-modal').hide();
  });
  $('#close2').click(function () {
    $('.container').show()
    $('#preview2-modal').hide();
  });
  $('.preview-pic1').click(function(){
    $('.container').hide()
    $previewModal.css({ display: 'flex' })
    $previewModal.append('  <div class="wrap-pic" >\n' +
      '    <div class="swiper-container" id="preview-pic" >\n' +
      '      <div class="swiper-wrapper" >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/waiguan/1.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/waiguan/2.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/waiguan/3.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/waiguan/4.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/waiguan/5.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/waiguan/6.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/waiguan/7.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '      </div >\n' +
      '    </div >\n' +
      '  </div >\n')
    var picSwiper = new Swiper('#preview-pic')
  })
  $('.preview-pic2').click(function(){
    $('.container').hide()
    $('#preview1-modal').css({ display: 'flex' })
    $('#preview1-modal').append('  <div class="wrap-pic" >\n' +
      '    <div class="swiper-container" id="preview-pic1" >\n' +
      '      <div class="swiper-wrapper" >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/kongjian/1.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/kongjian/2.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/kongjian/3.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/kongjian/4.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/kongjian/5.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/kongjian/6.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/kongjian/7.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '      </div >\n' +
      '    </div >\n' +
      '  </div >\n')
    var picSwiper1 = new Swiper('#preview-pic1')
  })
  $('.preview-pic3').click(function(){
    $('.container').hide()
    $('#preview2-modal').css({ display: 'flex' })
    $('#preview2-modal').append('  <div class="wrap-pic" >\n' +
      '    <div class="swiper-container" id="preview-pic2" >\n' +
      '      <div class="swiper-wrapper" >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/anquan/1.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/anquan/2.png" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/anquan/3.png" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/anquan/4.png" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/anquan/5.png" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/anquan/6.png" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '        <div class="swiper-slide" >\n' +
      '          <div class="view-pic" >\n' +
      '            <img src="images/anquan/7.jpg" alt="" >\n' +
      '          </div >\n' +
      '        </div >\n' +
      '      </div >\n' +
      '    </div >\n' +
      '  </div >\n')
    var picSwiper2 = new Swiper('#preview-pic2')
  })
  $('#order_driver').click(function(){
    location.href = './form.html'
  })
  $('.comment-list').on('touchmove', function(e){
    e.stopPropagation()
  })
});
