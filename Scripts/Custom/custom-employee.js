$.ns('_JsL.Employee');


_JsL.Employee.View = _JsL.Pagination.View.extend({
    initialize: function () {
        _JsL.Pagination.View.prototype.initialize.call(this);
        _.bindAll(this, 'selectTitle');
	},
	events:_.extend({
	    'click td.user-name a':'selectTitle'
	}, _JsL.Pagination.View.prototype.events),
	getTemplate: function(){
		return [
            '<table class="listView">',                '<tr style="color: #1e486e">',                    '<th style="width: 10%; font-weight: bold" class="sortable">',                        'NO.',                    '</th>',                    '<th style="width: 30%; font-weight: bold" class="sortable" key="real_name">',                        '姓名',                    '</th>',                    '<th style="width: 30%; font-weight: bold" class="sortable" key="gender">',                        '年龄',                    '</th>',                    '<th style="width: 30%; font-weight: bold" class="sortable" key="gender">',                        '提交日期',                    '</th>',                '</tr>',                '{#foreach $T as row}',                '<tr>',                    '<td>{$T.row$index+1}</td>',                    '<td class="user-name" ><a href="javascript:;" pid="{$T.row.id}">{$P.formateString($T.row.EmpName)}</a></td>',                    '<td>{$P.formateString($T.row.Age)}</td>',                    '<td>{$P.formateDate($T.row.UpdateDate)}</td>',                '</tr>',                '{#/for}',            '</table>'
		].join('');
	},	
	selectItem : function(e){	
	    var pid = $(e.currentTarget).attr('pid');
	    console.log('click a item :' + pid);
	},
	selectTitle: function (e) {
	    var empname = $(e.currentTarget).text();
	    console.log('----_____-----title selected ' + empname);
	}
	
})

