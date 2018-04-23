$(function() {
    //添加编辑用户
    $(".editBtn").click(function() {
        layer.open({
            type: 1,
            title: '查看编辑用户',
            shadeClose: true,
            scrollbar: false,
            skin: 'layui-layer-rim',
            area: ['650px', '500px'],
            content: $(".userPopWrap")
        })
    });
    //批量移交客户
    $(".changeClient").click(function() {
        layer.confirm('先筛选客户，再进行客户移交。每次只能移交同一个业务员的客户', {
            btn: ['我知道了'], //按钮
            title: "提示",
            area: ['600px', '167px']
        }, function() {
            layer.open({
                type: 1,
                title: '批量移交客户',
                shadeClose: true,
                scrollbar: false,
                skin: 'layui-layer-rim',
                area: ['500px', '400px'],
                content: $(".custormHandelPop")
            })
        });
    });
    //删除用户
    $(".deleteBtn").click(function() {
        var $this = $(this);
        layer.confirm('确定要删除吗？', {
            btn: ['确定', '取消']
        }, function() {
            $this.parents("tr").remove();
            layer.msg('删除成功', {
                icon: 1
            });
        });
    });
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
