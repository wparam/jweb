
$.ns('_JsL.Haiyou.Room.RoomContainer', '_JsL.Haiyou.Room.RoomMap', '_JsL.Haiyou.Room.RoomCell', '_JsL.Haiyou.Room.Floor',
    '_JsL.Haiyou.Room.RoomStatusChart', '_JsL.Haiyou.Room.RoomQuantitiveTable');
//选房控件需要用到JqueryUI库
//
//

//#region RoomContainer
_JsL.Haiyou.Room.RoomContainer.Model = _JsL.EditPanel.Model.extend({
    defaults: _.extend({
    }, _JsL.EditPanel.Model.prototype.defaults),
    initialize: function () {
        _JsL.EditPanel.Model.prototype.initialize.call(this);
    }
});

_JsL.Haiyou.Room.RoomContainer.View = _JsL.EditPanel.View.extend({
    model: _JsL.Haiyou.Room.RoomMap.Model,
    initialize: function () {
        _JsL.EditPanel.View.prototype.initialize.call(this);
    },
    events: _.extend({
    }, _JsL.EditPanel.View.prototype.events),
    getTemplate: function () {
        return [
            '<div id="wrapContent">',
                '<div id="listBox">',
                '</div>',
                '<div id="statusArea">',
                    '<div id="tipCon">',
                    '</div>',
                    '<div id="floorCon">Loading...</div>',
                    '<div id="roomCon"></div>',
                '</div>',
            '</div>'
        ].join(''); 
    },
    afterRender: function (d) {
        this.getQTable(d);
        this.getStatus(d);
        this.getFloor(d);
        this.getMap(d);
    },
    getQTable: function (d) {
        var context = this;
        this.tableView = new _JsL.Haiyou.Room.RoomQuantitiveTable.View({
            el: $('#listBox'),
            model: new _JsL.Haiyou.Room.RoomQuantitiveTable.Model({
                data: { "d": ["SQR,高级大床房,1,22", "DR,大床房,8,57", "TR,双床房,0,44", "STR,家庭房,2,40", "DRA,大床房A,2,15", "MQR,零压-高级大床房,0,6", "MDR,零压-大床房,0,7"] }
            })
        });
        this.tableView.bind('onChooseRoomType', function (col) {
            context.mapView.model.set({ RoomTypes: col, CurrentAct: 'RoomTypes', FeaAttr:'',StatusAttr:'' }); //roomtype不看状态
        });
        this.tableView.render();
    },
    getStatus: function (d) {
        var context = this;
        this.statusView = new _JsL.Haiyou.Room.RoomStatusChart.View({
            el: $('#tipCon'),
            model: new _JsL.Haiyou.Room.RoomStatusChart.Model({
                config: { url: '' }
            })
        });
        this.statusView.bind('onClickFeature', function (s) {
            context.mapView.model.set({ FeaAttr: s , CurrentAct : 'FeaAttr'});
        });
        this.statusView.bind('onClickStatus', function (s) {
            context.mapView.model.set({ StatusAttr: s, CurrentAct:'StatusAttr'});
        });
        this.statusView.render();
    },
    getFloor: function (d) {
        var context = this;
        this.floorView = new _JsL.Haiyou.Room.Floor.View({
            el: $('#floorCon'),
            model: new _JsL.Haiyou.Room.Floor.Model({
                config: { url: '' }
            })
        });
        this.floorView.bind('onClickFloor', function (d) {
            context.mapView.model.set({ RoomNos: d.d });
        });
        this.floorView.render();
    }, 
    getMap: function (d) {
        var d = { "d": [[{ "R": "8301", "H": "A", "S": "OC", "A": "TC", "V": "y" }, { "R": "8302", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8303", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8306", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8307", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8309", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8310", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8312", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8315", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8317", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8318", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8319", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8320", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8321", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8322", "H": "A", "S": "VD", "A": "JC", "V": "y" }, { "R": "8323", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8325", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8326", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8327", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8328", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8401", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8402", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8403", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8405", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8406", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8407", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8408", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8409", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8410", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8411", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8412", "H": "A", "S": "OD", "A": "TR", "V": "y" }, { "R": "8415", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8416", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8417", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8418", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8419", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8420", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8421", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8422", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8423", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8425", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8426", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8427", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8428", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8429", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8430", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8431", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8501", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8502", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8503", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8505", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8506", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8507", "H": "A", "S": "VD", "A": "", "V": "y" }, { "R": "8510", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8511", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8512", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8515", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8516", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8517", "H": "A", "S": "OD", "A": "GC,TC", "V": "y" }, { "R": "8518", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8520", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8521", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8522", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8523", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8525", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8526", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8527", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8528", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8529", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8530", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8531", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8601", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8602", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8603", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8605", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8606", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8607", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8608", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8609", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8610", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8611", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8612", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8615", "H": "A", "S": "OD", "A": "TR", "V": "y" }, { "R": "8616", "H": "A", "S": "OD", "A": "TW", "V": "y" }, { "R": "8617", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8618", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8619", "H": "A", "S": "OD", "A": "GC,TC", "V": "y" }, { "R": "8620", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8621", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8622", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8623", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8625", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8626", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8627", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8628", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8629", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8630", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8631", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8701", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8702", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8703", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8705", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8706", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8707", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8708", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8709", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8710", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8711", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8712", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8715", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8716", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8717", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8718", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8719", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8720", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8721", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8722", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8723", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8725", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8726", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8727", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8728", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8729", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8730", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8731", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8801", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8802", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8803", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8804", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8805", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8806", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8807", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8808", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8809", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8810", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8811", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8812", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8813", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8814", "H": "A", "S": "VD", "A": "", "V": "y" }, { "R": "8815", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8816", "H": "A", "S": "VD", "A": "", "V": "y" }, { "R": "8817", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8818", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8819", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8820", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8821", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8822", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8823", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8824", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8825", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8826", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8827", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8828", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8829", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8830", "H": "A", "S": "OC", "A": "", "V": "y" }, { "R": "8831", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8832", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8833", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8834", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8835", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8836", "H": "A", "S": "OD", "A": "GC", "V": "y" }, { "R": "8837", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8838", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8839", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8840", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8841", "H": "A", "S": "OD", "A": "TW", "V": "y" }, { "R": "8842", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8843", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8844", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8845", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8846", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8847", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8848", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8849", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8850", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8851", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8852", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8853", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8854", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "8855", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8856", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8857", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8858", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8859", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "8860", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "9101", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "9102", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "9103", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "9104", "H": "A", "S": "OD", "A": "", "V": "y" }, { "R": "9105", "H": "A", "S": "OD", "A": "RT", "V": "y" }, { "R": "9106", "H": "A", "S": "OD", "A": "", "V": "y" }], "635349714001970000"] };
        var subd = { "d": [[{ "R": "8301", "H": "A", "S": "OD", "A": "TC", "V": "y" }, { "R": "8102", "H": "A", "S": "OC", "A": "", "V": "y" }], "635349714001970000"] };
        this.mapView  = new _JsL.Haiyou.Room.RoomMap.View({
            el: $('#roomCon'),
            model: new _JsL.Haiyou.Room.RoomMap.Model({
                data: d.d[0]
            })
        });
        this.mapView .render();
    }
});

//#endregion

//#region RoomMap
_JsL.Haiyou.Room.RoomMap.Model = _JsL.Panel.Col.Model.extend({
    defaults: _.extend({
        datacollection: [],
        RoomTypes:[],
        RoomNos: [],
        CurrentAct:'', // FeaAttr or StatusAttr
        FeaAttr: '',
        StatusAttr: '' //房间状态属性
    }, _JsL.Panel.Col.Model.prototype.defaults),
    initialize: function () {
        _JsL.Panel.Col.Model.prototype.initialize.call(this);
    }
});

_JsL.Haiyou.Room.RoomMap.View = _JsL.Panel.Col.View.extend({
    model: _JsL.Haiyou.Room.RoomMap.Model,
    initialize: function () {
        _JsL.Panel.Col.View.prototype.initialize.call(this);
        this.collection.off('add', this.onAddPanel, this);
        this.collection.off('remove', this.onRemovePanel, this);
        this.model.bind('change:RoomNos change:FeaAttr change:StatusAttr change:RoomTypes', this.onShow, this);
    },
    events: _.extend({
        'mousedown .rootContainer': 'onClickRoom'
    }, _JsL.Panel.Col.View.prototype.events),
    getTemplate: function () {
        return [
        ].join(''); //todo, resources
    },
    refresh: function (col) {
        if (!col)
            return;
        var context = this;
        $.each(col, function (i, n) {
            context.addCollection(n);
        });
        this.onShow();
    },
    addCollection: function (n) {
        if (!n)
            return;
        var m = this.collection.find(function (m) { return m.get("RoomNo") == n.R; }),
            rinfo = {
                m_id: n.R,
                RoomNo: n.R,
                Attribute: n.A,
                Hall: n.H,
                Status: n.S,
                Valid: n.V
            };
        if (!m || m.length==0) {
            this.collection.push(new _JsL.Haiyou.Room.RoomCell.Model(rinfo));
        }
        else {
            m.set(rinfo);
        }
    },
    afterRender: function (d) {
        var data = this.model.get('data') || d,
            context = this;
        data = typeof data === 'string' ? JSON.parse(data) : data;
        if (data.length > 1) {
            $.each(data, function (i, n) {
                context.addCollection(n);
            });
        }
        this.onShow();
    },
    getSelected: function () {
        var roomstr = '',
            selected = this.collection.where({ IsSelected: true });
        if (selected.length > 0) {
            $.each(selected, function (i, n) {
                roomstr += (n.get("RoomNo") + ',');
            });
        }
        return roomstr;
    },
    onShow: function () {
        if (this.collection.length == 0 )
            return;
        var showresult = this.filterCollection();
        var context = this;
        this.$el.html(this.getTemplate());
        $.each(showresult, function (i,m) {
            var el = $('<div>');
            context.$el.append(el);
            var view = new _JsL.Haiyou.Room.RoomCell.View({
                el: el,
                model: m
            });
            view.bind('onBeDropped', context.onDropRoom);
            view.bind('onOver', context.onOver);
            view.render();
        });
    },
    onClickRoom: function (e) {
        var id = $(e.currentTarget).attr('id'),
            m = this.collection.find(function (m) { return m.get("m_id") == id; });
        if (!m)
            return;
        //click hide context menu
        if (e.shiftKey || e.ctrlKey) {//多选
        }
        else {
            var selected = this.collection.where({ IsSelected: true });
            if (selected.length > 0) {
                $.each(selected, function (i, n) {
                    n.set({ IsSelected: false });
                });
            }
        }
        m.set({ IsSelected: !m.get("IsSelected") });
        e.preventDefault();
        e.stopPropagation();
        return false;
    },
    onOver: function (e, u,cb) {
        if (!u.draggable || !e.target)
            return;
        var src = u.draggable.find('.rootContainer'),
            tgt = $(e.target).find('.rootContainer');
        cb.call(this, true); //判断是否可drop
        console.log('on over -> src id is :' + src.attr('id') + '; tgt is :' + tgt.attr('id'));
    },
    onDropRoom: function (e, u) {
        if (!u.draggable || !e.target)
            return;
        var src = u.draggable.find('.rootContainer'),
            tgt = $(e.target).find('.rootContainer');

        console.log('on drop -> src id is :' + src.attr('id') + '; tgt is :' + tgt.attr('id'));
    },
    filterCollection: function () {
        //todo
        return this.doFilter();
    },
    doFilter: function () {
        var result = this.collection.models,
            context = this,
            roomnos = this.model.get("RoomNos");
        //1:RoomNos
        if (roomnos.length > 0) {
            result = this.collection.models.filter(function (m) { return _.contains(roomnos, m.get("RoomNo")); });
        }
        if (!result || result.length == 0)
            return result;
        //2:feature and status
        if (this.model.get("CurrentAct") == 'FeaAttr') {
            var s = _.filter(result, function (m) { return _.contains(m.get("FeaAttr"), context.model.get("FeaAttr")); });
            result = s;
        }
        else if (this.model.get("CurrentAct") == 'StatusAttr') {
            var s = _.filter(result, function (m) {  return m.get("StatusAttr")==context.model.get("StatusAttr"); });
            result = s;
        }
        else if (this.model.get("CurrentAct") == 'RoomTypes') {
            var roomtypenos = context.model.get("RoomTypes");
            if (roomtypenos.length > 0) {
                var s = _result = this.collection.models.filter(function (m) { return _.contains(roomtypenos, m.get("RoomNo")); });
                result = s;
            }
        }
        else{}
        
        return result;
    }
});

//#endregion

//#region RoomCell
_JsL.Haiyou.Room.RoomCell.Model = _JsL.EditPanel.Model.extend({
    defaults: _.extend({
        IsSelected:false,
        HotelId: '',//看是否用得到
        Hall: '',//看是否用得到
        RoomNo: '',
        Attribute: '',
        StatusAttr: '', //房间状态属性
        FeaAttr:[], //房间特征属性, 可以多选的, 像团队, 今日将到等
        Status: '',
        Valid: '',
        Url_Receive: '',
        Url_ToolTip:''
    }, _JsL.EditPanel.Model.prototype.defaults),
    initialize: function () {
        _JsL.EditPanel.Model.prototype.initialize.call(this);
    }
});

_JsL.Haiyou.Room.RoomCell.View = _JsL.EditPanel.View.extend({
    model: _JsL.Haiyou.Room.RoomCell.Model,
    initialize: function () {
        _JsL.EditPanel.View.prototype.initialize.call(this);
        this.initAttributes();
        this.model.on('change', this.render, this);
    },
    initAttributes: function () {
        var fa = [],
            attr = (this.model.get("Attribute") || '').replace(/,,/g, ",").replace(/^,/g, "").replace(/,$/g, ""); //去脏	
        var col = attr.split(',');
        if(!col || col.length==0)
            return;
        $.each(col, function (i, n) {
            fa.push(n.toLowerCase());
        });
        this.model.set({
            StatusAttr: this.model.get("Status") != "ED" ? this.model.get("Status").toLowerCase() : "od",
            FeaAttr:fa
        });
    },
    events: _.extend({
        'dblclick .rootContainer': 'onDbClick',
        'contextmenu .rootContainer': 'onContextMenu',
        'mouseenter .rootContainer': 'onMouseOver',
        'mouseleave .rootContainer': 'onMouseOut'
    }, _JsL.EditPanel.View.prototype.events),
    getTemplate: function () {
        var classname = this.model.get("Status") != "ED" ? this.model.get("Status").toLowerCase() : "od";
        if (this.model.get("Valid").toLowerCase() == 'y') {
            return [
                '<div id="', this.model.get("m_id"), '" class="rootContainer ', classname, (this.model.get("IsSelected") ? 'at ' : ''), '">',
                    this.getSubTemplate(),
                '</div>'].join('');
        } else {
            return ''; //TODO:原方法里好像没用到这里
        }
    },
    getSubTemplate: function () {
        var ALL_Index = "GC,TR,RT",
            attr = this.model.get("Attribute") || '',
            subDom = [
               '<p class="h"><samp>',this.model.get("RoomNo"),'</samp>',
			      '<span class="@TW" ></span>',
			      '<span class="@ALL" ></span>',
               '</p>',
               '<p class="f">',
			      '<span class="@JC" ></span>',
                  '<span class="@LR" ></span>',
			      '<span class="@TC" ></span>',
                  '<span class="@JO" ></span>',
               '</p>'
            ].join('');
        attr = attr.replace(/,,/g, ",").replace(/^,/g, "").replace(/,$/g, ""); //去脏	
        var attrArr = attr.split(',');
        for (var i = 0; i < attrArr.length; i++) {
            attrArr[i] = $.trim(attrArr[i]);
            if (attrArr[i] != "") {
                if (ALL_Index.indexOf(attrArr[i]) < 0) {
                    subDom = subDom.replace('@' + attrArr[i], attrArr[i].toLowerCase());
                } else {
                    subDom = subDom.replace('@ALL', attrArr[i].toLowerCase());
                }
            }
        }
        return subDom;
    },
    afterRender: function (d) {
        var context = this;
        if (!this.model.get("IsSelected") && this._rightMenu && this._rightMenu.is(":visible"))
            this._rightMenu.hide(); //处理点击隐藏上次的
        if (this.isDraggable()) {
            this.$el.draggable({
                revert: true,
                zIndex: 100
            });
        }
        if (this.isDroppable()) {
            this.$el.droppable({
                //hoverClass: "ui-state-hover",
                drop: function (event, ui) {
                    context.onBeDropped.call(context, event, ui);
                },
                over: function (event, ui) {
                    context.onOver.call(context, event, ui);
                },
                out: function (event, ui) {
                    context.onOut.call(context, event, ui);
                }
            });//drag and dropable
        }
        this.superclass.afterRender.call(this, d);
    },
    onOver: function (event, ui) {
        var context = this;
        this.trigger('onOver', event, ui, function (flag) {
            if (flag) {
                console.log('a');
                context.$el.addClass('oddrop');
            }
        });
    },
    onOut: function (event, ui) {
        if (this.$el.hasClass('oddrop'))
            this.$el.removeClass('oddrop');
    },
    onBeDropped: function (event, ui) {
        this.trigger('onBeDropped', event,  ui );
    },
    onDbClick:function(e){
        //window.location.href = "RoomTransfer.aspx?type=detail&&hotelId=" + HOTEL_ID + "&roomNo=" + this.id.replace("r", "");
    },
    onContextMenu: function (e) {
        this.initContextMenu();
        this.showContextMenu(e);
        e.preventDefault();
        return false;
    },
    initContextMenu: function () {
        var context = this;
        this._rightMenu = $("#rightMenu", window.document.body);
        if (this._rightMenu.length == 0)
            this._rightMenu = $('<div id="rightMenu"></div>');
        $(window.document.body).append(this._rightMenu).bind('click', function (e) {
            context._rightMenu.hide();
        });
        //干净c,空v,脏d,在住o 房间
        this._cRoom = "VC,OK,OC"; //干净
        this._vRoom = "VC,OK,VD,V_C"; //空房
        this._dRoom = "OD,O_D,ED,VD,V_C"; //脏房
        this._oRoom = "OC,OD,O_D,ED";	//在住

        this._resItem = '<a href="../Reservation/Detail.aspx?hotelId={0}&roomNo={1}">散客预订</a>';
        this._recItem = '<a href="../Reservation/Detail.aspx?hotelId={0}&roomNo={1}">散客入住</a>';

        this._billItem = '<a href="javascript:priPopup(\'RoomTransfer.aspx?type=billDeal&hotelId={0}&roomNo={1}\',\'账务处理\',\'960\',\'660\')">账务处理</a>';
        this._addBillItem = '<a href="javascript:priPopup(\'RoomTransfer.aspx?type=billAdd&hotelId={0}&roomNo={1}\',\'快速入账\',\'800\',\'450\')">快速入账</a>';

        this._msgItem = '';
        this._unionItem = '<a href="javascript:priPopup(\'RoomTransfer.aspx?type=linkRoom&hotelId={0}&roomNo={1}\',\'设置联房\',\'800\',\'600\')">设置联房</a>';

        this._cleanItem = '<a href="javascript:priPopup(\'SetRoomStatus.aspx?set=clean&hotel={0}&rooms={1}\',\'设置房态\',\'650\',\'450\',\'yes\')">设置干净房</a>';
        this._checkItem = '<a href="javascript:priPopup(\'SetRoomStatus.aspx?set=ok&hotel={0}&rooms={1}\',\'设置房态\',\'650\',\'450\',\'yes\')">设置检查房</a>';
        this._dirtyItem = '<a href="javascript:priPopup(\'SetRoomStatus.aspx?set=dirty&hotel={0}&rooms={1}\',\'设置房态\',\'650\',\'450\',\'yes\')">设置脏房</a>';
        this._setOOOItem = '<a href="javascript:priPopup(\'SetOOORoom.aspx?hotel={0}&rooms={1}\',\'设置房态\',\'650\',\'500\',\'yes\')">设置维修房</a>';
        this._cancelOOOItem = '<a href="javascript:cancelOOO(\'{0}\')">取消维修房</a>';
        this._setLockItem = '<a href="javascript:priPopup(\'SetLRRoom.aspx?operate=set&hotel={0}&rooms={1}\',\'设置房态\',\'650\',\'500\',\'yes\')">设置临时房</a>';
        this._cancelLockItem = '<a href="javascript:priPopup(\'SetLRRoom.aspx?operate=cancel&hotel={0}&rooms={1}\',\'设置房态\',\'650\',\'500\',\'yes\')">取消临时房</a>';

        this._detailItem = '<a href="RoomTransfer.aspx?type=detail&&hotelId={0}&roomNo={1}">在住详单</a>';
        this._logItem = '<a href="javascript:priPopup(\'RoomTransfer.aspx?type=roomLog&hotelId={0}&roomNo={1}\',\'房态日志\',\'800\',\'600\')">房态日志</a>'
    },
    showContextMenu: function (event) {
        var roomNo = this.model.get("RoomNo");
        var roomInfo = { //为沿用原代码
            HotelId: this.model.get("HotelId"), Hall: this.model.get("Hall"),
            RoomNo: this.model.get("RoomNo"), Status: this.model.get("Status"), Attribute: this.model.get("Attribute"),
            Valid: this.model.get("Valid")
        }
        this._rightMenu.html(this.buildContextMenu());
        var x = (event) ? event.clientX + $(document).scrollLeft() : this.$el.offset().left + 50;
        var y = (event) ? event.clientY + $(document).scrollTop() : this.$el.offset().top + 50;

        this._rightMenu.css("display", "");
        this._rightMenu.css("left", x);
        this._rightMenu.css("top", y);
        var context = this;
        //$(window.document).bind('mousedown', function () {
        //    context._rightMenu.hide();
        //});
    },
    hideContextMenu: function () {

    },
    buildContextMenu: function () {
        var roomInfo = { //为沿用原代码
            HotelId: this.model.get("HotelId"), Hall: this.model.get("Hall"),
            RoomNo: this.model.get("RoomNo"), Status: this.model.get("Status"), Attribute: this.model.get("Attribute"),
            Valid: this.model.get("Valid")
        }
        var menuText = '';

        //散客预订
        if (roomInfo.Status !== "OOO" && this._oRoom.indexOf(roomInfo.Status) < 0)
            menuText = this._resItem.replace("{0}", roomInfo.HotelId).replace("{1}", escape(roomInfo.RoomNo));

        //散客入住
        if (this._vRoom.indexOf(roomInfo.Status) >= 0 || roomInfo.Status == "OOO")
            menuText += this._recItem.replace("{0}", roomInfo.HotelId).replace("{1}", escape(roomInfo.RoomNo));

        if (menuText != '') menuText += '<div></div>';

        //账务处理，快速入账，宾客留言，设置联房
        if (this._oRoom.indexOf(roomInfo.Status) >= 0) {
            menuText += this._billItem.replace("{0}", roomInfo.HotelId).replace("{1}", escape(roomInfo.RoomNo));
            menuText += this._addBillItem.replace("{0}", roomInfo.HotelId).replace("{1}", escape(roomInfo.RoomNo));
            menuText += '<div></div>';
            menuText += this._msgItem.replace("{0}", roomInfo.HotelId).replace("{1}", escape(roomInfo.RoomNo));
            menuText += this._unionItem.replace("{0}", roomInfo.HotelId).replace("{1}", escape(roomInfo.RoomNo));
            menuText += '<div></div>';
        }

        //设置干净
        if (this._dRoom.indexOf(roomInfo.Status) >= 0)
            menuText += this._cleanItem.replace("{0}", roomInfo.HotelId).replace("{1}", escape(roomInfo.RoomNo));

        //设置检查
        if (roomInfo.Status == "VC")
            menuText += this._checkItem.replace("{0}", roomInfo.HotelId).replace("{1}", escape(roomInfo.RoomNo));

        //设置脏房
        if (roomInfo.Status == "OC")
            menuText += this._dirtyItem.replace("{0}", roomInfo.HotelId).replace("{1}", escape(roomInfo.RoomNo));

        //设置维修
        if (this._vRoom.indexOf(roomInfo.Status) >= 0)
            menuText += this._setOOOItem.replace("{0}", roomInfo.HotelId).replace("{1}", escape(roomInfo.RoomNo));

        //取消维修
        if (roomInfo.Status == "OOO")
            menuText += this._cancelOOOItem.replace("{0}", escape(roomInfo.RoomNo));

        //设置临时
        if (this._vRoom.indexOf(roomInfo.Status) >= 0 && (roomInfo.Attribute == null || roomInfo.Attribute.indexOf("LR") < 0))
            menuText += this._setLockItem.replace("{0}", roomInfo.HotelId).replace("{1}", encodeURI(roomInfo.RoomNo));

        //取消临时
        if (roomInfo.Attribute == null || roomInfo.Attribute.indexOf("LR") >= 0)
            menuText += this._cancelLockItem.replace("{0}", roomInfo.HotelId).replace("{1}", encodeURI(roomInfo.RoomNo));

        //在住详单
        menuText += '<div></div>';

        if (this._oRoom.indexOf(roomInfo.Status) >= 0)
            menuText += this._detailItem.replace("{0}", roomInfo.HotelId).replace("{1}", encodeURI(roomInfo.RoomNo));

        //房态日志
        menuText += this._logItem.replace("{0}", roomInfo.HotelId).replace("{1}", escape(roomInfo.RoomNo));

        return menuText;
    },
    initToolTip: function (d) {
        var dt = { "d": [{ "RoomTypeName": "家庭房STR", "OOOSpan": null, "OOOReason": null, "HotelID": "6100413", "Hall": "A", "RoomNo": "8523" }, []] };//mock data
        var dt1 = {
            "d": [{ "RoomTypeName": "双床房TR", "OOOSpan": null, "OOOReason": null, "HotelID": "6100413", "Hall": "A", "RoomNo": "8319" },
                [{
                    "BillKind": "I", "BillNo": "B61004130000071538", "BillId": "C61004130000063711", "LinkRoom": "2", "Price": "249.00", "Name": "211", "Nationality": null, "CtmCategory": "正常",
                    "Arrive": "2014/4/13 13:35:23", "Leave": "2014/4/14 12:00:00", "Nights": "1"
                }]]
        };
        var context = this;
        this._tipPanel = $("#tipPanel", window.document.body);
        if (this._tipPanel.length == 0)
            this._tipPanel = $('<div id="tipPanel"></div>');
        $(window.document.body).append(this._tipPanel);
        var dt = typeof dt1 === 'string' ? JSON.parse(dt1) : dt1;
        this.buildToolTip(dt.d[0],dt.d[1]);
    },
    showToolTip: function (room, panel) {
        if (this._tipPanel) {
            this._tipPanel.empty();
        }
        var tipX =  this.$el.offset().left ;
        var tipY = this.$el.offset().top;
        this._tipPanel.html(panel);
        this._tipPanel.css("left", tipX - 240);
        this._tipPanel.css("top", tipY + 2);
        this._tipPanel.fadeIn("fast", function () { setTimeout('$("#tipPanel").fadeOut("slow")', 6000); });
    },
    buildToolTip: function (room, list) {
        var panel = "";
        if (!list) {
            panel = "<center><span>房间暂无入住和预订信息！</span></center>";
        } else {
            var item = '<p>@Title：<span>@No</span></p>'
                     + '<p>房价：@Price</p>'
                     + '<p>姓名：<span>@Name</span></p>'
                     + '<p>国家：@Coutry</p>'
                     + '<p>联房：@LinkRoom间</p>'
                     + '<p>抵达：@Arrive</p>'
                     + '<p>预离：@Leave</p><div class="line"></div>';
             
            $.each(list, function (i,n) {
                var itemStr = "";
                if (n.BillKind == "I") {
                    itemStr = item.replace("@Title", "在住单");
                } else {
                    itemStr = item.replace("@Title", "预订单");
                }
                panel += itemStr.replace("@No", n.BillNo).replace("@Price", n.Price)
                        .replace("@Name", n.Name).replace("@Coutry", n.Nationality)
                        .replace("@LinkRoom", n.LinkRoom).replace("@Arrive", n.Arrive)
                        .replace("@Leave", n.Leave);

            });
            if (!room) {
                panel += '<center><span>房间正在准备中！</span></center><div class="line"></div>';
            } else {
                if (room.OOOSpan) {
                    panel += '<p>维修：<span>' + room.OOOSpan + '</span></p><p>原因：<span>' + room.OOOReason + '</span></p><div class="line"></div>';
                }
                panel += '<p>房号：' + room.RoomNo + '  房型：' + room.RoomTypeName + '</p>'
            }
        }
        if (panel)
            this.showToolTip(room, panel);
    },
    isDraggable: function () {
        return true;
    },
    isDroppable: function () {
        return true;
    },
    onMouseOver: function (e) {
        //this.initToolTip() todo 先去了, 显示不利于调试
    },
    onMouseOut: function (e) {
    }
   
});
//#endregion

//#region RoomStatusChart
_JsL.Haiyou.Room.RoomStatusChart.Model = _JsL.EditPanel.Model.extend({
    defaults: _.extend({
    }, _JsL.EditPanel.Model.prototype.defaults),
    initialize: function () {
        _JsL.EditPanel.Model.prototype.initialize.call(this);
    }
});

_JsL.Haiyou.Room.RoomStatusChart.View = _JsL.EditPanel.View.extend({
    model: _JsL.Haiyou.Room.RoomMap.Model,
    initialize: function () {
        _JsL.EditPanel.View.prototype.initialize.call(this);
    },
    events: _.extend({
        'click p.attrMap span': 'onClickFeature',
        'click p.statusMap span' :'onClickStatus'
    }, _JsL.EditPanel.View.prototype.events),
    getTemplate: function () {
        return [
            '<p class="attrMap" id="attrMap">',
                '<label>团队<abbr id="gcCount">0</abbr>:</label><span id="gc" class="gc"></span>',
                '<label>今日将到<abbr id="jcCount">0</abbr>:</label><span id="jc" class="jc"></span>',
                '<label>今日将离<abbr id="joCount">0</abbr>:</label><span id="jo" class="jo"></span>',
                '<label>时租<abbr id="trCount">0</abbr>:</label><span id="tr" class="tr"></span>',
                '<label>时租超时<abbr id="rtCount">0</abbr>:</label><span id="rt" class="rt"></span>',
                '<label>临时锁<abbr id="lrCount">0</abbr>:</label><span id="lr" class="lr"></span>',
                '<label>自用房<abbr id="twCount">0</abbr>:</label><span id="tw" class="tw"></span>',
                '<label>0秒退房<abbr id="tcCount">0</abbr>:</label><span id="tc" class="tc"></span><br class="clear" />',
            '</p>',
            '<p class="statusMap" id="statusMap">',
                '<label>检查<abbr id="okCount">0</abbr>:</label><span id="ok" class="ok_m"></span>',
                '<label>空干净<abbr id="vcCount">0</abbr>:</label><span id="vc" class="vc_m"></span>',
                '<label>住干净<abbr id="ocCount">0</abbr>:</label><span id="oc" class="oc_m"></span>',
                '<label>空隔夜<abbr id="v_cCount">0</abbr>:</label><span id="v_c" class="v_c_m"></span>',
                '<label>脏房<abbr id="vdCount">0</abbr>:</label><span id="vd" class="vd_m"></span>',
                '<label>在住脏<abbr id="odCount">0</abbr>:</label><span id="od" class="od_m"></span>',
                '<label>换床单<abbr id="o_dCount">0</abbr>:</label><span id="o_d" class="o_d_m"></span>',
                '<label>维修<abbr id="oooCount">0</abbr>:</label><span id="ooo" class="ooo_m"></span><br class="clear" />',
            '</p>'
        ].join(''); //todo, resources
    },
    onClickFeature: function (e) {
        var s = $(e.currentTarget).attr('id');
        this.trigger('onClickFeature', s);
    },
    onClickStatus: function (e) {
        var s = $(e.currentTarget).attr('id');
        this.trigger('onClickStatus', s);
    }
});


//#endregion

var floor = { "d": ["03,03层|03", "04,04层|04", "05,05层|05", "06,06层|06", "07,07层|07", "08层,08层|08"] };
//#region Floor
_JsL.Haiyou.Room.Floor.Model = _JsL.EditPanel.Model.extend({
    defaults: _.extend({
        Url_GetFloor:''
    }, _JsL.EditPanel.Model.prototype.defaults),
    initialize: function () {
        _JsL.EditPanel.Model.prototype.initialize.call(this);
    }
});

_JsL.Haiyou.Room.Floor.View = _JsL.EditPanel.View.extend({
    model: _JsL.Haiyou.Room.Floor.Model,
    initialize: function () {
        _JsL.EditPanel.View.prototype.initialize.call(this);
    },
    events: _.extend({
        'click span':'onClickFloor'
    }, _JsL.EditPanel.View.prototype.events),
    getTemplate: function () {
        return [
           '<span fid="0" class="hover">全部</span>',
           '{#foreach $T as row}',
               '<span fid="{$T.row.Floor}">{$T.row.FloorTitle}</span>',
           '{#/for}',
        ].join(''); //todo, resources
    },
    onClickFloor: function (e) {
        var fid = $(e.currentTarget).attr('fid');
        if(!fid)
            return;
        $.each(this.$el.find('span'),function(i,n){
            if(e.currentTarget!=n && $(n).hasClass('hover'))
                $(n).removeClass('hover');
        });
        $(e.currentTarget).addClass('hover');
        this.getFloorRooms(fid);
    },
    beforeRender: function () { //临时用, 实际用获取地址
        var fd = this.formatData();
        this.visualize(fd);
    },
    getFloorRooms: function (fid) { //原GetFactorRooms, 返回一系列房间
        //ajax call get rooms
        var d = { "d": ["8501", "8502", "8503", "8505", "8506", "8507", "8510", "8511", "8512", "8515", "8516", "8517", "8518", "8520", "8521", "8522", "8523", "8525", "8526", "8527", "8528", "8529", "8530", "8531"] };
        var total = {"d":["8301","8302","8303","8306","8307","8309","8310","8312","8315","8317","8318","8319","8320","8321","8322","8323","8325","8326","8327","8328","8401","8402","8403","8405","8406","8407","8408","8409","8410","8411","8412","8415","8416","8417","8418","8419","8420","8421","8422","8423","8425","8426","8427","8428","8429","8430","8431","8501","8502","8503","8505","8506","8507","8510","8511","8512","8515","8516","8517","8518","8520","8521","8522","8523","8525","8526","8527","8528","8529","8530","8531","8601","8602","8603","8605","8606","8607","8608","8609","8610","8611","8612","8615","8616","8617","8618","8619","8620","8621","8622","8623","8625","8626","8627","8628","8629","8630","8631","8701","8702","8703","8705","8706","8707","8708","8709","8710","8711","8712","8715","8716","8717","8718","8719","8720","8721","8722","8723","8725","8726","8727","8728","8729","8730","8731","8801","8802","8803","8804","8805","8806","8807","8808","8809","8810","8811","8812","8813","8814","8815","8816","8817","8818","8819","8820","8821","8822","8823","8824","8825","8826","8827","8828","8829","8830","8831","8832","8833","8834","8835","8836","8837","8838","8839","8840","8841","8842","8843","8844","8845","8846","8847","8848","8849","8850","8851","8852","8853","8854","8855","8856","8857","8858","8859","8860","9101","9102","9103","9104","9105","9106"]};
        if(fid==0)
            d = total;
        this.trigger('onClickFloor', d);
    },
    formatData: function (d) {
        var nd = floor.d,// d.d,  todo , modck
            result = [];
        if (!nd || nd.length == 0)
            return;
        $.each(nd, function (i, n) {
            var s = n.split(',');
            if (!s || s.length == 0)
                return false;
            result.push({ Floor: s[0], FloorTitle: s[1] });
        });
        return result;
    }
});

//#endregion

//#region RoomQuantitiveTable
_JsL.Haiyou.Room.RoomQuantitiveTable.Model = _JsL.EditPanel.Model.extend({
    defaults: _.extend({
        RoomTypes: []
    }, _JsL.EditPanel.Model.prototype.defaults),
    initialize: function () {
        _JsL.EditPanel.Model.prototype.initialize.call(this);
    }
});

var mock = { "d": ["SQR,高级大床房,1,22", "DR,大床房,8,57", "TR,双床房,0,44", "STR,家庭房,2,40", "DRA,大床房A,2,15", "MQR,零压-高级大床房,0,6", "MDR,零压-大床房,0,7"] };
_JsL.Haiyou.Room.RoomQuantitiveTable.View = _JsL.EditPanel.View.extend({
    model: _JsL.Haiyou.Room.RoomMap.Model,
    initialize: function () {
        _JsL.EditPanel.View.prototype.initialize.call(this);
    },
    events: _.extend({
        'click input[type="checkbox"]':'onChooseRoomType'
    }, _JsL.EditPanel.View.prototype.events),
    getTemplate: function () {
        return [
            '<table class="tblAmount">',
                '<caption>楼&nbsp;&nbsp;座</caption>',
                '<thead>',
                    '<tr>',
                        '<th>选</th>',
                        '<th class="desc">描述</th>',
                        '<th>可住</th>',
                        '<th>总数</th>',
                    '</tr>',
                '</thead>',
                '<tbody id="hallAmount">',
                    //'{#foreach $T as row}', todo
                       '<tr id="A">',
                            '<td><input type="radio" name="hall" value="A" checked="checked"></td>',
                            '<td>主楼|08</td>',
                            '<td class="usable">11</td>',
                            '<td>191</td>',
                       '</tr>',
                   // '{#/for}',
                '</tbody>',
            '</table>',
            '<table class="tblAmount">',
                '<caption>房&nbsp;&nbsp;型</caption>',
                '<thead>',
                   '<tr>',
                        '<th>选</th>',
                        '<th class="desc">描述</th>',
                        '<th>可住</th>',
                        '<th>总数</th>',
                    '</tr>',
                '</thead>',
                '<tbody id="roomtypeAmount">',
                    '{#foreach $T as row}',
                        '<tr id="{$T.row.RoomType}">',
                            '<td><input type="checkbox"  rtype="{$T.row.RoomType}"  /></td>',
                            '<td>{$T.row.RoomTypeName}</td>',
                            '<td class="usable">{$T.row.Available}</td>',
                            '<td>{$T.row.Amount}</td>',
                        '</tr>',
                    '{#/for}',
                '</tbody>',
            '</table>'
        ].join(''); //todo, resources
    },
    beforeRender: function () { //临时用, 实际用获取地址
        var fd = this.formatData();
        this.visualize(fd);
    },
    formatData: function (d) {
        var nd = mock.d,// d.d,  todo , modck
            result = [];
        if (!nd || nd.length == 0)
            return;
        $.each(nd, function (i, n) {
            var s = n.split(',');
            if(!s || s.length==0)
                return false;
            result.push({ RoomType: s[0], RoomTypeName: s[1], Available: s[2], Amount: s[3] });
        });
        return result;
    },
    onChooseRoomType: function (e) {
        this.updateModel();
        //ajax get rooms use this.model.get("RoomTypes")
        
        this.trigger('onChooseRoomType', this.model.get("RoomTypes"));
    },
    updateModel: function () {
        var col = this.$el.find('input[type="checkbox"]'),
            arr = [];
        if(!col || col.length==0)
            return;
        $.each(col, function (i, n) {
            if ($(n).prop('checked')) {
                arr.push($(n).attr('rtype').toLowerCase());
            }
        });
        var d = { "d": ["8301", "8302", "8303", "8306", "8307", "8309", "8310"] };
        this.model.set({ RoomTypes: d.d });
    }
});

//#endregion

