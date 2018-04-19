$(function() {
    //引用layer部分
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        //发布时间筛选
        laydate.render({
            elem: '#publishDate',
            type: 'datetime',
            range: '-',
            format: 'yyyy/M/d'
        });
    });

    //删除房源
    $(".deleteHouseBtn").click(function() {
        var $this = $(this);
        layer.confirm('确定要删除吗？', {
            btn: ['确定', '取消']
        }, function() {
            $this.parents("tr").remove();
            layer.msg('删除成功', {
                icon: 1
            });
        });
    });
});


new Vue({
    el: '#houseList',
    data: {
        pathUrl: window.auth_conf.pathUrl,
        params:{},
        houseList:[],
        tokenValue:JSON.parse(localStorage.getItem("userinfo")).token,
        pages:'',
    },
    methods:{
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
                        console.log( list );
                        that.houseList = list.data;
                        that.pages = list.last_page;
                        layui.use(['laypage', 'layer', 'form'], function() {
                            var laypage = layui.laypage;
                            //总页数大于页码总数
                            laypage.render({
                                elem: 'pagerInner',
                                count: list.total,
                                jump: function(obj) {
                                    //console.log(obj)
                                }
                            });
                        });

                    }
            });
        }
    },created: function () {
        var that = this;
        that.getHouseList();

    }
});
