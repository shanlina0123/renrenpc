 $(function() {
                
            layui.use('laydate', function() {
                var laydate = layui.laydate;
                //自定义格式		
                laydate.render({
                    elem: '#test16',
                    type: 'datetime',
                    range: '|',
                    format: 'yyyy/M/d'
                });
            });
            layui.use('laydate', function() {
                var laydate = layui.laydate;
                //自定义格式		
                laydate.render({
                    elem: '#test17',
                    type: 'datetime',
                    range: '|',
                    format: 'yyyy/M/d'
                });
            });
            layui.use('laydate', function() {
                var laydate = layui.laydate;
                //自定义格式		
                laydate.render({
                    elem: '#test18',
                    type: 'datetime',
                    range: '|',
                    format: 'yyyy/M/d'
                })
            });          
})

var ch = new Vue({
    el: '#charts',
  data: {
       
        tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token
         params:{ //地址参数
            page:1,
            typeid:'',
             isexcel:0,
            followstatusid:'',//客户状态
            refereeuserid:'',//经纪人
            ownadminid:'',//业务员
            companyid:'',
            makedate:'',
            comedate:'',
            dealdate:'',
        },
       
        page_data:{ //分页数据
            total:0,
            to:0,
        },
        charts:[], 
        state:[],//客户状态
        firm:[],//公司
        manager:[],//经纪人
        admin_datas:[],//业务员
         list_index:0
    },
    methods:{
        //第一次加载数据
		getChartsList:function (loading){		 
		 	var url = auth_conf.chart_list;
		 	
            var that = this;
			
           axios.post(url,that.params,{headers: {"Authorization": that.tokenValue}})
            .then(function(response)
            {
                  var data = response.data;	
                
                  if ( data.status == 1 )
                    {                       
                        that.charts = data.data.data;
                        that.page_data.total = data.data.total;
                        that.page_data.to= data.data.to;						
						  if( loading!="loadingPageData")
                        {
                            that.getPageData();
                        }
                        layui.use(['form'], function() {
                            var form = layui.form;
                            form.render();
                        });
                        that.list_index=data.data.from;
                    }else
                    {
                       layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg(data.messages,{icon: 6});
                        });
                    }
            });
		 },
      
         //lay分页
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
                            that.getChartsList('loadingPageData');
                        }
                        layui.use(['form'], function() {
                            var form = layui.form;
                            form.render();
                        });
                    }
                });
                form.render();
            });
        },
       
		 //客户状态
		statelist:function ()
        {
   
        	var url = auth_conf.datas_default_one+8;
       
            var that = this;
            axios.get( url,{headers: {"Authorization": that.tokenValue}})
               .then(function(response)
                {
                    var data = response.data;                 
                    if ( data.status == 1 )
                    {
                       
                        that.state = data.data;
                        var str = '';
                        var listData = data.data;
                        that.state = listData;
                        for(var x in listData)
                        {
                            str+='<option value="'+listData[x].id+'">'+listData[x].name+'</option>';
                        }
                        $("#state").append( str );
                        layui.use(['form'], function() {
                            var form = layui.form;
                            form.render('select');
                        });
                       
                    }
                });
         },
       //公司
         companylist:function (){
        	var url = auth_conf.company_list;       
            var that = this;
            axios.get(url,{headers: {"Authorization": that.tokenValue}})
               .then(function(response)
                {
                    var data = response.data;                 
                    if ( data.status == 1 )
                    {
                        var str = '';
                        var listData = data.data.data;
                        that.firm = arrayIndexToValue(listData,'id');
                        for(var x in listData)
                        {
                            str+='<option value="'+listData[x].id+'">'+listData[x].name+'</option>';
                        }
                        $("#firm").append( str );
                        layui.use(['form'], function() {
                            var form = layui.form;
                            form.render('select');
                        });
                       
                    }
                });
          },
          //经纪人
           managerlist:function (){
        	var url = auth_conf.chart_drop;       
            var that = this;
            axios.get(url,{headers: {"Authorization": that.tokenValue}})
               .then(function(response)
                {
                    var data = response.data;                 
                    if ( data.status == 1 )
                    {
                        var str = '';
                        var listData = data.data;
                        that.manager = arrayIndexToValue(listData,'id');
                        for(var x in listData)
                        {
                            str+='<option value="'+listData[x].id+'">'+listData[x].nickname+'</option>';
                        }
                        $("#manager").append( str );
                        layui.use(['form'], function() {
                            var form = layui.form;
                            form.render('select');
                        });
                       
                    }
                });
          },
          //业务员
           getAdmins: function () {
            var url = auth_conf.admin_datas;
            var that = this;
            axios.get(url, {headers: {"Authorization": that.tokenValue}})
                .then(function (response) {
                    var data = response.data;
                    if (data.status == 1) {
                        //业务员
                        that.admin_datas = arrayIndexToValue(data.data, "id");
                        selectAppendDd($("#workp"), that.admin_datas, "id", "nickname");
                    }
                })
                .catch(function (error) {
               
                });
        },
        //导出excel
        excelList:function (cacheKey){
            var url = auth_conf.chart_list;
            var that = this;
            axios.post(url,that.params,{headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    if (data.status == 1)
                    {
                        layer.msg("导出成功", {icon: 1});
                        window.location.href= auth_conf.chart_excel_export+cacheKey;

                    }else
                        {
                            layer.msg("数据加载失败", {icon: 2});
                        }
                    })
                .catch(function (error) {
                    layer.msg("请求异常", {icon: 3});
                });
        },
    },
    created:function () {
        var that = this;     
        that.getChartsList();
   		that.statelist();
   		that.companylist();
        that.managerlist();
        that.getAdmins();
    }
});
/**
 * 检索
 */

function search() {
	var followstatusid=$("#state").val();//客户状态
    var companyid = $("#firm").val();    //公司
   var refereeuserid = $("#manager").val();//经纪人
   var ownadminid = $("#workp").val();//业务员
    //日期
    var makedate = $("#test16").val();
    var comedate = $("#test17").val();
    var dealdate = $("#test18").val();
    
    ch.$data.params.followstatusid = followstatusid;//客户状态    
    ch.$data.params.companyid = companyid;//公司
    //经纪人，业务员
    ch.$data.params.refereeuserid = refereeuserid;
    ch.$data.params.ownadminid = ownadminid;
    //日期
    ch.$data.params.makedate = makedate;
	ch.$data.params.comedate = comedate;
	ch.$data.params.dealdate = dealdate;
	ch.$data.params.page = 1;

    ch.getChartsList();
}

function  excelExport() {
    //参数
    var followstatusid=$("#state").val();//客户状态
    var companyid = $("#firm").val();    //公司
    var refereeuserid = $("#manager").val();//经纪人
    var ownadminid = $("#workp").val();//业务员
    //日期
    var makedate = $("#test16").val();
    var comedate = $("#test17").val();
    var dealdate = $("#test18").val();

    ch.$data.params.followstatusid = followstatusid;//客户状态
    ch.$data.params.companyid = companyid;//公司
    //经纪人，业务员
    ch.$data.params.refereeuserid = refereeuserid;
    ch.$data.params.ownadminid = ownadminid;
    //日期
    ch.$data.params.makedate = makedate;
    ch.$data.params.comedate = comedate;
    ch.$data.params.dealdate = dealdate;
    ch.$data.params.isexcel = 1;

    makedate = $("#test16").val();
    comedate = $("#test17").val();
    dealdate = $("#test18").val();


    var cacheKey="excel"+followstatusid+companyid+ownadminid+refereeuserid+makedate+comedate+dealdate;
    cacheKey=cacheKey?cacheKey:0;
    var base = new Base64();
    cacheKey = base.encode(cacheKey);
    //导出
    ch.excelList(cacheKey);
}