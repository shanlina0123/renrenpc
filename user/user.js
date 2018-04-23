    var us=new Vue({
	el: '#users',
	data:{
//		 tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token
//		 users:[],
        tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token   
       params:{ //地址参数
            page:1,
//          economictid:'',
          name:'',
        },
      
        users:[],
         page_data:{ //分页数据
            total:0,
            to:0,
        },
        userstype:[],
        company:[],       
	},
	methods:{
		//第一次加载数据
		 getusers:function (){		 
		 	var url = auth_conf.users_list;
            var that = this;
            axios.get( url,{headers: {"Authorization": that.tokenValue}})
            .then(function(response)
            {
                  var data = response.data;

                  if ( data.status == 1 )
                    {
                        that.users = data.data.data;
						
                    }else
                    {
                        layer.msg(data.messages,{icon: 6});
                    }
            });
		 },

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
            var url = auth_conf.users_list;
            var that = this;
            axios.get( url,{ params: that.params,headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    if ( data.status == 1 )
                    {
                        var list = data.data;
                        that.users = list.data;
                        that.page_data.total = list.total;
                        that.page_data.to= list.to;z
                    }
                });
        },
       //公司列表
        dataCompayList:function ()
        {
   
        	 var url = auth_conf.company_list;
            var that = this;
            axios.get( url,{headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    
                    if ( data.status == 1 )
                    {
                       
                        that.company = data.data;
                        var str = '';
                        var listData = data.data.data;
                        that.company = listData;
                        for(var x in listData)
                        {
                            str+='<option value="'+listData[x].id+'">'+listData[x].name+'</option>';
                        }
                        $("#company").append( str );
                      
                        layui.use(['form'], function() {
                            var form = layui.form;
                            form.render('select');
                        });
                       
                    }
                });
       }
	},
	created: function () {
        var that = this;
        that.getusers();//列表数据
        that.dataCompayList();//公司列表
  
       // that.dataDefault();//默认数据
      //  that.dataDefinition();//自定义数据
    }
})
/**
 * 检索
 */

function search() {

    var typeid = $("#userstype").val();   
    var companyid = $("#company").val();
  
    us.$data.params.typeid = typeid;
    us.$data.params.companyid = companyid;
    us.getHouseList();
}