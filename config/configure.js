(function () {
    var host = "http://api.rrzhaofang.com/";
    //未带toke请求
    window.conf = {
        login: host + 'admin/login',//首页推荐
    },
    //带token的请求
    window.auth_conf = {
        pathUrl:'http://api.rrzhaofang.com/upload/',
        house_list:host+'admin/house/index' //房源列表
    }

    /**
     * 检查token 过期时间
     */
    var userinfo = localStorage.getItem("userinfo");
    if( userinfo == 'undefined' )
    {
        window.location.href='/login.html';

    }else
    {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        userinfo = JSON.parse(userinfo);
        if( timestamp > userinfo.expiration )
        {
            localStorage.removeItem("userinfo");
            window.location.href='/login.html';
        }
    }
    /**
     * 引入top和right
     */
    $("#top").load('/page/public/top.html');
    $("#left").load('/page/public/left.html');
})();
