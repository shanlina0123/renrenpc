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
            var url = auth_conf.role_list;

            axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                layui.use('form', function() {
                    var form = layui.form;
                });
                if (data.status == 1) {
                    that.roleList = data.data;
                    //console.log(that.roleList)
                } else {
                    //layer.msg("错误");
                }
            })
        },
        //添加角色弹窗
        addRole: function() {
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
                //console.log(that.name);
                axios.post(url, that.name, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                    var data = response.data;
                    if (data.status == 1) {
                        layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg("添加角色成功", function() {
                                layer.closeAll();
                            });
                        });
                        that.getRoleList();
                    } else {
                        layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg("添加角色失败", function() {
                                layer.closeAll();
                            });
                        });
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
                    if (response.data.status == 1) {
                        layer.msg('删除成功', { icon: 1 });
                        that.getRoleList();
                    } else if (response.data.status == 14) {
                        layer.msg("角色下关联有用户，不能删除", function() {
                            layer.closeAll();
                        });
                    } else if (response.data.status == 10) {
                        layer.msg("不能删除管理员角色", function() {
                            layer.closeAll();
                        });
                    }
                })
            });
        },
        //编辑权限跳转页面
        editRole: function(uuid, roleName) {
            if (!uuid) {
                layer.msg("连接错误", { icon: 6 });
            }
            var targetUrl = "uuid=" + uuid;
            if (roleName) {
                targetUrl += "&name=" + roleName;
            }
            window.location.href = "../roles/rolePower.html?" + encodeURIComponent(targetUrl);
        },
    },
    created: function() {
        var that = this;
        that.getRoleList(); //角色列表
    }
})