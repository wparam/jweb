

$.ns('_JsL.Haiyou.Reservation._JsLEditPanel', '_JsL.Haiyou.Reservation.CustomerCategory', '_JsL.Haiyou.Reservation.CustomerCategory.CC01',
    '_JsL.Haiyou.Reservation.CustomerCategory.CC02', '_JsL.Haiyou.Reservation.CustomerCategory.CC03',
    '_JsL.Haiyou.Reservation.CustomerCategory.CC04', '_JsL.Haiyou.Reservation.Contact', '_JsL.Haiyou.Reservation.CheckInfo', '_JsL.Haiyou.Reservation.AssignControl', '_JsL.Haiyou.Reservation.AssignControlDetail');

//#region _JsLEditPanel
_JsL.Haiyou.Reservation._JsLEditPanel.Model = _JsL.EditPanel.Model.extend({
    defaults: _.extend({
        showEditBtn: true, //是否显示编辑按钮
        distitle: ''
    }, _JsL.EditPanel.Model.prototype.defaults),
    initialize: function () {
        _JsL.EditPanel.Model.prototype.initialize.call(this);
    }
});

_JsL.Haiyou.Reservation._JsLEditPanel.View = _JsL.EditPanel.View.extend({
    model: _JsL.EditPanel.Model,
    initialize: function () {
        _JsL.EditPanel.View.prototype.initialize.call(this);
    },
    events: _.extend({
        'click .operateBox a.edit-btn': 'editPanel',
        'click .operateBox a.save-btn': 'savePanel'
    }, _JsL.EditPanel.View.prototype.events),
    getReadTemplate: function () {
        return [
            '<div class="greenBox mtop10">',
                '<div class="greenBoxTit">',
                    '<h2>', this.model.get("distitle"), '</h2>',
                    this.getTitleBar(),
                    '<span class="operateBox" ', (this.model.get("showEditBtn") ? '' : ' style="display:none" '), '><i class="edit"></i><a href="javascript:;" class="edit-btn">修改</a></span>',
                '</div>',
                '<div class="orderInfo">',
                    this.getReadContent(),
                '</div>',
            '</div>'
        ].join(''); //todo, resources
    },
    getEditTemplate: function () {
        return [
            '<div class="greenBox mtop10">',
                '<div class="greenBoxTit">',
                    '<h2>', this.model.get("distitle"), '</h2>',
                    this.getTitleBar(),
                    '<span class="operateBox" ', (this.model.get("showEditBtn") ? '' : ' style="display:none" '), '><i class="save"></i><a href="javascript:;" class="save-btn">保存</a></span>',
                '</div>',
                '<div class="orderInfo">',
                    this.getEditContent(),
                '</div>',
            '</div>'
        ].join(''); //todo, resources
    },
    getTitleBar: function () {
        return '';
    },
    onAfterSave: function (data) {
        this.trigger('onAfterSave', data);
    }
});
//#endregion

//#region 预订人信息
_JsL.Haiyou.Reservation.CustomerCategory.Model = _JsL.Haiyou.Reservation._JsLEditPanel.Model.extend({
    defaults: _.extend({
        category: '',
        cdata: {},
        orderid:'',
        vip_search_url: '', //个人查找url
        cvip_search_url: '', //公司会员查找url
        mid_search_url: '', //中介查找url
        save_url: '',
        source : '',
        v_sub : [] // [{Type:"CC01",Col:ViewObj}, {Type:"CC01",Col:ViewObj}...]
    }, _JsL.Haiyou.Reservation._JsLEditPanel.Model.prototype.defaults),
    initialize: function () {
        _JsL.Haiyou.Reservation._JsLEditPanel.Model.prototype.initialize.call(this);
        if (typeof this.configSub === 'function')
            this.configSub.call(this);
    }
});

_JsL.Haiyou.Reservation.CustomerCategory.View = _JsL.Haiyou.Reservation._JsLEditPanel.View.extend({
    model: _JsL.Haiyou.Reservation.CustomerCategory.Model,
    currentView: null,
    initialize: function () {
        _JsL.Haiyou.Reservation._JsLEditPanel.View.prototype.initialize.call(this);
        this.model.on('change:category', this.onChangeCategory, this);
        this.initSubViews();
    },
    checkIsEmpty: function () {
        if (this.currentView && typeof this.currentView.model.isEmpty === 'function')
            return this.currentView.model.isEmpty();
        return true;
    },
    getTitleBar: function () {
        return '<span class="orange" style="{0}">来源：{1}</span>'.format(!this.model.get("source") ? 'display:none' : 'display:block',
            this.model.get("source"));
    },
    getReadContent: function () {
        return [
            '<input type="radio" class="category" name="CustomerCate" disabled="disabled" value="CC01"/> 非会员   ',
            '<input type="radio" class="category" name="CustomerCate" disabled="disabled" value="CC02"/> 个人会员  ',
            '<input type="radio" class="category" name="CustomerCate" disabled="disabled" value="CC03"/> 公司会员   ',
            '<input type="radio" class="category" name="CustomerCate" disabled="disabled" value="CC04"/> 中介/旅行社 <br />',
            '<div class="sub-container"></div>'
        ].join(''); //todo, resources
    },
    getEditContent: function () {
        return [
            '<input type="radio" ctype="CC01" class="category" name="CustomerCate" id="RCC01" value="CC01"/><label for="RCC01"> 非会员 </label>   ',
            '<input type="radio" ctype="CC02" class="category" name="CustomerCate" id="RCC02" value="CC02"/><label for="RCC02"> 个人会员 </label>   ',
            '<input type="radio" ctype="CC03" class="category" name="CustomerCate" id="RCC03" value="CC03"/><label for="RCC03"> 公司会员 </label>   ',
            '<input type="radio" ctype="CC04" class="category" name="CustomerCate" id="RCC04" value="CC04"/><label for="RCC04"> 中介/旅行社 </label><br />',
            '<div class="sub-container"></div>'
        ].join(''); //todo, resources
    },
    saveData: function (async) {
        var context = this,
            md;
        if (typeof this.currentView.model.getDataModel === 'function')
            md = $.extend({}, { OrderId: this.model.get("orderid") }, this.currentView.model.getDataModel());
        if (this.currentView.model.isEmpty()) {
            alert('预订人信息不能为空！');
            return;
        }
        if (!md)
            return;
        $.post(context.model.get("save_url"), $.param({ jsonStr: JSON.stringify(md) }),
            function (d) {
                if (!d || !d.Success || d.IsException) { //error or fail
                    alert('保存出错：' + d.ResultMsg) //todo , fail ops
                }
                else {
                    var data = typeof d.Data === 'string' ? JSON.parse(d.Data) : d.Data;
                    context.model.set({ "isEdit": false, category: context.model.get("category"), cdata: data.CustomerCategory });
                    if (typeof context.onAfterSave === 'function')
                        context.onAfterSave(data);
                }
            }, 'json');
    },
    getBinds: function () {
        return { category: '.category' };
    },
    getSheetModel: function () {
        if (this.currentView) {
            return this.currentView.model.getDataModel();
        }
    },
    onChangeCategory: function (flag) {
        var col = this.model.get("v_sub"),
            cate = this.model.get("category"),
            context = this;
        if (this.$el.find('.sub-container').length > 0) {
            $('.sub-container').unbind();
            $('.sub-container').empty();
        }
        if (this.currentView) {
            this.currentView.unbind();
            this.currentView = null;
        }

        var obj = _.find(col, function (m) { return m.type == cate; }),
            v = obj.V,
            m = obj.M;
        if (!v) {
            return;
        }
        var view = new (v)({
            el: $('.sub-container'),
            model: new (m)({
                category: cate,
                cdata: !flag ? context.model.get("cdata") : undefined,
                isEdit: context.model.get("isEdit"),
                vip_search_url: context.model.get("vip_search_url"),
                cvip_search_url: context.model.get("cvip_search_url"),
                mid_search_url: context.model.get("mid_search_url"),
                save_url: context.model.get("save_url")
            })
        });
        view.render();
        this.currentView = view;
    },
    afterRender: function (d) {
        this.superclass.afterRender.call(this, d);
        this.onChangeCategory(false);
    },
    initSubViews: function () {
        var arr = [{ "type": "CC01", "M": _JsL.Haiyou.Reservation.CustomerCategory.CC01.Model, "V": _JsL.Haiyou.Reservation.CustomerCategory.CC01.View },
            { "type": "CC02", "M": _JsL.Haiyou.Reservation.CustomerCategory.CC02.Model, "V": _JsL.Haiyou.Reservation.CustomerCategory.CC02.View },
            { "type": "CC03", "M": _JsL.Haiyou.Reservation.CustomerCategory.CC03.Model, "V": _JsL.Haiyou.Reservation.CustomerCategory.CC03.View },
            { "type": "CC04", "M": _JsL.Haiyou.Reservation.CustomerCategory.CC04.Model, "V": _JsL.Haiyou.Reservation.CustomerCategory.CC04.View }];
        this.model.set({ v_sub: arr });
    }
});


//#region 非会员CC01
_JsL.Haiyou.Reservation.CustomerCategory.CC01.Model = _JsL.Haiyou.Reservation.CustomerCategory.Model.extend({
    defaults: _.extend({
        memname: '',
        phone:''
    }, _JsL.Haiyou.Reservation.CustomerCategory.Model.prototype.defaults),
    initialize: function () {
        _JsL.Haiyou.Reservation.CustomerCategory.Model.prototype.initialize.call(this);
    },
    configSub: function () {
        var cd = this.get("cdata");
        if (!cd)
            return;
        this.set({ memname: cd.MemberName, phone: cd.MemberMobile });
    },
    getDataModel: function () {
        return {
                LinkMan: { Name: this.get("memname"), Mobile: this.get("phone") },
                CustomerCategory: { CusCategoryID: "CC01", MemberName: this.get("memname"), MemberMobile: this.get("phone") }
        };
    },
    getContactModel: function () {
        return {
            LinkMan: { Name: this.get("memname"), Mobile: this.get("phone") }
        };
    },
    isEmpty: function () {
        return !this.get("memname") && !this.get("phone");
    }
});

_JsL.Haiyou.Reservation.CustomerCategory.CC01.View = _JsL.EditPanel.View.extend({
    model: _JsL.Haiyou.Reservation.CustomerCategory.CC01.Model,
    initialize: function () {
        _JsL.EditPanel.View.prototype.initialize.call(this);
    },
    events: _.extend({
        'keypress input[name="memname"] ': 'onNameKeyPress',
        'keypress input[name="phone"]': 'onPhoneKeyPress'
    }, _JsL.EditPanel.View.prototype.events),
    getReadTemplate: function () {
        return [
          '姓名：', this.model.get("memname"),
          ' &nbsp;&nbsp;&nbsp; 手机：', this.model.get("phone")
        ].join('');
    },
    getEditTemplate: function () {
        return [
           '姓名：<input name="memname"  class="input m" type="text" />&nbsp;&nbsp;',
           '手机：<input name="phone"  type="text" class="input" />'
        ].join('');
    },
    onNameKeyPress: function (event) {
        if (event.keyCode == 32)
            return false;
    },
    onPhoneKeyPress: function (event) {
        var keynum = (event.which) ? event.which : event.keyCode;
        if (keynum < 48 || keynum > 57)
            return false;
    }
});
//#endregion

//#region 会员CC02 test:18918923411
_JsL.Haiyou.Reservation.CustomerCategory.CC02.Model = _JsL.Haiyou.Reservation.CustomerCategory.Model.extend({
    defaults: _.extend({
        memvalue: '',
        cardno:'',
        name:'',
        phone:'',
        level:'',
        leveltype: '',
        noresult:''
    }, _JsL.Haiyou.Reservation.CustomerCategory.Model.prototype.defaults),
    initialize: function () {
        _JsL.Haiyou.Reservation.CustomerCategory.Model.prototype.initialize.call(this);
    },
    configSub: function () {
        var cd = this.get("cdata");       
        if (!cd )
            return;
        this.set({memvalue: cd.BookerID,cardno: cd.BookerID, name: cd.MemberName, phone: cd.MemberMobile, level: cd.BookerName, leveltype: cd.BookerLevel });
    },
    getDataModel: function () {
        return {
                CustomerCategory: {
                CusCategoryID: "CC02",
                BookerID: this.get("cardno"),
                BookerLevel :  this.get("leveltype"),
                MemberName : this.get("name"),
                MemberMobile:this.get("phone")}
             };
    },
    isEmpty: function () {
        return !this.get("cardno");
    }
});

_JsL.Haiyou.Reservation.CustomerCategory.CC02.View = _JsL.EditPanel.View.extend({
    model: _JsL.Haiyou.Reservation.CustomerCategory.CC02.Model,
    initialize: function () {
        _JsL.EditPanel.View.prototype.initialize.call(this);
        this.model.on('change:cardno', this.render, this);
    },
    events: _.extend({
        'keypress input[name="memvalue"]': 'onKeyPress',
        'click :button.query': 'onSearch',
        'click :button.readcard02': 'onReadCard'
    }, _JsL.EditPanel.View.prototype.events),
    getReadTemplate: function () {
        return [
            '<div style="display:inline;background:#efefef;padding:1px 10px; border:1px solid #ccc;">',
                '卡号：<label class="b" name="cardno">{1}</label>',
                '&nbsp;&nbsp;姓名：<label class="b" name="name">{1}</label>',
                '&nbsp;&nbsp;手机：<label class="b" name="phone">{1}</label>',
                '&nbsp;&nbsp;级别：<label class="b" name="level">{1}</label>',
            '</div>'
        ].join(''); //todo, resources
    },
    getEditTemplate: function () {
        return [
          '<div  style="margin-right:10px;">查询：',
            '<input class="input m" name="memvalue" type="text" id="txtSearch" />',
            '&nbsp;&nbsp;<input id="btnSearch" class="blueBtn query" type="button" value="查询" />',
            '&nbsp;&nbsp;<input id="btnSearch" class="blueBtn readcard02" type="button" value="读卡" />&nbsp;&nbsp;',
             (this.model.get("cardno") && this.model.get("cardno").length > 0) ? this.getReadTemplate() : '<span class="advice" name="noresult"></span>',
          '</div>'
        ].join('');
    },
    onKeyPress: function (event) {
        if (event.keyCode == 32)
            return false;
    },
    onSearch: function (event) {
        var key = this.model.get("memvalue"),
            context = this;
        if (!key||$.trim(key).length==0) return;
        $.get(context.model.get("vip_search_url"), { queryType: 'CC02', searchKey: context.model.get("memvalue") }, function (d) {
            if (d.Success) {
                context.showSearchResult.call(context, d);
            }
        }, 'json');
    },
    onReadCard: function (event) {
        var reader = new StaffCardReader(null, function () {
            alert('读卡器错误');
        });
        var s = reader.readMemberCard();
        if (!s) {
            alert('读卡未成功');
            return;
        }
        this.model.set({ memvalue: s });
        this.onSearch();
    },
    showSearchResult: function (d) {
        var data = typeof d.Data === 'string' ? JSON.parse(d.Data) : d.Data;
        if (data.length == 0) {
            return;
        }
        this.model.set({
            cardno: data[0].MemberId,
            name: data[0].MemberName,
            phone: data[0].Mobile,
            level: data[0].CardName,
            leveltype: data[0].CardType,
            noresult: !data[0].MemberId ? '无相关数据!' : ''
        });
    }
});
//#endregion

//#region 公司会员
var mockcol = [{ CardSno: '22912', MemberName: 'xx公司', Email: 'sdfd@12.com', Type: '14' },
    { CardSno: '22912', MemberName: 'xx公司', Email: 'sdfd@12.com', Type: '14' },
    { CardSno: '22912', MemberName: 'xx公司', Email: 'sdfd@12.com', Type: '14' }]
_JsL.Haiyou.Reservation.CustomerCategory.CC03.Model = _JsL.Haiyou.Reservation.CustomerCategory.Model.extend({
    defaults: _.extend({
        curmode:false,
        memvalue: '',
        cardno: '',
        name: '',
        email: '',
        type:'',
        typeval: '',
        noresult: ''
    }, _JsL.Haiyou.Reservation.CustomerCategory.Model.prototype.defaults),
    initialize: function () {
        _JsL.Haiyou.Reservation.CustomerCategory.Model.prototype.initialize.call(this);
    },
    configSub: function () {
        var cd = this.get("cdata");
        if (!cd || typeof cd.CardNo === 'undefined')
            return;
        this.set({
            memvalue:cd.CardNo,
            cardno: cd.CardNo, name: cd.CompanyName, email: !cd.MemberEmail ? '' : cd.MemberEmail,
            type: !cd.BookerName ? '' : cd.BookerName, typeval: cd.BookerLevel
        });
    },
    getDataModel: function () {
        return {
                CustomerCategory: {
                    CusCategoryID: "CC03",
                    BookerLevel: this.get("typeval"),
                    CardNo: this.get("cardno"),
                    CompanyName: this.get("name"),
                    MemberName: this.get("name"),
                    MemberEmail: this.get("email")
                }
        };
    },
    isEmpty: function () {
        return !this.get("cardno");
    }
});

_JsL.Haiyou.Reservation.CustomerCategory.CC03.View = _JsL.EditPanel.View.extend({
    model: _JsL.Haiyou.Reservation.CustomerCategory.CC03.Model,
    initialize: function () {
        _JsL.EditPanel.View.prototype.initialize.call(this);
        this.model.on('change:cardno', this.render, this);
        this.model.on('change:curmode', this.alterBtnStatus, this);
    },
    events: _.extend({
        'click :button': 'onSearch'
    }, _JsL.EditPanel.View.prototype.events),
    getReadTemplate: function () {
        return [
            '<div style="display:inline;background:#efefef;padding:1px 10px; border:1px solid #ccc;" class="companyInfoContent">',
                '卡号: <label class="b" name="cardno"></label>',
                '&nbsp;&nbsp;公司: <label class="b" name="name"></label>',
                '&nbsp;&nbsp;Email: <label class="b" name="email"></label>',
                '&nbsp;&nbsp;级别: <label class="b" name="type"></label>',
            '</div>'
        ].join(''); //todo, resources
    },
    getEditTemplate: function () {
        return [
          '<div  margin-right:10px;">查询：',
            '<input class="input m" name="memvalue" type="text" id="txtSearch" />',
            '&nbsp;&nbsp;<input id="btnSearch" class="blueBtn" type="button" value="查询" />',
             (this.model.get("cardno") && this.model.get("cardno").length > 0) ? this.getReadTemplate() : '<span class="advice" name="noresult"></span>',
          '</div>'
        ].join('');
    },
    onSearch: function (event) {
        var key = this.model.get("memvalue"),
             context = this;
        if (!key || $.trim(key).length == 0) return;
        if (this.model.get("curmode")) //若现在是查询状态返回
            return;
        this.model.set({ curmode: true });
        $.get(context.model.get("cvip_search_url"), { queryType: 'CC03', searchKey: context.model.get("memvalue") }, function (d) {
            if (d.Success) {
                context.showSearchResult.call(context, d);
                context.model.set({ curmode: false });
            }
        }, 'json');
    },
    alterBtnStatus: function () {
        if (this.model.get("curmode")) {
            this.$el.find(':button.blueBtn').attr('disabled', 'disabled').val('查询中...');
        }
        else {
            this.$el.find(':button.blueBtn').removeAttr('disabled').val('查询');
        }
    },
    showSearchResult: function (d) {
        var data = typeof d.Data === 'string' ? JSON.parse(d.Data) : d.Data;
        var tgt = $('<div></div>'),
            context = this;
        if (!data || data.length == 0) {
            context.model.set({
                cardno: '',
                noresult: '无相关数据!'
            });
            return;
        }
        if (data.length == 1) {
            context.model.set({
                cardno: data[0].CardSno, name: data[0].MemberName, email: data[0].Email,
                type: data[0].CardName, typeval: data[0].CardType,
                noresult: !data[0].CardSno ? '无相关数据!' : ''
            });
        }
        else {
            tgt.setTemplate(this.popUpTemplate());
            tgt.processTemplate(data);
            tgt.dialog({
                width: '458px',
                isModal: true,
                isCenter: false,
                isShowTitle: false,
                isNearTrigger: true,
                triggerElement: context.$el.find('input[name="memvalue"]'),
                isFixed: false
            });
            tgt.find('tbody tr').bind('click', function () {
                context.model.set({
                    cardno: $(this).find('td:eq(0)').text(), name: $(this).find('td:eq(1)').text(), email: $(this).find('td:eq(2)').text(),
                    type: $(this).find('td:eq(3)').text(), typeval: $(this).find('td:eq(3)').attr('typeval'),
                    noresult: ''
                });
                tgt.dialog('close');
            });
        }
    },
    popUpTemplate: function () {
        return [
            '<table cellspacing="0" class="tbBase" style="width:100%">',
                '<thead>',
                    '<tr>',
                        '<th>卡号</th>',
                        '<th>公司</th>',
                        '<th>Email</th>',
                        '<th>级别</th>',
                    '</tr>',
                '</thead>',
                '<tbody>',
                '{#foreach $T as row}',
                    '<tr>',
                        '<td>{$T.row.CardSno}</td>',
                        '<td>{$T.row.MemberName}</td>',
                        '<td>{$T.row.Email}</td>',
                        '<td typeval="{$T.row.CardType}" >{$T.row.CardName}</td>',
                    '</tr>',
                '{#/for}',
                '</tbody>',
           '</table>'

        ].join('');
    }
});
//#endregion

//#region 中介/旅行社

_JsL.Haiyou.Reservation.CustomerCategory.CC04.Model = _JsL.Haiyou.Reservation.CustomerCategory.Model.extend({
    defaults: _.extend({
        curmode: false,
        memvalue: '',
        cardno: '',
        name: '',
        cardlevel:'',
        noresult: ''
    }, _JsL.Haiyou.Reservation.CustomerCategory.Model.prototype.defaults),
    initialize: function () {
        _JsL.Haiyou.Reservation.CustomerCategory.Model.prototype.initialize.call(this);
    },
    configSub: function () {
        var cd = this.get("cdata");
        if (!cd || typeof cd.BookerID === 'undefined')
            return;
        this.set({ memvalue: cd.BookerID, cardno: cd.BookerID, name: cd.CompanyName, cardlevel: cd.BookerLevel });
    },
    getDataModel: function () {
        return {
                CustomerCategory: {
                    CusCategoryID: "CC04",
                    BookerID: this.get("cardno"),
                    BookerLevel: this.get("cardlevel"),
                    CompanyName: this.get("name")
                }
        };
    },
    isEmpty: function () {
        return !this.get("cardno");
    }
});
_JsL.Haiyou.Reservation.CustomerCategory.CC04.View = _JsL.EditPanel.View.extend({
    model: _JsL.Haiyou.Reservation.CustomerCategory.CC04.Model,
    initialize: function () {
        _JsL.EditPanel.View.prototype.initialize.call(this);
        this.model.on('change:cardno', this.render, this);
        this.model.on('change:curmode', this.alterBtnStatus, this);
    },
    events: _.extend({
        'click :button': 'onSearch'
    }, _JsL.EditPanel.View.prototype.events),
    getReadTemplate: function () {
        return [
            '<div style="display:inline;background:#efefef;padding:1px 10px; border:1px solid #ccc;" class="midInfoContent">',
                '&nbsp;&nbsp;编号: <label class="b" name="cardno"></label>',
                '&nbsp;&nbsp;名称: <label class="b" name="name"></label>',
            '</div>'
        ].join(''); //todo, resources
    },
    getEditTemplate: function () {
        return [
          '<div  margin-right:10px;">查询：',
            '<input class="input m" name="memvalue" type="text" id="txtSearch" />',
            '&nbsp;&nbsp;<input id="btnSearch" class="blueBtn" type="button" value="查询" />',
             (this.model.get("cardno") && this.model.get("cardno").length > 0) ? this.getReadTemplate() : '<span class="advice" name="noresult"></span>',
          '</div>'
        ].join('');
    },
    onSearch: function (event) {
        var key = this.model.get("memvalue"),
             context = this;
        if (!key || $.trim(key).length == 0) return;
        if (this.model.get("curmode")) //若现在是查询状态返回
            return;
        this.model.set({ curmode: true });
        $.get(context.model.get("mid_search_url"), { queryType: 'CC04', searchKey: context.model.get("memvalue") }, function (d) {
            if (d.Success) {
                context.showSearchResult.call(context, d);
                context.model.set({ curmode: false });
            }
        }, 'json');
    },
    alterBtnStatus: function () {
        if (this.model.get("curmode")) {
            this.$el.find(':button.blueBtn').attr('disabled', 'disabled').val('查询中...');
        }
        else {
            this.$el.find(':button.blueBtn').removeAttr('disabled').val('查询');
        }
    },
    showSearchResult: function (d) {
        var data = typeof d.Data === 'string' ? JSON.parse(d.Data) : d.Data;
        var tgt = $('<div></div>'),
            context = this;
        if (!data || data.length == 0) {
            context.model.set({
                cardno: '',
                noresult: '无相关数据!'
            });
            return;
        }
        if (data.length == 1) {
            context.model.set({
                cardno: data[0].AgentID, name: data[0].AgentName,cardlevel:  data[0].AgentLevel,
                noresult: !data[0].AgentID ? '无相关数据!' : ''
            });
        }
        else {
            tgt.setTemplate(this.popUpTemplate());
            tgt.processTemplate(data);
            tgt.dialog({
                width: '458px',
                isModal: true,
                isCenter: false,
                isShowTitle: false,
                isNearTrigger: true,
                triggerElement: context.$el.find('input[name="memvalue"]'),
                isFixed: false
            })
            tgt.find('tbody tr').bind('click', function () {
                context.model.set({
                    cardno: $(this).find('td:eq(0)').text(), name: $(this).find('td:eq(1)').text(), cardlevel: $(this).find('td:eq(0)').attr("level"),
                    noresult: ''
                });
                tgt.dialog('close');
            });
        }
    },
    popUpTemplate: function () {
        return [
            '<table cellspacing="0" class="tbBase" style="width:100%">',
                '<thead>',
                    '<tr>',
                        '<th>卡号</th>',
                        '<th>公司</th>',
                    '</tr>',
                '</thead>',
                '<tbody>',
                '{#foreach $T as row}',
                    '<tr>',
                        '<td level="{$T.row.AgentLevel}">{$T.row.AgentID}</td>',
                        '<td>{$T.row.AgentName}</td>',
                    '</tr>',
                '{#/for}',
                '</tbody>',
           '</table>'

        ].join('');
    }
});
//#endregion

//#endregion

//#region 联系人信息
_JsL.Haiyou.Reservation.Contact.Model = _JsL.Haiyou.Reservation.CustomerCategory.CC01.Model.extend({
    configSub: function () { }
});

_JsL.Haiyou.Reservation.Contact.View = _JsL.Haiyou.Reservation._JsLEditPanel.View.extend({
    model: _JsL.Haiyou.Reservation.Contact.Model,
    initialize: function () {
        _JsL.Haiyou.Reservation._JsLEditPanel.View.prototype.initialize.call(this);
    },
    events: _.extend({
        'keypress input[name="phone"]': 'onPhoneKeyPress'
    }, _JsL.Haiyou.Reservation._JsLEditPanel.View.prototype.events),
    getSheetModel: function () {
        return this.model.getContactModel();
    },
    saveData: function (as) {
        var d = $.extend({}, { OrderId: this.model.get("orderid") }, this.model.getDataModel()),
            context = this;
        $.post(context.model.get("save_url"), $.param({ jsonStr: JSON.stringify(d) }),
            function (d) {
                if (!d || !d.Success || d.IsException) { //error or fail
                    alert('保存出错：' + d.ResultMsg) //todo , fail ops
                }
                else {
                    context.model.set({ "isEdit": false });
                    if (typeof context.onAfterSave === 'function')
                        context.onAfterSave(d.Data);
                }
            }, 'json');
    },
    getReadContent: function () {
        return [
            '姓名：', this.model.get("memname"),
            ' &nbsp;&nbsp;&nbsp;手机：', this.model.get("phone"),
        ].join('');
    },
    getEditContent: function () {
        return [
            '姓名：<input name="memname"  class="input m" type="text" />&nbsp;&nbsp;',
            '手机：<input name="phone"  type="text" class="input" />',
        ].join('');
    },
    onPhoneKeyPress: function (event) {
        var keynum = (event.which) ? event.which : event.keyCode;
        if (keynum < 48 || keynum > 57)
            return false;
    }
});
//#endregion

//#region 入住信息
_JsL.Haiyou.Reservation.CheckInfo.data = {
    rcpTypeOptions: [
                           { "type": "RcpType01", "name": "正常" },
                            { "type": "RcpType05", "name": "时租4小时" },
                            { "type": "RcpType052", "name": "时租2小时" },
                            { "type": "RcpType053", "name": "时租3小时" },
                            { "type": "RcpType055", "name": "时租5小时" },
                            { "type": "RcpType056", "name": "时租6小时" },
                            { "type": "RcpType059", "name": "时租9小时" },
                            { "type": "RcpType06", "name": "自用" },
                            { "type": "RcpType07", "name": "免费" }

    ],
    assureTypeOptions: [
                           { "type": "N", "name": "普通预订" },
                           { "type": "M", "name": "前台担保" },
                           { "type": "X", "name": "信用担保" }
    ],
    assureTypePayOptions: [
                           {"type":"A","name":"首夜预付"},
                           {"type":"B","name":"全额预付"},
                           {"type":"C","name":"特惠房"}
    ],
    timeOptions: [
	'<option value="00:00">00:00</option>',
	'<option value="00:30">00:30</option>',
	'<option value="01:00">01:00</option>',
	'<option value="01:30">01:30</option>',
	'<option value="02:00">02:00</option>',
	'<option value="02:30">02:30</option>',
	'<option value="03:00">03:00</option>',
	'<option value="03:30">03:30</option>',
	'<option value="04:00">04:00</option>',
	'<option value="04:30">04:30</option>',
	'<option value="05:00">05:00</option>',
	'<option value="05:30">05:30</option>',
	'<option value="06:00">06:00</option>',
	'<option value="06:30">06:30</option>',
	'<option value="07:00">07:00</option>',
	'<option value="07:30">07:30</option>',
	'<option value="08:00">08:00</option>',
	'<option value="08:30">08:30</option>',
	'<option value="09:00">09:00</option>',
	'<option value="09:30">09:30</option>',
	'<option value="10:00">10:00</option>',
	'<option value="10:30">10:30</option>',
	'<option value="11:00">11:00</option>',
	'<option value="11:30">11:30</option>',
	'<option value="12:00">12:00</option>',
	'<option value="12:30">12:30</option>',
	'<option value="13:00">13:00</option>',
	'<option value="13:30">13:30</option>',
	'<option value="14:00">14:00</option>',
	'<option value="14:30">14:30</option>',
	'<option value="15:00">15:00</option>',
	'<option value="15:30">15:30</option>',
	'<option value="16:00">16:00</option>',
	'<option value="16:30">16:30</option>',
	'<option value="17:00">17:00</option>',
	'<option value="17:30">17:30</option>',
	'<option value="18:00">18:00</option>',
	'<option value="18:30">18:30</option>',
	'<option value="19:00">19:00</option>',
	'<option value="19:30">19:30</option>',
	'<option value="20:00">20:00</option>',
	'<option value="20:30">20:30</option>',
	'<option value="21:00">21:00</option>',
	'<option value="21:30">21:30</option>',
	'<option value="22:00">22:00</option>',
	'<option value="22:30">22:30</option>',
	'<option value="23:00">23:00</option>',
	'<option value="23:30">23:30</option>'
    ].join('')
};

_JsL.Haiyou.Reservation.CheckInfo.Model = _JsL.Haiyou.Reservation.CustomerCategory.Model.extend({
    defaults: _.extend({
        s_bill:'',
        s_type: 'RcpType01',
        s_asstype: 'N',
        s_arrtime: '00:00',
        s_deptime: '00:00',
        s_clname: '',
        s_key:''
    }, _JsL.Haiyou.Reservation.CustomerCategory.Model.prototype.defaults),
    initialize: function () {
        _JsL.Haiyou.Reservation.CustomerCategory.Model.prototype.initialize.call(this);
    },
    //configSub: function () {
    //    var cd = this.get("cdata");
    //    if (!cd)
    //        return;
    //    this.set({ s_type: cd.RcpnType, s_asstype: cd.AssType, s_arrtime: cd.ArrTimeHM, s_deptime: cd.KeepTimeHM });
    //},
    getDataModel: function () {
        return {
            RcpnType: this.get("s_type"),
            AssType: this.get("s_asstype"),
            ArrTimeHM: this.get("s_arrtime"),
            KeepTimeHM: this.get("s_deptime"),// todo 
            AuthValue: this.get("s_clname"),
            Reson: this.get("s_key")
            //todo, 等把这个对象放到context里
        };
    }
});

_JsL.Haiyou.Reservation.CheckInfo.View = _JsL.Haiyou.Reservation._JsLEditPanel.View.extend({
    model: _JsL.Haiyou.Reservation.CheckInfo.Model,
    initialize: function () {
        _JsL.Haiyou.Reservation._JsLEditPanel.View.prototype.initialize.call(this);
    },
    events: _.extend({

    }, _JsL.Haiyou.Reservation._JsLEditPanel.View.prototype.events),
    getSheetModel: function () {
        return this.model.getDataModel();
    },
    getReadContent: function () {
        return [
            '入住类型：<select name="s_type" disabled="disabled" >', this.createRcpType(), '</select> <span class="checkin-reason"></span>',
            '&nbsp;&nbsp; 担保方式：<select disabled="disabled" name="s_asstype" >', this.createAssType(), '</select>',
            '&nbsp;&nbsp;<span class="restime"> 预抵时间：<select disabled="disabled" name="s_arrtime">', _JsL.Haiyou.Reservation.CheckInfo.data.timeOptions, '</select>',
            '&nbsp;&nbsp; 保留时间：<select disabled="disabled" name="s_deptime">', _JsL.Haiyou.Reservation.CheckInfo.data.timeOptions, '</select></span>'
        ].join('');
    },
    getTitleBar: function () {
        return '<span class="orange" style="{0}">提醒：{1}</span>'.format(!this.model.get("s_bill") ? 'display:none' : 'display:block',
          this.model.get("s_bill"));
    },
    getEditContent: function () {
        return [
            '入住类型：<select name="s_type">', this.createRcpType(), '</select><span class="checkin-reason"></span>',
            '&nbsp;&nbsp; 担保方式：<select name="s_asstype">', this.createAssType(), '</select>',
            '&nbsp;&nbsp;<span class="restime"> 预抵时间：<select name="s_arrtime">', _JsL.Haiyou.Reservation.CheckInfo.data.timeOptions, '</select>',
            '&nbsp;&nbsp; 保留时间：<select name="s_deptime">', _JsL.Haiyou.Reservation.CheckInfo.data.timeOptions, '</select></span>'
        ].join('');
    },
    createRcpType: function () {
        var l = [];
        for (var i = 0; i < _JsL.Haiyou.Reservation.CheckInfo.data.rcpTypeOptions.length; i++) {
            var item = _JsL.Haiyou.Reservation.CheckInfo.data.rcpTypeOptions[i];
            l.push("      <option value=\"" + item.type + "\">" + item.name + "</option>");
        }
        l.push("</select>");
        return l.join('');
    },
    createAssType: function () {
        var l = [];
        var assType = $.trim(this.model.get("s_asstype"));
        if (assType != "") {
            for (var i = 0; i < _JsL.Haiyou.Reservation.CheckInfo.data.assureTypePayOptions.length; i++) {
                var item = _JsL.Haiyou.Reservation.CheckInfo.data.assureTypePayOptions[i];
                if (item.type == assType) {
                    l.push("     <option  value=\"" + item.type + "\">" + item.name + "</option>");
                    return l.join('');
                }
            }
        }
        for (var i = 0; i < _JsL.Haiyou.Reservation.CheckInfo.data.assureTypeOptions.length; i++) {
            var item = _JsL.Haiyou.Reservation.CheckInfo.data.assureTypeOptions[i];
            l.push("     <option  value=\"" + item.type + "\">" + item.name + "</option>");
        }

        return l.join('');
    },
    setModelVal: function (c, k, t) {
        this.model.set({ s_clname: c, s_key: k, s_type: t });
    }, //from out call 
    saveData: function (as) {
        var d = $.extend({}, { OrderId: this.model.get("orderid") }, this.model.getDataModel()),
            context = this;
        $.post(context.model.get("save_url"), $.param({ jsonStr: JSON.stringify(d) }),
            function (d) {
                if (!d || !d.Success || d.IsException) { //error or fail
                    alert('保存出错：' + d.ResultMsg) //todo , fail ops
                }
                else {
                    context.model.set({ "isEdit": false });
                    if (typeof context.onAfterSave === 'function')
                        context.onAfterSave(d.Data);
                }
            }, 'json');
    },
    afterRender: function (d) {
        this.superclass.afterRender.call(this, d);
        this.trigger('onAfterRender', this);
    }
});
//#endregion

//#region 选房信息
_JsL.Haiyou.Reservation.AssignControl.Model = _JsL.Haiyou.Reservation.CustomerCategory.Model.extend({
    defaults: _.extend({
        s_arrdate: '',
        s_days: 1,
        s_depdate: '',
        hideDetail:false,
        s_nosendmsg: false,
        s_autoprint:true,
        choose_src: '',
        detail_src: '',
        building_src: '',
        floor_src: '',
        feature_src: '',
        orderid: ''
    }, _JsL.Haiyou.Reservation.CustomerCategory.Model.prototype.defaults)
});
_JsL.Haiyou.Reservation.AssignControl.View = _JsL.Haiyou.Reservation._JsLEditPanel.View.extend({
    model: _JsL.Haiyou.Reservation.AssignControl.Model,
    initialize: function () {
        _JsL.Haiyou.Reservation._JsLEditPanel.View.prototype.initialize.call(this);
    },
    saveData: function (as) {
        var context = this,
            md;
        if (typeof this.currentView.getSheetModel === 'function')
            md = $.extend({}, { OrderId: this.model.get("orderid") }, this.currentView.getSheetModel());
        if (!md)
            return;
        if (!this.currentView.checkValid()) {
            alert('选房日期有误,请核实');
            return;
        }
        $.post(context.model.get("save_url"), $.param({ jsonStr: JSON.stringify(md) }),
            function (d) {
                if (!d || !d.Success || d.IsException) { //error or fail
                    alert('保存出错：' + d.ResultMsg) //todo , fail ops
                }
                else {
                    context.currentView.$el.dialog('close');
                    if (typeof context.onAfterSave === 'function')
                        context.onAfterSave(md);
                }
            }, 'json');

    },
    getReadContent: function () {
        return [
            '入住日期：<span name="s_arrdate"></span>&nbsp;&nbsp; 天数：<span name="s_days"></span> &nbsp;&nbsp; ',
            '离店日期：<span name="s_depdate"></span>&nbsp;&nbsp;',
            '<input type="checkbox" id="chkIsSendMsg" name="s_nosendmsg" /> <label for="chkIsSendMsg">不发送预订确认短消息</label> &nbsp;&nbsp;&nbsp;&nbsp;',
            '<input type="checkbox" id="chkIsAutoPrint" name="s_autoprint"/> <label for="chkIsAutoPrint">自动打印入住登记单</label> <br/>',
            this.getSubTemplate()
        ].join('');
    },
    editPanel: function () {
        var context = this;
        if (this.currentView)
            this.currentView.unbind();
        this.currentView = new _JsL.Haiyou.Reservation.AssignRoomCtrl.View({
            el: $('<div stype="padding:10px;"></div>'),
            model: new _JsL.Haiyou.Reservation.AssignRoomCtrl.Model({
                config: { url: '', method: 'GET' },
                hideDetail:this.model.get("hideDetail"),
                s_arrdate: this.model.get("s_arrdate"),
                s_days: this.model.get("s_days"),
                s_depdate: this.model.get("s_depdate"),
                choose_src: this.model.get("choose_src"),
                detail_src: this.model.get("detail_src"),
                building_src: this.model.get("building_src"),
                floor_src: this.model.get("floor_src"),
                feature_src: this.model.get("feature_src")
            })
        });
        this.currentView.bind('onSearch', function (callback, obj) {
            context.trigger('onSearch', callback, obj);
        });
        //this.currentView.bind('onSearch', function (callback, obj) {
        //    if (!context.model.get("orderid"))
        //        return;
        //    var dt = { OrderId: context.model.get("orderid") };
        //    if (typeof callback === 'function')
        //        callback.call(obj, dt);
        //});
        this.currentView.$el.dialog({
            width: '825px',
            isDraggable: true,
            title: '修改选房信息'
        });
        this.currentView.render();

        var placeholder = this.currentView.$el.find('.op-placeholder');
        if (placeholder.length > 0)
            placeholder.append(' <input type="button" class="blueBtn" value="保存" /> ').click(function () {
                context.saveData();
            });
    },
    getSubTemplate: function () {
        return [
           '<div class="block" style="width:400px;">',
            '<table class="tbBase">',
            '<thead>',
                '<tr>',
                    '<th>已定间数</th>',
                    '<th>房型</th>',
                    '<th>可订数</th>',
                    '<th>可住数</th>',
                    '<th>均价</th>',
                '</tr>',
            '</thead>',
            '<tbody>',
            '{#foreach $T as row}',
                '<tr>',
                    '<td>{$T.row.RoomCountReserved}</td>',
                    '<td>{$T.row.RoomTypeName}</td>',
                    '<td>{$T.row.SumBooking}</td>',
                    '<td>{$T.row.SumCheckingIn}</td>',
                    '<td><a href="javascript:;" rtype="{$T.row.RoomTypeCode}">￥{$T.row.AveragePrice}<a></td>',
                '</tr>',
            '{#/for}',
            '</tbody>',
        '</table>',
       '</div>'].join('');
    },
    mockTable: function () {
        var mockdata = [{ DayNum: 1, RoomTypeName: '大床房', RoomCountReserved: 50, SumBooking: 12, AveragePrice: 239 }];
        var tgt = $('<div></div>');
        tgt.setTemplate(this.getSubTemplate());
        tgt.processTemplate(mockdata);
        return tgt.html();
    },
    afterRender: function (d) {// for mock data, temp use
        var arr = [],
            context = this;
        $.each(d, function (i, n) {
            var obj = context.$el.find('a[rtype="' + n.RoomTypeCode + '"]'),
                subarr = [];
            if (n.BizDayPrices) {
                if (obj.length == 0)
                    return;
                $.each(n.BizDayPrices, function (i, n) {
                    subarr.push({ p: n.Price, d: n.BizDay });
                });
                obj.priceToolTip({ data: subarr });
            }
        });
        this.superclass.afterRender.call(this, d);
        //$.each(this.$el.find('td a'), function (i, n) {
        //    $(n).attr('data', '[{p:380,d:new Date(2014,2,12,0,0,0,0)},{p:381,d:new Date(2014,2,13,0,0,0,0)},{p:382,d:new Date(2014,2,14,0,0,0,0)},{p:385,d:new Date(2014,2,15,0,0,0,0)},{p:388,d:new Date(2014,2,16,0,0,0,0)},{p:488,d:new Date(2014,2,17,0,0,0,0)}]');
        //    $(n).priceToolTip();
        //});

    },
    formatData: function (d) {
        if (d.Success) {
            if (typeof d.Data === 'string')
                return JSON.parse(d.Data);
            return d.Data;
        }
    }
});
//#endregion
