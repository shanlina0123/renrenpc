var vm = new Vue({
    el: '#vue_client_list',
    data: {
        params: {housename: null, followstatusid: null, levelid: null, ownadminid: null, page: 1},//搜索参数
        client_list: [],//客户列表
        level_datas: [],//搜索-级别列表
        admin_datas: [],//搜索-业务员列表
        housename: null,//搜索-楼盘
        default_followstatus_datas: [],//状态列表
        admin_show_datas: [],//业务员
        client_datas:[],//客户详情
        search_params: { "name": null},//客户房源搜索
        house_list:[],//房源list
        client_admin_list:[],//业务员的所有客户列表
        add_params:{name:null,followstatusid:null,levelid:null,houseid:null,comedate:null,dealdate:null},//修改客户
        trans_params:{uuid:[],accept:null,transfer:null},//移交客户参数
        tokenUserInfo: JSON.parse(localStorage.getItem("userinfo")),
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token,
        pages: 0,
        page_data: { //分页数据
            total: 0,
            to: 0,
        },
    },
    methods: {
        //进入跟进页面
        linkFollow:function(uuid,clientid){
            if(!uuid)
            {
                layer.msg("连接错误", {icon: 6});
            }
            var  target_url = "uuid=" + uuid;
            if(clientid)
            {
                target_url += "&clientid=" + clientid;
            }
            window.location.href = "../client/clientFollow.html?" + encodeURIComponent(target_url);
        },
        //进入详情页面
        clientDetail:function(clientid){
            if(!clientid){
                layer.msg("请求错误", {icon: 6});
            }
            var url = auth_conf.client_detail+clientid;
            var that = this;
            //token
            axios.get(url, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        that.client_datas = data.data;
                        $("#showEditStatus").val(data.data.followstatusid);
                        $("#showEditLevel").val(data.data.levelid);
                        $("#showSearchHouse").val(data.data.houseid);

                        //成交时间
                        layui.use(["form",'laydate'], function() {
                            var laydate=layui.laydate;
                            var form=layui.form;
                            //上门时间
                            laydate.render({
                                elem: '#comedate'
                            });
                            //成交日期
                            laydate.render({
                                elem: '#dealdate'
                            });
                            form.render('select');
                        });


                    } else {
                        layer.msg(data.messages, {icon: 6});
                    }
                }).catch(function (error) { });
            //显示出房源列表
            that.showHouseList();
            layer.open({
                type: 1,
                title: '查看编辑客户',
                shadeClose: true,
                scrollbar: false,
                skin: 'layui-layer-rim',
                area: ['765px', '500px'],
                content: $(".userPopWrap")
            });
            $(".userPopWrap").removeClass("hidden");

        },
        //详情-显示房源-模糊搜索
        showHouseList: function() {
            var url = auth_conf.client_houses;
            var that = this;
            axios.get(url,{ headers: { "Authorization": that.tokenValue } })
                .then(function(response) {
                    var data = response.data;
                    if (data.status == 1) {
                        that.house_list = data.data;
                        selectAppendDd($("#showSearchHouse"), that.house_list, "id", "name");
                    }
                })
                .catch(function(error) {
                    //console.log(error);
                });
        },
        //修改客户信息
        editSubmit:function (uuid) {
            var url = auth_conf.client_update+uuid;
            var that = this;
            that.add_params.name = that.$refs.clientname.value;//客户名称
            that.add_params.followstatusid = that.$refs.followstatusid.value;//客户状态
            that.add_params.levelid = that.$refs.levelid.value;//级别
            that.add_params.houseid = $("#showSearchHouse").val()//楼盘id
            that.add_params.comedate = that.$refs.comedate.value;//上门时间
            that.add_params.dealdate = that.$refs.dealdate.value;//成交时间
            axios.put(url, that.add_params, { headers: { "Authorization": that.tokenValue } })
                .then(function(response) {
                    var data = response.data;
                    if (data.status == 1) {
                        layer.msg(data.messages, {icon: 7},function () {
                            window.location.href = "../client/client.html";
                        });
                    } else {
                        layer.msg(data.messages, {icon: 6});
                    }
                })
                .catch(function(error) {
                    //console.log(error);
                });
        },
        //删除客户
        clientDelete:function(uuid){
            var that=this;
            if(!uuid){
                layer.msg("请求错误", {icon: 6});
            }
            layer.confirm('确定要删除吗？', {
                btn: ['确定', '取消']
            }, function() {
                $(".layui-layer-shade").remove();
                $(".layui-layer-dialog").remove();
                that.doDeleteClient(uuid);

            });
        },
        //进入移交客户
        transferClient:function(){
            //成交时间
            layui.use(["form",'jquery'], function() {
                var form = layui.form,
                    $ = layui.jquery;
            });
            layer.open({
                type: 1,
                title: '移交客户',
                shadeClose: true,
                scrollbar: false,
                skin: 'layui-layer-rim',
                area: ['900px', '500px'],
                content: $(".custormHandelPop")
            })
        },
        //获取移交人的所有客户
        changeAdmin:function(adminid,token){
            var url = auth_conf.client_admin+adminid;
            var that = this;
            axios.get(url,{ headers: { "Authorization": token} })
                .then(function(response) {
                    var data = response.data;
                    if (data.status == 1) {
                        var newDataList=[];
                       $.each(data.data,function(i,n){
                          var newData=[];
                          newData["uuid"]=n.uuid;
                           newData["name"]=n.dynamic_to_client.name+" - "+n.dynamic_to_client.mobile;
                           newDataList.push(newData);
                       });
                        that.client_admin_list=newDataList;
                        selectAppendDd($("#transClient"), that.client_admin_list, "uuid", "name");

                    } else {
                        layer.msg(data.messages, {icon: 6});
                    }
                })
                .catch(function(error) {
                    //console.log(error);
                });
        },
        //执行移交客户
        transSubmit:function(){
            var url = auth_conf.client_trans;
            var that = this;
            that.trans_params.uuid.push($("#transClient").val());
            that.trans_params.accept =$("#acceptAdmin").val();
            that.trans_params.transfer = $("#transAdmin").val();
            axios.post(url, that.trans_params, { headers: { "Authorization": that.tokenValue } })
                .then(function(response) {
                    var data = response.data;
                    if (data.status == 1) {
                        layer.msg(data.messages, {icon: 1},function () {
                            window.location.href = "../client/client.html";
                        });
                    } else {
                        layer.msg(data.messages, {icon: 6});
                    }
                })
                .catch(function(error) {
                    //console.log(error);
                });
        },
        //被调用-执行删除客户
        doDeleteClient:function(uuid){
            var url = auth_conf.client_delete+uuid;
            var that = this;
            //token
            axios.delete(url, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        layer.msg(data.messages, {icon: 1});
                        $("#clientList_"+uuid).remove();
                    } else {
                        layer.msg(data.messages, {icon: 6});
                    }
                }).catch(function (error) { });
        },
        //点击搜索按钮
        searchClick: function () {
            var status = $("#showSearchStatus").val();
            var level = $("#showSearchLevel").val();
            var admin = $("#showSearchAdmin").val();
            var house = this.$refs.housename.value;
            //设置搜索项
            this.params.followstatusid = status;
            this.params.levelid = level;
            this.params.ownadminid = admin;
            this.params.housename = house;
            this.params.page = 1;
            this.getClientList();
        },
        //获取客户列表
        getClientList: function (loading) {
            var url = auth_conf.client_list;
            var that = this;
            //token
            axios.post(url, that.params, {headers: {"Authorization": that.tokenValue}})
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
        //获取客户状态 -默认单分类列表
        getDefaultDataOne: function () {
            var url = auth_conf.datas_default_one + "8";
            var that = this;
            axios.get(url, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        //客户状态
                        that.default_followstatus_datas = data.data;
                        selectAppendDd($("#showSearchStatus"), that.default_followstatus_datas, "id", "name");
                        selectAppendDd($("#showEditStatus"), that.default_followstatus_datas, "id", "name");
                    }
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        //获取级别- 下拉框值
        getDataOne: function () {
            var url = auth_conf.datas_one + "4";
            var that = this;
            axios.get(url, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        //客户等级
                        that.level_datas = data.data;
                        selectAppendDd($("#showSearchLevel"), that.level_datas, "id", "name");
                        selectAppendDd($("#showEditLevel"), that.level_datas, "id", "name");
                    }
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        //获取业务员- 下拉框值
        getAdmins: function () {
            var url = auth_conf.admin_datas;
            var that = this;
            axios.get(url, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        //业务员
                        that.admin_datas = data.data;
                        that.admin_show_datas = arrayIndexToValue(data.data, "id");
                        selectAppendDd($("#showSearchAdmin"), that.admin_datas, "id", "nickname");
                        selectAppendDd($("#transAdmin"), that.admin_datas, "id", "nickname");
                        selectAppendDd($("#acceptAdmin"), that.admin_datas, "id", "nickname");
                    }
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
    },
    created: function () {
        var that = this;
        that.getClientList();//客户列表
        that.getDataOne();//所有级别
        that.getDefaultDataOne();//所有客户状态
        that.getAdmins();//所有业务员
    },mounted:function(){
        // $("#top").load('/page/public/top.html');
        // $("#left").load('/page/public/left.html');
    }
});
$(function(){
    //点击选择移交人
    layui.use(["form"], function() {
        var form=layui.form;
        form.on('select(transAdmin)', function(data){
            var transAdminid=$("#transAdmin").val();
            var token=vm.$data.tokenValue;
            vm.$options.methods.changeAdmin(transAdminid,token);
        });
    });

})