(function ($) {
    //☆=================== var S ===================☆
    var _filghtPageInfo, //页面总数据
        _flightStrInfo, //机票总金额和国内机票均价
        _flightConsumInfo, //机票消费
        _flightFivePartInfo, //前五个部门消费情况
        _flightFiveDesInfo, //前五个目的地消费情况
        _bkChangeInfo, //退改签情况
        _bkMethodInfo; //预定方式
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //机票消费
    var flightConsum = {
        _flDtInfo: [],
        init: function () {
            var _fltConExID = $('#fltConExID'),
            _fltConsumSelID = $('#fltConsumSelID'),
            _fltConsumID = $('#fltConsumID');

            //机票消费页面是否存在
            if (_cfgInfo.HasFltMonthlyExpense == "T") {
                _fltConExID.css('display', '');
                _fltConsumSelID.css('display', '');
                _fltConsumSelID.empty();
                //季度月度存在与否
                if (_cfgInfo.HasMonthlyData == "T" || _cfgInfo.HasQuarterData == "T") {
                    var _f = [];
                    if (_cfgInfo.HasMonthlyData == "F") {
                        //只有季度
                        _f.push('<label><input type="radio" name="option1" checked value="1">' + corpReport_FlightPage.js_Quarterly + '</label>');
                        //
                        flightConsum.getMonArgInfo(1);
                    } else {
                        _f.push('<label><input type="radio" name="option1" checked value="0">' + corpReport_FlightPage.js_Monthly + '</label>');
                        if (_cfgInfo.HasQuarterData == "T") {
                            //月、季
                            _f.push('<label><input type="radio" name="option1" value="1">' + corpReport_FlightPage.js_Quarterly + '</label>');
                        }
                        flightConsum.getMonArgInfo(0);
                    }
                    //add
                    _fltConsumSelID.append(_f.join(""));
                    //绘制
                    flightConsum.dwCol();
                    //事件绑定
                    if (_cfgInfo.HasMonthlyData == "T" && _cfgInfo.HasQuarterData == "T") {
                        _fltConsumSelID.find('input').bind('change', flightConsum.onSelectChange);
                    }
                } else {
                    _fltConsumSelID.css('display', 'none');
                    _fltConsumID.css('display', 'none');
                }
            } else {
                _fltConExID.css('display', 'none');
            }
        },
        getMonArgInfo: function (index) {
            //0表示月份，1表示季度
            flightConsum._flDtInfo = [];

            //国际机票是否存在
            if (_cfgInfo.HasOutAirTicketProduct == "T") {
                flightConsum._flDtInfo.push({
                    Name: corpReport_FlightPage.js_IntAirfare,
                    Data: (index == 0) ? _flightConsumInfo.InteFlight_Moth : _flightConsumInfo.InteFlight_Quar
                });
            }
            //国内机票是否存在
            if (_cfgInfo.HasInAirTicketProduct == "T") {
                flightConsum._flDtInfo.push({
                    Name: corpReport_FlightPage.js_DomAirfare,
                    Data: (index == 0) ? _flightConsumInfo.DomFlight_Moth : _flightConsumInfo.DomFlight_Quar
                });
            }
        },
        dwCol: function () {
            var _fltDEmpty = flightConsum.checkDataEmpty(flightConsum._flDtInfo),
            _fltConsumID = $('#fltConsumID');

            _fltConsumID.empty();
            //no data
            if (_fltDEmpty) {
                CM.LineHeightFix(_fltConsumID);
            } else {
                flightConsum.drawColumn(_fltConsumID, flightConsum._flDtInfo);
            }
        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Data.length > 0) { return false; }
            }
            return true;
        },
        drawColumn: function (content, dt) {
            var xData = flightConsum.getXSeries(dt[0].Data);
            //
            var yData = [];
            for (var i = 0; i < dt.length; i++) {
                yData[i] = flightConsum.getYSeries(dt[i].Data, dt[i].Name);
            }

            content.highcharts({
                chart: {
                    type: 'column',
                    marginBottom: 36
                },
                colors: ['#79b3ff', '#1c76ec'],
                title: {
                    text: null
                },
                xAxis: {
                    categories: xData,
                    tickInterval: (parseInt(xData.length / 10) + 1),
                    tickLength: 2
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    gridLineWidth: 0,
                    //min: 0,
                    labels: {
                        enabled: false
                    },
                    plotLines: [{
                        color: '#C0D0E0',
                        width: 1,
                        value: 0
                    }]
                },
                legend: {
                    y: 11,
                    floating: true,
                    borderWidth: 0,
                    shadow: false
                },
                tooltip: {
                    shared: true,
                    formatter: function () {
                        var _p = this.points,
                        _str = '<b>' + this.x + ' ' + corpReport_FlightPage.js_Expenses + '</b><br/>';
                        for (var i = 0; i < _p.length; i++) {
                            _str = _str + _p[i].series.name + ': ' + corpReport_Common.js_RMBLogo + CM.fixData.transData(_p[i].y, 0) + '<br/>';
                        }
                        return _str;
                    },
                    style: {
                        lineHeight: '18px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        borderWidth: 0,
                        //minPointLength: 3,
                        borderRadius: 0.5,  //设置柱状图的圆角，美观
                        pointWidth: 25
                    }
                },
                credits: {
                    enabled: false
                },
                series: yData
            });

        },
        getXSeries: function (data) {
            var _d = [];
            for (var i = 0; i < data.length; i++) {
                _d[i] = data[i].Month;
            }
            return _d;
        },
        getYSeries: function (data, name) {
            var _m = {},
            _d = [];
            _m.name = name;
            for (var i = 0; i < data.length; i++) {
                var _i = {};
                _i.y = data[i].MPrice;
                _i.totb = data[i].Totb;
                _i.huhb = data[i].Huhb;
                _d[i] = _i;
            }
            _m.data = _d;
            return _m;
        },
        onSelectChange: function () {
            if ($(this).val() == "1") {
                flightConsum.getMonArgInfo(1);
                flightConsum.dwCol();
            } else {
                flightConsum.getMonArgInfo(0);
                flightConsum.dwCol();
            }
        }
    };

    //前五部门和目的地
    var flightPartDesConsum = {
        _fltPartData: [],
        _fltDesData: [],
        init: function () {
            var _fltFivExID = $('#fltFivExID'),
            _fltFivePartSelID = $('#fltFivePartSelID'),
            _fltFiveDesSelID = $('#fltFiveDesSelID'),
            _fltFivePartConsum = $('#fltFivePartConsum');

            _fltFivePartSelID.css('display', '');
            _fltFivePartSelID.empty();
            _fltFiveDesSelID.css('display', '');
            _fltFiveDesSelID.empty();

            //前五部分消费开关
            if (_cfgInfo.HasFltTop5 == "F") {
                _fltFivePartSelID.css('display', 'none');
                //charge
                CM.ChargeFix(_fltFivePartConsum, "payment4.jpg", lanType);
            }
            //
            if (_cfgInfo.HasInAirTicketProduct == "T" || _cfgInfo.HasOutAirTicketProduct == "T") {
                var _dep = [],
                _des = [];
                if (_cfgInfo.HasInAirTicketProduct == "F") {
                    //国际
                    //前五部门
                    if (_cfgInfo.HasFltTop5 == "T") {
                        _dep.push('<label><input type="radio" name="option2" checked value="1">' + corpReport_FlightPage.js_International + '</label>');
                        flightPartDesConsum.getFivePartInfo(1);
                    }
                    //前五目的地
                    _des.push('<label><input type="radio" name="option3" checked value="1">' + corpReport_FlightPage.js_International + '</label>');
                    flightPartDesConsum.getFiveDesInfo(1);
                } else {
                    if (_cfgInfo.HasOutAirTicketProduct == "T") {
                        //国内国际
                        //前五部门
                        if (_cfgInfo.HasFltTop5 == "T") {
                            _dep.push('<label><input type="radio" name="option2" checked value="0">' + corpReport_FlightPage.js_All + '</label>');
                            _dep.push('<label><input type="radio" name="option2" value="2">' + corpReport_FlightPage.js_Domestic + '</label>');
                            _dep.push('<label><input type="radio" name="option2" value="1">' + corpReport_FlightPage.js_International + '</label>');
                            flightPartDesConsum.getFivePartInfo(0);
                        }
                        //前五目的地
                        _des.push('<label><input type="radio" name="option3" checked value="0">' + corpReport_FlightPage.js_All + '</label>');
                        _des.push('<label><input type="radio" name="option3" value="2">' + corpReport_FlightPage.js_Domestic + '</label>');
                        _des.push('<label><input type="radio" name="option3" value="1">' + corpReport_FlightPage.js_International + '</label>');
                        flightPartDesConsum.getFiveDesInfo(0);
                    } else {
                        //国内
                        //前五部门
                        if (_cfgInfo.HasFltTop5 == "T") {
                            _dep.push('<label><input type="radio" name="option2" checked value="2">' + corpReport_FlightPage.js_Domestic + '</label>');
                            flightPartDesConsum.getFivePartInfo(2);
                        }
                        //前五目的地
                        _des.push('<label><input type="radio" name="option3" checked value="2">' + corpReport_FlightPage.js_Domestic + '</label>');
                        flightPartDesConsum.getFiveDesInfo(2);
                    }
                }
                //添加-绘制-绑定
                if (_cfgInfo.HasFltTop5 == "T") {
                    _fltFivePartSelID.append(_dep.join(""));
                    flightPartDesConsum.dwFvPartPie();
                    if (_cfgInfo.HasInAirTicketProduct == "T" && _cfgInfo.HasOutAirTicketProduct == "T") {
                        _fltFivePartSelID.find('input').bind('change', flightPartDesConsum.onFivPtSelect);
                    }
                }
                _fltFiveDesSelID.append(_des.join(""));
                flightPartDesConsum.dwFvDesPie();
                if (_cfgInfo.HasInAirTicketProduct == "T" && _cfgInfo.HasOutAirTicketProduct == "T") {
                    _fltFiveDesSelID.find('input').bind('change', flightPartDesConsum.onFiveDeSelect);
                }
            } else {
                //国内国际均无
                _fltFivePartSelID.css('display', 'none');
                _fltFivExID.css('display', 'none');
                _fltFiveDesSelID.css('display', 'none');
            }
        },
        getFivePartInfo: function (index) {
            //0表示全部，1表示国际，2表示国内
            flightPartDesConsum._fltPartData = [];
            flightPartDesConsum._fltPartData.push({
                Name: "前五部门消费情况",
                Data: (index == 0) ? _flightFivePartInfo.AllConsume : ((index == 1) ? _flightFivePartInfo.InteConsume : _flightFivePartInfo.DomConsume)
            });
        },
        getFiveDesInfo: function (index) {
            //0表示全部，1表示国际，2表示国内
            flightPartDesConsum._fltDesData = [];
            flightPartDesConsum._fltDesData.push({
                Name: "前五目的地消费情况",
                Data: (index == 0) ? _flightFiveDesInfo.AllConsume : ((index == 1) ? _flightFiveDesInfo.InteConsume : _flightFiveDesInfo.DomConsume)
            });
        },
        dwFvPartPie: function () {
            var _fvPartEmpty = flightPartDesConsum.checkDataEmpty(flightPartDesConsum._fltPartData),
            _fltFivePartConsum = $('#fltFivePartConsum');

            _fltFivePartConsum.empty();
            //nodata
            if (_fvPartEmpty) {
                CM.LineHeightFix(_fltFivePartConsum);
            } else {
                flightPartDesConsum.drawPieChart(_fltFivePartConsum, flightPartDesConsum._fltPartData, true);
            }
        },
        dwFvDesPie: function () {
            var _fvDesEmpty = flightPartDesConsum.checkDataEmpty(flightPartDesConsum._fltDesData),
            _fltFiveDesConsum = $('#fltFiveDesConsum');

            _fltFiveDesConsum.empty();
            //nodata
            if (_fvDesEmpty) {
                CM.LineHeightFix(_fltFiveDesConsum);
            } else {
                flightPartDesConsum.drawPieChart(_fltFiveDesConsum, flightPartDesConsum._fltDesData, true);
            }
        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Data.length > 0) { return false; }
            }
            return true;
        },
        drawPieChart: function (content, dt, _isSpe) {
            //_isSpe 用于解决文本太长特制
            var data = [],
            _d = {};
            _d.type = "pie";
            _d.name = corpReport_FlightPage.js_TotalExpenses;
            _d.data = flightPartDesConsum.getData(dt[0].Data);
            data[0] = _d;

            content.highcharts({
                colors: ['#668fe5', '#7fdaff', '#93e893', '#ffe78d', '#ffacac', '#ff85b0'],
                title: {
                    text: null
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        borderWidth: 0,
                        showInLegend: true,
                        size: '70%',
                        center: ['50%', '30%'],
                        dataLabels: {
                            enabled: (!_isSpe),
                            distance: 5,
                            connectorWidth: 0,
                            formatter: function () {
                                return this.point.name + ': ' + this.percentage.toFixed(1) + '%';
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.point.name + '</b><br/>' +
                            corpReport_FlightPage.js_TotalExpenses + ': ' + corpReport_Common.js_RMBLogo + CM.fixData.transData(this.point.y, 0) + '<br/>' +
                            corpReport_FlightPage.js_Percent + ': ' + this.percentage.toFixed(1) + '%';
                    }
                },
                legend: {
                    floating: true,
                    borderWidth: 0,
                    shadow: false,
                    x: 0,
                    y: 14,
                    align: 'left',
                    verticalAlign: 'bottom',
                    layout: 'vertical',
                    labelFormatter: function () {
                        if (_isSpe) {
                            return this.name + ' ' + this.percentage.toFixed(1) + '%';
                        } else {
                            return this.name;
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                series: data
            });
        },
        getData: function (data) {
            var _d = [];
            for (var i = 0; i < data.length; i++) {
                var _s = {};
                _s.name = data[i].Name;
                _s.y = data[i].MPrice;
                _d[i] = _s;
            }
            return _d;
        },
        onFivPtSelect: function () {
            if ($(this).val() == "0") {
                flightPartDesConsum.getFivePartInfo(0);
            } else if ($(this).val() == "1") {
                flightPartDesConsum.getFivePartInfo(1);
            } else {
                flightPartDesConsum.getFivePartInfo(2);
            }
            flightPartDesConsum.dwFvPartPie();
        },
        onFiveDeSelect: function () {
            if ($(this).val() == "0") {
                flightPartDesConsum.getFiveDesInfo(0);
            } else if ($(this).val() == "1") {
                flightPartDesConsum.getFiveDesInfo(1);
            } else {
                flightPartDesConsum.getFiveDesInfo(2);
            }
            flightPartDesConsum.dwFvDesPie();
        }
    };

    //退改签
    var backChange = {
        _bkChgData: [],
        init: function () {
            var _bkPerSelID = $('#bkPerSelID'),
            _bkPerSpan = $('#bkPerSpan'),
            _bkTypeSpan = $('#bkTypeSpan'),
            _bkChangeType = $('#bkChangeType'),
            _bkChangePeriod = $('#bkChangePeriod'),
            _bkChangeChartID = $('#bkChangeChartID');

            if (_cfgInfo.HasFltBack == "T") {
                //是否存在退改签模块
                _bkChangeType.css('display', '');
                _bkChangePeriod.css('display', '');
                _bkChangeChartID.css('display', '');
                _bkPerSelID.empty();

                //月度季度存在
                if (_cfgInfo.HasMonthlyData == "T" || _cfgInfo.HasQuarterData == "T") {
                    var _f = [];
                    if (_cfgInfo.HasMonthlyData == "F") {
                        //只有季度
                        _bkPerSpan.html(corpReport_FlightPage.js_Quarterly + '<i class="icon i5"></i>');
                        _bkPerSpan.attr('mark', "1");
                        _f.push('<ul><li><a href="javascript:;" mark="1">' + corpReport_FlightPage.js_Quarterly + '</a></li></ul>');
                        backChange.drawColumnChart("column", _bkChangeChartID, _bkChangeInfo.Change_Quar, corpReport_FlightPage.js_TicketChangeFee, _bkChangeInfo.BkChange_Quar, corpReport_FlightPage.js_TicketRefundFee);
                    } else {
                        _bkPerSpan.html(corpReport_FlightPage.js_Monthly + '<i class="icon i5"></i>');
                        _bkPerSpan.attr('mark', "0");
                        _f.push('<ul><li><a href="javascript:;" mark="0">' + corpReport_FlightPage.js_Monthly + '</a></li>');
                        if (_cfgInfo.HasQuarterData == "T") {
                            //月、季
                            _f.push('<li><a href="javascript:;" mark="1">' + corpReport_FlightPage.js_Quarterly + '</a></li>');
                        }
                        _f.push('</ul>');
                        backChange.drawColumnChart("column", _bkChangeChartID, _bkChangeInfo.Change_Month, corpReport_FlightPage.js_TicketChangeFee, _bkChangeInfo.BkChange_Moth, corpReport_FlightPage.js_TicketRefundFee);
                    }
                    _bkPerSelID.append(_f.join(""));
                } else {
                    //月和季度都不存在
                    _bkChangePeriod.css('display', 'none');
                }

                //下拉条件绑定
                _bkTypeSpan.unbind('click');
                _bkTypeSpan.bind('click', backChange.showDropDown);
                _bkPerSpan.unbind('click');
                _bkPerSpan.bind('click', backChange.showDropDown);
                //
                _bkChangeType.find('li').unbind('click');
                _bkChangeType.find('li').bind('click', backChange.onDataClick);
                _bkChangePeriod.find('li').unbind('click');
                _bkChangePeriod.find('li').bind('click', backChange.onDataClick);
            } else {
                _bkChangeType.css('display', 'none');
                _bkChangePeriod.css('display', 'none');
                //charge
                CM.ChargeFix(_bkChangeChartID, "payment5.jpg", lanType);
            }
        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].data.length > 0) { return false; }
            }
            return true;
        },
        drawColumnChart: function (tp, content, a, n1, b, n2) {
            var xData = backChange.getXSeries(a);
            var yData = [];
            if (tp == "column") {
                yData[0] = backChange.getYColumn(a, n1);
                yData[1] = backChange.getYColumn(b, n2);
            } else {
                yData[0] = backChange.getYLine(a, n1);
                yData[1] = backChange.getYLine(b, n2);
            }
            //判断nodata的情况
            var _dtEmpty = backChange.checkDataEmpty(yData);
            content.empty();
            if (_dtEmpty) {
                CM.LineHeightFix(content);
            } else {
                content.highcharts({
                    chart: {
                        type: tp,
                        marginBottom: 36
                    },
                    colors: ['#79b3ff', '#1c76ec'],
                    title: {
                        text: null
                    },
                    xAxis: {
                        categories: xData,
                        tickInterval: (parseInt(xData.length / 10) + 1),
                        tickLength: 2
                    },
                    yAxis: {
                        title: {
                            text: null
                        },
                        gridLineWidth: 0,
                        min: 0,
                        labels: {
                            enabled: false
                        }
                    },
                    legend: {
                        //align: 'left',
                        //verticalAlign: 'top',
                        //layout: 'vertical',
                        floating: true,
                        borderWidth: 0,
                        shadow: false,
                        y: 11
                    },
                    tooltip: {
                        shared: true,
                        formatter: function () {
                            var _p = this.points,
                        _str = '<b>' + this.x + '</b><br/>';
                            for (var i = 0; i < _p.length; i++) {
                                if (tp == "column") {
                                    _str = _str + _p[i].series.name + ': ' + corpReport_Common.js_RMBLogo + CM.fixData.transData(_p[i].y, 0) + '<br/>';
                                } else {
                                    _str = _str + _p[i].series.name + ': ' + (_p[i].y * 100).toFixed(1) + '%<br/>';
                                }
                            }
                            return _str;
                        },
                        style: {
                            lineHeight: '18px'
                        }
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            borderWidth: 0,
                            //minPointLength: 3,
                            borderRadius: 0.5,
                            pointWidth: 25
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: yData
                });
            }

        },
        getXSeries: function (data) {
            var _d = [];
            for (var i = 0; i < data.length; i++) {
                _d[i] = data[i].Month;
            }
            return _d;
        },
        getYColumn: function (data, name) {
            var _m = {},
            _d = [];
            _m.name = name;
            for (var i = 0; i < data.length; i++) {
                var _i = {};
                _i.y = data[i].MPrice;
                _d[i] = _i;
            }
            _m.data = _d;
            return _m;
        },
        getYLine: function (data, name) {
            var _m = {},
            _d = [];
            _m.name = name;
            for (var i = 0; i < data.length; i++) {
                var _i = {};
                _i.y = data[i].Percent;
                _d[i] = _i;
            }
            _m.data = _d;
            return _m;
        },
        getCondition: function () {
            var bkChaCon = {};
            bkChaCon.type = $('#bkChangeType').find('span').attr('mark');
            bkChaCon.period = $('#bkChangePeriod').find('span').attr('mark');
            return bkChaCon;
        },
        onDataClick: function () {
            var tar = $(this).parents('.filter_option').first().find('span');
            tar.html($(this).text() + '<i class="icon i5"></i>');
            tar.attr('mark', $(this).find('a').attr('mark'));
            backChange.hideDropDown(tar);
            //触发对外开放函数
            backChange.onDataChange(backChange.getCondition());
        },
        onDataChange: function (_o) {
            //0和1表示选择的选项
            if (_o.type == '0' && _o.period == '0') {
                //月，退改费
                backChange.drawColumnChart("column", $('#bkChangeChartID'), _bkChangeInfo.Change_Month, corpReport_FlightPage.js_TicketChangeFee, _bkChangeInfo.BkChange_Moth, corpReport_FlightPage.js_TicketRefundFee);
            } else if (_o.type == '0' && _o.period == '1') {
                //季，退改费
                backChange.drawColumnChart("column", $('#bkChangeChartID'), _bkChangeInfo.Change_Quar, corpReport_FlightPage.js_TicketChangeFee, _bkChangeInfo.BkChange_Quar, corpReport_FlightPage.js_TicketRefundFee);
            } else if (_o.type == '1' && _o.period == '0') {
                //月，退改率
                backChange.drawColumnChart("line", $('#bkChangeChartID'), _bkChangeInfo.Change_Month, corpReport_FlightPage.js_TicketChangeRate, _bkChangeInfo.BkChange_Moth, corpReport_FlightPage.js_TicketRefundRate);
            } else {
                //季，退改率
                backChange.drawColumnChart("line", $('#bkChangeChartID'), _bkChangeInfo.Change_Quar, corpReport_FlightPage.js_TicketChangeRate, _bkChangeInfo.BkChange_Quar, corpReport_FlightPage.js_TicketRefundRate);
            }
        },
        showDropDown: function (event) {
            event.preventDefault();
            event.stopPropagation();
            if ($(this).hasClass('click_on')) {
                $(this).next().css('display', 'none');
                $(this).removeClass('click_on');
            } else {
                $(this).next().css('display', '');
                $(this).addClass('click_on');
            }
        },
        hideDropDown: function (content) {
            $(this).next().css('display', 'none');
            content.removeClass('click_on');
        }
    };

    //预定方式
    var bookMethod = {
        _bkMethData: [],
        init: function () {
            bookMethod.getBkMethInfo();
            bookMethod.dwMthCol();
        },
        getBkMethInfo: function () {
            bookMethod._bkMethData = [];

            //是否有国际机票
            if (_cfgInfo.HasOutAirTicketProduct == "T") {
                bookMethod._bkMethData.push({
                    Name: corpReport_FlightPage.js_IntAirfare,
                    Data: _bkMethodInfo.InteOrders
                });
            }
            //是否有国内机票
            if (_cfgInfo.HasInAirTicketProduct == "T") {
                bookMethod._bkMethData.push({
                    Name: corpReport_FlightPage.js_DomAirfare,
                    Data: _bkMethodInfo.DomOrders
                });
            }
        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Data.length > 0) { return false; }
            }
            return true;
        },
        dwMthCol: function () {
            var _bkMethodID = $('#bkMethodID'),
            _colEmpty = bookMethod.checkDataEmpty(bookMethod._bkMethData);
            //英文版保证对称
            if (lanType && lanType == "en") { _bkMethodID.css("margin-top", "58px"); }

            //no data
            if (_colEmpty) {
                CM.LineHeightFix(_bkMethodID);
            } else {
                bookMethod.drawColumn(_bkMethodID, bookMethod._bkMethData);
            }
        },
        drawColumn: function (content, dt) {
            var xData = bookMethod.getXSeries(dt[0].Data);
            //
            var yData = [];
            for (var i = 0; i < dt.length; i++) {
                yData[i] = bookMethod.getYSeries(dt[i].Data, dt[i].Name);
            }

            content.highcharts({
                chart: {
                    type: 'column',
                    marginBottom: 36
                },
                colors: ['#79b3ff', '#1c76ec'],
                title: {
                    text: corpReport_FlightPage.js_NumberofBookings,
                    style: {
                        fontSize: '14px'
                    },
                    floating: true
                },
                xAxis: {
                    categories: xData,
                    tickInterval: (parseInt(xData.length / 10) + 1),
                    tickLength: 2
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    gridLineWidth: 0,
                    min: 0,
                    labels: {
                        enabled: false
                    }
                },
                legend: {
                    //align: 'right',
                    //verticalAlign: 'top',
                    //layout: 'vertical',
                    floating: true,
                    borderWidth: 0,
                    shadow: false,
                    y: 11
                },
                tooltip: {
                    shared: true,
                    formatter: function () {
                        var _p = this.points,
                        _str = '<b>' + this.x + '</b><br/>';
                        for (var i = 0; i < _p.length; i++) {
                            _str = _str + _p[i].series.name + ': ' + CM.fixData.transData(_p[i].y, 0) + '<br/>';
                        }
                        return _str;
                    },
                    style: {
                        lineHeight: '18px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        borderWidth: 0,
                        //minPointLength: 3,
                        borderRadius: 0.5,
                        pointWidth: 32
                    }
                },
                credits: {
                    enabled: false
                },
                series: yData
            });
        },
        getXSeries: function (data) {
            var _d = [];
            for (var i = 0; i < data.length; i++) {
                _d[i] = data[i].Name;
            }
            return _d;
        },
        getYSeries: function (data, name) {
            var _m = {},
            _d = [];
            _m.name = name;
            for (var i = 0; i < data.length; i++) {
                var _i = {};
                _i.y = data[i].Number;
                _d[i] = _i;
            }
            _m.data = _d;
            return _m;
        }
    };

    //固定数据的初始化
    var pageData = {
        init: function () {
            //初始化页面的静止数据
            $('#fltConsumPID').html('<em>' + corpReport_Common.js_RMBLogo + '</em>' + CM.fixData.transData(_flightStrInfo.AllConsume, 0));
            $('#fltAvgPID').html('<em>' + corpReport_Common.js_RMBLogo + '</em>' + CM.fixData.transData(_flightStrInfo.AvgPrice, 0));
        }
    };

    //
    var flightPageInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //
        $.ajax({
            url: '../Flight/GetFlightPage',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                //初始赋值
                _filghtPageInfo = $.parseJSON(data);
                //初始赋值
                _flightStrInfo = _filghtPageInfo.Flight;
                _flightConsumInfo = _filghtPageInfo.FlightConsumInfo;
                _flightFivePartInfo = _filghtPageInfo.FlightFivePartInfo;
                _flightFiveDesInfo = _filghtPageInfo.FlightFiveDesInfo;
                _bkChangeInfo = _filghtPageInfo.BkChangeInfo;
                _bkMethodInfo = _filghtPageInfo.BkMethodInfo;
                //初始化
                pageData.init();
                flightConsum.init();
                flightPartDesConsum.init();
                backChange.init();
                bookMethod.init();
            },
            error: function () {
                noDataID.unmask();
                CM && CM.goError();
            }
        });
    }

    //☆=================== Fun E ===================☆

    dpHeaderSuccess = function () {
        //初始的头部数据
        CM.hrefChange($('#menu').find('a'), _headSelectInfo);
        CM.hrefChange($('#fliSubNavID').find('a'), _headSelectInfo);
        flightPageInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..重新访问机票
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(1);
    Droco_Funs.getFlightsSubNav(0);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);