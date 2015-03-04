(function ($) {
    //☆=================== var S ===================☆
    var _hotelSvALsInfo, //页面数据
        _htlRCDetail, //酒店RC明细
        _htlSaveInfo, //酒店节省
        _htlTop5RC; //前5酒店RC
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //酒店节省
    var htlSave = {
        _htlSvDt: [],
        init: function () {
            //.
            var _htlSaveID = $('#htlSaveID'),
            _htlSaveSelID = $('#htlSaveSelID');

            _htlSaveSelID.css('display', '');
            _htlSaveID.css('display', '');

            if (_cfgInfo.HasHtlSave == "T") {
                _htlSaveSelID.empty();
                //季度月度存在与否
                if (_cfgInfo.HasMonthlyData == "T" && _cfgInfo.HasQuarterData == "T") {
                    _htlSaveSelID.append('<label><input type="radio" name="option" checked value="0">' + corpReport_HotelSvALs.js_Monthly + '</label><label><input type="radio" name="option" value="1">' + corpReport_HotelSvALs.js_Quarterly + '</label>');
                    _htlSaveSelID.find('input').bind('change', htlSave.onSelectChange);
                    //..
                    htlSave.getMonArgInfo(0);
                    htlSave.dwLine();
                } else if (_cfgInfo.HasMonthlyData == "T" && _cfgInfo.HasQuarterData == "F") {
                    _htlSaveSelID.append('<label><input type="radio" name="option" checked value="0">' + corpReport_HotelSvALs.js_Monthly + '</label>');
                    //..
                    htlSave.getMonArgInfo(0);
                    htlSave.dwLine();
                } else if (_cfgInfo.HasMonthlyData == "F" && _cfgInfo.HasQuarterData == "T") {
                    _htlSaveSelID.append('<label><input type="radio" name="option" checked value="1">' + corpReport_HotelSvALs.js_Quarterly + '</label>');
                    //..
                    htlSave.getMonArgInfo(1);
                    htlSave.dwLine();
                } else {
                    _htlSaveSelID.css('display', 'none');
                }
            } else {
                _htlSaveSelID.css('display', 'none');
                //charge
                CM.ChargeFix(_htlSaveID, "payment6.jpg", lanType);
            }
        },
        getMonArgInfo: function (index) {
            //0-月度 1-季度
            htlSave._htlSvDt = [];
            //..
            htlSave._htlSvDt.push({
                Name: corpReport_HotelSvALs.js_HotelSavings,
                Data: (index == 0) ? _htlSaveInfo.HtlSaveMoth : _htlSaveInfo.HtlSaveQuar
            });
        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Data.length > 0) { return false; }
            }
            return true;
        },
        dwLine: function () {
            var _htlSaveID = $('#htlSaveID'),
            _lineEmpty = htlSave.checkDataEmpty(htlSave._htlSvDt);
            //no data
            _htlSaveID.empty();
            if (_lineEmpty) {
                CM.LineHeightFix(_htlSaveID);
            } else {
                htlSave.drawLine(_htlSaveID, htlSave._htlSvDt);
            }
        },
        drawLine: function (content, dt) {
            var xData = htlSave.getXSeries(dt[0].Data);
            var yData = [];
            yData[0] = htlSave.getYSeries(dt[0].Data, dt[0].Name);

            //绘图
            content.highcharts({
                chart: {
                    type: 'line',
                    marginBottom: 36
                },
                colors: ['#ffa60c'],
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
                    labels: {
                        formatter: function () {
                            return (this.value * 100).toFixed(1) + '%';
                        }
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
                        _str = [];
                        _str.push('<b>' + this.x + '</b><br/>');
                        for (var i = 0; i < _p.length; i++) {
                            _str.push(_p[i].series.name + ': ' + (_p[i].y * 100).toFixed(1) + '%<br/>');
                        }
                        return _str.join("");
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
                _d[i] = data[i].Percent;
            }
            _m.data = _d;
            return _m;
        },
        onSelectChange: function () {
            if ($(this).val() == "0") {
                htlSave.getMonArgInfo(0);
                htlSave.dwLine();
            } else {
                htlSave.getMonArgInfo(1);
                htlSave.dwLine();
            }
        }
    };

    //酒店前5RC分布
    var htlTop5RC = {
        init: function () {
            var _htlTop5RCID = $('#htlTop5RCID');

            _htlTop5RCID.css('display', '');
            _htlTop5RCID.empty();

            if (_cfgInfo.HasHtlRCTop5 == "T") {
                //no data
                if (_htlTop5RC.HtlRC.length > 0) {
                    htlTop5RC.drawPieChart(_htlTop5RCID, _htlTop5RC.HtlRC);
                } else {
                    CM.LineHeightFix(_htlTop5RCID);
                }
            } else {
                //charge
                CM.ChargeFix(_htlTop5RCID, "payment8.jpg", lanType);
            }
        },
        drawPieChart: function (content, dt) {
            var data = [],
            _d = {};
            _d.type = "pie";
            _d.name = "消费金额";
            _d.data = htlTop5RC.getData(dt);
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
                        center: ['60%', '32%'],
                        dataLabels: {
                            enabled: true,
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
                                 +this.point.y + corpReport_HotelSvALs.js_RoomNights + '<br/>' +
                            corpReport_HotelSvALs.js_Percent + ': ' + this.percentage.toFixed(1) + '%'
                    }
                },
                legend: {
                    floating: true,
                    borderWidth: 0,
                    shadow: false,
                    y: 11,
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
                //_s.code = data[i].RCCode;
                _s.name = data[i].RCCode;
                _s.detail = data[i].RCName;
                _s.y = data[i].Quantity;
                _d[i] = _s;
            }
            return _d;
        }
    };

    //酒店RC明细
    var htlRCDetail = {
        init: function () {
            var _htlRCDetailID = $('#htlRCDetailID');
            //绘制table表格
            htlRCDetail.clearAll();

            //酒店RC明细开关
            if (_cfgInfo.HasHtlRCDetail == "T") {
                htlRCDetail.drawHead();
                htlRCDetail.drawBody(_htlRCDetail.HtlRC);
                htlRCDetail.drawFoot(_htlRCDetail.TolHtlRCDetail);
            } else {
                _htlRCDetailID.height(250);
                CM.ChargeFix(_htlRCDetailID, "payment7.jpg", lanType);
            }
        },
        drawHead: function () {
            //绘制头部
            var _head = $('<table><thead id="headTableID"></thead>');
            $('#htlRCDetailID').append(_head);
            //live on
            $('#headTableID').on('click', '[ckMark="1"]', htlRCDetail.onHeadClick);
            //
            var _str = ['<tr>'];
            _str.push('<th width="25%">' + corpReport_HotelSvALs.js_HotelRC + '</th>');
            _str.push('<th width="20%" class="sequence" ckMark="1" pInfo="Number">' + corpReport_HotelSvALs.js_RoomNights + ' <i class="icon i7"></i></th>');
            _str.push('<th width="20%" ckMark="1" pInfo="Price">' + corpReport_HotelSvALs.js_Amount + '</th>');
            _str.push('<th width="35%">' + corpReport_HotelSvALs.js_PerofRoomNight + '</th>');
            _str.push('<th class="null_place"><div></div></th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (data) {
            //绘制整个body
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>'),
            _p = $('<p class="des_layer" id="desFadeID" style="display:none;position: absolute;"></p>');

            $('#htlRCDetailID').append(_body).append(_p);
            var _bodyTableID = $('#bodyTableID');

            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _str = ['<tr>'];
                    _str.push('<td width="25%"><span name="RCFadeID" index=' + i + ' RCInfo="' + data[i].Info + '">' + data[i].Code + '</span></td>');
                    _str.push('<td width="20%">' + CM.fixData.transData(data[i].Number, 0) + '</td>');
                    _str.push('<td width="20%" align="right">' + CM.fixData.transData(data[i].Price, 0) + '</td>');
                    _str.push('<td width="35%">' + data[i].Precent + '</td>');
                    _bodyTableID.append(_str.join(""));
                }
                //浮层
                var el = $('#desFadeID');
                _bodyTableID.find('[name="RCFadeID"]').bind('mouseover touchstart', function () {
                    var _top = 50 + $(this).attr('index') * 21 + 'px';
                    el.data('fi', window.setTimeout(function () { el.css({ 'display': '', 'top': _top }); }, 150));
                    el.html($(this).attr('RCInfo'));
                    window.clearTimeout(el.data('fo'));
                }).bind('mouseout', function () {
                    window.clearTimeout(el.data('fi'));
                    el.data('fo', window.setTimeout(function () { el.css('display', 'none'); }, 500));
                });
                //浮层的绑定事件
                el.bind('mouseover touchstart', function () { window.clearTimeout(el.data('fo')); })
              .bind('mouseout', function () { window.clearTimeout(el.data('fi')); el.data('fo', window.setTimeout(function () { el.css('display', 'none'); }, 500)); });
            } else {
                CM.LineHeightFix(_body);
            }
        },
        drawFoot: function (data) {
            //绘制foot部分
            var _foot = $('<table><tfoot id="footTableID"></tfoot></table>');
            $('#htlRCDetailID').append(_foot);
            var _str = ['<tr>'];
            _str.push('<td width="25%">' + corpReport_HotelSvALs.js_Total + '</td>');
            _str.push('<td width="20%">' + CM.fixData.transData(data.TolNumber, 0) + '</td>');
            _str.push('<td width="20%" align="right">' + CM.fixData.transData(data.TolPrice, 0) + '</td>');
            _str.push('<td width="35%">100%</td>');
            _str.push('<td class="null_place"><div></div></td></tr>');
            $('#footTableID').append(_str.join(""));
        },
        clearAll: function () {
            $('#htlRCDetailID').empty();
        },
        sortArray: function (content, type) {
            var data = _htlRCDetail.HtlRC;
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
                    sortedData = htlRCDetail.sortArray(content, "Asc");
                } else {
                    content.find('.icon').removeClass('i6');
                    content.find('.icon').addClass('i7');
                    sortedData = htlRCDetail.sortArray(content, "Desc");
                }
            } else {
                //清空所有头部
                $('#headTableID').find('th.sequence').removeClass("sequence");
                $('#headTableID').find('th').find('.icon').remove();
                //初始按照从大到小排序
                content.append('<i class="icon i7"></i>');
                content.addClass("sequence");
                sortedData = htlRCDetail.sortArray(content, "Desc");
            }
            //重新绘制body和footer
            htlRCDetail.clearBdFt();
            htlRCDetail.drawBody(sortedData);
            htlRCDetail.drawFoot(_htlRCDetail.TolHtlRCDetail);
        },
        clearBdFt: function () {
            $('#bodyTableID').parent().parent().remove();
            $('#desFadeID').remove();
            $('#footTableID').parent().remove();
        }
    };

    //
    var hotelSvALsInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //
        $.ajax({
            url: '../Hotel/GetHotelSvALs',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                //初始赋值
                _hotelSvALsInfo = $.parseJSON(data);
                //初始赋值
                _htlSaveInfo = _hotelSvALsInfo.HotelSave;
                _htlRCDetail = _hotelSvALsInfo.HotelRCDetail;
                _htlTop5RC = _hotelSvALsInfo.HotelTop5RC;
                //初始化
                htlTop5RC.init();
                htlRCDetail.init();
                htlSave.init();
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
        CM.hrefChange($('#htlSubNavID').find('a'), _headSelectInfo);
        hotelSvALsInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(2);
    Droco_Funs.getHotelSubNav(4);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);