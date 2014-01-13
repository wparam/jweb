//Js 替换字符串中的链接为<a>xx</a>包含的html超链接
function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, "<a target='_blank' href='$1'>$1</a>");
}


//Js判断字符数目, 英文数字统一算半个字符
//#region Js判断字符数目, 英文数字统一算半个字符
function trim(s) {
    return s.replace(/(\u3000|\s|\t)*$/gi, '').replace(/^(\u3000|\s|\t)*/gi, '');
}

function byteLength(b) {
    if (typeof b == "undefined") {
        return 0;
    }
    var a = b.match(/[^\x00-\x80]/g);
    return (b.length + (!a ? 0 : a.length));
}

function getLength(q, g) {
    g = g || {};
    g.max = g.max || 140;
    g.min = g.min || 41;
    g.surl = g.surl || 20;
    var p = trim(q).length;
    if (p > 0) {
        var j = g.min, s = g.max, b = g.surl, n = q;
        var r = q.match(/(http|https):\/\/[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+([-A-Z0-9a-z\$\.\+\!\_\*\(\)\/\,\:;@&=\?~#%]*)*/gi) || [];
        var h = 0;
        for (var m = 0, p = r.length; m < p; m++) {
            var o = byteLength(r[m]);
            if (/^(http:\/\/t.cn)/.test(r[m])) {
                continue;
            } else {
                if (/^(http:\/\/)+(weibo.com|weibo.cn)/.test(r[m])) {
                    h += o <= j ? o : (o <= s ? b : (o - s + b))
                } else {
                    h += o <= s ? b : (o - s + b)
                }
            }
            n = n.replace(r[m], "");
        }
        return Math.ceil((h + byteLength(n)) / 2);
    } else {
        return 0;
    }
}
//#endregion