(function () {
    var host = "http://192.168.15.13:8081/";
    //未带toke请求
    window.conf = {
        login: host + 'admin/login',//首页推荐
    },
        //带token的请求
        window.auth_conf = {
            token:host+"admin/token",//检查而已有token
            path_url:'http://api.rrzhaofang.com/upload/',//图片地址
            house_list:host+'admin/house/index', //房源列表
            house_recommend:host+'admin/house/recommend',//房源推荐
            house_delete:host+'admin/house/delete/',//房源删除
            house_form_data:host+'admin/house/create',//添加房源数据
            house_add:host+'admin/house/store',//添加房源数据
            datas_default_one: host + 'admin/datas-default-one/',//默认属性数据
            datas_one: host + 'admin/datas-one/',//自定义数据单个
            client_list: host + 'admin/client/index',//客户列表
            admin_list: host + 'admin/admin',//后台用户列表
        }


})();
new Vue({
    el: 'body',
    data: {
        tokenData: localStorage.getItem("userinfo")
    },
    methods:{
        filterToken:function(){
            var that = this;
            if(!that.tokenData)
            {
                window.location="/login.html";
            }else{
                if(!JSON.parse(that.tokenData).token)
                {
                    window.location="/login.html";
                }
                //检查token是否失效
                that.checkToken();
            }
        },
        checkToken:function(){
            var url = auth_conf.token;
            var that = this;
            axios.get( url,{headers: {"Authorization": JSON.parse(that.tokenData).token} })
                .then(function (response)
                {
                    var data = response.data;
                    if(data.status!=1)
                    {
                        if(data.messages)
                        {
                            //alert(data.messages);
                            // layui.use('layer', function(id) {
                            //     var layer = layui.layer;
                            //     layer.msg(data.messages);
                            // });
                        }
                        localStorage.removeItem("userinfo");
                        that.tokenData=null;
                        window.location="/login.html";
                    }
                    /**
                     * 引入top和right
                     */
                    $("#top").load('/page/public/top.html');
                    $("#left").load('/page/public/left.html');

                })
                .catch(function (error)
                {
                    alert("Token验证异常");
                });
        }
    }
    ,created: function () {
        var that = this;
        that.filterToken();//过滤token
    }
});

