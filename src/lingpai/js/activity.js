Zepto(function($){
  var pageSwiper = new Swiper('#page',{
    direction : 'vertical',
  })
  $('.order-driver').click(function(e){
    console.log($(e.currentTarget).index())
  })
  $('.view-video').each(function(i, value){
    value.click(function(e){

    })
  })
})
