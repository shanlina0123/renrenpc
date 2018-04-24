// 顶部导航右侧操作
$("body").on("click", ".layui-nav .layui-nav-item a", function () {
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
$(".leftNav > li >a").each(function () {
    if ($(this).siblings().hasClass("leftSubNav")) {
        $(this).addClass("hasBg")
    }
});
/**
 * 引入top和right
 */
$("#top").load('/page/public/top.html');
$("#left").load('/page/public/left.html');


function onOver(obj) {
    var sub_url = obj.getElementsByTagName("ul")
    sub_url[0].style.display = "block";
}
function onOut(obj) {
    var sub_url = obj.getElementsByTagName("ul")
    sub_url[0].style.display = "none";
}

/****
 * 兼容vue.js和layuid的select
 * @param tag
 * @param data
 * @param key
 * @param value
 */
function selectAppendDd(tag,data,key,value)
{
   var str="";
    for(var i in data)
    {
        str+='<option value="'+data[i][key]+'">'+data[i][value]+'</option>';
    }
    tag.append( str );
    layui.use(['form'], function() {
        var form = layui.form;
        form.render('select');
    });
}


/****
 * 数组索引转为数据值作为索引
 * @param tag
 * @param data
 * @param key
 * @param value
 */
function arrayIndexToValue(data,key)
{
    if(data)
    {
        var list=[];
       $.each(data,function(i,n){
           list[n[key]]=n;
       })
    }
   return list;
}

/****
 * 数组索引转为普通数组
 * @param data
 */
function IndexArrayToArray(data)
{
    if(data)
    {
        var list=[];
        $.each(data,function(i,n){
            list.push(n);
        })
    }
    return list;
}


/**
 * 退出
 *
 */
function signOut()
{
    localStorage.removeItem("userinfo");
    window.location.href = '/login.html';
}

/*获取对象、数组的长度、元素个数
 *@param obj 要计算长度的元素，可以为object、array、string
 */
function count(obj){
    var objType = typeof obj;
    if(objType == "string"){
        return obj.length;
    }else if(objType == "object"){
        var objLen = 0;
        for(var i in obj){
            objLen++;
        }
        return objLen;
    }
    return false;
}