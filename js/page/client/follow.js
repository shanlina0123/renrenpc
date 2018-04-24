var vm = new Vue({
    el: '#vue_client_follow',
    data: {
        params:{"uuid":null},//请求参数
        clientid:null,
        follow_list: [],//客户列表
        default_followstatus_datas: [],//状态列表
        show_followstatus_datas:[],//显示的客户状态
        add_params:{clientid:null,followstatusid:null,content:null},//跟进参数
        newFollowData:{followstatusid:null,content:null,username:null,time:null},
        tokenUserInfo: JSON.parse(localStorage.getItem("userinfo")),
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token,
    },
    methods: {
        GetQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var url_param = decodeURIComponent(window.location.search)
            var r = url_param.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        //其他链接进去的参数获取
        enterParam: function() {
            this.clientid=this.GetQueryString("clientid");
            this.getFollowList(this.GetQueryString("uuid"));
        },
        //获取跟进列表
        getFollowList: function (uuid) {
            var that = this;
            var url = auth_conf.client_follow_list+uuid;
            //token
            axios.get(url, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        that.follow_list = data.data;
                    } else {
                        layer.msg(data.messages, {icon: 7});
                    }
                }).catch(function (error) {
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
                        that.show_followstatus_datas = arrayIndexToValue(data.data, "id");
                        selectAppendDd($("#showSearchStatus"), that.default_followstatus_datas, "id", "name");
                    }
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        //跟进
        submitClick: function() {

            if($("#showSearchStatus").val()==""){
                return;
            }
            $("#followButton").addClass("hidden");
            var url = auth_conf.client_follow;
            var that = this;
            that.add_params.clientid = $("#clientid").val();
            that.add_params.followstatusid =  $("#showSearchStatus").val();
            that.add_params.content =  $("#followContent").val();
            //token
            axios.put(url, that.add_params, { headers: { "Authorization": that.tokenValue } })
                .then(function(response) {
                    var data = response.data;
                    if (data.status == 1) {
                        //显示新录入的记录
                        that.newFollowData=data.data;
                        that.newFollowData.username=that.tokenUserInfo.nickname;
                        //移除隐藏
                        $("#ajaxNewFollowList").removeClass("hidden");
                        layui.use('layer',  function(id)  {
                            var  layer  =  layui.layer;
                            layer.msg(data.messages);
                        });
                    } else {
                        //  alert(data.messages)
                        layui.use('layer',  function(id)  {
                            var  layer  =  layui.layer;
                            layer.msg(data.messages);
                        });
                    }
                    $("#followButton").removeClass("hidden");
                    // console.log(response.data.status);
                }).catch(function(error) {
                layui.use('layer',  function(id)  {
                    var  layer  =  layui.layer;
                    layer.msg("系统错误");
                });
                //console.log(error);
                // console.log(this);
            });
            // $(".followForm").validate({
            //     errorLabelContainer: $(".errorLabel"),
            //     rules: {
            //         showSearchStatus: {
            //             required: true
            //         }
            //     },
            //     messages: {
            //         showSearchStatus: {
            //             required: "请选择客户状态"
            //         }
            //     },
            //     submitHandler: function(form) {
            //         //token
            //         axios.post(url, that.add_params, { headers: { "Authorization": that.tokenValue } })
            //             .then(function(response) {
            //                 var data = response.data;
            //                 if (data.status == 1) {
            //                     window.location.href = "../client/client.html";
            //                 } else {
            //                     //  alert(data.messages)
            //                     layui.use('layer',  function(id)  {
            //                         var  layer  =  layui.layer;
            //                         layer.msg(data.messages);
            //                     });
            //                 }
            //                 // console.log(response.data.status);
            //             }).catch(function(error) {
            //             layui.use('layer',  function(id)  {
            //                 var  layer  =  layui.layer;
            //                 layer.msg("系统错误");
            //             });
            //             //console.log(error);
            //             // console.log(this);
            //         });
            //
            //     }
            // })

        }

    },
    created: function () {
        var that = this;
        that.enterParam();//进入参数
        that.getDefaultDataOne();//所有客户状态
    },mounted:function(){
        // $("#top").load('/page/public/top.html');
        // $("#left").load('/page/public/left.html');
    }
});
