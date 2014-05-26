
$.ns('_JsL.Haiyou.Reservation.AssignRoomCtrl', '_JsL.Haiyou.Reservation.AssignRoom', '_JsL.Haiyou.Reservation.AssignRoomDetail', '_JsL.Haiyou.Reservation.AssignRoomAtrribute');

//#region AssignRoomCtrl
_JsL.Haiyou.Reservation.AssignRoomCtrl.Model = _JsL.Panel.Model.extend({
    defaults: _.extend({
        hideDetail:false,
        s_arrdate: $U.formateDate(new Date(), 'yyyy-MM-dd'),
        s_depdate: $U.formateDate(new Date(new Date().valueOf()+ 24 * 60 * 60 * 1000)),
        s_days: 1,
        building_src:'',
        building_result: [],
        floor_src:'',
        floor_result: [],
        feature_src:'',
        feature_result: [],
        s_status: '',
        choose_src: '',
        choose_result: [], //[{ "RoomType": type, "RoomNos": num }]; 同服务器设置名称相同
        choose_roomtype:'',
        detail_src: '',
        detail_result: [],//[{ "RoomType": type, "Rooms": [value] }];
        member_info: null//会员信息或者其他页面模块信息
    }, _JsL.Panel.Model.prototype.defaults),
    initialize: function () {
        _JsL.Panel.Model.prototype.initialize.call(this);
    }
});

_JsL.Haiyou.Reservation.AssignRoomCtrl.View = _JsL.Panel.View.extend({
    model: _JsL.Haiyou.Reservation.AssignRoomCtrl.Model,
    assignView: null,
    attrView: null,
    initialize: function () {
        _JsL.Panel.View.prototype.initialize.call(this);
        _.bindAll(this, 'updateDatePanel');
        //this.model.on('change:s_arrdate,s_depdate', this.updateDatePanel, this);
    },
    events: _.extend({
        'click :button.queryrooms': 'onSearch',
        //'blur .datePanel': 'updateDatePanel',
        'blur .daysPanel': 'updateDaysPanel',
        'keypress input.stayDays': 'onKeypressDays'
    }, _JsL.Panel.View.prototype.events),
    checkValid: function () {
        return this.model.get("s_arrdate") >= $U.formateDate(new Date(), 'yyyy-MM-dd') &&
                this.model.get("s_days") > 0;
    },
    setupTemplate: function () {
        this.$el.html(this.getTemplate());
    },
    getTemplate: function () {
        return [
        '&nbsp;入住日期： <input type="text" id="arrDate" class="Wdate arrDate datePanel" value="', this.model.get("s_arrdate"), '"  readonly="false" />   &nbsp;&nbsp;天数：&nbsp;&nbsp;  <input type="text" value="', this.model.get("s_days"), '" class="stayDays daysPanel m" maxlength="2" /> ',
        '&nbsp;离店日期： <input type="text" id="depDate" class="Wdate depDate datePanel" value="', this.model.get("s_depdate"), '"  readonly="false" />',
        '&nbsp;&nbsp;<input type="button" class="blueBtn queryrooms" value="查询" /><span class="op-placeholder"></span>',
        '<table style="width:100%">',
            '<tr>',
                '<td style="vertical-align:top;"><div class="choose-container" style="width:447px;"></div></td>',
                '<td style="vertical-align:top;display:',(this.model.get("hideDetail")?'"none"':'"inline"'),'"><div class="detail-container" style="width:372px;"></div><div class="attribute-container" style="width:372px;"></div></td>',
            '</tr>',
        '</table>'].join(''); //todo, resources
    },
    onKeypressDays: function (event) {
        var keynum = (event.which) ? event.which : event.keyCode;
        if (keynum < 48 || keynum > 57)
            return false;
    },
    beforeRender: function () {
        this.afterRender.call(this);
    },
    afterRender: function (d) {
        var p = { 'onpicked': this.updateDatePanel , 'src':this};
        this.$el.find('.datePanel').data('picked', p).click(function () {
            var p = $(this).data("picked");
            WdatePicker({
                onpicked: function (o) {
                    p.onpicked.call(p.src);
                }
            })
        });
        this.onSearch();
    },
    bindAttributeModel: function (attributeModel) {
        this.model.set({
            "building_result": attributeModel.get("building_result"),
            "floor_result": attributeModel.get("floor_result"),
            "feature_result": attributeModel.get("feature_result"),
            "s_status": attributeModel.get("s_status")
        });
    },
    bindChooseModel: function (chooseModel) {
        this.model.set({ "choose_result": chooseModel });
    },
    bindDetailModel: function (detail_result) {
          if (this.model.get("detail_result").length > 0) {
            var inArr = false;
            $.each(this.model.get("detail_result"), function (i, n) {
                if (n.RoomType == detail_result.RoomType) {
                    inArr = true;
                    n.Rooms = detail_result.Rooms;
                    return false;
                }
            });
            if (!inArr) {
                this.model.get("detail_result").push({ RoomType: detail_result.RoomType, Rooms: detail_result.Rooms });
            }
        }
        else {
            this.model.get("detail_result").push({ RoomType: detail_result.RoomType, Rooms: detail_result.Rooms });
        }
    },
    bindOps: function () {
        var context = this;
        this.assignView.on('validateRoomNo', function (o, callback) {
            if (typeof callback !== 'function') return;
            var retflag = false,
                retvalue = 0,
                detailRooms = context.getRoomNos(o.RoomType);
            if (parseInt(o.RoomNos||0) < detailRooms.length) {
                retvalue = detailRooms.length;
            }
            else {
                retflag = true;
            }
            callback({ flag: retflag, val: retvalue });
        });
        this.assignView.on('onRowClicking', this.onQueryDetails, this);
    },
    onSearch: function () {
        this.updateModel();
        this.trigger('onSearch', this.onSearching, this);//从外部获取用户等context参数
    },
    onSearching: function (o) { //查询房间类型
        var context = this,
            p = $.extend({}, o, { ArrDate: this.model.get("s_arrdate"), DepDate: this.model.get("s_depdate") });
        this.model.set({ member_info: o });
        if (this.assignView) {
            this.assignView.unbind();
            $('.choose-container', this.$el).unbind();
        }
        this.assignView = new _JsL.Haiyou.Reservation.AssignRoom.View({
            el: $('.choose-container', this.$el),
            model: new _JsL.Haiyou.Reservation.AssignRoom.Model({
                config: { url: context.model.get("choose_src"), method: 'POST', parms: { jsonStr: JSON.stringify(p) } },
                choose_roomtype: context.model.get("choose_roomtype"),
                choose_result: context.model.get("choose_result")
            })
        });
        
        this.bindOps();
        this.assignView.on('modelChanged', this.bindChooseModel, this);
        this.assignView.on('updateDetailRoomNo', this.updateDetailRoomNo, this);
        this.assignView.render();

        if (this.attrView)
            this.attrView.unbind();
        this.attrView = new _JsL.Haiyou.Reservation.AssignRoomAtrribute.View({
            el: $('.attribute-container', this.$el),
            model: new _JsL.Haiyou.Reservation.AssignRoomAtrribute.Model({
                config: { url: '', method: 'GET', data: {} },
                building_src: context.model.get("building_src"),
                floor_src: context.model.get("floor_src"),
                feature_src: context.model.get("feature_src")
            })
        });
        this.attrView.render();
        this.attrView.on('modelChanged', this.bindAttributeModel, this);
        this.attrView.on('onDetailQuery', this.onQueryDetails, this);
    },
    onQueryDetails: function (rt) {//查询房间详细
        if (!this.assignView)
            return;
        var subview,
            context = this,
            rt = rt || this.assignView.getSelectRoomType(),
            o = context.getSearchDataModel();
        if (!rt || rt.length == 0) {
            alert('没有选中房间类型');
            return;
        }
        if ($('.detail-container', context.$el).length > 0) {
            $('.detail-container', context.$el).unbind();
        }
        if (!context.getSearchDataModel() || !this.model.get("member_info"))
            return;
        subview = new _JsL.Haiyou.Reservation.AssignRoomDetail.View({
            el: $('.detail-container', context.$el),
            model: new _JsL.Haiyou.Reservation.AssignRoomDetail.Model({
                config: { url: context.model.get("detail_src"), method: 'POST', parms: { jsonStr: JSON.stringify(o) } },
                detail_result: { RoomType: rt, Rooms: context.getRoomNos(rt), IsFirst: context.isFirst(rt) },
                frozenHead: true,
                frozenHeight: 180
            })
        });
        subview.on('modelChanged', context.bindDetailModel, context);
        subview.on('validateRoomNo', function (o, callback) {
            var retvalue = false,
                roomnum = isNaN(context.getRoomNum(o.RoomType)) ? 0 : context.getRoomNum(o.RoomType);
            if (typeof callback !== 'function') return;
            if (o.Rooms.length <= roomnum) {
                retvalue = true;
            }
            callback(retvalue);
        });
        subview.render();
    },
    updateDatePanel: function () { //only update view , not models
        var datePicker1 = this.$el.find('.arrDate').val();
        var datePicker2 = this.$el.find('.depDate').val();
        if (datePicker1.length > 0 && datePicker2.length > 0) {
            var days = ($U.convertDate(datePicker2) - $U.convertDate(datePicker1)) / 86400000;
            this.$el.find('.stayDays').val(days);
        }
        this.updateModel();
    },
    updateDaysPanel: function (e) {
        var obj = $(e.currentTarget);
        if (!isNaN(obj.val())) {
            var datePicker = this.$el.find('.arrDate').val();
            if (datePicker.length > 0) {
                var depdate = $U.formateDate(new Date($U.convertDate(datePicker).valueOf() + obj.val() * 24 * 60 * 60 * 1000));
                this.$el.find('.depDate').val(depdate);
            }
        }
        this.updateModel();
    },
    updateDetailRoomNo: function (roomdetail) {//在房间类型加载好了之后更新房间号数据, 因为右侧是可以不点的
       var context = this,
            arr = [],
            roomtype;
        $.each(roomdetail, function (i, n) {
            roomtype = n.RoomTypeID;
            if (n.IsAssigned) {
                arr.push(n.RoomNo);
            }
        });
        context.bindDetailModel({ RoomType: roomtype, Rooms: arr });
        //$.get(this.model.get("detail_src"), { jsonStr: JSON.stringify(o) }, function (d) {
        //    if (d.Success) {
        //        var data = typeof d.Data === 'string' ? JSON.parse(d.Data) : d.Data,
        //            arr = [];
        //        $.each(data, function (i, n) {
        //            if (n.IsAssigned) {
        //                arr.push(n.RoomNo);
        //            }
        //        });
        //        context.bindDetailModel({ RoomType: roomtype, Rooms: arr });
        //    }
        //}, 'json');
    },
    updateModel: function () {
        this.model.set({
            s_arrdate: this.$el.find('.arrDate').val(),
            s_depdate: this.$el.find('.depDate').val(),
            s_days: this.$el.find('.stayDays').val()
        });
    },
    getRoomNum: function (RoomType) {
        var roomnum = 0,
            result = this.model.get("choose_result");
        if (result !== undefined) {
            $.each(result, function (i, n) {
                if (n.RoomType == RoomType) {
                    roomnum = isNaN(n.RoomNos) ? 0 : parseInt(n.RoomNos);
                    return false;
                }
            });
        }
        return roomnum;
    },
    getRoomNos: function (RoomType) {
        var arr = [],
            result = this.model.get("detail_result");
        if (result !== undefined) {
            $.each(result, function (i, n) {
                if (n.RoomType == RoomType) {
                    arr = n.Rooms;
                    return false;
                }
            });
        }
        return arr;
    },
    isFirst: function (RoomType) {
        var isInit = true;
        var result = this.model.get("detail_result");
        if (result !== undefined) {
            $.each(result, function (i, n) {
                if (n.RoomType == RoomType) {
                    isInit = false;
                    return isInit;
                }
            })
        }
        return isInit;
    },
    getSearchDataModel: function () {
        if (!this.attrView || !this.model.get("member_info") || !this.assignView)
            return {};
        var m = this.attrView.model,
            filter;
        filter = {
            Buildings: m.get("building_result").join(','),
            Floors: m.get("floor_result").join(','),
            Hobbies: m.get("feature_result").join(','),
            RoomStatus: m.get("s_status")
        };

        var p = $.extend({}, { Filters: filter },
                { RoomType: this.assignView.getSelectRoomType(), RoomStatus: m.get("s_status") },
                { ArrDate: this.model.get("s_arrdate"), DepDate: this.model.get("s_depdate") })
        return p;
    },
    getSheetModel: function () {
        if (this.assignView) {
            this.assignView.updateModel();
        }
        return {
            RoomTypes: this.model.get("choose_result"),
            Rooms: this.model.get("detail_result"),
            ArrDate: this.model.get("s_arrdate"),
            DepDate: this.model.get("s_depdate")
        };
    }
});
//#endregion

//#region AssignRoom
_JsL.Haiyou.Reservation.AssignRoom.Model = _JsL.Grid.Model.extend({
    defaults: _.extend({
        choose_roomtype:'',
        choose_result: []//[{ "RoomType": type, "RoomNos": num }];
    }, _JsL.Grid.Model.prototype.defaults),
    initialize: function () {
        _JsL.Grid.Model.prototype.initialize.call(this);
    }
});

_JsL.Haiyou.Reservation.AssignRoom.View = _JsL.Grid.View.extend({
    model: _JsL.Haiyou.Reservation.AssignRoom.Model,
    initialize: function () {
        this.model.on('change:choose_result', function () { this.trigger('modelChanged', this.model.get("choose_result")); }, this);
        _JsL.Grid.View.prototype.initialize.call(this);
    },
    events: _.extend({
        'keypress tbody input': 'onKeyPress',
        'keyup tbody input': 'onKeyUp'
    }, _JsL.Grid.View.prototype.events),
    getTemplate: function () {
        return [
        '<div class="block">',
         '<table class="tbBase">',
            '<thead>',
                '<tr>',
                    '<th>', $Lang.Reservation.AssignRoom.RoomNum, '</th>',
                    '<th>', $Lang.Reservation.AssignRoom.RoomType, '</th>',
                    '<th>', $Lang.Reservation.AssignRoom.ReservedNum, '</th>',
                    '<th>', $Lang.Reservation.AssignRoom.CanResNum, '</th>',
                    '<th>', $Lang.Reservation.AssignRoom.CanCheckNum, '</th>',
                    '<th>', $Lang.Reservation.AssignRoom.AvgPrice, '</th>',
                    '<th>', $Lang.Reservation.AssignRoom.MarketPrice, '</th>',
                '</tr>',
            '</thead>',
            '<tbody>',
            '{#foreach $T as row}',
                '<tr rtype="{$T.row.RoomTypeCode}">',
                    '<td><input type="text" class="input" rtype="{$T.row.RoomTypeCode}" rtypename="{$T.row.RoomTypeName}" rprice="{$T.row.AveragePrice}" style="width:30px" value="{$P.formatRoomNum($T.row.RoomCountReserved)}" maxlength="2" /></td>',
                    '<td>{$T.row.RoomTypeName}</td>',
                    '<td>{$T.row.RoomCountReserved}</td>',
                    '<td>{$T.row.UseableRoomCount}</td>',
                    '<td>{$T.row.CheckInRoomCount}</td>',
                    '<td>￥{$T.row.AveragePrice}&nbsp;<span class="link" style="{$T.row.IsDisplayDayPrices ? \'\': \'display:none\'}" data="{$T.row.ToolTip}">每日</span></td>',
                    '<td>￥{$T.row.MarketPriceText}</td>',
                '</tr>',
            '{#/for}',
            '</tbody>',
         '</table>',
        '</div>'].join('');
    },
    getSelectRoomType: function () {
        var select_tr = this.$el.find('tbody tr[class*="select"]');
        if (select_tr.length > 0) {
            this.model.set({ choose_roomtype: select_tr.attr('rtype') });
            return select_tr.attr('rtype');
        }
    },
    onKeyPress: function (event) {
        var keynum = (event.which) ? event.which : event.keyCode;
        if (keynum < 48 || keynum > 57) {
            event.returnValue = false;
            return false;
        } 
    },
    onKeyUp: function (event) {
        var keynum = (event.which) ? event.which : event.keyCode,
            obj = event.currentTarget,
            ref = true;
        //if (keynum != 8 && keynum != 46 && (keynum < 48 || keynum > 57))
        //    return;
        this.trigger('validateRoomNo', { RoomType: $(obj).attr('rtype'), RoomNos: $(obj).val() }, function (returnvalue) {
            ref = returnvalue;
        });
        if (!ref.flag) { //invalid number
            alert('房量数小于分房数');
            $(obj).val(ref.val);
        }
        this.updateModel();
    },
    updateModel: function () {
        var col = this.$el.find('tbody input'),
            arr = [],
            context = this;
        if (col.length > 0) {
            $.each(col, function (i, n) {
                var rtype = $(n).attr('rtype'),
                    rtypename = $(n).attr('rtypename'),
                    rprice = $(n).attr('rprice'),
                    num = parseInt($(n).val());
                arr.push({ "RoomType": rtype, "RoomTypeName": rtypename, "Price": rprice, "RoomNos": isNaN(num) ? 0 : num });
            });
            this.model.set({ "choose_result": arr });
        }
    },
    onRowClick: function (e) {
        $(e.currentTarget).find('input').focus();
        if (!$(e.currentTarget).hasClass('select')) {
            this.superclass.onRowClick.call(this, e);
            this.trigger('onRowClicking', $(e.currentTarget).attr('rtype'));
        }
    },
    formatData: function (d) {
        if (typeof d.Data === 'string')
            return JSON.parse(d.Data);
        return d.Data;
    },
    afterRender: function (d) { //by default , select the first one
        var context = this;
        this.$el.find("span.link[data^='[']").priceToolTip();
        this.loadModel(d);
        this.selectByDefault();
    },
    selectByDefault: function () {//选中某行
        var context = this,
            selectitem = this.$el.find('tbody tr').eq(0);
        if (!this.model.get("choose_roomtype")) {
            $.each(this.$el.find('tbody tr'), function (i, n) {
                if ($(n).find('input').val().length > 0) {
                    selectitem = $(n);
                    return false;
                }
            });
        }
        else
            selectitem = this.$el.find('tbody tr[rtype="{0}"]'.format(this.model.get("choose_roomtype")));

        if (selectitem.length > 0)
            selectitem.trigger('click');
        else
            this.$el.find('tbody tr').eq(0).trigger('click');
    },
    loadModel: function (d) { //根据模型更新视图
        var context = this;
        if (this.model.get("choose_result").length > 0) { //根据传入的数据生成页面
            $.each(this.$el.find('tbody tr'), function (i, n) {
                var rt = _.where(context.model.get("choose_result"), { RoomType: $(n).attr('rtype') });
                if (rt.length > 0 && rt[0].RoomNos > 0) {
                    $(n).find('input').val(rt[0].RoomNos);
                }
            });
        }
        else {
            if (d && d.length > 0) {
                var arr = [];
                $.each(d, function (i, n) {
                    arr.push({ RoomType: n.RoomTypeCode, RoomNos: n.RoomCountReserved });
                    context.trigger('updateDetailRoomNo', n.RoomDetails);
                    //2014.4.11去掉, 把获取放到服务器端进行
                    //if (n.RoomCountReserved > 0) //预先加载详细房间信息
                    //    context.trigger('updateDetailRoomNo', n.RoomTypeCode);
                });
                this.model.set({ choose_result: arr });
            }
        }
    },
    setTempParameter: function () {
        this.$el.setParam('formatRoomNum', this.formatEmptyRoomNum);
    },
    formatEmptyRoomNum: function (d) {
        if (!d || d == 0)
            return '';
        return d;
    }
});
//#endregion

//#region AssignRoomDetail
_JsL.Haiyou.Reservation.AssignRoomDetail.Model = _JsL.Grid.Model.extend({
    defaults: _.extend({
        detail_result: {RoomType:'', Rooms:[],CheckIns:[]}//{ "RoomType": type, "Rooms": [value], "CheckIns":[] };
    }, _JsL.Grid.Model.prototype.defaults),
    initialize: function () {
        _JsL.Grid.Model.prototype.initialize.call(this);
    }
});

_JsL.Haiyou.Reservation.AssignRoomDetail.View = _JsL.Grid.View.extend({
    model: _JsL.Haiyou.Reservation.AssignRoomDetail.Model,
    initialize: function () {
        this.model.on('change:detail_result', function () { this.trigger('modelChanged', this.model.get("detail_result")); }, this);
        _JsL.Grid.View.prototype.initialize.call(this);
    },
    events: _.extend({
    }, _JsL.Grid.View.prototype.events),
    render: function () {
        this.$el.html(this.getDisTemplate());
        this.beforeRender();
    },
    getDisTemplate: function () {
        return [
        '<div class="block"  style="height:216px;">',
         '<table class="tbBase">',
            '<thead >',
                '<tr>',
                    '<th style="width:6px"></th>', //todo , 宽度问题
                    '<th style="width:15%">', $Lang.Reservation.AssignRoomDetail.RoomNo, '</th>',
                    '<th style="width:20%">', $Lang.Reservation.AssignRoomDetail.RoomType, '</th>',
                    '<th style="width:25%">', $Lang.Reservation.AssignRoomDetail.RoomStatus, '</th>',
                    '<th style="width:35%">', $Lang.Reservation.AssignRoomDetail.RoomDes, '</th>',
                '</tr>',
            '</thead>',
            '<tbody class="content">',
                '<tr><td colspan="5"><div class="loading"></div></td></tr>',
            '</tbody>',
        '</table>',
       '</div>'].join('');
    },
    getTemplate: function () {
        return [
            '{#foreach $T as row}',
                '<tr>',
                    '<td><input type="checkbox" rtype="{$T.row.RoomTypeID}" {$T.row.IsCheckedIn ? disabled="disabled" : ""}  {$T.row.IsAssigned ? checked="checked" : ""} rno="{$T.row.RoomNo}" /></td>',
                    '<td style="width:15%">{$T.row.RoomNo}</td>',
                    '<td style="width:20%">{$T.row.RoomTypeName}</td>',
                    '<td style="width:25%">{$T.row.RoomStatusName}</td>',
                    '<td style="width:35%">{$T.row.RoomHobbies}</td>',
                '</tr>',
            '{#/for}'].join('');
    },
    onRowClick: function (e) {//seq: click->pop->check->valid->select->update->pop->parentupdate
        var obj = e.currentTarget,
            ref,
            cbx = $(obj).find('input:checkbox');
        if (cbx.attr('disabled'))
            return;
        if ($(e.target)[0].type != 'checkbox')
            cbx.prop('checked', !cbx.prop('checked')); //todo
        this.updateModel(); //get current values
        this.trigger('validateRoomNo', this.model.get("detail_result"), function (returnvalue) {
            ref = returnvalue;
        });
        if (!ref) { //房间数超出
            alert('房量数小于分房数');
            cbx.prop('checked', !cbx.prop('checked'));
            this.updateModel();
        }
    },
    updateModel: function () {
        var col = this.$el.find('input:checked'), //":enabled"todo, 看房间类型, 选那些可以选中的
            arr = [],
            roomtype = this.$el.find('input:eq(0)').attr('rtype');
        if (col.length > 0) {
            $.each(col, function (i, n) {
                arr.push($(n).attr('rno'));
            });
        }
        this.model.set({ "detail_result": { RoomType: roomtype, Rooms: arr } });
    },
    formatData: function (d) {
        if (typeof d.Data === 'string')
            return JSON.parse(d.Data);
        return d.Data;
    },
    visualize: function (d) {
        this.$el.find('tbody.content').html('');
        this.$el.find('tbody.content').setTemplate(this.getTemplate());
        this.$el.find('tbody.content').processTemplate(d);
        this.afterRender(d);
    },
    loadModel: function (d) {
        var ass = [],
           checks = [],
           roomtype = '';
        var m = this.model.get("detail_result"),
            col = this.$el.find('input'),
            roomtype = this.$el.find('input:eq(0)').attr('rtype');
        if (m && !m.IsFirst) {
            if (m.RoomType != '' && m.RoomType == roomtype) {
                col.prop('checked', false);
                $.each(col, function (i, n) {
                    if (_.contains(m.Rooms, $(n).attr('rno'))) {
                        $(n).prop('checked', true);
                    }
                });
            }
        }
        else
            $('.frozen-tableBodyer tbody').empty();
        // 修改,换房后可能房间消失, 重新从页面获取
        //else { 
        //    $('.frozen-tableBodyer tbody').empty();
        //    $.each(d, function (i, n) {
        //        roomtype = n.RoomTypeID;
        //        if (n.IsAssigned) {
        //            ass.push(n.RoomNo);
        //        }
        //        if (n.IsCheckedIn) {
        //            checks.push(n.RoomNo);
        //        }
        //    });
        //    //if (roomtype.length > 0) {
        //    //    this.model.set({ detail_result: { RoomType: roomtype, Rooms: ass, CheckIns: checks } });
        //    //}
        //}
        this.updateModel();
    },
    afterRender: function (d) {
        if (!d || d.length == 0) {
            this.$el.find('tbody.content').append('<tr><td colspan="5">没有查询到的房间</td></tr>');
        }
        else
            this.loadModel(d);

        this.superclass.afterRender.call(this, d);
    }
});
//#endregion

//#region AssignRoomAtrribute
_JsL.Haiyou.Reservation.AssignRoomAtrribute.Model = _JsL.Panel.Model.extend({
    defaults: _.extend({
        building_src: '',
        building_result: [],
        floor_src: '',
        floor_result: [],
        feature_src: '',
        feature_result: [],
        s_status: '1'
    }, _JsL.Panel.Model.prototype.defaults),
    initialize: function () {
        _JsL.Panel.Model.prototype.initialize.call(this);
    }
});

_JsL.Haiyou.Reservation.AssignRoomAtrribute.View = _JsL.Panel.View.extend({
    model: _JsL.Haiyou.Reservation.AssignRoomAtrribute.Model,
    initialize: function () {
        this.model.on('change:building_result', this.buildingChange, this);
        this.model.on('change:floor_result', function () { this.trigger('modelChanged', this.model); }, this);
        this.model.on('change:feature_result', function () { this.trigger('modelChanged', this.model); }, this);
        this.model.on('change:s_status', function () { this.trigger('modelChanged', this.model); }, this);
        _JsL.Panel.View.prototype.initialize.call(this);
    },
    events: _.extend({
        'change #ddlStatus': 'onStatusChange', //事件
        'click .querydetail' : 'onDetailQuery'
    }, _JsL.Panel.Model.prototype.events),
    getTemplate: function () {
        return [
           '<fieldset>',
               '<legend> 查询 </legend>',
               '<table style="width:96%">',
                 '<tbody>',
                     '<tr>',
                        '<td style="width:50%;text-align:right;">楼：<input type="text" style="width:110px;" class="cmbDrop" id="comboxBuilding" /></td>',
                        '<td style="width:50%;text-align:right;">层：<input type="text" style="width:110px;" class="cmbDrop" id="comboxFloor" /></td>',
                     '</tr>',
                     '<tr>',
                        '<td style="width:50%;text-align:right;">特征：<input type="text" style="width:110px;" class="cmbDrop" id="comboxFeature" /></td>',
                        '<td style="width:50%;text-align:right;">状态：',
                                                                      '<select id="ddlStatus">',
                                                                        '<option value="1">可住房</option>',
                                                                        '<option value="2">可订房</option>',
                                                                        '<option value="3">维修房</option>',
                                                                       '</select>',
                                                                       ' <input type="button" value="查询" class="blueBtn querydetail"/>',
                        '</td>',
                     '</tr>',
                 '</tbody>',
               '</table>',
           '</fieldset>'].join('');

    },
    onDetailQuery: function () {
        this.trigger('onDetailQuery');
    },
    beforeRender: function () {
        this.visualize();
    },
    afterRender: function () {
        var context = this;
        $("#comboxBuilding").comBoxComplete({
            init: function () {
                var control = this;
                _JsL.Util.ajaxCall({ url: context.model.get("building_src"), method: 'GET' },
                    function (json) {
                        var l = [],
                            json = (typeof json.Data === 'string') ? JSON.parse(json.Data) : json.Data;
                        $(json).each(function () {
                            l.push(['<li>',
                                       '<input type="checkbox" id="chk' + this.HallID + '" value="' + this.HallID + '" /> ',
                                       ' <label for=\"chk' + this.HallID + '\">' + this.HallName + '</label>',
                                    '</li>'].join(''));
                        });
                        control.comBoxCompleteItems.html(l.join(""));
                    })
            },
            afterShow: function () {
                var building_result = this.selectValues();
                context.model.set({ "building_result": building_result });
            }
        });

        $("#comboxFloor").comBoxComplete({
            afterShow: function () {
                var floor_result = this.selectValues();
                context.model.set({ "floor_result": floor_result });
            }
        });

        $("#comboxFeature").comBoxComplete({
            init: function () {
                var control = this;
                _JsL.Util.ajaxCall({ url: context.model.get("feature_src"), method: 'GET' },
                    function (json) {
                        var l = [],
                            json = (typeof json.Data === 'string') ? JSON.parse(json.Data) : json.Data;
                        $(json).each(function () {
                            l.push(['<li>',
                                   '<input type="checkbox" id="chk' + this.HobbyID + '" value="' + this.HobbyID + '" /> ',
                                   ' <label for=\"chk' + this.HobbyID + '\">' + this.Name + '</label>',
                                '</li>'].join(''));
                        });
                        control.comBoxCompleteItems.html(l.join(""));
                    });
            },
            afterShow: function () {
                var feature_result = this.selectValues();
                context.model.set({ "feature_result": feature_result });
            }
        });
    },
    onStatusChange: function (event) {
        var element = event.currentTarget;
        var s_status = $(element).val();
        this.model.set({ "s_status": s_status });
    },
    buildingChange: function () {
        this.trigger('modelChanged', this.model);
        var context = this;
        $("#comboxFloor").comBoxComplete({
            init: function () {
                var control = this;
                _JsL.Util.ajaxCall({ url: context.model.get("floor_src"), method: 'POST', parms: { jsonStr: $.param({ building: context.model.get("building_result").join(',') }) } }
                    , function (json) {
                        var l = [],
                            json = (typeof json.Data === 'string') ? JSON.parse(json.Data) : json.Data;
                        $(json).each(function () {
                            l.push(['<li>',
                                      '<input type="checkbox" id="chk' + this.FloorID + '" value="' + this.FloorID + '" /> ',
                                      ' <label for=\"chk' + this.FloorID + '\">' + this.FloorName + '</label>',
                                   '</li>'].join(''));
                        });
                        control.comBoxCompleteItems.html(l.join(""));
                    });
            }
        });
    }
});
//#endregion

