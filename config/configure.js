(function() {
    var host = "http://api.rrzhaofang.com/";
    //未带toke请求
    window.conf = {
        login: host + 'admin/login',//首页推荐
    },
    //带token的请求
    window.auth_conf = {
        path_url:'http://api.rrzhaofang.com/upload/',//图片地址
        house_list:host+'admin/house/index', //房源列表
        house_recommend:host+'admin/house/recommend',//房源推荐
        house_delete:host+'admin/house/delete/',//房源删除
        house_form_data:host+'admin/house/create',//添加房源数据
        house_add:host+'admin/house/store',//添加房源数据
        datas_default_one: host + 'admin/datas-default-one/',//默认属性数据
        datas_one: host + 'admin/datas-one/',//自定义数据单个  
        users_list:host+'admin/user/broker', //经纪人列表
        chart_list:host+'admin/chart', //数据列表
        company_list:host+"admin/company/index"//公司列表
    }

    /**
     * 检查token 过期时间
     */
    var userinfo = localStorage.getItem("userinfo");
    if (userinfo == 'undefined') {
        window.location.href = '/login.html';

    } else {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        userinfo = JSON.parse(userinfo);
        if (timestamp > userinfo.expiration) {
            localStorage.removeItem("userinfo");
            window.location.href = '/login.html';
        }
    }
    /**
     * 引入top和right
     */
    $("#top").load('/page/public/top.html');
    $("#left").load('/page/public/left.html');
}());