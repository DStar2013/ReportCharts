(function ($) {
    //☆=================== var S ===================☆
    var _flightAvtAgrmtInfo, //页面信息
        _fltAgrInfo, //协议航空信息
        _fltCarrList,  //承运商列表
        _fltArgCompInfo, //月份-总票张数-总消费金额-国内票张数-国内消费额-国内Y全价票张数-国内Y全价消费额-国内Y舱返折扣票张数-国内Y舱返折扣销售额-国际票张数-国际消费额-预计节省
        timeout;   //
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //协议航空使用分布情况
    var fltArgDis = {
        init: function () {
            var _argFltDistID = $('#argFltDistID');

            _argFltDistID.css('display', '');
            //分布情况开关
            if (_cfgInfo.HasAgrFltUse == "T") {
                //no data
                _argFltDistID.empty();
                if (_fltAgrInfo.AgrFltDistInfo.length > 0) {
                    fltArgDis.drawPieChart(_argFltDistID, _fltAgrInfo.AgrFltDistInfo);
                } else {
                    CM.LineHeightFix(_argFltDistID);
                }
            } else {
                CM.ChargeFix(_argFltDistID, "payment10.jpg", lanType);
            }
        },
        drawPieChart: function (content, dt) {
            var data = [],
            _d = {};
            _d.type = "pie";
            _d.data = fltArgDis.getData(dt);
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
                        size: '85%',
                        center: ['60%', '32%'],
                        dataLabels: {
                            enabled: false,
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
                           corpReport_FlightAvtAgrmt.js_PerofExpenses + ': ' + this.percentage.toFixed(1) + '%<br/>' +
                           corpReport_FlightAvtAgrmt.js_NetPriceofCorpAirfare + ': ' + corpReport_Common.js_RMBLogo + CM.fixData.transData(this.point.y, 0);
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
                _s.y = data[i].Price;
                _d[i] = _s;
            }
            return _d;
        }
    };

    //协议航空的完成情况
    var fltArgComp = {
        init: function () {
            //
            var _fltCarExID = $('#fltCarExID'),
            _fltArgComID = $('#fltArgComID');

            if (_cfgInfo.HasAgrFltComplete == "T") {
                _fltCarExID.css('display', '');
                fltArgComp.carrierInit();
            } else {
                _fltArgComID.empty().height(315);
                CM.ChargeFix(_fltArgComID, "payment11.jpg", lanType);
            }
        },
        carrierInit: function () {
            //
            var _fltCarrID = $('#fltCarrID');
            //初始无状态，没有公司的时候，给定UID是-1
            _fltCarrID.html(corpReport_FlightAvtAgrmt.js_None + '<i class="icon i5"></i>');
            _fltCarrID.data('UID', -1);
            _fltCarrID.data('CarName', corpReport_FlightAvtAgrmt.js_None);
            //绘制Table头部
            fltArgComp.clearAll();
            fltArgComp.drawHead();

            //绘制carrier的下拉框
            //fltArgComp.drawCarrDown(_fltAgrInfo.AgrFltDistInfo);
            fltArgComp.drawCarrDown(_fltCarrList);
            //绑定事件
            _fltCarrID.unbind('click');
            _fltCarrID.bind('click', fltArgComp.showCarrDown);
            //绘制完成下拉列表后，默认选中第一家航空公司
            var _liList = $('#fltCarrSelID li');
            if (_liList && _liList.length > 1) { _liList.eq(1).click(); }
        },
        drawCarrDown: function (data) {
            //
            var _fltCarrSelID = $('#fltCarrSelID');

            _fltCarrSelID.empty();
            //绘制承运商的dropdown
            var _ul = $('<ul></ul>');
            //第一个元素为请选择，uid的标识为-1 ---去除请选择列表
            //        var _li_o = $('<li><a href="javascript:;">请选择</a></li>');
            //        _li_o.data('UID', -1);
            //        _li_o.data('CarName', "请选择");
            //        _li_o.bind('click', fltArgComp.onCarrClick);
            //        _ul.append(_li_o);

            for (var i = 0; i < data.length; i++) {
                var _li = $('<li><a href="javascript:;" title="' + data[i].Name + '">' + data[i].Name + '</a></a></li>');
                _li.data('UID', data[i].UID);
                _li.data('CarName', data[i].Name);
                _li.bind('click', fltArgComp.onCarrClick);
                _ul.append(_li);
            }
            _fltCarrSelID.append(_ul);
        },
        showCarrDown: function (event) {
            //..
            var _fltCarrSelID = $('#fltCarrSelID');

            event.preventDefault();
            event.stopPropagation();
            if ($(this).hasClass('click_on')) {
                $(this).removeClass('click_on');
                _fltCarrSelID.css('display', 'none');
            } else {
                $(this).addClass('click_on');
                _fltCarrSelID.css('display', '');
            }
        },
        _timeout: null,
        onCarrClick: function (event) {
            var _fltCarrID = $('#fltCarrID'),
            _fltArgComID = $('#fltArgComID');
            //点击，修改data
            _fltCarrID.html($(this).data('CarName') + '<i class="icon i5"></i>');
            _fltCarrID.data('UID', $(this).data('UID'));
            _fltCarrID.data('CarName', $(this).data('CarName'));

            //..
            CM.LoadingHeightFix(_fltArgComID);
            //
            window.clearTimeout(fltArgComp._timeout);
            fltArgComp._timeout = window.setTimeout(function () {
                //发送ajax，获取数据，绘制table
                var _ptDt = dpHeader.getHeadData();
                _ptDt.CarrierUID = _fltCarrID.data('UID');
                //
                $.ajax({
                    url: '../Flight/GetFltArgCompInfo',
                    type: "POST",
                    data: _ptDt,
                    success: function (data) {
                        _fltArgCompInfo = $.parseJSON(data);
                        //绘制table
                        fltArgComp.clearAll();
                        fltArgComp.drawHead();
                        fltArgComp.drawBody(_fltArgCompInfo.ArgCompInfo);
                        fltArgComp.drawFoot(_fltArgCompInfo.TolArgCompInfo);
                    },
                    error: function () {
                        alert('error!');
                    }
                });
            }, 1000);
        },
        drawHead: function () {
            //绘制头部
            var _head = $('<table><thead id="headTableID"></thead></table>');
            $('#fltArgComID').append(_head);
            var _str = ['<tr>'];
            _str.push('<th width="5%">' + corpReport_FlightAvtAgrmt.js_Month + '</th>');
            _str.push('<th width="5%">' + corpReport_FlightAvtAgrmt.js_TotalTickets + '</th>');
            _str.push('<th width="10%">' + corpReport_FlightAvtAgrmt.js_TotalExpenses + '</th>');
            _str.push('<th width="50%">' + corpReport_FlightAvtAgrmt.js_Domestic + '<table><tbody><tr>');
            _str.push('<td width="10%">' + corpReport_FlightAvtAgrmt.js_Tickets + '</td>');
            _str.push('<td width="20%">' + corpReport_FlightAvtAgrmt.js_Expenses + '</td>');
            _str.push('<td width="10%">' + corpReport_FlightAvtAgrmt.js_TicketsY + '</td>');
            _str.push('<td width="20%">' + corpReport_FlightAvtAgrmt.js_AmountY + '</td>');
            _str.push('<td width="20%">' + corpReport_FlightAvtAgrmt.js_TicketsFC + '</td>');
            _str.push('<td width="20%">' + corpReport_FlightAvtAgrmt.js_AmountFC + '</td>');
            _str.push('</tr></tbody></table></th>');
            _str.push('<th width="20%">' + corpReport_FlightAvtAgrmt.js_International + '<table><tbody><tr>');
            _str.push('<td width="50%">' + corpReport_FlightAvtAgrmt.js_Tickets + '</td>');
            _str.push('<td width="50%">' + corpReport_FlightAvtAgrmt.js_Expenses + '</td>');
            _str.push('</tr></tbody></table></th>');
            _str.push('<th width="10%">' + corpReport_FlightAvtAgrmt.js_EstimatedSavings + '</th>');
            _str.push('<th class="null_place"><div></div></th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (data) {
            //绘制整个body
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>');
            $('#fltArgComID').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //no data
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _str = ['<tr>'];
                    _str.push('<td width="5%">' + data[i].Month + '</td>');
                    _str.push('<td width="5%">' + CM.fixData.transData(data[i].TolNumber, 0) + '</td>');
                    _str.push('<td width="10%">' + CM.fixData.transData(data[i].TolConsum, 0) + '</td>');
                    _str.push('<td width="50%"><table><tbody><tr>');
                    _str.push('<td width="10%">' + CM.fixData.transData(data[i].DomNumber, 0) + '</td>');
                    _str.push('<td width="20%">' + CM.fixData.transData(data[i].DomConsum, 0) + '</td>');
                    _str.push('<td width="10%">' + CM.fixData.transData(data[i].DomYNumber, 0) + '</td>');
                    _str.push('<td width="20%">' + CM.fixData.transData(data[i].DomYPrice, 0) + '</td>');
                    _str.push('<td width="20%">' + CM.fixData.transData(data[i].DomFCNumber, 0) + '</td>');
                    _str.push('<td width="20%">' + CM.fixData.transData(data[i].DomFCPrice, 0) + '</td>');
                    _str.push('</tr></tbody></table></td>');
                    _str.push('<td width="20%"><table><tbody><tr>');
                    _str.push('<td width="50%">' + CM.fixData.transData(data[i].IntNumber, 0) + '</td>');
                    _str.push('<td width="50%">' + CM.fixData.transData(data[i].IntPrice, 0) + '</td>');
                    _str.push('</tr></tbody></table></td>');
                    _str.push('<td width="10%">' + CM.fixData.transData(data[i].PreSv, 0) + '</td>');
                    _str.push('</tr>');
                    _bodyTableID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        },
        drawFoot: function (data) {
            //绘制foot
            var _foot = $('<table><tfoot id="footTableID"></tfoot></table>');
            $('#fltArgComID').append(_foot);

            var _str = ['<tr>'];
            _str.push('<td width="5%">' + corpReport_FlightAvtAgrmt.js_Total + '</td>');
            _str.push('<td width="5%">' + CM.fixData.transData(data.TolNumber, 0) + '</td>');
            _str.push('<td width="10%">' + CM.fixData.transData(data.TolConsum, 0) + '</td>');
            _str.push('<td width="50%"><table><tbody><tr>');
            _str.push('<td width="10%">' + CM.fixData.transData(data.TolDomNumber, 0) + '</td>');
            _str.push('<td width="20%">' + CM.fixData.transData(data.TolDomConsum, 0) + '</td>');
            _str.push('<td width="10%">' + CM.fixData.transData(data.TolDomYNumber, 0) + '</td>');
            _str.push('<td width="20%">' + CM.fixData.transData(data.TolDomYPrice, 0) + '</td>');
            _str.push('<td width="20%">' + CM.fixData.transData(data.TolDomFCNumber, 0) + '</td>');
            _str.push('<td width="20%">' + CM.fixData.transData(data.TolDomFCPrice, 0) + '</td>');
            _str.push('</tr></tbody></table></td>');
            _str.push('<td width="20%"><table><tbody><tr>');
            _str.push('<td width="50%">' + CM.fixData.transData(data.TolIntNumber, 0) + '</td>');
            _str.push('<td width="50%">' + CM.fixData.transData(data.TolIntPrice, 0) + '</td>');
            _str.push('</tr></tbody></table></td>');
            _str.push('<td width="10%">' + CM.fixData.transData(data.TolPreSv, 0) + '</td>');
            _str.push('<td class="null_place"><div></div></td></tr>');
            $('#footTableID').append(_str.join(""));
        },
        clearAll: function () {
            $('#fltArgComID').empty();
        }
    };

    //数据修复
    var pageData = {
        init: function () {
            var _argFltConsumID = $('#argFltConsumID');
            _argFltConsumID.css('display', '');

            //初始化静态数据
            if (_cfgInfo.HasAgrFltGeneral == "T") {
                var _str = '<p><span><em>' + corpReport_Common.js_RMBLogo + '</em>' + CM.fixData.transData(_fltAgrInfo.AgrToltalInfo.TolPrice, 0) + '</span>' + corpReport_FlightAvtAgrmt.js_CorpAirlineExpenses + '</p>' +
                       '<p><span>' + _fltAgrInfo.AgrToltalInfo.TolPercent + '</span>' + corpReport_FlightAvtAgrmt.js_CorpAirlinePercentage + '</p>';
                _argFltConsumID.html(_str);
            } else {
                CM.ChargeFix(_argFltConsumID, "payment9.jpg", lanType);
            }
        }
    };

    //
    var flightAvtAgrmtInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //
        $.ajax({
            url: '../Flight/GetFlightAvtAgrmt',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                //初始赋值
                _flightAvtAgrmtInfo = $.parseJSON(data);
                //初始赋值
                _fltAgrInfo = _flightAvtAgrmtInfo.FltAgrInfo;
                _fltCarrList = _flightAvtAgrmtInfo.CarriersList;
                //初始化
                fltArgDis.init();
                pageData.init();
                fltArgComp.init();
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
        flightAvtAgrmtInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..重新访问协议航空
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(1);
    Droco_Funs.getFlightsSubNav(9);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);