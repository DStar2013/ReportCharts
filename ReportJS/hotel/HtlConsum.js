(function ($) {
    //☆=================== var S ===================☆
    var _hotelPageInfo, //页面数据
        _hotelStrInfo, //酒店总金额和均价
        _hotelConsumInfo, //酒店消费
        _htlRoomNightInfo, //间夜量分布
        _htlAvgPrice, //平均价格
        _bkMethodInfo, //预定方式
        _htlDepConsumInfo; //部门-合计金额-合计间夜-合计平均价格-会员金额-会员间夜-会员平均价格-协议金额-协议间夜-协议平均价格
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //酒店消费
    var hotelConsum = {
        _htlDtInfo: [],
        init: function () {
            //
            var _htlConsumSelID = $('#htlConsumSelID'),
            _htlConsumID = $('#htlConsumID'),
            _h = [];

            _htlConsumSelID.css('display', '');
            _htlConsumSelID.empty();
            //季度月度存在与否
            if (_cfgInfo.HasMonthlyData == "T" && _cfgInfo.HasQuarterData == "T") {
                _h.push('<label><input type="radio" name="option1" checked value="0">' + corpReport_HotelPage.js_Monthly + '</label>');
                _h.push('<label><input type="radio" name="option1" value="1">' + corpReport_HotelPage.js_Quarterly + '</label>');
                _htlConsumSelID.append(_h.join(""));
                _htlConsumSelID.find('input').bind('change', hotelConsum.onSelectChange);
                //绘制
                hotelConsum.getMonArgInfo(0);
                hotelConsum.dwCol();
            } else if (_cfgInfo.HasMonthlyData == "T" && _cfgInfo.HasQuarterData == "F") {
                _h.push('<label><input type="radio" name="option1" checked value="0">' + corpReport_HotelPage.js_Monthly + '</label>');
                _htlConsumSelID.append(_h.join(""));
                //绘制
                hotelConsum.getMonArgInfo(0);
                hotelConsum.dwCol();
            } else if (_cfgInfo.HasMonthlyData == "F" && _cfgInfo.HasQuarterData == "T") {
                _h.push('<label><input type="radio" name="option1" checked value="1">' + corpReport_HotelPage.js_Quarterly + '</label>');
                _htlConsumSelID.append(_h.join(""));
                //绘制
                hotelConsum.getMonArgInfo(1);
                hotelConsum.dwCol();
            } else {
                _htlConsumSelID.css('display', 'none');
                _htlConsumID.css('display', 'none');
            }
        },
        getMonArgInfo: function (index) {
            //0表示月度，1-季度
            hotelConsum._htlDtInfo = [];
            //协议酒店是否存在
            if (_cfgInfo.HasAgrHotelProduct == "T") {
                hotelConsum._htlDtInfo.push({
                    Name: corpReport_HotelPage.js_CHotels,
                    Data: (index == 0) ? _hotelConsumInfo.CHotel_Moth : _hotelConsumInfo.CHotel_Quar
                });
            }
            //会员酒店是否存在
            if (_cfgInfo.HasMemHotelProduct == "T") {
                hotelConsum._htlDtInfo.push({
                    Name: corpReport_HotelPage.js_MHotels,
                    Data: (index == 0) ? _hotelConsumInfo.MHotel_Moth : _hotelConsumInfo.MHotel_Quar
                });
            }
        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Data.length > 0) { return false; }
            }
            return true;
        },
        dwCol: function () {
            var _htlConsumID = $('#htlConsumID'),
            _colEmpty = hotelConsum.checkDataEmpty(hotelConsum._htlDtInfo);

            //no data
            _htlConsumID.empty();
            if (_colEmpty) {
                CM.LineHeightFix(_htlConsumID);
            } else {
                hotelConsum.drawColumn(_htlConsumID, hotelConsum._htlDtInfo);
            }
        },
        drawColumn: function (content, dt) {
            var xData = hotelConsum.getXSeries(dt[0].Data);
            //
            var yData = [];
            for (var i = 0; i < dt.length; i++) {
                yData[i] = hotelConsum.getYSeries(dt[i].Data, dt[i].Name);
            }

            content.highcharts({
                chart: {
                    type: 'column',
                    marginBottom: 36
                },
                colors: ['#feda85', '#ffa60c'],
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
                        _str = '<b>' + this.x + '</b><br/>';
                        for (var i = 0; i < _p.length; i++) {
                            _str = _str + _p[i].series.name + " " + corpReport_HotelPage.js_Expense + ': ' + corpReport_Common.js_RMBLogo + CM.fixData.transData(_p[i].y, 0) + '<br/>';
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
                        pointWidth: 24
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
                _d[i] = _i;
            }
            _m.data = _d;
            return _m;
        },
        onSelectChange: function () {
            if ($(this).val() == "1") {
                hotelConsum.getMonArgInfo(1);
            } else {
                hotelConsum.getMonArgInfo(0);
            }
            hotelConsum.dwCol();
        }
    };

    //间夜量分布
    var htlRoomNight = {
        _htlRoomNightDt: [],
        init: function () {
            //..
            var _htlRoomNightID = $('#htlRoomNightID'),
            _htlRoomNight = $('#htlRoomNight'),
            _h = [];

            _htlRoomNightID.css('display', '');
            _htlRoomNightID.empty();
            //协议、会员
            if (_cfgInfo.HasMemHotelProduct == "T" && _cfgInfo.HasAgrHotelProduct == "T") {
                _h.push('<label><input type="radio" name="option2" checked value="0">' + corpReport_HotelPage.js_All + '</label>');
                _h.push('<label><input type="radio" name="option2" value="1">' + corpReport_HotelPage.js_CHotels + '</label>');
                _h.push('<label><input type="radio" name="option2" value="2">' + corpReport_HotelPage.js_MHotels + '</label>');
                _htlRoomNightID.append(_h.join(""));
                _htlRoomNightID.find('input').bind('change', htlRoomNight.onSelectChange);
                //..
                htlRoomNight.getRoomNightData(0);
                htlRoomNight.dwPie();
            } else if (_cfgInfo.HasMemHotelProduct == "F" && _cfgInfo.HasAgrHotelProduct == "T") {
                _h.push('<label><input type="radio" name="option2" checked value="1">' + corpReport_HotelPage.js_CHotels + '</label>');
                _htlRoomNightID.append(_h.join(""));
                //..
                htlRoomNight.getRoomNightData(1);
                htlRoomNight.dwPie();
            } else if (_cfgInfo.HasMemHotelProduct == "T" && _cfgInfo.HasAgrHotelProduct == "F") {
                _h.push('<label><input type="radio" name="option2" checked value="2">' + corpReport_HotelPage.js_MHotels + '</label>');
                _htlRoomNightID.append(_h.join(""));
                //..
                htlRoomNight.getRoomNightData(2);
                htlRoomNight.dwPie();
            } else {
                _htlRoomNightID.css('display', 'none');
                _htlRoomNight.css('display', 'none');
            }
            //htlRoomNight.drawPieChart($('#htlRoomNight'), _htlRoomNightInfo.AllConsume, 500, 260);
        },
        getRoomNightData: function (index) {
            //0-全部，1-协议，2-会员
            htlRoomNight._htlRoomNightDt = [];
            htlRoomNight._htlRoomNightDt.push({
                Name: "酒店间夜量分布消费情况",
                Data: (index == 0) ? _htlRoomNightInfo.AllConsume : ((index == 1) ? _htlRoomNightInfo.CHotelConsume : _htlRoomNightInfo.MHotelConsume)
            });
        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Data.length > 0) { return false; }
            }
            return true;
        },
        dwPie: function () {
            var _htlRoomNight = $('#htlRoomNight'),
            _pieEmpty = htlRoomNight.checkDataEmpty(htlRoomNight._htlRoomNightDt);

            //no data
            _htlRoomNight.empty();
            if (_pieEmpty) {
                CM.LineHeightFix(_htlRoomNight);
            } else {
                htlRoomNight.drawPieChart(_htlRoomNight, htlRoomNight._htlRoomNightDt);
            }
        },
        drawPieChart: function (content, dt) {
            var data = [],
            _d = {};
            _d.type = "pie";
            _d.name = corpReport_HotelPage.js_TotalExpenses;
            _d.data = htlRoomNight.getData(dt[0].Data);
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
                            enabled: true,
                            distance: 5,
                            connectorWidth: 0,
                            formatter: function () {
                                if (this.point.y > 0) {
                                    return this.point.name + ': ' + this.percentage.toFixed(1) + '%';
                                }
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        if (this.point.y > 0) {
                            return '<b>' + this.point.name + '</b><br/>' +
                            corpReport_HotelPage.js_TotalExpenses + ': ' + corpReport_Common.js_RMBLogo + CM.fixData.transData(this.point.y, 0) + '<br/>' +
                            corpReport_HotelPage.js_Percent + ': ' + this.percentage.toFixed(1) + '%'
                        }
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
                        return this.name + ' ' + this.percentage.toFixed(1) + '%';
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
        onSelectChange: function () {
            if ($(this).val() == "0") {
                htlRoomNight.getRoomNightData(0);
            } else if ($(this).val() == "1") {
                htlRoomNight.getRoomNightData(1);
            } else {
                htlRoomNight.getRoomNightData(2);
            }
            htlRoomNight.dwPie();
        }
    };

    //均价分布
    var htlAvgPrice = {
        _htlAvgPriceDt: [],
        init: function () {
            //.
            var _htlAvgPriceSelID = $('#htlAvgPriceSelID'),
            _htlAvgPriceID = $('#htlAvgPriceID'),
            _h = [];

            _htlAvgPriceSelID.css('display', '');
            _htlAvgPriceSelID.empty();
            //季度月度存在与否
            if (_cfgInfo.HasMonthlyData == "T" && _cfgInfo.HasQuarterData == "T") {
                _h.push('<label><input type="radio" name="option" checked value="0">' + corpReport_HotelPage.js_Monthly + '</label>');
                _h.push('<label><input type="radio" name="option" value="1">' + corpReport_HotelPage.js_Quarterly + '</label>');
                _htlAvgPriceSelID.append(_h.join(""));
                _htlAvgPriceSelID.find('input').bind('change', htlAvgPrice.onSelectChange);
                //绘制
                htlAvgPrice.getMonArgInfo(0);
                htlAvgPrice.dwLine();
            } else if (_cfgInfo.HasMonthlyData == "T" && _cfgInfo.HasQuarterData == "F") {
                _h.push('<label><input type="radio" name="option" checked value="0">' + corpReport_HotelPage.js_Monthly + '</label>');
                _htlAvgPriceSelID.append(_h.join(""));
                //
                htlAvgPrice.getMonArgInfo(0);
                htlAvgPrice.dwLine();
            } else if (_cfgInfo.HasMonthlyData == "F" && _cfgInfo.HasQuarterData == "T") {
                _h.push('<label><input type="radio" name="option" checked value="1">' + corpReport_HotelPage.js_Quarterly + '</label>');
                _htlAvgPriceSelID.append(_h.join(""));
                //
                htlAvgPrice.getMonArgInfo(1);
                htlAvgPrice.dwLine();
            } else {
                _htlAvgPriceSelID.css('display', 'none');
                _htlAvgPriceID.css('display', 'none');
            }
        },
        getMonArgInfo: function (index) {
            //0-月度 1-季度
            htlAvgPrice._htlAvgPriceDt = [];
            //协议酒店是否存在
            if (_cfgInfo.HasAgrHotelProduct == "T") {
                htlAvgPrice._htlAvgPriceDt.push({
                    Name: corpReport_HotelPage.js_CHotels,
                    Data: (index == 0) ? _htlAvgPrice.CHotel_moth : _htlAvgPrice.CHotel_quar
                });
            }
            //会员酒店是否存在
            if (_cfgInfo.HasMemHotelProduct == "T") {
                htlAvgPrice._htlAvgPriceDt.push({
                    Name: corpReport_HotelPage.js_MHotels,
                    Data: (index == 0) ? _htlAvgPrice.MHotel_moth : _htlAvgPrice.MHotel_quar
                });
            }
        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Data.length > 0) { return false; }
            }
            return true;
        },
        dwLine: function () {
            var _htlAvgPriceID = $('#htlAvgPriceID'),
            _lineEmpty = htlAvgPrice.checkDataEmpty(htlAvgPrice._htlAvgPriceDt);

            //no data
            _htlAvgPriceID.empty();
            if (_lineEmpty) {
                CM.LineHeightFix(_htlAvgPriceID);
            } else {
                htlAvgPrice.drawLine(_htlAvgPriceID, htlAvgPrice._htlAvgPriceDt);
            }
        },
        drawLine: function (content, dt) {
            var xData = htlAvgPrice.getXSeries(dt[0].Data);
            var yData = [];
            for (var i = 0; i < dt.length; i++) {
                yData[i] = htlAvgPrice.getYSeries(dt[i].Data, dt[i].Name);
            }

            //绘图
            content.highcharts({
                chart: {
                    type: 'line',
                    marginBottom: 36
                },
                colors: ['#feda85', '#ffa60c'],
                title: {
                    text: null
                },
                xAxis: {
                    categories: xData,
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
                    y: 11,
                    //x: -25,
                    floating: true,
                    borderWidth: 0
                },
                tooltip: {
                    shared: true,
                    formatter: function () {
                        var _p = this.points,
                        _str = '<b>' + this.x + '</b><br/>';
                        for (var i = 0; i < _p.length; i++) {
                            _str = _str + _p[i].series.name + ': ' + corpReport_Common.js_RMBLogo + CM.fixData.transData(_p[i].y, 0) + '<br/>';
                        }
                        return _str;
                    },
                    style: {
                        lineHeight: '18px'
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
                _d[i] = data[i].MPrice;
            }
            _m.data = _d;
            return _m;
        },
        onSelectChange: function () {
            if ($(this).val() == "0") {
                htlAvgPrice.getMonArgInfo(0);
            } else {
                htlAvgPrice.getMonArgInfo(1);
            }
            htlAvgPrice.dwLine();
        }
    };

    //预定方式
    var bookMethod = {
        _htlBkMthDt: [],
        init: function () {
            //协议会员开关
            bookMethod.getArgMemInfo();
            bookMethod.dwCol();
            //bookMethod.drawColumn($('#bkMethodID'), _bkMethodInfo.COrders, "协议酒店", _bkMethodInfo.MOrders, "会员酒店");
        },
        getArgMemInfo: function () {
            bookMethod._htlBkMthDt = [];
            //协议酒店是否存在
            if (_cfgInfo.HasAgrHotelProduct == "T") {
                bookMethod._htlBkMthDt.push({
                    Name: corpReport_HotelPage.js_CHotels,
                    Data: _bkMethodInfo.COrders
                });
            }
            //会员酒店是否存在
            if (_cfgInfo.HasMemHotelProduct == "T") {
                bookMethod._htlBkMthDt.push({
                    Name: corpReport_HotelPage.js_MHotels,
                    Data: _bkMethodInfo.MOrders
                });
            }
        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Data.length > 0) { return false; }
            }
            return true;
        },
        dwCol: function () {
            var _bkMethodID = $('#bkMethodID'),
            _colEmpty = bookMethod.checkDataEmpty(bookMethod._htlBkMthDt);

            //no data
            _bkMethodID.empty();
            if (_colEmpty) {
                CM.LineHeightFix(_bkMethodID);
            } else {
                bookMethod.drawColumn(_bkMethodID, bookMethod._htlBkMthDt);
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
                colors: ['#feda85', '#ffa60c'],
                title: {
                    text: corpReport_HotelPage.js_NumberofBookings,
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
                        borderRadius: 0.5,  //设置柱状图的圆角，美观
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

    //部门消费明细
    var htlDepConsum = {
        init: function () {
            //.
            var _htlDepConsumID = $('#htlDepConsumID');

            htlDepConsum.clearAll();
            if (_cfgInfo.HasHtlDeptDetail == "T") {
                htlDepConsum.drawHead();
                htlDepConsum.drawBody(_htlDepConsumInfo.DepConInfo);
                //htlDepConsum.drawFoot(_htlDepConsumInfo.TolDepConInfo);
            } else {
                _htlDepConsumID.height(218);
                CM.ChargeFix(_htlDepConsumID, "payment17.jpg", lanType);
            }
        },
        drawHead: function () {
            //绘制头部
            var _head = $('<table><thead id="headTableID"></thead></table>');
            $('#htlDepConsumID').append(_head);

            var _str;

            var _tolHead = '<th width="30%">' + corpReport_HotelPage.js_Total + '<table><tbody><tr>' +
                       '<td width="">' + corpReport_HotelPage.js_Amount + '</td>' +
                       '<td>' + corpReport_HotelPage.js_RoomNights + '</td>' +
                       '<td>' + corpReport_HotelPage.js_Averageprice + '</td>' +
                       '</tr></tbody></table></th>';

            var _memHead = function (width) {
                return '<th width=' + width + '>' + corpReport_HotelPage.js_MHotels + '<table><tbody><tr>' +
                       '<td>' + corpReport_HotelPage.js_Amount + '</td>' +
                       '<td>' + corpReport_HotelPage.js_RoomNights + '</td>' +
                       '<td>' + corpReport_HotelPage.js_Averageprice + '</td>' +
                       '</tr></tbody></table></th>';
            }
            var _argHead = function (width) {
                return '<th width=' + width + '>' + corpReport_HotelPage.js_CHotels + '<table><tbody><tr>' +
                       '<td>' + corpReport_HotelPage.js_Amount + '</td>' +
                       '<td>' + corpReport_HotelPage.js_RoomNights + '</td>' +
                       '<td>' + corpReport_HotelPage.js_Averageprice + '</td>' +
                       '</tr></tbody></table></th>';
            }

            //会员酒店 协议酒店
            if (_cfgInfo.HasAgrHotelProduct == "T" && _cfgInfo.HasMemHotelProduct == "T") {
                _str = '<tr><th width="10%">' + corpReport_HotelPage.js_Department + '</th>' + _tolHead + _memHead("30%") + _argHead("30%");
            } else if (_cfgInfo.HasAgrHotelProduct == "T" && _cfgInfo.HasMemHotelProduct == "F") {
                _str = '<tr><th width="20%">' + corpReport_HotelPage.js_Department + '</th>' + _argHead("80%");
            } else if (_cfgInfo.HasAgrHotelProduct == "F" && _cfgInfo.HasMemHotelProduct == "T") {
                _str = '<tr><th width="20%">' + corpReport_HotelPage.js_Department + '</th>' + _memHead("80%");
            }
            _str = _str + '<th class="null_place"><div></div></th>' +
                      '</tr>';
            $('#headTableID').append(_str);
        },
        drawBody: function (data) {
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>');
            $('#htlDepConsumID').append(_body);
            var _bodyTableID = $('#bodyTableID');

            //no data
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _str;
                    var _tolBody = '<td width="30%"><table><tbody><tr>' +
                           '<td>' + CM.fixData.transData(data[i].AllPrice, 0) + '</td>' +
                           '<td>' + CM.fixData.transData(data[i].AllNight, 0) + '</td>' +
                           '<td>' + CM.fixData.transData(data[i].AllAvgPrice, 0) + '</td>' +
                           '</tr></tbody></table></td>';
                    var _memBody = function (width) {
                        return '<td width=' + width + '><table><tbody><tr>' +
                           '<td>' + CM.fixData.transData(data[i].MemPrice, 0) + '</td>' +
                           '<td>' + CM.fixData.transData(data[i].MemNight, 0) + '</td>' +
                           '<td>' + CM.fixData.transData(data[i].MemAvgPrice, 0) + '</td>' +
                           '</tr></tbody></table></td>';
                    }
                    var _argBody = function (width) {
                        return '<td width=' + width + '><table><tbody><tr>' +
                           '<td>' + CM.fixData.transData(data[i].ArgPrice, 0) + '</td>' +
                           '<td>' + CM.fixData.transData(data[i].ArgNight, 0) + '</td>' +
                           '<td>' + CM.fixData.transData(data[i].ArgAvgPrice, 0) + '</td>' +
                           '</tr></tbody></table></td>';
                    }

                    //判断协议会员
                    if (_cfgInfo.HasAgrHotelProduct == "T" && _cfgInfo.HasMemHotelProduct == "T") {
                        _str = '<tr><td width="10%">' + data[i].DepName + '</td>' + _tolBody + _memBody("30%") + _argBody("30%");
                    } else if (_cfgInfo.HasAgrHotelProduct == "T" && _cfgInfo.HasMemHotelProduct == "F") {
                        _str = '<tr><td width="20%">' + data[i].DepName + '</td>' + _argBody("80%");
                    } else if (_cfgInfo.HasAgrHotelProduct == "F" && _cfgInfo.HasMemHotelProduct == "T") {
                        _str = '<tr><td width="20%">' + data[i].DepName + '</td>' + _memBody("80%");
                    }
                    _str = _str + '</tr>';
                    _bodyTableID.append(_str);
                }
            } else {
                CM.LineHeightFix(_body);
            }

        },
        drawFoot: function (data) {
            var _foot = $('<table><tfoot id="footTableID"></tfoot></table>');
            $('#htlDepConsumID').append(_foot);
            var _str = '<tr>' +
                   '<td width="10%">总计</td>';
            var _tolFoot = '<td width="30%"><table><tbody><tr>' +
                       '<td>' + CM.fixData.transData(data.TolAllPrice, 0) + '</td>' +
                       '<td>' + CM.fixData.transData(data.TolAllNight, 0) + '</td>' +
                       '<td>' + CM.fixData.transData(data.TolAllAvgPrice, 0) + '</td>' +
                       '</tr></tbody></table></td>';
            var _memFoot = '<td width="30%"><table><tbody><tr>' +
                       '<td>' + CM.fixData.transData(data.TolMemPrice, 0) + '</td>' +
                       '<td>' + CM.fixData.transData(data.TolMemNight, 0) + '</td>' +
                       '<td>' + CM.fixData.transData(data.TolMemAvgPrice, 0) + '</td>' +
                       '</tr></tbody></table></td>';
            var _argFoot = '<td width="30%"><table><tbody><tr>' +
                       '<td>' + CM.fixData.transData(data.TolArgPrice, 0) + '</td>' +
                       '<td>' + CM.fixData.transData(data.TolArgNight, 0) + '</td>' +
                       '<td>' + CM.fixData.transData(data.TolArgAvgPrice, 0) + '</td>' +
                       '</tr></tbody></table></td>';
            //判断协议会员
            if (_cfgInfo.HasAgrHotelProduct == "T" && _cfgInfo.HasMemHotelProduct == "T") {
                _str = _str + _tolFoot + _memFoot + _argFoot;
            } else if (_cfgInfo.HasAgrHotelProduct == "T" && _cfgInfo.HasMemHotelProduct == "F") {
                _str = _str + _argFoot;
            } else if (_cfgInfo.HasAgrHotelProduct == "F" && _cfgInfo.HasMemHotelProduct == "T") {
                _str = _str + _memFoot;
            }
            _str = _str + '<td class="null_place"><div></div></td></tr>';
            $('#footTableID').append(_str);
        },
        clearAll: function () {
            $('#htlDepConsumID').empty();
        }
    };

    //固定数据的初始化
    var pageData = {
        init: function () {
            //初始化页面的静止数据
            $('#htlConsumPID').html('<em>' + corpReport_Common.js_RMBLogo + '</em>' + CM.fixData.transData(_hotelStrInfo.AllConsume, 0));
            $('#htlAvgPID').html('<em>' + corpReport_Common.js_RMBLogo + '</em>' + CM.fixData.transData(_hotelStrInfo.AvgPrice, 0));
        }
    };

    //
    var hotelPageInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //
        $.ajax({
            url: '../Hotel/GetHotelPage',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                //初始赋值
                _hotelPageInfo = $.parseJSON(data);
                //初始赋值
                _hotelStrInfo = _hotelPageInfo.Hotel;
                _hotelConsumInfo = _hotelPageInfo.HotelConsumInfo;
                _htlRoomNightInfo = _hotelPageInfo.HtlRoomNightStat;
                _htlAvgPrice = _hotelPageInfo.HtlAvgPriceStat;
                _bkMethodInfo = _hotelPageInfo.BkMethodInfo;
                _htlDepConsumInfo = _hotelPageInfo.HtlDepConsumInfo;
                //初始化
                pageData.init();
                hotelConsum.init();
                htlRoomNight.init();
                htlAvgPrice.init();
                bookMethod.init();
                htlDepConsum.init();
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
        CM.hrefChange($('#htlSubNavID').find('a'), _headSelectInfo);
        hotelPageInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(2);
    Droco_Funs.getHotelSubNav(0);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);