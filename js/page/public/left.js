$(function(){
    var tokenData = localStorage.getItem("userinfo");
    $.ajax({
        headers: {
            Authorization: JSON.parse(tokenData).token,
        },
        type: "GET", //方法类型
        dataType: "json", //预期服务器返回的数据类型
        url: auth_conf.menue_list, //url
        success: function(result) {
            if (result.status == 1) {
                //列表
                result.data;
            }
        }
    });
})