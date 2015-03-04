//code by D.Star
var UIControl = (function ($, msg, tmpl) {
    //Base
    var $el = function (id) { return $(id, document); };
    //control version
    var versions = { calendar: '6.0', validate: '1.1', address: '1.0' };
    //================================= Warning Control S =================================
    var WarnControl = (function () {
        var w = $(document).regMod('validate', versions.validate);

        function show(target, msg, options) {
            if (!options) options = { removeErrorClass: true, isScroll: false, hideEvent: 'blur' };
            options.$obj = target;
            options.data = msg;
            w.method('show', options);
        }

        return {
            show: show,
            hide: function () { w.method('hide'); }
        }
    })();
    //================================= Warning Control E =================================

    //================================= Date Control S =================================
    var DateControl = (function () {
        function checkDate(start, end, lanType) {
            if (start && start.length > 0) {
                if (!start.value()) {
                    WarnControl.show(start, msg[lanType].dateMsg.dateEmpty);
                    return false;
                }
                if (!start.getDate()) {
                    WarnControl.show(start, msg[lanType].dateMsg.dateErr);
                    return false;
                }
            }
            if (end && end.length > 0) {
                if (end && !end.value()) {
                    WarnControl.show(end, msg[lanType].dateMsg.dateEmpty);
                    return false;
                }

                if (!end.getDate()) {
                    WarnControl.show(end, msg[lanType].dateMsg.dateErr);
                    return false;
                }
            }

            return true;
        }

        function setDataObj(id) {
            var o = $el(id);

            o.getDate = function () {
                var v = o.value();
                if (!v) return;
                return v.toDate();
            }
            o.setval = function () {
                if (arguments.length > 0) {
                    var d = arguments[0], v = '';
                    d && (v = d.substring ? d : d.toFormatString('yyyy-MM-dd'));
                    this[0].value = v;
                    return v;
                }
            }

            return o;
        }
        function createCalendar(obj, options) {
            var tmp = {
                options: options,
                listeners: {
                    onShow: function () {
                        this._layout && this._layout.css('position', 'absolute');
                    }
                }
            };
            return obj.regMod("calendar", versions.calendar, tmp);
        }
        function getCalendar(obj) {
            return obj.getMod("calendar", versions.calendar);
        }
        //
        var create = function (o) {
            var start = setDataObj(o.start), end = setDataObj(o.end),
				_maxDate = o.nowdate ? o.nowdate.toDate() : new Date(),
				_minDate = _maxDate.addDays(o.fontdays);
            //
            var startDate = createCalendar(start, {
                minDate: _minDate,
                maxDate: _maxDate,
                container: cQuery.container
            });
            //单双控件
            if (o && o.end) {
                var endDate = createCalendar(end, {
                    reference: o.start,
                    step: 2,
                    minDate: (start.getDate() || _minDate).addDays(1).toStdDateString(),
                    maxDate: _maxDate
                });
                //
                start.bind('change', function () {
                    var sDate = start.getDate(), eDate = end.getDate();
                    if (sDate) {
                        var nextDate = sDate.addDays(1);
                        end.data('minDate', nextDate.toStdDateString());
                        //...
                        if (!eDate || eDate <= sDate) {
                            end.setval(nextDate);
                            getCalendar(end).method("setWeek");
                        }
                        //
                        end[0].focus();
                    } else {
                        end.data('minDate', new Date().addDays(1).toStdDateString());
                    }
                });
            }

            return {
                validate: function () {
                    return checkDate(start, end, o.lanType || 'zh-cn');
                }
            }
        }

        return {
            init: create
        }
    })();
    //================================= Date Control E =================================

    //================================= City Control S =================================
    var CityControl = (function () {
        //new
        var defaultSuggestionInit = function (obj) {
            /**
            *  代码拷自addresss组件，实现tab切换，
            *  因为address组件只要用户配置了suggestionInit,  就不触发组件自己的suggestionInit，失去了tab切换功能
            */
            //must be opti
            var spans = obj.find('.tab_box li');
            var uls = obj.find('div.city_item');
            if (!spans.length) {
                return;
            }

            var switchTab = function () {
                var _this = this;
                spans.each(function (span, i) {
                    if (span[0] == _this) {
                        span.addClass('selected');
                        uls[i].style.display = '';
                    } else {
                        span.removeClass('selected');
                        uls[i].style.display = 'none';
                    }
                });
            };
            spans.bind('mousedown', switchTab);
            switchTab.apply(spans[0]);
        };
        //
        var create = function (o) {
            var cityTarget = $el(o.txtCity), citySource = o.source, cityFilter = o.filter, hidCityTarget = $el(o.hidCity), lanType = o.lanType || 'zh-cn';

            var cityMod = cityTarget.regMod('address', versions.address, {
                name: o.txtCity,
                charset: 'gb2312',
                delay: 200,
                jsonpSource: citySource,
                jsonpFilter: cityFilter,
                sort: ['^0$', '^1$', '0+'],
                jsonpFilterInit: function (o) {
                    if (!o) return;
                    var list = o.data.split('@');
                    o.data = { list: list, split: function () { return list } };
                    return o;
                },
                message: {
                    suggestionTitle: msg[lanType].cityMsg.titleMsg,
                    filterResult: msg[lanType].cityMsg.filterResult,
                    noFilterResult: msg[lanType].cityMsg.noFilterResult
                },
                template: {
                    suggestion: tmpl.CitySuggestion,
                    suggestionStyle: tmpl.CitySuggestionStyle,
                    filter: tmpl.CityFilter,
                    filterStyle: tmpl.CityFilterStyle,
                    filterPageSize: 7,
                    suggestionInit: function (a) {
                        defaultSuggestionInit(a);
                        a.find('.close').bind('mousedown', function () {
                            cityTarget[0].blur();
                        });
                    }
                }
            });
            //
            cityMod.method('bind', 'change', function (event, args) {
                cityTarget.value(args.value);
                hidCityTarget.value(args.items[2]);
                //
                event.stop();
            });
            cityMod.method('bind', 'userinput', function (event, args) {
                if (args.eventType === 'suggestionMousedown' || args.eventType === 'filterMousedown') {
                    return;
                }
                var url = cityFilter.replace('${key}', encodeURIComponent(escape(cityTarget.value())));
                function clearCity() { cityTarget.value(""); hidCityTarget.value(""); }
                $.loader.js(url, {
                    type: 'text/javascript',
                    charset: 'utf-8',
                    async: true,
                    cache: false,
                    onload: function () {
                        if (cQuery.isEmptyObject(cQuery.jsonpResponse)) {
                            clearCity();
                            return;
                        }
                        var resultData = cQuery.jsonpResponse;
                        var data = resultData.data;
                        var cityList = data.match(/[^@]+\|/g);
                        if (cityList && cityList.length > 0) {
                            var cityData = cityList[0].split('|');
                            cityTarget.value(cityData && cityData[1]); hidCityTarget.value(cityData && cityData[2]);
                            cQuery.jsonpResponse = {};
                        } else {
                            clearCity();
                        }
                    },
                    onerror: clearCity
                });
            });
            //
            return {

            }
        }

        return {
            init: create
        }
    })();
    //================================= City Control E =================================

    return {
        createDate: DateControl.init,
        createCity: CityControl.init,
        WarnControl: WarnControl
    }
})(cQuery, {
    'zh-cn': {
        dateMsg: {
            dateEmpty: "请选择时间",
            dateErr: "日期格式为yyyy-MM-dd"
        },
        cityMsg: {
            titleMsg: '支持中文/拼音/简拼输入',
            filterResult: '若需缩小范围，请输入更多条件。',
            noFilterResult: '找不到'
        }
    },
    'en': {
        dateMsg: {
            dateEmpty: "Please Enter Time",
            dateErr: "Date format: yyyy-MM-dd"
        },
        cityMsg: {
            titleMsg: 'Keep typing to refine search.',
            filterResult: 'Keep typing to refine search.',
            noFilterResult: 'Could not found'
        }
    }
}, {
    CitySuggestion: '',
    CitySuggestionStyle: '',
    //CitySuggestion: '<div class="city_select_lhsl"><a class="close" href="javascript:;">×</a><p class="title">${message.suggestionTitle}</p><ul class="tab_box">{{enum(key) data}}<li>${key}</li>{{/enum}}</ul>{{enum(key,arr) data}}<div class="city_item">{{each arr}}<a href="javascript:void(0);" data="${data}">${display}</a>{{/each}}</div>{{/enum}}</div>',
    //CitySuggestionStyle: '.city_select_lhsl{width:378px;padding:10px;border:1px solid #999;background-color:#fff;line-height:1.5;font-size:12px;font-family:Tahoma,Simsun,sans-serif}.city_select_lhsl a {float: left;display: inline;width:68px;height:24px;line-height:24px;color:#666;text-decoration:none;outline-width:medium;outline-style:none;outline-color:invert;padding-left:5px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}.city_select_lhsl a:hover{background-color:#2577E3;text-decoration:none;color:#fff;}.city_select_lhsl .close{float:right;width:20px;height:20px;color:#666;text-align:center;font:bold 16px/20px Simsun;}.city_select_lhsl .close:hover{text-decoration:none;color:#FFA800;}.city_select_lhsl .title{padding-bottom: 8px;color:#999;}.city_select_lhsl .tab_box{width:100%;height:24px;margin-bottom:3px;border-bottom:2px solid #ccc;}.city_select_lhsl .tab_box li{position:relative;float:left;display:inline;padding:0 10px;line-height:24px;color:#333;cursor:pointer;}.city_select_lhsl .tab_box .selected {border-bottom:2px solid #06c;margin-bottom:-2px;font-weight:bold;color:#06c;}.city_select_lhsl .tab_box b{display:none;position:absolute;top:24px;left:50%;width:0;height:0;margin-left:-5px;overflow:hidden;font-size:0;line-height:0;border-color:#06c transparent transparent transparent;border-style:solid dashed dashed dashed;border-width:5px;}.city_select_lhsl .city_item,.city_select_lhsl .airport_item,.city_select_lhsl .search_history_box {display:block;overflow:hidden;zoom: 1;padding-left: 5px;}.city_select_lhsl .search_title {margin-bottom: 2px;font-weight:bold;color:#06c;}.city_select_lhsl .search_history_box {margin-bottom:10px;}.city_select_lhsl .airport_item .search_title {margin: 10px 2px 0 -5px;}.city_select_lhsl .airport_item a {width: 118px;}',
    CityFilter: '{{if $data.hasResult}}<div class="keyword_prompting_lhsl keyword_prompting_lhsl_mini"><div class="sug_item item_list_city" style=""><p class="title"><span class="text_input">${$data.val}，</span>${message.filterResult}</p>{{each (i,item) list}}{{if cQuery.type(item)=="string"}}<label>${item}</label>{{else}}<a href="javascript:;" data="${data}"><span class="city">${right.replace(val, "<strong class=b>"+val+"</strong>")}${data.split("|")[3]==""?"":", "+data.split("|")[3]}${data.split("|")[4]==""?"":", "+data.split("|")[4]}</span><span class="num"></span></a>{{/if}}{{/each}}</div>{{if page.max>1}}<div class="c_page_mini" style="display: block;">{{if page.current>0}}<a href="javascript:void(0);" page="${page.current-1}">&lt;-</a>{{/if}}{{if page.current<2}}{{loop(index) Math.min(5,page.max+1)}}<a href="javascript:void(0);" {{if page.current==index}} class="c_page_mini_current" {{/if}} page="${index}">${index+1}</a>{{/loop}}{{else page.current>page.max-2}}{{loop(index) Math.max(0,page.max-4),page.max+1}}<a href="javascript:void(0);" {{if page.current==index}} class="c_page_mini_current" {{/if}} page="${index}">${index+1}</a>{{/loop}}{{else}}{{loop(index) Math.max(0,page.current-2),Math.min(page.current+3,page.max+1)}}<a href="javascript:void(0);" {{if page.current==index}} class="c_page_mini_current" {{/if}} page="${index}">${index+1}</a>{{/loop}}{{/if}}{{if page.current<page.max}}<a href="javascript:void(0);" page="${page.current+1}">-&gt;</a>{{/if}}</div>{{/if}}</div>{{else}}<div class="error_tips"><p>${message.noFilterResult}: ${$data.val}</p></div>{{/if}}',
    CityFilterStyle: '.keyword_prompting_lhsl {position:relative;width:500px;overflow:hidden;border:1px solid #999999;background-color:#FFFFFF;color:#666666;zoom:1;}.keyword_prompting_lhsl .title {position:relative;height:26px;overflow:hidden;margin:0 0 5px;padding-right:40px;white-space:nowrap;text-overflow:ellipsis;line-height:26px;color:#999999;border-bottom:1px dashed #CCCCCC;border-right:10px solid #FFFFFF;border-left:10px solid #FFFFFF;background-color:#FFFFFF;z-index:2;}.keyword_prompting_lhsl .title em {font-style:normal;}.keyword_prompting_lhsl .no_result {padding:5px 50px 5px 10px;color:#BB0000;}.notfound_pop {padding-bottom:4px;}.notfound_pop .title {line-height:26px;overflow:hidden;margin:0 10px 4px;padding:0 2px;color:#c01111;border-bottom:0 none;}.notfound_pop .close {margin-top:2px;}.keyword_prompting_lhsl .sug_item {overflow:hidden;padding-bottom:5px;padding-top:5px;border-bottom:1px solid #ccc;*zoom:1;}.keyword_prompting_lhsl .sug_item a {position: relative;display:block;overflow:hidden;height: 26px;line-height: 26px;padding:0 180px 0 10px;white-space:nowrap;text-overflow:ellipsis;color:#333333;}.keyword_prompting_lhsl .sug_item .sug_category {position:absolute;top:0;right:5px;}.keyword_prompting_lhsl .sug_item .num {position:absolute;top:0;right:100px;color: #999;}.keyword_prompting_lhsl .sug_item a:hover .num, .keyword_prompting_lhsl .sug_item .hover .num {color: #eee;}.keyword_prompting_lhsl .sug_item a strong, .keyword_prompting_lhsl .sug_item a b {color:#06c;font-weight: 700;}.keyword_prompting_lhsl .sug_item a:hover, .keyword_prompting_lhsl .sug_item .hover {text-decoration:none;color:#FFFFFF;background-color:#72A1E1;}.keyword_prompting_lhsl .sug_item a:hover strong, .keyword_prompting_lhsl .sug_item .hover strong,.keyword_prompting_lhsl .sug_item a:hover b, .keyword_prompting_lhsl .sug_item .hover b {color:#fff;}.keyword_prompting_lhsl .icon,.keyword_prompting_lhsl .close {display:inline-block;width:20px;height:20px;overflow:hidden;vertical-align:middle;margin-left:5px;line-height:999em;font-size:0;content:"";background:url(http://pic.c-ctrip.com/corp_niv/ico_search_tag.png) no-repeat 0 0;z-index:4;}.keyword_prompting_lhsl .close {position:absolute;top:5px;right:5px;}.keyword_prompting_lhsl .close:hover {background-position:0 -32px;}.keyword_prompting_lhsl .icon_htl {background-position:-190px 0;}.keyword_prompting_lhsl .icon_city {background-position:-128px 0;}.keyword_prompting_lhsl .icon_areas {background-position:-160px 0;}.keyword_prompting_lhsl .icon_landmarks {background-position:-64px 0;}.keyword_prompting_lhsl .icon_airports {background-position:-32px 0;}.keyword_prompting_lhsl .icon_stations {background-position:-96px 0;}.keyword_prompting_lhsl a:hover .icon_htl, .keyword_prompting_lhsl .hover .icon_htl {background-position:-190px -32px;}.keyword_prompting_lhsl a:hover .icon_city, .keyword_prompting_lhsl .hover .icon_city {background-position:-128px -32px;}.keyword_prompting_lhsl a:hover .icon_areas, .keyword_prompting_lhsl .hover .icon_areas {background-position:-160px -32px;}.keyword_prompting_lhsl a:hover .icon_landmarks, .keyword_prompting_lhsl .hover .icon_landmarks {background-position:-64px -32px;}.keyword_prompting_lhsl a:hover .icon_airports, .keyword_prompting_lhsl a.hover .icon_airports {background-position:-32px -32px;}.keyword_prompting_lhsl a:hover .icon_stations, .keyword_prompting_lhsl .hover .icon_stations {background-position:-96px -32px;}.keyword_prompting_lhsl_mini {width: 338px;padding-bottom: 10px;}.keyword_prompting_lhsl .sug_item {padding: 0;border-bottom: none;}.keyword_prompting_lhsl_mini .sug_item a {padding-right: 10px;}.keyword_prompting_lhsl .c_page_mini {padding-top: 10px;text-align: center;font-size: 14px;}.keyword_prompting_lhsl .c_page_mini a {margin: 0 3px;text-decoration: underline;color: #06c;}.keyword_prompting_lhsl .c_page_mini .c_page_mini_current {color: #666;text-decoration: none;cursor: default;}.error_tips {width:317px;height:25px;overflow:hidden;line-height:25px;padding:0 10px;color:#BB0000;background-color:#FFFFFF;border:1px solid #7F9DB9;}'
});

    