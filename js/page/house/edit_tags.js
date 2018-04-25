new Vue({
    el: '#tagList',
    data: {
        tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token
        tags:[],
        tsgsData:[],
        tsgsDel:[],
        id:''
    },
    methods:{
        //第一次加载数据
        getTags:function ()
        {
            var that = this;
            var id = that.getQueryString('id');
            var url = auth_conf.house_edit_tag+id;
                that.id = id;
            axios.get( url,{headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    if ( data.status == 1 )
                    {
                        //console.log( data.data.data );
                        that.tags = data.data.data;
                        that.tsgsData = data.data.tag;
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
            var id = tag.id;
            if( tag.chencked == true )
            {
                that.tsgsData.splice($.inArray(id,that.tsgsData),1);
                tag.chencked = false;

                //要删除的
                if( tag.istag == 1 )
                {
                    that.tsgsDel.push(id);
                }

            }else
            {
                if(  len < 6 )
                {
                    if( tag.chencked == false )
                    {
                        that.tsgsData.push(id);
                        tag.chencked = true;

                        //要删除的
                        if( tag.istag == 1 )
                        {
                            that.tsgsDel.splice($.inArray(id,that.tsgsDel),1);
                        }

                    }else
                    {
                        that.tsgsData.splice($.inArray(id,that.tsgsData),1);
                        tag.chencked = false;

                        //要删除的
                        if( tag.istag == 1 )
                        {
                            that.tsgsDel.push(id);
                        }
                    }
                }else
                {
                    layui.use(['layer'], function() {
                        var layer = layui.layer;
                        layer.msg('标签最多选择6个哦');
                    });
                }
            }
        },saveTages:function ()
        {
            var that = this;
            var base = new Base64();
            var id = base.decode(that.id);
            axios.post( auth_conf.house_edit_tag_save,{ tagid:that.tsgsData,houseid:id,del_tagid:that.tsgsDel},{headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    if ( data.status == 1 )
                    {
                        window.location.href = 'editHouseImages.html?id='+data.data;
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

    }
});