(function ($) {
    //☆=================== var S ===================☆
    var _hotelAgreementInfo, //页面信息
        _hotelStrInfo, //协议酒店间夜占比
        _htlAgreeCity, //协议酒店城市列表
        _htlAgreeDetail; //协议酒店使用情况
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //协议酒店使用情况
    var htlAgreeDetail = {
        init: function () {
            //..
            var _htlAgreeDetailID = $('#htlAgreeDetailID'),
            agrInfo = _htlAgreeDetail.AgrHtlDistInfo,
            _isDtEmp = agrInfo && htlAgreeDetail.checkDataEmpty(agrInfo);

            _htlAgreeDetailID.css('display', '');
            _htlAgreeDetailID.empty();

            if (_cfgInfo.HasAgrHtlUse == "T") {
                if (_isDtEmp) {
                    CM.LineHeightFix(_htlAgreeDetailID);
                } else {
                    htlAgreeDetail.drawPieChart(_htlAgreeDetailID, _htlAgreeDetail.AgrHtlDistInfo);
                }
            } else {
                CM.ChargeFix(_htlAgreeDetailID, "payment13.jpg", lanType);
            }
        },
        checkDataEmpty: function (dt) {
            for (var i = 0; i < dt.length; i++) {
                if (dt[i].Number && dt[i].Number > 0) { return false; }
            }
            return true;
        },
        drawPieChart: function (content, dt) {
            var data = [],
            _d = {};
            _d.type = "pie";
            _d.name = "消费金额";
            _d.data = htlAgreeDetail.getData(dt);
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
                                if (this.percentage > 0) {
                                    return this.point.name + ': ' + this.percentage.toFixed(1) + '%';
                                }
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.point.name + '</b><br/>' +
                                 +this.point.y + corpReport_HotelAgreement.js_Hotels + '<br/>' +
                            corpReport_HotelAgreement.js_Percent + ': ' + this.percentage.toFixed(1) + '%'
                    },
                    style: {
                        lineHeight: '18px'
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
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    var _s = {};
                    _s.name = data[i].Name;
                    _s.y = data[i].Number;
                    _d[i] = _s;
                }
            }
            return _d;
        }
    };

    //协议酒店城市列表
    var htlAgreeCity = {
        init: function () {
            //.
            var _htlAgrCityExID = $('#htlAgrCityExID'),
            _htlAgreeCityID = $('#htlAgreeCityID');
            _htlAgrCityExID.css('display', '');

            htlAgreeCity.clearAll();
            if (_cfgInfo.HasAgrHtlNoPerson == "T") {
                //绘制table表格
                htlAgreeCity.drawHead();
                htlAgreeCity.drawBody(_htlAgreeCity.AgrHtlCityInfo);
                htlAgreeCity.drawFoot(_htlAgreeCity.TolHtlAgrCity);
            } else {
                _htlAgreeCityID.height(310);
                CM.ChargeFix(_htlAgreeCityID, "payment14.jpg", lanType);
            }
        },
        drawHead: function () {
            //绘制头部
            var _head = $('<table><thead id="headTableID"></thead></table>');
            $('#htlAgreeCityID').append(_head);
            var _str = ['<tr>'];
            _str.push('<th width="30%">' + corpReport_HotelAgreement.js_Cities + '</th>');
            _str.push('<th width="35%">' + corpReport_HotelAgreement.js_CorpHotels + '</th>');
            _str.push('<th width="35%">' + corpReport_HotelAgreement.js_MemHotelsBooked + '</th>');
            _str.push('<th class="null_place"><div></div></th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (data) {
            //绘制整个body
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>');
            $('#htlAgreeCityID').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //no data
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _str = ['<tr>'];
                    _str.push('<td width="30%">' + data[i].Name + '</td>');
                    _str.push('<td width="35%">' + data[i].Number + '</td>');
                    _str.push('<td width="35%">' + data[i].MHotelNum + '</td>');
                    _str.push('<td class="null_place"><div></div></td></tr>');
                    _bodyTableID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }

        },
        drawFoot: function (data) {
            //绘制foot部分
            var _foot = $('<table><tfoot id="footTableID"></tfoot></table>');
            $('#htlAgreeCityID').append(_foot);
            var _str = ['<tr>'];
            _str.push('<td width="30%">' + corpReport_HotelAgreement.js_Total + '</td>');
            _str.push('<td width="35%">' + data.TolNumber + '</td>');
            _str.push('<td width="35%">' + data.TolMHotelNum + '</td>');
            _str.push('<td class="null_place"><div></div></td></tr>');
            $('#footTableID').append(_str.join(""));
        },
        clearAll: function () {
            $('#htlAgreeCityID').empty();
        }
    };

    //固定数据的初始化
    var pageData = {
        init: function () {
            //..
            var _agreeHotelID = $('#agreeHotelID');
            _agreeHotelID.css('display', '');

            if (_cfgInfo.HasAgrHtlGeneral == "T") {
                //初始化静态数据
                var _str = ['<p>' + corpReport_HotelAgreement.js_CorpHotelRoomNights + '</p>'];
                _str.push('<p><em>' + CM.fixData.transData(_hotelStrInfo.Quantity, 0) + '</em></p>');
                _str.push('<p>' + corpReport_HotelAgreement.js_CorpHotelsPercentage + '</p>')
                _str.push('<p><em>' + _hotelStrInfo.Percent + '</em></p>')
                _agreeHotelID.html(_str.join(""));
            } else {
                _agreeHotelID.height(225);
                CM.ChargeFix(_agreeHotelID, "payment12.jpg", lanType);
            }
        }
    };

    //
    var hotelAgreementInit = function (data) {
        var noDataID = $('#noDataID');
        noDataID.mask();
        //
        $.ajax({
            url: '../Hotel/GetHotelAgreement',
            type: "POST",
            data: data,
            success: function (data) {
                noDataID.unmask();
                //初始赋值
                _hotelAgreementInfo = $.parseJSON(data);
                //初始赋值
                _hotelStrInfo = _hotelAgreementInfo.HotelAgree;
                _htlAgreeDetail = _hotelAgreementInfo.HotelAgreeDetail;
                _htlAgreeCity = _hotelAgreementInfo.HotelAgrCity;
                //初始化
                pageData.init();
                htlAgreeDetail.init();
                htlAgreeCity.init();
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
        hotelAgreementInit(dpHeader.getHeadData());

        dpHeader.setDataChange(function (_o) {
            //..
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(2);
    Droco_Funs.getHotelSubNav(1);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);