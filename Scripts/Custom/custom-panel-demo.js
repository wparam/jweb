$.ns('_JsL.WorkExp', '_JsL.WorkExp.Col', '_JsL.Edu', '_JsL.Edu.Col');

//#region _JsL.WorkExp
_JsL.WorkExp.Model = _JsL.EditPanel.Model.extend({
    defaults: _.extend({
        m_rid: 0,
        m_starty: '',
        m_startm: '',
        m_endy: _JsL.Util.getCurrentYear,
        m_endm: _JsL.Util.getCurrentMonth,
        m_company: '',
        m_industry: '',
        m_title: '',
        m_salary: '',
        m_leftreason: '',
        m_description : '',
        m_isred: "N"
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
            m_description: this.get("m_description"),
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
                        '<td width="320">',_JsL.Util.getTextInColByKey( _JsL.WorkExp.View.Industry,this.model.get("m_industry")), '</td>',
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
                        '<td colspan="3">', this.model.get("m_leftreason"), '</td>',
                        '<td>&nbsp;</td>',
                    '</tr>',
                    '<tr>',
                        '<th>工作内容：</th>',
                        '<td colspan="3">', this.model.get("m_description"), '</td>',
                        '<td>&nbsp;</td>',
                    '</tr>',
                    '<tr>',
                        '<th>是否红星：</th>',
                        '<td>', (this.model.get("m_isred") == "Y" ? "是" : "否"), '</td>',
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
                            '<select name="m_starty" class="widthS required" id="select" required>',
                                '<option selected="selected" value="">--年--</option>', this.getYear(),
                            '</select> ',
                            '<select name="m_startm" class="widthS required" id="select2" required>',
                                '<option selected="selected" value="">--月--</option><option value="1">1</option><option value="2">2</option>',
                                '<option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>',
                                '<option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>',
                                '<option value="11">11</option><option value="12">12</option>',
                            '</select> 到 ',
                            '<select name="m_endy" class="widthS" id="select3">',
                                '<option selected="selected" value="', _JsL.Util.getCurrentYear, '">--年--</option>', this.getYear(),
                            '</select> ',
                            '<select name="m_endm" class="widthS" id="select4">',
                                '<option selected="selected" value="', _JsL.Util.getCurrentMonth, '">--月--</option><option value="1">1</option><option value="2">2</option>',
                                '<option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>',
                                '<option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>',
                                '<option value="11">11</option><option value="12">12</option>',
                            '</select>（后两项不填表示至今）',
                        '</td>',
                        '<td width="60">&nbsp;</td>',
                    '</tr>',
                    '<tr>',
                        '<th><span class="font_red">*</span>公司：</th>',
                        '<td width="330"><input name="m_company" type="text" class="widthL required" id="textfield" required/></td>',
                        '<th width="90"><span class="font_red">*</span>行业：</th>',
                        '<td>',
                            '<select name="m_industry" class="widthM required" id="select6" required>',
                                '<option value="">--请选择--</option>',
                                this.getSelectTemplate(_JsL.WorkExp.View.Industry),
                            '</select>',
                        '</td>',
                        '<td>&nbsp;</td>',
                    '</tr>',
                    '<tr>',
                        '<th><span class="font_red">*</span>职位：</th>',
                        '<td><input name="m_title" type="text" class="widthL required" id="textfield2" required/></td>',
                        '<th>薪资：</th>',
                        '<td><input name="m_salary" type="text" class="widthL Double-Check" id="textfield3" />元</td>',
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
                        '<th>工作内容：</th>',
                        '<td colspan="3"><label for="fileField"></label><label for="textarea"></label>',
                            '<textarea name="m_description" cols="45" rows="5" class="widthXXL" id="textarea"></textarea>',
                        '</td>',
                        '<td>&nbsp;</td>',
                    '</tr>',
                    '<tr>',
                        '<th><span class="font_red">*</span>是否红星：</th>',
                        '<td><input type="radio" class="m_isred" name="m_isred', this.model.cid, '" id="m_isred" value="Y" ></input>是',
                            '<input type="radio" class="m_isred" name="m_isred', this.model.cid, '" id="m_isred" value="N" ></input>否',
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
    getBinds: function () {
        return {
            m_starty: '[name=m_starty]',
            m_startm: '[name=m_startm]',
            m_endy: '[name=m_endy]',
            m_endm: '[name=m_endm]',
            m_company: '[name=m_company]',
            m_industry: '[name=m_industry]',
            m_title: '[name=m_title]',
            m_salary: '[name=m_salary]',
            m_leftreason: '[name=m_leftreason]',
            m_description: '[name=m_description]',
            m_isred: '.m_isred' //用id或者name都不行
        };
    },
    restoreModel: function () {
        var src = this.cache.src_model;
        this.model.set({
            m_starty: src.get("m_starty"), m_startm: src.get("m_startm"), m_endy: src.get("m_endy"), m_endm: src.get("m_endm"),
            m_company: src.get("m_company"), m_industry: src.get("m_industry"), m_title: src.get("m_title"),
            m_salary: src.get("m_salary"), m_leftreason: src.get("m_leftreason"), m_description: src.get("m_description"), m_isred: src.get("m_isred")
        });
    },
    getSelectTemplate: function (collection) {
        var selectTemp =
                ['{#foreach $T as row}',
                    '<option value="{$T.row.ValueField}">{$T.row.TextField}</option>',
                 '{#/for}',
                ].join('');
        var tgt = $('<div></div>');
        tgt.setTemplate(selectTemp);
        tgt.processTemplate(collection);
        return tgt.html();
    }
})

//#endregion

//#region _JsL.WorkExp.Col
_JsL.WorkExp.Col.View = _JsL.Panel.Col.View.extend({
    model: _JsL.Panel.Col.Model,
    initialize: function () {
        _JsL.Panel.Col.View.prototype.initialize.call(this);
        _.bindAll(this, 'addPanel');
    },
    addPanel: function () {
        this.collection.push(new _JsL.WorkExp.Model({
            save_url: this.model.get("save_url"),
            m_rid: this.model.get("p_id"),
            del_url: this.model.get("del_url"),
            isEdit: true,
            readonly: this.model.get("readonly")
        }));
    },
    afterRender: function (d) {//依次从col里面取得model, 实例化成view
        var context = this,
            arr = [];
        if (!d || d.length == 0) {
            if (!this.model.get("readonly")) {
                arr.push(new _JsL.WorkExp.Model({
                    save_url: this.model.get("save_url"),
                    m_rid: this.model.get("p_id"),
                    del_url: this.model.get("del_url"),
                    isEdit: true,
                    readonly: this.model.get("readonly")
                }));
            }
        }
        else {
            this.model.set("p_id", d[0].ResumeId);
            $.each(d, function (i, n) {
                var m = new _JsL.WorkExp.Model({
                    m_id: n.Id,
                    m_rid: n.ResumeId,
                    m_starty: n.BeginYear, //todo 没有开始年月
                    m_startm: n.BeginMonth,
                    m_endy: n.EndYear,
                    m_endm: n.EndMonth,
                    m_company: n.Employer,
                    m_industry: n.Industry,
                    m_title: n.Position,
                    m_salary: n.Pay,
                    m_leftreason: n.Reason,
                    m_description: n.Description,
                    m_isred: n.IsRedStar,
                    isEdit: false,
                    save_url: context.model.get("save_url"),
                    del_url: context.model.get("del_url"),
                    readonly: context.model.get("readonly")
                });
                arr.push(m);
            });
        }
        this.collection.add(arr);
    }

})

//#endregion