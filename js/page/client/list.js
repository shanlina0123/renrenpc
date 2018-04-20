

var vm = new Vue({
        el: '#vue_client_list',
        data: {
            search_params: { housename: null, followstatusid: null,levelid:null,ownadminid:null, page: 1 },//搜索参数
            client_list: [],//客户列表
            level_datas: [],//搜索-级别列表
            users_datas:[],//搜索-业务员列表
            housename:null,//搜索-楼盘
            default_followstatus_datas: [],//状态列表
            tokenUserInfo: JSON.parse(localStorage.getItem("userinfo")),
            tokenValue: JSON.parse(localStorage.getItem("userinfo")).token,
            pages: 0,
            opt: {}
        },
        methods: {
            //点击搜索按钮
            searchClick: function() {
                this.search_params.followstatusid=$("#showSearchStatus").val();
                this.search_params.levelid=$("#showSearchLevel").val();
                this.search_params.ownadminid=$("#showSearchUser").val();
                this.search_params.housename = this.$refs.housename.value;
                this.search_params.page = 1;
                this.getClientList();
            },
            //获取客户列表
            getClientList: function() {
                var url = auth_conf.client_list;
                var that = this;
                //token
                axios.get( url,{ params: that.search_params,headers: {"Authorization": that.tokenValue}})
                    .then(function(response) {
                        var data = response.data;
                        if (data.status == 1) {
                            that.client_list = data.data.data;
                            that.pages = data.data.last_page;
                        }
                    }).catch(function(error) {});
            },
            //获取客户状态 -默认单分类列表
            getDefaultDataOne: function() {
                var url = auth_conf.datas_default_one + "8";
                var that = this;
                axios.get(url, { headers: { "Authorization": that.tokenValue } })
                    .then(function(response) {
                        var data = response.data;
                        if (data.status == 1) {
                            //客户状态
                            that.default_followstatus_datas = data.data;
                            selectAppendDd($("#showSearchStatus"),that.default_followstatus_datas,"id","name");
                        }
                    })
                    .catch(function(error) {
                        //console.log(error);
                    });
            },
            //获取级别- 下拉框值
            getDataOne: function() {
                var url = auth_conf.datas_one + "4";
                var that = this;
                axios.get(url, { headers: { "Authorization": that.tokenValue } })
                    .then(function(response) {
                        var data = response.data;
                        if (data.status == 1) {
                            //客户等级
                            that.level_datas = data.data;
                            selectAppendDd($("#showSearchLevel"),that.level_datas,"id","name");

                        }
                    })
                    .catch(function(error) {
                        //console.log(error);
                    });
            },
            //获取业务员- 下拉框值
            getUsers: function() {
                var url = auth_conf.admin_list;
                var that = this;
                axios.get(url, { headers: { "Authorization": that.tokenValue } })
                    .then(function(response) {
                        var data = response.data;
                        if (data.status == 1) {
                            //业务员
                            that.users_datas = data.data;
                            selectAppendDd($("#showSearchUser"),that.users_datas,"id","nickname");
                        }
                    })
                    .catch(function(error) {
                        //console.log(error);
                    });
            }
        },
        created: function() {
            var that = this;
            that.getClientList();//客户列表
             that.getDataOne();
             that.getDefaultDataOne();
            that.getUsers();
        }


    });

// layui.use('form',function(){
//     vm.getDataOne();
//     vm.getDefaultDataOne();
//     vm.getUsers();
// });