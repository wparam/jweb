
$.ns('_JsL.Haiyou.Reservation.CheckIn', '_JsL.Haiyou.Reservation.CheckInDetail');

//#region CheckIn
_JsL.Haiyou.Reservation.CheckIn.Model = _JsL.Panel.Col.Model.extend({
    defaults: _.extend({
        datacollection: [],
        autocollection:[],
        s_getcusinfo_url: '',
        s_setcusinfo_url: '',
        orderStatus:''
    }, _JsL.Panel.Col.Model.prototype.defaults),
    initialize: function () {
        _JsL.Panel.Col.Model.prototype.initialize.call(this);
    }
});

_JsL.Haiyou.Reservation.CheckIn.View = _JsL.Panel.Col.View.extend({
    model: _JsL.Haiyou.Reservation.CheckIn.Model,
    initialize: function () {
        _JsL.Panel.Col.View.prototype.initialize.call(this);
    },
    events: _.extend({
        'click .check-all': 'onCheckAll'
    }, _JsL.Panel.Col.View.prototype.events),
    getTemplate: function () {
        return [
        '<div class="mtop10">',
         '<div class="block">',
         '<table  class="tbBase">',
            '<thead>',
                '<tr>',
                    '<th style="width:3%"><input type="checkbox" class="check-all" /></th>',
                    '<th style="width:10%">', $Lang.Reservation.CheckInControl.RoomType, '</th>',
                    '<th style="width:10%">', $Lang.Reservation.CheckInControl.RoomNo, '</th>',
                    '<th style="width:10%">', $Lang.Reservation.CheckInControl.Name, '</th>',
                    '<th style="width:8%">', $Lang.Reservation.CheckInControl.RoomStatus, '</th>',
                    '<th style="width:10%">', $Lang.Reservation.CheckInControl.CardType, '</th>',
                    '<th style="width:15%">', $Lang.Reservation.CheckInControl.CardNo, '</th>',
                    '<th style="width:12%">', $Lang.Reservation.CheckInControl.Phone, '</th>',
                    '<th style="width:10%">', $Lang.Reservation.CheckInControl.RoomPrice, '</th>',
                    '<th style="width:10%"></th>',
                '</tr>',
            '</thead>',
            '<tbody class="body-container">',
            '</tbody>',
        '</table>',
       '</div>',
      '</div>'].join(''); //todo, resources
    },
    getSheetModel: function () {
        var col = this.collection;
        if (_.size(col) > 0) {
            var arr = [];
            $.each(col.where({ t_selected: true }), function (i, n) {
                arr.push({
                    UniqueId: this.get("m_id"),
                    PID: this.get("p_id"),
                    RoomTypeID: this.get("s_roomtypeval"),
                    RoomNo: this.get("s_roomno"),
                    OldRoomNo: this.get("s_oldroomno"),
                    PersonName: this.get("s_name"),
                    IsCheckedIn: this.get("s_roomstatus"),
                    PersonIDType: this.get("s_cardtype"),
                    PersonIDNo: this.get("s_cardno"),
                    Mobile: this.get("s_phone"),
                    RoomPrice: this.get("s_roomprice"),
                    Birthday: this.get("Birthday"),
                    Address: this.get("Address"),
                    NationalityID: this.get("NationalityID"),
                    Sex: this.get("Sex")
                });
            });
            return arr;
        }
    },
    checkModelValide: function () {
        var flag = true,
            idarr = [], //证件号重复
            rooms_arr = []; //相同房间判断
        var items = this.collection.where({ t_selected: true });
        if (items.length == 0) {
            alert("请选择要入住的房间！");
            return false;
        }
        $.each(items, function (i, n) {
            if (!n.checkInValidate()) {
                flag = false;
                return false;
            }
            if (!n.get("p_id")) {
                if (!_JsL.Util.arrayIndexOf(rooms_arr, n.get("s_roomno"))) //房间号重复判断
                    rooms_arr.push(n.get("s_roomno"));
                else {
                    alert('房间重复！');
                    flag = false;
                    return false;
                }
            }
            if (!_JsL.Util.arrayIndexOf(idarr, n.get("s_cardno")))  //房间号重复判断
                idarr.push(n.get("s_cardno"));
            else {
                alert('证件号重复！');
                flag = false;
                return false;
            }
        });
        return flag;
    },
    checkHasCheckin: function () {
        var ele = this.collection.where({ s_roomstatus: true });
        if (ele.length>0)
            return true;
        return false;
    },
    beforeRender: function (d) {
        if (this.collection) {
            this.collection.reset();
        }
        this.model.set({ autocollection: [] });//清空自动排房数据
        this.superclass.beforeRender.call(this);
    },
    afterRender: function (d) {
        var data = [],
            context = this;
        if (this.model.get("orderStatus") == 'X')
            return;
        $U.ajaxCall({ url: this.model.get("data_url"), method: 'GET', async: false, parms: {} }, function (d) {
            if (d.Success) {
                data = typeof d.Data === 'string' ? JSON.parse(d.Data) : d.Data;
                if (data.length > 1) {
                    $.each(data, function (i, n) {
                        context.addPanel(n);
                    });
                }
                else if (data.length == 1) {
                    var n = data[0];
                    n.t_selected = true;
                    context.addPanel(n);
                }
                else { }
                //context.trigger('onItemChange', this.collection);
            }
        });
    },
    addPanel: function (n) {
        if (!n)
            return;
        this.collection.push(new _JsL.Haiyou.Reservation.CheckInDetail.Model({
            m_id: (n.UniqueId && n.UniqueId.length > 0) ? n.UniqueId : $U.getGuid(),
            p_id: n.p_id || '',
            s_roomtype: n.RoomTypeName,
            s_roomtypeval: n.RoomTypeID,
            s_roomno: this.autoAssignRoom(n.RoomNo, n.RommDeteail),
            s_oldroomno: n.RoomNo,
            s_name: n.PersonName,
            s_roomstatus: n.IsCheckedIn,
            s_cardtype: !n.PersonIDType ? 'C01' : n.PersonIDType,
            s_cardno: n.PersonIDNo,
            s_phone: n.Mobile,
            s_roomprice: n.RoomPrice,
            s_getcusinfo_url: this.model.get("s_getcusinfo_url"),
            s_setcusinfo_url: this.model.get("s_setcusinfo_url"),
            s_roomno_col: n.RommDeteail,
            t_selected:n.t_selected || false,
            s_cardtype_col: _JsL.Haiyou.Reservation.CustomerInfo.CardType //todo, 集合不应该放这
        }));
    },
    autoAssignRoom: function (rno, rcol) {
        if (!rno && rcol.length == 0)
            return '';
        var result = rno,
            context = this;
        if (!rno) {
            $.each(rcol, function (i, n) {
                if (!_.contains(context.model.get("autocollection"), n.RoomNo)) {
                    result = n.RoomNo;
                    context.model.get("autocollection").push(n.RoomNo);
                    return false;
                }
            });
        }
        else {
            context.model.get("autocollection").push(rno);
        }
        return result;
    },
    removePanel: function (mid) {
        var m = this.collection.findWhere({ m_id: mid });
        this.collection.remove(this.collection.findWhere({ m_id: mid }));
    },
    onAddPanel: function (m) { //操作view
        var tr = $('<tr mid="{0}" pid="{1}"></tr>'.format(m.get("m_id"), m.get("p_id")));
        if (m.get("p_id").length > 0) { //同住
            var p = this.$el.find('.body-container tr[mid="{0}"]'.format(m.get("p_id")));
            if (p.length > 0)
                p.after(tr);
            else
                throw "error on add panel";
        }
        else {
            this.$el.find('.body-container').append(tr);
        }
        var view = new _JsL.Haiyou.Reservation.CheckInDetail.View({
            el: tr,
            model: m
        });
        view.render();
        view.bind('onAddItem', this.addPanel, this);
        view.bind('onRemoveItem', this.removePanel, this);
        view.bind('onSelectChange', this.onSelectChange, this);
        view.bind('onRoomChange', this.onRoomChange, this);
        this.model.get("v_collections").push(view);
        this.trigger('onCollectionChanged', this.collection);
    },
    onRemovePanel: function (m) {//操作view
        var col = this.model.get("v_collections"),
            view,
            index;
        $.each(col, function (i, n) {
            if (n.model == m) {
                view = n;
                index = i;
            }
        });
        if (!view) {//no view been found
        }
        else {
            view.remove();
            col.remove(index);
        }
        this.trigger('onCollectionChanged', this.collection);
    },
    onRoomChange: function (m) {
        var col = this.collection;
        $.each(col.where({ p_id: m.get("m_id") }), function (i, n) {
            n.set({ s_roomno: m.get("s_roomno") });
        });
    },
    onSelectChange: function (m) {
        var selectflag = !m.get("t_selected");
        if (selectflag) {
            this.onSelectPanel(m);
        }
        else {
            this.onDeslectedPanel(m);
        }
    },
    onSelectPanel: function (m) {
        var col = this.collection;
        if (m.get("p_id").length > 0) {
            $.each(col.where({ m_id: m.get("p_id") }), function (i, n) {
                n.set({ "t_selected": true });
            });
        }
        else if (!m.get("p_id") || m.get("p_id").length == 0) {
            $.each(col.where({ p_id: m.get("m_id") }), function (i, n) {
                n.set({ "t_selected": true });
            });
        }
        m.set({ "t_selected": true });
    },
    onDeslectedPanel: function (m) {
        var col = this.collection;
        if (m.get("p_id").length > 0) {
        }
        else if (!m.get("p_id") || m.get("p_id").length == 0) {
            $.each(col.where({ p_id: m.get("m_id") }), function (i, n) {
                n.set({ "t_selected": false });
            });
        }
        m.set({ "t_selected": false });
    },
    onCheckAll: function (e) {
        var col = this.collection,
            obj = $(e.currentTarget);
        $.each(col.where({ t_selected: !obj.prop('checked') }), function (i, n) {
            if (!n.get("s_roomstatus"))
                n.set({ t_selected: obj.prop('checked') });
        });
    }
});

//#endregion

//#region CheckInDetail
_JsL.Haiyou.Reservation.CheckInDetail.Model = _JsL.EditPanel.Model.extend({
    defaults: _.extend({
        p_id: '',
        s_roomtype: '',
        s_roomtypeval: '',
        s_roomno: '',
        s_oldroomno: '',
        s_roomno_col: [],
        s_name: '',
        s_roomstatus: '',
        s_cardtype: 'C01',
        s_cardno: '',
        s_phone: '',
        s_roomprice: '',
        s_getcusinfo_url: '',
        s_setcusinfo_url: '',
        t_ismainroom: true, //是否同住
        t_selected: false,
        NationalityID: '',
        BirthDay: '',
        SexID: '',
        Address: ''
    }, _JsL.EditPanel.Model.prototype.defaults),
    initialize: function () {
        _JsL.EditPanel.Model.prototype.initialize.call(this);
    },
    checkInValidate: function () {
        var roomNO = this.get("s_roomno");

        if ($.trim(roomNO) == "") {
            alert("要入住的房间号，不能为空！");
            return false;
        }

        if ($.trim(this.get("s_name")) == "") {
            alert(roomNO + "房间，入住人姓名不能为空！");
            return false;
        }

        if ($.trim(this.get("s_cardtype")) == "" || $.trim(this.get("s_cardno")) == "") {
            alert(roomNO + "房间，证件号码不能为空！");
            return false;
        }

        if (this.get("s_cardtype") == 'C01'
            && !(/(^\d{15}$)|(^(\d{6})(19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|[x|X])$)/.test(this.get("s_cardno")))) {
            alert(roomNO + "房间，身份证格式不正确,请重新输入！");
            return false;
        }

        return true;
    }
});

_JsL.Haiyou.Reservation.CheckInDetail.View = _JsL.EditPanel.View.extend({
    model: _JsL.Haiyou.Reservation.CheckInDetail.Model,
    initialize: function () {
        _JsL.EditPanel.View.prototype.initialize.call(this);
        this.model.on('change:t_selected', this.selectChange, this);
        this.model.on('change:s_roomno', this.roomChange, this);
    },
    events: _.extend({
        'click ': 'onRowClick',
        'click a.panel-op': 'operateItem',
        'click input[type!="checkbox"],select': 'preventClick',
        'blur input[name="s_cardno"]': 'getInfoByCardNo',
        'click input[name="s_name"]': 'getCusInfo'
    }, _JsL.EditPanel.View.prototype.events),
    getTemplate: function () {
        var m = this.model;
        return [
            //'<tr mid="{0}" pid="{1}">'.format(m.get("m_id"), m.get("p_id")),
                '<td><input type="checkbox"/></td>',
                '<td><span name="s_roomtype"></span></td>',
                '<td><select {0} name="s_roomno">{1}</select></td>'.format(m.get("p_id").length > 0 ? 'disabled="disabled"' : '', this.getRoomCollectionSelect(m.get("s_roomno_col"))),
                '<td><input style="width:90%" class="input" type="text" name="s_name" /></td>',
                '<td><span>{0}</span></td>'.format(m.get("s_roomstatus") ? '已入住' : '未入住'),
                '<td>', this.getSelectTemplate('s_cardtype', _JsL.Haiyou.Reservation.CustomerInfo.CardType), '</td>',
                '<td><input type="text" class="input" style="width:90%" name="s_cardno"/></td>',
                '<td><input type="text" class="input" style="width:90%" name="s_phone"/></td>',
                '<td><span name="s_roomprice"></span></td>',
                '<td><a href="javascript:;" style="color:green" class="panel-op">{0}</a></td>'.format(m.get("p_id").length > 0 ? '删除' : '添加同住')
            //'</tr>'
        ].join(''); //todo, resources
    },
    getSelectTemplate: function (key, collection) {
        var selectTemp =
                ['<select class="w100" name=', key, '>',
                    '<option value="">请选择</option>',
                    '{#foreach $T as row}',
                    '<option value="{$T.row.ParameterId}">{$T.row.Script}</option>',
                     '{#/for}',
                '</select>'].join('');
        var tgt = $('<div></div>');
        tgt.setTemplate(selectTemp);
        tgt.processTemplate(collection);
        return tgt.html();
    },
    getRoomCollectionSelect: function (col) {
        var autoassi = !this.model.get("s_oldroomno") && this.model.get("s_roomno").length > 0;
        var selectTemp =
                ['{#foreach $T as row}',
                    '<option value="{$T.row.RoomNo}" style="{$T.row.RoomNo=={0} && {1} ? "color:blue":""}">{$T.row.RoomNo}</option>'.format(this.model.get("s_roomno"), autoassi),
                 '{#/for}',
                ].join('');
        var tgt = $('<div></div>');
        tgt.setTemplate(selectTemp);
        tgt.processTemplate(col);
        if (!this.model.get("s_roomno")) {
            tgt.prepend($('<option value=""></option>'));
        }
        return tgt.html();
    },
    getSelect: function (col) {
        var selectTemp =
                ['{#foreach $T as row}',
                    '<option value="{$T.row.ValueField}">{$T.row.TextField}</option>',
                 '{#/for}',
                ].join('');
        var tgt = $('<div></div>');
        tgt.setTemplate(selectTemp);
        tgt.processTemplate(col);
        return tgt.html();
    },
    operateItem: function (e) {
        if (this.model.get("p_id").length > 0) { //同住房删除
            this.trigger('onRemoveItem', this.model.get("m_id"));
        }
        else { //主房增加同住
            this.trigger('onAddItem', { //parent model
                p_id: this.model.get("m_id"),
                RoomTypeName: this.model.get("s_roomtype"),
                RoomTypeID: this.model.get("s_roomtypeval"),
                RoomNo: this.model.get("s_roomno"),
                IsCheckedIn: this.model.get("s_roomstatus") == '已入住' ? true : false,
                RoomPrice: this.model.get("s_roomprice"),
                RommDeteail: this.model.get("s_roomno_col"),
                t_selected:this.model.get("t_selected")
            });
        }
        return false;
    },
    onRowClick: function (e) {
        if (this.checkSelectable()) {
            this.trigger('onSelectChange', this.model); //this.model.set({ "t_selected": !this.model.get("t_selected") });
        }
    },
    checkSelectable: function () { //如果未入住返回true, 已入住返回false
        if (this.model.get("s_roomstatus")) {
            return false;
        }
        return true;
    },
    getInfoByCardNo: function () {
        var context = this;
        if (this.model.get("s_cardno").length == 0)
            return;
        $U.ajaxCall(
        { url: context.model.get("s_getcusinfo_url"), method: 'GET', parms: { parms: $.param({ cardid: this.model.get("s_cardno") }) } }, function (d) {
            if (d.Success) {
                var data = typeof d.Data === 'string' ? JSON.parse(d.Data) : d.Data;
                if (!data.CusName)
                    return;
                context.model.set({
                    s_name: data.CusName,
                    s_cardtype: data.IDTypeID
                });
            }
        }, function () {
            alert('获取失败');
        });
    }, //todo
    getCusInfo: function () {
        var context = this;
        if (!this.model.get("s_name") || !this.model.get("s_cardno"))
            return;
        var customerview = new _JsL.Haiyou.Reservation.CustomerInfo.View({
            el: $('<div></div>'),
            model: new _JsL.Haiyou.Reservation.CustomerInfo.Model({
                config: { url: context.model.get("s_getcusinfo_url"), method: 'GET', parms: { parms: $.param({ cardid: this.model.get("s_cardno") }) } },
                uid: context.model.get("m_id"),
                src: context.$el.find('input[name="s_name"]'),
                scan_data: {}, //todo, 扫描的证件怎么处理 ,还继续优先级?
                save_url: context.model.get("s_setcusinfo_url"),
                card_type_col: _JsL.Haiyou.Reservation.CustomerInfo.CardType,
                province_col: _JsL.Haiyou.Reservation.CustomerInfo.Province,
                nation_col: _JsL.Haiyou.Reservation.CustomerInfo.Nation,
                race_col: _JsL.Haiyou.Reservation.CustomerInfo.Race
            })
        });
        customerview.bind('updateGrid', function (d) {
            context.model.set({
                s_name: d.CusName,
                s_cardtype: d.IDTypeID,
                s_cardno: d.IDNo,
                s_phone: d.Mobile
            });
            customerview.$el.dialog('close');
        });
        customerview.render();
    },
    selectChange: function (e) {
        if (this.model.get("t_selected")) {
            this.$el.find('input[type="checkbox"]').prop('checked', true);
            this.$el.addClass('select');
        }
        else {
            this.$el.find('input[type="checkbox"]').prop('checked', false);
            this.$el.removeClass('select');
        }
    },
    roomChange: function (e) {
        this.trigger('onRoomChange', this.model);
    },
    preventClick: function (e) {
        return false;
    },
    afterRender: function (d) {
        //设置不可编辑
        if (this.model.get("s_roomstatus"))
            $.each(this.$el.find('input,select,a'), function (i, n) {
                $(n).attr('disabled', 'disabled');
                if ($(n).hasClass('panel-op'))
                    $(n).bind('click', function () { return false; });
            });
        if (!this.model.get("s_roomno") && this.model.get("s_roomno_col").length > 0) {
            this.model.set({ s_roomno: this.$el.find('select[name="s_roomno"]').val() });
        }

        //设置选中
        this.selectChange();
        this.superclass.afterRender.call(this, d);
    }

});
//#endregion
