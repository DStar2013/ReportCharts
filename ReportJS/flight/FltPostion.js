(function ($) {
    //☆=================== var S ===================☆
    var _flightPositionsInfo, //页面数据
        _positionInfo, //国内舱位分布-国际舱位分布
        _rateInfo, //扣率分布
        _industyInfo; //行业数据
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //国内国际舱位分布
    var posDistu = {
        init: function () {
            var _domPosExID = $('#domPosExID'),
            _intPosExID = $('#intPosExID');
            //国内机票和国际机票开关控制舱位
            if (_cfgInfo.HasInAirTicketProduct == "T") {
                _domPosExID.css('display', '');
                //国内舱位分布
                var _domPostionID = $('#domPostionID'),
                _domDataEmpty = posDistu.checkDataEmpty(_positionInfo.DomPositionInfo);
                //no data
                _domPostionID.empty();
                if (_domDataEmpty) {
                    CM.LineHeightFix(_domPostionID);
                } else {
                    posDistu.drawPieChart(_domPostionID, _positionInfo.DomPositionInfo);
                }

            } else {
                _domPosExID.css('display', 'none');
            }
            //国际
            if (_cfgInfo.HasOutAirTicketProduct == "T") {
                _intPosExID.css('display', '');
                //国际舱位分布
                var _intPostionID = $('#intPostionID'),
                _intDataEmpty = posDistu.checkDataEmpty(_positionInfo.IntPositionInfo);
                //no data
                _intPostionID.empty();
                if (_intDataEmpty) {
                    CM.LineHeightFix(_intPostionID);
                } else {
                    posDistu.drawPieChart(_intPostionID, _positionInfo.IntPositionInfo);
                }

            } else {
                _intPosExID.css('display', 'none');
            }

        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Number > 0) { return false; }
            }
            return true;
        },
        drawPieChart: function (content, dt) {
            var data = [],
            _d = {};
            _d.type = "pie";
            _d.name = "舱位分布";
            _d.data = posDistu.getData(dt);
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
                        size: '70%',
                        center: ['50%', '32%'],
                        showInLegend: true,
                        dataLabels: {
                            enabled: false,
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
                        return '<b>' + this.point.name + '</b><br/>' +
                           corpReport_FlightPositions.js_CabinClassOrderAmount + ': ' + CM.fixData.transData(this.point.y, 0) + '<br/>' +
                           corpReport_FlightPositions.js_PERCENT + ': ' + this.percentage.toFixed(1) + '%'
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
        getData: function (data) {
            var _d = [];
            for (var i = 0; i < data.length; i++) {
                var _s = {};
                _s.name = data[i].Name;
                _s.y = data[i].Number;
                _d[i] = _s;
            }
            return _d;
        }
    };

    //扣率分布
    var rateDis = {
        init: function () {
            rateDis.drawHead();
            rateDis.drawBody(_rateInfo.RateDistuInfo);
        },
        drawHead: function () {
            //绘制table的头部
            var _head = $('<table><thead id="headTableID"></thead></table>');
            $('#rateDisID').append(_head);
            var _str = ['<tr>'];
            _str.push('<th width="30%">' + corpReport_FlightPositions.js_DiscountRates + '</th>');
            _str.push('<th width="20%">' + corpReport_FlightPositions.js_Tickets + '</th>');
            _str.push('<th width="50%">' + corpReport_FlightPositions.js_Percentage + '</th>');
            _str.push('<th class="null_place"><div></div></th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (data) {
            //绘制table
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>');
            $('#rateDisID').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //nodata
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _str = ['<tr>'];
                    _str.push('<td width="30%">' + data[i].Range + '</td>');
                    _str.push('<td width="20%">' + CM.fixData.transData(data[i].Number, 0) + '</td>');
                    _str.push('<td width="50%"><div class="progress_bar"><div class="progress" style="width:' + data[i].Percent + ';"><span>' + data[i].Percent + '</span></div></div></td></tr>');
                    _bodyTableID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        }
    };

    //行业数据
    var industry = {
        init: function () {
            var _induSelID = $('#induSelID'),
            _indEmpID = $('#indEmpID'),
            _induDivID = $('#induDivID'),
            _induBaseID = $('#induBaseID');

            _induBaseID.css('display', '');
            _induDivID.css('display', '');
            _indEmpID.css('display', 'none');
            //行业数据为空
            if (_industyInfo.IndustyInfo && _industyInfo.IndustyInfo.length > 0) {
                //0-全票价，1-平均折扣
                industry.drawPic(0, _industyInfo.IndustyInfo, "Percent");
                //绑定事件
                _induSelID.find('input').bind('change', industry.onSelectChange);
            } else {
                _induBaseID.css('display', 'none');
                _induDivID.css('display', 'none');
                _indEmpID.css('display', '');
            }
        },
        sortArray: function (data, pInfo, type) {
            if (data) {
                return data.sort(function (a, b) {
                    if (type == "Desc") {
                        //降序
                        return b[pInfo] - a[pInfo];
                    } else {
                        //升序
                        return a[pInfo] - b[pInfo];
                    }
                });
            }
        },
        drawPic: function (index, dt, pInfo) {
            //全票价比，最大小于50%.平均折扣最小值大于0.5，做扩容处理
            var _numLeftID = $('#numLeftID'),
            _numRightID = $('#numRightID'),
            _induDivID = $('#induDivID'),
            _proLenID = $('#proLenID'),
            sortedData,
            _tStart = 0;
            sortedData = industry.sortArray(dt, pInfo, "Asc");
            //

            if (sortedData.length > 0) {
                if (index == 0) {
                    //全票价比例
                    _numLeftID.html('0%');
                    _numRightID.html((sortedData[sortedData.length - 1][pInfo] * 100).toFixed(0) + '%');
                    if (sortedData[0][pInfo] > 0.5) {
                        _tStart = 0.5;
                        _numLeftID.html('50%');
                    }
                } else {
                    //折扣
                    _numLeftID.html('0');
                    _numRightID.html(sortedData[sortedData.length - 1][pInfo]);
                    if (sortedData[0][pInfo] > 0.5) {
                        _tStart = 0.5;
                        _numLeftID.html('0.5');
                    }
                }
            } else {
                _numLeftID.html('0');
                _numRightID.html('1');
            }

            //初始所有class清空
            _induDivID.find('.progress_info').removeClass('type1 type2 type3 type4 type5 type6 type7 type8');
            for (var i = 0; i < sortedData.length; i++) {
                //显示长度
                var _width,
                _mole = sortedData[sortedData.length - 1][pInfo] - _tStart;
                if (_mole > 0) {
                    //修正 0.01 防止超出
                    if (i == 0) {
                        _width = ((sortedData[i][pInfo] - _tStart) / _mole * 100 - 0.01).toFixed(2) + "%";
                    } else {
                        _width = ((sortedData[i][pInfo] - sortedData[i - 1][pInfo]) / _mole * 100 - 0.01).toFixed(2) + "%";
                    }
                } else {
                    _width = "0%";
                }
                _proLenID.find('.progress').eq(i).css('width', _width);

                //
                var _pInfoD;
                if (pInfo == "Percent") {
                    _pInfoD = (sortedData[i][pInfo] * 100).toFixed(0) + '%';
                } else {
                    _pInfoD = sortedData[i][pInfo];
                }
                //
                var iStr = (sortedData[i].MK == 0) ? "<i></i>" : "<i class='color'></i>";
                var _left = 0,
                _iDiv = _induDivID.find('.progress_info').eq(i);
                switch (i) {
                    case 0:
                        _iDiv.addClass((sortedData[i].MK == 0) ? "type1" : "type7");
                        _iDiv.html('<span class="bubble_wrap"><span class="bubble_inner">' + sortedData[i].Name + ' ' + _pInfoD + '</span></span>' + iStr);
                        //气泡位置
                        _left = _proLenID.find('.color1').width() - _iDiv.eq(i).width() + 15;
                        break;
                    case 1:
                        _iDiv.addClass((sortedData[i].MK == 0) ? "type2" : "type8");
                        _iDiv.html(iStr + '<span class="bubble_wrap"><span class="bubble_inner">' + sortedData[i].Name + ' ' + _pInfoD + '</span></span>');
                        //气泡位置
                        _left = _proLenID.find('.color1').width() + _proLenID.find('.color2').width() - _iDiv.width() + 15;
                        break;
                    case 2:
                        _iDiv.addClass((sortedData[i].MK == 0) ? "type5" : "type3");
                        _iDiv.html('<span class="bubble_wrap"><span class="bubble_inner">' + sortedData[i].Name + ' ' + _pInfoD + '</span></span>' + iStr);
                        //气泡位置
                        _left = _proLenID.find('.color1').width() + _proLenID.find('.color2').width() + _proLenID.find('.color3').width() - 15;
                        break;
                    case 3:
                        _iDiv.addClass((sortedData[i].MK == 0) ? "type6" : "type4");
                        _iDiv.html(iStr + '<span class="bubble_wrap"><span class="bubble_inner">' + sortedData[i].Name + ' ' + _pInfoD + '</span></span>');
                        //气泡位置
                        _left = _proLenID.find('.color1').width() + _proLenID.find('.color2').width() + _proLenID.find('.color3').width() + _proLenID.find('.color4').width() - 15;
                        break;
                    default:
                        console.log('超过四个值');
                }
                //橙色气泡最高
                if (sortedData[i].MK == 1) { _iDiv.css("z-index", "10"); }
                //定位气泡位置
                _iDiv.css('left', _left + 'px');
            }
        },
        onSelectChange: function (event) {
            if ($(this).val() == "0") {
                industry.drawPic(0, _industyInfo.IndustyInfo, "Percent");
            } else {
                industry.drawPic(1, _industyInfo.IndustyInfo, "AvgDis");
            }
        }
    };

    //
    var flightPositionsInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //
        $.ajax({
            url: '../Flight/GetFlightPositions',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                //初始赋值
                _flightPositionsInfo = $.parseJSON(data);
                //初始赋值
                _positionInfo = _flightPositionsInfo.PositionInfo;
                _rateInfo = _flightPositionsInfo.RateInfo;
                _industyInfo = _flightPositionsInfo.IndustyInfo;

                //初始化
                posDistu.init();
                rateDis.init();
                industry.init();  //油表图
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
        flightPositionsInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..重新访问舱位
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(1);
    Droco_Funs.getFlightsSubNav(3);
    Droco_Funs.getFilterBar();
    Droco_Funs.getFooter();
})(jQuery);