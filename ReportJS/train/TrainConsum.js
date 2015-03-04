(function ($) {
    //☆=================== var S ===================☆
    var _trainPageInfo, //页面总数据
        _trainStrInfo, //火车票总金额和均价
        _trainConsumInfo, //火车金额票消费
        _trainFivePartInfo, //前五个部门消费情况:
        _trainFiveDesInfo, //前五个目的地消费情况
        _trainRateInfo, //火车票消费分布
        _TrainFiveTrip; //火车票消费前5行程
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //火车票消费分析
    var trainConsum = {
        _trainDtInfo: [],
        init: function () {
            //
            var _trainConsumSelID = $('#trainConsumSelID'),
            _trainConsumID = $('#trainConsumID');

            _trainConsumSelID.css('display', '');
            _trainConsumSelID.empty();
            //季度月度存在与否
            if (_cfgInfo.HasMonthlyData == "T" || _cfgInfo.HasQuarterData == "T") {
                var _s = [];
                if (_cfgInfo.HasMonthlyData == "F") {
                    _s.push('<label><input type="radio" name="option1" checked="checked" value="1">' + corpReport_TrainPage.js_Quarterly + '</label>');
                    //
                    trainConsum.getMonArgInfo(1);
                } else {
                    _s.push('<label><input type="radio" name="option1" checked value="0">' + corpReport_TrainPage.js_Monthly + '</label>');
                    if (_cfgInfo.HasQuarterData == "T") {
                        _s.push('<label><input type="radio" name="option1" value="1">' + corpReport_TrainPage.js_Quarterly + '</label>');
                    }
                    //
                    trainConsum.getMonArgInfo(0);
                }
                //
                _trainConsumSelID.append(_s.join(""));
                trainConsum.dwCol();
                //..绑定事件
                if (_cfgInfo.HasMonthlyData == "T" && _cfgInfo.HasQuarterData == "T") {
                    _trainConsumSelID.find('input').bind('change', trainConsum.onSelectChange);
                }
            } else {
                _trainConsumSelID.css('display', 'none');
                _trainConsumID.css('display', 'none');
            }

        },
        getMonArgInfo: function (index) {
            trainConsum._trainDtInfo = [];
            //0表示月度，1-季度
            trainConsum._trainDtInfo.push({
                Name: corpReport_TrainPage.js_Train,
                Data: (index == 0) ? _trainConsumInfo.Train_moth : _trainConsumInfo.Train_quar
            });
        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Data.length > 0) { return false; }
            }
            return true;
        },
        dwCol: function () {
            var _trainConsumID = $('#trainConsumID'),
            _colEmpty = trainConsum.checkDataEmpty(trainConsum._trainDtInfo);

            //no data
            _trainConsumID.empty();
            if (_colEmpty) {
                CM.LineHeightFix(_trainConsumID);
            } else {
                trainConsum.drawColumn(_trainConsumID, trainConsum._trainDtInfo);
            }
        },
        drawColumn: function (content, dt) {
            var xData = trainConsum.getXSeries(dt[0].Data);
            //
            var yData = [];
            for (var i = 0; i < dt.length; i++) {
                yData[i] = trainConsum.getYSeries(dt[i].Data, dt[i].Name);
            }

            content.highcharts({
                chart: {
                    type: 'column',
                    marginBottom: 36
                },
                colors: ['#00cd9f'],
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
                            _str = _str + corpReport_TrainPage.js_Expense + ': ' + corpReport_Common.js_RMBLogo + CM.fixData.transData(_p[i].y, 0) + '<br/>';
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
                trainConsum.getMonArgInfo(1);
            } else {
                trainConsum.getMonArgInfo(0);
            }
            trainConsum.dwCol();
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
            //是否存在数据，有数据才进行绘制
            if (_cfgInfo.HasTrainTop5Dept == "T") {
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
            _d.name = corpReport_TrainPage.js_TotalExpenses;
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
                            corpReport_TrainPage.js_TotalExpenses + ':  ' + corpReport_Common.js_RMBLogo + CM.fixData.transData(this.point.y, 0) + '<br/>' +
                            corpReport_TrainPage.js_Percent + ': ' + this.percentage.toFixed(1) + '%'
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
    }

    //火车票消费分布
    var ticketRate = {
        init: function () {
            var tRs = $('#ticketRateSelID');
            //默认展示火车票类型
            ticketRate.dwCol(0);
            tRs.find('input').bind('change', ticketRate.onSelChange);
        },
        dwCol: function (index) {
            var data = (index == 0) ? _trainRateInfo.TicketsTypeInfo : _trainRateInfo.TicketsSeatInfo,
            tR = $('#ticketRateID'),
            _empty = ticketRate.checkDataEmpty(data);
            if (_empty) {
                CM.LineHeightFix(tR);
            } else {
                ticketRate.drawColumn(tR, data);
            }
        },
        checkDataEmpty: function (dt) {
            var _empty = true;
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Quantity > 0) { return false; }
            }
            return _empty;
        },
        drawColumn: function (content, dt) {
            var d = ticketRate.getSeries(dt);

            content.highcharts({
                chart: {
                    type: 'column'
                },
                colors: ['#00a37f', '#00cd9f', '#2effd0'],
                title: {
                    text: null
                },
                xAxis: {
                    categories: d.X,
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
                    }]
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                           corpReport_TrainPage.js_Tickets + ': ' + CM.fixData.transData(this.y, 0);
                    },
                    style: {
                        lineHeight: '18px'
                    }
                },
                plotOptions: {
                    column: {
                        dataLabels: {
                            enabled: true,
                            formatter: function () {
                                return CM.fixData.transData(this.y, 0);
                            },
                            crop: false,
                            overflow: "none",
                            style: {
                                color: '#666'
                            }
                        },
                        borderRadius: 0.5,
                        pointWidth: 36
                    },
                    series: {
                        borderWidth: 0,
                        colorByPoint: true
                    }
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                series: d.Y
            });
        },
        getSeries: function (data) {
            var _x = [], _y = {}, _yIn = [];
            for (var i = 0, l = data.length; i < l; i++) {
                _x.push(data[i].Name);
                _yIn.push(data[i].Quantity);
            }
            _y.data = _yIn;
            return {
                X: _x,
                Y: [_y]
            }
        },
        onSelChange: function (event) {
            ticketRate.dwCol($(this).val() == "0" ? 0 : 1);
        }
    };

    //火车票前5行程
    var trainTop5Trip = {
        init: function () {
            //初始绘制碳排放计算table
            trainTop5Trip.clearAll();
            trainTop5Trip.drawHead();
            trainTop5Trip.drawBody(_TrainFiveTrip.TripInfo);
            trainTop5Trip.drawFoot(_TrainFiveTrip.TolTripInfo);
        },
        drawHead: function () {
            var _head = $('<table><tbody id="headTableID"></tbody></table>');
            $('#trianTopTripID').append(_head);
            var _str = ['<tr>'];
            _str.push('<th width="25%" class="left">' + corpReport_TrainPage.js_Top5Trip + '</th>');
            _str.push('<th width="25%">' + corpReport_TrainPage.js_TicketsAmount + '</th>');
            _str.push('<th width="25%">' + corpReport_TrainPage.js_Tickets + '</th>');
            _str.push('<th width="25%">' + corpReport_TrainPage.js_AvgPrice + '</th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (data) {
            var _body = $('<div class="tbody" style="overflow-y: hidden;height: 186px;"><table><tbody id="bodyTableID"></tbody></table></div>');
            $('#trianTopTripID').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //no data
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _str = ['<tr>'];
                    _str.push('<td width="25%" class="left">' + data[i].TripName + '</td>');
                    _str.push('<td width="25%">' + CM.fixData.transData(data[i].Price, 0) + '</td>');
                    _str.push('<td width="25%">' + CM.fixData.transData(data[i].Tickets, 0) + '</td>');
                    _str.push('<td width="25%">' + CM.fixData.transData(data[i].AvgPrice, 0) + '</td></tr>');
                    _bodyTableID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        },
        drawFoot: function (data) {
            var _foot = $('<table><tfoot id="footTableID"></tfoot></table>');
            $('#trianTopTripID').append(_foot);
            if (data) {
                var _str = ['<tr>'];
                _str.push('<td width="25%" class="left">' + corpReport_TrainPage.js_Total + '</td>');
                _str.push('<td width="25%">' + CM.fixData.transData(data.Price, 0) + '</td>');
                _str.push('<td width="25%">' + CM.fixData.transData(data.Tickets, 0) + '</td>');
                _str.push('<td width="25%">' + CM.fixData.transData(data.AvgPrice, 0) + '</td></tr>');
                $('#footTableID').append(_str.join(""));
            }
        },
        clearAll: function () {
            $('#trianTopTripID').empty();
        }
    };

    //固定数据的初始化
    var pageData = {
        init: function () {
            //初始化页面的静止数据
            $('#trainConsumPID').html('<em>' + corpReport_Common.js_RMBLogo + '</em>' + CM.fixData.transData(_trainStrInfo.AllConsume, 0));
            $('#trainAvgPID').html('<em>' + corpReport_Common.js_RMBLogo + '</em>' + CM.fixData.transData(_trainStrInfo.AvgPrice, 0));
        }
    };

    //
    var trainPageInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //
        $.ajax({
            url: '../ReportUI/GetTrainPage',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                //初始赋值
                _trainPageInfo = $.parseJSON(data);
                //初始赋值
                _trainStrInfo = _trainPageInfo.Train;
                _trainConsumInfo = _trainPageInfo.TrainConsumInfo;
                _fivePartConInfo = _trainPageInfo.TrainFivePartInfo;
                _fiveDesConInfo = _trainPageInfo.TrainFiveDesInfo;
                _trainRateInfo = _trainPageInfo.TrainRateInfo;
                _TrainFiveTrip = _trainPageInfo.TrainTop5TripInfo;
                //初始化
                pageData.init();
                trainConsum.init();
                fiveDepDesConsum.init();
                ticketRate.init();
                trainTop5Trip.init();
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
        trainPageInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(3);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);