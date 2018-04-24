$(function() {
            //添加编辑用户
//          $(".editBtn").click(function() {
//              layer.open({
//                  type: 1,
//                  title: '查看编辑用户',
//                  shadeClose: true,
//                  scrollbar: false,
//                  skin: 'layui-layer-rim',
//                  area: ['330px', '330px'],
//                  content: $(".userPopWrap")
//              })
//          });
            //添加合作客户
//          $(".changeClient").click(function() {
//              layer.open({
//                  type: 1,
//                  title: '添加合作客户',
//                  shadeClose: true,
//                  scrollbar: false,
//                  skin: 'layui-layer-rim',
//                  area: ['400px', '400px'],
//                  content: $(".custormHandelPop")
//              })
//          });
//            
           //验证
     if( $(".layui-form2").length ){
    $(".layui-form2").Validform({
        btnSubmit: '.layui-btn',
        tiptype: 1,
        postonce: true,
        showAllError: false,
        tiptype: function (msg, o, cssctl) {
            if (!o.obj.is("form")) {
                if (o.type != 2) {
                    var objtip = o.obj.parents('.layui-form-item').find(".Validform_checktip");
                    objtip.addClass('Validform_skate');
                    cssctl(objtip, o.type);
                    layer.msg(msg, {icon: 5, time: 2000, shift: 6});
                }
            }
        }
    });
     }

 })
 
 
var com = new Vue({
	 el: '#companylist',
	 data:{
	 	tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token
	 	 params:{ //编辑和修改参数
            page:1,
            typeid:'',
            name:'',
            nickname:'',
            mobile:'',
            conncat:"",
            status:"",
       },   
     //  add_params:{name:null,mobile:null,conncat:null},//修改客户
        page_data:{ //分页数据
            total:0,
            to:0,
        },
        companylist:[], 
	 },
	 methods:{
        //第一次加载数据
		getcompanylist:function (){		 
		 	var url = auth_conf.company_list;
            var that = this;
			
          axios.get( url,{headers: {"Authorization": that.tokenValue}})
            .then(function(response)
            {
                  var data = response.data;				
                  if ( data.status == 1 )
                    {
                        that.companylist = data.data.data;
						console.log(that.companylist);
                    }else
                    {
                        layer.msg(data.messages,{icon: 6});
                    }
            });
		 },
      
        //分页
         getPageData:function () {
            var that = this;
            layui.use(['laypage', 'layer', 'form'], function() {
                var laypage = layui.laypage;
                var form = layui.form;
                //总页数大于页码总数
                laypage.render({
                    elem: 'pagerInner',
                    count: that.page_data.total,//总页
                    limit: that.page_data.to,//每页显示
                    jump: function(obj,first)
                    {
                        if(!first)
                        {
                            that.params.page = obj.curr;
                            that.getDataList();
                        }
                    }
                });
                form.render();
            });
        },
        //分页加载数据
        getDataList:function () {
            var url = auth_conf.company_list;
            var that = this;
            axios.get( url,{headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    if ( data.status == 1 )
                    {
                        var list = data.data;
                        that.charts = list.data;
                        that.page_data.total = list.total;
                        that.page_data.to= list.to;
                    }
                });
        },
        //删除
	 del:function ( uuid ) {
            var that = this;   
            layui.use(['laypage', 'layer', 'form'], function() {                
                var layer = layui.layer;
                //总页数大于页码总数
                layer.confirm('确定要删除吗？', {
                btn: ['确定', '取消']
          	  }, function() {
                var url = auth_conf.company_delete+uuid;       
                axios.delete(url,{headers: {"Authorization": that.tokenValue}})
                    .then(function(response)
                    {
                        var data = response.data;
                        if ( data.status == 1 )
                        {
                            layer.msg('删除成功',{icon: 1},function () {
                                location.href = location.href;
                            });
                        }else
                        {
                           // layer.msg(data.messages,{icon: 6});
                        }
                    });
          		  });               
               });                                                                         
        },
   
      //编辑公司列表
       edit:function(uuid) {
            var that = this;
           // that.getRole(); //获取角色列表
            if (uuid) {
                var url = auth_conf.company_update+ uuid;    
                console.log(url)
                 axios.put(url, that.params, { headers: { "Authorization": that.tokenValue } }).then(function(response) {                     
                    var data = response.data;                                      
                        that.params.name = data.data.name;
                        console.log(that.params.name);
                       // that.params.nickname = data.data.nickname;
                        that.params.name = data.data.name;
                        that.params.mobile = data.data.mobile;
                        that.params.uuid = data.data.uuid;
                       // that.params.status = data.data.status;                       
                        layui.use(['form'], function() {
                            var form = layui.form;
//                          form.render('select');
                            layer.open({
			                    type: 1,
			                    title: '查看编辑用户',
			                    shadeClose: true,
			                    scrollbar: false,
			                    skin: 'layui-layer-rim',
			                    area: ['330px', '330px'],
			                    content: $(".userPopWrap")
			                })
                        });
                    //}
                })
            } 
            
                                
        },
     //提交公司修改、新增
        submitUser: function(uuid) {
            var that = this;
            if (uuid) {
                //编辑查看用户
                var url = auth_conf.company_update + uuid;
                console.log(url);
                if (that.params.nickname == "") {
                    layui.use("layer", function() {
                        layer.msg("请填写公司");
                    })
                } else if (that.params.roleid == "") {
                    layui.use("layer", function() {
                        layer.msg("请选择联系人");
                    })
                } else if (that.params.mobile == "") {
                    layui.use("layer", function() {
                        layer.msg("联系人电话");
                    })
                } else {
                    axios.put(url, that.params, { headers: { "Authorization": that.tokenValue } })
                        .then(function(response) {
                            console.log(that.params);
                            console.log(response);
                            if (response.status == 1) {
                                layui.use(['layer'], function() {
                                    var layer = layui.layer;
                                    layer.msg("编辑用户成功", function() {
                                        layer.closeAll();
                                    });
                                });
                                that.companylist();
                            } else {
                                layui.use(['layer'], function() {
                                    var layer = layui.layer;
                                    layer.msg("编辑用户失败", function() {
                                        layer.closeAll();
                                    });
                                });
                            }
                        })
                }

            } else {
                //新增用户
                var url = auth_conf.company_add;
                if (that.params.nickname == "") {
                    layui.use("layer", function() {
                        layer.msg("请填写用户姓名");
                    })
                } else if (that.params.roleid == "") {
                    layui.use("layer", function() {
                        layer.msg("请选择用户角色");
                    })
                } else if (that.params.mobile == "") {
                    layui.use("layer", function() {
                        layer.msg("请填写用户手机号码");
                    })
                } else if (that.params.name == "") {
                    layui.use("layer", function() {
                        layer.msg("请填写用户账号");
                    })
                } else {
                    axios.post(url, that.params, { headers: { "Authorization": that.tokenValue } }).then(function(response) {
                        //console.log(response);
                        if (response.data.status == 1) {
                            layui.use(['layer'], function() {
                                var layer = layui.layer;
                                layer.msg("新增用户成功", function() {
                                    layer.closeAll();
                                });
                            });
                            that.companylist();
                        } else {
                            layui.use(['layer'], function() {
                                var layer = layui.layer;
                                layer.msg("新增用户失败", function() {
                                    layer.closeAll();
                                });
                            });
                        }
                    })
                }
            }
        }
    
      
        
    },
    created:function () {
        var that = this;     
        that.getcompanylist();
   		
    }
});