var dpHeaderSuccess = function () {
}

var Droco_Funs_17 = (function () {
    //    var comInfo = {
    //        HeadInfo: '<div class="view_wrap"><h1 class="logo"><a href="http://ct.ctrip.com/crptravel/index.aspx"><i class="icon i1">Ctrip - 携程</i></a></h1><h2 class="site_name">携程在线数据报告<em>Data Report of Ctrip Online</em></h2><ul class="language_version"><li><a href="Start" title="中文版" class="current"><i class="icon i2">中文版</i></a></li></ul><div id="menu" class="menu"><ul><li class="cur"><a dLink="SumPage" href="SumPage">总概</a></li><li><a dLink="FlightPage" href="FlightPage">机票</a></li><li><a dLink="HotelPage" href="HotelPage">酒店</a></li><li class="backLava"></li></ul></div></div>',
    //        FooterInfo: '<div class="view_wrap"><p>本报告数据来源于贵司在携程商旅的消费数据。</p><p>此报告的最终解释权归携程旅行网商旅数据中心所有，如有疑问请联系负责您公司的客户经理。</p><p>Copyright© 1999-2014, ctrip.com. All Rights Reserved.</p></div>',
    //        HotelSubNavInfo: '<ul id="htlSubNavID"><li class="cur"><a dLink="HotelPage" href="HotelPage">酒店总体情况</a></li><li><a dLink="HotelAgreement" href="HotelAgreement">协议酒店</a></li><li><a dLink="HotelStar" href="HotelStar">星级</a></li><li><a dLink="HotelCity" href="HotelCity">城市</a></li><li><a dLink="HotelSvALs" href="HotelSvALs">节省与损失</a></li></ul>',
    //        FlightsSubNavInfo: '<ul id="fliSubNavID"><li class="cur"><a dLink="FlightPage" href="FlightPage">机票消费</a></li><li><a dLink="FlightDepAnysis" href="FlightDepAnysis">部门分析</a></li><li><a dLink="FlightPsgerAnysis" href="FlightPsgerAnysis">乘机人分析</a></li><li><a dLink="FlightPositions" href="FlightPositions">舱位</a></li><li><a dLink="FlightCarriers" href="FlightCarriers">承运商</a></li><li><a dLink="FlightRoutes" href="FlightRoutes">航线</a></li><li><a dLink="FlightFontDays" href="FlightFontDays">提前预订天数</a></li><li><a dLink="FlightSvALs" href="FlightSvALs">节省与损失</a></li><li><a dLink="FlightAvtAgrmt" href="FlightAvtAgrmt">协议航空</a></li><li><a dLink="FlightCarbEm" href="FlightCarbEm">碳排放</a></li></ul>',
    //        FilterBarInfo: '<div class="filter_option option1" id="masterAccountID"><label>主帐户</label><span><i class="icon i5"></i></span></div><div class="filter_option option2" id="departmentID"><label>部门</label><span><i class="icon i5"></i></span></div><div class="filter_option option3" id="consumerInfoID"><label>消费属性</label><span><i class="icon i5"></i></span></div><div class="filter_option option4"><label>时间范围</label><span class="" id="startDateID">yyyy-mm-dd<i class="icon i5 for_time1"></i></span><div class="option_box date date1 hidepop" style="display:none" id="startDateSelID"><ul id="stDateUlID"></ul></div><span class="time_connector">-</span><span class="" id="endDateID">yyyy-mm-dd<i class="icon i5"></i></span><div class="option_box date hidepop" style="display:none" id="endDateSelID" ><ul id="endDateUlID"></ul></div></div><div class="filter_search"><a href="javascript:void(0)" id="searchBtnID"><i class="icon i21"></i>查询</a></div>'
    //    };
    var comInfo = (function () {
        var headInfo = [],
            footerInfo = [],
            hotelSubNavInfo = [],
            flightSubNavInfo = [],
            filterBarInfo = [];
        //headInfo
        headInfo.push('<div class="view_wrap"><h1 class="logo"><a href="http://ct.ctrip.com/crptravel/index.aspx"><i class="icon i1">Ctrip - 携程</i></a></h1><h2 class="site_name">' + corpReport_Common.js_TitleInfo + '<em>' + corpReport_Common.js_SubTitleInfo + '</em></h2>');
        headInfo.push('<ul class="language_version"><li><a id="chV" title="中文版" class="current"><i class="icon i2">中文版</i></a></li><li><a id="enV" title="English" class=""><i class="icon i3">英文版</i></a></li></ul>');
        headInfo.push('<div id="menu" class="menu"><ul><li class="cur"><a dLink="SumPage" href="SumPage">' + corpReport_Common.js_Summary + '</a></li><li><a dLink="FlightPage" href="FlightPage">' + corpReport_Common.js_Airfare + '</a></li><li><a dLink="HotelPage" href="HotelPage">' + corpReport_Common.js_Hotel + '</a></li><li class="backLava"></li></ul></div></div>');
        //footerInfo
        footerInfo.push('<div class="view_wrap"><p>' + corpReport_Common.msg_Message1 + '</p><p>' + corpReport_Common.msg_Message2 + '</p><p>Copyright© 1999-2014, ctrip.com. All Rights Reserved.</p></div>');
        //hotelSubNavInfo
        hotelSubNavInfo.push('<ul id="htlSubNavID"><li class="cur"><a dLink="HotelPage" href="HotelPage">' + corpReport_Common.js_HotelExpenses + '</a></li><li><a dLink="HotelAgreement" href="HotelAgreement">' + corpReport_Common.js_CorpHotel + '</a></li><li><a dLink="HotelStar" href="HotelStar">' + corpReport_Common.js_StarRating + '</a></li><li><a dLink="HotelCity" href="HotelCity">' + corpReport_Common.js_Cities + '</a></li><li><a dLink="HotelSvALs" href="HotelSvALs">' + corpReport_Common.js_Savings + '</a></li></ul>');
        //flightSubNavInfoxs
        flightSubNavInfo.push('<ul id="fliSubNavID"><li class="cur"><a dLink="FlightPage" class="line2" href="FlightPage">' + corpReport_Common.js_AirfareExpenses + '</a></li><li><a dLink="FlightDepAnysis" href="FlightDepAnysis">' + corpReport_Common.js_Departments + '</a></li><li><a dLink="FlightPsgerAnysis" href="FlightPsgerAnysis">' + corpReport_Common.js_Passenger + '</a></li><li><a dLink="FlightPositions" href="FlightPositions">' + corpReport_Common.js_CabinClass + '</a></li><li><a dLink="FlightCarriers" href="FlightCarriers">' + corpReport_Common.js_Carriers + '</a></li><li><a dLink="FlightRoutes" href="FlightRoutes">' + corpReport_Common.js_Itineraries + '</a></li><li><a dLink="FlightFontDays" href="FlightFontDays">' + corpReport_Common.js_LeadTime + '</a></li><li><a dLink="FlightSvALs" href="FlightSvALs">' + corpReport_Common.js_Savings + '</a></li><li><a dLink="FlightAvtAgrmt" href="FlightAvtAgrmt">' + corpReport_Common.js_CorpAirline + '</a></li><li><a dLink="FlightCarbEm" href="FlightCarbEm">' + corpReport_Common.js_CO2Emissions + '</a></li></ul>');
        //FilterBarInfo
        filterBarInfo.push('<div class="filter_option option1" id="masterAccountID"><label>' + corpReport_Common.js_PrimaryAccount + '</label><span><i class="icon i5"></i></span></div><div class="filter_option option2" id="departmentID"><label>' + corpReport_Common.js_Department + '</label><span><i class="icon i5"></i></span></div><div class="filter_option option3" id="consumerInfoID"><label>' + corpReport_Common.js_TravelType + '</label><span><i class="icon i5"></i></span></div><div class="filter_option option4"><label>' + corpReport_Common.js_TimePeriod + '</label><span class="" id="startDateID">yyyy-mm-dd<i class="icon i5 for_time1"></i></span><div class="option_box date date1 hidepop" style="display:none" id="startDateSelID"><ul id="stDateUlID"></ul></div><span class="time_connector">-</span><span class="" id="endDateID">yyyy-mm-dd<i class="icon i5"></i></span><div class="option_box date hidepop" style="display:none" id="endDateSelID" ><ul id="endDateUlID"></ul></div></div><div class="filter_search"><a href="javascript:void(0)" id="searchBtnID"><i class="icon i21"></i>' + corpReport_Common.btn_Search + '</a></div>');

        return {
            HeadInfo: headInfo.join(""),
            FooterInfo: footerInfo.join(""),
            HotelSubNavInfo: hotelSubNavInfo.join(""),
            FlightsSubNavInfo: flightSubNavInfo.join(""),
            FilterBarInfo: filterBarInfo.join("")
        };
    })();


    var f = {};
    //Header
    f.getHeader = function (index) {
        var getSliderDistance = function (array_w, i) {
            var arr = array_w.slice(0, i),
			len = arr.length,
			sum = 0;
            for (var j = 0; j < len; j++) {
                sum += arr[j];
            }
            return sum;
        };
        (function () {
            $('.header').append(comInfo.HeadInfo);
            //ch-en切换的url
            var cv = $('#chV'), ev = $('#enV'), m = $('#menu'),
                pathName = window.location.pathname,
                dLink = pathName.substr(pathName.lastIndexOf('/') + 1),
                lhash = window.location.hash;
            cv.attr('href', dLink + '?lang=zh-cn' + lhash);
            ev.attr('href', dLink + '?lang=en' + lhash);
            //current Class
            $('#chV,#enV').removeClass("current");
            lanType == "en" ? ev.addClass("current") : cv.addClass("current");

            //头部slider
            m.find('li').removeClass('cur');
            m.find('li').eq(index).addClass('cur');
            var array_w = m.find('li').map(function () { return $(this).outerWidth(true); });
            m.find('.backLava').css({
                'width': array_w[index],
                'left': getSliderDistance(array_w, index)
            });
            BackLava();
        } ());

    };
    //Footer
    f.getFooter = function () {
        $('.footer').append(comInfo.FooterInfo);
    };
    // 获取酒店sub_nav区域
    f.getHotelSubNav = function (index) {
        (function () {
            $('.sub_nav').append(comInfo.HotelSubNavInfo);
            //class 变动
            $('#htlSubNavID').find('li').removeClass('cur');
            $('#htlSubNavID').find('li').eq(index).addClass('cur');
        } ());
    };
    //获取机票sub_nav区域
    f.getFlightsSubNav = function (index) {
        (function () {
            $('.sub_nav').append(comInfo.FlightsSubNavInfo);
            //class变动
            $('#fliSubNavID').find('li').removeClass('cur');
            $('#fliSubNavID').find('li').eq(index).addClass('cur');
        } ());
    };
    // 获取筛选区域
    f.getFilterBar = function () {
        (function () {
            $('.filter_bar').append(comInfo.FilterBarInfo);

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
            //1.1 menu_ico展示隐藏
            $('.menu_ico').bind('click', function () { $('.sub_nav').addClass('on'); });
            $('.icon.i4').bind('click', function () { $('.sub_nav').removeClass('on'); });
        } ());
    };

    // Menu滑动块
    var BackLava = function () {
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
    return f;
})();

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
};

function dwLoad() {
    //后端下载
    var _param = getDownLoadParam(dpHeader.getHeadData());
    var pathname = location.pathname.substr(0, location.pathname.lastIndexOf('/'));
    submitNewForm({
        url:"http://" + window.location.host + pathname + '/OrderDownload?' + _param,
        method:'POST',
        target:'_blank'
    });
};
// 打印下载
jQuery(function ($) {
    var funsLayer = '<div class="funs_layer"><ul><li class="print"><a href="javascript:window.print();" class="icon i12" id="printID">打印</a></li><li class="download"><a href="javascript:void(0);" class="icon i13" onclick="dwLoad()">下载</a></li></ul></div>';
    $('body').append(funsLayer);
    $('.funs_layer').css({ 'right': '0', 'bottom': '24px' });
});