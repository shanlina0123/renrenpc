(function() {
    var host = "http://192.168.15.222:8081/";
    //未带toke请求
    window.conf = {
            login: host + 'admin/login', //首页推荐
        },
        //带token的请求
        window.auth_conf = {
            token: host + "admin/token", //检查而已有token
            path_url: 'http://api.rrzhaofang.com/upload/', //图片地址
            map_address: host + 'admin/get/map/address', //图片地址
            house_list: host + 'admin/house/index', //房源列表
            house_recommend: host + 'admin/house/recommend', //房源推荐
            house_delete: host + 'admin/house/delete/', //房源删除
            house_form_data: host + 'admin/house/create', //添加房源数据
            house_add: host + 'admin/house/store', //添加房源数据
            house_add_tag: host + 'admin/house/tag', //添加房源数据
            add_imag: host + 'admin/img/upload', //添加房源数据
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
            client_update:host + 'admin/client/update/', //修改客户
            role_delete: host + 'admin/roles/', //删除角色

        }
    $("#top").load('/page/public/top.html');
    $("#left").load('/page/public/left.html');
})();
// new Vue({
//     el: '.wrap',
//     data: {
//         tokenData: localStorage.getItem("userinfo")
//     },
//     methods: {
//         filterToken: function() {
//             var that = this;
//             if (!that.tokenData) {
//                 window.location = "/login.html";
//             } else {
//                 if (!JSON.parse(that.tokenData).token) {
//                     window.location = "/login.html";
//                 }
//                 //检查token是否失效
//                 that.checkToken();
//             }
//         },
//         checkToken: function() {
//             var url = auth_conf.token;
//             var that = this;
//             axios.get(url, { headers: { "Authorization": JSON.parse(that.tokenData).token } })
//                 .then(function(response) {
//                     var data = response.data;
//                     if (data.status != 1) {
//                         if (data.messages) {
//                             //alert(data.messages);
//                             // layui.use('layer', function(id) {
//                             //     var layer = layui.layer;
//                             //     layer.msg(data.messages);
//                             // });
//                         }
//                         localStorage.removeItem("userinfo");
//                         that.tokenData = null;
//                         window.location = "/login.html";
//                     }
//
//                     $("#top").load('/page/public/top.html');
//                     $("#left").load('/page/public/left.html');
//
//                 })
//                 .catch(function(error) {
//                     alert("Token验证异常");
//                     window.location = "/login.html";
//                 });
//         }
//     },
//     created: function() {
//         var that = this;
//         that.filterToken(); //过滤token
//     }
//
// });
