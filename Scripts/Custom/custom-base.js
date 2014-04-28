$.ns('_JsL', '_JsL.Component', '_JsL.PopWindow', '_JsL.List','_JsL.Grid', '_JsL.Pagination', '_JsL.Tree', '_JsL.Panel', '_JsL.EditPanel',
    '_JsL.Panel.Col');
//#region Uti
_JsL.Util = {
    debugMode: true,
    rootPath: _JsL.rootPath || (function () {
        var strFullPath = window.document.location.href;
        var strPath = window.document.location.pathname;
        var pos = strFullPath.indexOf(strPath);
        var prePath = strFullPath.substring(0, pos);
        var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
        _JsL.rootPath = prePath + postPath;
    })(),
    ajaxCall: function (o, callback, error) {
        $.ajax({
            type: o.method,
            url: o.url,
            data: o.method == 'GET' ? o.parms : JSON.stringify(o.parms), //todo, get ,post need different format
            async: o.async,
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (res) {
                if (typeof callback === 'function') {
                    callback(res);
                }
            },
            error: function () {
                if (typeof error === 'function') {
                    for (var i in e)
                    {
                        console.log(i + "|" + e[i]);
                    }
                    error('Ajax call error : ' + e.responseText);
                }
            }
        });
    },
    sortJson: function (src, key, asc) {
        var d = src;
        if (key != undefined && d) {
            d = d.sort(function (a, b) {
                if (a[key] == null && b[key] == null) {
                    return 0;
                } else if (a[key] == null) {
                    return asc ? 1 : -1;
                } else if (b[key] == null) {
                    return asc ? -1 : 1;
                }
                if (a[key] == "" && b[key] == "") {
                    return 0;
                } else if (a[key] == "") {
                    return asc ? 1 : -1;
                } else if (b[key] == "") {
                    return asc ? -1 : 1;
                }
                if (asc)
                    return (a[key] > b[key]);
                else
                    return (b[key] > a[key]);
            });
        }
        return d;  
    },
    arrayIndexOf: function (arr, s) {
        var result = false;
        $.each(arr, function (n, i) {
            if ($.trim(this) == $.trim(s)) {
                result = true;
            }
        });
        return result;
    },
    formateString: function (s) {
        if (s.length == 0 || s == 'null')
            return "";
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    },
    formateDate: function (t, f) {
        var dt = t;
        if (dt == null)
            return '';
        if (typeof dt === 'string') {
            if (dt == '')
                return '';
            try {
                dt = new Date(parseInt(t.substr(6)));
            } catch (err) {

            }
            if (!dt || dt.getFullYear() == 1970)
                return t.substr(0, 10);
        }
        if (dt instanceof Date)
            d = dt;
        else
            d = Date.parse(dt);
        if (!dt)
            return t;
        var f = f || 'yyyy-MM-dd';

        if (dt && dt.getFullYear() <= 1980)
            return '';

        var o = {
            "M+": dt.getMonth() + 1, //month
            "d+": dt.getDate(),    //day
            "h+": dt.getHours(),   //hour
            "m+": dt.getMinutes(), //minute
            "s+": dt.getSeconds(), //second
            "q+": Math.floor((dt.getMonth() + 3) / 3),  //quarter
            "S": dt.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(f))
            f = f.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(f))
            f = f.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        return f;
        //return dt.toString(f);
    },
    convertDate:function(stringdate){ //convert 2000-1-1 format date to date obj
        // Internet Explorer does not like dashes in dates when converting, 
        // so lets use a regular expression to get the year, month, and day 
            var DateRegex = /([^-]*)-([^-]*)-([^-]*)/;
        var DateRegexResult = stringdate.match(DateRegex);
        var DateResult;
        var StringDateResult = "";

        // try creating a new date in a format that both Firefox and Internet Explorer understand
        try
        {
            DateResult = new Date(DateRegexResult[2]+"/"+DateRegexResult[3]+"/"+DateRegexResult[1]);
        } 
        // if there is an error, catch it and try to set the date result using a simple conversion
        catch(err) 
        { 
            DateResult = new Date(stringdate); 
        }

        // format the date properly for viewing
        StringDateResult = (DateResult.getMonth()+1)+"/"+(DateResult.getDate()+1)+"/"+(DateResult.getFullYear());

        return StringDateResult;
    },
    getCurrentYear: new Date().getFullYear(),
    getCurrentMonth: new Date().getMonth() + 1,
    getTextInColByKey: function (col, key) {
        if (!col)
            return;
        var retval = '';
        $.each(col, function (i, n) {
            if (n.ValueField == key) {
                retval = n.TextField;
                return false;
            }
        });
        return retval;
    },
    replaceBr: function (s) {
        if (s)
            return s.replace(/\n/g, '<br/>');
    },
    printMsg: function (msg) {
        if (console !== 'undefined')
            console.log(msg);
    },
    getRelativePos: function (src, objX, objY) {
        var srcposition = function (el) {
            var SL = 0, ST = 0;
            var is_div = /^div$/i.test(el.tagName);
            if (is_div && el.scrollLeft)
                SL = el.scrollLeft;
            if (is_div && el.scrollTop)
                ST = el.scrollTop;
            var r = { x: el.offsetLeft - SL, y: el.offsetTop - ST };
            if (el.offsetParent) {
                var tmp = srcposition(el.offsetParent);
                r.x += tmp.x;
                r.y += tmp.y;
            }
            return r;
        }
        var r = srcposition(src);
        var x = typeof (objX) == "number" ? objX + r.x + src.offsetWidth + "px" : r.x + "px";
        var y = typeof (objY) == "number" ? objY + r.y + src.offsetHeight + "px" : r.y + "px";
        return { x: x, y: y };
    },
    getWindowCenter: function (obj, windw) {
        var x = Math.max(0, (($(windw).width() - $(obj).outerWidth()) / 2) + $(windw).scrollLeft()) + "px";
        var y = Math.max(0, (($(windw).height() - $(obj).outerHeight()) / 2) + $(windw).scrollTop()) + "px";
        return { x: x, y: y }
    },
    getGuid:function(){
        var S4 = function () {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        
    }
}
$U = Pms.Util;
//#endregion

//#region _JsL.Component
_JsL.Component.Model = Backbone.Model.extend({
    defaults: {
        config: {}
    },
    initialize: function () {
        this.superclass = this.constructor.__super__;
    },
    getConfig: function () {
        return this.get("config") || {
            method: 'GET',
            url: '',
            parms: '',
            async: true
        }
    }
});

_JsL.Component.View = Backbone.View.extend({
    model: _JsL.Component.Model,
    initialize: function () {
        this.superclass = this.constructor.__super__;
        _.bindAll(this, 'show', 'hide', 'close', 'enable', 'disable', 'render', 'beforeRender', 'visualize', 'getTemplate',
            'getTemplate', 'setTempParameter');

    },
    setupTemplate: function () {
        this.$el.setTemplate(this.getTemplate());
        this.setTempParameter();
    },
    show: function () {
        this.$el.show();
    },
    hide: function () {
        this.$el.hide();
    },
    enable: function () { },
    disable: function () { },
    close: function () {
        this.$el.unbind();
        this.stopListening();
    },
    render: function () {
        this.setupTemplate();
        this.beforeRender();
    },
    beforeRender: function () {
        var context = this;
        if (!this.model.get("config").url) {
            this.visualize(!$.isEmptyObject(this.model.get("data")) ? this.model.get("data") : null);
        }
        else {
            Pms.Util.ajaxCall(this.model.getConfig(), function (d) {
                var fd = context.formatData(d);
                context.visualize(fd);
            }, function (e) {
                Pms.Util.printMsg('Error on BeforeRender:' + e);
                throw e;
            });
        }
    },
    formatData: function (d) {
        var returndata = d;
        switch ($U.platformMode) {
            case 'WebForm':
                if (d.d && typeof d.d === 'string') {
                    d = $.parseJSON(d.d);
                }
                else {
                    d = $.parseJSON(d);
                }
                break;
            case 'MVC':
                break;
            default:
                break;
        }
        
        return returndata;
    },
    visualize: function (d) {
        try {
            this.$el.processTemplate(d);
            if (this.afterRender && typeof this.afterRender === 'function') {
                this.afterRender(d);
            }
        }
        catch (err) {
            Pms.Util.printMsg('Error on visualize : ' + err);
            throw err;
        }
    },
    getTemplate: function () { },
    getSubTemplate: function () { },
    setTempParameter: function () {
        this.$el.setParam('formateString', _JsL.Util.formateString);
        this.$el.setParam('formateDate', _JsL.Util.formateDate);
    }
})
//#endregion

//#region _JsL.PopupWindow
_JsL.PopWindow.Model = _JsL.Component.Model.extend({
    defaults: _.extend({
        pos_x: 0,
        pos_y: 0,
        mask: false
    }, _JsL.Component.Model.prototype.defaults),
    initialize: function () {
        _JsL.Component.Model.prototype.initialize.call(this);
        this.computePos();
    },
    callBase: function () {
        this.superclass.getConfig.call(_.rest(arguments));
    },
    computePos: function () { }
});

_JsL.PopWindow.View = _JsL.Component.View.extend({
    model: _JsL.PopWindow.Model,
    initialize: function () {
        _JsL.Component.View.prototype.initialize.call(this);
        _.bindAll(this, 'showWindow', 'hideWindow');
    },
    showWindow: function () {
        if (!this.$el.css('position') || this.$el.css('position') != 'absolute') {
            this.$el.css('position', 'absolute');
        }
        this.$el.css("left", this.model.get("pos_x"));
        this.$el.css("top", this.model.get("pos_y"));
        this.$el.show();
    },
    hideWindow: function () {
        this.hide();
        this.close();
    }
});
//#endregion

//#region _JsL.List
_JsL.List.Model = _JsL.Component.Model.extend({
    defaults: _.extend({

    }, _JsL.Component.Model.prototype.defaults),
    initialize: function () {
        _JsL.Component.Model.prototype.initialize.call(this);
    },
    callBase: function () {
        this.superclass.getConfig.call(_.rest(arguments));
    }
});

_JsL.List.View = _JsL.Component.View.extend({
    model: _JsL.List.Model,
    initialize: function () {
        _JsL.Component.View.prototype.initialize.call(this);
        _.bindAll(this, 'selectItem');
    },
    selectItem: function (d) { }
});
//#endregion

//#region _JsL.Pagination
_JsL.Pagination.Model = _JsL.List.Model.extend({
    defaults: _.extend({
        show_paging: false,
        first_show_page: true,
        page_container: '',
        items_per_page: 5,
        num_display_entries: 1,
        current_page: 0,
        num_edge_entries: 2,
        link_to: "###",
        prev_text: "Ç°Ò³",
        next_text: "ºóÒ³",
        ellipse_text: "...",
        prev_show_always: true,
        next_show_always: true,
        renderer: "defaultRenderer",
        cls: "pagination"
    }, _JsL.List.Model.prototype.defaults),
    initialize: function () {
        _JsL.List.Model.prototype.initialize.call(this);
    },
    callBase: function () {
        this.superclass.getConfig.call(_.rest(arguments));
    }
});

_JsL.Pagination.View = _JsL.List.View.extend({
    model: _JsL.Pagination.Model,
    initialize: function () {
        _JsL.List.View.prototype.initialize.call(this);
        _.bindAll(this, 'selectItem');
    },
    afterRender: function (d) {
        this.showPaging(d);
        this.trigger('cusomAfterRender', d);
    },
    showPaging: function (d) {
        var context = this;
        if (d && this.model.get("show_paging") && this.model.get("first_show_page")) {
            this.model.set({ first_show_page: false });
            var container = $(this.model.get("page_container"));
            container.pagination(d.length,
                {
                    items_per_page: this.model.get("items_per_page"),
                    num_display_entries: this.model.get("num_display_entries"),
                    current_page: this.model.get("current_page"),
                    num_edge_entries: this.model.get("num_edge_entries"),
                    link_to: this.model.get("link_to"),
                    prev_text: this.model.get("prev_text"),
                    next_text: this.model.get("next_text"),
                    ellipse_text: this.model.get("ellipse_text"),
                    prev_show_always: this.model.get("prev_show_always"),
                    next_show_always: this.model.get("next_show_always"),
                    renderer: this.model.get("renderer"),
                    cls: this.model.get("cls"),
                    callback: function (p, j) {
                        context.pageSelect(p, j, d);
                    }
                });
        }
    },
    pageSelect: function (pageindex, jq, d) {
        var max_elem = Math.min((pageindex + 1) * this.model.get("items_per_page"), d.length);
        var newarr = new Array();
        var j = 0;
        for (var i = pageindex * this.model.get("items_per_page") ; i < max_elem; i++) {
            newarr[j] = d[i];
            j++;
        }
        this.visualize(newarr);
    }
});
//#endregion

//#region _JsL.Grid
_JsL.Grid.Model = _JsL.Component.Model.extend({
    defaults: _.extend({
        paging: false,
        sort: false
    }, _JsL.Component.Model.prototype.defaults),
    initialize: function () {
        _JsL.Component.Model.prototype.initialize.call(this);
    }
});

_JsL.Grid.View = _JsL.Component.View.extend({
    model: _JsL.Grid.Model,
    events: _.extend({
        'click .sort .up': 'ascend',   //todo,sort css
        'click .sort .down': 'descend',
        'click tbody tr': 'onRowClick',
        'mouseenter tbody tr': 'onMouseEnter',
        'mouseleave tbody tr':'onMouseLeave'
    }, _JsL.Component.View.prototype.events),
    initialize: function () {
        _JsL.Component.View.prototype.initialize.call(this);
    },
    ascend: function () {

    },
    descend: function () {

    },
    onRowClick: function (e) {
        $.each(this.$el.find('tbody tr'), function (i, n) {
            if (n != e.currentTarget && $(n).hasClass('select')) {
                $(n).removeClass('select');
            }
        });
        $(e.currentTarget).addClass('select');
    },
    onMouseEnter: function (e) {
        $(e.currentTarget).addClass('active');
    },
    onMouseLeave: function (e) {
        $(e.currentTarget).removeClass('active');
    },
    onSelect: function () {

    }
});
//#endregion

//#region _JsL.Tree
_JsL.Tree.Model = _JsL.Component.Model.extend({
    defaults: _.extend({
        tconfig: {},
        ids: '',
        title: '',
        pid: '',
        deepest: 3 //deepest level, if 2 means : 0->father, 1->son
    }, _JsL.Component.Model.prototype.defaults),
    initialize: function () {
        _JsL.Component.Model.prototype.initialize.call(this);
    }
});

_JsL.Tree.View = _JsL.Component.View.extend({
    model: _JsL.Tree.Model,
    initialize: function () {
        _JsL.Component.View.prototype.initialize.call(this);
        //_.bindAll(this,'');
    },
    afterRender: function (d) {
        var ele = $('<ul></ul>'),
            levelarr = [],
            inarr = [],
            context = this,
            li_template = '<li id="{0}"><a href="javascript:;">{1}</a></li>',
            id, pid, title, initOpenId = -1;
        for (var i = 0; i < this.model.get("deepest") ; i++) {
            $.each(d, function (i, n) {
                id = parseInt(n[context.model.get("ids")]);
                pint = parseInt(n[context.model.get("pid")]);
                title = n[context.model.get("title")];
                if ($.inArray(id, inarr) != -1)
                    return;
                if (pint == 0) {
                    ele.append($(_JsL.Util.formateString(li_template, id, title)));
                    inarr.push(id);
                    initOpenId = initOpenId == -1 ? id : initOpenId;
                }
                else {
                    var parnt = ele.find(_JsL.Util.formateString('li[id="{0}"]', pint));
                    if (parnt.length == 0) { //if parent node not exists
                    }
                    else {
                        var ulele = parnt.find('ul');
                        if (ulele.length > 0) { //already has nodes
                            ulele.append($(_JsL.Util.formateString(li_template, id, title)));
                        }
                        else {
                            parnt.first('a').append($('<ul>' + _JsL.Util.formateString(li_template, id, title) + '</ul>'));
                        }
                        inarr.push(id);
                    }
                }
            });
        }
        this.$el.append(ele);
        this.initTree(initOpenId);
    },
    initTree: function (initid) {
        this.$el.jstree(this.model.get("tconfig"))
        .bind('loaded.jstree', function (e, d) {
        });
    }
});
//#endregion

//#region _JsL.Panel
_JsL.Panel.Model = _JsL.Component.Model.extend({
    defaults: _.extend({
        m_id: 0,
        readonly: false
    }, _JsL.Component.Model.prototype.defaults),
    initialize: function () {
        _JsL.Component.Model.prototype.initialize.call(this);
    },
    callBase: function () {
        this.superclass.getConfig.call(_.rest(arguments));
    }
});

_JsL.Panel.View = _JsL.Component.View.extend({
    model: _JsL.Panel.Model,
    initialize: function () {
        _JsL.Component.View.prototype.initialize.call(this);
    },
    show: function () {

    },
    remove: function () {
        this.$el.remove();
    }
});
//#endregion

//#region _JsL.EditPanel
_JsL.EditPanel.Model = _JsL.Panel.Model.extend({
    defaults: _.extend({
        isEdit: false,
        save_url: '',
        del_url: ''
    }, _JsL.Panel.Model.prototype.defaults),
    initialize: function () {
        _JsL.Panel.Model.prototype.initialize.call(this);
    }
});

_JsL.EditPanel.View = _JsL.Panel.View.extend({
    model: _JsL.EditPanel.Model,
    _modelBinder: undefined,
    initialize: function () {
        _JsL.Panel.View.prototype.initialize.call(this);
        this.model.bind('change:isEdit', this.render, this);
        this._modelBinder = new Backbone.ModelBinder();
        this.cache = {};
    },
    events: _.extend({
        'click .panel-edit': 'editPanel',
        'click .panel-delete': 'deletePanel',
        'click .panel-save': 'savePanel',
        'click .panel-cancel': 'cancelPanel'
    }, _JsL.Panel.View.prototype.events),
    getTemplate: function () {
        if (!this.model.get("isEdit")) {
            return this.getReadTemplate();
        }
        else {
            return this.getEditTemplate();
        }
    },
    reBindCache: function () {
        this.cache.src_model = new _JsL.WorkExp.Model(this.model.attributes);
    },
    getYear: function () {
        if (!this.cache.year) {
            var ys = '';
            for (var i = 1970; i < (new Date()).getFullYear() + 1; i++) {
                ys += String.format('<option value="{0}">{0}</option>', i);
            }
            this.cache.year = ys;
        }
        return this.cache.year;
    },
    editPanel: function () {
        this.reBindCache(); 
        this.model.set({ "isEdit": true });
    },
    deletePanel: function () {
        if (confirm('Are you sure to delete')) {
            this.delData();
        }
    },
    delData: function () {
        var context = this;
        _JsL.Util.ajaxCall({
            url: context.model.get("del_url"), method: 'POST', parms: $.param({ id: context.model.get("m_id") })
        }, function (d) {
            if (d.d > 0) {//³É¹¦
                context.remove();
            }
        }, function (e) {
            _JsL.Util.printMsg('Error on Delete Date : message is ' + e);
        });
    },
    savePanel: function (async) {
        if (this.validatePanel()) {
            this.saveData(async);
        }
    },
    validatePanel: function () {
        var focusone;
        $.each(this.$el.find('.required'), function (i, n) {
            if ($(n).val().length == 0) {
                $(n).addClass('alert');
                if (!focusone)
                    focusone = n;
            }
        });
        $.each(this.$el.find('.Double-Check'), function (i, n) {
            if (isNaN(parseFloat($(n).val()))) {
                $(n).addClass('alert');
                if (!focusone)
                    focusone = n;
            }
        });
        if (!focusone)
            return true;
        else {
            focusone.focus();
            return false;
        }
    },
    saveData: function (async) {
        var context = this;
        _JsL.Util.ajaxCall({
            url: context.model.get("save_url"), method: 'POST', async: async || true, parms: context.model.getParams()
        }, function (d) {
            if (d.d > 0) {
                context.model.set({ "isEdit": false, m_id: d.d });
            }
        }, function (e) {
            
        });
    },
    cancelPanel: function () { 
        if (this.model.get("m_id") == 0) {
            this.remove();
            return;
        }
        this.restoreModel();
        this.model.set({ "isEdit": false });
    },
    restoreModel: function () {
    },
    beforeRender: function () {
        this.visualize();
    },
    afterRender: function (d) {
        if (this.getBinds && typeof this.getBinds === 'function') {
            var bindings = this.getBinds(); 
            this._modelBinder.bind(this.model, this.el, bindings);
        }
        else {
            this._modelBinder.bind(this.model, this.el);
        }
      
    }
})
//#endregion

//#region _JsL.Panel.Col
_JsL.Panel.Col.Model = _JsL.Panel.Model.extend({
    defaults: _.extend({
        v_collections: [],
        v_class: _JsL.EditPanel.View,
        p_id: 0 //¼¯ºÏid
    }, _JsL.Panel.Model.prototype.defaults),
    initialize: function () {
        _JsL.Panel.Model.prototype.initialize.call(this);
    }
});

_JsL.Panel.Collection = Backbone.Collection.extend({
    model: _JsL.Panel.Col.Model
});

_JsL.Panel.Col.View = _JsL.Component.View.extend({
    model: _JsL.Panel.Col.Model,
    collection: _JsL.Panel.Collection,
    initialize: function () {
        _JsL.Component.View.prototype.initialize.call(this);
        _.bindAll(this, 'saveCollection', 'checkEditCollection');
        this.collection = new _JsL.Panel.Collection();
        this.collection.bind('add', this.onAddPanel, this);
        this.collection.bind('remove', this.onRemovePanel, this);
    },
    events: _.extend({
        'click a.panel-add': 'addPanel'
    }, _JsL.Component.View.prototype.events),
    getTemplate: function () {
        return [
             '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="layout">',
                '<tr class="panel-footer" ', (this.model.get("readonly") ? ' style="display:none"' : ''), '>',
                    '<td><a href="javascript:;" class="addmore panel-add">Add</a></td>',
                '</tr>',
             '</table>'
        ].join('');
    },
    onAddPanel: function (m) {
        var tel = $('<tr class="panel-dynamic"><td style="padding-top: 0;" class="panel-container"></td></tr>');
        this.$el.find('table tr.panel-footer').before(tel);
        var v = new (this.model.get("v_class"))({
            el: tel.find('td.panel-container'),
            model: m
        });
        v.render();
        this.model.get("v_collections").push(v);
    },
    onRemovePanel: function (d) {
    },
    saveCollection: function (async) {
        var context = this;
        this.collection.each(function (n) {
            if (n.get("isEdit")) {
                var arr = context.model.get("v_collections");
                _.find(arr, function (m) { return m.model == n; }).savePanel(async);
            }
        });
    },
    checkEditCollection: function () {
        var context = this,
            flag = true;
        this.collection.each(function (n) {
            if (n.get("isEdit")) {
                flag &= false;
            }
        });
        return flag;
    }
})

//#endregion