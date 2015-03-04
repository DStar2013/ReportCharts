var CM = (function () {
    //获取信息
    function getParam(data) {
        var _str = data.AccountIndex + "&" + data.DepartIndex + "&" + data.ConsumIndex + "&" + data.StartTime + "&" + data.EndTime;
        return _str;
    }
    //下载
    function getDownLoadParam(data) {
        var _str = 'AcountName=' + data.AcountName + '&AcountID=' + data.AcountID + '&Depart=' + data.Depart + '&DepartName=' + data.DepartName + "&ConsumeType=" + data.ConsumeType + "&ConsumeTypeName=" + data.ConsumeTypeName + "&StartTime=" + data.StartTime + "&EndTime=" + data.EndTime;
        return _str;
    }

    //href改变
    function hrefChange(contents, dt) {
        var param = getParam(dt);
        for (var i = 0; i < contents.length; i++) {
            contents.eq(i).attr('href', contents.eq(i).attr('dLink') + '#' + param);
        }
    }
    //解析#
    function hashAny(dt) {
        var _m = {}, _n = dt.replace('#', '').split('&');
        //
        if (_n.length > 0) {
            _m.AccountIndex = parseInt(_n[0]);
            _m.DepartIndex = parseInt(_n[1]);
            _m.ConsumIndex = parseInt(_n[2]);
            _m.StartTime = _n[3];
            _m.EndTime = _n[4];
        }
        return _m;
    }
    //
    var fixData = {
        transData: function (num, n) {
            num = String(num.toFixed(n));
            var re = /(-?\d+)(\d{3})/;
            while (re.test(num)) {
                num = num.replace(re, "$1,$2");
            }
            return num;
        },
        percData: function (num) {
            return (num * 100).toFixed(1) + '%';
        }
    };
    //
    function LineHeightFix(content) {
        var _noData = $('<div class="no_data"><i class="icon i22"></i></div>');
        content.append(_noData);
        var parHeight = _noData.parent().height();
        _noData.css('line-height', parHeight + 'px');
    }
    //
    function LoadingHeightFix(content) {
        var _loading = $('<div class="no_data"><img src="http://pic.ctrip.com/droco/img/loading.gif" alt=""></div>');
        content.html(_loading);
        var parHeight = _loading.parent().height();
        _loading.css('line-height', parHeight + 'px');
    }
    //
    function ChargeFix(content, jpgName, lanType) {
        var ins, _d = $('<div class="payment"></div>');
        //语言环境
        if (lanType == "en") {
            ins = document.createElement('i');
            ins.className = "cont_mgr";
        } else {
            ins = document.createElement('img');
            ins.src = "http://pic.ctrip.com/droco/img/sample/" + jpgName;
        }
        content.html(_d.html(ins));
        var parHeight = content.height();
        _d.css('line-height', parHeight + 'px');
    }
    //..ipad pc样式切换
    function cssLoad(LanType) {
        var cssLinks = [], ua = navigator.userAgent.toLowerCase(), isIpad = (ua.match(/iPad/i) == "ipad");

        switch (LanType) {
            case "zh-cn":
                cssLinks.push("../CSS/Ch/global.css");
                isIpad && cssLinks.push("../CSS/Ch/global_pad.css");
                break;
            case "en":
                cssLinks.push("../CSS/En/global.css");
                isIpad && cssLinks.push("../CSS/En/global_pad.css");
                break;
            default:
                cssLinks.push("../CSS/Ch/global.css");
                isIpad && cssLinks.push("../CSS/Ch/global_pad.css");
                break;
        }
        //添加cssLink中的所有css
        for (var i = 0, maxLen = cssLinks.length; i < maxLen; i++) {
            var link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = cssLinks[i];
            document.getElementsByTagName("head")[0].appendChild(link);
        }
    }

    function formatTime(val) {
        var re = /-?\d+/;
        var m = re.exec(val);
        var d = new Date(parseInt(m[0]));
        // 按【2012-02-13 09:09:09】的格式返回日期
        return d.format("yyyy-MM-dd hh:mm:ss");
    }

    //form
    function submitForm(opt) {
        var f = this._form = this._form || function () {
            var f = document.createElement('form');
            f.style.display = 'none';
            document.body.appendChild(f);
            return f;
        } ();
        if (typeof opt.data == 'object' && opt.data) {
            var html = [], d = opt.data;
            for (var n in d) {
                if (!d.hasOwnProperty(n)) continue;
                var v = d[n] === undefined || d[n] === null ? '' : d[n].toString();
                v = v.replace(/\"/gi, '\\"');
                html.push('<input type=hidden name="' + n + '" value="' + v + '"/>');
                opt.data = html.join('');
            }
        }
        $(f).attr('action', opt.url)
        .attr('method', opt.method || 'GET')
        .attr('target', opt.target || '_self')
        .html(opt.data)
        .submit();
    }

    function goError() {
        window.location.href = "../ReportUI/Error";
    }

    //bros
    var ua = navigator.userAgent.toLowerCase();
    var browser = {
        isIPad: (ua.match(/iPad/i) == "ipad") ? true : false
    }

    return {
        getParam: getParam,
        getDownLoadParam: getDownLoadParam,
        hrefChange: hrefChange,
        hashAny: hashAny,
        fixData: fixData,
        LineHeightFix: LineHeightFix,
        LoadingHeightFix: LoadingHeightFix,
        ChargeFix: ChargeFix,
        cssLoad: cssLoad,
        formatTime: formatTime,
        submitForm: submitForm,
        goError: goError,
        browser: browser
    }
})();

//mash和unmask
$.extend($.fn, {
    mask: function (o) {
        var a = this[0];
        if (!a)
            return console.log("mask", "the cDom object is empty"), this;
        this.unmask();
        var b = {};
        b.cssText = a.style.cssText;
        b.nextSibling = a.nextSibling;
        b.parentNode = a.parentNode;
        a.style.position = "absolute";
        a.style.display = "block";
        var C = {
            a_bgColor: (o && o.bgColor) || "#fff"
        };
        //        var _ina = document.createElement("container");
        //        _ina.style.cssText = "position:absolute;top:0;left:0;width:0;height:0;z-index:100;";
        //        var _inb = document.body;
        //        _inb || document.write('<span id="__body__" style="display:none;">cQuery</span>');
        //        ((_inb = document.body.firstChild) ? document.body.insertBefore(_ina, _inb) : document.body.appendChild(_ina));
        //        (_inb = document.getElementById("__body__")) && _inb.parentNode.removeChild(_inb);
        //        var _container = $(_ina);
        //        _container.append(a);
        a.style.left = (document.documentElement.scrollLeft || document.body.scrollLeft || 0) + Math.max(0, (document.documentElement.clientWidth - a.offsetWidth) / 2) + "px";
        a.style.top = (document.documentElement.scrollTop || document.body.scrollTop || 0) + Math.max(0, (document.documentElement.clientHeight - a.offsetHeight) / 2) + "px";
        var c = "background:" + C.a_bgColor + ";position:absolute;left:0;top:0;width:" + Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth, document.body.clientWidth, document.body.scrollWidth) + "px;height:" + Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight) + "px;";
        b.maskDiv = document.createElement("div");
        b.maskDiv.style.cssText = c + "filter:progid:DXImageTransform.Microsoft.Alpha(opacity=60);opacity:0.6;";
        $(b.maskDiv).insertBefore(a);
        var isIE = /msie/.test(navigator.userAgent.toLowerCase());
        isIE && (b.maskIframe = document.createElement("iframe"), b.maskIframe.style.cssText = c + "filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);opacity:0;", $(b.maskIframe).insertBefore(b.maskDiv));
        this.data("__mask__", b);
        return this;
    },
    unmask: function () {
        if (!this[0])
            return console.log("mask", "the cDom object is empty"), this;
        var a = this.data("__mask__");
        a && (this[0].style.cssText = a.cssText, (a.nextSibling ? this.first().insertBefore(a.nextSibling) : this.first().appendTo(a.parentNode)), $(a.maskDiv).remove(), a.maskIframe && $(a.maskIframe).remove(), this.removeData("__mask__"));
    },
    placeholder: function () {
        if ("placeholder" in document.createElement("input")) {
            return this; //如果原生支持placeholder属性，则返回对象本身
        } else {
            return this.each(function () {
                var _this = $(this);
                _this.focus(function () {
                    if (_this.val() === _this.attr("placeholder")) {
                        _this.css("color", "");
                        _this.val("")
                    }
                }).blur(function () {
                    if (_this.val().length === 0) {
                        _this.val(_this.attr("placeholder"));
                        _this.css("color", "gray");
                    }
                });
                if (!_this.val()) { _this.val(_this.attr("placeholder")); _this.css("color", "gray"); };
            })
        }
    }
});

//
Date.prototype.format = function (format)
{
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
      RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}