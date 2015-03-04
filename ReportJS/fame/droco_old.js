/*
◇ Writer:一七
◇ For:Data Report of Ctrip Online
◇ Time:2013.12.12
◇ Version:
*/

var Droco_Funs_17 = {};

var dpHeaderSuccess = function () {
}

// 获取公共Header区域
Droco_Funs_17.getHeader = function getHeader(index) {
    var headAjaxSuccess = function (html) {
        $('.header').append(html);
        //头部slider
        $('#menu').find('li').removeClass('cur');
        $('#menu').find('li').eq(index).addClass('cur');
        var array_w = $('#menu').find('li').map(function () { return $(this).outerWidth(true); });
        $('#menu').find('.backLava').css({
            'width': array_w[index],
            'left': getSliderDistance(array_w, index)
        });
        Droco_Funs_17.BackLava();

    }
    var getSliderDistance = function (array_w, i) {
        var arr = array_w.slice(0, i),
			len = arr.length,
			sum = 0;
        for (var j = 0; j < len; j++) {
            sum += arr[j];
        }
        return sum;
    }

    $.ajax({
        url: '../XmlData/header.xml',
        dataType: 'html',
        cache: false,
        success: headAjaxSuccess
    });
};

// 获取公共Footer区域
Droco_Funs_17.getFooter = function () {
    $.ajax({
        url: '../XmlData/footer.xml',
        dataType: 'html',
        cache: false,
        success: function (html) {
            $('.footer').append(html);
        }
    });
};

// 获取酒店sub_nav区域
Droco_Funs_17.getHotelSubNav = function (index) {
    var htlSubNavSuccess = function (html) {
        $('.sub_nav').append(html);
        //class 变动
        $('#htlSubNavID').find('li').removeClass('cur');
        $('#htlSubNavID').find('li').eq(index).addClass('cur');
    }
    $.ajax({
        url: '../XmlData/hotel_sub_nav.xml',
        dataType: 'html',
        cache: false,
        success: htlSubNavSuccess
    });
};

// 获取机票sub_nav区域
Droco_Funs_17.getFlightsSubNav = function (index) {
    var fliSubNavSuccess = function (html) {
        $('.sub_nav').append(html);

        //class变动
        $('#fliSubNavID').find('li').removeClass('cur');
        $('#fliSubNavID').find('li').eq(index).addClass('cur');
    };

    $.ajax({
        url: '../XmlData/flights_sub_nav.xml',
        dataType: 'html',
        cache: false,
        success: fliSubNavSuccess
    });
};

// 获取筛选区域
Droco_Funs_17.getFilterBar = function () {
    var fliterBarSuccess = function (html) {
        $('.filter_bar').append(html);
        //        $.getScript('../Scripts/ReportJS/commPub/header.js', function () {
        //            dpHeader.init();
        //            dpHeaderSuccess();
        //        });


        dpHeader.init();
        dpHeaderSuccess();

        //改变href的值
        var _hdmk = $('#menu').find('a'),
            _fltmk = $('#fliSubNavID').find('a'),
            _htlmk = $('#htlSubNavID').find('a'),
            _initHeadIndex = dpHeader.getHeadIndex();
        if (_hdmk && _hdmk.length > 0) { hrefChange(_hdmk, _initHeadIndex); }
        if (_fltmk && _fltmk.length > 0) { hrefChange(_fltmk, _initHeadIndex); }
        if (_htlmk && _htlmk.length > 0) { hrefChange(_htlmk, _initHeadIndex); }
    }

    $.ajax({
        url: '../XmlData/filter_bar.xml',
        dataType: 'html',
        cache: false,
        success: fliterBarSuccess
    });
};

// Menu滑动块
Droco_Funs_17.BackLava = function () {
    var container = $('#menu'),
		elements = $('li', container),
		className = 'cur',
		slider = $('.backLava', container),
		now_index = $(elements).filter('.cur').index(),
		array_w = $(elements).map(function () { return $(this).outerWidth(true); }),
		initial_width = $('.cur').width(),
		initial_position = $('.cur').position();
    $('.backLava').css({ left: initial_position.left, width: initial_width });
    // 初始化滑块的宽度及位置

    $(container).on('click', 'li', function () {
        // 获取当前点击的元素索引
        now_index = $(this).index();
        // 添加class
        $(this).addClass(className).siblings().removeClass(className);
        // 滑块移动至当前位置
        setSlider(now_index);
    });
    $(container).on('mouseenter', 'li', function () {
        // 获取当前索引
        var i = $(this).index();
        // 滑块移动至当前位置
        setSlider(i);
    });
    $(container).on('mouseleave', function () {
        // 鼠标离开导航区域后, 滑块还原至最后点击的元素处
        setSlider(now_index);
    });

    function setSlider(i) {
        $(slider).width(array_w[i]);
        $(slider).stop(true, true).animate({ 'left': getSliderDistance(i) }, 'fast');
        // console.log(getSliderDistance(i));
    }

    function getSliderDistance(i) {
        var arr = array_w.slice(0, i),
			len = arr.length,
			sum = 0;
        for (var j = 0; j < len; j++) {
            sum += arr[j];
        }
        return sum;
    }
};

var submitNewForm = function (opt) {
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




function dwLoad() {
    //后端下载
    var _param = getDownLoadParam(dpHeader.getHeadData());
    var pathname = location.pathname.substr(0, location.pathname.lastIndexOf('/'));
    submitNewForm({
        url: "http://" + window.location.host + pathname + '/OrderDownload?' + _param,
        method: 'POST',
        target: '_blank'
    });
}

// 打印下载
jQuery(function ($) {
    var funsLayer = '<div class="funs_layer"><ul><li class="print"><a href="javascript:window.print();" class="icon i12" id="printID">打印</a></li><li class="download"><a href="javascript:void(0);" class="icon i13" onclick="dwLoad()">下载</a></li></ul></div>';
    $('body').append(funsLayer);
    $('.funs_layer').css({ 'position': 'fixed', 'right': '0', 'top': '84px' });

});