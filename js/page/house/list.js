

$(function() {
    //引用lay`er部分
    layui.use(['laydate'], function() {
        var laydate = layui.laydate;
        //var form = layui.form;
        //发布时间筛选
        laydate.render({
            elem: '#publishDate',
            type: 'datetime',
            range: '-',
            format: 'yyyy-M-d'
        });
    });

    layui.use(['form'], function() {
        var form = layui.form;
        form.on('select(filter)', function(data)
        {
            var value = data.value
            console.log(value); //得到select原始DOM对象
        });
    });
});


var vm = new Vue({
    el: '#houseList',
    data: {
        path_url:auth_conf.path_url,//图片地址
        tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token
        params:{ //地址参数
            page:1,
            typeid:'',
            iscommission:'',
            created_at:'',
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
                    }else
                    {
                        layer.msg(data.messages,{icon: 6});
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
                            that.getDataList();
                        }
                    }
                });
                form.render();
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
                       var str = '';
                        for(var x in data.data)
                        {
                            str+='<option value="'+data.data[x].id+'">'+data.data[x].name+'</option>';
                        }
                       $("#roomType").append( str );
                        layui.use(['form'], function() {
                            var form = layui.form;
                            form.render('select');
                        });
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

        },
        del:function ( uuid ) {
            var that = this;
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
                            layer.msg(data.messages,{icon: 6});
                        }
                    });

            });
        }
    },created: function () {
        var that = this;
        that.getHouseList();//列表数据
        that.dataDefault();//默认数据
        that.dataDefinition();//自定义数据
    }
});


/**
 * 检索
 */
function search() {

    var typeid = $("#roomType").val();
    var name = $("input[name=name]").val();
    var iscommission = $("#commission").val();
    var created_at = $("#publishDate").val();
    vm.$data.params.created_at = created_at;
    vm.$data.params.typeid = typeid;
    vm.$data.params.iscommission = iscommission;
    vm.getHouseList();
}