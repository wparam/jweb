$.ns('_JsL.WorkExp', '_JsL.WorkExp.Col', '_JsL.Edu', '_JsL.Edu.Col');

//#region _JsL.WorkExp
_JsL.WorkExp.Model = _JsL.EditPanel.Model.extend({
    defaults: _.extend({
        m_rid: 0,
        m_starty: 0,
        m_startm: 0,
        m_endy: 0,
        m_endm: 0,
        m_company: '',
        m_industry: '',
        m_title: '',
        m_salary: '',
        m_leftreason: '',
        m_isred: '',
        isEdit: false
    }, _JsL.EditPanel.Model.prototype.defaults),
    initialize: function () {
        _JsL.EditPanel.Model.prototype.initialize.call(this);
    },
    getParams: function () {
        return $.param({
            m_wid: this.get("m_id"),
            m_rid: this.get("m_rid"),
            m_starty: this.get("m_starty"),
            m_startm: this.get("m_startm"),
            m_endy: this.get("m_endy"),
            m_endm: this.get("m_endm"),
            m_company: this.get("m_company"),
            m_industry: this.get("m_industry"),
            m_title: this.get("m_title"),
            m_salary: this.get("m_salary"),
            m_leftreason: this.get("m_leftreason"),
            m_isred: this.get("m_isred")
        });
    }
});

_JsL.WorkExp.View = _JsL.EditPanel.View.extend({
    model: _JsL.WorkExp.Model,
    initialize: function () {
        _JsL.EditPanel.View.prototype.initialize.call(this);
    },
    getReadTemplate: function () {
        return [
                '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="form">',
                    '<tr>',
                        '<th width="90">时间：</th>',
                        String.format('<td width="330">{0}年{1}月到{2}年{3}月</td>', this.model.get("m_starty"), this.model.get("m_startm"),
                            this.model.get("m_endy"), this.model.get("m_endm")),
                        '<th width="90">&nbsp;</th>',
                        '<td>&nbsp;</td>',
                        '<td width="60">',
                            '<a href="javascript:;" class="panel-edit"><img src="/Content/images/btn_edit.gif" width="60" height="20" /></a>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<th>公司：</th>',
                        '<td>', this.model.get("m_company"), '</td>',
                        '<th width="90">行业：</th>',
                        '<td width="320">', this.model.get("m_industry"), '</td>',
                        '<td>',
                            '<a href="javascript:;" class="panel-delete"><img src="/Content/images/btn_delete.gif" width="60" height="20" /></a>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<th>职位：</th>',
                        '<td>', this.model.get("m_title"), '</td>',
                        '<th>薪资：</th>',
                        '<td>', this.model.get("m_salary"), '元</td>',
                        '<td>&nbsp;</td>',
                    '</tr>',
                    '<tr>',
                        '<th>离职原因：</th>',
                        '<td>', this.model.get("m_leftreason"), '</td>',
                        '<th>&nbsp;</th>',
                        '<td>&nbsp;</td>',
                        '<td>&nbsp;</td>',
                    '</tr>',
                    '<tr>',
                        '<th>是否红星：</th>',
                        '<td>', this.model.get("m_isred"), '</td>',
                        '<th>&nbsp;</th>',
                        '<td>&nbsp;</td>',
                        '<td>&nbsp;</td>',
                    '</tr>',
                '</table>'
        ].join('');
    },
    getEditTemplate: function () {
        return [
                '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="form">',
                    '<tr>',
                        '<th width="90"><span class="font_red">*</span>时间：</th>',
                        '<td colspan="3">',
                            '<select name="m_starty" class="widthS" id="select">',
                                '<option selected="selected" value="0">--年--</option>', this.getYear(),
                            '</select> ',
                            '<select name="m_startm" class="widthS" id="select2">',
                                '<option selected="selected" value="0">--月--</option><option value="1">1</option><option value="2">2</option>',
                                '<option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>',
                                '<option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>',
                                '<option value="11">11</option><option value="12">12</option>',
                            '</select> 到 ',
                            '<select name="m_endy" class="widthS" id="select3">',
                                '<option selected="selected" value="0">--年--</option>', this.getYear(),
                            '</select> ',
                            '<select name="m_endm" class="widthS" id="select4">',
                                '<option selected="selected" value="0">--月--</option><option value="1">1</option><option value="2">2</option>',
                                '<option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>',
                                '<option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>',
                                '<option value="11">11</option><option value="12">12</option>',
                            '</select>（后两项不填表示至今）',
                        '</td>',
                        '<td width="60">&nbsp;</td>',
                    '</tr>',
                    '<tr>',
                        '<th><span class="font_red">*</span>公司：</th>',
                        '<td width="330"><input name="m_company" type="text" class="widthL" id="textfield" /></td>',
                        '<th width="90"><span class="font_red">*</span>行业：</th>',
                        '<td>',
                            '<select name="select4" class="widthM" id="select6">',
                                '<option value="0">--请选择--</option>',
                                '<option value="1">--制造业--</option>',
                                '<option value="2">--服务业--</option>',
                                '<option value="3">--家居--</option>',
                                '<option value="4">--服装--</option>',
                                '<option value="5">--计算机--</option>',
                            '</select>',
                        '</td>',
                        '<td>&nbsp;</td>',
                    '</tr>',
                    '<tr>',
                        '<th><span class="font_red">*</span>职位：</th>',
                        '<td><input name="m_title" type="text" class="widthL" id="textfield2" /></td>',
                        '<th>薪资：</th>',
                        '<td><input name="m_salary" type="text" class="widthL" id="textfield3" />元</td>',
                        '<td>&nbsp;</td>',
                    '</tr>',
                    '<tr>',
                        '<th>离职原因：</th>',
                        '<td colspan="3"><label for="fileField"></label><label for="textarea"></label>',
                            '<textarea name="m_leftreason" cols="45" rows="5" class="widthXXL" id="textarea"></textarea>',
                        '</td>',
                        '<td>&nbsp;</td>',
                    '</tr>',
                    '<tr>',
                        '<th><span class="font_red">*</span>是否红星：</th>',
                        '<td><input type="radio" name="m_isred" id="radio" value="1" checked="checked" />是',
                            '<input type="radio" name="m_isred" id="radio2" value="2" />否',
                        '</td>',
                        '<th>&nbsp;</th>',
                        '<td>&nbsp;</td>',
                        '<td>&nbsp;</td>',
                    '</tr>',
                '</table>',
                '<div class="saveaction">',
                    '<input type="button" class="save panel-save" style="cursor:pointer" value="保存" />',
                    '<a href="javascript:;" class="cancel panel-cancel">取消</a>',
                '</div>'
        ].join('');
    },
    restoreModel: function () {
        var src = this.cache.src_model;
        this.model.set({
            m_starty: src.get("m_starty"), m_startm: src.get("m_startm"), m_endy: src.get("m_endy"), m_endm: src.get("m_endm"),
            m_company: src.get("m_company"), m_industry: src.get("m_industry"), m_title: src.get("m_title"),
            m_salary: src.get("m_salary"), m_leftreason: src.get("m_leftreason"), m_isred: src.get("m_isred")
        });
    }
})

//#endregion

//#region _JsL.WorkExp.Col
_JsL.WorkExp.Col.View = _JsL.Panel.Col.View.extend({
    model: _JsL.Panel.Col.Model,
    initialize: function () {
        _JsL.Panel.Col.View.prototype.initialize.call(this);
    },
    afterRender: function (d) {//依次从col里面取得model, 实例化成view
        if (!d || d.length == 0)
            return;
        var context = this,
            arr = [];
        this.model.set("m_id", d[0].ResumeId);
        $.each(d, function (i, n) {
            var m = new _JsL.WorkExp.Model({
                m_id: n.Id,
                m_rid: n.ResumeId,
                m_starty: 2004, //todo 没有开始年月
                m_startm: 5,
                m_endy: 2006,
                m_endm: 6,
                m_company: n.Employer,
                m_industry: n.Industry,
                m_title: n.Position,
                m_salary: n.Pay,
                m_leftreason: n.Reason,
                m_isred: n.IsRedStar,
                isEdit: false,
                save_url: context.model.get("save_url"),
                del_url: context.model.get("del_url")
            });
            arr.push(m);
        });
        this.collection.add(arr);
    }

})

//#endregion