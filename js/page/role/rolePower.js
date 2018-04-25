var vm = new Vue({
    el: '#rolePowerId',
    data: {
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token, //token
        powerList: [],//提交参数
        hadPowerList: [],
        name: "", //浏览器传过来的角色名称
        uuid: "", //浏览器传过来的uuid
        islook:'',
    },
    methods: {
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
            this.islook = this.GetQueryString("islook")?1:0; //为了页面绑定默认的视野权限
            this.name = this.GetQueryString("name"); //为了页面绑定角色名称
            this.uuid = this.GetQueryString("uuid"); //传过来的角色uuid

        },
        //获得这个角色已经存在的权限列表
        getHadPowerList: function() {
            var that = this;
            var url = auth_conf.role_HadPower + that.uuid;
            axios.get(url, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data;
                if ( data.status == 1 )
                {
                    that.hadPowerList = data.data.functionList;
                    that.powerList = data.data.functionID;
                    layui.use('form', function() {
                        var form = layui.form;
                           form.render();
                    });

                } else
                {
                    layui.use('layer', function() {
                        var layer = layui.layer
                        layer.msg(data.messages, { icon: 6 });
                    });
                }
            }).catch(function(error) {});
        },
        //提交选中的权限
        submitPowers: function() {
            var that = this;
            var url = auth_conf.role_HadPower + that.uuid;
            axios.put(url, {functionid:that.powerList,islook:that.islook}, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                var data = response.data
                layui.use('form', function() {
                    if (data.status == 1)
                    {
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
            var that = this;
            var el = event.currentTarget;
            var childCheck = $(el).siblings(".powerInnerUl").find("input");
            var check = $(el).find('input').is(':checked');
            var fid = parseInt($(el).find('input').attr('id'));
            childCheck.each(function(index, item)
            {
                var id = parseInt($(item).attr('id'));
                if( check == true )
                {
                    //添加父
                    if( $.inArray(fid,that.powerList) == -1 )
                    {
                        that.powerList.push(fid);
                    }
                    //添加子
                    if( $.inArray(id,that.powerList) == -1 )
                    {
                        that.powerList.push(id);
                    }
                }else
                {
                    //删除父
                    if( $.inArray(fid,that.powerList) != -1 )
                    {
                        that.powerList.splice($.inArray(fid,that.powerList),1);
                    }
                    //删除子
                    if( $.inArray(id,that.powerList) != -1 )
                    {
                        that.powerList.splice($.inArray(id,that.powerList),1);
                    }
                }
                item.checked = check;
            });
            layui.use('form', function() {
                var form = layui.form;
                form.render();
            })
        },
        //单选
        checkOne:function(event)
        {
            var that = this;
            var el = event.currentTarget;
            var check = $(el).find('input').is(':checked');
            var id = parseInt($(el).find('input').attr('id'));
            if( check == true )
            {
                if( $.inArray(id,that.powerList) == -1 )
                {
                    that.powerList.push(id);
                }
            }else
            {
                //删除
                if( $.inArray(id,that.powerList) != -1 )
                {
                    that.powerList.splice($.inArray(id,that.powerList),1);
                }
            }
        },
        //监听单选按钮的值
        forRadio: function(event) {
            var that = this;
            var el = event.currentTarget;
            var check = $(el).find('input');
            check.each(function(index, item)
            {
                if($(item).is(':checked'))
                {
                    that.islook = $(item).val();
                }
            });

        }
    },
    created: function() {
        var that = this;
        that.enterParam(); //获得浏览器传来的参数
        that.getHadPowerList(); //获得角色已有的权限
    }
});