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
    var picSwiper = new Swiper('#preview-pic')
  })
  $('.preview-pic2').click(function(){
    $('.container').hide()
    $('#preview1-modal').css({ display: 'flex' })
    var picSwiper1 = new Swiper('#preview-pic1')
  })
  $('.preview-pic3').click(function(){
    $('.container').hide()
    $('#preview2-modal').css({ display: 'flex' })
    var picSwiper2 = new Swiper('#preview-pic2')
  })
  $('#order_driver').click(function(){
    location.href = './form.html'
  })
  $('.comment-list').on('touchmove', function(e){
    e.stopPropagation()
  })
});
