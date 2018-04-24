var vm = new Vue({
    el: '#vue_datas_setting',
    data: {
        cateList: [],//分类列表
        datasList: [],//属性列表
        add_update_params: {cateid: null, name: null},
        runCateid:null,
        tokenUserInfo: JSON.parse(localStorage.getItem("userinfo")),
        tokenValue: JSON.parse(localStorage.getItem("userinfo")).token,
        newIndex:0
    },
    methods: {
        //获取属性分类
        getCateList: function () {
            var url = auth_conf.datas_cate_list;
            var that = this;
            axios.get(url, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        that.cateList = data.data;
                        layui.use(['form', "layer"], function () {
                            var form = layui.form;
                            var layer = layui.layer;
                        });
                    }
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        //操作 - 设置锁定
        removeDatas: function (uuid) {
            if (!uuid) {
                layer.msg("请求错误", {icon: 6});
            }
            var that = this;
            layer.confirm('确定要删除吗？', {
                btn: ['确定', '取消']
            }, function() {
                var tag=$("#existList_"+uuid);
                //删除
                that.deleteData(uuid,null,tag);
            });
        },
        //操作 - 进入查看编辑
        showDatasList: function (cateid) {
            var that = this;
            if (!cateid) {
                layer.msg("请求错误", {icon: 6});
            }
            that.runCateid=cateid;
            //加载数据
            that.getDataOne(cateid);

            //加载样式
            that.hideDetail(null,1);

            //移除已有的新加的inputs
            $(".newDateOneTr").remove();

            layer.open({
                type: 1,
                title: '系统设置',
                shadeClose: true,
                scrollbar: false,
                skin: 'layui-layer-rim',
                area: ['800px', '500px'],
                content: $(".settingPop")
            });
            $(".settingPop").removeClass("hidden");
        },
        //被调用-查看单分类属性列表
        getDataOne: function (cateid) {
            var url = auth_conf.datas_one + cateid;
            var that = this;
            axios.get(url, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        //属性列表
                        that.datasList = IndexArrayToArray(data.data);
                        that.newIndex=count(data.data)*1+1;
                        layui.use(['form', "layer"], function () {
                            var form = layui.form;
                            var layer = layui.layer;
                        });
                    }else{
                        that.newIndex=1;
                    }
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        //操作 -异步- 添加属性
        addDatas: function (token,add_update_params,tag) {
            var url = auth_conf.datas_add;
            var that = this;
            axios.post(url, add_update_params, {headers: {"Authorization": token}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        layer.msg(data.messages, {icon: 1});
                        //设置样式标识
                        that.setHideDetail(data.data.uuid,tag);
                        //设置显示
                        that.hideDetail(data.data.uuid);
                    } else {
                        layer.msg(data.messages, {icon: 7});
                    }
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        //操作 -同步- 修改属性
        updateData: function (uuid,token,add_update_params) {
            var url = auth_conf.datas_update + uuid;
            var that = this;

            if (!uuid) {
                layer.msg("请求错误", {icon: 6});
            }
              if(!add_update_params)
              {
                  var name = $(".settingName_"+uuid).val();
                  if (!name) {
                      layer.msg("名称不能为空", {icon: 6});
                  }
                  that.add_update_params.cateid = this.runCateid;
                  that.add_update_params.name = name;
              }else{
                  that.add_update_params=add_update_params;
              }

            //请求数据
            that.updateRequest(uuid,token);
        },
        //被调用-修改属性
        updateRequest: function (uuid,token) {
            var url = auth_conf.datas_update + uuid;
            var that = this;
            if(!token)
            {
               token= that.tokenValue;
            }
            axios.put(url, that.add_update_params, {headers: {"Authorization":token}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        layer.msg(data.messages, {icon: 1});
                        that.hideDetail(uuid);
                    } else {
                        layer.msg(data.messages, {icon: 7});
                    }
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        //被调用删除
         deleteData: function (uuid,token,tag) {
            var url = auth_conf.datas_delete + uuid;
            var that = this;
            if(!token)
            {
                token=that.tokenValue;
            }
            axios.put(url, null, {headers: {"Authorization":token}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        layer.msg(data.messages, {icon: 1});
                        //移除行
                        tag.remove();
                    } else {
                        layer.msg(data.messages, {icon: 7});
                    }
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        //效果 - 开启编辑框
        enableInupt: function (uuid) {
            var that = this;
            if (!uuid) {
                layer.msg("请求错误", {icon: 6});
            }
            //系统弹窗的编辑功能
            that.enableDeatil(uuid);
        },
        //效果 -添加新行
        addNewRow: function () {
            var that=this;
            that.newIndex=$(".dateOneTrHide:last").attr("index")*1+1;
            var tsble = $(".popSettingTable");
            var addTr = $(".dateOneTrHide").clone(true).removeClass("hidden").removeClass("dateOneTrHide").addClass("newDateOneTr");
            tsble.append(addTr);

        },
        //效果 - 被调用 开启编辑框
        enableDeatil: function (uuid) {
            $(".settingName_" + uuid).removeAttr("readonly");//input输入框可输入
            $(".settingName_" + uuid).removeAttr("style");//input输入框颜色恢复
            $(".saveBtn_" + uuid).removeClass("hidden");//显示出保存按钮
            $(".editDatasBtn_" + uuid).addClass("hidden");//编辑按钮隐藏
        },
        setHideDetail:function(uuid,tag)
        {
            //设置成功后的标识
            tag.attr("uuid",uuid);
            tag.find(".settingAllName").addClass("settingName_"+uuid);
            tag.find(".editAllDataBtn").addClass("editDatasBtn_"+uuid);
            tag.find(".saveAllBtn").addClass("saveBtn_"+uuid);
        },
        //效果 - 被调用 - 开启编辑框
        hideDetail: function (uuid,first) {
            //修改后样式
            if (uuid) {
                if(first==1){
                    $(".settingName_" + uuid+":not('.hieName')").removeAttr("readonly").attr("readonly","readonly");//input输入框不可输入
                    $(".settingName_" + uuid+":not('.hieName')").removeAttr("style").css("background-color", "#f2f2f2");//input输入框颜色恢复
                    $(".hieName").removeAttr("readonly");
                    $(".hieName").removeAttr("style");
                }else{
                    $(".settingName_" + uuid).removeAttr("readonly").attr("readonly","readonly");//input输入框不可输入
                    $(".settingName_" + uuid).removeAttr("style").css("background-color", "#f2f2f2");//input输入框颜色恢复
                }
                $(".saveBtn_" + uuid).removeClass("hidden").addClass("hidden");//隐藏保存按钮
                $(".editDatasBtn_" + uuid).removeClass("hidden");//编辑按钮显示
            } else {
                //添加后样式
                if(first==1){
                    $(".settingAllName:not('.hieName')").removeAttr("readonly").attr("readonly","readonly");//input输入框不可输入
                    $(".settingAllName:not('.hieName')").removeAttr("style").css("background-color", "#f2f2f2");//input输入框颜色恢复
                    $(".hieName").removeAttr("readonly");
                    $(".hieName").removeAttr("style");
                    $(".saveAllBtn:not('.hideSave')").removeClass("hidden").addClass("hidden");//隐藏保存按钮
                    $(".editAllDataBtn:not('.hideEdit')").removeClass("hidden");//编辑按钮显示
                }else{
                    $(".settingAllName").removeAttr("readonly").attr("readonly","readonly");//input输入框不可输入
                    $(".settingAllName").removeAttr("style").css("background-color", "#f2f2f2");//input输入框颜色恢复
                    $(".hieName:first").removeAttr("readonly");
                    $(".hieName:first").removeAttr("style");
                    $(".editAllDataBtn").removeClass("hidden").addClass("hidden");//隐藏编辑按钮
                    $(".saveAllBtn").removeClass("hidden");//保存按钮显示
                }

            }

        }
    },
    created: function () {
        var that = this;
        that.getCateList();//属性分类列表

    }, mounted: function () {
        // $("#top").load('/page/public/top.html');
        // $("#left").load('/page/public/left.html');
    }
});

$(function(){
    //新增的那条记录，异步保存
    $(".newSaveDatasBtn").click(function(){
        var tag=$(this).parents("tr");
        var token=vm.$data.tokenValue;
        var uuid=tag.attr("uuid");
        //请求参数
        var add_update_params=vm.$data.add_update_params;
        add_update_params.cateid=vm.$data.runCateid;
        add_update_params.name=tag.find(".settingAllName").val();
        if(uuid)
        {
            //修改
            vm.$options.methods.updateData(uuid,token,add_update_params);
        }else{
            //添加
            vm.$options.methods.addDatas(token,add_update_params,tag);
        }
    });

    //新增的那条记录，开启编辑
    $(".newEditDatasBtn").click(function(){
        var uuid=$(this).parents("tr").attr("uuid");
        vm.$options.methods.enableDeatil(uuid);
    });

    //新增的那条记录，删除
    $(".popDelateBtn").click(function() {
        var tag=$(this).parents("tr");
        var uuid=tag.attr("uuid");
        var token=vm.$data.tokenValue;
        layer.confirm('确定要删除吗？', {
            btn: ['确定', '取消']
        }, function() {
            vm.$options.methods.deleteData(uuid,token,tag);
        });
    });
})
