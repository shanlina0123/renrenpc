var vm = new Vue({
    el: '#adminTable',
    data: {
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token, //token
        adminList: [], //用户列表
        roleList: [],
        uuid: "",
        params: { //编辑和修改的参数
            name: "",
            nickname: "",
            mobile: "",
            roleid: "",
            password: "",
            status: "",
            uuid: ""
        },
        pages: 0,
        page_data: { //分页数据
            total: 0,
            to: 0,
        },
        page: 1,
    },
    methods: {
        //获取用户列表
        getAdminList: function(loading) {
            var that = this;
            var url = auth_conf.admin_list;
            axios.get(url, { params: { page: that.page }, headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                if (data.status == 1) {
                    that.adminList = data.data.data;
                    console.log(that.adminList);
                    that.page_data.total = data.data.total;
                    that.page_data.to = data.data.to;
                    if (loading != "loadingPageData") {
                        that.getPageData();
                    }
                } else {
                    layer.msg(data.messages, { icon: 6 });
                }
            }).catch(function(error) {});
        },
        //分页
        getPageData: function() {
            var that = this;
            layui.use(['laypage', 'layer', 'form'], function() {
                var laypage = layui.laypage;
                var form = layui.form;
                //总页数大于页码总数
                laypage.render({
                    elem: 'pagerInner',
                    count: that.page_data.total, //总页
                    limit: that.page_data.to, //每页显示
                    jump: function(obj, first) {
                        if (!first) {
                            that.page = obj.curr;
                            that.getAdminList("loadingPageData");
                        }
                    }
                });
                form.render();
            });
        },
        //查看和新增用户弹窗
        getEditAdmin: function(uuid) {
            var that = this;
            that.getRole(); //获取角色列表
            if (uuid) {
                var url = auth_conf.admin_edit + uuid;
                axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                    var data = response.data;
                    if (data.status == 1) {
                        that.adminEdit = data.data;
                        $("#popRoleList").val(data.data.roleid);
                        that.params.name = data.data.name;
                        that.params.nickname = data.data.nickname;
                        that.params.mobile = data.data.mobile;
                        that.params.uuid = data.data.uuid;
                        that.params.status = data.data.status;
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
                        layer.msg(data.messages);
                    }
                })
            } else {
                that.params.name = "";
                that.params.nickname = "";
                that.params.mobile = "";
                that.params.uuid = "";
                that.params.status = "";
                that.params.roleid = $("#popRoleList").val("");
                that.params.roleid = $("#roleIdID").val("");
                layer.open({
                    type: 1,
                    title: '新增用户',
                    shadeClose: true,
                    scrollbar: false,
                    skin: 'layui-layer-rim',
                    area: ['500px', '500px'],
                    content: $(".userPopWrap")
                })
            }
        },
        //获取弹窗是下拉的角色列表
        getRole: function() {
            var url = auth_conf.role_list;
            var that = this;
            axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                if (data.status == 1) {
                    that.roleList = data.data;
                    selectAppendDd($("#popRoleList"), that.roleList, "id", "name")
                }
            })
        },
        //锁定和解锁用户
        lockAdmin: function(thischecked, uuid) {
            var that = this;
            if (uuid) {
                var url = auth_conf.admin_lock + uuid;
                axios.put(url, {}, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                    // var data = response.data;
                    // if (data.status == 1) {
                    //     layer.msg("编辑成功");
                    //     that.getAdminList();
                    // } else if (data.status == 10) {
                    //     layer.msg("您不能编辑管理员信息");
                    // } else {
                    //     layer.msg("编辑失败");
                    // }
                })
            }
        },
        //提交客户修改、新增
        submitUser: function(uuid) {
            var that = this;
            var roleidVal = $("#popRoleList").val();
            var statusVal = $("#roleIdID").val();
            that.params.roleid = roleidVal;
            if (statusVal == "锁定") {
                that.params.status = "0";
            } else {
                that.params.status = "1";
            }
            if (uuid) {
                //编辑查看用户
                var url = auth_conf.admin_edit + uuid
                if (that.params.nickname == "") {
                    layui.use("layer", function() {
                        layer.msg("请填写用户姓名");
                    })
                } else if (that.params.roleid == "") {
                    layui.use("layer", function() {
                        layer.msg("请选择用户角色");
                    })
                } else if (that.params.mobile == "") {
                    layui.use("layer", function() {
                        layer.msg("请填写用户手机号码");
                    })
                } else if (that.params.name == "") {
                    layui.use("layer", function() {
                        layer.msg("请填写用户账号");
                    })
                } else {
                    axios.put(url, that.params, { headers: { "Authorization": that.tokenValue } })
                        .then(function(response) {
                            console.log(response);
                            var data = response.data;
                            if (data.status == 1) {
                                layui.use(['layer'], function() {
                                    var layer = layui.layer;
                                    layer.msg(data.messages);
                                    layer.closeAll('page');
                                    location.href = location.href;
                                })
                            } else {
                                layui.use(['layer'], function() {
                                    var layer = layui.layer;
                                    layer.msg(data.messages);
                                });
                            }
                        })
                }
            } else {
                //新增用户
                var url = auth_conf.admin_list;
                if (that.params.nickname == "") {
                    layui.use("layer", function() {
                        layer.msg("请填写用户姓名");
                    })
                } else if (that.params.roleid == "") {
                    layui.use("layer", function() {
                        layer.msg("请选择用户角色");
                    })
                } else if (that.params.mobile == "") {
                    layui.use("layer", function() {
                        layer.msg("请填写用户手机号码");
                    })
                } else if (that.params.name == "") {
                    layui.use("layer", function() {
                        layer.msg("请填写用户账号");
                    })
                } else {
                    axios.post(url, that.params, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                        var data = response.data;
                        if (data.status == 1) {
                            layui.use(['layer'], function() {
                                var layer = layui.layer;
                                layer.msg(data.messages);
                                layer.closeAll('page')
                            })
                        } else {
                            layui.use(['layer'], function() {
                                var layer = layui.layer;
                                layer.msg(data.messages);
                            });
                        }
                    })
                }
            }
        }
    },
    created: function() {
        var that = this;
        that.getAdminList() //用户列表
    }
});
$(function() {
    layui.use(["form", "layer"], function() {
        var form = layui.form;
        var layer = layui.layer
        form.on('checkbox()', function(data) {
            var thisuuid = data.elem.id;
            var thischecked = data.elem.checked;
            vm.lockAdmin(thischecked, thisuuid);
        })
    })
})