function Info(msg, callback) {
    if ($('#Message').length > 0) { //not good , hard code to #Message
        $('#Message').dialog({
            modal: true,
            buttons: {
                "知道了": function () {
                    $(this).dialog('close');
                    if (typeof callback === 'function')
                        callback();
                }
            }
        }).find('p').text(msg);
    }
}

function Conform(msg, poscb , negcb) {
    if ($('#Message').length > 0) { //not good , hard code to #Message
        $('#Message').dialog({
            modal: true,
            buttons: {
                "确认": function () {
                    if (typeof poscb === 'function')
                        poscb();
                    $(this).dialog('close');
                },
                "取消": function () {
                    if (typeof negcb === 'function')
                        negcb();
                    $(this).dialog('close');
                }
            }
        }).find('p').text(msg);
    }
}

function getRootPath() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return (prePath + postPath);
}


//special for this web
function changeActiveMenu(){
	var subpath = window.document.location.pathname;
	var arr = subpath.split('/');
	if(arr.length==0)
		return;
	var match = false;
	$.each(arr, function(pi, pn){
		if(match) return;
		$.each($('.menu li'),function(i,n){
			if($(n).attr('data')==pn){
				$(n).addClass('current_page_item');
				match = true;
				return;
			}
			else{
				$(n).removeClass('current_page_item');
			}		
		})
	});
}
	

String.format = function () {
    if (arguments.length == 0) {
        return null;
    }
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
// 左去空格
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
}
// 右去空格
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
}
// 转换成INT数据,如果传入的是空数据，则返回0
String.prototype.toInt = function () {
    if (this.trim() == "")
        return 0;
    else
        return parseInt(this);
}

String.prototype.endsWith = function (suffix) { return this.match(suffix + "$") == suffix; };

String.prototype.removeLast = function () { return this.replace(/,*$/g, ""); }