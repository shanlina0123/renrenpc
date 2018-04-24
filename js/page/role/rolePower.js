var vm = new Vue({
    el: '#rolePowerId',
    data: {
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token, //token
        powerList: [],
        hadPowerList: [],
        name: "", //浏览器传过来的角色名称
        radioid: "", //单选val
        islook: "" //视野权限
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
                    console.log(that.powerList);
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
            this.getHadPowerList(this.GetQueryString("uuid"))
            this.name = this.GetQueryString("name")
            this.islook = this.GetQueryString("islook")
        },
        //获得这个角色已经存在的权限列表
        getHadPowerList: function(role_uuid) {
            var that = this;
            var url = auth_conf.role_HadPower + role_uuid;
            axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                layui.use('form', function() {
                    var form = layui.form
                    if (data.status == 1) {
                        that.hadPowerList = data.data;
                        //console.log(that.hadPowerList);
                    } else {
                        layer.msg(data.messages, { icon: 6 });
                    }
                });

            }).catch(function(error) {});
        },
        //提交选中的权限
        submitPowers: function(role_uuid) {
            var that = this; //再生成一个Id以为数组做参数即可
            var url = auth_conf.role_HadPower + role_uuid;
            //var checkedList = $("#powerFrom input:checked");
            //console.log(checkedList);
            var selectedData = [];
            $("#powerFrom input:checked").each(function() {
                var $this = $(this);
                var ids = $this.title;
                selectedData.push({ id: ids });
            });
            console.log(selectedData);
            // axios.put(url, { islook: that.radioid }, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
            //     var data = response.data
            //     if (data.status == 1) {

            //     } else {
            //         layer.msg(data.messages, { icon: 6 })
            //     }
            // }).catch(function(error) {})
        },
    },
    created: function() {
        var that = this;
        that.enterParam(); //获得浏览器传来的参数
        that.getPowerList(); //获得角色列表
    },
})

$(function() {
    layui.use(['form', 'layer', 'jquery'], function() {
        var form = layui.form;
        var layer = layui.form;
        var $ = layui.jquery;
        //全选全不选
        form.on('checkbox(allChoose)', function(data) {
            var childCheck = $(data.elem).parents(".topCheck").siblings(".powerInnerUl").find("input");
            childCheck.each(function(index, item) {
                item.checked = data.elem.checked;
            });
            form.render('checkbox');
        });
        //监听视野权限的单选按钮
        form.on('radio()', function(data) {
            var radioId = data.value;
            vm.radioid = radioId;
        });
    });
    //网代
    // var selectedData = [];
    // $(":checkbox:checked").each(function() {
    //     var tablerow = $(this).parent("tr");
    //     var code = tablerow.find("[name='p_code']").val();
    //     var name = tablerow.find("[name='p_name']").val();
    //     var price = tablerow.find("[name='p_price']").val();
    //     selectedData.push({ Code: code, Name: name, Price: price });
    // });
});