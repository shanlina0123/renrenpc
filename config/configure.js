(function() {
    var host = "http://api.rrzhaofang.com/";
   // var host = "http://192.168.15.222:8081/";
    //未带toke请求
    window.conf = {
            login: host + 'admin/login', //首页推荐
        }
        //带token的请求
        window.auth_conf = {
            token: host + "admin/token", //检查而已有token
            menue_list:host+"admin/auth-menu",//菜单列表
            path_url:host+'upload/', //图片地址
            map_address: host + 'admin/get/map/address', //图片地址
            house_list: host + 'admin/house/index', //房源列表
            house_recommend: host + 'admin/house/recommend', //房源推荐
            house_delete: host + 'admin/house/delete/', //房源删除
            house_form_data: host + 'admin/house/create', //添加房源数据
            house_add: host + 'admin/house/store', //添加房源数据
            house_add_tag: host + 'admin/house/tag', //添加房源数据
            add_imag: host + 'admin/img/upload', //添加房源数据
            house_img_save: host + 'admin/house/img', //添加房源数据
            house_edit_info: host + 'admin/house/edit/', //修改房源数据
            house_edit_save: host + 'admin/house/update/', //修改房源数据
            house_edit_tag: host + 'admin/house/tag/edit/', //修改房源标签
            house_edit_tag_save: host + 'admin/house/tag/edit/save', //修改房源标签保存
            house_edit_img: host + 'admin/house/img/edit/', //修改房源图片信息
            house_edit_img_save: host + 'admin/house/img/edit/save', //修改房源图片信息
            datas_default_one: host + 'admin/datas-default-one/', //默认属性数据
            datas_one: host + 'admin/datas-one/', //自定义数据单个
            datas_cate_list: host + 'admin/datas-catelist', //自定义分类列表
            admin_datas: host + 'admin/chart-admin', //后台用户列表
            users_list: host + 'admin/user/broker', //经纪人列表
            chart_list: host + 'admin/chart', //数据列表
            company_list: host + "admin/company/index", //公司列表
            client_list: host + 'admin/client/index', //客户列表
            admin_list: host + 'admin/admin', //后台用户列表
            admin_edit: host + 'admin/admin/', //编辑查看用户
            admin_lock: host + 'admin/admin-setting/', //锁定用户
            role_list: host + 'admin/roles', //角色列表
            client_follow_list:host + 'admin/client-follow/edit/', //客户跟进列表
            client_follow:host + 'admin/client-follow/store', //跟进客户
            client_detail:host + 'admin/client/edit/', //客户详情
            client_houses:host + 'admin/client-houses', //客户房源列表检索
            client_admin:host + 'admin/client-admin/', //客户业务员列表
            client_update:host + 'admin/client/update/', //修改客户
            client_delete:host + 'admin/client/delete/', //删除客户
            client_trans:host + 'admin/client-transfer/update', //移交客户
            role_delete: host + 'admin/roles/', //删除角色
            role_power: host + 'admin/auth', //系统权限设置
            role_HadPower: host + 'admin/auth/', //已经拥有的权限列表
            chart_drop: host + 'admin/chart-user', //经纪人
            company_delete: host + 'admin/company/delete/', //公司删除
            company_update: host + 'admin/company/update/', //公司修改
            company_detail:host+'admin/company/edit/', //公司详情
            company_add: host + 'admin/company/store', //公司添加
            edit_pass: host+'admin/user/update-pass',//用户登陆状态修改密码
            check_user_name: host+'admin/get/user',//检测用户名
            edit_modify_pass: host+'admin/user/modify-pass',//忘记密码修改

            datas_add:host+'admin/datas',//添加属性
            datas_update:host+'admin/datas/',//修改属性
            datas_delete:host+'admin/datas-delete/',//修改属性

        }
        $("#top").load('/page/public/top.html');
})();

/**
 * 排除登陆页
 * @type {string}
 */
var url = window.location.href;

//跳过登陆页
if ( url.indexOf("login.html") == -1  ) {
    //跳过忘记密码页
    if (url.indexOf('chengePwd.html') == -1) {
        //跳过忘记密码修修改
        if (url.indexOf('wpwd.html') == -1) {

            filterToken();
        }
    }
}

/**
 * 判断session存在不
 */
function filterToken() {
    var tokenData = localStorage.getItem("userinfo");
    if (!tokenData) {
        window.location = "/login.html";
    } else {
        checkToken();
    }
}

/**
 * 检测token
 */
function checkToken() {
    var tokenData = localStorage.getItem("userinfo");
    var openid = JSON.parse(tokenData).wechatopenid;
    if( !openid )
    {
        //window.location = "/page/index/bgopenid.html";
    }
    $.ajax({
        headers: {
            Authorization: JSON.parse(tokenData).token,
        },
        type: "GET", //方法类型
        dataType: "json", //预期服务器返回的数据类型
        url: auth_conf.token, //url
        success: function(result) {
            if (result.status != 1) {
                if (result.status != 15) {
                    localStorage.removeItem("userinfo");
                    window.location.href = '/login.html';
                } else {
                    alert(result.messages);
                }
            }else{
                //获取菜单
                getMune();
            }
        }
    });
}
//获取权限菜单
function  getMune() {
    var userInfo=$.parseJSON(localStorage.getItem("userinfo"));
    var menueList=userInfo.menuList;
    if(userInfo.isadmin==1)
    {
        $("#top").load('/page/public/top.html');
        $("#left").load('/page/public/left.html');
    }else{
        //权限菜单(现在页面只显示一级，接口和数据库设计支持多级)
        var leftHtml='';
        if(menueList)
        {
            $.each(menueList,function(i,n){
                leftHtml+='<li><a href="../'+n.url+'"><i class="layui-icon">'+n.menuicon+'</i>'+n.menuname+'</a></li>'+'\r\n';
            });
            $("#left").html(leftHtml);
            $("#top").load('/page/public/top.html');
        }else{
           // alert("您暂时无任何权限，请联系管理员设置您的权限");
            $("#left").html(leftHtml);
            leftHtml="<img src='/images/lock.jpg' style='margin:100px auto;display: block;'/>";
            $(".main").html(leftHtml);
        }
    }

}

