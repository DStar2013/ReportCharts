(function ($) {
    //☆=================== var S ===================☆
    var _hotelCityInfo, //页面数据 
        _htlCityInfo, //城市名-城市id-金额-间夜-平均房价-东经-北纬
        _cityDetailInfo; //城市酒店详细信息
    //☆=================== var E ===================☆

    //☆=================== Fun S ===================☆
    //..高德地图
    var hotelCityMap = {
        _selType: "All",
        init: function () {
            hotelCityMap.drawDropSel();
            //
        },
        drawDropSel: function () {
            var _htlCityTypeSelID = $('#htlCityTypeSelID');

            _htlCityTypeSelID.empty();
            //判断是否有协议，会员酒店
            //全部-0，协议-1，会员-2
            if (_cfgInfo.HasMemHotelProduct == "T" && _cfgInfo.HasAgrHotelProduct == "T") {
                _htlCityTypeSelID.append('<label><input type="radio" name="option" checked value="0">' + corpReport_HotelCity.js_All + '</label><label><input type="radio" name="option" value="1">' + corpReport_HotelCity.js_CorpHotels + '</label><label><input type="radio" name="option" value="2">' + corpReport_HotelCity.js_MemHotels + '</label>');
                hotelCityMap._selType = "All";
                //地图数据
                //hotelCityMap.mapSelect(_htlCityInfo.HtlAllInfo);
            } else if (_cfgInfo.HasMemHotelProduct == "F" && _cfgInfo.HasAgrHotelProduct == "T") {
                _htlCityTypeSelID.append('<label><input type="radio" name="option" checked value="1">' + corpReport_HotelCity.js_CorpHotels + '</label>');
                hotelCityMap._selType = "C";
                //
                //hotelCityMap.mapSelect(_htlCityInfo.HtlArgInfo);
            } else if (_cfgInfo.HasMemHotelProduct == "T" && _cfgInfo.HasAgrHotelProduct == "F") {
                _htlCityTypeSelID.append('<label><input type="radio" name="option" checked value="2">' + corpReport_HotelCity.js_MemHotels + '</label>');
                hotelCityMap._selType = "M";
                //
                //hotelCityMap.mapSelect(_htlCityInfo.HtlMbrInfo);
            } else {
                _htlCityTypeSelID.css('display', 'none');
            }

            //ajax获取数据，绘制地图
            hotelCityMap.ajaxMapDataInfo(hotelCityMap._selType);

            //事件绑定
            _htlCityTypeSelID.find('input').unbind('click');
            _htlCityTypeSelID.find('input').bind('click', hotelCityMap.onDataClick);
        },
        _timeout: null,
        ajaxMapDataInfo: function (type) {
            var _ptDt = dpHeader.getHeadData();
            _ptDt.HtlType = type;
            window.clearTimeout(hotelCityMap._timeout);
            //
            hotelCityMap._timeout = window.setTimeout(function () {
                $.ajax({
                    url: '../Hotel/GetHotelCityInfo',
                    type: "POST",
                    data: _ptDt,
                    success: function (data) {
                        _htlCityInfo = $.parseJSON(data);
                        //成功后，绘制图表
                        hotelCityMap.mapSelect(_htlCityInfo.HtlCityInfo);
                        //no data实现，控制隐藏展示
                        $('#iCenter').css('display', (_htlCityInfo.HtlCityInfo.length > 0) ? '' : 'none');
                        $('#mapNoData').css('display', (_htlCityInfo.HtlCityInfo.length > 0) ? 'none' : '');

                        //图表采用第一个数据
                        htlCityTable.clearAll();
                        if (_htlCityInfo.HtlCityInfo.length > 0) {
                            _ptDt.CityID = _htlCityInfo.HtlCityInfo[0].UID;
                            $.ajax({
                                url: '../Hotel/GetHotelDetail',
                                type: "POST",
                                data: _ptDt,
                                success: function (data) {
                                    _cityDetailInfo = $.parseJSON(data);
                                    //成功后，绘table
                                    htlCityTable.drawTable(_cityDetailInfo, _htlCityInfo.HtlCityInfo[0].Name);
                                },
                                error: function () {
                                    console.log('error!');
                                }
                            });
                        }
                    },
                    error: function () {
                        CM && CM.goError();
                    }
                });
            }, 100);

        },
        showDropDown: function (event) {
            event.preventDefault();
            event.stopPropagation();
            $('#htlCityTypeSelID').css('display', '');
            $('#htlCityTypeID').addClass('click_on');
        },
        onDataClick: function (event) {
            //修改地图
            if ($(this).val() == "0") {
                hotelCityMap._selType = "All";
                hotelCityMap.ajaxMapDataInfo(hotelCityMap._selType);
            } else if ($(this).val() == "1") {
                hotelCityMap._selType = "C";
                hotelCityMap.ajaxMapDataInfo(hotelCityMap._selType);
            } else {
                hotelCityMap._selType = "M";
                hotelCityMap.ajaxMapDataInfo(hotelCityMap._selType);
            }

            //改变选项后，下方table清空
            //htlCityTable.clearAll();
        },
        hideDropDown: function () {
            $('#htlCityTypeSelID').css('display', 'none');
            $('#htlCityTypeID').removeClass('click_on');
        },
        createControl: function (dt) {
            $('#selfCoverID').remove();

            var _div = $('<div id="selfCoverID" class="layer2"></div>');
            //设置控件属性
            var _str = '<dl><dt>' + corpReport_HotelCity.js_Top5CitiesLegend + '</dt>',
                    _dLen = (dt.length > 5) ? 5 : dt.length;
            //右下角填入
            for (var i = 0; i < _dLen; i++) {
                _str = _str + '<dd>' + dt[i].Name + '</dd>';
            }
            _str = _str + '</dl><i class="pic_example"></i>';
            _div.html(_str);

            _div.insertAfter($('#iCenter'));
        },
        mapSelect: function (dt) {
            if (typeof (mapObj) != "undefined") { mapObj.destroy(); }
            hotelCityMap.createControl(dt);
            hotelCityMap.mapDraw(dt);
        },
        mapDraw: function (_cityInfo) {
            var markers = {};
            mapObj = new AMap.Map("iCenter", {
                center: new AMap.LngLat(116.397428, 39.90923), //地图中心点 - 北京
                level: 4  //地图显示的缩放级别
                //zooms: [4,8]   //地图缩放范围
            });

            //地图中添加地图操作ToolBar插件
            mapObj.plugin(["AMap.ToolBar", "AMap.Scale"], function () {
                toolBar = new AMap.ToolBar();
                mapObj.addControl(toolBar);
                //
                scale = new AMap.Scale();
                mapObj.addControl(scale);

                /*
                //创建右键菜单  
                contextMenu = new AMap.ContextMenu();
                //右键放大  
                contextMenu.addItem("放大一级", function () {
                mapObj.zoomIn();
                }, 0);
                //右键缩小  
                contextMenu.addItem("缩小一级", function () {
                mapObj.zoomOut();
                }, 1);
                //地图绑定鼠标右击事件——弹出右键菜单
                AMap.event.addListener(mapObj, 'rightclick', function (e) {
                contextMenu.open(mapObj, e.lnglat);
                contextMenuPositon = e.lnglat;
                });
                */

                //..
                //创建新的control
                var homeControl = new AMap.homeControlDiv(mapObj); //新建自定义插件对象  
                mapObj.addControl(homeControl);                  //地图上添加插件

                //浮层
                mapMarker.addMarker(_cityInfo, mapObj, mapMarker.addEvListen);

            });
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
                    var controlUI = document.getElementById("selfCoverID");

                    // 设置控件的位置
                    controlUI.style.position = 'absolute';
                    //controlUI.style.left = '906px';     //设置控件离地图的左边界的偏移量                  
                    //controlUI.style.top = '213px';        //设置控件离地图上边界的偏移量
                    controlUI.style.right = '0px';
                    controlUI.style.bottom = '0px';
                    controlUI.style.zIndex = '100';     //设置控件在地图上显示     

                    // 设置控件响应点击onclick事件 
                    /*                 
                    controlUI.onclick = function () {
                    //map.setCenter(new AMap.LngLat(116.404, 39.915));
                    alert('CC');
                    }
                    */
                    return controlUI;
                }
            };
        }
    };

    //标记、浮层
    var mapMarker = {
        addMarker: function (dt, mapObj, onAdded) {
            mapObj.clearMap();
            for (var i = 0; i < dt.length; i++) {
                var point = new AMap.LngLat(parseFloat(dt[i].East), parseFloat(dt[i].North));
                if (!point) return;
                //
                var _mkCon = document.createElement("i"), _className = "icon i15",
                    _xPix = -8, _yPix = -11;

                if (i < 5) {
                    var _nM = 20 - i;
                    _className = "icon i" + _nM;
                    _xPix = -14,
                    _yPix = -25;
                }
                _mkCon.className = _className;
                var marker = new AMap.Marker({
                    map: mapObj,
                    position: point,
                    content: _mkCon,
                    offset: new AMap.Pixel(_xPix, _yPix) //偏移位置
                    //icon: "http://webapi.amap.com/images/0.png"
                    //offset: new AMap.Pixel(-10, -35)
                });
                //markers[i] = marker;
                //marker.setMap(mapObj);
                onAdded && onAdded(marker, dt[i]);
            }
        },
        addEvListen: function (mkr, dt) {
            var t = null;
            var handle = CM.browser.isIPad ? "click" : "mouseover";
            //mouseover
            AMap.event.addListener(mkr, handle, function (mrk) {
                var pt = mrk.pixel;
                clearTimeout(t);
                t = setTimeout(function () {
                    mapMarker.showTip($('#tipID'), dt, {
                        x: pt.x + 6,
                        y: pt.y + 48
                    });
                }, 500);
            });
            //ipad clear
            if (CM.browser.isIPad) {
                $('#tipID').click(function () {
                    clearTimeout(t); mapMarker.hideTip($('#tipID'));
                });
            }
            //mouseout
            AMap.event.addListener(mkr, 'mouseout', function (mrk) {
                clearTimeout(t);
                mapMarker.hideTip($('#tipID'));
            });
            //click
            AMap.event.addListener(mkr, 'click', function (mrk) {
                //发送ajax，获取数据，绘制table
                var _ptDt = dpHeader.getHeadData();
                _ptDt.CityID = dt.UID;
                _ptDt.HtlType = hotelCityMap._selType;

                //发送ajax请求，绘制表
                window.clearTimeout(hotelCityMap._timeout);
                hotelCityMap._timeout = window.setTimeout(function () {
                    $.ajax({
                        url: '../Hotel/GetHotelDetail',
                        type: "POST",
                        data: _ptDt,
                        success: function (data) {
                            _cityDetailInfo = $.parseJSON(data);
                            //成功后，绘table
                            htlCityTable.drawTable(_cityDetailInfo, dt.Name);
                        },
                        error: function () {
                            console.log('error!');
                        }
                    });
                }, 100);
            });
        },
        showTip: function (content, info, pos) {
            content.empty();
            var _str = ['<dl>'];
            _str.push('<dt>' + info.Name + '</dt>');
            _str.push('<dd>' + corpReport_HotelCity.js_Amount + '：<span>' + CM.fixData.transData(info.Price, 0) + '</span></dd>');
            _str.push('<dd>' + corpReport_HotelCity.js_RoomNights + '：<span>' + CM.fixData.transData(info.NightPrice, 0) + '</span></dd>');
            _str.push('<dd>' + corpReport_HotelCity.js_AvgDailyRate + '：<span>' + CM.fixData.transData(info.AvgPrice, 0) + '</span></dd></dl>');
            content.html(_str.join(""));

            content.css({
                display: '',
                left: pos.x + "px",
                top: pos.y + "px"
            });
        },
        hideTip: function (content) {
            content.css('display', 'none');
        }
    };

    //绘制城市table表
    var htlCityTable = {
        drawTable: function (dt, cityName) {
            htlCityTable.clearAll();
            htlCityTable.drawHead();
            htlCityTable.drawBody(dt.HotelDetailInfo, cityName);
            htlCityTable.drawFoot(dt.TolHotelDetailInfo);
        },
        drawHead: function () {
            var _head = $('<table><thead id="headTableID"></thead></table>');
            $('#cityDetailInfoID').append(_head);
            //
            var _str = ['<tr>'];
            _str.push('<th width="20%">' + corpReport_HotelCity.js_City + '</th>');
            _str.push('<th width="25%">' + corpReport_HotelCity.js_Hotel + '</th>');
            _str.push('<th width="10%">' + corpReport_HotelCity.js_StarRating + '</th>');
            _str.push('<th width="10%" align="right">' + corpReport_HotelCity.js_Amount + '</th>');
            _str.push('<th width="10%">' + corpReport_HotelCity.js_RoomNights + '</th>');
            _str.push('<th width="10%" align="right">' + corpReport_HotelCity.js_AvgDailyRate + '</th>');
            _str.push('<th width="15%" align="center">' + corpReport_HotelCity.js_PerofRoomNight + '</th></tr>');
            $('#headTableID').append(_str.join(""));
        },
        drawBody: function (dt, cityName) {
            var _body = $('<div class="tbody"><table><tbody id="bodyTableID"></tbody></table></div>');
            $('#cityDetailInfoID').append(_body);
            var _bodyTableID = $('#bodyTableID');
            //no data
            if (dt.length > 0) {
                for (var i = 0; i < dt.length; i++) {
                    var _str = ['<tr>'];
                    if (i == 0) {
                        _str.push('<td rowspan="5" align="center" width="20%">' + cityName + '</td>');
                        _str.push('<td width="25%">' + dt[i].HotelName + '</td>');
                        _str.push('<td align="center" width="10%">' + dt[i].Stars + '</td>');
                        _str.push('<td align="right" width="10%">' + CM.fixData.transData(dt[i].Price, 0) + '</td>');
                        _str.push('<td align="center" width="10%">' + CM.fixData.transData(dt[i].Night, 0) + '</td>');
                        _str.push('<td align="right" width="10%">' + CM.fixData.transData(dt[i].AvgPrice, 0) + '</td>');
                        _str.push('<td align="center" width="15%">' + dt[i].NightPer + '</td>');
                    } else {
                        _str.push('<td>' + dt[i].HotelName + '</td>');
                        _str.push('<td align="center">' + dt[i].Stars + '</td>');
                        _str.push('<td align="right">' + CM.fixData.transData(dt[i].Price, 0) + '</td>');
                        _str.push('<td align="center">' + CM.fixData.transData(dt[i].Night, 0) + '</td>');
                        _str.push('<td align="right">' + CM.fixData.transData(dt[i].AvgPrice, 0) + '</td>');
                        _str.push('<td align="center">' + dt[i].NightPer + '</td>');
                    }
                    _str.push('</tr>');
                    _bodyTableID.append(_str.join(""));
                }
            } else {
                CM.LineHeightFix(_body);
            }
        },
        drawFoot: function (dt) {
            var _foot = $('<table><tfoot id="footTableID"></tfoot></table>');
            $('#cityDetailInfoID').append(_foot);
            //..
            var _str = ['<tr>'];
            _str.push('<td width="20%"></td>');
            _str.push('<td align="center" width="25%">' + corpReport_HotelCity.js_Total + '</td>');
            _str.push('<td align="center" width="10%"></td>');
            _str.push('<td align="right" width="10%">' + CM.fixData.transData(dt.TolPrice, 0) + '</td>');
            _str.push('<td align="center" width="10%">' + CM.fixData.transData(dt.TolNight, 0) + '</td>');
            _str.push('<td align="right" width="10%">' + CM.fixData.transData(dt.TolAvgPrice, 0) + '</td>');
            _str.push('<td align="center" width="15%">' + dt.TolNightPer + '</td></tr>');
            $('#footTableID').append(_str.join(""));
        },
        clearAll: function () {
            $('#cityDetailInfoID').empty();
        }
    };

    //☆=================== Fun E ===================☆
    //
    dpHeaderSuccess = function () {
        //初始数据
        CM.hrefChange($('#menu').find('a'), _headSelectInfo);
        CM.hrefChange($('#htlSubNavID').find('a'), _headSelectInfo);
        hotelCityMap.init();

        dpHeader.setDataChange(function (_o) {
            window.location.hash = '#' + CM.getParam(dpHeader.getHeadIndex());
            window.location.reload();
        });
    }
    //
    Droco_Funs.getHeader(2);
    Droco_Funs.getHotelSubNav(3);
    Droco_Funs.getFooter();
    Droco_Funs.getFilterBar();
})(jQuery);