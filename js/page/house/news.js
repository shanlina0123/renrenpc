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
                        layui.use(['form'], function() {
                            var form = layui.form;
                            form.render('select');
                        });
                    }else
                    {
                        layer.msg(data.messages,{icon: 6});
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
        postonce: true,
        showAllError: false,
        tiptype: function (msg, o, cssctl) {
            if (!o.obj.is("form")) {
                if (o.type != 2)
                {
                    var objtip = o.obj.parents('.layui-form-item').find(".Validform_checktip");
                    objtip.addClass('Validform_skate');
                    cssctl(objtip, o.type);
                    layer.msg(msg, {icon: 5, time: 2000, shift: 6});
                }
            }
        },beforeSubmit:function(curform)
        {
            $.ajax({
                type: "POST", //方法类型
                dataType: "json", //预期服务器返回的数据类型
                url: auth_conf.house_add, //url
                data: $('#house').serialize(),
                success: function(result) {
                    if (result.status == 1)
                    {
                        window.location.href = 'index.html';

                    } else
                    {
                        layer.msg(result.messages);
                    }
                }.error(function()
                {
                    layer.msg( '请求数据异常' );
                })
            });
        }
    });
}


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