 // 顶部导航右侧操作
 $("body").on("click", ".layui-nav .layui-nav-item a", function() {
     $(this).siblings().addClass("layui-show");
 });
 //左侧导航效果
// $(".leftNav > li > a").click(function() {
//   if ($(this).hasClass("on")) {
//       $(this).siblings(".leftSubNav").slideDown();
//       $(this).parents("li").siblings().find(".leftSubNav").slideUp();
//       $(this).addClass("on").parents("li").siblings().find("a").removeClass("on");
//   } else {
//       $(this).removeClass("on");
//       $(this).siblings(".leftSubNav").slideUp();
//   }
// });



 //导航添加背景图片
 $(".leftNav > li >a").each(function() {
     if ($(this).siblings().hasClass("leftSubNav")) {
         $(this).addClass("hasBg")
     }
 });
  /**
     * 引入top和right
     */
    $("#top").load('/page/public/top.html');
    $("#left").load('/page/public/left.html');
    

function onOver(obj){
            var sub_url=obj.getElementsByTagName("ul")
            sub_url[0].style.display="block";
        }
        function onOut(obj){
            var sub_url=obj.getElementsByTagName("ul")
            sub_url[0].style.display="none";
        }