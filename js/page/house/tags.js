new Vue({
    el: '#tagList',
    data: {
        tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token
        tags:[],
        tsgsData:[],
        id:''
    },
    methods:{
        //第一次加载数据
        getTags:function ()
        {
            var url = auth_conf.datas_one+5;
            var that = this;
            axios.get( url,{headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    if ( data.status == 1 )
                    {
                        that.tags = data.data;
                    }else
                    {
                        layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg(data.messages,{icon: 6});
                        });
                    }
                });
        },addChencked:function ( tag ) {

            var that = this;
            var len = that.tsgsData.length;
               if(  len < 6  || tag.chencked == true )
              {
                var id = tag.id ;
                if( typeof tag.chencked == 'undefined' )
                {

                    that.tsgsData.push(id);
                    this.$set(tag,'chencked',true)

                }else
                {
                    that.tsgsData.splice($.inArray(id,that.tsgsData),1);
                    tag.chencked = !tag.chencked;
                }
              }else
              {
                layui.use(['layer'], function() {
                    var layer = layui.layer;
                    layer.msg('标签最多选择6个哦');
                });
              }


        },saveTages:function ()
        {
            var that = this;
            var base = new Base64();
            var id = base.decode(that.id);
            axios.post( auth_conf.house_add_tag,{ tagid:that.tsgsData,houseid:id},{headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    if ( data.status == 1 )
                    {
                          window.location.href = 'addHouseImages.html?id='+data.data;
                    } else
                    {
                        layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg(data.messages);
                        });

                    }
                });
        },getQueryString:function( name )
        {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 匹配目标参数
            var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
            if (result != null)
            {
                return decodeURIComponent(result[2]);
            }else
            {
                return null;
            }
        }
    }
    ,created: function () {
        var that = this;
        that.getTags();//表单下拉数据
        that.id = that.getQueryString('id');
    }
});