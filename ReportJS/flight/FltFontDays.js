(function ($) {
    //☆=================== var S ===================☆
    var _flightFontDaysInfo, //页面数据
        _fontDaysInfo, //部门为全部的所有信息
        _departInfo;   //部门的信息
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //提前预定天数-平均折扣
    var fontDaysAvgDis = {
        init: function () {
            fontDaysAvgDis.drawChart($('#fontDaysDisID'), _fontDaysInfo.FontDaysFullInfo);
        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].data.length > 0) { return false; }
            }
            return true;
        },
        drawChart: function (content, data) {
            var xData = fontDaysAvgDis.getXSeries(data);
            var yData = [],
            columnData = fontDaysAvgDis.getColumnData(data),
            lineData = fontDaysAvgDis.getLineData(data),
            _emptyData;

            yData.push(columnData);
            yData.push(lineData);
            //yData[0] = columnData;
            //yData[1] = lineData;
            //no data
            _emptyData = fontDaysAvgDis.checkDataEmpty(yData);
            content.empty();
            if (_emptyData) {
                CM.LineHeightFix(content);
            } else {
                content.highcharts({
                    colors: ['#1c76ec'],
                    title: {
                        text: null
                    },
                    tooltip: {
                        shared: true,
                        style: {
                            lineHeight: '18px'
                        }
                    },
                    xAxis: {
                        categories: xData,
                        tickLength: 2
                    },
                    plotOptions: {
                        column: {
                            borderWidth: 0,
                            borderRadius: 0.5,  //设置柱状图的圆角，美观
                            pointWidth: 30,
                            dataLabels: {
                                enabled: true,
                                formatter: function () {
                                    return this.y;
                                },
                                crop: false,
                                overflow: "none",
                                style: {
                                    color: '#666'
                                }
                            }
                        }
                    },
                    yAxis: [{
                        labels: {
                            format: '{value}'
                        },
                        title: {
                            text: corpReport_FlightFontDays.js_Tickets,
                            margin: 6
                        },
                        gridLineWidth: 0
                    }, {
                        labels: {
                            format: '{value}'
                        },
                        title: {
                            text: corpReport_FlightFontDays.js_AvgDiscount,
                            margin: 8
                        },
                        gridLineWidth: 0,
                        opposite: true
                    }],
                    credits: {
                        enabled: false
                    },
                    legend: {
                        align: 'right',
                        verticalAlign: 'top',
                        borderWidth: 0,
                        x: -80,
                        y: -15,
                        floating: true
                    },
                    series: yData
                });
            }
        },
        getXSeries: function (data) {
            var _d = [];
            for (var i = 0; i < data.length; i++) {
                _d[i] = data[i].Day;
            }
            return _d;
        },
        getColumnData: function (data) {
            var _cD = {};
            _cD.name = corpReport_FlightFontDays.js_Tickets;
            _cD.type = "column";
            var cData = [];
            for (var i = 0; i < data.length; i++) {
                cData[i] = data[i].Number;
            }
            _cD.data = cData;

            return _cD;
        },
        getLineData: function (data) {
            var _cD = {};
            _cD.name = corpReport_FlightFontDays.js_AvgDiscount;
            _cD.type = "line";
            _cD.color = "#539eff";
            _cD.yAxis = 1;
            var cData = [];
            for (var i = 0; i < data.length; i++) {
                cData[i] = data[i].AvgDiscount;
            }
            _cD.data = cData;

            return _cD;
        }
    };

    //
    function noticeInit() {
        if (!("placeholder" in document.createElement("input"))) {
            $("#depNameID").placeholder();
        }
    }

    //提前预定天数-全价票比例
    var fontDaysAllPer = {
        init: function () {
            fontDaysAllPer.drawBubble($('#fontDaysPerID'), _fontDaysInfo.FontDaysFullInfo);
            Highcharts.setOptions({
                lang: {
                    resetZoom: '<b>重置</b>'
                }
            });
        },
        drawBubble: function (content, data) {
            var xData = fontDaysAllPer.getXSeries(data),
            yData = fontDaysAllPer.getYSeries(data);

            //no data
            content.empty();
            if (yData.length > 0) {
                content.highcharts({
                    chart: {
                        type: 'bubble',
                        plotBorderWidth: 1,
                        zoomType: 'xy'
                    },
                    title: {
                        text: null
                    },
                    xAxis: {
                        gridLineWidth: 0,
                        categories: xData,
                        tickLength: 2
                    },
                    yAxis: {
                        startOnTick: false,
                        endOnTick: false,
                        gridLineWidth: 0,
                        title: {
                            text: null
                        },
                        tickLength: 2,
                        labels: {
                            formatter: function () {
                                return (this.value * 100).toFixed(0) + '%';
                            }
                        }
                    },
                    legend: {
                        align: 'right',
                        verticalAlign: 'top',
                        borderWidth: 0,
                        floating: true
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        bubble: {
                            dataLabels: {
                                enabled: true,
                                formatter: function () {
                                    return (this.point.y * 100).toFixed(1) + '%';
                                },
                                color: 'black',
                                inside: false
                            }
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            return corpReport_FlightFontDays.js_LeadTime + ': ' + this.point.x + '<br/>' +
                            corpReport_FlightFontDays.js_FullFareTicketRate + ': ' + (this.point.y * 100).toFixed(1) + '%<br/>' +
                            corpReport_FlightFontDays.js_FullFareTickets + ': ' + this.point.z;
                        },
                        style: {
                            lineHeight: '18px'
                        }
                    },
                    series: [{
                        data: yData,
                        name: corpReport_FlightFontDays.js_FullRatebiggerbubble,
                        marker: {
                            fillColor: {
                                radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                                stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, 'rgba(69,114,167,0.5)']
                        ]
                            }
                        }
                    }]
                });
            } else {
                CM.LineHeightFix(content);
            }
        },
        getXSeries: function (data) {
            var _d = [];
            for (var i = 0; i < data.length; i++) {
                _d[i] = data[i].Day;
            }
            return _d;
        },
        getYSeries: function (data) {
            var _d = [];
            for (var i = 0; i < data.length; i++) {
                var _di = [];
                _di[0] = i;
                _di[1] = data[i].FullPricePer;
                _di[2] = data[i].FullPriceNumber;
                _d[i] = _di;
            }
            return _d;
        }
    };

    //提前预定天数-按部门分析
    var fontDaysPtAny = {
        init: function () {
            //绘制下拉框
            fontDaysPtAny.depTextInit(_fontDaysInfo.DepartInfo);

            //绘制table表格，初始使用全部数据
            fontDaysPtAny.clearAll();
            fontDaysPtAny.drawHead();
            fontDaysPtAny.drawBody(_fontDaysInfo.FontDaysFullInfo);
            fontDaysPtAny.drawFoot(_fontDaysInfo.TolFullInfo);
        },
        depTextInit: function (dt) {
            //填入全部
            var content = $('#depNameID');

            if (dt.length > 0) {
                content.val(corpReport_FlightFontDays.js_All);
            }
            //绘制下拉
            fontDaysPtAny.drawDepart(dt);
            //绑定点击
            content.unbind('click');
            content.bind('click', fontDaysPtAny.showDepart);
            //content.bind('focus', fontDaysPtAny.showDepart);
            //搜索
            content.unbind('keyup');
            content.bind('keyup', fontDaysPtAny.drawFindResult);
        },
        drawDepart: function (dt) {
            var _depNameSelID = $('#depNameSelID');

            _depNameSelID.empty();
            //数据大于7条，显示滚动条
            if (dt.length > 6) {
                _depNameSelID.addClass('y_scroll');
            } else {
                _depNameSelID.removeClass('y_scroll');
            }

            var _ul = $('<ul></ul>');
            //喷入全部
            var _l = $('<li></li>');
            _l.html('<a href="javascript:;">' + corpReport_FlightFontDays.js_All + '</a>');
            _l.bind('click', fontDaysPtAny.departClick);
            _ul.append(_l);
            //部门下拉框
            for (var i = 0; i < dt.length; i++) {
                var _li = $('<li></li>');
                _li.html('<a href="javascript:;" title="' + dt[i].Name + '">' + dt[i].Name + '</a>');
                _li.bind('click', fontDaysPtAny.departClick);
                _ul.append(_li)
            }
            _depNameSelID.append(_ul);
        },
        showDepart: function (event) {
            event.preventDefault();
            event.stopPropagation();
            //触发点击的时候，重新绘制
            fontDaysPtAny.drawDepart(_fontDaysInfo.DepartInfo);
            $('#depNameSelID').css('display', '');
        },
        _timeout: null,
        departClick: function (event) {
            event.preventDefault();
            event.stopPropagation();

            var _depNameSelID = $('#depNameSelID'),
            _depNameID = $('#depNameID'),
            _fltDepAnysID = $('#fltDepAnysID');

            //隐藏浮层
            _depNameSelID.css('display', 'none');
            //值填入输入框
            _depNameID.val($(this).text());
            //..loading
            CM.LoadingHeightFix(_fltDepAnysID);
            //控制timeout
            window.clearTimeout(fontDaysPtAny._timeout);
            fontDaysPtAny._timeout = window.setTimeout(function () {
                //发送ajax请求..重绘表
                //全部不需要发送ajax
                if (_depNameID.val() == "全部" || _depNameID.val() == "All") {
                    //直接绘制
                    fontDaysPtAny.clearAll();
                    fontDaysPtAny.drawHead();
                    fontDaysPtAny.drawBody(_fontDaysInfo.FontDaysFullInfo);
                    fontDaysPtAny.drawFoot(_fontDaysInfo.TolFullInfo);
                } else {
                    //获取部门信息
                    var _ptDt = dpHeader.getHeadData();
                    _ptDt.DepName = _depNameID.val();
                    $.ajax({
                        url: '../Flight/GetDepartInfo',
                        type: "POST",
                        data: _ptDt,
                        success: function (data) {
                            //..
                            var _departInfo = $.parseJSON(data);
                            fontDaysPtAny.clearAll();
                            fontDaysPtAny.drawHead();
                            fontDaysPtAny.drawBody(_departInfo.FontDaysFullInfo);
                            fontDaysPtAny.drawFoot(_departInfo.TolFullInfo);
                        },
                        error: function () {
                            alert('error!');
                        }
                    });
                }
            }, 100);

        },
        drawFindResult: function (event) {
            event.preventDefault();
            event.stopPropagation();
            //
            var data = _fontDaysInfo.DepartInfo;
            var list = fontDaysPtAny.filterList($(this).val(), data);
            fontDaysPtAny.drawDepart(list);
        },
        drawHead: function () {
            //绘制头部
            var _head = $('<table><thead id="headTableID"></thead></table>');
            $('#fltDepAnysID').append(_head);
            var _str = ['<tr>'];
            _str.push('<th width="20%" align="left">' + corpReport_FlightFontDays.js_LeadTime + '</th>');
            _str.push('<th width="10%">' + corpReport_FlightFontDays.js_Tickets + '</th>');
            _str.push('<th width="10%">' + corpReport_FlightFontDays.js_PerofTickets + '</th>');
            _str.push('<th width="15%">' + corpReport_FlightFontDays.js_FullFareTickets + '</th>');
            _str.push('<th width="10%">' + corpReport_FlightFontDays.js_FullFareTicketRate + '</th>');
            _str.push('<th width="10%">' + corpReport_FlightFontDays.js_AvgDiscount + '</th>');
            _str.push('<th width="25%">' + corpReport_FlightFontDays.js_AvgDiscountExcludingFull + '</th>');
            _str.push('<th class="null_place"><div></div></th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (data) {
            //绘制整个body
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>');
            $('#fltDepAnysID').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //no data
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _str = ['<tr>'];
                    _str.push('<td width="20%" align="left">' + data[i].Day + '</td>');
                    _str.push('<td width="10%">' + CM.fixData.transData(data[i].Number, 0) + '</td>');
                    _str.push('<td width="10%">' + CM.fixData.percData(data[i].Percent) + '</td>');
                    _str.push('<td width="15%">' + CM.fixData.transData(data[i].FullPriceNumber, 0) + '</td>');
                    _str.push('<td width="10%">' + CM.fixData.percData(data[i].FullPricePer) + '</td>');
                    _str.push('<td width="10%">' + data[i].AvgDiscount + '</td>');
                    _str.push('<td width="25%">' + data[i].NFullAvgDiscount + '</td>');
                    _str.push('</tr>');
                    _bodyTableID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        },
        drawFoot: function (data) {
            //绘制foot部分
            var _foot = $('<table><tfoot id="footTableID"></tfoot></table>');
            $('#fltDepAnysID').append(_foot);
            var _str = ['<tr>'];
            _str.push('<td width="20%" align="left">' + corpReport_FlightFontDays.js_Total + '</td>');
            _str.push('<td width="10%">' + CM.fixData.transData(data.TolNumber, 0) + '</td>');
            _str.push('<td width="10%">' + CM.fixData.percData(data.TolNumPercent) + '</td>');
            _str.push('<td width="15%">' + CM.fixData.transData(data.TolFullPriceNumber, 0) + '</td>');
            _str.push('<td width="10%">' + CM.fixData.percData(data.TolFullPricePer) + '</td>');
            _str.push('<td width="10%">' + data.TolAvgDiscount + '</td>');
            _str.push('<td width="25%">' + data.TolNFullAvgDiscount + '</td>');
            _str.push('<td class="null_place"><div></div></td></tr>');
            $('#footTableID').append(_str.join(""));
        },
        clearAll: function () {
            $('#fltDepAnysID').empty();
        },
        filterList: function (value, list) {
            if (IsEmpty(value))
                return list;
            var newList = [];
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (fontDaysPtAny.IsContain(value, list[i].Name)) {
                        var _t = {};
                        _t.Name = list[i].Name.replace(value, '<strong>' + value + '</strong>');
                        _t.UID = list[i].UID;
                        newList.push(_t);
                    }
                }
            }
            return newList;
        },
        IsContain: function (str, key) {
            var reg = new RegExp(str + '+', 'gi');
            return reg.test(key);
        }
    };

    function IsEmpty(value) {
        if ((typeof value == 'string' && value.length == 0) || value == null)
            return true;
        else
            return false;
    }

    //
    var flightFontDaysInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //
        $.ajax({
            url: '../Flight/GetFlightFontDays',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                //初始赋值
                _flightFontDaysInfo = $.parseJSON(data);
                //初始赋值
                _fontDaysInfo = _flightFontDaysInfo.FontDaysInfo;
                //初始化
                fontDaysAvgDis.init();
                fontDaysAllPer.init();
                fontDaysPtAny.init();
                //
                noticeInit();
            },
            error: function () {
                noDataID.unmask();
                CM && CM.goError();
            }
        });
    }
    //☆=================== Fun E ===================☆
    //
    dpHeaderSuccess = function () {
        //初始的头部数据
        CM.hrefChange($('#menu').find('a'), _headSelectInfo);
        CM.hrefChange($('#fliSubNavID').find('a'), _headSelectInfo);
        flightFontDaysInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..重新访问SumPage
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(1);
    Droco_Funs.getFlightsSubNav(6);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);