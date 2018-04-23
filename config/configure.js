(function() {
   // var host = "http://192.168.15.222:8081/";
    var host = "http://api.rrzhaofang.com/";
    //未带toke请求
    window.conf = {
            login: host + 'admin/login', //首页推荐
        }
        //带token的请求
        window.auth_conf = {
            token: host + "admin/token", //检查而已有token
            path_url:'http://api.rrzhaofang.com/upload/', //图片地址
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
            datas_default_one: host + 'admin/datas-default-one/', //默认属性数据
            datas_one: host + 'admin/datas-one/', //自定义数据单个
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
            client_follow_list: host + 'admin/client-follow/edit/', //客户跟进列表
            client_follow: host + 'admin/client-follow/store', //跟进客户
            chart_drop: host + 'admin/chart-user', //经纪人
        }
        $("#top").load('/page/public/top.html');
        $("#left").load('/page/public/left.html');
})();

/**
 * 排除登陆页
 * @type {string}
 */
var url = window.location.href;
if( url.indexOf("login.html") == -1 )
{
    filterToken();
}

/**
 * 判断session存在不
 */
function filterToken() {

      var tokenData = localStorage.getItem("userinfo");
      if ( !tokenData )
      {
         window.location = "/login.html";
      }
      else
      {
          checkToken()
      }
}

/**
 * 检测token
 */
function checkToken()
{
    var tokenData = localStorage.getItem("userinfo");
    $.ajax({
        headers: {
            Authorization:JSON.parse(tokenData).token,
        },
        type: "GET", //方法类型
        dataType: "json", //预期服务器返回的数据类型
        url: auth_conf.token, //url
        success: function(result) {
            if ( result.status != 1  )
            {
                if( result.status != 15)
                {
                    localStorage.removeItem("userinfo");
                    window.location.href = '/login.html';
                }else{
                    alert(result.messages);
                }
            }else{
                alert(result.messages);
            }
        }
    });
}