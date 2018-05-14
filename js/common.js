// 顶部导航右侧操作
$("body").on("click", ".layui-nav .layui-nav-item a", function() {
    $(this).siblings().addClass("layui-show");
});
//左侧导航效果
// $(".leftNav > li > a").click(function() {
//   if ($(this).hasClass("on")) {
//       $(this).siblings(".leftSubNav").slideDown();
//       $(this).parents("li").siblings().find(".leftSubNav").slideUp();
//       $(this).addClass("on").parents("li").siblings().find("a").removeClass("on");
//   } else {
//       $(this).removeClass("on");
//       $(this).siblings(".leftSubNav").slideUp();
//   }
// });
//导航添加背景图片
$(".leftNav > li >a").each(function() {
    if ($(this).siblings().hasClass("leftSubNav")) {
        $(this).addClass("hasBg")
    }
});
//控制左侧导航的高度
$(".leftNav").height($(window).height());

function onOver(obj) {
    var sub_url = obj.getElementsByTagName("ul")
    sub_url[0].style.display = "block";
}

function onOut(obj) {
    var sub_url = obj.getElementsByTagName("ul")
    sub_url[0].style.display = "none";
}

/****
 * 兼容vue.js和layuid的select
 * @param tag
 * @param data
 * @param key
 * @param value
 */
function selectAppendDd(tag, data, key, value) {
    var str = "";
    for (var i in data) {
        str += '<option value="' + data[i][key] + '">' + data[i][value] + '</option>';
    }
    tag.append(str);
    layui.use(['form'], function() {
        var form = layui.form;
        form.render('select');
    });
}


/****
 * 数组索引转为数据值作为索引
 * @param tag
 * @param data
 * @param key
 * @param value
 */
function arrayIndexToValue(data, key) {
    if (data) {
        var list = [];
        $.each(data, function(i, n) {
            list[n[key]] = n;
        })
    }
    return list;
}

/****
 * 数组索引转为普通数组
 * @param data
 */
function IndexArrayToArray(data) {
    if (data) {
        var list = [];
        $.each(data, function(i, n) {
            list.push(n);
        })
    }
    return list;
}


/**
 * 退出
 *
 */
function signOut() {
    localStorage.removeItem("userinfo");
    window.location.href = '/login.html';
}

/*获取对象、数组的长度、元素个数
 *@param obj 要计算长度的元素，可以为object、array、string
 */
function count(obj) {
    var objType = typeof obj;
    if (objType == "string") {
        return obj.length;
    } else if (objType == "object") {
        var objLen = 0;
        for (var i in obj) {
            objLen++;
        }
        return objLen;
    }
    return false;
}

/**
 *
 * Base64 encode / decode
 *
 * @author haitao.tu
 * @date 2010-04-26
 * @email tuhaitao@foxmail.com
 *
 * //1.加密
 var str = '124中文内容';
 var base = new Base64();
 var result = base.encode(str);
 //document.write(result);
 //2.解密
 var result2 = base.decode(result);
 document.write(result2);
 */
function Base64() {

    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
     _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}