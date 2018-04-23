var vm = new Vue({
    el: '#vue_client_follow',
    data: {
        params:{"uuid":null},//请求参数
        follow_list: [],//客户列表
        default_followstatus_datas: [],//状态列表
        show_followstatus_datas:[],//显示的客户状态
        tokenUserInfo: JSON.parse(localStorage.getItem("userinfo")),
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token,
    },
    methods: {
        GetQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var url_param = decodeURIComponent(window.location.search)
            var r = url_param.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        //其他链接进去的参数获取
        enterParam: function() {
            this.getFollowList(this.GetQueryString("uuid"));
        },
        //获取跟进列表
        getFollowList: function (uuid) {
            var that = this;
            var url = auth_conf.client_follow_list+uuid;
            //token
            axios.get(url, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        that.follow_list = data.data.data;
                    } else {
                        layer.msg(data.messages, {icon: 7});
                    }
                }).catch(function (error) {
            });
        },
        //获取客户状态 -默认单分类列表
        getDefaultDataOne: function () {
            var url = auth_conf.datas_default_one + "8";
            var that = this;
            axios.get(url, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        //客户状态
                        that.default_followstatus_datas = data.data;
                        that.admin_show_datas = arrayIndexToValue(data.data, "id");
                        selectAppendDd($("#showSearchStatus"), that.default_followstatus_datas, "id", "name");
                    }
                })
                .catch(function (error) {
                    //console.log(error);
                });
        }

    },
    created: function () {
        var that = this;
        that.enterParam();//进入参数
        that.getFollowList();//跟进列表
        that.getDefaultDataOne();//所有客户状态
    }
});
