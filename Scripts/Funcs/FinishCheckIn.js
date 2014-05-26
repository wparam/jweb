
$.ns('_JsL.Haiyou.Reservation.FinishCheckIn');
_JsL.Haiyou.Reservation.FinishCheckIn.Model = _JsL.PopWindow.Model.extend({
    defaults: _.extend({
        display_titles: {},
        hotel_id : '',
        bill_id:'',
        indeposit_url: 'Cashier/BillAdd.aspx?AddType=AddCredit&Bills=',
        paninadvance_url: 'Cashier/PreBillClose.aspx?Bills=',
        receive_url: 'Reception/RcpnDetail.aspx?receiveId=',
        get_deposit_url : ''
    }, _JsL.PopWindow.Model.prototype.defaults),
    initialize: function () {
        _JsL.PopWindow.Model.prototype.initialize.call(this);
    },
    callBase: function () {
        this.superclass.getConfig.call(_.rest(arguments));
    },
    getParams: function () {
        return $.param({
        });
    }
});

_JsL.Haiyou.Reservation.FinishCheckIn.View = _JsL.PopWindow.View.extend({
    model: _JsL.Haiyou.Reservation.FinishCheckIn.Model,
    initialize: function () {
        _JsL.PopWindow.View.prototype.initialize.call(this);
    },
    events: _.extend({
        'click input.checkAll': 'checkAll',
        'click input.deposit': 'inDeposit',
        'click input.closure': 'payInAdvance',
        'click input.makecard': 'makeCard',
        'click input.receive': 'inReceive',
        'click a,input.quit': 'quit',
        'click input.print': 'print'
    }, _JsL.PopWindow.View.prototype.events),
    computePos: function () {

    },
    showWindow: function () { },
    getTemplate: function () {
        return [
            '<div style="overflow-y:scoll;heigth:380px; width:600px;padding:5px;">',
                   '<p>入住已经完成，请确认以下信息</p>',
                   '<div class="block">',
                      '<table class="tbBase" style="width:100%;">',
                         '<thead>',
                          '<tr>',
                              '<th style="width:5%"><input type="checkbox" checked="checked" class="checkAll" /></th>', //todo:替换成资源
                              '<th>房间号</th>',
                              '<th>入住人</th>',
                              '<th>本人本卡</th>',
                              '<th>主单信息</th>',
                              '<th>首日早餐</th>',
                              '<th>入住时间</th>',
                              '<th>离店时间</th>',
                              '<th>均价</th>',
                              '<th>押金</th>',
                          '</tr>',
                          '</thead>',
                          '<tbody>',
                          '{#foreach $T as row}',
                              '<tr style="color: #1e486e">',
                                  '<td><input type="checkbox" checked="checked" ismain="{$T.row.MainRecpInfo}" bid="{$T.row.BillID}" rid="{$T.row.ReceiveID}" sr="{$T.row.IsSameRoom}" rname="{$T.row.CheckInPersion}" rno="{$T.row.RoomNo}"/></td>',
                                  '<td>{$T.row.RoomNo}</td>',
                                  '<td>{$T.row.CheckInPersion}</td>',
                                  '<td>{$T.row.SelfCard}</td>',
                                  '<td>{$T.row.MainRecpInfo}</td>',
                                  '<td>{$T.row.FirstDayBreakfast}</td>',
                                  '<td>{$T.row.ArriveDateStr}</td>',
                                  '<td>{$T.row.LeaveDateStr}</td>',
                                  '<td>￥{$T.row.AveragePrice}</td>',
                                  '<td depid="{$T.row.BillID}">{$T.row.Deposit}</td>',
                              '</tr>',
                          '{#/for}',
                          '<tr><td colspan="11">',
                              '</td>',
                          '</tr>',
                         '</tbody>',
                      '</table>',
                '</div>',
                '<div style="text-align:center;padding:5px;">',
                    '<input type="button" class="btn deposit" value="入押金"/>&nbsp;',
                    '<input type="button" class="btn closure" value="提前结账" />&nbsp;',
                    '<input type="button" class="btn makecard" value="制作房卡" />&nbsp;',
                    '<input type="button" class="btn receive" value="接待详单" />&nbsp;',
                    '<input type="button" value="打印单据" class="btn print" />&nbsp;',
                    '<input type="button" value="退出" class="btn quit" />',
                '</div>',
            '</div>'
        ].join('');
    },
    checkAll: function (e) {
        var boxes = this.$el.find('input[type="checkbox"]'),
            checks = $(e.currentTarget).prop('checked');
        $.each(boxes, function (i, n) {
            $(n).prop('checked', checks);
        });
    },
    saveChange: function (e) {
        var context = this;
        _JsL.Util.ajaxCall({
            url: context.model.get("save_url"), method: 'POST', parms: this.model.getParams()
        }, function (d) {
            var d = $.parseJSON(d.d);
            if (typeof d === 'number' && d == 1) {
                alert('保存成功');//todo, resource
            }
        }, function () {
            alert('保存失败');
        });
        this.hide();
        this.close();
    },
    linkToUrl: function (url, title, afterclose) {
        dialogWindow.show(url, title, 824, 520, afterclose);
        /*var p =  $('<div></div>');
        p.load(url);
        p.dialog({
            width: '610px',
            title: title,
            isModal: true,
            isCenter: true,
            isShowTitle: true,
            isNearTrigger: false,
            isFixed: false
        });
        */
        //todo, close
    },
    inDeposit: function () {//入押金
        var bills = this.getBillids(),
            context = this;
        if (bills.length == 0) {
            alert('请选择房间');
            return;
        }
        if (!this.model.get("indeposit_url")) {
            alert('入押金地址未设置');
            return;
        }
        this.linkToUrl(_oldRoot + this.model.get("indeposit_url") + bills, '入押金', function () { context.finishDeposit.call(context); });
    },
    finishDeposit: function () {
        var context = this;
        _JsL.Util.ajaxCall({
            url: context.model.get("get_deposit_url"), method: 'GET',
            parms: { parms: $.param({ hotelid: context.model.get("hotel_id"), billids: context.getBillids() }) }
        }, function (d) {
            if (!d.Success) {
                alert('没有获取到所入押金金额');
                return;
            }
            var data = typeof d.Data === 'string' ? JSON.parse(d.Data) : d.Data;
            $.each(data, function (i, n) {
                var td = context.$el.find(('td[depid="{0}"]').format(n.BillID));
                if (td.length != 0) {
                    td.text(n.Deposit);
                }
            });
        }, function () {
            alert('服务器获取押金失败');
        });
    },
    payInAdvance: function () {
        var obj = this.getBillids();
        if (obj == '') {
            alert('请选择房间');
            return;
        }
        if (!this.model.get("paninadvance_url")) {
            alert('提前结账地址未设置');
            return;
        }
        this.linkToUrl(_oldRoot + this.model.get("paninadvance_url") + obj, '提前结账');
        //if (typeof parent.popup === 'function') {
        //    parent.frameLoad.popUpWindowChooseRoom(null, null, parent.oldROOT + 'Cashier/PreBillClose.aspx?Bills=' + obj, '提前结账', 840, 630);
        //    //var url = parent.oldROOT + 'Cashier/PreBillClose.aspx?Bills=' + obj;
        //    //parent.popup(url, { 'name': '提前结账', 'height': 660, 'width': 970 });
        //}
    },
    makeCard: function () {
        //if (typeof parent.frameLoad.popUpWindowChooseRoom === 'function') {
        //    parent.frameLoad.popUpWindowChooseRoom(null, null, parent.frameLoad.rootPath + '/CardReader/RoomCardMakerForCheckingIn.aspx?&rid=' + this.getRecIds(), '制作房卡', 660, 400);
        //}
        var data = [];
        $.each(this.$el.find('input:checkbox[class!="checkAll"]:checked'), function (i, n) {
            var issame = $(n).attr('sr'),
                roomno = $(n).attr('rno'),
                rid = $(n).attr('rid');
            data.push({
                Index: i,
                Inmate: issame,
                ReceiveID: rid,
                RoomNo: roomno
            });
        });
        if (data.length == 0)
            return;
        //var data = '[{"Index":"0","Inmate":"false","ReceiveID":"C61004130000063543","RoomNo":"8810"},{"Index":"1","Inmate":"false","ReceiveID":"C61004130000063544","RoomNo":"8825"}]';
        var roomCardView = new _JsL.Haiyou.Reservation.MakeRoomCard.View({
            el: $('<div></div>'),
            model: new _JsL.Haiyou.Reservation.MakeRoomCard.Model({
                modelJson: data
            })
        });
        roomCardView.render();

    },
    inReceive: function () {
        var obj = this.getUniqueIds();
        if ($.isEmptyObject(obj)) {
            alert('请选择房间');
            return;
        }
        if (!this.model.get("receive_url")) {
            alert('接待详单地址未设置');
            return;
        }
        parent.top.location.href = _oldLinkPrefix + this.model.get("receive_url") + obj.ReceiveID;
        //this.hideWindow();
        //location.href = parent.oldROOT + 'Reception/RcpnDetail.aspx?receiveId=' + obj.ReceiveID;
        ////parent.frameLoad.popUpWindow(parent.oldROOT + 'Reception/RcpnDetail.aspx?receiveId=' + obj.ReceiveID);
        //this.hideWindow();
        //if ($('#dialog-overlay', parent.document).length > 0) {
        //    $('#dialog-overlay', parent.document).hide();
        //}
    },
    afterRender: function (d) {
        //this.showWindow();
        //if ($('#dialog-overlay', parent.document).length > 0) {
        //    $('#dialog-overlay', parent.document).css('height', $(parent.document).height()).show();
        //}
        var context = this;
        this.$el.dialog({
            width: '610px',
            title: "确认入住信息",
            isModal: true,
            isCenter: true,
            isShowTitle: true,
            isNearTrigger: false,
            isFixed: false,
            afterClose: function () { context.quit.call(context); }
        });
    },
    print: function () {
        //if (typeof parent.frameLoad.popUpWindowChooseRoom === 'function') {
        //    parent.frameLoad.popUpWindowChooseRoom(null, null, parent.frameLoad.rootPath + '/Print/CashPrint.aspx?rid=' + this.getRecIds() + "&bid=" + this.model.get("bill_id"), '打印单据', 660, 450);
        //}
        var data = this.getRecIds();// 'C61004130000063543,C61004130000063544';
        var printView = new _JsL.Haiyou.Reservation.CashPrint.View({
            el: $('<div></div>'),
            model: new _JsL.Haiyou.Reservation.CashPrint.Model({
                receiveIDs: data
            })
        });
        printView.render();

    },
    getUniqueIds: function () {
        var obj = {};
        $.each(this.$el.find('input:checkbox[class!="checkAll"]:checked'), function (i, n) {
            var ismain = $(n).attr('ismain'),
                bid = $(n).attr('bid'),
                rid = $(n).attr('rid');
            if (ismain == '联主') { //
                obj.BillID = bid;
                obj.ReceiveID = rid;
                return false;
            }
            if (ismain == '主单') { //
                obj.BillID = bid;
                obj.ReceiveID = rid;
                return false;
            }
            obj.BillID = bid;
            obj.ReceiveID = rid;
        });
        return obj;
    },
    getBillids: function () {
        var s = '';
        $.each(this.$el.find('input:checkbox[class!="checkAll"]:checked'), function (i, n) {
            s += ($(n).attr('bid') + ',');
        });
        return s.replace(/,*$/g, "");
    },
    getRecIds: function () {
        var arr = '';
        $.each(this.$el.find('input:checkbox[class!="checkAll"]:checked'), function (i, n) {
            arr += ($(n).attr('rid') + ',');
        });
        return arr.replace(/,*$/g, "");
    },
    quit: function () {
        this.trigger('quitFinishCheckin');
        this.$el.dialog('close');
        //if ($('#dialog-overlay', parent.document).length > 0) {
        //    $('#dialog-overlay', parent.document).hide();
        //}
    }
});

