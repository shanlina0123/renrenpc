$(function() {
            //添加编辑用户
            $(".editBtn").click(function() {
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
            //添加合作客户
            $(".changeClient").click(function() {
                layer.open({
                    type: 1,
                    title: '添加合作客户',
                    shadeClose: true,
                    scrollbar: false,
                    skin: 'layui-layer-rim',
                    area: ['400px', '400px'],
                    content: $(".custormHandelPop")
                })
            });
              
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
	 	 params:{ //地址参数
            page:1,
            typeid:'',           
       },      
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
            layer.confirm('确定要删除吗？', {
                btn: ['确定', '取消']
            }, function() {

                var url = auth_conf.companylist_delete+uuid;
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
                            layer.msg(data.messages,{icon: 6});
                        }
                    });

            });
        }
         
       
    },
    created:function () {
        var that = this;     
        that.getcompanylist();
   		
    }
});