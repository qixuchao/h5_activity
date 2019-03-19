Zepto(function ($) {
  var pageSwiper = new Swiper('#page', {
    direction: 'vertical',
  });
  var picSwiper = new Swiper('#preview-pic')
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

  $('.preview-pic1').click(function(){
    $previewModal.css({ display: 'flex' })
  })
});
