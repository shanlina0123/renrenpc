var vm = new Vue({
    el: '#rolePowerId',
    data: {
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token, //token
        powerList: [],
        roleId: "",
        hadPowerList: [],
    },
    methods: {
        //角色列表
        getPowerList: function() {
            var that = this;
            var url = auth_conf.role_power;
            axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                layui.use('form', function() {
                    var form = layui.form;
                });
                if (data.status == 1) {
                    that.powerList = data.data;
                } else {
                    layer.msg(data.messages, { icon: 6 });
                }
            }).catch(function(error) {});
        },
        //从浏览器链接中的参数
        GetQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var url_param = decodeURIComponent(window.location.search)
            var r = url_param.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        //其他链接进去的参数获取
        enterParam: function() {
            this.roleId = this.GetQueryString("roleId");
            this.getHadPowerList(this.GetQueryString("uuid"));
        },
        //获得这个角色已经存在的权限列表
        getHadPowerList: function(role_uuid) {
            var that = this;
            var url = auth_conf.role_HadPower + role_uuid;
            axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                layui.use('form', function() {
                    var form = layui.form;
                });
                if (data.status == 1) {
                    that.hadPowerList = data.data;
                } else {
                    layer.msg(data.messages, { icon: 6 });
                }
            }).catch(function(error) {});
        }
    },
    created: function() {
        var that = this;
        that.enterParam(); //获得浏览器传来的参数
        that.getPowerList(); //获得角色列表
        that.getHadPowerList(); //获得这个角色已经有的权限列表
    }
})