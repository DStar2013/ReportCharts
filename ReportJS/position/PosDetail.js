(function ($) {
    //☆=================== var S ===================☆
    var _posDetailInfo;
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    function navInit() {
        var _hdmk = $('#menu').find('a');
        //
        if (_hdmk && _hdmk.length > 0) { CM.hrefChange(_hdmk, _headSelectInfo); }
        //no lan change
        $('#lanVerID').css("visibility", "hidden");
    }

    var posDetail = {
        timeout: null,
        init: function () {
            posDetail.ajaxPosData();
            //search
            $('#orderNO').bind('keyup', posDetail.keyupSearch);
            $('#psgerName').bind('keyup', posDetail.keyupSearch);
        },
        drawTable: function (dt) {
            posDetail.clearTable();
            posDetail.drawHead();
            posDetail.drawBody(dt);
        },
        drawHead: function () {
            //绘制头部
            var _head = $('<div class="thead"><table><thead id="headTableID"></thead></table></div>');
            $('#posDetailT').append(_head);
            //
            var _str = ['<tr>'];
            _str.push('<th width="7%">' + corpReport_PosDetails.js_OrderNO + '</th>');
            _str.push('<th width="7%">' + corpReport_PosDetails.js_Passenger + '</th>');
            _str.push('<th width="10%">' + corpReport_PosDetails.js_MobilePhone + '</th>');
            _str.push('<th width="15%">' + corpReport_PosDetails.js_Info + '</th>');
            _str.push('<th width="12%">' + corpReport_PosDetails.js_Departure + '</th>');
            _str.push('<th width="12%">' + corpReport_PosDetails.js_Arrival + '</th>');
            _str.push('<th width="7%">' + corpReport_PosDetails.js_DepartureCity + '</th>');
            _str.push('<th width="14%">' + corpReport_PosDetails.js_ArrivalCity + '</th>');
            _str.push('<th width="9%">' + corpReport_PosDetails.js_Dept + '</th>');
            _str.push('<th width="7%">' + corpReport_PosDetails.js_OrderType + '</th>');
            //_str.push('<th class="null_place"><div></div></th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (dt) {
            //绘制整个body
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>');
            $('#posDetailT').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //no data
            if (dt.length > 0) {
                for (var i = 0; i < dt.length; i++) {
                    var _tr = $('<tr></tr>'), _str = [];
                    _str.push('<td width="7%">' + dt[i].Orderid + '</td>');
                    _str.push('<td width="7%">' + dt[i].PassengerName + '</td>');
                    _str.push('<td width="10%">' + dt[i].MobilePhone + '</td>');
                    _str.push('<td width="15%">' + dt[i].Info + '</td>');
                    _str.push('<td width="12%">' + dt[i].Arrival + '</td>');
                    _str.push('<td width="12%">' + dt[i].Departure + '</td>');
                    _str.push('<td width="7%">' + dt[i].Acity + '</td>');
                    _str.push('<td width="14%">' + dt[i].Dcity + '</td>');
                    _str.push('<td width="9%">' + dt[i].Dept1 + '</td>');
                    _str.push('<td width="7%">' + dt[i].Type + '</td>');
                    _tr.data('dInfo', dt[i]);
                    _bodyTableID.append(_tr.append(_str.join("")));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        },
        clearTable: function () {
            $('#posDetailT').empty();
        },
        keyupSearch: function (event) {
            event.preventDefault();
            event.stopPropagation();
            //
            window.clearTimeout(posDetail.timeout);
            posDetail.timeout = window.setTimeout(function () {
                var oKey = $('#orderNO').val(), pKey = $('#psgerName').val();
                if (IsEmpty(oKey) && IsEmpty(pKey)) {
                    posDetail.drawTable(_posDetailInfo.CityDetails.CityDetailsInfo);
                } else {
                    posDetail.drawTable(posDetail.filterList(oKey, pKey, _posDetailInfo.CityDetails.CityDetailsInfo));
                }
            }, 300);
        },
        filterList: function (oKey, pKey, list) {
            if (IsEmpty(oKey) && IsEmpty(pKey)) return list;
            var newList = [];
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (posDetail.IsContain(oKey, list[i].Orderid) && posDetail.IsContain(pKey, list[i].PassengerName)) {
                        newList.push(list[i]);
                    }
                }
            }
            return newList;
        },
        IsContain: function (str, key) {
            if (IsEmpty(str)) {
                return true;
            } else {
                var reg = new RegExp(str + '+', 'gi');
                return reg.test(key);
            }
        },
        ajaxPosData: function () {
            var noDataID = $('#noDataID');
            noDataID.mask();
            $.ajax({
                url: '../ReportUI/GetTrackCityDetailInfo',
                type: "POST",
                data: pQData,
                success: function (data) {
                    noDataID.unmask();
                    //初始赋值
                    _posDetailInfo = $.parseJSON(data);
                    //
                    posDetail.drawTable(_posDetailInfo.CityDetails.CityDetailsInfo);
                },
                error: function () {
                    noDataID.unmask();
                    console.log('init ajax error!');
                }
            });
        }
    };

    //fun
    function IsEmpty(value) {
        if ((typeof value == 'string' && value.length == 0) || value == null)
            return true;
        else
            return false;
    }
    //☆=================== Fun E ===================☆
    posDetail.init();

    Droco_Funs.getHeader(4);
    Droco_Funs.getFooter();
    //
    navInit();

})(jQuery);