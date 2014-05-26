
$.ns('_JsL.Haiyou.Reservation.CustomerInfo');
_JsL.Haiyou.Reservation.CustomerInfo.Model = _JsL.PopWindow.Model.extend({
    defaults: _.extend({
        display_titles: {},
        src: {},
        uid:'',
        card_type_col: {},
        province_col: {},
        nation_col: {},
        race_col: {},
        cus_id:'',
        cus_name: '',
        cus_mobile: '',
        cus_cardtype: '',
        cus_hometown: '',
        cus_cardno: '',
        cus_country: '',
        cus_nation: '',
        cus_birthday: '',
        cus_gender: '',
        cus_province: '',
        cus_address: '',
        scan_data:{},
        save_url:''
    }, _JsL.PopWindow.Model.prototype.defaults),
    initialize: function () {
        _JsL.PopWindow.Model.prototype.initialize.call(this);
    },
    callBase: function () {
        this.superclass.getConfig.call(_.rest(arguments));
    },
    getParams: function () {
        return $.param({
            cus_id : this.get("cus_id"),
            cus_name: this.get("cus_name"),
            cus_mobile: this.get("cus_mobile"),
            cus_cardtype: this.get("cus_cardtype"),
            cus_hometown: this.get("cus_hometown"),
            cus_cardno: this.get("cus_cardno"),
            cus_country: this.get("cus_country"),
            cus_nation: this.get("cus_nation"),
            cus_birthday: this.get("cus_birthday"),
            cus_gender: this.get("cus_gender"),
            cus_province: this.get("cus_province"),
            cus_address: this.get("cus_address")
        });
    }
});

_JsL.Haiyou.Reservation.CustomerInfo.View = _JsL.PopWindow.View.extend({
    model: _JsL.Haiyou.Reservation.CustomerInfo.Model,
    _modelBinder: undefined,
    initialize: function () {
        _JsL.PopWindow.View.prototype.initialize.call(this);
    },
    events: _.extend({
        'click input.savebtn': 'saveChange',
        'click input.cancel': 'cancelChange'
    }, _JsL.PopWindow.View.prototype.events),
    getTemplate: function () {
        return [
            '<table  style="background:#ffffff;width:570px;">',
                '<tr style="color: #1e486e">',
                    '<td style="width: 15%;text-align:right;">姓名</td>', //todo:替换成资源
                    '<td style="width: 15%;text-align:left;"><input class="input" type="text" name="cus_name"/></td>',
                    '<td style="width: 15%;text-align:right;">证件类型</td>',
                    '<td style="width: 15%;text-align:left;">', this.getSelectTemplate("cus_cardtype", this.model.get("card_type_col")), '</td>',
                    '<td style="width: 20%;text-align:right;">证件号</td>',
                    '<td style="width: 20%;text-align:left;"><input class="input" type="text" name="cus_cardno" value=""/></td>',
                '</tr>',
                '<tr style="color: #1e486e">',
                    '<td style="text-align:right;">手机\电话</td>',
                    '<td style="text-align:left;"><input class="input" type="text" name="cus_mobile"/></td>',
                    '<td style="text-align:right;">籍贯</td>',
                    '<td style="text-align:left;">', this.getSelectTemplate("cus_hometown", this.model.get("province_col")), '</td>',
                    '<td style="text-align:right;">生日</td>',
                    '<td style="text-align:left;"><input class="input" type="text" name="cus_birthday"/></td>',
                '</tr>',
                '<tr style="color: #1e486e">',
                    '<td style="text-align:right;">民族</td>',
                    '<td style="text-align:left;">', this.getSelectTemplate("cus_country", this.model.get("race_col")), '</td>',
                    '<td style="text-align:right;">国家</td>',
                    '<td style="text-align:left;">', this.getSelectTemplate("cus_nation", this.model.get("nation_col")), '</td>',
                    '<td style="text-align:right;">省(州)/市</td>',
                    '<td style="text-align:left;">', this.getSelectTemplate("cus_province", this.model.get("province_col")), '</td>',
                '</tr>',
                '<tr style="color: #1e486e">',
                    '<td style="text-align:right;">性别</td>',
                    '<td style="text-align:left;"><input type="radio" value="1" name="cus_gender"/>男<input type="radio" value="2" name="cus_gender"/>女</td>',
                    '<td style="text-align:right;">地址</td>',
                    '<td colspan="3" style="text-align:left;"><input class="input" type="text" name="cus_address" value="" style="width:95%"/></td>',
                '</tr>',
                '<tr style="color: #1e486e;text-align:center;">',
                    '<td colspan="6"> <input type="button" class="btn savebtn" value="保存"/> <input type="button" class="btn cancel" value="取消"/> </td>',
                '</tr>',
            '</table>'
        ].join('');
    },
    computePos: function () {
        return {};
        var cusobj = {};
        //this.trigger('getCustomOffset', cusobj);
        var pos = _JsL.Util.getRelativePos(this.model.get("src"), cusobj.x, cusobj.y);
        this.model.set({
            pos_x: pos.x,
            pos_y: pos.y
        });
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
    saveChange: function (e) {
        var context = this;
        _JsL.Util.ajaxCall({
            url: context.model.get("save_url"), method: 'POST', parms: { parms: this.model.getParams() }
        }, function (d) {
            if (!d.Success) {
                alert('保存失败,没有返回实体');
            }
            else {
                var d = (typeof d.Data === 'string') ? JSON.parse(d.Data) : d.Data;
                context.model.set({ scan_data: {} }); //先把scan设置清除
                context.batchSetModel(d);
                context.showWindow();
                context.trigger('updateGrid', d);

            }
            context.hideWindow();
            if ($('#dialog-overlay').length > 0) { //todo
                $('#dialog-overlay').hide();
            }
        }, function () {
            alert('保存失败');
            context.hideWindow();
            if ($('#dialog-overlay').length > 0) { //todo
                $('#dialog-overlay').hide();
            }
        });

    },
    cancelChange: function () {
        this.hideWindow();
        this.$el.dialog('close');
    },
    batchSetModel: function (d) {
        if (!d)
            return;
        var scan_data = this.model.get("scan_data");
        this.model.set({
            cus_id: d.CusAccID,
            cus_name: $.isEmptyObject(scan_data) ? d.CusName : scan_data.Name,
            cus_mobile: d.Mobile,
            cus_cardtype: $.isEmptyObject(scan_data) ? d.IDTypeID : scan_data.DeviceType,
            cus_hometown: d.NativeID,
            cus_cardno: $.isEmptyObject(scan_data) ? d.IDNo : scan_data.Number,
            cus_country: d.CountryID,
            cus_nation: d.NationalityID,
            cus_birthday: _JsL.Util.formateDate(d.BirthDay),
            cus_gender: d.SexID,
            cus_province: d.ProvinceID,
            cus_address: d.Address
        });
    },
    formatData: function (d) {
        if (d.Success) {
            if (typeof d.Data === 'string')
                return JSON.parse(d.Data);
            return d.Data
        }
    },
    afterRender: function (d) {
        if (!d.IDNo)
            return;
        else {
            this._modelBinder = new Backbone.ModelBinder();
            this._modelBinder.bind(this.model, this.el);
            this.batchSetModel(d);
            this.$el.dialog({
                width: '570px',
                isModal: true,
                isCenter: false,
                isShowTitle: false,
                isNearTrigger: true,
                triggerElement: this.model.get("src"),
                isFixed: false
            });
            //this.showWindow();
            //if ($('#dialog-overlay').length > 0) {
            //    $('#dialog-overlay').css('height', $(window.document).height()).show();
            //}
        }
    }

});

