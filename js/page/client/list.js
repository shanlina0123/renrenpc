$(function () {

    // layui.use(['form'], function() {
    //     var form = layui.form;
    //     form.on('select(filter)', function(data)
    //     {
    //         var value = data.value
    //         console.log(value); //得到select原始DOM对象
    //     });
    // });
});
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
        tokenUserInfo: JSON.parse(localStorage.getItem("userinfo")),
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token,
        pages: 0,
        page_data: { //分页数据
            total: 0,
            to: 0,
        },
    },
    methods: {
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
    }
});
