// Jquery Extender v1.0.0
// (c) 2013 Jason Liu
// Use For Common Sence Needs Extender
// Distributed Under MIT License


(function(f){
	if(typeof f === 'function'){
		f($,_,Backbone);
	}		
}(function($,_,Backbone){
	//common plugins check
	if(!$)
		throw 'Import Jquery First!';
	if(!_)
		throw 'Import Underscore';
	if(!Backbone)
		throw 'Import Backbone';
	
	if($.namespace)
		$.prenamespace = $.namespace;
	_.extend($,{
		namespace: function(){
			var o,d;
			$.each(arguments, function(i,n){
				d = n.split('.');
				o = window[d[0]] = window[d[0]] || {};
				$.each(Array.prototype.slice.call(d,1),function(si,sn){
					o = o[sn] = o[sn] || {};
				})
			})
			return o;
		}
	});
	
	$.ns = $.namespace;
}))
