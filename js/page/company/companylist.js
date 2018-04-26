var vm = new Vue({
    el: '#vue_company_list',
    data: {
        client_list: [],
        params:{page:1},//列表参数
        edit_params: {name: null, mobile: null, conncat: null, addr: null},//修改参数
        add_params: {name: null, mobile: null, conncat: null, addr: null},//添加参数
        compnayData:{uuid:null,name: null, mobile: null, conncat: null, addr: null},//公司详情数据
        tokenUserInfo: JSON.parse(localStorage.getItem("userinfo")),
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token,
        page_data: {
            total: 0,
            to: 0,
        }
    },
    methods: {
        //获取公司列表
        getCompanyList: function (loading) {
            var url = auth_conf.company_list;
            var that = this;
            //token
            axios.get(url,{params:that.params,headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        that.client_list = data.data.data;
                        that.page_data.total = data.data.total;
                        that.page_data.to = data.data.to;
                        if(loading!="loadingPageData")
                        {
                            that.getPageData();
                        }
                    } else {
                        layer.msg(data.messages, {icon: 6});
                    }
                }).catch(function (error) {
            });
        },
        //lay分页
        getPageData: function () {
            var that = this;
            layui.use(['laypage', 'layer', 'form'], function () {
                var laypage = layui.laypage;
                var form = layui.form;
                //总页数大于页码总数
                laypage.render({
                    elem: 'pagerInner',
                    count: that.page_data.total,//总页
                    limit: that.page_data.to,//每页显示
                    jump: function (obj, first) {
                        if (!first) {
                            that.params.page = obj.curr;
                            that.getClientList("loadingPageData");
                        }
                    }
                });
                form.render();
            });
        },
        //进入添加
        showAdd:function () {
            layer.open({
                type: 1,
                title: '添加合作公司',
                shadeClose: true,
                scrollbar: false,
                skin: 'layui-layer-rim',
                area: ['800px', '455px'],
                content: $(".custormHandelPop")
            })
        },
        //进入修改
        showEdit:function (uuid) {
            if(!uuid)
            {
                layer.msg("请求错误", {icon: 6});
            }
            var that=this;
            //获取数据
            that.getDetail(uuid);
            layer.open({
                type: 1,
                title: '编辑',
                shadeClose: true,
                scrollbar: false,
                skin: 'layui-layer-rim',
                area: ['600px', '400px'],
                content: $(".userPopWrap")
            })
        },
        //获取公司详情
        getDetail:function(uuid)
        {
            var url = auth_conf.company_detail+uuid;
            var that = this;
            axios.get(url,{headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        that.compnayData=data.data;
                    }else{
                        layer.msg(data.messages, {icon: 7});
                    }
                })
                .catch(function (error) {
                    //console.log(error);
                });

        },
        //操作 - 新增
        add:function()
        {
            var url = auth_conf.company_add;
            var that = this;
            that.add_params.name= that.$refs.name.value;
            that.add_params.mobile= that.$refs.mobile.value;
            that.add_params.conncat= that.$refs.conncat.value;
            that.add_params.addr= that.$refs.addr.value;
            axios.post(url,that.add_params, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        that.getCompanyList();
                        layer.msg(data.messages);
                        layer.closeAll('page');
                    }else{
                        layer.msg(data.messages, {icon: 7});
                    }
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        //操作-编辑
        update: function (uuid) {
            if(!uuid)
            {
                layer.msg("请求错误", {icon: 6});
            }
            var that=this;
            if(that.$refs.edit_name.value=="")
            {
                layer.msg("名称不能为空", {icon: 2});
                return;
            }
            var url = auth_conf.company_update+uuid;
            var that = this;
            that.edit_params.name= that.$refs.edit_name.value;
            that.edit_params.mobile= that.$refs.edit_mobile.value;
            that.edit_params.conncat= that.$refs.edit_conncat.value;
            that.edit_params.addr= that.$refs.edit_addr.value;
            axios.put(url,that.edit_params, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        that.getCompanyList();
                        layer.msg(data.messages);
                        layer.closeAll('page');
                    }else{
                        layer.msg(data.messages, {icon: 7});
                    }
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        //操作 - 删除
        showDelete:function(uuid)
        {
            if(!uuid)
            {
                layer.msg("请求错误", {icon: 6});
            }
            var that=this;
            layer.confirm('确定要删除吗？', {
                btn: ['确定', '取消']
            }, function() {

                that.delete(uuid);

            });
        },
        //被调用-删除
        delete:function(uuid)
        {
            var url = auth_conf.company_delete + uuid;
            var that=this;
            axios.delete(url, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        that.getCompanyList();
                        layer.msg(data.messages);
                        layer.closeAll('page');
                    } else {
                        // layer.msg(data.messages,{icon: 6});
                    }
                });
        }
    },
    created: function () {
        var that = this;
        that.getCompanyList();

    }
});