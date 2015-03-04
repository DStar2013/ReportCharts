(function ($) {
    //☆=================== var S ===================☆
    var _sumPageInfo,  //页面总数据
        _inSumInfo, //协议酒店月，会员酒店月，国内机票月，国际机票月，季度
        _fivePartConInfo, //前五个部门消费情况
        _fiveDesConInfo, //前五个目的地消费情况
        _flightInfo, //机票
        _hotelInfo;  //酒店
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //总体消费，按月
    var allConsum = {
        _allConsumData: [],
        _consumBarData: [],
        init: function () {
            var _allConsumSelID = $('#allConsumSelID'),
            _allConsumMID = $('#allConsumMID'),
            _allConsumSID = $('#allConsumSID');

            _allConsumSelID.empty();
            _allConsumSelID.css('display', '');
            //' + corpReport_SumPage.js_monthly + ',' + corpReport_SumPage.js_quarterly + '是否存在
            if (_cfgInfo.HasMonthlyData == "T" || _cfgInfo.HasQuarterData == "T") {
                var _s = [];
                if (_cfgInfo.HasMonthlyData == "F") {
                    //只有' + corpReport_SumPage.js_quarterly + '
                    _s.push('<label><input type="radio" name="option1" checked="checked" value="1"/>' + corpReport_SumPage.js_Quarterly + '</label>');
                    //
                    allConsum.getMonArgInfo(1);
                } else {
                    _s.push('<label><input type="radio" name="option1" checked="checked" value="0"/>' + corpReport_SumPage.js_Monthly + '</label>');
                    if (_cfgInfo.HasQuarterData == "T") {
                        //' + corpReport_SumPage.js_monthly + '和' + corpReport_SumPage.js_quarterly + '
                        _s.push('<label><input type="radio" name="option1" value="1"/>' + corpReport_SumPage.js_Quarterly + '</label>');
                    }
                    //
                    allConsum.getMonArgInfo(0);
                }
                //添加
                _allConsumSelID.append(_s.join(""));
                allConsum.dwCol();
                allConsum.dwBar();
                //..绑定事件
                if (_cfgInfo.HasMonthlyData == "T" && _cfgInfo.HasQuarterData == "T") {
                    _allConsumSelID.find('input').bind('change', allConsum.onSelectChange);
                }
            } else {
                //' + corpReport_SumPage.js_monthly + '' + corpReport_SumPage.js_quarterly + '都不存在
                _allConsumSelID.css('display', 'none');
                _allConsumMID.css('display', 'none');
                _allConsumSID.css('display', 'none');
            }
        },
        dwCol: function () {
            var _allConsumMID = $('#allConsumMID'),
            _colDataEmpty = allConsum.checkDataEmpty(allConsum._allConsumData);

            _allConsumMID.empty();
            //nodata
            if (_colDataEmpty) {
                CM.LineHeightFix(_allConsumMID);
            } else {
                allConsum.drawColumn(_allConsumMID, allConsum._allConsumData);
            }
        },
        barDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Data > 0) { return false; }
            }
            return true;
        },
        dwBar: function () {
            var _allConsumSID = $('#allConsumSID'),
            _barDtEmpty = allConsum.barDataEmpty(allConsum._consumBarData);
            //nodata
            _allConsumSID.empty();
            if (_barDtEmpty) {
                CM.LineHeightFix(_allConsumSID);
            } else {
                allConsum.drawBar(_allConsumSID, allConsum._consumBarData);
            }
        },
        checkDataEmpty: function (dt) {
            var _empty = true;
            for (var i = 0; i < dt.length; i++) {
                var _iData = dt[i].Data;
                for (var j = 0; j < _iData.length; j++) {
                    if (_iData[j].MPrice != 0) { return false; }
                }
            }
            return _empty;
        },
        getMonArgInfo: function (index) {
            //0为' + corpReport_SumPage.js_monthly + '数据，1为' + corpReport_SumPage.js_quarterly + '数据
            allConsum._allConsumData = [];
            allConsum._consumBarData = [];

            //火车票数据新增
            allConsum._allConsumData.push({
                Name: corpReport_SumPage.js_Train,
                Data: (index == 0) ? _inSumInfo.Train_moth : _inSumInfo.Train_quar,
                Color: '#00cd9f'
            });
            allConsum._consumBarData.push({
                Name: corpReport_SumPage.js_Train,
                Data: _inSumInfo.TrainPrice,
                Color: '#00cd9f'
            });
            //' + corpReport_SumPage.js_CorporateHotel + '是否存在
            if (_cfgInfo.HasAgrHotelProduct == "T") {
                allConsum._allConsumData.push({
                    Name: corpReport_SumPage.js_CorporateHotel,
                    Data: (index == 0) ? _inSumInfo.ArgHotel_Moth : _inSumInfo.ArgHotel_Quar,
                    Color: '#feda85'
                });
                //
                allConsum._consumBarData.push({
                    Name: corpReport_SumPage.js_CorporateHotel,
                    Data: _inSumInfo.ArgHotelPrice,
                    Color: '#feda85'
                });
            }
            //' + corpReport_SumPage.js_MemberHotel + '是否存在
            if (_cfgInfo.HasMemHotelProduct == "T") {
                allConsum._allConsumData.push({
                    Name: corpReport_SumPage.js_MemberHotel,
                    Data: (index == 0) ? _inSumInfo.MemHotel_Moth : _inSumInfo.MemHotel_Quar,
                    Color: '#ffa60c'
                });
                //
                allConsum._consumBarData.push({
                    Name: corpReport_SumPage.js_MemberHotel,
                    Data: _inSumInfo.MemHotelPrice,
                    Color: '#ffa60c'
                });
            }
            //' + corpReport_SumPage.js_InAirfare + '是否存在
            if (_cfgInfo.HasOutAirTicketProduct == "T") {
                allConsum._allConsumData.push({
                    Name: corpReport_SumPage.js_InAirfare,
                    Data: (index == 0) ? _inSumInfo.InteFlight_Moth : _inSumInfo.InteFlight_Quar,
                    Color: '#79b3ff'
                });
                //
                allConsum._consumBarData.push({
                    Name: corpReport_SumPage.js_InAirfare,
                    Data: _inSumInfo.InterFlightPrice,
                    Color: '#79b3ff'
                });
            }
            //' + corpReport_SumPage.js_DoAirfare + '是否存在
            if (_cfgInfo.HasInAirTicketProduct == "T") {
                allConsum._allConsumData.push({
                    Name: corpReport_SumPage.js_DoAirfare,
                    Data: (index == 0) ? _inSumInfo.DomFlight_Moth : _inSumInfo.DomFlight_Quar,
                    Color: '#1c76ec'
                });
                //
                allConsum._consumBarData.push({
                    Name: corpReport_SumPage.js_DoAirfare,
                    Data: _inSumInfo.DomFlightPrice,
                    Color: '#1c76ec'
                });
            }
        },
        drawColumn: function (content, dt) {
            var xData = allConsum.getXSeries(dt[0].Data);
            //
            var yData = [];
            for (var i = 0; i < dt.length; i++) {
                yData[i] = allConsum.getYSeries(dt[i].Data, dt[i].Name, dt[i].Color);
            }

            //绘制图形
            content.highcharts({
                chart: {
                    type: 'column',
                    marginBottom: 48
                },
                //colors: ['#feda85', '#ffa60c', '#79b3ff', '#1c76ec'],
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
                    x: 0,
                    floating: true,
                    borderWidth: 0,
                    shadow: false
                },
                tooltip: {
                    borderWidth: 1,
                    shadow: false,
                    formatter: function () {
                        return '<b>' + this.x + ' ' + this.series.name + ' ' + corpReport_SumPage.js_Expense + '</b><br/>' +
                            corpReport_SumPage.js_Amount + ': ' + corpReport_Common.js_RMBLogo + CM.fixData.transData(this.y, 0) + '<br/>' +
                            corpReport_SumPage.js_YearoverYear + ': ' + this.point.totb + '<br/>' +
                            corpReport_SumPage.js_MonthoverMonth + ': ' + this.point.huhb + '<br/>';
                    },
                    style: {
                        //fontSize: '8px',
                        lineHeight: '18px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        borderWidth: 0,
                        minPointLength: 3,
                        borderRadius: 0.5,  //设置柱状图的圆角，美观 
                        pointWidth: 25
                        //groupPadding: 3 
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
        getYSeries: function (data, name, color) {
            var _m = {},
            _d = [];
            _m.name = name;
            _m.color = color;
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
        drawBar: function (content, dt) {
            var xData = [],
            yData = [],
            _iData = [],
            _maxY = 0;

            for (var i = 0; i < dt.length; i++) {
                xData[i] = dt[i].Name;
                _iData.push({
                    y: dt[i].Data,
                    color: dt[i].Color
                });
                //取出最大的y
                if (dt[i].Data > _maxY) { _maxY = dt[i].Data; }
            }
            //maxY
            _maxY = parseInt(_maxY * 1.2);
            //
            yData.push({ data: _iData });

            content.highcharts({
                chart: {
                    type: 'bar'
                },
                //colors: ['#feda85', '#ffa60c', '#79b3ff', '#1c76ec'],
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
                    },
                    plotLines: [{
                        color: '#C0D0E0',
                        width: 1,
                        value: 0
                    }],
                    max: _maxY
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            corpReport_SumPage.js_TotalExpenses + ': <b>' + corpReport_Common.js_RMBLogo + '</b>' + CM.fixData.transData(this.y, 0);
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
                                return '<b>' + corpReport_Common.js_RMBLogo + '</b> ' + CM.fixData.transData(this.y, 0);
                            },
                            crop: false,
                            overflow: "none",
                            style: {
                                color: '#666'
                            }
                        },
                        //minPointLength: 3,
                        borderRadius: 0.5,
                        pointWidth: 25
                    },
                    series: {
                        borderWidth: 0,
                        colorByPoint: true
                    }
                },
                series: yData
            });
        },
        getCalData: function (data) {
            var _d = 0;
            for (var i = 0; i < data.length; i++) {
                _d += data[i].MPrice;
            }
            return _d;
        },
        onSelectChange: function () {
            if ($(this).val() == "1") {
                allConsum.getMonArgInfo(1);
            } else {
                allConsum.getMonArgInfo(0);
            }
            allConsum.dwCol();
        }
    };

    //前五个部门消费和前五目的地消费
    var fiveDepDesConsum = {
        init: function () {
            var _fivDepartConID = $('#fivDepartConID'),
            _fivDesConID = $('#fivDesConID');

            _fivDepartConID.css('display', '');
            _fivDepartConID.empty();
            _fivDesConID.empty();

            //前五部门是否存在
            if (_cfgInfo.HasTotalTop5 == 'T') {
                //判断是否存在数据，有数据才进行绘制
                if (_fivePartConInfo.FivePartConsumption.length > 0) {
                    fiveDepDesConsum.drawPiePic(_fivDepartConID, _fivePartConInfo.FivePartConsumption, true);
                } else {
                    CM.LineHeightFix(_fivDepartConID);
                }
            } else {
                //charge
                CM.ChargeFix(_fivDepartConID, "payment15.jpg", lanType);
            }
            //前5目的地
            //是否有数据
            if (_fiveDesConInfo.FiveDesConsumption.length > 0) {
                fiveDepDesConsum.drawPiePic(_fivDesConID, _fiveDesConInfo.FiveDesConsumption, true);
            } else {
                CM.LineHeightFix(_fivDesConID);
            }
        },
        drawPiePic: function (content, dt, _isSpe) {
            //_isSpe 用于解决文本太长特制
            var data = [],
            _d = {};
            _d.type = "pie";
            _d.name = corpReport_SumPage.js_TotalExpenses;
            _d.data = fiveDepDesConsum.getData(dt);
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
                        center: ['50%', '32%'],
                        dataLabels: {
                            enabled: (!_isSpe),
                            distance: 5,
                            connectorWidth: 0,
                            formatter: function () {
                                if (this.percentage > 0) {
                                    return this.point.name + ': ' + this.percentage.toFixed(1) + '%';
                                }
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        if (this.percentage > 0) {
                            return '<b>' + this.point.name + '</b><br/>' +
                            corpReport_SumPage.js_TotalExpenses + ':  ' + corpReport_Common.js_RMBLogo + CM.fixData.transData(this.point.y, 0) + '<br/>' +
                            corpReport_SumPage.js_Percent + ': ' + this.percentage.toFixed(1) + '%'
                        }
                    },
                    style: {
                        lineHeight: '18px'
                    }
                },
                legend: {
                    floating: true,
                    borderWidth: 0,
                    shadow: false,
                    y: 14,
                    x: 0,
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
        }
    };

    //机票酒店模块
    var all_flight_hotel = {
        _fltDtInfo: [],
        _htlDtInfo: [],
        init: function () {
            //
            var _allFlightSelID = $('#allFlightSelID'),
            _allHotelSelID = $('#allHotelSelID'),
            _beBokID = $('#beBokID'),
            _htStarID = $('#htStarID'),
            _fltConsumID = $('#fltConsumID'),
            _hotelConsumID = $('#hotelConsumID');

            _allFlightSelID.empty();
            _allFlightSelID.css('display', '');
            _allHotelSelID.empty();
            _allHotelSelID.css('display', '');

            //' + corpReport_SumPage.js_monthly + '' + corpReport_SumPage.js_quarterly + '是否存在
            if (_cfgInfo.HasMonthlyData == "T" || _cfgInfo.HasQuarterData == "T") {
                var _f = [],
                _h = [];
                //
                if (_cfgInfo.HasMonthlyData == "F") {
                    //只有' + corpReport_SumPage.js_quarterly + '
                    //机票
                    _f.push('<label><input type="radio" name="option2" checked="checked" value="1"/>' + corpReport_SumPage.js_Quarterly + '</label>');
                    all_flight_hotel.getFltDtInfo(1);
                    //酒店
                    _h.push('<label><input type="radio" name="option3" checked="checked" value="1"/>' + corpReport_SumPage.js_Quarterly + '</label>');
                    all_flight_hotel.getHtlDtInfo(1);
                } else {
                    _f.push('<label><input type="radio" name="option2" checked="checked" value="0"/>' + corpReport_SumPage.js_Monthly + '</label>');
                    _h.push('<label><input type="radio" name="option3" checked="checked" value="0"/>' + corpReport_SumPage.js_Monthly + '</label>');
                    if (_cfgInfo.HasQuarterData == "T") {
                        //月、季都有
                        _f.push('<label><input type="radio" name="option2" value="1"/>' + corpReport_SumPage.js_Quarterly + '</label>');
                        _h.push('<label><input type="radio" name="option3" value="1"/>' + corpReport_SumPage.js_Quarterly + '</label>');
                    }
                    //
                    all_flight_hotel.getFltDtInfo(0);
                    all_flight_hotel.getHtlDtInfo(0);
                }
                //add
                _allFlightSelID.append(_f.join(""));
                _allHotelSelID.append(_h.join(""));
                //绘制
                all_flight_hotel.dwFltColum();
                all_flight_hotel.dwHtlColum();
                //事件
                if (_cfgInfo.HasMonthlyData == "T" && _cfgInfo.HasQuarterData == "T") {
                    _allFlightSelID.find('input').bind('change', all_flight_hotel.onFltSelectChange);
                    _allHotelSelID.find('input').bind('change', all_flight_hotel.onHtlSelectChange);
                }
            } else {
                //月、季都不存在
                //机票
                _allFlightSelID.css('display', 'none');
                _fltConsumID.css('display', 'none');
                //酒店
                _allHotelSelID.css('display', 'none');
                _hotelConsumID.css('display', 'none');
            }
            //机票提前预定天数
            var _f = _flightInfo;
            _beBokID.empty();
            for (var i = 0; i < _f.BeforeDiscount.length; i++) {
                var _p = '<p>' + _f.BeforeDiscount[i].Day + '<span>' + CM.fixData.percData(_f.BeforeDiscount[i].Percent) + '</span></p>';
                _beBokID.append(_p);
            }
            //酒店星级数
            var _h = _hotelInfo;
            _htStarID.empty();
            for (var i = 0; i < _h.StarSit.length; i++) {
                var _p = '<p>' + _h.StarSit[i].Star + '<span>' + _h.StarSit[i].Percent + '</span></p>';
                _htStarID.append(_p);
            }
        },
        getFltDtInfo: function (index) {
            //0表示' + corpReport_SumPage.js_monthly + '，1表示' + corpReport_SumPage.js_quarterly + '
            all_flight_hotel._fltDtInfo = [];
            //' + corpReport_SumPage.js_InAirfare + '是否存在
            if (_cfgInfo.HasOutAirTicketProduct == "T") {
                all_flight_hotel._fltDtInfo.push({
                    Name: corpReport_SumPage.js_InAirfare,
                    Data: (index == 0) ? _inSumInfo.InteFlight_Moth : _inSumInfo.InteFlight_Quar,
                    Color: '#79b3ff'
                });
            }
            //' + corpReport_SumPage.js_DoAirfare + '是否存在
            if (_cfgInfo.HasInAirTicketProduct == "T") {
                all_flight_hotel._fltDtInfo.push({
                    Name: corpReport_SumPage.js_DoAirfare,
                    Data: (index == 0) ? _inSumInfo.DomFlight_Moth : _inSumInfo.DomFlight_Quar,
                    Color: '#1c76ec'
                });
            }
        },
        getHtlDtInfo: function (index) {
            //0表示' + corpReport_SumPage.js_monthly + '，1表示' + corpReport_SumPage.js_quarterly + '
            all_flight_hotel._htlDtInfo = [];
            //' + corpReport_SumPage.js_CorporateHotel + '是否存在
            if (_cfgInfo.HasAgrHotelProduct == "T") {
                all_flight_hotel._htlDtInfo.push({
                    Name: corpReport_SumPage.js_CorporateHotel,
                    Data: (index == 0) ? _inSumInfo.ArgHotel_Moth : _inSumInfo.ArgHotel_Quar,
                    Color: '#feda85'
                });
            }
            //' + corpReport_SumPage.js_MemberHotel + '是否存在
            if (_cfgInfo.HasMemHotelProduct == "T") {
                all_flight_hotel._htlDtInfo.push({
                    Name: corpReport_SumPage.js_MemberHotel,
                    Data: (index == 0) ? _inSumInfo.MemHotel_Moth : _inSumInfo.MemHotel_Quar,
                    Color: '#ffa60c'
                });
            }
        },
        dwFltColum: function () {
            var _fltDEmpty = all_flight_hotel.checkDataEmpty(all_flight_hotel._fltDtInfo),
            _fltConsumID = $('#fltConsumID');

            _fltConsumID.empty();
            //no data
            if (_fltDEmpty) {
                CM.LineHeightFix(_fltConsumID);
            } else {
                //var _colors = ['#79b3ff', '#1c76ec'];
                all_flight_hotel.drawColumnChart(_fltConsumID, all_flight_hotel._fltDtInfo, corpReport_SumPage.js_TotExpensesAir);
            }
        },
        dwHtlColum: function () {
            var _htlDEmpty = all_flight_hotel.checkDataEmpty(all_flight_hotel._htlDtInfo),
            _hotelConsumID = $('#hotelConsumID');

            _hotelConsumID.empty();
            //no data
            if (_htlDEmpty) {
                CM.LineHeightFix(_hotelConsumID);
            } else {
                //var _colors = ['#feda85', '#ffa60c'];
                all_flight_hotel.drawColumnChart(_hotelConsumID, all_flight_hotel._htlDtInfo, corpReport_SumPage.js_TotExpensesHot);
            }
        },
        checkDataEmpty: function (dt) {
            //扫描判断是否数据为空
            var _empty = true;
            for (var i = 0; i < dt.length; i++) {
                var _iData = dt[i].Data;
                for (var j = 0; j < _iData.length; j++) {
                    if (_iData[j].MPrice != 0) { return false; }
                }
            }
            return _empty;
        },
        drawColumnChart: function (content, dt, title) {
            var xData = all_flight_hotel.getXSeries(dt[0].Data);
            var yData = [];
            for (var i = 0; i < dt.length; i++) {
                yData[i] = all_flight_hotel.getYSeries(dt[i].Data, dt[i].Name, dt[i].Color);
            }

            content.highcharts({
                chart: {
                    type: 'column',
                    marginBottom: 36
                },
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
                    minPadding: 0,
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
                    floating: true,
                    borderWidth: 0,
                    y: 11,
                    shadow: false
                },
                tooltip: {
                    shared: true,
                    formatter: function () {
                        var _p = this.points,
                        _str = '<b>' + this.x + ' ' + corpReport_SumPage.js_Expense + '</b><br/>';
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
                        pointWidth: 28
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
        getYSeries: function (data, name, color) {
            var _m = {},
            _d = [];
            _m.name = name;
            _m.color = color;
            for (var i = 0; i < data.length; i++) {
                var _i = {};
                _i.y = data[i].MPrice;
                _d[i] = _i;
            }
            _m.data = _d;
            return _m;
        },
        onFltSelectChange: function () {
            if ($(this).val() == "1") {
                all_flight_hotel.getFltDtInfo(1);
            } else {
                all_flight_hotel.getFltDtInfo(0);
            }
            all_flight_hotel.dwFltColum();
        },
        onHtlSelectChange: function () {
            if ($(this).val() == "1") {
                all_flight_hotel.getHtlDtInfo(1);
            } else {
                all_flight_hotel.getHtlDtInfo(0);
            }
            all_flight_hotel.dwHtlColum();
        }
    };

    //固定数据的初始化
    var pageData = {
        init: function () {
            //初始化页面的静止数据
            $('#allConsumPID').html('<em>' + corpReport_Common.js_RMBLogo + '</em>' + CM.fixData.transData(_inSumInfo.AllConsumption, 0));
            $('#allSavePID').html('<em>' + corpReport_Common.js_RMBLogo + '</em>' + CM.fixData.transData(_inSumInfo.AllSaving, 0));

            $('#fltConsumPID').html('<em>' + corpReport_Common.js_RMBLogo + '</em>' + CM.fixData.transData(_flightInfo.AllConsum, 0));
            $('#fltAvgPID').html('<em>' + corpReport_Common.js_RMBLogo + '</em>' + CM.fixData.transData(_flightInfo.AvgPrice, 0));
            $('#fltAvgDisPID').html(_flightInfo.AveDisCount);

            $('#htlConsumPID').html('<em>' + corpReport_Common.js_RMBLogo + '</em>' + CM.fixData.transData(_hotelInfo.AllConsum, 0));
            $('#htlAvgPID').html('<em>' + corpReport_Common.js_RMBLogo + '</em>' + CM.fixData.transData(_hotelInfo.AvgPrice, 0));
            //消费预警
            if (_sumPageInfo && _inSumInfo.Flag) {
                var wI = $('#warnIcon'), wL = $('#warnLayer');
                wI.css('display', '');
                wL.html(corpReport_SumPage.js_WarnInfo1 + ' ' + _inSumInfo.WarnPer + ' ' + corpReport_SumPage.js_WarnInfo2);
                //
                wI.bind('mouseover touchstart', function () {
                    wL.data('fi', window.setTimeout(function () { wL.css({ 'display': '' }); }, 150));
                    window.clearTimeout(wL.data('fo'));
                }).bind('mouseout', function () {
                    window.clearTimeout(wL.data('fi'));
                    wL.data('fo', window.setTimeout(function () { wL.css('display', 'none'); }, 500));
                });
                //
                wL.bind('mouseover touchstart', function () { window.clearTimeout(wL.data('fo')); })
                  .bind('mouseout', function () { window.clearTimeout(wL.data('fi')); wL.data('fo', window.setTimeout(function () { wL.css('display', 'none'); }, 500)); });
            }
        }
    };

    //页面Init
    var sumPageInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //ajax
        $.ajax({
            url: '../ReportUI/GetSumPageData',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                //初始赋值
                _sumPageInfo = $.parseJSON(data);
                _inSumInfo = _sumPageInfo.SumInfo;
                _fivePartConInfo = _sumPageInfo.FivePartConInfo;
                _fiveDesConInfo = _sumPageInfo.FiveDesConInfo;
                _flightInfo = _sumPageInfo.FlightInfo;
                _hotelInfo = _sumPageInfo.HotelInfo;
                //初始化
                pageData.init();
                allConsum.init();
                fiveDepDesConsum.init();
                all_flight_hotel.init();
            },
            error: function () {
                noDataID.unmask();
                CM && CM.goError();
            }
        });
    }

    //☆=================== Fun E ===================☆

    //全局重载
    dpHeaderSuccess = function () {
        //初始的头部数据
        CM.hrefChange($('#menu').find('a'), _headSelectInfo);
        sumPageInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..重新访问SumPage
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }

    //
    Droco_Funs.getHeader(0);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);