(function ($) {
    //☆=================== var S ===================☆
    var _flightCarbEmInfo, //页面数据
        _fltCarbInfo; //旅行类型-总里程数-碳排放量-碳补偿
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //
    var fltCarbCal = {
        init: function () {
            //初始绘制碳排放计算table
            fltCarbCal.clearAll();
            fltCarbCal.drawHead();
            fltCarbCal.drawBody(_fltCarbInfo.CarbInfo);
            fltCarbCal.drawFoot(_fltCarbInfo.TolCarbInfo);
        },
        drawHead: function () {
            var _head = $('<table><tbody id="headTableID"></tbody></table>');
            $('#fltCarbCalID').append(_head);
            var _str = ['<tr>'];
            _str.push('<th width="25%" class="left">' + corpReport_FlightCarbEm.js_TravelType + '</th>');
            _str.push('<th width="25%">' + corpReport_FlightCarbEm.js_TotalMileage + '</th>');
            _str.push('<th width="25%">' + corpReport_FlightCarbEm.js_Emissions + '</th>');
            _str.push('<th width="25%">' + corpReport_FlightCarbEm.js_CarbonOffset + '</th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (data) {
            var _body = $('<div class="tbody" style="overflow-y: hidden;height: 93px;"><table><tbody id="bodyTableID"></tbody><table></div>');
            $('#fltCarbCalID').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //no data
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _str = ['<tr>'];
                    _str.push('<td width="25%" class="left">' + data[i].TrvType + '</td>');
                    _str.push('<td width="25%">' + CM.fixData.transData(data[i].Mile, 0) + '</td>');
                    _str.push('<td width="25%">' + CM.fixData.transData(data[i].CarbEmis, 0) + '</td>');
                    _str.push('<td width="25%">' + CM.fixData.transData(data[i].CarbComp, 0) + '</td></tr>');
                    _bodyTableID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        },
        drawFoot: function (data) {
            var _foot = $('<table><tfoot id="footTableID"></tfoot></table>');
            $('#fltCarbCalID').append(_foot);
            var _str = ['<tr>'];
            _str.push('<td width="25%" class="left">' + corpReport_FlightCarbEm.js_Total + '</td>');
            _str.push('<td width="25%">' + CM.fixData.transData(data.TolMile, 0) + '</td>');
            _str.push('<td width="25%">' + CM.fixData.transData(data.TolCarbEmis, 0) + '</td>');
            _str.push('<td width="25%">' + CM.fixData.transData(data.TolCarbComp, 0) + '</td></tr>');
            $('#footTableID').append(_str.join(""));
        },
        clearAll: function () {
            $('#fltCarbCalID').empty();
        }
    };

    //数据修复
    var pageData = {
        init: function () {
            //初始化静态数据
            $('#TolMileID').html('<span>' + CM.fixData.transData(_fltCarbInfo.TolCarbInfo.TolMile, 0) + 'KM</span>' + corpReport_FlightCarbEm.js_TotalMileage);
            $('#TolCarbEmisID').html('<span>' + CM.fixData.transData(_fltCarbInfo.TolCarbInfo.TolCarbEmis, 0) + 'KG</span>' + corpReport_FlightCarbEm.js_CO2Emissions);
            $('#TolCarbCompID').html('<span class="for_color">' + CM.fixData.transData(_fltCarbInfo.TolCarbInfo.TolCarbComp, 0) + '</span>' + corpReport_FlightCarbEm.js_CarbonOffsetTrees);
        }
    };

    //
    var flightCarbEmInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //
        $.ajax({
            url: '../Flight/GetFlightCarbEm',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                //初始赋值
                _flightCarbEmInfo = $.parseJSON(data);
                //初始赋值
                _fltCarbInfo = _flightCarbEmInfo.FltCarbInfo;
                //初始化
                fltCarbCal.init();
                pageData.init();
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
        flightCarbEmInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..
            window.location.hash = '#' + CM.getParam( dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(1);
    Droco_Funs.getFlightsSubNav(10);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);