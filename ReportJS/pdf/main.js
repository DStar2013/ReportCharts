(function ($) {
    //code by dstar
    //☆=================== var S ===================☆
    var pageName = ["总概"];
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    function headInit() {
        $('.CT_header').empty().html($('#headTmpl').tmpl(PDFConfig.headInfo));
    }

    function drawBar(content, dt, cfg) {
        content.highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: null
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: dt.xData,
                title: {
                    text: null
                },
                tickLength: 2
            },
            yAxis: {
                title: {
                    text: null
                },
                gridLineWidth: 0,
                labels: {
                    enabled: false
                },
                plotLines: [{
                    color: '#C0D0E0',
                    width: 1,
                    value: 0
                }],
                max: dt.maxY ? dt.maxY : null
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return '<b>¥</b> ' + CM.fixData.transData(this.y, 0);
                        },
                        crop: false,
                        overflow: "none",
                        style: {
                            color: '#666'
                        }
                    },
                    //minPointLength: 3,
                    borderRadius: 0.5,
                    pointWidth: (cfg && cfg.pointWidth) || 40
                },
                series: {
                    borderWidth: 0,
                    colorByPoint: true
                }
            },
            series: dt.yData
        });
    }

    function drawColumn(content, dt, cfg) {
        content.highcharts({
            chart: {
                type: 'column',
                marginBottom: cfg.marginBottom || 48
            },
            title: {
                text: null
            },
            xAxis: {
                categories: dt.xData,
                tickInterval: (parseInt(dt.xData.length / 10) + 1),
                tickLength: 2
            },
            yAxis: {
                title: {
                    text: null
                },
                gridLineWidth: 0,
                min: cfg.minY ? cfg.minY : null,
                labels: {
                    enabled: false
                },
                plotLines: [{
                    color: '#C0D0E0',
                    width: 1,
                    value: 0
                }]
            },
            legend: {
                y: 11,
                x: 0,
                floating: true,
                borderWidth: 0,
                shadow: false
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    borderWidth: 0,
                    minPointLength: 3,
                    borderRadius: 0.5,  //设置柱状图的圆角，美观 
                    pointWidth: cfg.pointWidth ? cfg.pointWidth : 25
                    //groupPadding: 3 
                }
            },
            credits: {
                enabled: false
            },
            series: dt.yData
        });
    }

    function drawPie(content, dt, cfg) {
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
                        enabled: cfg.dataLabelEnabled || false,
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
                enabled: false
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
                    return this.name + ' ' + this.percentage.toFixed(1) + '%  ¥' + CM.fixData.transData(this.y, 0);
                }
            },
            credits: {
                enabled: false
            },
            series: dt
        });
    }

    //
    var SumPage = (function (aInfo, cfgInfo) {
        var sp = {
            init: function () {
                sp.initTitle();
                sp.initData();
                //
                sp.initChart();
            },
            initTitle: function () {
                $('.CT_SumPageTitle').empty().html($('#pageTitleTmpl').tmpl({ pTitle: pageName[0] }));
            },
            initData: function () {
                //
                $('#sp_warnInfo').html(aInfo.SumInfo.WarnInfo).css("visibility", aInfo.SumInfo.IsWarnShow ? "visible" : "hidden");
                $('#sp_allConsumID').html("<span>¥</span>" + CM.fixData.transData(aInfo.SumInfo.AllConsumption, 0));
                $('#sp_allSaveID').html("<span>¥</span>" + CM.fixData.transData(aInfo.SumInfo.AllSaving, 0));
                //
                $("#sp_fltConsum").html("<span>¥</span>" + CM.fixData.transData(aInfo.FlightInfo.AllConsum, 0));
                $('#sp_fltAvgPrice').html("<span>¥</span>" + CM.fixData.transData(aInfo.FlightInfo.AvgPrice, 0));
                $('#sp_fltAvgDiscount').html(aInfo.FlightInfo.AveDisCount);
                //
                $('#sp_htlConsum').html("<span>¥</span>" + CM.fixData.transData(aInfo.HotelInfo.AllConsum, 0));
                $('#sp_htlAvgPrice').html("<span>¥</span>" + CM.fixData.transData(aInfo.HotelInfo.AvgPrice, 0));
            },
            initChart: function () {
                //bar
                var sp_asc = $('#sp_allConsumSID'),
                    barD = sp.getBarData(),
                    sp_acm = $('#sp_allConsumMID'),
                    colD = sp.getColumData(),
                    sp_dep = $('#sp_fiveDepConsum'),
                    sp_des = $('#sp_fiveDesConsum'),
                    sp_f = $('#sp_flight'),
                    fD = sp.getFlightData(),
                    sp_fl = $('#sp_flightList'),
                    sp_h = $('#sp_hotel'),
                    hD = sp.getHotelData(),
                    sp_hl = $('#sp_hotelList');
                //
                sp_asc.empty(); sp_acm.empty();
                sp_dep.empty(); sp_des.empty();
                sp_f.empty(); sp_h.empty();
                //bar
                if (sp.barDataEmpty(barD)) {
                    CM.LineHeightFix(sp_asc);
                } else {
                    drawBar(sp_asc, sp.fixBarData(barD), {
                        pointWidth: 25
                    });
                }
                //col
                if (sp.columnDataEmpty(colD)) {
                    CM.LineHeightFix(sp_acm);
                } else {
                    drawColumn(sp_acm, sp.fixColumnData(colD), {
                        pointWidth: 30
                    });
                    //table
                    sp.drawColumnTable($('#sp_allConsumTable'), colD);
                    //css
                    $('#sp_allConsumTable').find('table').addClass("data-table center mb30");
                }
                //top 5 dep
                if (cfgInfo.HasTotalTop5 == "T") {
                    if (aInfo.FiveDepConsumInfo.length > 0) {
                        drawPie(sp_dep, sp.fixPieData(aInfo.FiveDepConsumInfo), {});
                    } else {
                        CM.LineHeightFix(sp_dep);
                    }
                } else {
                    CM.ChargeFix(sp_dep, "payment15.jpg", PDFConfig.lanType);
                }
                //top 5 des
                if (aInfo.FiveDesConsumInfo.length > 0) {
                    drawPie(sp_des, sp.fixPieData(aInfo.FiveDesConsumInfo), {});
                } else {
                    CM.LineHeightFix(sp_des);
                }
                //flight
                if (sp.columnDataEmpty(fD)) {
                    CM.LineHeightFix(sp_f);
                } else {
                    drawColumn(sp_f, sp.fixColumnData(fD), {
                        pointWidth: 30
                    });
                    //table
                    sp.drawColumnTable($('#sp_flightTable'), fD);
                    //css
                    $('#sp_flightTable').find('table').addClass("data-table center");
                }
                //flt list
                sp_fl.empty().html($('#sp_listTmpl').tmpl(aInfo.FlightInfo.BeforeDiscount));
                //hotel
                if (sp.columnDataEmpty(hD)) {
                    CM.LineHeightFix(sp_h);
                } else {
                    drawColumn(sp_h, sp.fixColumnData(hD), {
                        pointWidth: 30
                    });
                    //table
                    sp.drawColumnTable($('#sp_hotelTable'), hD);
                    //
                    $('#sp_hotelTable').find('table').addClass("data-table center");
                }
                //htl list
                sp_hl.empty().html($('#sp_listTmpl').tmpl(aInfo.HotelInfo.StarSit));
            },
            getBarData: function () {
                var arr = [];
                arr.push({
                    Name: "火车票",
                    Data: aInfo.SumInfo.TrainPrice,
                    Color: '#00cd9f'
                });
                if (cfgInfo.HasAgrHotelProduct == "T") {
                    arr.push({
                        Name: "协议酒店",
                        Data: aInfo.SumInfo.ArgHotelPrice,
                        Color: '#feda85'
                    });
                }
                if (cfgInfo.HasMemHotelProduct == "T") {
                    arr.push({
                        Name: "会员酒店",
                        Data: aInfo.SumInfo.MemHotelPrice,
                        Color: '#ffa60c'
                    });
                }
                if (cfgInfo.HasOutAirTicketProduct == "T") {
                    arr.push({
                        Name: "国际机票",
                        Data: aInfo.SumInfo.InterFlightPrice,
                        Color: '#79b3ff'
                    });
                }
                if (cfgInfo.HasInAirTicketProduct == "T") {
                    arr.push({
                        Name: "国内机票",
                        Data: aInfo.SumInfo.DomFlightPrice,
                        Color: '#1c76ec'
                    });
                }
                return arr;
            },
            barDataEmpty: function (dt) {
                for (var i = 0; i < dt.length; i++) {
                    if (dt[i].Data != 0) { return false; }
                }
                return true;
            },
            fixBarData: function (dt) {
                var _x = [], _y = [], _maxY = 0;

                for (var i = 0; i < dt.length; i++) {
                    _x.push(dt[i].Name);
                    _y.push({
                        y: dt[i].Data,
                        color: dt[i].Color
                    });
                    //
                    if (dt[i].Data > _maxY) { _maxY = dt[i].Data; }
                }
                //
                _maxY = parseInt(_maxY * 1.2);
                return {
                    xData: _x,
                    yData: [{ data: _y}],
                    maxY: _maxY
                };
            },
            getColumData: function () {
                var arr = [];
                arr.push({
                    Name: "火车票",
                    Data: aInfo.SumInfo.TrainInfo,
                    Color: '#00cd9f'
                });
                //
                if (cfgInfo.HasAgrHotelProduct == "T") {
                    arr.push({
                        Name: "协议酒店",
                        Data: aInfo.SumInfo.AgrHotelInfo,
                        Color: '#feda85'
                    });
                }
                if (cfgInfo.HasMemHotelProduct == "T") {
                    arr.push({
                        Name: "会员酒店",
                        Data: aInfo.SumInfo.MemHotelInfo,
                        Color: '#ffa60c'
                    });
                }
                if (cfgInfo.HasOutAirTicketProduct == "T") {
                    arr.push({
                        Name: "国际机票",
                        Data: aInfo.SumInfo.InteFlightInfo,
                        Color: '#79b3ff'
                    });
                }
                if (cfgInfo.HasInAirTicketProduct == "T") {
                    arr.push({
                        Name: "国内机票",
                        Data: aInfo.SumInfo.DomFlightInfo,
                        Color: '#1c76ec'
                    });
                }
                return arr;
            },
            columnDataEmpty: function (dt) {
                for (var i = 0; i < dt.length; i++) {
                    var _iData = dt[i].Data;
                    for (var j = 0; j < _iData.length; j++) {
                        if (_iData[j].Value != 0) { return false; }
                    }
                }
                return true;
            },
            fixColumnData: function (dt) {
                var _x = [], _y = [], dList = dt[0].Data;
                for (var m = 0; m < dt.length; m++) {
                    var md = dt[m].Data, tmpY = [];
                    for (var n = 0; n < md.length; n++) {
                        (0 == m) && (_x.push(md[n].Key));
                        tmpY.push({ y: md[n].Value });
                    }
                    _y.push({
                        color: dt[m].Color,
                        name: dt[m].Name,
                        data: tmpY
                    });
                }
                return {
                    xData: _x, yData: _y
                };
            },
            drawColumnTable: function (content, dt) {
                var thd = [], tbd = [];
                for (var i = 0; i < dt.length; i++) {
                    var md = dt[i].Data, tmpD = [];
                    for (var j = 0; j < md.length; j++) {
                        (0 == i) && (thd.push(md[j].Key));
                        tmpD.push("¥" + CM.fixData.transData(md[j].Value));
                    }
                    tbd.push({
                        Key: dt[i].Name,
                        Value: tmpD
                    });
                }
                content.empty().html($('#tableTmpl').tmpl({ thead: thd, tbody: tbd }));
            },
            fixPieData: function (dt) {
                var d = [];
                for (var i = 0; i < dt.length; i++) {
                    d.push({ name: dt[i].Key, y: dt[i].Value });
                }
                return [{
                    type: "pie",
                    name: "消费金额",
                    data: d
                }];
            },
            getFlightData: function () {
                var arr = [];
                if (cfgInfo.HasOutAirTicketProduct == "T") {
                    arr.push({
                        Name: "国际机票",
                        Data: aInfo.SumInfo.InteFlightInfo,
                        Color: '#79b3ff'
                    });
                }
                if (cfgInfo.HasInAirTicketProduct == "T") {
                    arr.push({
                        Name: "国内机票",
                        Data: aInfo.SumInfo.DomFlightInfo,
                        Color: '#1c76ec'
                    });
                }
                return arr;
            },
            getHotelData: function () {
                var arr = [];
                if (cfgInfo.HasAgrHotelProduct == "T") {
                    arr.push({
                        Name: "协议酒店",
                        Data: aInfo.SumInfo.AgrHotelInfo,
                        Color: '#feda85'
                    });
                }
                if (cfgInfo.HasMemHotelProduct == "T") {
                    arr.push({
                        Name: "会员酒店",
                        Data: aInfo.SumInfo.MemHotelInfo,
                        Color: '#ffa60c'
                    });
                }
                return arr;
            }
        }

        return {
            init: sp.init
        }
    })(PageInfo.SumPageInfo, PDFConfig.cfgInfo);
    //☆=================== Fun E ===================☆
    //ready
    $(document).ready(function () {
        Highcharts && (Highcharts.SVGRenderer.prototype.Element.prototype.animate = Highcharts.SVGRenderer.prototype.Element.prototype.attr);
        //
        headInit();
        SumPage.init();
    });
})(jQuery);