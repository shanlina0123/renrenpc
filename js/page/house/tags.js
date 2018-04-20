function  getTags() {
    var url = auth_conf.datas_one+5;
    var tokenValue = JSON.parse(localStorage.getItem("userinfo")).token;
    $.ajax({
        headers: {
            Authorization: tokenValue,
            Accept: "application/json; charset=utf-8"
        },
        type: "GET", //方法类型
        dataType: 'json',
        url: url,
        success: function (result) {
            if (result.status == 1)
            {
                var str ='';
                for(var x in result.data)
                {
                    str+='<span data-value="'+result.data[x].id+'" onclick="getItem( this )">'+result.data[x].name+'</span>';
                }
                $("#tags").append( str );
            }
        }
    });
}

getTags();

var tsgsData = new Array();

function getItem( index )
{
    var hasOnNum = 1;
    var value = $(index).data('value');

    $(".tipWrap span").each(function()
    {
        if ($(this).hasClass("on"))
        {
            hasOnNum++;
        }
    });
    if ( hasOnNum > 6 )
    {
        layui.use(['layer'], function() {
            var layer = layui.layer;
            layer.msg('标签最多选择6个哦');
        });
        return;
    }else
    {
        if( $(index).hasClass('on') )
        {
            tsgsData.splice($.inArray(value,tsgsData),1);
            $(index).removeClass('on');
            console.log( tsgsData );
        }else
        {
            tsgsData.push( value );
            $(index).addClass('on');
            console.log( tsgsData );
        }

    }

}

function getQueryString( name )
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 匹配目标参数
    var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
    if (result != null) {
        return decodeURIComponent(result[2]);
    }else
    {
        return null;
    }
}

var houseid = getQueryString('id');
function saveTages()
{
    var base = new Base64();
    var id = base.decode(houseid);
    var tokenValue = JSON.parse(localStorage.getItem("userinfo")).token;
    $.ajax({
        headers: {
            Authorization:tokenValue,
        },
        type: "POST", //方法类型
        dataType: "json", //预期服务器返回的数据类型
        url: auth_conf.house_add_tag, //url
        data:{tagid:tsgsData,houseid:id },
        success: function(result) {
            if ( result.status == 1 )
            {
                console.log(result.data);
              /*  var base = new Base64();
                var id = base.encode(result.data);
                window.location.href = 'addHouseTag.html?id='+id;*/
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