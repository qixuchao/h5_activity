var arrImg=['./img/A.png','./img/B.png','./img/C.png','./img/D.png','./img/E.png','./img/lanzi.png','./img/logo-1.png','./img/logo-2.png','./img/share.png'];
var num=0;
// window.loadingImgm = setInterval(function(){
//     loadingNums++;
//     // $('.loadingImg').attr('src', 'images/loading'+loadingNums+'.png');
// },80)
/*判断图片是否加载完成*/
for (var i = 0; i < arrImg.length; i++) {
   var imgObj=new Image();
        imgObj.src=arrImg[i];
        imgObj.onload=function(){
            num++;
            loadingimg();
        }
};
function loadingimg(){
   
   

$(".loading-plan span").html("正在加载"+Math.ceil(num/arrImg.length*100)+"%");
    if (num==arrImg.length){
        $(".loading").css({display:"none"});
        $(".container").css({display:"block"});

        fn()
    };
}

function fn(){
  
}  