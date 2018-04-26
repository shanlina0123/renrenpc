var vm = new Vue({
    el: '#roleId',
    data: {
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token, //token
        roleList: [], //角色列表
        name: ""
    },
    methods: {
        //获取角色列表
        getRoleList: function() {
            var that = this;
            var url = auth_conf.role_list
            axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                that.roleList = data.data
            })
        },
        //添加角色弹窗
        addRole: function() {
            var that = this;
            that.name = "";
            layer.open({
                type: 1,
                title: '添加角色',
                shadeClose: true,
                scrollbar: false,
                skin: 'layui-layer-rim',
                area: ['500px', '300px'],
                content: $(".custormHandelPop")
            })
        },
        //提交添加角色
        submitAddRole: function() {
            var that = this;
            var url = auth_conf.role_list;
            if (that.name == "") {
                layui.use("layer", function() {
                    layer.msg("请填写要添加的角色名称");
                })
            } else {
                axios.post(url, { name: that.name }, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                    var data = response.data;
                    if (data.status == 1) {
                        layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg(data.messages)
                            layer.closeAll("page");
                            that.getRoleList()
                        })
                    } else {
                        layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg(data.messages);
                        })
                    }
                })
            }
        },
        //删除角色
        deleteRole: function(uuid) {
            var that = this;
            layer.confirm('确定要删除吗？', {
                btn: ['确定', '取消']
            }, function() {
                var url = auth_conf.role_delete + uuid;
                axios.delete(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                    var data = response.data;
                    if (data.status == 1) {
                        layer.msg(data.messages, { icon: 1 });
                        that.getRoleList();
                    } else if (data.status == 14) {
                        layer.msg(data.messages);
                    } else if (data.status == 10) {
                        layer.msg(data.messages);
                    }
                })
            });
        },
        //编辑权限跳转页面
        editRole: function(uuid, roleName, islook) {
            if (!uuid) {
                layer.msg("连接错误", { icon: 6 });
            }
            var targetUrl = "uuid=" + uuid;
            if (roleName) {
                targetUrl += "&name=" + roleName;
            }
            if (islook) {
                targetUrl += "&islook=" + islook;
            }
            window.location.href = "../roles/editPower.html?" + encodeURIComponent(targetUrl);
        }
    },
    created: function() {
        var that = this;
        that.getRoleList(); //角色列表
    }
})