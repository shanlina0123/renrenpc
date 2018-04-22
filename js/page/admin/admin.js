$(function() {
    //验证
    if ($(".layui-form2").length) {
        $(".layui-form2").Validform({
            btnSubmit: '.layui-btn',
            tiptype: 1,
            postonce: true,
            showAllError: false,
            tiptype: function(msg, o, cssctl) {
                if (!o.obj.is("form")) {
                    if (o.type != 2) {
                        var objtip = o.obj.parents('.layui-form-item').find(".Validform_checktip");
                        objtip.addClass('Validform_skate');
                        cssctl(objtip, o.type);
                        layer.msg(msg, { icon: 5, time: 2000, shift: 6 });
                    }
                }
            }
        })
    }
})

var vm = new Vue({
    el: '#adminTable',
    data: {
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token, //token
        adminList: [], //用户列表
        adminEdit: '', //编辑用户nickname是姓名，name是账号

    },
    methods: {
        //获取用户列表
        getAdminList: function() {
            var that = this;
            var url = auth_conf.admin_list;
            axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                if (data.status == 1) {
                    that.adminList = data.data;
                    //console.log(that.adminList);
                    layui.use(['form'], function() {
                        var form = layui.form;
                        form.render('checkbox');
                    });
                } else {

                }
            })
        },
        //编辑用户
        getEditAdmin: function(uuid) { //判断一下uuid
            var that = this;
            if (uuid) {
                var url = auth_conf.admin_edit + uuid;
                axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                    var data = response.data;
                    if (data.status == 1) {
                        that.adminEdit = data.data;
                        layer.open({
                            type: 1,
                            title: '新增编辑用户',
                            shadeClose: true,
                            scrollbar: false,
                            skin: 'layui-layer-rim',
                            area: ['500px', '500px'],
                            content: $(".userPopWrap")
                        })
                    } else if (data.status == 10) {
                        layer.msg("抱歉，您不能查看管理员信息！");
                    }
                })
            }
        },
    },
    created: function() {
        var that = this;
        that.getAdminList(); //用户列表
        that.getEditAdmin(); //编辑用户
    }
})