var JSLoader = function () {

    var scripts = {};

    function getScript(url) {
        var script = scripts[url];
        if (!script) {
            script = { loaded: false, funs: [] };
            scripts[url] = script;
            add(script, url);
        }
        return script;
    }

    function run(script) {
        var funs = script.funs,
            len = funs.length,
            i = 0;

        for (; i < len; i++) {
            var fun = funs.pop();
            fun();
        }
    }

    function add(script, url) {
        var scriptdom = document.createElement('script');
        scriptdom.type = 'text/javascript';
        scriptdom.loaded = false;
        scriptdom.src = url;

        scriptdom.onload = function () {
            scriptdom.loaded = true;
            run(script);
            scriptdom.onload = scriptdom.onreadystatechange = null;
        };

        //for ie
        scriptdom.onreadystatechange = function () {
            if ((scriptdom.readyState === 'loaded' ||
     scriptdom.readyState === 'complete') && !scriptdom.loaded) {

                run(script);
                scriptdom.onload = scriptdom.onreadystatechange = null;
            }
        };

        document.getElementsByTagName('head')[0].appendChild(scriptdom);
    }

    return {
        load: function (url) {
            var arg = arguments,
    len = arg.length,
    i = 1,
    script = getScript(url),
    loaded = script.loaded;

            for (; i < len; i++) {
                var fun = arg[i];
                if (typeof fun === 'function') {
                    if (loaded) {
                        fun();
                    } else {
                        script.funs.push(fun);
                    }
                }
            }
        }
    };
} ();