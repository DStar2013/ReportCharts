var dpHeader = (function () {
    var H = {
        init: function () {
            var masterAcc = $('#masterAccountID'),
            departIn = $('#departmentID'),
            consumerAtt = $('#consumerInfoID');
            var masterAccountInfo = _headInitInfo.masterAccountInfo,
            departmentInfo = _headInitInfo.departmentInfo,
            consumerAttrInfo = _headInitInfo.consumerAttrInfo,
            _selAccInfo = masterAccountInfo[_headSelectInfo.AccountIndex],
            _selDepInfo = departmentInfo[_headSelectInfo.DepartIndex],
            _selConInfo = consumerAttrInfo[_headSelectInfo.ConsumIndex];

            pulldownDraw.draw(masterAccountInfo, masterAcc);
            //给主账户添加main_id
            $('#masterAccountID div').addClass("main_id");
            pulldownDraw.draw(departmentInfo, departIn);
            pulldownDraw.draw(consumerAttrInfo, consumerAtt);
            //赋默认值
            masterAcc.find('span').html(_selAccInfo.Name + '<i class="icon i5"></i>');
            masterAcc.find('span').data('detinfo', _selAccInfo.Value);
            masterAcc.find('span').data('index', _headSelectInfo.AccountIndex);

            departIn.find('span').html(_selDepInfo.Name + '<i class="icon i5"></i>');
            departIn.find('span').data('detinfo', _selDepInfo.Value);
            departIn.find('span').data('index', _headSelectInfo.DepartIndex);

            consumerAtt.find('span').html(_selConInfo.Name + '<i class="icon i5"></i>');
            consumerAtt.find('span').data('detinfo', _selConInfo.Value);
            consumerAtt.find('span').data('index', _headSelectInfo.ConsumIndex);

            //event
            masterAcc.find('span').unbind('click');
            masterAcc.find('span').bind('click', showHeadDrop);
            departIn.find('span').unbind('click');
            departIn.find('span').bind('click', showHeadDrop);
            consumerAtt.find('span').unbind('click');
            consumerAtt.find('span').bind('click', showHeadDrop);

            //时间空间初始化
            startD.init();
            //查询事件绑定
            $('#searchBtnID').bind('click', function () {
                //触发dataChange
                H.dataChange(H.getHeadData());
            });
        },
        getHeadIndex: function () {
            var data = {},
            masterAcc = $('#masterAccountID'),
            departIn = $('#departmentID'),
            consumerAtt = $('#consumerInfoID');
            data.AccountIndex = masterAcc.find('span').data('index');
            data.DepartIndex = departIn.find('span').data('index');
            data.ConsumIndex = consumerAtt.find('span').data('index');
            //起始时间和终止时间
            var _timeD = startD.getDateDt();
            data.StartTime = _timeD.startYear + '/' + _timeD.startMonth + '/1';
            data.EndTime = _timeD.endYear + '/' + _timeD.endMonth + '/1';
            return data;
        },
        getHeadData: function () {
            var data = {},
            masterAcc = $('#masterAccountID'),
            departIn = $('#departmentID'),
            consumerAtt = $('#consumerInfoID');

            data.AcountName = masterAcc.find('span').text();
            data.AcountID = masterAcc.find('span').data('detinfo');
            data.DepartName = departIn.find('span').text();
            data.Depart = departIn.find('span').data('detinfo');
            data.ConsumeTypeName = consumerAtt.find('span').text();
            data.ConsumeType = consumerAtt.find('span').data('detinfo');
            //起始时间和终止时间
            var _timeD = startD.getDateDt();
            data.StartTime = _timeD.startYear + '/' + _timeD.startMonth;
            data.EndTime = _timeD.endYear + '/' + _timeD.endMonth;

            return data;
        },
        dataChange: function (_o) {
            //数据更改，获取，提供的对外函数
        },
        dataInit: function (_o) {
            //初始数据，获取，提供的对外函数
        }
    };
    //绘制下拉浮层
    var pulldownDraw = {
        draw: function (dList, container) {
            var self = pulldownDraw;

            if (dList.length > 0) {
                //将绑定事件全部清除
                container.find('.option_box li').unbind('click', self.onDataClick);
                container.find('.option_box').remove();
                //绘制
                self.drawDropDownL(dList, container);
                container.find('.option_box li').bind('click', self.onDataClick);
            }
        },
        drawDropDownL: function (dList, container) {
            var _d = $('<div class="option_box main_id hidepop" style="display:none"></div>'),
            _ul = $('<ul></ul>'),
            _li = '';
            //判断是否需要滚动条
            if (dList.length > 7) {
                _d.addClass("y_scroll");
            } else {
                _d.removeClass("y_scroll");
            }
            //填充内容
            for (var i = 0; i < dList.length; i++) {
                _li = _li + '<li><a href="javascript:;" title="' + dList[i].Name + '" detInfo=' + dList[i].Value + ' index=' + i + '>' + dList[i].Name + '</a></li>';
            }
            container.append(_d.append(_ul.append(_li)));
        },
        onDataClick: function (e) {
            var tar = $(this).parents('.filter_option').first().find('span');
            tar.html($(this).text() + '<i class="icon i5"></i>');
            tar.data('detinfo', $(this).find('a').attr('detinfo'));
            tar.data('index', $(this).find('a').attr('index'));
            hideHeadDrop(tar);
            //触发dataChange的开放函数
            //修改为点击按钮触发
            //H.dataChange(H.getHeadData());
        }
    };
    //时间选择
    var startD = {
        maxData: null,
        minData: null,
        startInnerYear: null,
        init: function () {
            var startDateID = $('#startDateID'),
            endDateID = $('#endDateID');

            var _nDate = new Date(_headInitInfo.nowTime),
            _nYear = _nDate.getFullYear(),
            _nMonth = _nDate.getMonth(),
            _nDay = _nDate.getDate();

            //5号之后，才可查询上个月的数据
            if (_nDay > 5) {
                if (_nMonth == 0) {
                    _nYear = _nYear - 1;
                    _nMonth = 12;
                }
            } else {
                if (_nMonth == 0 || _nMonth == 1) {
                    _nYear = _nYear - 1;
                    _nMonth = 11 + _nMonth;
                } else {
                    _nYear = _nYear;
                    _nMonth = _nMonth - 1;
                }
            }

            //存储最小、最大时间
            startD.minData = {
                Year: _nYear - 2,
                Month: 1
            };
            startD.maxData = {
                Year: _nYear,
                Month: _nMonth
            };

            //取到初始数据赋值
            var _selStD = new Date(_headSelectInfo.StartTime),
            _selEnD = new Date(_headSelectInfo.EndTime),
            _selStYear = _selStD.getFullYear(),
            _selStMonth = _selStD.getMonth() + 1,
            _selEnYear = _selEnD.getFullYear(),
            _selEnMonth = _selEnD.getMonth() + 1;

            //初始化
            startDateID.html(_selStYear + '-' + _selStMonth + '<i class="icon i5 for_time1"></i>');
            startDateID.data('Year', _selStYear);
            startDateID.data('Month', _selStMonth);

            endDateID.html(_selEnYear + '-' + _selEnMonth + '<i class="icon i5"></i>');
            endDateID.data('Year', _selEnYear);
            endDateID.data('Month', _selEnMonth);

            //绑定show事件
            startDateID.unbind('click');
            startDateID.bind('click', startD.showStartDate);
            endDateID.unbind('click');
            endDateID.bind('click', startD.showEndDate);
        },
        drawStart: function () {
            startD.clearStart();
            startD.drawStartYear($('#startDateID').data('Year'));
            startD.drawStartMonth();
        },
        drawStartYear: function (year) {
            var _str = $('<li class="for_year"></li>'),
            _f, _e;
            //前一年
            _f = $('<a href="javascript:;" class="year_prev"><i class="icon i10"></i></a>');
            _f.bind('click', { yIndex: -1 }, startD.stYearCh);
            //后一年
            _e = $('<a href="javascript:;" class="year_next"><i class="icon i11"></i></a>');
            _e.bind('click', { yIndex: 1 }, startD.stYearCh);
            if (year == startD.maxData.Year) {
                _str.append(_f).append(year);
            } else if (year == startD.minData.Year) {
                _str.append(year).append(_e);
            } else {
                _str.append(_f).append(year).append(_e);
            }
            $('#stDateUlID').append(_str);
            startD.startInnerYear = year;
        },
        stYearCh: function (event) {
            event.preventDefault();
            event.stopPropagation();

            //年份改变重绘
            startD.clearStart();
            startD.drawStartYear(startD.startInnerYear + event.data.yIndex);
            startD.drawStartMonth();
        },
        drawStartMonth: function () {
            if (startD.startInnerYear == $('#endDateID').data('Year')) {
                //如果起始时间不跨年
                for (var i = 0; i < 12; i++) {
                    var _str;
                    if ((i + 1) <= $('#endDateID').data('Month')) {
                        _str = $('<li><a href="javascript:;">' + (i + 1) + '月</a></li>');
                        _str.find('a').bind('click', startD.onStMonthClick);
                    } else {
                        _str = $('<li class="disabled">' + (i + 1) + '月</li>');
                    }
                    _str.find('a').data('Year', startD.startInnerYear);
                    _str.find('a').data('Month', i + 1);
                    $('#stDateUlID').append(_str);
                }
            } else {
                //如果起始时间选择跨年
                for (var i = 0; i < 12; i++) {
                    var _str;
                    if (startD.startInnerYear == startD.maxData.Year) {
                        if ((i + 1) <= startD.maxData.Month) {
                            _str = $('<li><a href="javascript:;">' + (i + 1) + '月</a></li>');
                            _str.find('a').bind('click', startD.onStMonthClick);
                        } else {
                            _str = $('<li class="disabled">' + (i + 1) + '月</li>');
                        }
                    } else {
                        _str = $('<li><a href="javascript:;">' + (i + 1) + '月</a></li>');
                        _str.find('a').bind('click', startD.onStMonthClick);
                    }
                    _str.find('a').data('Year', startD.startInnerYear);
                    _str.find('a').data('Month', i + 1);
                    $('#stDateUlID').append(_str);
                }
            }
        },
        onStMonthClick: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var content = $(this),
            startDateID = $('#startDateID'),
            endDateID = $('#endDateID');
            //是否跨年
            startDateID.html(content.data('Year') + '-' + content.data('Month') + '<i class="icon i5 for_time1"></i>');
            startDateID.data('Year', content.data('Year'));
            startDateID.data('Month', content.data('Month'));
            if (content.data('Year') != $('#endDateID').data('Year')) {
                //跨年，则需要改变后面的数据，修改为跟起始一样
                endDateID.html(content.data('Year') + '-' + content.data('Month') + '<i class="icon i5"></i>');
                endDateID.data('Year', content.data('Year'));
                endDateID.data('Month', content.data('Month'));
            }
            //隐藏下拉框
            startDateID.removeClass('click_on');
            $('#startDateSelID').css('display', 'none');

            //触发dataChange的开放函数
            //修改为点击按钮触发
            //H.dataChange(H.getHeadData());
        },
        clearStart: function () {
            $('#stDateUlID').empty();
        },
        drawEnd: function () {
            startD.clearEnd();
            startD.drawEndYear($('#endDateID').data('Year'));
            startD.drawEndMonth();
        },
        drawEndYear: function (year) {
            var _str = $('<li class="for_year"></li>');
            _str.append(year);
            $('#endDateUlID').append(_str);
        },
        drawEndMonth: function () {
            for (var i = 0; i < 12; i++) {
                var _str;
                if ((i + 1) < $('#startDateID').data('Month')) {
                    _str = $('<li class="disabled">' + (i + 1) + '月</li>');
                } else {
                    if ($('#endDateID').data('Year') == startD.maxData.Year && (i + 1) > startD.maxData.Month) {
                        _str = $('<li class="disabled">' + (i + 1) + '月</li>');
                    } else {
                        _str = $('<li><a href="javascript:;">' + (i + 1) + '月</a></li>');
                        _str.find('a').bind('click', startD.onEndMonthClick);
                    }
                }
                _str.find('a').data('Year', $('#endDateID').data('Year'));
                _str.find('a').data('Month', i + 1);
                $('#endDateUlID').append(_str);
            }
        },
        onEndMonthClick: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var content = $(this),
            endDateID = $('#endDateID');

            endDateID.html(content.data('Year') + '-' + content.data('Month') + '<i class="icon i5"></i>');
            endDateID.data('Year', content.data('Year'));
            endDateID.data('Month', content.data('Month'));

            //隐藏下拉框
            endDateID.removeClass('click_on');
            $('#endDateSelID').css('display', 'none');

            //触发dataChange的开放函数
            //修改为点击按钮触发
            //H.dataChange(H.getHeadData());
        },
        clearEnd: function () {
            $('#endDateUlID').empty();
        },
        showStartDate: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var endDateID = $('#endDateID'),
            endDateSelID = $('#endDateSelID'),
            startDateID = $('#startDateID'),
            startDateSelID = $('#startDateSelID');

            //如果end展示，隐藏
            if (endDateID.hasClass('click_on')) {
                endDateID.removeClass('click_on');
                endDateSelID.css('display', 'none');
            }

            //绘制初始时间
            startD.drawStart();
            if (startDateID.hasClass('click_on')) {
                startDateID.removeClass('click_on');
                startDateSelID.css('display', 'none');
            } else {
                startDateID.addClass('click_on');
                startDateSelID.css('display', '');
            }
        },
        showEndDate: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var endDateID = $('#endDateID'),
            endDateSelID = $('#endDateSelID'),
            startDateID = $('#startDateID'),
            startDateSelID = $('#startDateSelID');

            //start如果展示，隐藏
            if (startDateID.hasClass('click_on')) {
                startDateID.removeClass('click_on');
                startDateSelID.css('display', 'none');
            }

            //绘制结束时间
            startD.drawEnd();

            if (endDateID.hasClass('click_on')) {
                endDateID.removeClass('click_on');
                endDateSelID.css('display', 'none');
            } else {
                endDateID.addClass('click_on');
                endDateSelID.css('display', '');
            }
        },
        getDateDt: function () {
            var _d = {},
            startDateID = $('#startDateID'),
            endDateID = $('#endDateID');
            _d.startYear = startDateID.data('Year');
            _d.startMonth = startDateID.data('Month');
            _d.endYear = endDateID.data('Year');
            _d.endMonth = endDateID.data('Month');
            return _d;
        }
    };
    //
    function showHeadDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        if ($(this).hasClass('click_on')) {
            $(this).next().css('display', 'none');
            $(this).removeClass('click_on');
        } else {
            $(this).next().css('display', '');
            $(this).addClass('click_on');
        }
    };
    //
    function hideHeadDrop(c) {
        c.next().css('display', 'none');
        c.removeClass('click_on');
    }
    //..
    $(document).bind('click', function () {
        $('.hidepop').css('display', 'none');
        $('.click_on').removeClass('click_on');
    })

    return {
        init: H.init,
        getHeadIndex: H.getHeadIndex,
        getHeadData: H.getHeadData,
        setDataChange: function (o) {
            H.dataChange = o;
        }
    }
})();