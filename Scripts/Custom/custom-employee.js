﻿$.ns('_JsL.Employee');


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
            '<table class="listView">',
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
