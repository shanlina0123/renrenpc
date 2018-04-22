$(function() {
    //验证
    // if ($(".layui-form2").length) {
    //     $(".layui-form2").Validform({
    //         btnSubmit: '.layui-btn',
    //         tiptype: 1,
    //         postonce: true,
    //         showAllError: false,
    //         tiptype: function(msg, o, cssctl) {
    //             if (!o.obj.is("form")) {
    //                 if (o.type != 2) {
    //                     var objtip = o.obj.parents('.layui-form-item').find(".Validform_checktip");
    //                     objtip.addClass('Validform_skate');
    //                     cssctl(objtip, o.type);
    //                     layer.msg(msg, { icon: 5, time: 2000, shift: 6 });
    //                 }
    //             }
    //         }
    //     })
    // }

})

var vm = new Vue({
    el: '#adminTable',
    data: {
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token, //token
        adminList: [], //用户列表
        adminEdit: '', //编辑用户nickname是姓名，name是账号
        roleList: [],
        uuid: "",
    },
    methods: {
        //获取用户列表
        getAdminList: function() {
            var that = this;
            var url = auth_conf.admin_list;
            axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                if (data.status == 1) {
                    that.adminList = data.data.data;
                    //console.log(that.adminList);
                    layui.use(['form'], function() {
                        var form = layui.form;
                        form.render('checkbox');
                    });
                } else {

                }
            })
        },
        //查看用户
        getEditAdmin: function(uuid) {
            var that = this;
            if (uuid) {
                that.getRole();
                var url = auth_conf.admin_edit + uuid;
                axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                    var data = response.data;
                    if (data.status == 1) {
                        that.adminEdit = data.data;
                        $("#popRoleList").val(data.data.roleid);
                        //console.log(that.adminEdit);
                        layer.open({
                            type: 1,
                            title: '查看编辑用户',
                            shadeClose: true,
                            scrollbar: false,
                            skin: 'layui-layer-rim',
                            area: ['500px', '500px'],
                            content: $(".userPopWrap")
                        });
                        layui.use(['form'], function() {
                            var form = layui.form;
                            form.render('select');
                        });
                    } else if (data.status == 10) {
                        layer.msg("抱歉，您不能查看管理员信息！");
                    }
                })
            }
        },
        //获取角色列表
        getRole: function() {
            var url = auth_conf.role_list;
            var that = this;
            axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                if (data.status == 1) {
                    that.roleList = data.data;
                    //console.log(that.roleList);
                    selectAppendDd($("#popRoleList"), that.roleList, "id", "name");
                }
            })
        },
        //锁定用户(未成功，Vue中监听layui的复选框事件)
        lockAdmin: function(uuid) {
            console.log(uuid);
            if (uuid) {
                var url = auth_conf.admin_lock + uuid;
                axios.post(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                    var data = response.data;
                    if (data.status == 1) {
                        layer.msg("设置成功");
                    } else {
                        layer.msg("抱歉，您不能修改管理员信息")
                    }
                })
            } else {
                layer.msg("抱歉，您不能查看管理员信息！");
            }
        },
        //添加用户弹窗
        addAdmin: function() {
            var that = this;
            layer.open({
                type: 1,
                title: '新增用户',
                shadeClose: true,
                scrollbar: false,
                skin: 'layui-layer-rim',
                area: ['500px', '500px'],
                content: $(".userPopWrap")
            })
        },
        //提交客户修改、新增和查看
        submitUser: function(uuid) {
            //console.log(uuid);
            var that = this;
            // if (uuid) {
            //     //编辑或者查看
            //     var url = auth_conf.admin_edit + uuid;
            //     axios.put(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
            //         if (response.status == 1) {
            //             layer.msg("修改成功");
            //             //that.getAdminList();
            //         }
            //     })
            // } else {
            //     //新增用户
            //     var url = auth_conf.admin_list;
            //     axios.post(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
            //         if (response.status == 1) {
            //             layer.msg("新增用户成功");
            //             //that.getAdminList();
            //         }
            //     })
            // }
        }
    },
    created: function() {
        var that = this;
        that.getAdminList(); //用户列表

    }
})