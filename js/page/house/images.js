var vm = new Vue({
    el: '#image',
    data: {
        tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token
        covermap:'',
        images:[],
        status:0,
        id:''
    },
    methods:{
        //第一次加载数据
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
        },saveImage:function () {
            var that = this;
            var url = auth_conf.house_img_save;
            var base = new Base64();
            var id = base.decode(that.id);
            //console.log(that.covermap,that.images,that.status,id);
            axios.post( url,{ covermap:that.covermap,images:that.images,status:that.status,houseid:id},{headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    console.log(response.data() );
                    var data = response.data;
                    if ( data.status == 1 )
                    {
                        var base = new Base64();
                        var id = base.encode(data.data);
                        window.location.href = 'addHouseSuccess.html';
                    } else
                    {
                        layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg(data.messages);
                        });

                    }
                });
        }
    }
    ,created: function () {
        var that = this;
        that.id = that.getQueryString('id');
    }
});

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
            layer.load(); //上传loading
        }
        ,done: function(res)
        {
            layer.closeAll('loading'); //关闭loading
            if( res.status == 1 )
            {
                $("#covermapName").val(res.data.name);
                $("#covermap").css("background","url("+res.data.src+")");
                vm.$data.covermap = res.data.name;
            }
        },
        error: function(index, upload){
            layer.closeAll('loading'); //关闭loading
        }
    });
    //监听redio
    form.on('radio(business)',function ( data ) {
        vm.$data.status = data.value;
    });
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
            if( vm.$data.images.length < 9 )
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