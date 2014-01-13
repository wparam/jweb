$.ns('_JsL.Employess');


_JsL.Employess.View = _JsL.List.View.extend({
    initialize: function () {
		_JsL.List.View.prototype.initialize.call(this);
	},
	events:_.extend({
		'click li span' : 'selectTitle'
	},_JsL.List.View.prototype.events),
	getTemplate: function(){
		return [
		'<ul>',
			'{#foreach $T as row}',
				'<li><a pid="{$T.row.Id}" href="javascript:;">{$T.row$index+1}.{$T.row.EmpName}</a>({$T.row.Age})</li>',
			'{#/for}',
		'</ul>'].join('');
	},	
	selectItem : function(e){	
	    var pid = $(e.currentTarget).attr('pid');
	    console.log('click a item :' + pid);
	},
	selectTitle : function(e){
	}
	
})

