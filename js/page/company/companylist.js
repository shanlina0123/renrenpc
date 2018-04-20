 $(function() {
            //添加编辑用户
            $(".editBtn").click(function() {
                layer.open({
                    type: 1,
                    title: '查看编辑用户',
                    shadeClose: true,
                    scrollbar: false,
                    skin: 'layui-layer-rim',
                    area: ['330px', '330px'],
                    content: $(".userPopWrap")
                })
            });
            //添加合作客户
            $(".changeClient").click(function() {
                layer.open({
                    type: 1,
                    title: '添加合作客户',
                    shadeClose: true,
                    scrollbar: false,
                    skin: 'layui-layer-rim',
                    area: ['400px', '400px'],
                    content: $(".custormHandelPop")
                })
            });
            //删除用户
            $(".deleteBtn").click(function() {
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


            //这个页面的分页用的是浏览器解析后的布局（其他页面使用的是解析前的，后期如果需要会统一修改）
            layui.use(['laypage', 'layer', 'form'], function() {
                var laypage = layui.laypage,
                    layForm = layui.layform,
                    layer = layui.layer;
                //总页数大于页码总数
                laypage.render({
                    elem: 'pagerInner',
                    count: 70, //数据总数
                    jump: function(obj) {
                        //console.log(obj)
                    }
                });
            });
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
 
 

