 $(function() {
                // 顶部导航右侧操作
                $("body").on("click", ".layui-nav .layui-nav-item a", function() {
                    $(this).siblings().addClass("layui-show");
                });
                //左侧导航效果
                $(".leftNav > li > a").click(function() {
                    if (!$(this).hasClass("on")) {
                        $(this).siblings(".leftSubNav").slideDown();
                        $(this).parents("li").siblings().find(".leftSubNav").slideUp();
                        $(this).addClass("on").parents("li").siblings().find("a").removeClass("on");
                    } else {
                        $(this).removeClass("on");
                        $(this).siblings(".leftSubNav").slideUp();
                    }
                })
          
   
            layui.use('laydate', function() {
                var laydate = layui.laydate;
                //自定义格式		
                laydate.render({
                    elem: '#test16',
                    type: 'datetime',
                    range: '-',
                    format: 'yyyy/M/d'
                });
            });
            layui.use('laydate', function() {
                var laydate = layui.laydate;
                //自定义格式		
                laydate.render({
                    elem: '#test17',
                    type: 'datetime',
                    range: '-',
                    format: 'yyyy/M/d'
                });
            });
            layui.use('laydate', function() {
                var laydate = layui.laydate;
                //自定义格式		
                laydate.render({
                    elem: '#test18',
                    type: 'datetime',
                    range: '-',
                    format: 'yyyy/M/d'
                });
            });

            // 分页,表单
            layui.use(['laypage', 'layer', 'form'], function() {
                var laypage = layui.laypage,
                    layer = layui.layer;
                //总页数大于页码总数
                laypage.render({
                    elem: 'pagerInner',
                    count: 70, //数据总数
                    jump: function(obj) {
                        //console.log(obj)
                    }
                });
            });  });
         
 var ch=new Vue({
	el: '#charts',
	data:{
//		 tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token
//		 users:[],
        tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token       
        chart:[]  
	},
	methods:{
		//第一次加载数据
		 getchart:function (){
		 	var url = auth_conf.chart_list;
            var that = this;
            axios.get( url,{headers: {"Authorization": that.tokenValue}})
            .then(function(response)
            {
                  var data = response.data;

                  if ( data.status == 1 )
                    {
                        that.chart = data.data.data;
						
                    }else
                    {
                        layer.msg(data.messages,{icon: 6});
                    }
            });
		 },		
		  //默认数据
     
	},
	created: function () {
        var that = this;
        that.getchart();//列表数据
        // that.getusers();//列表数据
        //that.dataDefault();//默认数据
       // that.dataDefinition();//自定义数据
    }
})
