(function ($) {
    //☆=================== var S ===================☆
    var _hotelStarInfo, //页面数据
        _starPerInfo,   //酒店星级
        _htlHosInfo,   //房价对比
        _starLvInfo;
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    var starPerc = {
        init: function () {
            //..
            var _htlAgrStarID = $('#htlAgrStarID'),
            _htlArgNightID = $('#htlArgNightID'),
            _htlMbrStarID = $('#htlMbrStarID'),
            _htlMbrNightID = $('#htlMbrNightID');

            //协议
            _htlAgrStarID.empty();
            if (_starPerInfo.AgrHotelInfo && _starPerInfo.AgrHotelInfo.length > 0) {
                starPerc.drawPieChart(_htlAgrStarID, _starPerInfo.AgrHotelInfo);
            } else {
                CM.LineHeightFix(_htlAgrStarID);
            }
            starPerc.drawNightPrice(_htlArgNightID, _starPerInfo.AgrHotelInfo);

            //会员
            _htlMbrStarID.empty();
            if (_starPerInfo.MbrHotelInfo.length > 0) {
                starPerc.drawPieChart(_htlMbrStarID, _starPerInfo.MbrHotelInfo);
            } else {
                CM.LineHeightFix(_htlMbrStarID);
            }
            starPerc.drawNightPrice(_htlMbrNightID, _starPerInfo.MbrHotelInfo);

        },
        drawNightPrice: function (content, dt) {
            content.empty();
            if (dt && dt.length > 0) {
                //var tolPrice = 0;
                var maxPrice = 0;
                //计算tol，修改为max作为基数
                for (var i = 0; i < dt.length; i++) {
                    //tolPrice += dt[i].Price;
                    if (dt[i].Price > maxPrice) {
                        maxPrice = dt[i].Price;
                    }
                }
                //喷入
                for (var i = 0; i < dt.length; i++) {
                    var _iPercent,
                    _iin = ((dt[i].Price / maxPrice) * 100).toFixed(1);
                    //默认给个百分之1的最小值
                    if (dt[i].Price > 0 && _iin < 1) {
                        _iPercent = '1%';
                    } else {
                        _iPercent = _iin + '%';
                    }
                    //_iPercent = ((dt[i].Price / maxPrice) * 100).toFixed(1) + '%';

                    content.prepend('<li><span style="width:' + _iPercent + ';"></span><em><i>' + corpReport_Common.js_RMBLogo + '</i>' + CM.fixData.transData(dt[i].Price, 0) + '</em></li>');
                }
            } else {
                for (var i = 0; i < 4; i++) {
                    content.prepend('<li><span style="width: 0%;"></span><em><i></i></em></li>');
                }
            }

            //第一个li
            content.find('li').eq(0).addClass('no_border');
        },
        drawPieChart: function (content, dt) {
            var data = [],
            _d = {};
            _d.type = "pie";
            _d.data = starPerc.getPieData(dt);
            data[0] = _d;

            content.highcharts({
                colors: ['#1c76ec', '#398eff', '#56a0ff', '#79b3ff', '#9ec8ff', '#c5dfff'],
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
                            corpReport_HotelStar.js_RoomNights + ':  ' + CM.fixData.transData(this.point.y, 0) + '<br/>' +
                            corpReport_HotelStar.js_Percent + ': ' + this.percentage.toFixed(1) + '%';
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
                    y: 13,
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
        getPieData: function (dt) {
            var _d = [];
            for (var i = 0; i < dt.length; i++) {
                var _s = {};
                _s.name = dt[i].StarLv;
                _s.y = dt[i].NightNum;
                _d[i] = _s;
            }
            return _d;
        }

    };

    //绘制table
    var cityHosPric = {
        init: function () {
            //.
            var _htlStarLvID = $('#htlStarLvID'),
            _htlStarLvSelID = $('#htlStarLvSelID');

            _htlStarLvID.unbind('click');
            _htlStarLvID.bind('click', cityHosPric.showDropDown);
            //drop click
            _htlStarLvSelID.find('li').unbind('click');
            _htlStarLvSelID.find('li').bind('click', cityHosPric.onDataClick);

            //绘制table
            cityHosPric.drawTable(_htlHosInfo);
        },
        drawTable: function (dt) {
            var _htlMbrTabID = $('#htlMbrTabID'),
            _htlArgTabID = $('#htlArgTabID');

            //index为0会员. 1协议
            cityHosPric.clearAll(_htlMbrTabID);
            cityHosPric.drawHead(_htlMbrTabID, 0);
            cityHosPric.drawBody(_htlMbrTabID, dt.MbrHoseInfo, 0);
            cityHosPric.drawFoot(_htlMbrTabID, dt.TolMbrHoseInfo, 0);
            //
            cityHosPric.clearAll(_htlArgTabID);
            cityHosPric.drawHead(_htlArgTabID, 1);
            cityHosPric.drawBody(_htlArgTabID, dt.ArgHoseInfo, 1);
            cityHosPric.drawFoot(_htlArgTabID, dt.TolArgHoseInfo, 1);
        },
        drawHead: function (content, index) {
            var _str = [];
            //
            if (index == 0) {
                var _head = $('<table><thead id="headTableMbrID"></thead></table>');
                content.append(_head);
                //live on
                $('#headTableMbrID').on('click', '[ckMark="0"]', cityHosPric.onHeadClick);
                //
                _str.push('<tr><th width="20%">' + corpReport_HotelStar.js_City + '</th>');
                _str.push('<th width="20%" class="sequence" ckMark="0" pInfo="Night">' + corpReport_HotelStar.js_RoomNights + '<i class="icon i7"></i></th>');
                _str.push('<th width="30%" ckMark="0" pInfo="AvgPrice">' + corpReport_HotelStar.js_AvgDailyRate + '</th>');
                _str.push('<th width="30%" ckMark="0" pInfo="CtripAvgPrice">' + corpReport_HotelStar.js_AvgMemHotelDailyRate + '</th>');
                _str.push('<th class="null_place"><div></div></th></tr>');
                $('#headTableMbrID').append(_str.join(""));
            } else {
                var _head = $('<table><thead id="headTableArgID"></thead></table>');
                content.append(_head);
                //live on
                $('#headTableArgID').on('click', '[ckMark="1"]', cityHosPric.onHeadClick);
                //
                _str.push('<tr><th width="20%">' + corpReport_HotelStar.js_City + '</th>');
                _str.push('<th width="20%" class="sequence" ckMark="1" pInfo="Night">' + corpReport_HotelStar.js_RoomNights + '<i class="icon i7"></i></th>');
                _str.push('<th width="30%" ckMark="1" pInfo="AvgPrice">' + corpReport_HotelStar.js_AvgDailyRate + '</th>');
                _str.push('<th width="30%" ckMark="1" pInfo="CtripAvgPrice">' + corpReport_HotelStar.js_AvgCorpHotelDailyRate + '</th>');
                _str.push('<th class="null_place"><div></div></th></tr>');
                $('#headTableArgID').append(_str.join(""));
            }
        },
        drawBody: function (content, dt, index) {
            var _body = (index == 0) ? $('<div class="tbody"><table><tbody id="bodyTableMbrID"></tbody></table></div>') : $('<div class="tbody"><table><tbody id="bodyTableArgID"></tbody></table></div>');
            content.append(_body);
            var _bodyTableMbrID = $('#bodyTableMbrID'),
            _bodyTableArgID = $('#bodyTableArgID');
            //

            if (dt && dt.length > 0) {
                for (var i = 0; i < dt.length; i++) {
                    var _str = ['<tr>'];
                    _str.push('<td width="20%">' + dt[i].Name + '</td>');
                    _str.push('<td width="20%">' + CM.fixData.transData(dt[i].Night, 0) + '</td>');
                    _str.push('<td width="30%">' + CM.fixData.transData(dt[i].AvgPrice, 0) + '</td>');
                    _str.push('<td width="30%">' + CM.fixData.transData(dt[i].CtripAvgPrice, 0) + '</td></tr>');
                    (index == 0) ? _bodyTableMbrID.append(_str.join("")) : _bodyTableArgID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        },
        drawFoot: function (content, dt, index) {
            var _foot = (index == 0) ? $('<table><tfoot id="footTableMbrID"></tfoot></table>') : $('<table><tfoot id="footTableArgID"></tfoot></table>');
            content.append(_foot);
            //..
            if (dt) {
                var _str = '<tr>' +
                   '<td width="20%">' + corpReport_HotelStar.js_Total + '</td>' +
                   '<td width="20%">' + CM.fixData.transData(dt.TolNight, 0) + '</td>' +
                   '<td width="30%">' + CM.fixData.transData(dt.TolAvgPrice, 0) + '</td>' +
                   '<td width="30%">' + CM.fixData.transData(dt.TolCtripAvgPrice, 0) + '</td>';
                _str = _str + '<td class="null_place"><div></div></td></tr>';
                (index == 0) ? $('#footTableMbrID').append(_str) : $('#footTableArgID').append(_str);
            }
        },
        showDropDown: function (event) {
            event.preventDefault();
            event.stopPropagation();
            if ($('#htlStarLvID').hasClass('click_on')) {
                $('#htlStarLvSelID').css('display', 'none');
                $('#htlStarLvID').removeClass('click_on');
            } else {
                $('#htlStarLvSelID').css('display', '');
                $('#htlStarLvID').addClass('click_on');
            }
        },
        hideDropDown: function () {
            $('#htlStarLvSelID').css('display', 'none');
            $('#htlStarLvID').removeClass('click_on');
        },
        _timeout: null,
        onDataClick: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var _htlStarLvID = $('#htlStarLvID'),
            _htlArgTabID = $('#htlArgTabID'),
            _htlMbrTabID = $('#htlMbrTabID');

            _htlStarLvID.html($(this).text() + '<i class="icon i5"></i>');
            _htlStarLvID.attr('mark', $(this).find('a').attr('mark'));
            cityHosPric.hideDropDown();
            var _ct = $(this);
            //点击loading
            CM.LoadingHeightFix(_htlArgTabID);
            CM.LoadingHeightFix(_htlMbrTabID);

            window.clearTimeout(cityHosPric._timeout);
            cityHosPric._timeout = window.setTimeout(function () {
                //ajax请求获取数据
                if (_ct.find('a').attr('mark') == '0') {
                    cityHosPric.drawTable(_htlHosInfo);
                } else {
                    //发送ajax，获取数据，绘制table
                    var _ptDt = dpHeader.getHeadData();
                    _ptDt.HotelStar = _ct.find('a').attr('mark');
                    //
                    $.ajax({
                        url: '../Hotel/GetHotelStarCity',
                        type: "POST",
                        data: _ptDt,
                        success: function (data) {
                            _starLvInfo = $.parseJSON(data);
                            //绘制table
                            cityHosPric.drawTable(_starLvInfo);
                        },
                        error: function () {
                            alert('error!');
                        }
                    });
                }
            }, 100);
        },
        clearAll: function (content) {
            content.empty();
        },
        sortArray: function (content, type, index) {
            var data = (index == 0) ? _htlHosInfo.MbrHoseInfo : _htlHosInfo.ArgHoseInfo;
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
                content = $(this),
                index = content.attr('ckMark') == "0" ? 0 : 1;
            if (content.hasClass("sequence")) {
                //从大大小和从小到大的切换
                if (content.find('.icon') && content.find('.icon').hasClass("i7")) {
                    content.find('.icon').removeClass('i7');
                    content.find('.icon').addClass('i6');
                    sortedData = cityHosPric.sortArray(content, "Asc", index);
                } else {
                    content.find('.icon').removeClass('i6');
                    content.find('.icon').addClass('i7');
                    sortedData = cityHosPric.sortArray(content, "Desc", index);
                }
            } else {
                //清空所有头部
                if (index == 0) {
                    $('#headTableMbrID').find('th.sequence').removeClass("sequence");
                    $('#headTableMbrID').find('th').find('.icon').remove();
                } else {
                    $('#headTableArgID').find('th.sequence').removeClass("sequence");
                    $('#headTableArgID').find('th').find('.icon').remove();
                }
                //初始按照从大到小排序
                content.append('<i class="icon i7"></i>');
                content.addClass("sequence");
                sortedData = cityHosPric.sortArray(content, "Desc", index);
            }
            //重新绘制body和footer
            cityHosPric.clearBdFt(index);
            if (index == 0) {
                cityHosPric.drawBody($('#htlMbrTabID'), sortedData, 0);
                cityHosPric.drawFoot($('#htlMbrTabID'), _htlHosInfo.TolMbrHoseInfo, 0);
            } else {
                cityHosPric.drawBody($('#htlArgTabID'), sortedData, 1);
                cityHosPric.drawFoot($('#htlArgTabID'), _htlHosInfo.TolArgHoseInfo, 1);
            }
        },
        clearBdFt: function (index) {
            if (index == 0) {
                $('#bodyTableMbrID').parent().parent().remove();
                $('#footTableMbrID').parent().remove();
            } else {
                $('#bodyTableArgID').parent().parent().remove();
                $('#footTableArgID').parent().remove();
            }
        }
    };

    //
    var hotelStarInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //
        $.ajax({
            url: '../Hotel/GetHotelStar',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                //初始赋值
                _hotelStarInfo = $.parseJSON(data);
                //初始赋值
                _starPerInfo = _hotelStarInfo.HotelStarPerInfo;
                _htlHosInfo = _hotelStarInfo.HotelHosInfo;
                //初始化
                starPerc.init();
                //绘制图表
                cityHosPric.init();
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
        hotelStarInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(2);
    Droco_Funs.getHotelSubNav(2);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);