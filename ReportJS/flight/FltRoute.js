(function ($) {
    //☆=================== var S ===================☆
    //国内：航线-国内潜在节省-潜在节省率-成交净价-张数-平均票价-平均折扣-商旅ADR-散客ADR-行业ADR
    //国际：合并航线-成交净价-张数-平均票价-商旅平均价-散客平均价-行业平均价
    var _flightRoutesInfo, //页面总数据
        _fltRouteInfo,
        timeout;   //
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //前十航线分析
    var routeAnysis = {
        selChecked: 0,
        init: function () {
            var _tenRouteSelID = $('#tenRouteSelID'),
            _tenRouteAsiID = $('#tenRouteAsiID'),
            _potSvDivID = $('#potSvDivID'),
            _routeDetID = $('#routeDetID'),
            _f = [];

            _tenRouteSelID.css('display', '');
            _tenRouteSelID.empty();

            //判断国内国际开关
            if (_cfgInfo.HasInAirTicketProduct == "T" && _cfgInfo.HasOutAirTicketProduct == "T") {
                _f.push('<label><input type="radio" name="option" value="0" checked>' + corpReport_FlightRoutes.js_Domestic + '</label>');
                _f.push('<label><input type="radio" name="option" value="1">' + corpReport_FlightRoutes.js_International + '</label>');
                _tenRouteSelID.append(_f.join(""));
                //
                routeAnysis.selChecked = 0;
                routeAnysis.drawBar(_tenRouteAsiID, _fltRouteInfo.DomRouteInfo);
                _tenRouteSelID.find('input').bind('change', routeAnysis.onSelectChange);
                //潜在节省
                routeAnysis.dwAirLineSv();
                //国内详细
                routeDetail.domDataDraw();
            } else if (_cfgInfo.HasInAirTicketProduct == "T" && _cfgInfo.HasOutAirTicketProduct == "F") {
                _f.push('<label><input type="radio" name="option" value="0" checked>' + corpReport_FlightRoutes.js_Domestic + '</label>');
                _tenRouteSelID.append(_f.join(""));
                //
                routeAnysis.selChecked = 0;
                routeAnysis.drawBar(_tenRouteAsiID, _fltRouteInfo.DomRouteInfo);
                //潜在节省
                routeAnysis.dwAirLineSv();
                //国内详细
                routeDetail.domDataDraw();
            } else if (_cfgInfo.HasInAirTicketProduct == "F" && _cfgInfo.HasOutAirTicketProduct == "T") {
                _f.push('<label><input type="radio" name="option" value="1" checked>' + corpReport_FlightRoutes.js_International + '</label>');
                _tenRouteSelID.append(_f.join(""));
                //
                routeAnysis.selChecked = 1;
                routeAnysis.drawBar(_tenRouteAsiID, _fltRouteInfo.IntRouteInfo);
                //潜在节省
                _potSvDivID.css('display', 'none');
                //国际详细
                routeDetail.intDataDraw();
            } else {
                _tenRouteSelID.css('display', 'none');
                _potSvDivID.css('display', 'none');
                _routeDetID.css('display', 'none');
            }

        },
        dwAirLineSv: function () {
            var _potSvDivID = $('#potSvDivID'),
            _potSvExID = $('#potSvExID');

            _potSvDivID.css('display', '');
            _potSvExID.css('display', 'none');

            //charge
            CM.ChargeFix(_potSvExID, "payment3.jpg", lanType);

            if (_cfgInfo.HasAirlineSave == "T") {
                potSv.init();
            } else {
                _potSvExID.css('display', '');
            }
        },
        drawBar: function (content, data) {
            var xData = [],
            yData = [];
            xData = routeAnysis.getXSeries(data);
            var _i = {};
            _i.data = routeAnysis.getYSeries(data);
            yData[0] = _i;
            //no data
            content.empty();
            if (_i.data.length > 0) {
                content.highcharts({
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: null
                    },
                    xAxis: {
                        categories: xData,
                        title: {
                            text: null
                        },
                        tickLength: 2
                    },
                    yAxis: {
                        title: {
                            text: null
                        },
                        gridLineWidth: 0,
                        labels: {
                            enabled: false
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.x + '</b><br/>' +
                            corpReport_FlightRoutes.js_ExpTickets + ': ' + this.y;
                        },
                        style: {
                            lineHeight: '18px'
                        }
                    },
                    plotOptions: {
                        bar: {
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
                            },
                            //minPointLength: 3,
                            borderRadius: 0.5,
                            pointWidth: 20
                        }
                    },
                    series: yData
                });
            } else {
                CM.LineHeightFix(content);
            }
        },
        getXSeries: function (data) {
            var _d = [],
            _length = data.length;
            //大于10条数据，说明有其他
            if (data.length > 10) {
                _length = 10;
            }

            for (var i = 0; i < _length; i++) {
                _d[i] = data[i].RouteName;
            }
            return _d;
        },
        getYSeries: function (data) {
            var _d = [],
            _length = data.length;

            //大于10条数据，说明有其他
            if (data.length > 10) {
                _length = 10;
            }

            for (var i = 0; i < _length; i++) {
                _d[i] = data[i].Number;
            }
            return _d;
        },
        onSelectChange: function () {
            var _tenRouteAsiID = $('#tenRouteAsiID'),
            _potSvDivID = $('#potSvDivID'),
            _potSvExID = $('#potSvExID');

            if ($(this).val() == "0") {
                //国内
                routeAnysis.selChecked = 0;
                routeAnysis.drawBar(_tenRouteAsiID, _fltRouteInfo.DomRouteInfo);
                //潜在节省显示
                _potSvDivID.css('display', '');
                _potSvExID.css('display', 'none');
                if (_cfgInfo.HasAirlineSave == "F") {
                    _potSvExID.css('display', '');
                }
                //国内详细
                routeDetail.domDataDraw();
            } else {
                //国际
                routeAnysis.selChecked = 1;
                routeAnysis.drawBar(_tenRouteAsiID, _fltRouteInfo.IntRouteInfo);
                //潜在节省
                _potSvDivID.css('display', 'none');
                //国际详细
                routeDetail.intDataDraw();
            }
        }
    };

    //潜在节省
    var potSv = {
        init: function () {
            var _potSvSelID = $('#potSvSelID');
            //默认选中潜在节省
            potSv.drawSv(0, _fltRouteInfo.DomRouteInfo);
            _potSvSelID.find('input').unbind('change');
            _potSvSelID.find('input').bind('change', potSv.onSelectChange);
        },
        drawSv: function (index, data) {
            var _potSvInfoID = $('#potSvInfoID'),
            _potSvNoDataID = $('#potSvNoDataID');

            potSv.clearSv();
            var _length = data.length;
            //大于10条数据，说明有其他
            if (data.length > 10) {
                _length = 10;
            }
            //no data
            if (_length > 0) {
                var _str = [],
                _c = "bar" + _length;
                _potSvNoDataID.css('display', 'none');
                for (var i = 0; i < _length; i++) {
                    if (index == 0) {
                        _str.push('<li class="' + _c + '"><span>' + corpReport_Common.js_RMBLogo.trim() + '</span>' + CM.fixData.transData(data[i].DomPotSv, 0) + '</li>')
                    } else {
                        _str.push('<li class="' + _c + '"><span></span>' + data[i].DomPotSvRate + '</li>')
                    }
                }
                _potSvInfoID.append(_str.join(""));
            } else {
                _potSvNoDataID.css('display', '');
            }
        },
        onSelectChange: function () {
            if ($(this).val() == '0') {
                potSv.drawSv(0, _fltRouteInfo.DomRouteInfo);
            } else {
                potSv.drawSv(1, _fltRouteInfo.DomRouteInfo);
            }
        },
        clearSv: function () {
            $('#potSvInfoID').empty();
        }
    };

    //详细航线分析
    var routeDetail = {
        init: function () {
            //
        },
        domDataDraw: function () {
            routeDetail.clearAll();
            routeDetail.drawHead(0);
            routeDetail.drawBody(0, _fltRouteInfo.DomRouteInfo);
            routeDetail.drawFoot(0, _fltRouteInfo.DomTotalInfo);
        },
        intDataDraw: function () {
            routeDetail.clearAll();
            routeDetail.drawHead(1);
            routeDetail.drawBody(1, _fltRouteInfo.IntRouteInfo);
            routeDetail.drawFoot(1, _fltRouteInfo.IntTotalInfo);
        },
        drawHead: function (index) {
            var _head = $('<table><thead id="headTableID"></thead></table>'),
                _width;
            $('#routeDetID').append(_head);
            //live on
            $('#headTableID').on('click', '[ckMark="1"]', routeDetail.onHeadClick);
            //
            var _str = ['<tr>'];
            if (index == 0) {
                _width = (_cfgInfo.HasIndustryData == "T") ? "10%" : "15%";
                _str.push('<th width="20%">' + corpReport_FlightRoutes.js_Itineraries + '</th>');
                _str.push('<th width="15%">' + corpReport_FlightRoutes.js_NetPrice + '</th>');
                _str.push('<th width="10%" class="sequence" ckMark="1" pInfo="Number">' + corpReport_FlightRoutes.js_Tickets + '<i class="icon i7"></i></th>');
                _str.push('<th width="15%">' + corpReport_FlightRoutes.js_AvgPrice + '</th>');
                _str.push('<th width="10%">' + corpReport_FlightRoutes.js_AvgDiscount + '</th>');
                _str.push('<th width=' + _width + '>' + corpReport_FlightRoutes.js_CorporateADR + '</th>');
                _str.push('<th width=' + _width + '>' + corpReport_FlightRoutes.js_LeisureADR + '</th>');
                if (_cfgInfo.HasIndustryData == "T") {
                    _str.push('<th width="10%">' + corpReport_FlightRoutes.js_IndustryADR + '</th>');
                }
            } else {
                _width = (_cfgInfo.HasIndustryData == "T") ? "13%" : "19%";
                _str.push('<th width="20%">' + corpReport_FlightRoutes.js_Itineraries + '</th>');
                _str.push('<th width="15%">' + corpReport_FlightRoutes.js_NetPrice + '</th>');
                _str.push('<th width="13%" class="sequence" ckMark="1" pInfo="Number">' + corpReport_FlightRoutes.js_Tickets + '<i class="icon i7"></i></th>');
                _str.push('<th width="13%">' + corpReport_FlightRoutes.js_AvgPrice + '</th>');
                _str.push('<th width=' + _width + '>' + corpReport_FlightRoutes.js_CorporateAvgPrice + '</th>');
                _str.push('<th width=' + _width + '>' + corpReport_FlightRoutes.js_LeisureAvgPrice + '</th>');
                if (_cfgInfo.HasIndustryData == "T") {
                    _str.push('<th width="13%">' + corpReport_FlightRoutes.js_IndustryAvgPrice + '</th>');
                }
            }
            _str.push('<th class="null_place"><div></div></th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (index, data) {
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>'),
            _width;
            $('#routeDetID').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //no data
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _str = ['<tr>'];
                    if (index == 0) {
                        _width = (_cfgInfo.HasIndustryData == "T") ? "10%" : "15%";
                        _str.push('<td width="20%" align="left">' + data[i].RouteName + '</td>');
                        _str.push('<td width="15%" align="right">' + CM.fixData.transData(data[i].NetPrice, 0) + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.transData(data[i].Number, 0) + '</td>');
                        _str.push('<td width="15%" align="right">' + CM.fixData.transData(data[i].AvgPrice, 0) + '</td>');
                        _str.push('<td width="10%">' + data[i].AvgDiscount + '</td>');
                        _str.push('<td width=' + _width + '>' + data[i].BusADR + '</td>');
                        _str.push('<td width=' + _width + '>' + data[i].TouADR + '</td>');
                        if (_cfgInfo.HasIndustryData == "T") {
                            _str.push('<td width="10%">' + data[i].IndADR + '</td>');
                        }
                    } else {
                        _width = (_cfgInfo.HasIndustryData == "T") ? "13%" : "19%";
                        _str.push('<td width="20%" align="left">' + data[i].RouteName + '</td>');
                        _str.push('<td width="15%" align="right">' + CM.fixData.transData(data[i].NetPrice, 0) + '</td>');
                        _str.push('<td width="13%">' + CM.fixData.transData(data[i].Number, 0) + '</td>');
                        _str.push('<td width="13%" align="right">' + CM.fixData.transData(data[i].AvgPrice, 0) + '</td>');
                        _str.push('<td width=' + _width + '>' + CM.fixData.transData(data[i].BusAvg, 0) + '</td>');
                        _str.push('<td width=' + _width + '>' + CM.fixData.transData(data[i].TouAvg, 0) + '</td>');
                        if (_cfgInfo.HasIndustryData == "T") {
                            _str.push('<td width="13%">' + CM.fixData.transData(data[i].IndAvg, 0) + '</td>');
                        }
                    }
                    _str.push('</tr>');
                    _bodyTableID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        },
        drawFoot: function (index, data) {
            var _foot = $('<table><tfoot id="footTableID"></tfoot></table>'),
            _width;
            $('#routeDetID').append(_foot);
            var _str = ['<tr>'];
            if (index == 0) {
                _width = (_cfgInfo.HasIndustryData == "T") ? "10%" : "15%";
                _str.push('<td width="20%" align="left">' + corpReport_FlightRoutes.js_Total + '</td>');
                _str.push('<td width="15%" align="right">' + CM.fixData.transData(data.TolNetPrice, 0) + '</td>');
                _str.push('<td width="10%">' + CM.fixData.transData(data.TolNumber, 0) + '</td>');
                _str.push('<td width="15%" align="right">' + CM.fixData.transData(data.TolAvgPrice, 0) + '</td>');
                _str.push('<td width="10%">' + data.TolAvgDiscount + '</td>');
                _str.push('<td width=' + _width + '>' + data.TolBusADR + '</td>');
                _str.push('<td width=' + _width + '>' + data.TolTouADR + '</td>');
                if (_cfgInfo.HasIndustryData == "T") {
                    _str.push('<td width="10%">' + data.TolIndADR + '</td>');
                }
            } else {
                _width = (_cfgInfo.HasIndustryData == "T") ? "13%" : "19%";
                _str.push('<td width="20%" align="left">' + corpReport_FlightRoutes.js_Total + '</td>');
                _str.push('<td width="15%" align="right">' + CM.fixData.transData(data.TolNetPrice, 0) + '</td>');
                _str.push('<td width="13%">' + CM.fixData.transData(data.TolNumber, 0) + '</td>');
                _str.push('<td width="13%" align="right">' + CM.fixData.transData(data.TolAvgPrice, 0) + '</td>');
                _str.push('<td width=' + _width + '>' + CM.fixData.transData(data.TolBusAvg, 0) + '</td>');
                _str.push('<td width=' + _width + '>' + CM.fixData.transData(data.TolTouAvg, 0) + '</td>');
                if (_cfgInfo.HasIndustryData == "T") {
                    _str.push('<td width="13%">' + CM.fixData.transData(data.TolIndAvg, 0) + '</td>');
                }
            }
            _str.push('<td class="null_place"><div></div></td></tr>');
            $('#footTableID').append(_str.join(""));
        },
        sortArray: function (content, type) {
            var data = (routeAnysis.selChecked == 0) ? _fltRouteInfo.DomRouteInfo : _fltRouteInfo.IntRouteInfo;
            if (data) {
                return data.sort(function (a, b) {
                    if (type == "Desc") {
                        //降序
                        return b[content.attr("pInfo")] - a[content.attr("pInfo")];
                    } else {
                        //升序
                        return a[content.attr("pInfo")] - b[content.attr("pInfo")];
                    }
                });
            }
        },
        onHeadClick: function (event) {
            var sortedData,
                content = $(this);
            if (content.hasClass("sequence")) {
                //从大大小和从小到大的切换
                if (content.find('.icon') && content.find('.icon').hasClass("i7")) {
                    content.find('.icon').removeClass('i7');
                    content.find('.icon').addClass('i6');
                    sortedData = routeDetail.sortArray(content, "Asc");
                } else {
                    content.find('.icon').removeClass('i6');
                    content.find('.icon').addClass('i7');
                    sortedData = routeDetail.sortArray(content, "Desc");
                }
            }

            //重新绘制body和footer
            routeDetail.clearBdFt();

            routeDetail.drawBody(routeAnysis.selChecked, sortedData);
            routeDetail.drawFoot(routeAnysis.selChecked, (routeAnysis.selChecked == 0) ? _fltRouteInfo.DomTotalInfo : _fltRouteInfo.IntTotalInfo);
        },
        clearBdFt: function () {
            //清除Body和footer
            $('#bodyTableID').parent().parent().remove();
            $('#footTableID').parent().remove();
        },
        clearAll: function () {
            $('#routeDetID').empty();
        }
    };

    //..
    var flightRoutesInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //
        $.ajax({
            url: '../Flight/GetFlightRoutes',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                _flightRoutesInfo = $.parseJSON(data);
                //初始赋值
                _fltRouteInfo = _flightRoutesInfo.FltRouteInfo;
                //初始化
                routeAnysis.init();
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
        flightRoutesInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..重新访问航线
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(1);
    Droco_Funs.getFlightsSubNav(5);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);