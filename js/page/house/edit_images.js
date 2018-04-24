var vm = new Vue({
    el: '#image',
    data: {
        path_url:auth_conf.path_url,//图片地址
        tokenValue:JSON.parse(localStorage.getItem("userinfo")).token, //token
        covermap:'',
        img:[],
        res:[],
        id:'',
        addcovermap:'',//添加图片标题
        addImg:[],//添加图片
        delImg:[],//删除图片
    },
    methods:{
        getQueryString:function( name )
        {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 匹配目标参数
            var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
            if (result != null)
            {
                return decodeURIComponent(result[2]);
            }else
            {
                return null; //
            }
        },saveImage:function () {
            var that = this;
            var url = auth_conf.house_edit_img_save;
            var base = new Base64();
            var id = base.decode(that.id);
            axios.post( url,{ addImg:that.addImg,delImg:that.delImg,houseid:id,addcovermap:that.addcovermap},{headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    if ( data.status == 1 )
                    {
                        layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg(data.messages,function () {
                                window.location.href = 'houseList.html';
                            });
                        });
                    } else
                    {
                        layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg(data.messages);
                        });

                    }
                });
        },getImages:function ()
        {
            var that = this;
            var id = that.getQueryString('id');
            var url = auth_conf.house_edit_img+id;
                that.id = id;
            axios.get( url,{headers: {"Authorization": that.tokenValue}})
                .then(function(response)
                {
                    var data = response.data;
                    console.log(data );
                    if ( data.status == 1 )
                    {
                        that.covermap = data.data.covermap;
                        that.img = data.data.img;
                        that.res = data.data.res;
                    }else
                    {
                        layui.use(['layer'], function() {
                            var layer = layui.layer;
                            layer.msg(data.messages,{icon: 6});
                        });
                    }
                });
        },removeImg:function ( img ) {
            //删除图片
            var that = this;
            this.delImg.push( img )
            this.res.forEach(function (value, index ) {
                if(  value.url  == img )
                {
                    that.res.splice(index,1);
                }
            })
        }
    }
    ,created: function () {
        var that = this;
            that.getImages();
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
            obj.preview(function(index, file, result) {
                $('#covermapUrl').attr('src',result);
            });
        }
        ,done: function(res)
        {
            layer.closeAll('loading'); //关闭loading
            if( res.status == 1 )
            {
                vm.$data.addcovermap = res.data.name;
            }
        },
        error: function(index, upload){
            layer.closeAll('loading'); //关闭loading
        }
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

            var index_img = vm.$data.img.length;
            var index_aimg = vm.$data.addImg.length;//添加的img下标
            if( vm.$data.img.length < 9 )
            {
                obj.preview(function(index, file, result) {
                    $('#imgs').append('<div><img src="' + result + '" alt="' + file.name + '" class="layui-upload-img"><img class="" onclick="removeTempImg('+index_img+','+index_aimg+',this)" src="/images/a7.png"></div>');
                    index_img++;
                    index_aimg++
                });
            }
        },
        done: function(res)
        {
            if( res.status == 1 )
            {
                if( vm.$data.img.length < 9 )
                {
                    vm.$data.img.push( res.data.name );
                    vm.$data.addImg.push( res.data.name );
                    //console.log( vm.$data.addImg );
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

/**
 * 删除临时图片
 * @param index
 */
function removeTempImg( index, aindex, even ) {

    vm.$data.img.splice(index,1);
    vm.$data.addImg.splice(aindex,1);
    $(even).parent('div').remove();
    //console.log( vm.$data.img );
   // console.log( vm.$data.addImg );
    //alert( index );
}