(function ($) {
    //☆=================== var S ===================☆
    var _filghtSvALsInfo, //页面数据
        _fltSvALsInfo, //国内节省-国际节省-国内损失 
        _fltConStuInfo,  //消费结构分析
        _fltLsDetInfo,   //国内：RC-RC浮层信息-成交净价-最低航班价格-损失-损失分布  国际：如果没有，则为空[]
        _fltDepDetailInfo; //部门
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //节省与损失
    var fltSvLs = {
        _fltSvLsInfo: [],
        init: function () {
            //
            var _fltSvExID = $('#fltSvExID'),
            _fltSvLsSelID = $('#fltSvLsSelID'),
            _f = [];

            _fltSvExID.css('display', '');
            _fltSvLsSelID.empty();
            //月度季度开关
            if (_cfgInfo.HasMonthlyData == "T" && _cfgInfo.HasQuarterData == "T") {
                _f.push('<label><input type="radio" name="option" value="0" checked>' + corpReport_FlightSvALs.js_Monthly + '</label>');
                _f.push('<label><input type="radio" name="option" value="1">' + corpReport_FlightSvALs.js_Quarterly + '</label>');
                _fltSvLsSelID.append(_f.join(""));
                _fltSvLsSelID.find('input').bind('change', fltSvLs.onSelectChange);
                //
                fltSvLs.getMonArgInfo(0);
                fltSvLs.dwLine();
            } else if (_cfgInfo.HasMonthlyData == "T" && _cfgInfo.HasQuarterData == "F") {
                _f.push('<label><input type="radio" name="option" value="0" checked>' + corpReport_FlightSvALs.js_Monthly + '</label>');
                _fltSvLsSelID.append(_f.join(""));
                //
                fltSvLs.getMonArgInfo(0);
                fltSvLs.dwLine();
            } else if (_cfgInfo.HasMonthlyData == "F" && _cfgInfo.HasQuarterData == "T") {
                _f.push('<label><input type="radio" name="option" value="1" checked>' + corpReport_FlightSvALs.js_Quarterly + '</label>');
                _fltSvLsSelID.append(_f.join(""));
                //
                fltSvLs.getMonArgInfo(1);
                fltSvLs.dwLine();
            } else {
                _fltSvExID.css('display', 'none');
            }

        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Data.length > 0) { return false; }
            }
            return true;
        },
        dwLine: function () {
            var _fltSvLsID = $('#fltSvLsID'),
            _emptyData = fltSvLs.checkDataEmpty(fltSvLs._fltSvLsInfo);
            //no data
            _fltSvLsID.empty();
            if (_emptyData) {
                CM.LineHeightFix(_fltSvLsID);
            } else {
                fltSvLs.drawLine(_fltSvLsID, fltSvLs._fltSvLsInfo);
            }

        },
        getMonArgInfo: function (index) {
            //0-月度，1-季度
            fltSvLs._fltSvLsInfo = [];

            //国内机票是否存在
            if (_cfgInfo.HasInAirTicketProduct == "T") {
                //存入国内节省和国内损失
                fltSvLs._fltSvLsInfo.push({
                    Name: corpReport_FlightSvALs.js_DomSavings,
                    Data: (index == 0) ? _fltSvALsInfo.DomSvMoth : _fltSvALsInfo.DomSvQuar
                });
                //国内损失
                fltSvLs._fltSvLsInfo.push({
                    Name: corpReport_FlightSvALs.js_DomMissedSavings,
                    Data: (index == 0) ? _fltSvALsInfo.DomLsMoth : _fltSvALsInfo.DomLsQuar
                });
            }

            //国际机票是否存在
            if (_cfgInfo.HasOutAirTicketProduct == "T") {
                //存入国际机票
                fltSvLs._fltSvLsInfo.push({
                    Name: corpReport_FlightSvALs.js_IntSavings,
                    Data: (index == 0) ? _fltSvALsInfo.IntSvMoth : _fltSvALsInfo.IntSvQuar
                });
            }
        },
        drawLine: function (content, dt) {
            var xData = fltSvLs.getXSeries(dt[0].Data);

            var yData = [];
            for (var i = 0; i < dt.length; i++) {
                yData[i] = fltSvLs.getYSeries(dt[i].Data, dt[i].Name);
            }
            //绘图
            content.highcharts({
                chart: {
                    type: 'line',
                    marginBottom: 36
                },
                colors: ['#1c76ec', '#79b3ff', '#ffa60c'],
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
                            return (this.value * 100) + '%';
                        }
                    },
                    min: 0
                },
                legend: {
                    y: 11,
                    x: 0,
                    floating: true,
                    borderWidth: 0
                },
                tooltip: {
                    shared: true,
                    formatter: function () {
                        var _p = this.points,
                        _str = '<b>' + this.x + '</b><br/>';
                        for (var i = 0; i < _p.length; i++) {
                            _str = _str + _p[i].series.name + ': ' + (_p[i].y * 100).toFixed(1) + '%<br/>';
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
                _d[i] = data[i].Percent;
            }
            _m.data = _d;
            return _m;
        },
        onSelectChange: function () {
            if ($(this).val() == "0") {
                fltSvLs.getMonArgInfo(0);
                fltSvLs.dwLine();
            } else {
                fltSvLs.getMonArgInfo(1);
                fltSvLs.dwLine();
            }
        }
    };

    //
    var fltConStru = {
        _timeout: null,
        init: function () {
            var _fltSvRID = $('#fltSvRID'),
            _fltConStruExID = $('#fltConStruExID'),
            _fltConStruSelID = $('#fltConStruSelID'),
            _fltConStruID = $('#fltConStruID'),
            _fltSvSpanID = $('#fltSvSpanID');

            _fltConStruExID.css('display', '');
            //国内国际开关
            if (_cfgInfo.HasInAirTicketProduct == "T" || _cfgInfo.HasOutAirTicketProduct == "T") {
                var _f = [];
                //0-国内 1-国际
                if (_cfgInfo.HasInAirTicketProduct == "F") {
                    //只有国际
                    _fltSvSpanID.html(corpReport_FlightSvALs.js_International + '<i class="icon i5"></i>');
                    _fltSvSpanID.attr('mark', "1");
                    _f.push('<ul><li><a href="javascript:;" mark="1">' + corpReport_FlightSvALs.js_International + '</a></li></ul>');
                } else {
                    //
                    _fltSvSpanID.html(corpReport_FlightSvALs.js_Domestic + '<i class="icon i5"></i>');
                    _fltSvSpanID.attr('mark', "0");
                    _f.push('<ul><li><a href="javascript:;" mark="0">' + corpReport_FlightSvALs.js_Domestic + '</a></li>');
                    if (_cfgInfo.HasOutAirTicketProduct == "T") {
                        //国内-国际
                        _f.push('<li><a href="javascript:;" mark="1">' + corpReport_FlightSvALs.js_International + '</a></li>');
                    }
                    _f.push('</ul>');
                }
                _fltConStruSelID.append(_f.join(""));
                //绘制，默认C(消费分析)
                fltConStru.ajaxFltSvD("C");
            } else {
                //国内国际都不存在
                _fltConStruExID.css('display', 'none');
            }

            //绑定事件
            _fltSvRID.find('input').bind('change', fltConStru.radioChange);
            //
            _fltSvSpanID.unbind('click');
            _fltSvSpanID.bind('click', fltConStru.showDropDown);
            _fltConStruSelID.find('li').unbind('click');
            _fltConStruSelID.find('li').bind('click', fltConStru.onDataClick);
        },
        getCondition: function () {
            return {
                type: $('#fltSvRID').find('input:checked').val(),
                inout: $('#fltSvSpanID').attr('mark')
            }
        },
        onDataClick: function (event) {
            var _fltSvSpanID = $('#fltSvSpanID');
            //
            _fltSvSpanID.html($(this).text() + '<i class="icon i5"></i>');
            _fltSvSpanID.attr('mark', $(this).find('a').attr('mark'));
            fltConStru.hideDropDown();
            //触发绘制
            fltConStru.drawChart();
        },
        radioChange: function () {
            //ajax获取数据，并触发绘制
            fltConStru.ajaxFltSvD($(this).val());
            //更改备注
            var _rInfo = [];
            _rInfo.push('<p>' + corpReport_FlightSvALs.js_Bz + '</p>');
            _rInfo.push('<p>' + corpReport_FlightSvALs.js_Bz1 + '</p>');
            ($(this).val() == "S") ? _rInfo.push('<p>' + corpReport_FlightSvALs.js_Bz2 + '</p><p>' + corpReport_FlightSvALs.js_Bz3 + '</p><p>' + corpReport_FlightSvALs.js_Bz4 + '</p>') : _rInfo.push('<p>' + corpReport_FlightSvALs.js_Bz5 + '</p><p>' + corpReport_FlightSvALs.js_Bz6 + '</p>');
            $('#fltSvRemarkID').html(_rInfo.join(""));
        },
        drawChart: function () {
            //
            var c = fltConStru.getCondition(),
            _fltConStruID = $('#fltConStruID');

            _fltConStruID.empty();
            //绘制
            if (c.inout == "0") {
                if (_fltConStuInfo.DomConStu && _fltConStuInfo.DomConStu.length > 0) {
                    fltConStru.drawColRange(_fltConStruID, _fltConStuInfo.DomConStu);
                } else {
                    CM.LineHeightFix(_fltConStruID);
                }
            } else {
                if (_fltConStuInfo.IntConStu && _fltConStuInfo.IntConStu.length > 0) {
                    fltConStru.drawColRange(_fltConStruID, _fltConStuInfo.IntConStu);
                } else {
                    CM.LineHeightFix(_fltConStruID);
                }
            }
        },
        drawColRange: function (content, d) {
            var myData = fltConStru.getData(d),
            yLast = myData.y[myData.y.length - 1][1],
            _maxY = 0;
            //
            if (yLast && yLast > 0) {
                _maxY = yLast * 1.1;
            }

            content.highcharts({
                chart: {
                    type: 'columnrange',
                    inverted: false  //设置横向还是纵向展示
                },
                colors: ['#398eff', '#ffa60c'],
                xAxis: {
                    title: {
                        text: null
                    },
                    categories: myData.x
                },
                title: {
                    text: null
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    labels: {
                        enabled: false
                    },
                    min: 0,
                    gridLineWidth: 0,
                    minPadding: 0,
                    max: _maxY
                },
                tooltip: {
                    //backgroundColor: '#fff',
                    formatter: function () {
                        var _str = [];
                        _str.push('<b>' + this.x + '</b><br/>');
                        if (this.point.mark && this.point.mark == 1) {
                            _str.push('<b>' + corpReport_FlightSvALs.js_Amount + ': </b>' + corpReport_Common.js_RMBLogo + CM.fixData.transData(this.point.price, 0));
                        } else {
                            _str.push('<b>' + corpReport_FlightSvALs.js_Amount + ': </b>' + corpReport_Common.js_RMBLogo + CM.fixData.transData(this.point.high, 0));
                        }
                        return _str.join("");
                    },
                    style: {
                        lineHeight: '18px'
                    }
                },
                plotOptions: {
                    columnrange: {
                        colorByPoint: true,
                        dataLabels: {
                            enabled: true,
                            overflow: "none",
                            crop: false,
                            formatter: function () {
                                if (this.point.maxP && this.point.maxP == this.y && this.point.price && this.point.price > 0) {
                                    var _s = [];
                                    _s.push('<b>' + this.x + ': </b> ' + corpReport_Common.js_RMBLogo + CM.fixData.transData(this.point.price, 0) + '<br/>');
                                    _s.push('<b>' + this.x + corpReport_FlightSvALs.js_Rate + ':</b> ' + this.point.percent);
                                    return _s.join("");
                                }
                            },
                            useHTML: false,
                            yHigh: 5
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                series: [{
                    data: myData.y
                }]
            });
            var chart = content.highcharts();
            for (var i = 0; i < d.length; i++) {
                if (d[i].Mark == 1) {
                    chart.series[0].data[i].update({
                        percent: d[i].Percent,
                        maxP: d[i].MaxP,
                        price: d[i].Price,
                        mark: d[i].Mark
                    })
                    //dot line 
                    var dotLine = function (s, m, e) {
                        var sX = s.graphic.x + 11,
                        sY = m.graphic.y + m.graphic.height + 11,
                        mX = m.graphic.x + 11,
                        eY = e.graphic.y + 11,
                        eX = e.graphic.x + 11;

                        //s-line
                        chart.renderer.path(['M', sX, sY, 'L', mX, sY])
                     .attr({
                         'stroke-width': 1,
                         stroke: '#333',
                         style: "stroke-dasharray:6"
                     }).add();
                        //e-line
                        chart.renderer.path(['M', mX, eY, 'L', eX, eY])
                     .attr({
                         'stroke-width': 1,
                         stroke: '#333',
                         style: "stroke-dasharray:6"
                     }).add();
                    }
                    try { dotLine(chart.series[0].data[i - 1], chart.series[0].data[i], chart.series[0].data[i + 1]); } catch (e) { console.log(e); }
                }
            }

        },
        getData: function (d) {
            var _b = {},
            _x = [],
            _y = [];

            for (var i = 0; i < d.length; i++) {
                var _in = [0, 0];
                if (d[i].Mark == 0) {
                    _in[1] = d[i].Price;
                } else {
                    _in[0] = d[i].MinP;
                    _in[1] = d[i].MaxP;
                }
                _x.push(d[i].Name);
                _y.push(_in);
            }
            _b.x = _x;
            _b.y = _y;
            return _b;
        },
        ajaxFltSvD: function (type) {
            var f = $('#fltConStruID');
            //客户消费结构分析(C) 客户节省分析(S)
            //loding
            CM.LoadingHeightFix(f);
            //
            window.clearTimeout(fltConStru._timeout);
            fltConStru._timeout = window.setTimeout(function () {
                var _ptDt = dpHeader.getHeadData();
                _ptDt.SLtype = type;
                $.ajax({
                    url: '../Flight/GetFltCustSave',
                    type: "POST",
                    data: _ptDt,
                    success: function (data) {
                        //..
                        f.html("");
                        _fltConStuInfo = $.parseJSON(data);
                        //绘图
                        fltConStru.drawChart();
                    },
                    error: function () {
                        console.log('error!');
                    }
                });

            }, 100);
        },
        showDropDown: function (event) {
            event.preventDefault();
            event.stopPropagation();
            if ($('#fltSvSpanID').hasClass('click_on')) {
                $('#fltConStruSelID').css('display', 'none');
                $('#fltSvSpanID').removeClass('click_on');
            } else {
                $('#fltConStruSelID').css('display', '');
                $('#fltSvSpanID').addClass('click_on');
            }
        },
        hideDropDown: function () {
            $('#fltConStruSelID').css('display', 'none');
            $('#fltSvSpanID').removeClass('click_on');
        }
    };

    //损失明细-按部门分析
    var fltLsDetail = {
        selChecked: 0,
        init: function () {
            //
            var _depAnsExID = $('#depAnsExID'),
            _depAnsSelID = $('#depAnsSelID'),
            _f = [];

            //绘制下拉
            fltLsDetail.depTextInit(_fltDepDetailInfo);
            //国内-国际开关
            _depAnsExID.css('display', '');
            _depAnsSelID.empty();
            //国内国际开关
            if (_cfgInfo.HasInAirTicketProduct == "T" && _cfgInfo.HasOutAirTicketProduct == "T") {
                _f.push('<label><input type="radio" name="option2" value="0" checked>' + corpReport_FlightSvALs.js_Domestic + '</label>');
                _f.push('<label><input type="radio" name="option2" value="1">' + corpReport_FlightSvALs.js_International + '</label>');
                _depAnsSelID.append(_f.join(""));
                _depAnsSelID.find('input').bind('change', fltLsDetail.onSelectChange);
                //
                fltLsDetail.selChecked = 0;
                fltLsDetail.drawDepAnys(0);
            } else if (_cfgInfo.HasInAirTicketProduct == "T" && _cfgInfo.HasOutAirTicketProduct == "F") {
                _f.push('<label><input type="radio" name="option2" value="0" checked>' + corpReport_FlightSvALs.js_Domestic + '</label>');
                _depAnsSelID.append(_f.join(""));
                //
                fltLsDetail.selChecked = 0;
                fltLsDetail.drawDepAnys(0);
            } else if (_cfgInfo.HasInAirTicketProduct == "F" && _cfgInfo.HasOutAirTicketProduct == "T") {
                _f.push('<label><input type="radio" name="option2" value="1" checked>' + corpReport_FlightSvALs.js_International + '</label>');
                _depAnsSelID.append(_f.join(""));
                //
                fltLsDetail.selChecked = 1;
                fltLsDetail.drawDepAnys(1);
            } else {
                _depAnsExID.css('display', 'none');
            }
        },
        drawDepAnys: function (index) {
            fltLsDetail.clearAll();
            var _bodyData = (index == 0) ? _fltLsDetInfo.DomDptAnsInfo : _fltLsDetInfo.IntDepAnsInfo,
            _footData = (index == 0) ? _fltLsDetInfo.TolDomDotInfo : _fltLsDetInfo.TolIntDotInfo;

            fltLsDetail.drawHead();
            fltLsDetail.drawBody(_bodyData);
            fltLsDetail.drawFoot(_footData);
        },
        depTextInit: function (dt) {
            //初次，显示全部
            var content = $('#depNameID');
            if (dt.length > 0) {
                content.val(corpReport_FlightSvALs.js_All);
            }
            //绘制下拉
            fltLsDetail.drawDepart(dt);
            //绑定下拉
            content.unbind('click');
            content.bind('click', fltLsDetail.showDepart);
            //content.bind('focus', fltLsDetail.showDepart);
            //搜索功能
            content.unbind('keyup');
            content.bind('keyup', fltLsDetail.drawFindResult);
        },
        drawHead: function () {
            var _head = $('<table><thead id="headTableID"></thead></table>');
            $('#fltLsDetail').append(_head);
            //live on
            $('#headTableID').on('click', '[ckMark="1"]', fltLsDetail.onHeadClick);
            //
            var _str = ['<tr>'];
            _str.push('<th width="10%">RC</th>');
            _str.push('<th width="10%" ckMark="1" pInfo="Number">' + corpReport_FlightSvALs.js_Tickets + '</th>');
            _str.push('<th width="20%" ckMark="1" pInfo="Price">' + corpReport_FlightSvALs.js_NetPrice + '</th>');
            _str.push('<th width="20%" ckMark="1" pInfo="LowPrice">' + corpReport_FlightSvALs.js_LowestAirfare + '</th>');
            _str.push('<th width="20%" class="sequence" ckMark="1" pInfo="Loss">' + corpReport_FlightSvALs.js_MissedSavings + '<i class="icon i7"></i></th>');
            _str.push('<th width="20%" ckMark="1" pInfo="LossRate">' + corpReport_FlightSvALs.js_PerofMissedSavings + '</th>');
            _str.push('<th class="null_place"><div></div></th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (data) {
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>'),
            _p = $('<p class="des_layer" id="desFadeID" style="display:none;position: absolute;"></p>');
            $('#fltLsDetail').append(_body).append(_p);

            var _bodyTableID = $('#bodyTableID');
            //no data
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _str = ['<tr>'];
                    _str.push('<td width="10%"><span name="RCFadeID" index=' + i + ' RCInfo="' + data[i].RCInfo + '">' + data[i].RC + '</span></td>');
                    _str.push('<td width="10%">' + CM.fixData.transData(data[i].Number, 0) + '</td>');
                    _str.push('<td width="20%" align="right">' + CM.fixData.transData(data[i].Price, 0) + '</td>');
                    _str.push('<td width="20%" align="right">' + CM.fixData.transData(data[i].LowPrice, 0) + '</td>');
                    _str.push('<td width="20%" align="right">' + CM.fixData.transData(data[i].Loss, 0) + '</td>');
                    _str.push('<td width="20%">' + CM.fixData.percData(data[i].LossRate) + '</td>');
                    _str.push('</tr>');
                    _bodyTableID.append(_str.join(""));
                }
                var el = $('#desFadeID');
                _bodyTableID.find('[name="RCFadeID"]').bind('mouseover touchstart', function () {
                    var _top = 60 + $(this).attr('index') * 31 + 'px';
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
            var _foot = $('<table><tfoot id="footTableID"></tfoot></table>');
            $('#fltLsDetail').append(_foot);
            var _str = ['<tr>'];
            _str.push('<td width="10%">' + corpReport_FlightSvALs.js_Total + '</td>');
            _str.push('<td width="10%">' + CM.fixData.transData(data.TolNumber, 0) + '</td>');
            _str.push('<td width="20%" align="right">' + CM.fixData.transData(data.TolPrice, 0) + '</td>');
            _str.push('<td width="20%" align="right">' + CM.fixData.transData(data.TolLowPrice, 0) + '</td>');
            _str.push('<td width="20%" align="right">' + CM.fixData.transData(data.TolLoss, 0) + '</td>');
            _str.push('<td width="20%">-</td>');
            _str.push('<td class="null_place"><div></div></td></tr>');
            $('#footTableID').append(_str.join(""));
        },
        clearAll: function () {
            $('#fltLsDetail').empty();
        },
        showDepart: function (event) {
            event.preventDefault();
            event.stopPropagation();
            //触发点击的时候，重新绘制
            fltLsDetail.drawDepart(_fltDepDetailInfo);
            $('#depNameSelID').css('display', '');
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
            _l.html('<a href="javascript:;">' + corpReport_FlightSvALs.js_All + '</a>');
            _l.bind('click', fltLsDetail.departClick);
            _ul.append(_l);
            //部门下拉框
            for (var i = 0; i < dt.length; i++) {
                var _li = $('<li></li>');
                _li.html('<a href="javascript:;" title="' + dt[i].Name + '">' + dt[i].Name + '</a>');
                _li.bind('click', fltLsDetail.departClick);
                _ul.append(_li)
            }
            _depNameSelID.append(_ul);
        },
        _timeout: null,
        departClick: function (event) {
            var _depNameSelID = $('#depNameSelID'),
            _depNameID = $('#depNameID'),
            _fltLsDetail = $('#fltLsDetail');

            event.preventDefault();
            event.stopPropagation();
            //隐藏浮层
            _depNameSelID.css('display', 'none');
            //值填入输入框
            _depNameID.val($(this).text());
            //loading
            CM.LoadingHeightFix(_fltLsDetail);
            //..延时
            window.clearTimeout(fltLsDetail._timeout);
            fltLsDetail._timeout = window.setTimeout(function () {
                //发送ajax请求..重绘表
                var _ptDt = dpHeader.getHeadData();
                _ptDt.DepName = _depNameID.val();
                $.ajax({
                    url: '../Flight/GetFltLsDetInfo',
                    type: "POST",
                    data: _ptDt,
                    success: function (data) {
                        //部门分析模块
                        _fltLsDetInfo = $.parseJSON(data);
                        fltLsDetail.drawDepAnys(fltLsDetail.selChecked);
                    },
                    error: function () {
                        console.log('error!');
                    }
                });
            }, 100);
        },
        onSelectChange: function () {
            //0-国内，1-国际
            if ($(this).val() == "0") {
                fltLsDetail.selChecked = 0;
                fltLsDetail.drawDepAnys(0);
            } else {
                fltLsDetail.selChecked = 1;
                fltLsDetail.drawDepAnys(1);
            }
        },
        sortArray: function (content, type) {
            var data = (fltLsDetail.selChecked == 0) ? _fltLsDetInfo.DomDptAnsInfo : _fltLsDetInfo.IntDepAnsInfo;

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
                    sortedData = fltLsDetail.sortArray(content, "Asc");
                } else {
                    content.find('.icon').removeClass('i6');
                    content.find('.icon').addClass('i7');
                    sortedData = fltLsDetail.sortArray(content, "Desc");
                }
            } else {
                //清空所有头部
                $('#headTableID').find('th.sequence').removeClass("sequence");
                $('#headTableID').find('th').find('.icon').remove();
                //初始按照从大到小排序
                content.append('<i class="icon i7"></i>');
                content.addClass("sequence");
                sortedData = fltLsDetail.sortArray(content, "Desc");
            }

            //重新绘制body和footer
            fltLsDetail.clearBdFt();
            fltLsDetail.drawBody(sortedData);
            fltLsDetail.drawFoot((fltLsDetail.selChecked == 0) ? _fltLsDetInfo.TolDomDotInfo : _fltLsDetInfo.TolIntDotInfo);
        },
        clearBdFt: function () {
            $('#bodyTableID').parent().parent().remove();
            $('#desFadeID').remove();
            $('#footTableID').parent().remove();
        },
        drawFindResult: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var data = _fltDepDetailInfo;

            var list = fltLsDetail.filterList($(this).val(), data);
            fltLsDetail.drawDepart(list);
        },
        filterList: function (value, list) {
            if (IsEmpty(value))
                return list;
            var newList = [];
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (fltLsDetail.IsContain(value, list[i].Name)) {
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

    //
    function noticeInit() {
        if (!("placeholder" in document.createElement("input"))) {
            $("#depNameID").placeholder();
        }
    }

    function IsEmpty(value) {
        if ((typeof value == 'string' && value.length == 0) || value == null)
            return true;
        else
            return false;
    }

    //
    var flightSvALsInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //
        $.ajax({
            url: '../Flight/GetFlightSvALs',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                //初始赋值
                _filghtSvALsInfo = $.parseJSON(data);
                //初始赋值
                _fltSvALsInfo = _filghtSvALsInfo.FltSaveAndLose;
                _fltConStuInfo = _filghtSvALsInfo.FltConStuInfo;
                _fltLsDetInfo = _filghtSvALsInfo.FltLsDetInfo;
                _fltDepDetailInfo = _filghtSvALsInfo.DeptList;
                //初始化
                fltSvLs.init();
                fltConStru.init();
                fltLsDetail.init();
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
        flightSvALsInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..重新访问节省损失
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(1);
    Droco_Funs.getFlightsSubNav(7);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);