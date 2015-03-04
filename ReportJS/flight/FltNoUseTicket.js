(function ($, $cq) {
    //☆=================== var S ===================☆
    var MOD = {}, Controls = {};
    var placeHoderInfo = {
        cardNotice: corpReport_NoUseTickets.js_Info1,
        tripNotice: corpReport_NoUseTickets.js_Info2,
        psgerNotice: corpReport_NoUseTickets.js_Info3,
        startNotice: "yyyy-mm-dd",
        endNotice: "yyyy-mm-dd"
    }
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //导航的hrf初始化、pad-menu
    function navInit() {
        var _hdmk = $('#menu').find('a'),
            _fltmk = $('#fliSubNavID').find('a'),
            _htlmk = $('#htlSubNavID').find('a');
        //
        if (_hdmk && _hdmk.length > 0) { CM.hrefChange(_hdmk, _headSelectInfo); }
        if (_fltmk && _fltmk.length > 0) { CM.hrefChange(_fltmk, _headSelectInfo); }
        if (_htlmk && _htlmk.length > 0) { CM.hrefChange(_htlmk, _headSelectInfo); }
        //menu_ico展示隐藏
        $('.menu_ico').bind('click', function () { $('.sub_nav').addClass('on'); });
        $('.icon.i4').bind('click', function () { $('.sub_nav').removeClass('on'); });
    }

    //
    var pageHead = {
        init: function () {
            //
            pageHead.accountDraw(_headInitInfo.masterAccountInfo);
            pageHead.ticketStatus();
            //出票时间
            var nowDate = new Date(_headInitInfo.nowTime),
                fontDays = -365,
                _sDate = nowDate.addDays(-365),
                _eDate = _sDate.addMonths(3);
            //fontDate = nowDate.addDays(fontDays);
            $cq('#StartTime').value(_sDate.format('yyyy-MM-dd'));
            $cq('#EndTime').value(_eDate.format('yyyy-MM-dd'));
            MOD.StartTime.method('checkValue');
            MOD.EndTime.method('checkValue');
            //
            Controls.dateControl = UIControl.createDate({
                start: '#StartTime',
                end: '#EndTime',
                nowdate: nowDate.format('yyyy-MM-dd'),
                fontdays: fontDays,
                lanType: lanType
            });
            //pad 禁止键盘弹出
            if (CM.browser.isIPad) {
                document.getElementById('StartTime') && (document.getElementById('StartTime').readOnly = true);
                document.getElementById('EndTime') && (document.getElementById('EndTime').readOnly = true);
            }
            //
            $('#btnSearch').bind('click', pageHead.btnSearchClick);
        },
        accountDraw: function (data) {
            var ai = $('#accountInfo'),
                as = $('#accountSpan');
            ai.empty();
            //
            if (data.length > 0) {
                var _ul = $('<ul></ul>'),
                    _li = [],
                    defaultVal = data[0];
                for (var i = 0; i < data.length; i++) {
                    _li.push('<li><a href="javascript:;" title="' + data[i].Name + '" dInfo=' + data[i].Value + ' index=' + i + '>' + data[i].Name + '</a></li>')
                }
                ai.append(_ul.append(_li.join("")));
                //初始选中第一条记录
                as.html(defaultVal.Name + '<i class="icon i5"></i>');
                as.data('dInfo', defaultVal.Value);
                as.data('index', 0);

                //绑定事件
                as.bind('click', pageHead.spanClick);
                ai.find('li').bind('click', pageHead.onAccountClick);
            }
        },
        spanClick: function (event) {
            event.preventDefault();
            event.stopPropagation();

            var ai = $('#accountInfo'),
                as = $('#accountSpan');
            if (as.hasClass('click_on')) {
                as.removeClass('click_on');
                ai.css('display', 'none');
            } else {
                as.addClass('click_on');
                ai.css('display', '');
            }
        },
        onAccountClick: function (event) {
            var ai = $('#accountInfo'), as = $('#accountSpan');
            as.html($(this).text() + '<i class="icon i5"></i>');
            as.data('dInfo', $(this).find('a').attr('dInfo'));
            as.data('index', $(this).find('a').attr('index'));
            //hide
            pageHead.hideAccount();
        },
        hideAccount: function () {
            $('#accountSpan').removeClass('click_on');
            $('#accountInfo').css('display', 'none');
        },
        ticketStatus: function () {
            var ts = $('#ticketSpan'),
                ti = $('#ticketInfo');
            ts.data('dInfo', ts.attr('dInfo'));
            ts.bind('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                //
                if (ts.hasClass('click_on')) {
                    ts.removeClass('click_on');
                    ti.css('display', 'none');
                } else {
                    ts.addClass('click_on');
                    ti.css('display', '');
                }
            });
            //
            ti.find('li').bind('click', pageHead.onTicketClick);
        },
        onTicketClick: function (event) {
            var ts = $('#ticketSpan'),
                ti = $('#ticketInfo');
            ts.html($(this).text() + '<i class="icon i5"></i>');
            ts.data('dInfo', $(this).find('a').attr('dInfo'));
            ts.removeClass('click_on');
            ti.css('display', 'none');
        },
        getHeadInfo: function () {
            var as = $('#accountSpan');

            return {
                AcountID: as.data('dInfo'),
                AcountName: as.text(),
                Uid: $cq('#CardNo').value(),
                FlightCity: $cq('#Trip').value(),
                PassengerName: $cq('#Psger').value(),
                TicketType: $('#ticketSpan').data('dInfo'),
                StartTime: $cq('#StartTime').value(),
                EndTime: $cq('#EndTime').value()
            };
        },
        btnSearchClick: function (event) {
            if (Controls.dateControl.validate()) {
                fltTable.ajaxFltTicketInfo();
            }
        }
    };

    //
    var fltTable = {
        init: function () {
            //初始信息
            fltTable.ajaxFltTicketInfo();
            //绑定下载按钮
            $('#download').bind('click', downLoadAnysis);
        },
        draw: function (dt) {
            //clear
            fltTable.clearAll();
            fltTable.drawHead();
            fltTable.drawBody(dt);
        },
        drawHead: function () {
            var _head = $('<table><thead id="headTableID"></thead></table>');
            $('#fltTicket').append(_head);
            //
            var _str = ['<tr>'];
            _str.push('<th width="10%">' + corpReport_NoUseTickets.js_OrderNO + '</th>');
            _str.push('<th width="10%">' + corpReport_NoUseTickets.js_CtripID + '</th>');
            _str.push('<th width="7%">' + corpReport_NoUseTickets.js_CardHolder + '</th>');
            _str.push('<th width="7%">' + corpReport_NoUseTickets.js_PassengerName + '</th>');
            _str.push('<th width="10%">' + corpReport_NoUseTickets.js_Itinerary + '</th>');
            _str.push('<th width="10%">' + corpReport_NoUseTickets.js_PrintTicketTime + '</th>');
            _str.push('<th width="10%">' + corpReport_NoUseTickets.js_TakeoffTime + '</th>');
            _str.push('<th width="8%">' + corpReport_NoUseTickets.js_TicketNO + '</th>');
            _str.push('<th width="8%">' + corpReport_NoUseTickets.js_FlightNO + '</th>');
            _str.push('<th width="6%">' + corpReport_NoUseTickets.js_SubClass + '</th>');
            _str.push('<th width="7%">' + corpReport_NoUseTickets.js_Discount + '</th>');
            _str.push('<th width="7%">' + corpReport_NoUseTickets.js_Amount + '</th>');
            _str.push('<th class="null_place"><div></div></th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (data) {
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>');
            $('#fltTicket').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //no data
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var _str = data[i].Flag ? ['<tr class="color">'] : ['<tr>'];
                    _str.push('<td width="10%">' + data[i].OrderID + '</td>');
                    _str.push('<td width="10%">' + data[i].Uid + '</td>');
                    _str.push('<td width="7%">' + data[i].UserName + '</td>');
                    _str.push('<td width="7%">' + data[i].PassengerName + '</td>');
                    _str.push('<td width="10%">' + data[i].FlightCity + '</td>');
                    _str.push('<td width="10%">' + data[i].PrintTicketTime + '</td>');
                    _str.push('<td width="10%">' + data[i].TakeoffTime + '</td>');
                    _str.push('<td width="8%">' + data[i].TicketNO + '</td>');
                    _str.push('<td width="8%">' + data[i].FlightNO + '</td>');
                    _str.push('<td width="6%">' + data[i].SubClass + '</td>');
                    _str.push('<td width="7%">' + data[i].PriceRate + '</td>');
                    _str.push('<td width="7%">' + data[i].Amount + '</td>');
                    _str.push('</tr>');
                    _bodyTableID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        },
        clearAll: function () {
            $('#fltTicket').empty();
        },
        _timeout: null,
        ajaxFltTicketInfo: function () {
            //            var ft = $('#fltTicket');
            //            CM.LoadingHeightFix(ft);
            var noDataID = $('#noDataID');
            noDataID.mask();
            //
            var d = pageHead.getHeadInfo();

            window.clearTimeout(fltTable._timeout);
            fltTable._timeout = window.setTimeout(function () {
                $.ajax({
                    url: '../Flight/GetFlightNoUseTickets',
                    type: "POST",
                    data: d,
                    success: function (data) {
                        noDataID.unmask();
                        var _info = $.parseJSON(data);
                        //绘制
                        fltTable.draw(_info.NoUseTicketsinfo);
                        //
                        $('#reMk .m-r').html(_info.Prompt);
                    },
                    error: function () {
                        noDataID.unmask();
                        console.log('init ajax error!');
                    }
                });
            }, 1000);
        }
    };

    //明细下载
    var downLoadAnysis = function () {
        var accountID = $('#accountSpan').data('dInfo');
        var tickettype = $('#ticketSpan').data('dInfo');
        var starttime = $cq('#StartTime').value();
        var endTime = $cq('#EndTime').value();

        var f = document.getElementById("queryForm");
        f.action = DownloadAnysisUrl + '?AcountID=' + accountID + '&TicketType=' + tickettype + '&StartTime=' + starttime + '&EndTime=' + endTime;
        f.submit();
    }

    //placeholder
    var regNoticeInit = function () {
        var versions = '1.0',
            c = $cq('#CardNo'),
            t = $cq('#Trip'),
            p = $cq('#Psger'),
            s = $cq('#StartTime'),
            e = $cq('#EndTime');
        //
        var M = function (_, n, t) {
            return _.regMod("notice", versions, {
                name: n,
                tips: t,
                selClass: "inputSel"
            });
        }
        //
        c.length && (MOD.CardNo = M(c, 'CardNo', placeHoderInfo.cardNotice));
        t.length && (MOD.Trip = M(t, 'Trip', placeHoderInfo.tripNotice));
        p.length && (MOD.Psger = M(p, 'Psger', placeHoderInfo.psgerNotice));
        s.length && (MOD.StartTime = M(s, 'StartTime', placeHoderInfo.startNotice));
        e.length && (MOD.EndTime = M(e, 'EndTime', placeHoderInfo.endNotice));
    }
    //☆=================== Fun E ===================☆
    //Init
    regNoticeInit();
    if (_cfgInfo.HasNoUseTickets == "T") {
        pageHead.init();
        fltTable.init();
    } else {
        var _t = $('#fltTicket');
        _t.empty().height(500);
        CM.ChargeFix(_t, "payment19.jpg", lanType);
        $('#reMk').css('visibility', 'hidden');
    }

    //
    Droco_Funs.getHeader(1);
    Droco_Funs.getFlightsSubNav(8);
    Droco_Funs.getFooter();
    //
    navInit();

})(jQuery, cQuery);
