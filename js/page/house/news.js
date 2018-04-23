
var vm = new Vue({
    el: '#house',
    data: {
        path_url:auth_conf.path_url,//图片地址
        tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token
        define:'',
        system:'',
    },
    methods:{
        //第一次加载数据
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
                            var timestamp = Date.parse(new Date());
                            laydate.render({
                                elem: '#pubDate',
                                type: 'datetime',
                                value: new Date(timestamp)

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
        }
    },created: function () {
        var that = this;
        that.getFromData();//表单下拉数据
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
            $.ajax({
                headers: {
                    Authorization:tokenValue,
                },
                type: "POST", //方法类型
                dataType: "json", //预期服务器返回的数据类型
                url: auth_conf.house_add, //url
                data: $('#house').serialize(),
                success: function(result) {
                    if ( result.status == 1 )
                    {
                        $('#house')[0].reset();
                        window.location.href = 'addHouseTag.html?id='+result.data;

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

