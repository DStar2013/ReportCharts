(function ($) {
    //☆=================== var S ===================☆
    var _flightDepAnisisInfo, //页面总数据
        _fPAnysisInfo1, //国内：部门名称-价格-张数-平均折扣-全票价比例-节省-节省率-损失-损失率
        _fPAnysisInfo, //全部：部门名称-价格-张数-节省-节省率
        _fPAnysisInfo2;  //国际：部门名称-价格-张数-国际里程平均价-节省-节省率
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //
    var fltPartAnysis = {
        selChecked: 1,
        bodyData: [],
        init: function () {
            var _fltSelID = $('#fltSelID'),
                _ptAnysisID = $('#ptAnysisID'),
                _f = [];

            _fltSelID.css('display', '');
            _fltSelID.empty();

            //判断国内国际开关
            if (_cfgInfo.HasInAirTicketProduct == "T" && _cfgInfo.HasOutAirTicketProduct == "T") {
                _f.push('<label><input type="radio" name="option" value="0">' + corpReport_FlightDepAnysis.js_All + '</label>');
                _f.push('<label><input type="radio" name="option" checked value="1">' + corpReport_FlightDepAnysis.js_Domestic + '</label>');
                _f.push('<label><input type="radio" name="option" value="2">' + corpReport_FlightDepAnysis.js_International + '</label>');
                _fltSelID.append(_f.join(""));
                //
                fltPartAnysis.selChecked = 1;
                fltPartAnysis.dwFltPtAnysi(1);
                _fltSelID.find('input').bind('change', fltPartAnysis.onSelectChange);
            } else if (_cfgInfo.HasInAirTicketProduct == "T" && _cfgInfo.HasOutAirTicketProduct == "F") {
                _f.push('<label><input type="radio" name="option" checked value="1">' + corpReport_FlightDepAnysis.js_Domestic + '</label>');
                _fltSelID.append(_f.join(""));
                //
                fltPartAnysis.selChecked = 1;
                fltPartAnysis.dwFltPtAnysi(1);
            } else if (_cfgInfo.HasInAirTicketProduct == "F" && _cfgInfo.HasOutAirTicketProduct == "T") {
                _f.push('<label><input type="radio" name="option" checked value="2">' + corpReport_FlightDepAnysis.js_International + '</label>');
                _fltSelID.append(_f.join(""));
                //
                fltPartAnysis.selChecked = 2;
                fltPartAnysis.dwFltPtAnysi(2);
            } else {
                _fltSelID.css('display', 'none');
                _ptAnysisID.css('display', 'none');
            }
            // sizeT
            $('#depTClose').bind('click', function () { $('#depNameT').unmask(); });
        },
        dwFltPtAnysi: function (index) {
            fltPartAnysis.clearAll();
            //
            var bData = index == 0 ? _fPAnysisInfo.PartInfo : (index == 1 ? _fPAnysisInfo1.PartInfo : _fPAnysisInfo2.PartInfo),
                fData = index == 0 ? _fPAnysisInfo.TotalInfo : (index == 1 ? _fPAnysisInfo1.TotalInfo : _fPAnysisInfo2.TotalInfo);

            fltPartAnysis.drawHead(index);
            fltPartAnysis.drawBody(index, bData);
            fltPartAnysis.drawFoot(index, fData);
            //add 部门筛选功能
            fltPartAnysis.depTextInit(index, bData, fData);
        },
        drawHead: function (index) {
            //绘制头部
            var _head = $('<table><thead id="headTableID"></thead></table>');
            $('#ptAnysisID').append(_head);
            //live on
            $('#headTableID').on('click', '[ckMark="1"]', fltPartAnysis.onHeadClick);
            //
            var _str = ['<tr>'];
            if (index == 0) {
                _str.push('<th width="35%">' + corpReport_FlightDepAnysis.js_Department + '</th>');
                _str.push('<th width="20%" class="sequence" ckMark="1" pInfo="Price">' + corpReport_FlightDepAnysis.js_Amount + ' <i class="icon i7"></i></th>');
                _str.push('<th width="15%" ckMark="1" pInfo="Numbers">' + corpReport_FlightDepAnysis.js_Tickets + '</th>');
                _str.push('<th width="15%" ckMark="1" pInfo="Save">' + corpReport_FlightDepAnysis.js_Savings + '</th>');
                _str.push('<th width="15%" ckMark="1" pInfo="SaveRate">' + corpReport_FlightDepAnysis.js_PerofSavings + '</th>');
            } else if (index == 1) {
                _str.push('<th width="15%">' + corpReport_FlightDepAnysis.js_Department + '</th>');
                _str.push('<th width="15%" class="sequence" ckMark="1" pInfo="Price">' + corpReport_FlightDepAnysis.js_Amount + ' <i class="icon i7"></i></th>');
                _str.push('<th width="10%" ckMark="1" pInfo="Numbers">' + corpReport_FlightDepAnysis.js_Tickets + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="AvgDiscount">' + corpReport_FlightDepAnysis.js_AvgDiscount + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="FullPerc">' + corpReport_FlightDepAnysis.js_FullFareTicketRate + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="Save">' + corpReport_FlightDepAnysis.js_Savings + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="SaveRate">' + corpReport_FlightDepAnysis.js_PerofSavings + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="Loss">' + corpReport_FlightDepAnysis.js_MissedSavings + '</th>');
                _str.push('<th width="10%" ckMark="1" pInfo="LossRate">' + corpReport_FlightDepAnysis.js_PerofMissedSavings + '</th>');
            } else {
                _str.push('<th width="25%">' + corpReport_FlightDepAnysis.js_Department + '</th>');
                _str.push('<th width="15%" class="sequence" ckMark="1" pInfo="Price">' + corpReport_FlightDepAnysis.js_Amount + ' <i class="icon i7"></i></th>');
                _str.push('<th width="15%" ckMark="1" pInfo="Numbers">' + corpReport_FlightDepAnysis.js_Tickets + '</th>');
                _str.push('<th width="15%" ckMark="1" pInfo="IntMilAvgPrice">' + corpReport_FlightDepAnysis.js_AvgMileagePrice + '</th>');
                _str.push('<th width="15%" ckMark="1" pInfo="Save">' + corpReport_FlightDepAnysis.js_Savings + '</th>');
                _str.push('<th width="15%" ckMark="1" pInfo="SaveRate">' + corpReport_FlightDepAnysis.js_PerofSavings + '</th>');
            }
            _str.push('<th class="null_place"><div></div></th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (index, data) {
            //body data
            fltPartAnysis.bodyData = data;
            //绘制整个body
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>');
            $('#ptAnysisID').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //no data
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _tr = $('<tr></tr>'),
                        _str = [];
                    if (index == 0) {
                        _str.push('<td width="35%" align="left">' + data[i].DepartName + '</td>');
                        _str.push('<td width="20%">' + CM.fixData.transData(data[i].Price, 0) + '</td>');
                        _str.push('<td width="15%">' + CM.fixData.transData(data[i].Numbers, 0) + '</td>');
                        _str.push('<td width="15%">' + CM.fixData.transData(data[i].Save, 0) + '</td>');
                        _str.push('<td width="15%">' + CM.fixData.percData(data[i].SaveRate) + '</td>');
                    } else if (index == 1) {
                        _str.push('<td mark="depName" width="15%" align="left"><a href="javascript:void(0)" class="depName">' + data[i].DepartName + '</a></td>');
                        _str.push('<td width="15%">' + CM.fixData.transData(data[i].Price, 0) + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.transData(data[i].Numbers, 0) + '</td>');
                        _str.push('<td width="10%">' + data[i].AvgDiscount + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.percData(data[i].FullPerc) + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.transData(data[i].Save, 0) + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.percData(data[i].SaveRate) + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.transData(data[i].Loss, 0) + '</td>');
                        _str.push('<td width="10%">' + CM.fixData.percData(data[i].LossRate) + '</td>');
                    } else {
                        _str.push('<td width="25%" align="left">' + data[i].DepartName + '</td>');
                        _str.push('<td width="15%">' + CM.fixData.transData(data[i].Price, 0) + '</td>');
                        _str.push('<td width="15%">' + CM.fixData.transData(data[i].Numbers, 0) + '</td>');
                        _str.push('<td width="15%">' + data[i].IntMilAvgPrice + '</td>');
                        _str.push('<td width="15%">' + CM.fixData.transData(data[i].Save, 0) + '</td>');
                        _str.push('<td width="15%">' + CM.fixData.percData(data[i].SaveRate) + '</td>');
                    }
                    _tr.data('dInfo', data[i]);
                    _bodyTableID.append(_tr.append(_str.join("")));
                }
                //live 蒙版
                _bodyTableID.on('click', '[mark="depName"]', fltPartAnysis.depNameMask);
            } else {
                CM.LineHeightFix(_body);
            }
        },
        drawFoot: function (index, data) {
            //绘制foot部分
            var _foot = $('<table><tfoot id="footTableID"></tfoot></table>')
            $('#ptAnysisID').append(_foot);
            var _str = ['<tr>'];
            if (index == 0) {
                _str.push('<td width="35%" align="left">' + corpReport_FlightDepAnysis.js_Total + '</td>');
                _str.push('<td width="20%">' + CM.fixData.transData(data.TolPrice, 0) + '</td>');
                _str.push('<td width="15%">' + CM.fixData.transData(data.TolNumbers, 0) + '</td>');
                _str.push('<td width="15%">' + CM.fixData.transData(data.TolSave, 0) + '</td>');
                _str.push('<td width="15%">' + CM.fixData.percData(data.TolSaveRate) + '</td>');
            } else if (index == 1) {
                _str.push('<td width="15%" align="left">' + corpReport_FlightDepAnysis.js_Total + '</td>');
                _str.push('<td width="15%">' + CM.fixData.transData(data.TolPrice, 0) + '</td>');
                _str.push('<td width="10%">' + CM.fixData.transData(data.TolNumbers, 0) + '</td>');
                _str.push('<td width="10%">' + data.TolAvgDiscount + '</td>');
                _str.push('<td width="10%">' + CM.fixData.percData(data.TolFullPer) + '</td>');
                _str.push('<td width="10%">' + CM.fixData.transData(data.TolSave, 0) + '</td>');
                _str.push('<td width="10%">' + CM.fixData.percData(data.TolSaveRate) + '</td>');
                _str.push('<td width="10%">' + CM.fixData.transData(data.TolLoss, 0) + '</td>');
                _str.push('<td width="10%">' + CM.fixData.percData(data.TolLossRate) + '</td>');
            } else {
                _str.push('<td width="25%" align="left">' + corpReport_FlightDepAnysis.js_Total + '</td>');
                _str.push('<td width="15%">' + CM.fixData.transData(data.TolPrice, 0) + '</td>');
                _str.push('<td width="15%">' + CM.fixData.transData(data.TolNumbers, 0) + '</td>');
                _str.push('<td width="15%">' + data.TolIntMilAvgPrice + '</td>');
                _str.push('<td width="15%">' + CM.fixData.transData(data.TolSave, 0) + '</td>');
                _str.push('<td width="15%">' + CM.fixData.percData(data.TolSaveRate) + '</td>');
            }
            _str.push('<td class="null_place"><div></div></td></tr>');
            $('#footTableID').append(_str.join(""));
        },
        onSelectChange: function () {
            //0全部-1是国内-2国际
            if ($(this).val() == "1") {
                fltPartAnysis.selChecked = 1;
                fltPartAnysis.dwFltPtAnysi(1);
            } else if ($(this).val() == "2") {
                fltPartAnysis.selChecked = 2;
                fltPartAnysis.dwFltPtAnysi(2);
            } else {
                fltPartAnysis.selChecked = 0;
                fltPartAnysis.dwFltPtAnysi(0);
            }
            //清空筛选
            $('#depNameID').val("");
        },
        sortArray: function (content, type) {
            //var data = fltPartAnysis.selChecked == 0 ? _fPAnysisInfo.PartInfo : (fltPartAnysis.selChecked == 1 ? _fPAnysisInfo1.PartInfo : _fPAnysisInfo2.PartInfo);
            var data = fltPartAnysis.bodyData;
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
                _headTableID = $('#headTableID'),
                content = $(this);
            if (content.hasClass("sequence")) {
                //从大大小和从小到大的切换
                if (content.find('.icon') && content.find('.icon').hasClass("i7")) {
                    content.find('.icon').removeClass('i7');
                    content.find('.icon').addClass('i6');
                    sortedData = fltPartAnysis.sortArray(content, "Asc");
                } else {
                    content.find('.icon').removeClass('i6');
                    content.find('.icon').addClass('i7');
                    sortedData = fltPartAnysis.sortArray(content, "Desc");
                }
            } else {
                //清空所有头部
                _headTableID.find('th.sequence').removeClass("sequence");
                _headTableID.find('th').find('.icon').remove();
                //初始按照从大到小排序
                content.append('<i class="icon i7"></i>');
                content.addClass("sequence");
                sortedData = fltPartAnysis.sortArray(content, "Desc");
            }

            //重新绘制body和footer
            fltPartAnysis.clearBdFt();
            fltPartAnysis.drawBody(fltPartAnysis.selChecked, sortedData);
            //
            var _tolData = (fltPartAnysis.selChecked == 0) ? _fPAnysisInfo.TotalInfo : (fltPartAnysis.selChecked == 1) ? _fPAnysisInfo1.TotalInfo : _fPAnysisInfo2.TotalInfo;
            fltPartAnysis.drawFoot(fltPartAnysis.selChecked, _tolData);
        },
        clearBdFt: function () {
            //清除Body和footer
            $('#bodyTableID').parent().parent().remove();
            $('#footTableID').parent().remove();
        },
        clearAll: function () {
            $('#ptAnysisID').empty();
        },
        depTextInit: function (index, bData, fData) {
            var content = $('#depNameID');
            //
            (bData.length > 0) && (content.val(""));
            //
            var pD = { index: index, bData: bData, fData: fData };
            //
            fltPartAnysis.drawDepart(pD, "");
            //绑定点击
            content.unbind('click');
            content.bind('click', pD, fltPartAnysis.showDepart);
            //搜索
            content.unbind('keyup');
            content.bind('keyup', pD, fltPartAnysis.drawFindResult);
        },
        drawDepart: function (dt, keyword) {
            var _dSel = $('#depNameSelID');
            //
            _dSel.empty();
            //数据大于7条，显示滚动条
            (dt.bData.length > 6) ? _dSel.addClass('y_scroll') : _dSel.removeClass('y_scroll');
            var _ul = $('<ul></ul>');
            //部门下拉框
            for (var i = 0; i < dt.bData.length; i++) {
                var _li = $('<li></li>'), tmpA = []; tmpA.push(dt.bData[i]);
                var tmp = { index: dt.index, bData: tmpA, fData: dt.fData };
                _li.html('<a href="javascript:;" title="' + dt.bData[i].DepartName + '">' + dt.bData[i].DepartName.replace(keyword, '<strong>' + keyword + '</strong>') + '</a>');
                _li.bind('click', tmp, fltPartAnysis.departClick);
                _ul.append(_li);
            }
            _dSel.append(_ul);
            //绘制列表
            fltPartAnysis.departInfoDraw(dt);
        },
        showDepart: function (event) {
            event.preventDefault();
            event.stopPropagation();
            //
            //fltPartAnysis.drawDepart(event.data);
            $('#depNameSelID').css('display', '');
        },
        timeout: null,
        drawFindResult: function (event) {
            event.preventDefault();
            event.stopPropagation();
            //
            window.clearTimeout(fltPartAnysis.timeout);
            fltPartAnysis.timeout = window.setTimeout(function () {
                var c = $('#depNameID'), d = event.data,
                newList = fltPartAnysis.filterList(c.val(), d.bData),
                newD = { index: d.index, bData: newList, fData: d.fData };
                //
                fltPartAnysis.drawDepart(newD, c.val());
            }, 300);
        },
        departClick: function (event) {
            event.preventDefault();
            event.stopPropagation();
            //隐藏浮层
            $('#depNameSelID').css('display', 'none');
            //draw
            event.data.bData[0] && ($('#depNameID').val(event.data.bData[0].DepartName));
            fltPartAnysis.departInfoDraw(event.data);
        },
        departInfoDraw: function (d) {
            fltPartAnysis.clearAll();
            fltPartAnysis.drawHead(d.index);
            fltPartAnysis.drawBody(d.index, d.bData);
            fltPartAnysis.drawFoot(d.index, d.fData);
        },
        depNameMask: function (event) {
            //..
            var dInfo = $(this).parent().data('dInfo'),
                index = fltPartAnysis.selChecked,
                aInfo = index == 0 ? _fPAnysisInfo.TotalInfo : (index == 1 ? _fPAnysisInfo1.TotalInfo : _fPAnysisInfo2.TotalInfo);
            //
            fltPartAnysis.drawMask(dInfo, aInfo);
            $('#depNameT').mask({ bgColor: "#C3C3C3" });
        },
        drawMask: function (dInfo, aInfo) {
            //dInfo-部门信息 aInfo-公司信息
            var m = $('#depTMask'),
                h = [], b = [];
            m.empty();
            //head
            h.push('<thead><tr><td></td><th>' + corpReport_FlightDepAnysis.js_ThisDepartment + '</th><th>' + corpReport_FlightDepAnysis.js_ThisCompany + '</th><th></th></tr></thead>');
            m.append(h.join(""));
            //body
            b.push('<tbody>');
            b.push(fltPartAnysis.drawMaskBody(corpReport_FlightDepAnysis.js_PerOfRC, CM.fixData.percData(dInfo.RcRate), CM.fixData.percData(aInfo.TolRcRate), dInfo.RcRate <= aInfo.TolRcRate));
            b.push(fltPartAnysis.drawMaskBody(corpReport_FlightDepAnysis.js_AdvBooking, dInfo.PreOrderdate, aInfo.TolPreOrderdate, dInfo.PreOrderdate >= aInfo.TolPreOrderdate));
            b.push(fltPartAnysis.drawMaskBody(corpReport_FlightDepAnysis.js_FullFareTicketRate, CM.fixData.percData(dInfo.FullPerc), CM.fixData.percData(aInfo.TolFullPer), dInfo.FullPerc <= aInfo.TolFullPer));
            b.push(fltPartAnysis.drawMaskBody(corpReport_FlightDepAnysis.js_AvgDiscount, dInfo.AvgDiscount, aInfo.TolAvgDiscount, dInfo.AvgDiscount <= aInfo.TolAvgDiscount));
            b.push(fltPartAnysis.drawMaskBody(corpReport_FlightDepAnysis.js_PerofSavings, CM.fixData.percData(dInfo.SaveRate), CM.fixData.percData(aInfo.TolSaveRate), dInfo.SaveRate >= aInfo.TolSaveRate));
            b.push(fltPartAnysis.drawMaskBody(corpReport_FlightDepAnysis.js_PerofMissedSavings, CM.fixData.percData(dInfo.LossRate), CM.fixData.percData(aInfo.TolLossRate), dInfo.LossRate <= aInfo.TolLossRate));
            b.push('</tbody>');
            m.append(b.join(""));
        },
        drawMaskBody: function (title, d, a, mark) {
            var tr = ['<tr>'];
            tr.push('<th>' + title + '</th>');
            tr.push('<td>' + d + '</td>');
            tr.push('<td>' + a + '</td>');
            tr.push(mark ? '<td><i class="icon i27"></i></td>' : '<td><i class="icon i28"></i></td>');
            tr.push('</tr>');
            return tr.join("");
        },
        filterList: function (value, list) {
            if (IsEmpty(value)) return list;
            var newList = [];
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (fltPartAnysis.IsContain(value, list[i].DepartName)) {
                        newList.push(list[i]);
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
    //
    function IsEmpty(value) {
        if ((typeof value == 'string' && value.length == 0) || value == null)
            return true;
        else
            return false;
    }
    //
    var flightDepAnysisInit = function (data) {
        //
        var noDataID = $('#noDataID');
        noDataID.mask();
        //ajax
        $.ajax({
            url: '../Flight/GetFlightDepAnysis',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                if (_cfgInfo.HasFltDeptDetail == "T") {
                    //初始赋值
                    _flightDepAnisisInfo = $.parseJSON(data);
                    //初始赋值
                    _fPAnysisInfo1 = _flightDepAnisisInfo.FPAnysisInfoN;
                    _fPAnysisInfo = _flightDepAnisisInfo.FPAnysisInfoA;
                    _fPAnysisInfo2 = _flightDepAnisisInfo.FPAnysisInfoI;
                    //初始化
                    fltPartAnysis.init();
                    //
                    noticeInit();
                } else {
                    var _t = $('#ptAnysisID');
                    $('#fltSelID,#depTxt').css('display', 'none');
                    _t.empty().height(520);
                    CM.ChargeFix(_t, "payment16.jpg", lanType);
                    //_t.html('<div class="payment"><img src="http://pic.ctrip.com/droco/img/sample/payment16.jpg" alt=""></div>');
                }
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
        flightDepAnysisInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..重新访问部分分析
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(1);
    Droco_Funs.getFlightsSubNav(1);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);