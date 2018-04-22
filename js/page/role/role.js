var vm = new Vue({
    el: '#roleId',
    data: {
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token, //token
        roleList: [], //角色列表
    },
    methods: {
        //获取角色列表
        getRoleList: function() {
            var that = this;
            var url = auth_conf.role_list;
            axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                if (data.status == 1) {
                    that.roleList = data.data;
                    console.log(that.roleList);
                    layui.use(['form'], function() {
                        var form = layui.form;
                        form.render('checkbox');
                    });
                } else {
                    layer.msg("错误");
                }
            })

        }

    },
    created: function() {
        var that = this;
        that.getRoleList(); //角色列表
    }
})