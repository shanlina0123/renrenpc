var vm = new Vue({
    el: '#rolePowerId',
    data: {
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token, //token
        powerList: [],
        hadPowerList: [],
        name: "", //浏览器传过来的角色名称
        uuid: "", //浏览器传过来的uuid
        params: {
            islook: "", //浏览器传过来的视野权限
            functionid: []
        }
    },
    methods: {
        //角色列表
        getPowerList: function() {
            var that = this;
            var url = auth_conf.role_power;
            axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                if (data.status == 1) {
                    that.powerList = data.data;
                    layui.use('form', function() {
                        var form = layui.form;
                        form.render();
                    })
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
            this.params.islook = this.GetQueryString("islook"); //为了页面绑定默认的视野权限
            this.name = this.GetQueryString("name"); //为了页面绑定角色名称
            this.uuid = this.GetQueryString("uuid"); //传过来的角色uuid

        },
        //获得这个角色已经存在的权限列表
        getHadPowerList: function() {
            var that = this;
            var url = auth_conf.role_HadPower + that.uuid;
            axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                layui.use('form', function() {
                    var form = layui.form
                    if (data.status == 1) {
                        that.hadPowerList = data.data
                    } else {
                        layer.msg(data.messages, { icon: 6 });
                    }
                })
            }).catch(function(error) {});
        },
        //提交选中的权限
        submitPowers: function() {
            var that = this;
            var url = auth_conf.role_HadPower + that.uuid;
            $("#powerFrom input[type=checkbox]:checked").each(function() {
                that.params.functionid.push($(this).attr('id'))
            });
            axios.put(url, that.params, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data
                layui.use('form', function() {
                    if (data.status == 1) {
                        layer.msg(data.messages, { time: 2000 }, function() {
                            window.location.href = 'roles.html?id=' + that.uuid;
                        });
                    } else if (data.status == 10) {
                        layer.msg(data.messages)
                    } else {
                        layer.msg(data.messages)
                    }
                })
            }).catch(function(error) {})
        },
        //全选
        checkAll: function(event) {
            var el = event.currentTarget;
            var childCheck = $(el).siblings(".powerInnerUl").find("input");
            var check = $(el).find('input').is(':checked')
            childCheck.each(function(index, item) {
                item.checked = check;
            });
            layui.use('form', function() {
                var form = layui.form;
                form.render();
            })
        },
        //监听单选按钮的值
        forRadio: function() {
            var that = this;
            layui.use('form', function() {
                var form = layui.form;
                form.on('radio()', function(data) {
                    that.params.islook = data.value;
                })
            })
        }
    },
    created: function() {
        var that = this;
        that.enterParam(); //获得浏览器传来的参数
        that.getPowerList(); //获得角色列表
        that.getHadPowerList(); //获得角色已有的权限
    }
});