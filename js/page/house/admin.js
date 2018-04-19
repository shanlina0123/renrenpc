$(function() {
            //添加编辑用户
            $(".editUser,.addClient").click(function() {
                    layer.open({
                        type: 1,
                        title: '新增编辑用户',
                        shadeClose: true,
                        scrollbar: false,
                        skin: 'layui-layer-rim',
                        area: ['500px', '500px'],
                        content: $(".userPopWrap    ")
                    })
                })
                //删除用户
            $(".deleteBtn").click(function() {
                var $this = $(this);
                layer.confirm('确定要删除吗？', {
                    btn: ['确定', '取消'],
                    area: ['300px', '167px']
                }, function() {
                    $this.parents("tr").remove();
                    layer.msg('删除成功', {
                        icon: 1
                    });
                });
            });
            //这个页面的分页用的是浏览器解析后的布局（其他页面使用的是解析前的，后期如果需要会统一修改）
//          layui.use(['laypage', 'layer', 'form'], function() {
//              var laypage = layui.laypage,
//                  layForm = layui.layform,
//                  layer = layui.layer;
//              //总页数大于页码总数
//              laypage.render({
//                  elem: 'pagerInner',
//                  count: 70, //数据总数
//                  jump: function(obj) {
//                      //console.log(obj)
//                  }
//              });
//          });
                 
        })
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
     
//new Vue({
//	el: '#admin',
//	 data: {       
//      tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token
//      params:{ //地址参数
//          page:1
//      },
//      admin:[], //房源容器
//      page_data:{ //分页数据
//          total:0,
//          to:0,
//      },
//      commission:[], //拥金
//      roomtype:[], //房源类型
//  },
//  methods:{
//  	 //第一次加载数据
//      getHouseList:function ()
//      {
//          var url = auth_conf.house_list;
//          var that = this;
//          axios.get( url,{headers: {"Authorization": that.tokenValue}})
//          .then(function(response)
//          {
//                var data = response.data;
//                if ( data.status == 1 )
//                  {
//                      var list = data.data;
//                      that.admin = list.data;
//                      that.page_data.total = list.total;
//                      that.page_data.to= list.to;
//                      that.getPageData();
//                  }
//          });
//      },
//  },
//  
//});
new Vue({
    el: '#admin',
    data: {
        path_url:auth_conf.path_url,//图片地址
        tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token
        params:{ //地址参数
            page:1
        },
        houseList:[], //房源容器
        page_data:{ //分页数据
            total:0,
            to:0,
        },
        commission:[], //拥金
        roomtype:[], //房源类型
    },
    methods:{
        //第一次加载数据
        getHouseList:function ()
        {
            var url = auth_conf.house_list;
            var that = this;
            axios.get( url,{headers: {"Authorization": that.tokenValue}})
            .then(function(response)
            {
                  var data = response.data;
                  if ( data.status == 1 )
                    {
                        var list = data.data;
                        that.houseList = list.data;
                        that.page_data.total = list.total;
                        that.page_data.to= list.to;
                        that.getPageData();
                    }
            });
        },
        //lay分页
        getPageData:function () {
            var that = this;
            layui.use(['laypage', 'layer', 'form'], function() {
                var laypage = layui.laypage;
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
            });
        },
        //分页加载数据
        getDataList:function () {
            var url = auth_conf.house_list;
            var that = this;
            axios.get( url,{ params: that.params,headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    if ( data.status == 1 )
                    {
                        var list = data.data;
                        that.houseList = list.data;
                        that.page_data.total = list.total;
                        that.page_data.to= list.to;
                    }
                });
        },
        //默认数据
        dataDefault:function ()
        {
            var url = auth_conf.datas_default_one+1;
            var that = this;
            axios.get( url,{headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    if ( data.status == 1 )
                    {
                       //房型
                       that.roomtype = data.data;
                    }
                });

        },//自定义数据
        dataDefinition:function () {
            var url = auth_conf.datas_one+1;
            var that = this;
            axios.get( url,{headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    if ( data.status == 1 )
                    {
                        ///佣金规则
                        that.commission = data.data;
                    }
                });

        }
    },created: function () {
        var that = this;
        that.getHouseList();//列表数据
        that.dataDefault();//默认数据
        that.dataDefinition();//自定义数据
    }
});
