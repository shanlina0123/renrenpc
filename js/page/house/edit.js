
var vm = new Vue({
    el: '#house',
    data: {
        path_url:auth_conf.path_url,//图片地址
        tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token
        define:'',
        system:'',
        uuid:'',
        houseInfo:'',
        ishome:0,
        tags:[],
        house_tag:[],
        tsgsData:[],
        images:[],
    },
    methods:{
        getFromData:function ()
        {
            var url = auth_conf.house_form_data;
            var that = this;
            axios.get( url,{headers: {"Authorization": that.tokenValue}})
            .then(function(response)
            {
                  var data = response.data;
                  if ( data.status == 1 )
                    {
                       that.define = data.data.define;
                       that.system = data.data.system;
                        layui.use(['form','laydate'], function() {
                            var form = layui.form;
                            var laydate = layui.laydate;
                            //发布日期
                            laydate.render({
                                elem: '#pubDate',
                                type: 'datetime',
                            });
                            //年代选择
                            laydate.render({
                                elem: '#oldDate',
                                type:'year'
                            });
                            //开盘日期
                            laydate.render({
                                elem: '#saleDate',
                                type:'date'
                            });
                            form.render('select');
                        });
                    }else
                    {
                        layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg(data.messages,{icon: 6});
                        });
                    }
            });
        },getHouseInfo:function () {
            var that = this;
            var uuid = that.uuid;
            var url = auth_conf.house_edit_info+uuid;
            axios.get( url,{headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    if ( data.status == 1 )
                    {
                        console.log( data.data );
                        that.houseInfo = data.data;
                        that.ishome = data.data.ishome;
                        that.house_tag = data.data.house_tag;
                        var tsgsData = data.data.house_tag;
                        for(var x in tsgsData)
                        {
                            if( tsgsData[x] )
                            {
                                that.tsgsData.push(tsgsData[x].tagid);
                            }
                        }
                        layui.use(['form'], function() {
                            var form = layui.form;
                                form.render();
                        });
                    }else
                    {
                        layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg(data.messages,{icon: 6});
                        });
                    }
                });
        },
        getQueryString:function( name )
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
        },
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
            if(  len < 6  )
            {
                if( typeof tag.chencked == 'undefined' )
                {
                    that.tsgsData.push(tag.id);
                    this.$set(tag,'chencked',true)

                }else
                {
                    that.tsgsData.splice($.inArray(tag.id,that.tsgsData),1);
                    tag.chencked = !tag.chencked;
                }
            }else
            {
                layui.use(['layer'], function() {
                    var layer = layui.layer;
                    layer.msg('标签最多选择6个哦');
                });
            }
        }
    },created: function () {
        var that = this;
        that.uuid = that.getQueryString('uuid');
        that.getTags();
        that.getFromData();
        that.getHouseInfo();
    }
});


if( $(".layui-form").length )
{
    $(".layui-form").Validform({
        btnSubmit: '#submit',
        tiptype: 1,
        //postonce: true,
        showAllError: false,
        tiptype: function (msg, o, cssctl) {
            if (!o.obj.is("form")) {
                if (o.type != 2)
                {
                    var objtip = o.obj.parents('.layui-input-inline').find("input");
                    objtip.addClass('layui-form-danger');
                    cssctl(objtip, o.type);
                    layui.use(['layer'], function() {
                        var layer = layui.layer;
                        layer.msg(msg, {icon: 5, time: 2000, shift: 6});
                    });
                }
            }
        },beforeSubmit:function(curform)
        {
            var tokenValue = JSON.parse(localStorage.getItem("userinfo")).token;
            var uuid = vm.$data.uuid;
            $.ajax({
                headers: {
                    Authorization:tokenValue,
                },
                type: "PUT", //方法类型
                dataType: "json", //预期服务器返回的数据类型
                url: auth_conf.house_edit_save+uuid, //url
                data: $('#house').serialize(),
                success: function(result) {
                    if ( result.status == 1 )
                    {
                        window.location.href = 'houseList.html';

                    } else
                    {
                        layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg(result.messages);
                        });

                    }
                },error:function()
                {
                    layer.msg( '请求数据异常' );
                }
            });
        }
    });
}



$("#searchAddress").keydown(function(){
    var keyword = $(this).val();
    var tokenValue = JSON.parse(localStorage.getItem("userinfo")).token;
    if( keyword )
    {
        $.ajax({
            headers: {
                Authorization: tokenValue,
                Accept: "application/json; charset=utf-8"
            },
            type: "GET", //方法类型
            dataType: 'json',
            url: auth_conf.map_address + '?keyword=' + keyword,
            success: function (result) {
                if (result.status == 1)
                {
                    if( result.data.status  == 0 )
                    {
                        var list = result.data.data;
                        var str = '';
                        for( var i= 0; i<list.length;i++ )
                        {
                            str+='<dd data-lat="'+list[i].location.lat+'"  data-lng="'+list[i].location.lng+'" data-address="'+list[i].address+'" data-title="'+list[i].title+'" data-district="'+list[i].district+'" onclick="getItem(this)">'+list[i].address+'</dd>';
                        }
                        $("#addressList").empty();
                        $("#addressList").append(str);
                        $("#addressList").show();
                    }

                }
            }
        });
    }

});


/**
 * 选中
 * @param index
 */
function getItem( index )
{
    var lat = $(index).data('lat');
    var lng = $(index).data('lng');
    var address = $(index).data('address');
    var title = $(index).data('title');
    var district = $(index).data('district');
   $("input[name=addr]").val(title);
   $("input[name=street]").val(district+title);
   $("input[name=fulladdr]").val(address);
   $("input[name=lat]").val(lat);
   $("input[name=lng]").val(lng);
   $("#searchAddress").val(address);
    $("#addressList").hide();
}




var tokenValue = JSON.parse(localStorage.getItem("userinfo")).token;
layui.use(['upload','form','layer'], function() {
    var form = layui.form;
    var $ = layui.jquery;
    var layer = layui.layer;
    upload = layui.upload;
    //普通图片上传
    upload.render({
        headers:{ Authorization: tokenValue },
        elem: '#covermap',
        exts:"jpg|png|jpeg",
        size:5120,
        number:1,
        url: auth_conf.add_imag,
        before: function(obj)
        {
            obj.preview(function(index, file, result) {
                $('#covermapUrl').attr('src',result);
            });
        }
        ,done: function(res)
        {
            layer.closeAll('loading'); //关闭loading
            if( res.status == 1 )
            {
                $("#covermapName").val(res.data.name);
            }
        },
        error: function(index, upload){
            layer.closeAll('loading'); //关闭loading
        }
    });
    //监听redio
    /*form.on('radio(business)',function ( data ) {
        vm.$data.status = data.value;
    });*/
    //多图片上传
    upload.render({
        headers:{ Authorization: tokenValue },
        elem: '#infoImg',
        exts:"jpg|png|jpeg",
        size:5120,
        number:9,
        url: auth_conf.add_imag,
        multiple: true,
        before: function(obj) {
            //预读本地文件示例，不支持ie8
            var len = $("#demo2").find('img').length;
            if( len < 9 )
            {
                obj.preview(function(index, file, result) {
                    $('#demo2').append('<img src="' + result + '" alt="' + file.name + '" class="layui-upload-img">')
                });
            }
        },
        done: function(res)
        {
            if( res.status == 1 )
            {
                if( vm.$data.images.length < 9 )
                {
                    vm.$data.images.push( res.data.name );
                }else
                {
                    layui.use(['layer'], function() {
                        var layer = layui.layer;
                        layer.msg('最多可上传9个哦');
                    });
                }
            }
        },
    });
});