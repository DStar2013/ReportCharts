(function ($, $cq) {
    //☆=================== var S ===================☆
    var _cityInfo;
    var MOD = {}, Controls = {};
    var noticeInfo = {
        cityNotice: corpReport_Pos.js_CityNotice,
        startNotice: "yyyy-mm-dd",
        cityEmptyInfo: corpReport_Pos.js_CityEmptyInfo
    };
    var cfgUrl = {
        suggestionUrl: 'AjaxCitySuggestion',
        filterUrl: 'AjaxCityFilter?keyword=${key}'
    }
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    function navInit() {
        var _hdmk = $('#menu').find('a');
        //
        if (_hdmk && _hdmk.length > 0) { CM.hrefChange(_hdmk, _headSelectInfo); }
    }

    var cityMap = {
        _sCondition: {},
        init: function () {
            //初始化map
            cityMap.mapInitState();
            //
            $('#btn_search').bind('click', cityMap.btnSearchEv);
            //
            $('#tipDetail').bind('click', cityMap.tipDetailEv);
            $('#tipDownLoad').bind('click', cityMap.tipDownLoadEv);
            $('#btn_download').bind('click', cityMap.pageDownLoadEv);
            //
            $(document).click(function (e) {
                $('#tipID').css('display', 'none');
            });
        },
        mapInitState: function () {
            if (typeof (mapObj) != "undefined") { mapObj.destroy(); }
            //
            mapObj = new AMap.Map("iCenter", {
                center: new AMap.LngLat(116.397428, 39.90923), //地图中心点 - 北京
                level: 4  //地图显示的缩放级别
                //zooms: [4,8]   //地图缩放范围
            });
            mapObj.plugin(["AMap.ToolBar", "AMap.Scale"], function () {
                toolBar = new AMap.ToolBar();
                mapObj.addControl(toolBar);
                //
                scale = new AMap.Scale();
                mapObj.addControl(scale);
            });
        },
        createControl: function () {
            $('#instCover').remove();
            var _div = $('<div id="instCover" class="tips"></div>');
            var str = [];
            str.push('<ul><li><i class="icon i31"></i> ' + corpReport_Pos.js_Persons100 + '</li>');
            str.push('<li><i class="icon i32"></i> ' + corpReport_Pos.js_Persons40100 + '</li>');
            str.push('<li><i class="icon i33"></i> ' + corpReport_Pos.js_Persons2040 + '</li>');
            str.push('<li><i class="icon i34"></i> ' + corpReport_Pos.js_Persons1020 + '</li>');
            str.push('<li><i class="icon i35"></i> ' + corpReport_Pos.js_Persons10 + '</li></ul>');
            _div.html(str.join(""));
            _div.insertAfter($('#iCenter'));
        },
        drawMap: function (dt) {
            if (typeof (mapObj) != "undefined") { mapObj.destroy(); }
            //
            cityMap.createControl();
            //
            var markers = {};
            mapObj = new AMap.Map("iCenter", {
                center: new AMap.LngLat(116.397428, 39.90923), //地图中心点 - 北京
                level: 4  //地图显示的缩放级别
                //zooms: [4,8]   //地图缩放范围
            });
            //
            //自定义覆盖物
            AMap.homeControlDiv = function () {
            };
            AMap.homeControlDiv.prototype = {
                addTo: function (map, dom) {
                    dom.appendChild(this._getHtmlDom(map));
                },
                _getHtmlDom: function (map) {
                    this.map = map;
                    // 创建一个能承载控件的<div>容器                  
                    var controlUI = document.getElementById("instCover");

                    // 设置控件的位置
                    controlUI.style.position = 'absolute';
                    //controlUI.style.left = '906px';     //设置控件离地图的左边界的偏移量                  
                    //controlUI.style.top = '213px';        //设置控件离地图上边界的偏移量
                    controlUI.style.right = '1px';
                    controlUI.style.bottom = '1px';
                    controlUI.style.zIndex = '100';     //设置控件在地图上显示     

                    return controlUI;
                }
            };
            //地图中添加地图操作ToolBar插件
            mapObj.plugin(["AMap.ToolBar", "AMap.Scale"], function () {
                toolBar = new AMap.ToolBar();
                mapObj.addControl(toolBar);
                //
                scale = new AMap.Scale();
                mapObj.addControl(scale);
                //..
                //创建新的control
                var homeControl = new AMap.homeControlDiv(mapObj); //新建自定义插件对象  
                mapObj.addControl(homeControl);                  //地图上添加插件

                //浮层
                mapMarker.addMarker(dt, mapObj, mapMarker.addEvListen);
            });
        },
        getSearchCondition: function () {
            //
            var accID = _headInitInfo.masterAccountInfo.length > 0 ? _headInitInfo.masterAccountInfo[0].Value : "", tmpType = [], cID = [];
            $('#chsCheck').find('input:checked').each(function (index, obj) {
                tmpType.push(obj.id);
            });
            //cityID
            $('#cityItem').find('[type="hidden"]').each(function (index, obj) {
                cID.push(obj.value);
            });
            return {
                AcountID: accID,
                AcountName: "全部",
                CityID: cID.join(","),
                EndDate: $cq('#StartTime').value(),
                Type: tmpType.join("")
            };
        },
        btnSearchEv: function (event) {
            cityMap._sCondition = cityMap.getSearchCondition();
            if (cityMap.validateCondition(cityMap._sCondition)) {
                cityMap.ajaxMapDataInfo();
            }
        },
        timeout: null,
        ajaxMapDataInfo: function () {
            var noDataID = $('#noDataID');
            noDataID.mask();
            //
            window.clearTimeout(cityMap.timeout);
            cityMap.timeout = window.setTimeout(function () {
                $.ajax({
                    url: '../ReportUI/GetTrackCityInfo',
                    type: "POST",
                    data: cityMap._sCondition,
                    success: function (data) {
                        noDataID.unmask();
                        _cityInfo = $.parseJSON(data);
                        var d = _cityInfo.CityPersons.CityPersonsInfo;
                        //成功后，绘制图表
                        (d && d.length > 0) ? cityMap.drawMap(d) : cityMap.mapInitState();
                    },
                    error: function () {
                        noDataID.unmask();
                        console.log('error!');
                    }
                });
            }, 100);
        },
        validateCondition: function (d) {
            var tmpID = d.CityID.replace(/,/g, '');
            if (IsEmpty(tmpID)) {
                //城市不能为空
                UIControl.WarnControl.show($cq('#city_0'), noticeInfo.cityEmptyInfo);
                return false;
            }
            if (!Controls.dateControl.validate()) return false;
            return true;
        },
        tipDetailEv: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var f = $('#posDetail'), d = $('#tipID').data('dInfo'), c = cityMap._sCondition;
            //form hidden
            $('#H_CityID').val(d.CityID);
            $('#H_AcountID').val(c.AcountID);
            $('#H_AcountName').val(c.AcountName);
            $('#H_EndDate').val(c.EndDate);
            $('#H_DesireTrend').val(c.Type);
            //
            f.attr("action", "PositionDetail#" + CM.getParam(_headSelectInfo));
            f.submit();
        },
        tipDownLoadEv: function (event) {
            event.preventDefault();
            event.stopPropagation();
            //
            var d = $('#tipID').data('dInfo'), c = cityMap._sCondition;
            var tipD = { CityName: d.CityName, CityID: d.CityID, AcountID: c.AcountID, AcountName: c.AcountName, EndDate: c.EndDate, Type: c.Type };
            CM.submitForm({ url: '../ReportUI/PositionDetailDownload', method: 'POST', target: '_blank', data: tipD });
        },
        pageDownLoadEv: function (event) {
            event.preventDefault();
            event.stopPropagation();
            //
            var tmpData = cityMap.getSearchCondition();
            if (cityMap.validateCondition(tmpData)) {
                CM.submitForm({ url: '../ReportUI/PositionDetailDownload', method: 'POST', target: '_blank', data: tmpData });
            }

        }
    };

    //Map Marker
    var mapMarker = {
        iconArr: { "icon i31": "icon i36", "icon i32": "icon i37", "icon i33": "icon i38", "icon i34": "icon i39", "icon i35": "icon i310",
            "icon i36": "icon i31", "icon i37": "icon i32", "icon i38": "icon i33", "icon i39": "icon i34", "icon i310": "icon i35"
        },
        addMarker: function (dt, mapObj, onAdded) {
            mapObj.clearMap();
            //
            for (var i = 0; i < dt.length; i++) {
                var point = new AMap.LngLat(parseFloat(dt[i].East), parseFloat(dt[i].North));
                if (!point) return;
                //
                var _mkCon = document.createElement("div"), _className = "",
                    _xPix = -9, _yPix = -25;
                switch (true) {
                    case dt[i].Number >= 100:
                        _className = "icon i31";
                        break;
                    case dt[i].Number >= 40:
                        _className = "icon i32";
                        break;
                    case dt[i].Number >= 20:
                        _className = "icon i33";
                        break;
                    case dt[i].Number >= 10:
                        _className = "icon i34";
                        break;
                    case dt[i].Number >= 0:
                        _className = "icon i35";
                        break;
                    default:
                        _className = "icon i35";
                        break;
                }
                _mkCon.className = _className;
                //
                var marker = new AMap.Marker({
                    map: mapObj,
                    position: point,
                    content: _mkCon,
                    offset: new AMap.Pixel(_xPix, _yPix) //偏移位置
                    //icon: "http://webapi.amap.com/images/0.png"
                    //offset: new AMap.Pixel(-10, -35)
                });
                onAdded && onAdded(marker, dt[i]);
            }
        },
        addEvListen: function (mkr, dt) {
            var t = null;
            var handle = CM.browser.isIPad ? "click" : "mouseover";
            //
            //mouseover
            var el = $('#tipID');
            AMap.event.addListener(mkr, handle, function (mrk) {
                var pt = mrk.pixel, icon = $(this.e).find(".icon");
                //
                if (icon && icon.length > 0) {
                    icon[0].className = mapMarker.iconArr["" + icon[0].className];
                }
                el.data('fi', window.setTimeout(function () {
                    mapMarker.showTip(el, dt, {
                        x: pt.x + 6,
                        y: pt.y + 6
                    });
                    //clean
                    //$cq(document).bind('click', mapMarker.hideTip);
                }, 150));
                window.clearTimeout(el.data('fo'));
                var event = event || window.event;
                event.stopPropagation();
            });
            //
            AMap.event.addListener(mkr, 'mouseout', function (mrk) {
                var icon = $(this.e).find(".icon");
                if (icon && icon.length > 0) {
                    icon[0].className = mapMarker.iconArr["" + icon[0].className];
                }
                window.clearTimeout(el.data('fi'));
                el.data('fo', window.setTimeout(function () { mapMarker.hideTip(); }, 500));
            });
            //浮层的绑定事件
            el.bind('mouseover', function (event) {
                window.clearTimeout(el.data('fo'));
            });
            el.bind('mouseout', function (event) {
                if (this != event.target) return;
                window.clearTimeout(el.data('fi'));
                el.data('fo', window.setTimeout(function () { mapMarker.hideTip(); }, 500));
            });
            el.bind('click', function (event) {
                event.stopPropagation();
            });
        },
        showTip: function (content, info, pos) {
            //
            content.data('dInfo', info);
            $('#tipName').text(info.CityName);
            $('#tipNum').text(info.Number);

            content.css({
                display: '',
                left: pos.x + "px",
                top: pos.y + "px"
            });

        },
        hideTip: function () {
            $('#tipID').css('display', 'none');
        }
    };

    var tarckPage = {
        cityIndex: 1,
        init: function () {
            tarckPage.dateInit();
            tarckPage.cityInit();
        },
        dateInit: function () {
            var start = $cq('#StartTime');
            //
            start && (MOD.StartTime = regNotice(start, "StartTime", noticeInfo.startNotice));
            //
            var nowDate = new Date(_headInitInfo.nowTime), fontDays = -90;
            $cq('#StartTime').value(nowDate.format('yyyy-MM-dd'));
            MOD.StartTime.method('checkValue');
            //
            Controls.dateControl = UIControl.createDate({
                start: '#StartTime',
                nowdate: nowDate.format('yyyy-MM-dd'),
                fontdays: fontDays,
                lanType: lanType
            });
            //pad 禁止弹出键盘
            if (CM.browser.isIPad) {
                document.getElementById('StartTime') && (document.getElementById('StartTime').readOnly = true);
            }
        },
        cityInit: function () {
            //
            tarckPage.drawCity('#city_0', '#hidCity_0');
            //add City
            $('#addCity').bind('click', tarckPage.addCity);
            //
            $('#cityItem').on('click', 'i', tarckPage.removeEv);
        },
        drawCity: function (cid, hid) {
            return UIControl.createCity({
                txtCity: cid,
                hidCity: hid,
                source: cfgUrl.suggestionUrl,
                filter: cfgUrl.filterUrl,
                lanType: lanType
            });
        },
        addCity: function () {
            //            var _d = $cq(document.createElement('div')), _city = $cq(document.createElement('input')),
            //                _hidCity = $cq(document.createElement('input')), _icon = $cq(document.createElement('i'));
            //            _d.addClass('txts');
            //            _city.value("");
            //            _city.attr('type', 'text').attr('id', 'city_' + tarckPage.cityIndex).attr('placeholder', '');
            //            _hidCity.value("");
            //            _hidCity.attr('type', 'hidden').attr('id', 'hidCity_' + tarckPage.cityIndex);
            //            _icon.addClass('icon i30');
            //            tarckPage.cityIndex++;
            //            _d.append(_city).append(_hidCity).append(_icon);
            //            $('#cityItem').append(_d);
            var _d = $('<div class="txts"></div>'), _str = [];
            _str.push('<input type="text" placeholder="' + noticeInfo.cityNotice + '" id="city_' + tarckPage.cityIndex + '">');
            _str.push('<input type="hidden" id="hidCity_' + tarckPage.cityIndex + '">');
            _str.push(' <i class="icon i30"></i>');
            $('#cityItem').append(_d.append(_str.join("")));
            tarckPage.drawCity('#city_' + tarckPage.cityIndex, '#hidCity_' + tarckPage.cityIndex);
            _d.find('[type="text"]').focus();
            //
            tarckPage.cityIndex++;
            tarckPage.addCityExist();
        },
        removeEv: function (event) {
            $(this).parent().remove();
            tarckPage.addCityExist();
        },
        addCityExist: function () {
            $('#addCity').css('visibility', $('#cityItem').find('.txts').length < 10 ? 'visible' : 'hidden');
        }
    }

    function regNotice(_, n, t) {
        return _.regMod("notice", "1.0", {
            name: n,
            tips: t,
            selClass: "inputSel"
        });
    }
    //
    function IsEmpty(value) {
        if ((typeof value == 'string' && value.length == 0) || value == null)
            return true;
        else
            return false;
    }
    //☆=================== Fun E ===================☆
    if (_cfgInfo.HasPositionTracking == "T") {
        cityMap.init();
        tarckPage.init();
    } else {
        var _t = $('#container');
        _t.empty().height(700);
        CM.ChargeFix(_t, "payment18.jpg", lanType);
    }
    Droco_Funs.getHeader(4);
    Droco_Funs.getFooter();
    //
    navInit();

})(jQuery, cQuery);