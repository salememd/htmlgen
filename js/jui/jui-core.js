
(function(){
    
    //=================================================================================
    // Array Start 
    //=================================================================================
    
    (function(){
        if(!Array.prototype.addFirst){
            Array.prototype.addFirst = function(value){
                this.unshift(value);
            };
        }
        if(!Array.prototype.add){
            Array.prototype.add = function(value){
                this.push(value);
            };
        }
        if(!Array.prototype.insert){
            Array.prototype.insert = function(value, index){
                if(index > this.length) index = this.length;
                if(index < 0) index = 0;
                this.splice(index,0,value);
                return index;
            };
        }
        if(!Array.prototype.indexOf){
            Array.prototype.indexOf = function(value){
                if(value == null) return -1;
                for(var i=0,l = this.length;i<l;++i) if(this[i] == value) return i;
                return -1;
            };
        }
        if(!Array.prototype.deleteItem){
            Array.prototype.deleteItem = function(index){
                if(index < 0 || index >= this.length) return false;
                this.splice(index,1);
                return true;
            };
        }
        if(!Array.prototype.getLast){
            Array.prototype.getLast = function(){
                var l = this.length;
                return l? this[l - 1] : null;
            };
        }
        if(!Array.prototype.moveLast){
            Array.prototype.moveLast = function(value){
                var i = this.indexOf(value);
                if(i > -1){ 
                    this.deleteItem(i);	
                    this.push(value); 
                }
            };
        }
        if(!Array.prototype.moveToIndex){
            Array.prototype.moveToIndex = function(value,index){
                var i = this.indexOf(value);
                if(i > -1 && i !== index){ 
                    this.deleteItem(i);	
                    this.insert(value,index); 
                }
            };
        }
        if(!Array.prototype.moveBefore){
            Array.prototype.moveBefore = function(value,beforeValue){
                var i = this.indexOf(beforeValue);
                if(i > -1){
                    this.moveToIndex(value,i);
                }
            };
        }
        if(!Array.prototype.moveFirst){
            Array.prototype.moveFirst = function(value){
                var i = this.indexOf(value);
                if(i > -1){ 
                    this.deleteItem(i);	
                    this.addFirst(value); 
                }
            };
        }
        if(!Array.prototype.remove){
            Array.prototype.remove = function(value){
                var i = this.indexOf(value);
                if(i > -1) this.splice(i,1);
                return i;
            };
        }
        if(!Array.prototype.clear){
            Array.prototype.clear = function(){
                this.splice(0,this.length);
            };
        }
        if(!Array.prototype.clone){
            Array.prototype.clone = function(){
                var clOb = [];
                for(var i=0,l=this.length;i<l;++i) clOb.push(this[i]);
                return clOb;
            };
        }
        if(!Array.prototype.forEach){
            /**
             * 
             * @param {(value, index) -> void} func 
             */
            Array.prototype.forEach = function(func){
                if(!func) return;
                for(var i=0,l=this.length;i<l;++i) func.call(this,this[i],i);
            };
        }
        if(!Array.prototype.forEachR){
            /**
             * 
             * @param {(value, index) -> void} func 
             */
            Array.prototype.forEachR = function(func){
                if(!func) return;
                for(var i=this.length-1;i>=0;--i) func.call(this,this[i],i);
            };
        }
    })();
    
    //=================================================================================
    // Array End
    //=================================================================================
    
    
})();

//============================================================
// Application Starts
//============================================================

var app = {
    
    __libraries: [],
    __lunching: false,
    baseDir: undefined,
    resources: {
        icons: {
            images: {
            },
            paths: {
            }
        }
    },
    lang: {
        lang: 'en'
    },
    /**
     * 
     * The main function that runs once the app is loaded and ready to run.
     */
    main: function () {

    },
    addEvent: function (el, evStr, func, stopPropg) {
        stopPropg = stopPropg || false;
        if (el.addEventListener)
            el.addEventListener(evStr, func, stopPropg);
        else if (el.attachEvent)
            el.attachEvent("on" + evStr, func);

    },
    removeEvent: function (el, evStr, func) {
        if (el.removeEventListener) {
            el.removeEventListener(evStr, func, true);
            el.removeEventListener(evStr, func, false);
        } else if (el.detachEvent)
            el.detachEvent("on" + evStr, func);
    },
    getScreenWidth: function () {
        var d = document, v, v2;
        if ((v = self.innerWidth)) {
            return v;
        } else if ((v = d.documentElement) && (v2 = v.clientWidth)) {
            return v2;
        } else if ((v = d.body)) {
            return v.clientWidth;
        }
        return 0;
    },
    getScreenHeight: function () {
        var d = document, v, v2;
        if ((v = self.innerHeight)) {
            return v;
        } else if ((v = d.documentElement) && (v2 = v.clientHeight)) {
            return v2;
        } else if ((v = d.body)) {
            return v.clientHeight;
        }
        return 0;
    },
    isObjectEmpty: function(obj){
        if(Object.keys){
            return Object.keys(obj).length === 0 && obj.constructor === Object;
        }
        
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return JSON.stringify(obj) === JSON.stringify({});
    },
    /**
     * @param {json} pa
     * @returns {json}
     */
    clone: function (pa) {
        var clOb = {};
        for (var p in pa)
            clOb[p] = pa[p];
        return clOb;
    },
    /**
     * Adds the attributes from src to dest. If override is set to true,
     * any properties in src that already exist in dest will be rewritten.
     * Otherwise, they will be ignored.
     * 
     * @param {json} dest
     * @param {json} src
     * @param {boolean} override (optional, default true)
     * @returns {json} dest itself.
     */
    $: function (dest, src, override) {
        override === undefined && (override = true);
        for (var p in src) {
            if (override || dest[p] === undefined)
                dest[p] = src[p];
        }
        return dest;
    },
    /**
     * @param {json} ob a json object
     * @param {(key, value) -> void} func 
     */
    forEach: function (ob, func) {
        if (!func)
            return;
        for (var p in ob) {
            if (Object.prototype[p])
                continue;
            func(p, ob[p]);
        }
    },
    _winScroll: function () {
        if (self.pageYOffset) {
            app.scrollX = self.pageXOffset;
            app.scrollY = self.pageYOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) {
            app.scrollX = document.documentElement.scrollLeft;
            app.scrollY = document.documentElement.scrollTop;
        } else if (document.body) {
            app.scrollX = document.body.scrollLeft;
            app.scrollY = document.body.scrollTop;
        }
    },
    // For now, there is no need to app function.
    _wheel: function (e) {
        var delta = 0;
        if (!e)
            e = window.event;
        if (e.wheelDelta) { /* IE/Opera. */
            delta = e.wheelDelta / 60;
        } else if (e.detail) { /** Mozilla case. */
            /** In Mozilla, sign of delta is different than in IE.
             * Also, delta is multiple of 3.
             */
            delta = -e.detail / 2;
        }
        /** If delta is nonzero, handle it.
         * Basically, delta is now positive if wheel was scrolled up,
         * and negative, if wheel was scrolled down.
         */
        var l = overCompoStack.length;
        if (delta && l) {
            for (var i = 0, c; i < l; ++i) {
                if ((c = overCompoStack[i]).scroll) {
                    c.scroll(0, -delta * 50);
                    if (e.preventDefault)
                        e.preventDefault();
                    e.returnValue = false;
                    return;
                }
            }
        }
    },
    formatStr: function (str, paramArray) {
        for (var i = 0, l = paramArray.length; i < l; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            str = str.replace(regexp, paramArray[i]);
        }
        return str;
    },
    showMessageDialog : function(mess, type, btnArray, callBack) {
        app.__messageDialog.show(mess, type, btnArray, callBack);
    },
    apply : function(pa, ca) {
        if (!ca)
            return;
        for (var i = 0, l = ca.length; i < l; ++i)
            ca[i].$(pa);
    },
    setCookie : function(c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    },
    getCookie : function(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
        return null;
    },
    setAttributes : function(el, pa) {
        for (var p in pa)
            el.setAttribute(p, pa[p]);
    },
    /**
     * 
     * @param {json} pa { <br/>
     *      url:String, <br/>
     *      method:String (POST (default) | GET), <br/>
     *      params:json, <br/>
     *      success: function(JSON | XML: response), <br/>
     *      fail: function(),<br/>
     *      type: String (XML, JSON (default)),<br/>
     *      loader: jUI.LoaderViewController, <br/>
     *      wait: Boolean (default false) if true, the call will be synchronous, otherwise, asynchronous <br/>
     *  }
     */
    ajax : function(pa) {
        if (!pa.url)
            return;
        !pa.method && (pa.method = 'POST');
        !pa.type && (pa.type = "JSON");
        !pa.params && (pa.params = {});
        !pa.success && (pa.success = null);
        !pa.wait && (pa.wait = false);
        
        var httpRequest;

        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
            httpRequest = new XMLHttpRequest();
            if (httpRequest.overrideMimeType) {
                httpRequest.overrideMimeType('text/xml');
            }
        }
        else if (window.ActiveXObject) { // IE
            try {
                httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                }
            }
        }

        if (!httpRequest)
            return false;

        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                pa.loader && pa.loader.stop();
                if (httpRequest.status === 200) {
                    app.doConnectionSucceed();
                    if(pa.success){
                        var resp = null;
                        if(pa.type === "XML"){
                            resp = httpRequest.responseXML;
                        }else{
                            resp = JSON.parse(httpRequest.responseText);
                        }
                        pa.success(resp);
                    }
                } else {
                    app.doConnectionFailed();
                    pa.fail && pa.fail();
                }
            }
        };
        var queryString = "";
        pa.params.AJAXQuery = 1;
        pa.type === "JSON" && (pa.params.JSONResponse = 1);
        for(var f in pa.params)
            queryString += "&"+f+"="+encodeURIComponent(pa.params[f]);
        pa.loader && pa.loader.play();
        httpRequest.open(pa.method, pa.url + (pa.method === 'GET'? queryString : "") , !pa.wait);
        if (pa.method === 'POST'){
            httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            httpRequest.send(queryString);
        }
        pa.type === "JSON" && httpRequest.overrideMimeType && httpRequest.overrideMimeType("application/json");
        return true;
    },
    /*
     params: array of name-value pairs.
     */
    download : function(url, params) {
        if (!url)
            return;
        var rw = window.open("", ""), d = rw.document, str;
        d.open();
        str = '<html><body><form id="FORM1" method="post" action="' + url + '&FILE=1&AJAXQuery=1">';
        for (var p in params) {
            str += '<input type="hidden" id="' + p + '" name="' + p + '" />';
        }
        str += '</form></body></html>';
        d.write(str);
        d.close();
        rw.focus();
        for (var p in params) {
            d.getElementById(p).value = params[p];
        }
        d.getElementById("FORM1").submit();
    },

    getCID : function() {
        return ++app.__CID;
    },
    _loadLibrary: function(){
        if(app.__libraries.length > 0){
            var fileref = document.createElement('script');
            fileref.setAttribute("type","text/javascript");
            fileref.setAttribute("src", app.__libraries.pop());
            fileref.onload = app._loadLibrary;
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }else{
            app.__lunching && app.main();
        }
    },
    /**
     * @param {String} lib js or css file path
     * @param {String} version
     * @param {"js" | "css"} filetype  (default "js")
     * @returns {app}
     */
    include: function(lib, version, filetype){
        var fileref,filename = lib+"?v="+version;
        filetype = filetype || "js";
        if (filetype ==="js"){ 
            app.__libraries.push(filename);
            app.__libraries.length === 1 && app._loadLibrary();
        }
        else if (filetype === "css"){ 
            fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
        return this;
    },
    /**
     * 
     * @param {String} lib the name of the library. i.e "data", "window", "components"
     * @param {String} version
     * @param {"js" | "css"} libType (default "js")
     * @returns {app}
     */
    includeJuiLib: function(lib, version,libType){
        libType = libType || "js";
        return this.include(this.baseDir+"jui-"+lib+"."+libType,version,libType);
    },

    doConnectionFailed : function() {
        app.__connSt = 0;
        app.onConnectionFailed && app.onConnectionFailed();
        app.onError && app.onError(1, "Connection failed.");
    },
    doConnectionSucceed : function() {
        app.onConnectionSucceed && app.onConnectionSucceed();
        !app._connSt && app.onConnectionResume && app.onConnectionResume();
        app._connSt = 1;
    },
    __init__: function () {

        // initializing the app.
        app.brwIE = app.brwIE8OrLess = app.brwFirefox = app.brwChrome = app.brwSafari = app.brwOpera = app.brwOthers = 0;
        app.browser = "Unknown";

        app.ctSVG = 0;
        app.brwVer = 0;
        app.dir = app.dir || "ltr";
        app.cssProps = {};
        app.screenWidth = app.getScreenWidth();
        app.screenHeight = app.getScreenHeight();
        app.rtl = app.dir == "rtl";

        app.__popupWindows = [];
        app.__windows = [];
        app.__modelWindows = [];
        app.__maxZIndex = 0;
        app.__minZIndex = 0;
        app.__currWindow = window;
        app.__messageDialog = null;
        app.__mainWindow = null;
        app.__hintTimerID = 0;
        app.__hint = null;
        app.__CID = 0;
        app.__currHintCompo = null;
        app.__connSt = "";
        app.__allowScroll = true;
        app.__lastPageWidth = app.screenWidth;
        app.__lastPageHeight = app.screenHeight;

        // Events 
        app.onConnectionFailed = null;
        app.onConnectionSucceed = null;
        app.onConnectionResume = null;
        app.onError = null; // int: Code, String: Mess.
        /*
         Error Codes: 
         1. Connection error when sending and AJAX query.
         2. PHP error.
         */

        app.__events = [
            "mouseover",
            "mousedown",
            "mouseup",
            "mousemove",
            "click",
            "mouseout",
            "keypress",
            "keyup",
            "keydown",
            "focus",
            "blur"
        ];
        /*
         app.addEvent(w,'resize',function(e){
         var wins = app.__windows;
         var len = wins.length;
         var widthDiff = (app.screenWidth = app.getScreenWidth()) - app.__lastPageWidth;
         var heightDiff = (app.screenHeight = app.getScreenHeight()) - app.__lastPageHeight;
         for(var i=0;i<len;++i){
         if(widthDiff != 0) wins[i].updateHorBounds(widthDiff);
         if(heightDiff != 0) wins[i].updateVerBounds(heightDiff);
         }
         app.__lastPageWidth = app.screenWidth;
         app.__lastPageHeight = app.screenHeight;
         });
         */

        // Initializing the browser.
        var n = navigator, doc = document;
        switch (n.appName) {
            case "Microsoft Internet Explorer":
                app.browser = "IE";
                app.brwIE = true;
                app.brwVer = +(n.userAgent.match(/MSIE (\d+\.\d+)/i)[1]);
                break;
            case "Netscape":
                if (n.userAgent.match(/Firefox/i)) {
                    app.browser = "FireFox";
                    app.brwFirefox = true;
                    app.brwVer = +(n.userAgent.match(/Firefox\/(\d+\.\d+)/i)[1]);
                } else if (n.userAgent.match(/Chrome/i)) {
                    app.browser = "Chrome";
                    app.brwChrome = true;
                    app.brwVer = +(n.userAgent.match(/Chrome\/(\d+\.\d+)/i)[1]);
                } else if (n.userAgent.match(/Version\//i)) {
                    app.browser = "Safari";
                    app.brwSafari = true;
                    app.brwVer = +(n.userAgent.match(/Version\/(\d+\.\d+)/i)[1]);
                } else {
                    app.browser = "Others";
                    app.brwOthers = true;
                    app.brwVer = 0;
                }
                break;
            case "Opera":
                app.brwOpera = true;
                app.brwVer = +(n.userAgent.match(/Version\/(\d+\.\d+)/i)[1]);
                break;
            default:
                app.brwOthers = true;
                app.brwVer = 0;
                break;
        }
        app.brwIE8OrLess = (app.brwIE && app.browserVersion < 9);
        app.cssProps.cssfloat = app.brwIE8OrLess ? "styleFloat" : "cssFloat";

        if (window.SVGAngle || doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"))
            app.ctSVG = true;
        app.mainForm = new jUI.Layout(null, document.body);
        app.__lunching = true;
        app.__libraries.length === 0 && app.main();
    },
    getStyleComputedValue: function(el, attribute){
        var val = window.getComputedStyle(el, null).getPropertyValue(attribute);
        val = +val.substring(0,val.length-2);
        return val;
    }
};
(function(){
    // Define the base directory for this JavaScript file.
    var scripts = document.getElementsByTagName("script");
    app.baseDir = scripts[scripts.length-1].src;
    app.baseDir = app.baseDir.substring(0,app.baseDir.lastIndexOf("/")+1);
})();
app.addEvent(window,"load",function(){app.__init__();});

//============================================================
// Application Ends
//============================================================
/**
 * @namespace 
 */
var jUI = {};
(function(){
    
    //=================================================================================
    // Date Start 
    //=================================================================================
    /**
     * @constructor
     * @param {jUI.Date} uiDate (optional)
     * @returns {jUI.Date}
     */
    jUI.Date = function(uiDate){
        this.__date = null;
        
        if(uiDate) this.setDateFrom(uiDate);
        else this.updateToCurrDate();
    };
    (function(){
        
        jUI.Date.prototype.updateToCurrDate = function(){
            this.__date = new Date();
        }
        jUI.Date.prototype.setDateFromStr = function(dateStr){
            var dateTimeFields = dateStr.split(' ');
            if(!this.__date) this.__date = new Date();
            var fields = dateTimeFields[0].split('-');
            this.__date.setFullYear(+fields[0],+fields[1]-1,+fields[2]);
            if(dateTimeFields[1]){
                fields = dateTimeFields[1].split(':');
                this.__date.setHours(+fields[0],+fields[1],+fields[2],0);
            }else this.__date.setHours(0,0,0,0);
        }
        jUI.Date.prototype.setDateFromCoorDate = function(dateStr){
            if(!this.__date) this.__date = new Date();
            this.__date.setFullYear(+(dateStr.substr(0,4)),+(dateStr.substr(4,2))-1,+(dateStr.substr(6,2)));
            this.__date.setHours(+(dateStr.substr(8,2)),+(dateStr.substr(10,2)),+(dateStr.substr(12,2)),0);
        }
        jUI.Date.prototype.setDateFrom = function(sourceDateTime){
            var t = sourceDateTime.getDate().getTime();
            if(!this.__date) this.__date = new Date(t);
            else this.__date.setTime(t);
        };
        jUI.Date.prototype.setDateTimeIntValue = function(v){
            return this.__date.setTime(v);
        };
        jUI.Date.prototype.setMinutesSeconds = function(timeStr){
            if(!this.__date) this.__date = new Date(0,0,0,0,0,0,0);
            this.__date.setMinutes(+(timeStr.substr(0,2)));
            this.__date.setSeconds(+(timeStr.substr(2,2)));
        }
        jUI.Date.prototype.setMinutesSecondsValue = function(mint,sec){
            if(!this.__date) this.__date = new Date(0,0,0,0,0,0,0);
            this.__date.setMinutes(mint);
            this.__date.setSeconds(sec);
        }
        jUI.Date.prototype.setMillisecond = function(value){
            if(!this.__date) this.__date = new Date(0,0,0,0,0,0,0);
            this.__date.setMilliseconds(+value);
        }
        jUI.Date.prototype.setSecond = function(value){
            if(!this.__date) this.__date = new Date(0,0,0,0,0,0,0);
            this.__date.setSeconds(+value);
        }
        jUI.Date.prototype.setMinute = function(value){
            if(!this.__date) this.__date = new Date(0,0,0,0,0,0,0);
            this.__date.setMinutes(+value);
        }
        jUI.Date.prototype.setHour = function(value){
            if(!this.__date) this.__date = new Date(0,0,0,0,0,0,0);
            this.__date.setHours(+value);
        }
        jUI.Date.prototype.setDay = function(value){
            if(!this.__date) this.__date = new Date(0,0,0,0,0,0,0);
            this.__date.setDate(+value);
        }
        jUI.Date.prototype.setMonth = function(value){
            if(!this.__date) this.__date = new Date(0,0,0,0,0,0,0);
            this.__date.setMonth(+value-1);
        }
        jUI.Date.prototype.setYear = function(value){
            if(!this.__date) this.__date = new Date(0,0,0,0,0,0,0);
            this.__date.setFullYear(+value);
        }
        jUI.Date.prototype.getDaysInYear = function(y){
            if((y % 4) != 0) return 365;				
            if(((y % 100) != 0) || ((y % 400) == 0)) return 366;
            return 365;
        }
        jUI.Date.prototype.getDaysInMonth = function(y, m){
            if(!y) y = this.__date.getFullYear();
            if(!m) m = this.__date.getMonth()+1;
            if(m >= 1 && m <= 7 && m % 2 == 0){
                if(m != 2)	return 30;
                if((y % 4) != 0) return 28;				
                if(((y % 100) != 0) || ((y % 400) == 0)) return 29;
                return 28;
            }
            if(m >= 1 && m <= 7 && m % 2 != 0) return 31;
            if(m >= 8 && m <= 12 && m % 2 == 0) return 31;
            if(m >= 8 && m <= 12 && m % 2 != 0) return 30;
        }
        jUI.Date.prototype.addMilliseconds = function(value){
            this.__date.setMilliseconds(this.__date.getMilliseconds()+value);
        }
        jUI.Date.prototype.addSeconds = function(value){
            this.__date.setSeconds(this.__date.getSeconds()+value);
        }
        jUI.Date.prototype.addMinutes = function(value){
            this.__date.setMinutes(this.__date.getMinutes()+value);
        }
        jUI.Date.prototype.addHours = function(value){
            this.__date.setHours(this.__date.getHours()+value);
        }
        jUI.Date.prototype.addDays = function(value){
            this.__date.setDate(this.__date.getDate()+value);
        }
        jUI.Date.prototype.addMonths = function(value){
            this.__date.setMonth(this.__date.getMonth()+value);
        }
        jUI.Date.prototype.addYears = function(value){
            this.__date.setFullYear(this.__date.getFullYear()+value);
        }
        jUI.Date.prototype.getDateTimeIntValue = function(){
            return this.__date.getTime();
        }
        jUI.Date.prototype.difference = function(value){
            return (Math.abs(this.__date.getTime()-value.getDate().getTime()))/1000;
        }
        jUI.Date.prototype.compare = function(value){
            var dateTimeVal = this.getDateTimeIntValue();
            var dateTimeVal2 = value.getDateTimeIntValue();
            if( dateTimeVal > dateTimeVal2) return 1;
            if( dateTimeVal < dateTimeVal2) return -1;
            return 0;
        }
        jUI.Date.prototype.equals = function(v){
            return this.compare(v) == 0;
        }
        /**
         * @param {jUI.Date} v
         * @param {"Y" | "M" | "D" | "h" | "m" | "s"} truncationLevel
         * @returns {Boolean}
         */
        jUI.Date.prototype.equalsTruncatedTo = function(v,truncationLevel){
            switch(truncationLevel){
                case "s":
                    if(this.getSecond() !== v.getSecond())
                        return false;
                case "m":
                    if(this.getMinute() !== v.getMinute())
                        return false;
                case "h":
                    if(this.getHour() !== v.getHour())
                        return false;
                case "D":
                    if(this.getDay() !== v.getDay())
                        return false;
                case "M":
                    if(this.getMonth() !== v.getMonth())
                        return false;
                case "Y":
                    if(this.getYear() !== v.getYear())
                        return false;
                    return true;
            }
            return false;
        };
        /**
         * @param {"Y" | "M" | "D" | "h" | "m" | "s"} truncationLevel
         */
        jUI.Date.prototype.truncate = function(truncationLevel){
            switch(truncationLevel){
                case "Y":
                    this.setMonth(1);
                case "M":
                    this.setDay(1);
                case "D":
                    this.setHour(0);
                case "h":
                    this.setMinute(0);
                case "m":
                    this.setSecond(0);
                case "s":
                    this.setMillisecond(0);
            }
        };
        jUI.Date.prototype.getYear = function(){
            return this.__date.getFullYear();
        }
        jUI.Date.prototype.getMonth = function(){
            return this.__date.getMonth()+1;
        }
        jUI.Date.prototype.getDay = function(){
            return this.__date.getDate();
        }
        jUI.Date.prototype.getHour = function(){
            return this.__date.getHours();
        }
        jUI.Date.prototype.getMinute = function(){
            return this.__date.getMinutes();
        }
        jUI.Date.prototype.getSecond = function(){
            return this.__date.getSeconds();
        }
        jUI.Date.prototype.getMillisecond = function(){
            return this.__date.getMilliseconds();
        }
        jUI.Date.prototype.getDate = function(){ return this.__date; }
        /**
         * @returns {int} from 0 - 6 (Sunday - Saturday)
         */
        jUI.Date.prototype.getDayOfWeek = function(){
            return this.__date.getDay();
        };
        /**
         * %Y - year <br>
         * %MMMM - month full text <br>
         * %MMM - month three letter <br>
         * %M - month <br>
         * %D - day <br>
         * %H - hours 12 <br>
         * %h - hours 24 <br>
         * %m - minutes <br>
         * %s - seconds <br>
         * %am - AM/PM <br>
        */
        jUI.Date.prototype.toString = function(pattern){
            var y = this.__date.getFullYear(),m = this.__date.getMonth()+1, d = this.__date.getDate(), 
                h = this.__date.getHours(), mn = this.__date.getMinutes(), s = this.__date.getSeconds();
            var result = pattern.replace(/%Y/g,y);
            result = result.replace(/%MMMM/g, app.lang["month"+m+"f"]);
            result = result.replace(/%MMM/g, app.lang["month"+m+"s"]);
            result = result.replace(/%M/g,(m< 10)? '0'+m: m);
            result = result.replace(/%D/g,(d< 10)? '0'+d: d);
            var h2 = (h == 0)? 12 : ((h-1) % 12) + 1;
            result = result.replace(/%H/g,(h2 < 10)? '0'+h2 : h2);
            result = result.replace(/%h/g,(h < 10)? '0'+h : h );
            result = result.replace(/%m/g,(mn < 10)? '0'+mn : mn);
            result = result.replace(/%s/g,(s < 10)? '0'+s : s );
            result = result.replace(/%am/g,(h >= 0 && h < 12)? app.lang['am'] : app.lang['pm']);
            return result;
        }	
        
        
    })();
    
    //=================================================================================
    // Date End
    //=================================================================================
    
    //=================================================================================
    // AVLTree Start 
    //=================================================================================
    jUI.AVLNode = function(nodeKey, nodeData){
        this.key = nodeKey;
        this.data = nodeData;
        this.left = null;
        this.right = null;
        this.nodeLevel = 1;
    };
    /**
     * @constructor
     */
    jUI.AVLTree = function(){
        this.__size = 0;
        this.__root = null;
        this.__currNode = null;
        
        this.onItemRemoved = null; // key, value
    };
    (function(){
        jUI.AVLTree.prototype._addNode = function(parentNode, key, data){
            if(parentNode){ 
                if(key >= parentNode.key){ 
                    if(parentNode.right){ 
                        if(!this._addNode(parentNode.right, key, data)) return !this._checkBalance(parentNode, 2);
                        return true;
                    }else { parentNode.right = new AVLNode(key, data); ++this.__size; return false;}
                }else { 
                    if(parentNode.left){ 
                            if(!this_addNode(parentNode.left, key, data)) return !this._checkBalance(parentNode, 1);
                            return true;
                    }else{ parentNode.left = new AVLNode(key, data); ++this.__size; return false;}
                }
            }
        };
        jUI.AVLTree.prototype._removeNode = function(node){
            if(!node) return null;
            var retNode = null;
            if(node.right){ 
                retNode = this._removeMostleftNode(node.right);
                if(!retNode) retNode = node.right;
                else{ 
                    retNode.right = node.right;
                    this._checkBalance(retNode, 2);
                }
                retNode.left = node.left;
            }else retNode = node.left;

            this.onItemRemoved && this.onItemRemoved(node.key,node.data);
            node.key = null;
            node.data = null;
            node.left = null;
            node.right = null;
            --this.__size;
            return retNode;
        };
        jUI.AVLTree.prototype._findAndRemove = function(parentNode, key){
            if(parentNode){
                if(key > parentNode.key){ 
                    if(parentNode.right && parentNode.right.key == key){ parentNode.right = this._removeNode(parentNode.right); return true; }
                    else if(this._findAndRemove(parentNode.right, key)) {this._checkBalance(parentNode, 2); return true;} 
                }else{
                    if(parentNode.left && parentNode.left.key == key){ parentNode.left = this._removeNode(parentNode.left); return true; }
                    else if(this._findAndRemove(parentNode.left, key)){this._checkBalance(parentNode, 1); return true;}
                }
            }
            return false;
        };
        jUI.AVLTree.prototype._removeMostleftNode = function(parentNode){
            if(!parentNode.left) return null;
            if(!parentNode.left.left){
                var retNode = parentNode.left;
                parentNode.left = null;
                return retNode;
            }
            var removedNode = this._removeMostleftNode(parentNode.left);
            this._checkBalance(parentNode, 1);
            return removedNode;
        };
        jUI.AVLTree.prototype._getLeftNodeLevel = function(node){
            return ((node && node.left)? node.left.nodeLevel : 0);
        };
        jUI.AVLTree.prototype._getRightNodeLevel = function(node){
            return ((node && node.right)? node.right.nodeLevel : 0);
        };
        jUI.AVLTree.prototype._updateNodeLevel = function(node){
            if(!node) return;
            node.nodeLevel = (this._getLeftNodeLevel(node) > getRightNodeLevel(node))? 
                                            this._getLeftNodeLevel(node)+1 : this._getRightNodeLevel(node)+1;
        };
        jUI.AVLTree.prototype._checkBalance = function(parentNode, checkSide){ // checkSide: 1 - left, 2 - right, 3 - the root node
            var checkNode = (checkSide == 1)? parentNode.left : (checkSide == 2)? parentNode.right : parentNode;
            this._updateNodeLevel(checkNode);
            if( Math.abs(this._getLeftNodeLevel(checkNode) - this._getRightNodeLevel(checkNode)) <= 1 ) return true;

            if(this._getLeftNodeLevel(checkNode) > this._getRightNodeLevel(checkNode) &&
                    this._getRightNodeLevel(checkNode.left) > this._getLeftNodeLevel(checkNode.left) )
                    checkNode.left = this._rotate(checkNode.left);
            else if(this._getRightNodeLevel(checkNode) > this._getLeftNodeLevel(checkNode)  &&
                    this._getLeftNodeLevel(checkNode.right) > this._getRightNodeLevel(checkNode.right) )
                    checkNode.right = this._rotate(checkNode.right);
            if(checkSide == 1) parentNode.left = this._rotate(parentNode.left); 
            else if(checkSide == 2) parentNode.right = this._rotate(parentNode.right); 
            else this.__root = this._rotate(this.__root); 
            return false; 
        };
        jUI.AVLTree.prototype._rotate = function(parentNode){
            if(this._getLeftNodeLevel(parentNode) == this._getRightNodeLevel(parentNode)) return parentNode;
            var tempNode = parentNode;
            if(this._getLeftNodeLevel(parentNode) > this._getRightNodeLevel(parentNode)){ // a clockwise rotation.
                    parentNode = parentNode.left;
                    tempNode.left = parentNode.right;
                    parentNode.right = tempNode;
            }else{ // a counterclockwise rotation
                    parentNode = parentNode.right;
                    tempNode.right = parentNode.left;
                    parentNode.left = tempNode;
            }
            this._updateNodeLevel(tempNode);
            this._updateNodeLevel(parentNode);
            return parentNode;
        };
        jUI.AVLTree.prototype._search = function(startNode, keyValue){ 
            if(!startNode) return null;
            if(startNode.key == keyValue) return startNode.data;
            if(keyValue > startNode.key) return this._search(startNode.right, keyValue);
            if(keyValue < startNode.key) return this._search(startNode.left, keyValue);
        };
        jUI.AVLTree.prototype._printNode = function(parentNode){
            if(!parentNode) return '#';
            return parentNode.key+'+['+this._printNode(parentNode.left)+','+this._printNode(parentNode.right)+']';
        };
        jUI.AVLTree.prototype._getKeyListNode = function(parentNode, retArray,retVal){
            if(!parentNode) return;
            this._getKeyListNode(parentNode.left, retArray);
            retArray.push(retVal==1?parentNode.key:parentNode.data);
            this._getKeyListNode(parentNode.right, retArray);
        };
        jUI.AVLTree.prototype._clearNode = function(pn){
            if(!pn) return;
            this._clearNode(pn.left);
            this._clearNode(pn.right);
            this.onItemRemoved && this.onItemRemoved(pn.key,pn.data);
            pn.key = null;
            pn.data = null;
            delete pn.key;
            delete pn.data;
            delete pn.left;
            delete pn.right;
        };

        jUI.AVLTree.prototype.add = function(key, data){
            if(!this.__root){
                this.__root = new AVLNode(key, data);
                ++this.__size;
            }else if(!this._addNode(this.__root, key, data)) this._checkBalance(this.__root, 3);
        };
        jUI.AVLTree.prototype.remove = function(key){
            if(!this.__root) return false;
            if(this.__root.key == key){
                this.onItemRemoved && this.onItemRemoved(this.__root.key,this.__root.data);
                this.__root = this._removeNode(this.__root);
                this._checkBalance(this.__root, 3);
                return true;
            }
            if(this._findAndRemove(this.__root, key)){ this._checkBalance(this.__root, 3); return true; }
            return false;
        };
        jUI.AVLTree.prototype.find = function(keyValue){
            return this._search(this.__root, keyValue);
        };
        jUI.AVLTree.prototype.get = function(key){
            return this.find(key);
        };
        jUI.AVLTree.prototype.getKeyList = function(){
            var retArray = new [];
            if(this.__root) this._getKeyListNode(this.__root,retArray,1);
            else return null;
            return retArray;
        };
        jUI.AVLTree.prototype.getValueList = function(){
            var retArray = new Array();
            if(this.__root) this._getKeyListNode(this.__root,retArray,2);
            else return null;
            return retArray;
        };
        jUI.AVLTree.prototype.clear = function(){
            if(this.__root) this._clearNode(this._root);
            this.__root = null;
        };
        jUI.AVLTree.prototype.getNumOfMatchses = function(searchType, keyValue1, keyValue2){
        };
        jUI.AVLTree.prototype.print = function(){
            alert('{'+this._printNode(this.__root)+'}');
        };
        jUI.AVLTree.prototype.getSize = function(){
            return this.__size;
        };
    })();
        
    //=================================================================================
    // AVLTree End 
    //=================================================================================
    
    // =================================================================================
    // Object Start 
    // =================================================================================
    
    /**
     * jUI.Object 
     * 
     * @param {json} pa {<br>
     *      tag:int, <br >
     *      events: {
     *          eventName: handler function
     *      }
     * }
     * @param {DomElement} _element (optional) The underlying DomElement 
     * that will be used for this object.
     * @constructor
     */
    jUI.Object = function(pa, _element){
        if(pa && pa.__loading__) return;
        pa = app.$(app.clone(pa),{
        }, false);
        _element && (_element.juiObject = this);
        this.__V = {
            el: _element,
            CID: app.getCID(),
            finalizing:false,
            intializing:true,
            tag:0,
            draggable: null,
            handleAppEvent: {
            },
            events:{}
        };
        
        this._initProp(pa);
        this.__V.intializing = false;
        this.$(pa);
    };
    (function(){
        
        jUI.Object.prototype._handleAppEvents = function(e){
            e = e || window.event;
            this.juiObject._doEvent(e.type,e);
        };
        jUI.Object.prototype.addEvent = function(ev,f){
            var V = this.__V, evs = V.events, e = evs[ev];
            if(!e) e = evs[ev] = [];
            else if(e.indexOf(f) !== -1) return;
            if(this.__events.indexOf(ev) !== -1){
                if(app.__events.indexOf(ev) !== -1 && !V.handleAppEvent[ev]){
                    V.handleAppEvent[ev] = true;
                    app.addEvent(V.el, ev, this._handleAppEvents , true);
                }
                e.push(f);
                if(!V.draggable && (ev === "drag" || ev === "dragStart" || ev === "dragStop")){
                    this._initDragEvent();
                }
            }
        };
        jUI.Object.prototype.removeEvent = function(ev,f){
            var V = this.__V,evs = V.events,e = evs[ev];
            if(!e || e.indexOf(f) === -1) return;
            e.remove(f);
            if(!e.length){
                if(app.__events.indexOf(ev) !== -1 && V.handleAppEvent[ev]){
                    app.removeEvent(V.el, ev, this._handleAppEvents);
                    delete V.handleAppEvent[ev];
                }
                delete evs[ev];
            }
            if( V.draggable && 
                (ev === "drag" || ev === "dragStart" || ev === "dragStop") && 
                !evs["drag"] && !evs["dragStart"] && !evs["dragStop"]
            ){
                this.removeEvent("mousedown",V.draggable.dragStart);
                V.draggable = null;
            }
        };
        /**
         * 
         * @param {String} evName + other parameters
         */
        jUI.Object.prototype._doEvent = function(evName){
            if(this.__V.finalizing) return;
            var evs = this.__V.events[evName];
            if(evs){
                var args = Array.prototype.slice.call(arguments, 1);
                for(var i=0,l=evs.length;i<l;++i){
                    evs[i].apply(this,args);
                }
            }
        };
        /**
         * 
         * @param {String} evName + other parameters
         * @param {function(retVal:Object)} checkRetCallback (optional) the callback to check the return value of each event handler.
         */
        jUI.Object.prototype._doEventWithCallback = function(evName, checkRetCallback){
            if(this.__V.finalizing) return;
            var evs = this.__V.events[evName];
            if(evs){
                var args = Array.prototype.slice.call(arguments, 2);
                for(var i=0,l=evs.length,retVal;i<l;++i){
                    retVal = evs[i].apply(this,args);
                    checkRetCallback && checkRetCallback.call(this,retVal);
                }
            }
        };
        jUI.Object.prototype._initDragEvent = function(){
            var V = this.__V,so = this;
            
            V.draggable = {
                drag : function(e){
                    e = e || window.event;
                    if(e.preventDefault) e.preventDefault();
                    e.cancelBubble=true;
                    e.returnValue=false;
                    so._doEvent("drag",e);
                    return false;
                },
                dragStop: function(e){
                    e = e || window.event;
                    if(e.preventDefault) e.preventDefault();
                    e.cancelBubble=true;
                    e.returnValue=false;
                    app.removeEvent(window, "mousemove", V.draggable.drag);
                    app.removeEvent(window, "mouseup", V.draggable.dragStop);
                    so._doEvent("dragStop",e);
                    return false;
                },
                dragStart: function(e){
                    e = e || window.event;
                    if(e.preventDefault) e.preventDefault();
                    e.cancelBubble=true;
                    e.returnValue=false;
                    app.addEvent(window, "mouseup", V.draggable.dragStop, true);
                    app.addEvent(window, "mousemove", V.draggable.drag , true);
                    so._doEvent("dragStart",e);
                    return false;
                }
            };
            this.addEvent("mousedown",V.draggable.dragStart);
        };
        
        /**
         * 
         * @param {String} ev optional event name. If provided, only event of that type 
         *                      will be removed. Otherwise, everything will be removed.
         * @returns {undefined}
         */
        jUI.Object.prototype.removeAllEvents = function(ev){
            var V = this.__V,evs = V.events;
            if(ev){
                var e = evs[ev];
                if(!e) return;
                if(app.__events.indexOf(ev) !== -1){
                    app.removeEvent(V.el, ev, this._handleAppEvents);
                    delete V.handleAppEvent[ev];
                }
                e.clear();
                delete evs[ev];
            }else{
                for(e in evs){
                    this.removeAllEvents(e);
                }
            }
        };
        jUI.Object.prototype.addEvents = function(evs){
            for(var ev in evs){
                this.addEvent(ev,evs[ev]);
            }
        };
        
        jUI.Object.prototype.$ = function(pa){
            var ps = this.__props,fn;
            if(pa)
                for(var p in pa){
                    fn = ps[p];
                    if(fn)
                        this[fn](pa[p]);
                    else
                        throw new Error("Property: "+p+" is not recognized.");
                }
        };
        jUI.Object.prototype._initProp = function(pa){
        };
        
        
        jUI.Object.prototype.setTag = function(v){ this.__V.tag = v; };
        
        jUI.Object.prototype.getTag = function(){ return this.__V.tag; };
        
        
        jUI.Object.prototype.finalize = function(){
            var V = this.__V;
            this.removeAllEvents();
            V.el && (delete V.el.juiObject);
            delete V.el;
            delete this.__V;
        };
        jUI.Object.prototype.free = function(){
            this.__V.finalizing = true;
            this.finalize();
        };
        
        
        
        jUI.Object.prototype.__props = {
            tag: "setTag", 
            events: "addEvents"
        };
        
        jUI.Object.prototype.__events = [
        ];
        
    })();
    
    // =================================================================================
    // Object End
    // =================================================================================
    
    
    // =================================================================================
    // ViewController Start 
    // =================================================================================
    
    /**
     * jUI.ViewController 
     * @param {json} pa { <br>
     *      parentController: jUI.ViewController <br>
     * }
     * @constructor
     */
    jUI.ViewController = function(pa){
        if(pa && pa.__loading__) return;
        this.initializing = true;
        this.finalizing = false;
        pa && pa.parentController && (this.parentController = pa.parentController);
        this._initController();
        this.models = this._initModels();
        this.view = this._initView();
        this.initializing = false;
        this.viewDidLoad(pa);
    };
    (function(){
        /**
         * @returns {json}
         */
        jUI.ViewController.prototype._initModels = function(){
            return null;
        };
        /**
         * @returns {jUI.Object}
         */
        jUI.ViewController.prototype._initView = function(){
            return new jUI.Object();
        };
        jUI.ViewController.prototype._initController = function(){
        };
        /**
         * @param {json} pa parameter array that was passed to the constructor.
         */
        jUI.ViewController.prototype.viewDidLoad = function(pa){
        };
        jUI.ViewController.prototype.finalize = function(){
        };
        jUI.ViewController.prototype.free = function(){
            this.finalizing = true;
            this.finalize();
            if(this.models){
                var v;
                for(var k in this.models){
                    v = this.models[k]; 
                    if(v instanceof jUI.Object)
                        v.free();
                    delete this.models[k];
                }
                delete this.models;
            }
            if(this.view){
                this.view.free();
                delete this.view;
            }
            for(var v in this){
                if(typeof v !== "function")
                    delete this[v];
            }
        };
        
    })();
    
    // =================================================================================
    // ViewController End
    // =================================================================================
    
    // =================================================================================
    // LoaderViewController Start 
    // =================================================================================
       
    /**
     * @extends jUI.ViewController
     * @description Extending this class required implementing the two functions play and stop. 
     * @constructor
     */
    jUI.LoaderViewController = function(pa){
        if(pa && pa.__loading__) return;
        jUI.ViewController.call(this,pa);
    };
    (function(){
        jUI.LoaderViewController.prototype = new jUI.ViewController({__loading__:true});
        jUI.LoaderViewController.prototype.constructor = jUI.LoaderViewController;

        jUI.LoaderViewController.prototype.play = function(){};
        jUI.LoaderViewController.prototype.stop = function(){};
    })();

    
    // =================================================================================
    // Layout Start 
    // =================================================================================
       
    /**
     * @TODO 
     *implement the id and class properties.
     *implement the html property in case we want some html code inside the element.
     *maybe add margins and paddings?
     * 
     * @extends jUI.Object
     * 
     * @param {json} pa { <br >
     *   id: String,<br >
     *   className: String,<br >
     *   classModifier: String, this will be added to the class name so that it modifies the class name style instead of replacing it.<br >
     *   parent: Layout, <br >
     *   visible: boolean,<br >
     *   left: int | undefined, <br >
     *   top: int | undefined, <br >
     *   right:int | undefined, <br >
     *   bottom:int | undefined, <br >
     *   width: int | undefined, <br >
     *   height: int | undefined, <br >
     *   anchor: {l:int, r:int, t:int, b:int},<br >
     *   align:Layout.alXXX or (<, >, |),<br >
     *   valign:Layout.valXXX or (^, _ , -),<br >
     *   av: [align, valign], <br>
     *   minWidth:int | undefined,<br >
     *   minHeight:int | undefined,<br >
     *   maxWidth:int | undefined,<br >
     *   maxHeight:int | undefined,<br >
     *   layout: jUI.Layout.ltXXX,<br >
     *   opacity: double 0-1,<br>
     *   padding: {l:int, r:int, t:int, b:int},<br >
     *   margin: {{l:int | undefined,r:int | undefined,t:int | undefined,b:int | undefined} | int}, <br/> 
     *   noWrap: boolean (default false), <br>
     *   innerAlign: jUI.Layout.ialXXX (<br>
     *              values can be combined. The children's layout <br>
     *              must not be set to ltFree. <br>
     *          ), <br>
     *   zIndex: int, <br>
     *   children: [jUI.Layout], <br>
     *   enabled: boolean (default true), <br>
     *   html: String (HTML code cold contain DIVs with ids <br >
     *                                  corresponding to the ids of the <br >
     *                                  children components that will be<br >
     *                                  added)<br >
     *<br >
     *   evnts:{ , <br>
     *      mouseover: function(EventObject), <br>
     *      mouseout: function(EventObject), <br>
     *      mousedown: function(EventObject), <br>
     *      mouseup : function(EventObject), <br>
     *      mousemove: function(EventObject), <br>
     *      click : function(EventObject), <br>
     *      focus : function(EventObject), <br>
     *      blur : function(EventObject), <br>
     *      keypress : function(EventObject), <br>
     *      keyup : function(EventObject), <br>
     *      keydown : function(EventObject), <br>
     *      drag:  function(EventObject), <br>
     *      dragStart:  function(EventObject), <br>
     *      dragStop:  function(EventObject) <br>
     *   }<br >
     * }
     * @param {DomElement} _element (optional) The underlying DomElement 
     * that will be used for this Layout.
     * 
     * @constructor
     */
    jUI.Layout = function(pa, _element){
        if(pa && pa.__loading__) return;
        pa = app.$(app.clone(pa),{
            className: "jui"
        }, false);
        jUI.Object.call(this, pa, _element || document.createElement("div"));
    };
    (function () {
        jUI.Layout.__cssText = "display:none;position:absolute;";

        jUI.alNone = jUI.Layout.alNone = 0;
        jUI.alLeft = jUI.Layout.alLeft = 1;
        jUI.alRight = jUI.Layout.alRight = 2;
        jUI.alCenter = jUI.Layout.alCenter = 3;

        jUI.valNone = jUI.Layout.valNone = 0;
        jUI.valTop = jUI.Layout.valTop = 1;
        jUI.valBottom = jUI.Layout.valBottom = 2;
        jUI.valMiddle = jUI.Layout.valMiddle = 3;

        jUI.ltFree = jUI.Layout.ltFree = 0;
        jUI.ltFollowHor = jUI.Layout.ltFollowHor = 1;
        jUI.ltFollowVer = jUI.Layout.ltFollowVer = 2;
        jUI.ltFixed = jUI.Layout.ltFixed = 4;

        jUI.ialNone = jUI.Layout.ialNone = 0;
        jUI.ialLeft = jUI.Layout.ialLeft = 1;
        jUI.ialRight = jUI.Layout.ialRight = 2;
        jUI.ialCenter = jUI.Layout.ialCenter = 3;
        jUI.ialTop = jUI.Layout.ialTop = 4;
        jUI.ialBottom = jUI.Layout.ialBottom = 8;
        jUI.ialMiddle = jUI.Layout.ialMiddle = 12;

        jUI._dtNone = jUI.Layout._dtNone = 0;
        jUI._dtBlock = jUI.Layout._dtBlock = 1;
        jUI._dtFlex = jUI.Layout._dtFlex = 2;
        jUI._dtInline = jUI.Layout._dtInline = 3;
        
        jUI.orLeftRight = 1;
        jUI.orRightLeft = 2;
        jUI.orTopBottom = 4;
        jUI.orBottomTop = 8;


    })();
    (function(){
        
        jUI.Layout.prototype = new jUI.Object({__loading__: true});
        jUI.Layout.prototype.constructor = jUI.Layout;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Layout.prototype._initProp = function(pa){
            jUI.Object.prototype._initProp.call(this, pa);
            
            var e = this.__V.el;
            var isBodyEl = e === document.body;
            app.$(this.__V, {
                className: [""],
                left: undefined,
                top: undefined,
                right: undefined,
                bottom: undefined,
                width: isBodyEl? "100%" : undefined,
                height: isBodyEl? "100%" :  undefined,
                parent:null,
                visible: isBodyEl,
                enabled:true,
                Layout: {
                    align: jUI.Layout.alNone, 
                    valign: jUI.Layout.valNone, 
                    minWidth:undefined,
                    minHeight:undefined,
                    maxWidth:undefined,
                    maxHeight:undefined,
                    parentForm: !isBodyEl? this : null,
                    layout: jUI.Layout.ltFree,
                    children: [],
                    innerAlign: jUI.Layout.ialNone
                }
            },true);
            e.dir = app.dir;
            e.style.cssText = (!isBodyEl ? jUI.Layout.__cssText : "width:100%;height:100%;margin:0px;padding:0px;") +"direction:"+app.dir+";";
        };
        
        jUI.Layout.prototype.finalize = function(){
            var V = this.__V, chs = V.Layout.children;
            chs.forEachR(function(v,i){v.free();});
            V.parent && this.setParent(null);
            jUI.Object.prototype.finalize.call(this);
        };
        jUI.Layout.prototype.free = function(){
            this.__V.finalizing = true;
            this.setVisible(false);
            jUI.Object.prototype.free.call(this);
        };
        
        // Overriden Function End ===========================================
        
        jUI.Layout.prototype._setLeft = function(v){
            var V = this.__V,s = V.el.style;
            var val = v === undefined ? "auto" : +v? v+"px" : v;
            app.rtl? s.right = val : s.left = val;
            V.left = v;
        };
        jUI.Layout.prototype._setTop = function(v){
            var V = this.__V;
            V.el.style.top = v === undefined ? "auto" : +v? v+"px" : v;
            V.top = v;
        };
        jUI.Layout.prototype._setRight = function(v){
            var V = this.__V,s = V.el.style;
            var val = v === undefined ? "auto" : +v? v+"px" : v;
            app.rtl? s.left = val : s.right = val;
            V.right = v;
        };
        jUI.Layout.prototype._setBottom = function(v){
            var V = this.__V;
            V.el.style.bottom = v === undefined ? "auto" : +v? v+"px" : v;
            V.bottom = v;
        };
        jUI.Layout.prototype._setWidth = function(v){
            var V = this.__V,_V = V.Layout,mx = _V.maxWidth,mn = _V.minWidth,e = V.el;
            if(v !== undefined){
                if(!+v){
                    e.style.width = v;
                    V.width = v;
                    return;
                }
                if(v < 0) v = 0;
                mn && v < mn && (v = mn);
                mx && v > mx && (v = mx);
                e.style.width = v+"px";
            }else{
                e.style.width = "auto";
            }
            V.width = v;
            if(V.Layout.align === jUI.Layout.alCenter){ 
                v = this.getWidth();
                this._setLeft(v? "calc(50% - "+(v >> 1)+"px)" : "50%");
            }
        };
        jUI.Layout.prototype._setHeight = function(v){
            var V = this.__V,_V = V.Layout,mx = _V.maxHeight,mn = _V.minHeight,e = this._childrenAppendNode();
            if(v !== undefined){
                if(!+v){
                    e.style.height= v;
                    V.height = v;
                    return;
                }
                if(v < 0) v = 0;
                mn && v < mn && (v = mn);
                mx && v > mx && (v = mx);
                e.style.height = v+"px";
            }else{
                e.style.height = "auto";
            }
            V.height = v;
            if(V.Layout.valign === jUI.Layout.valMiddle) {
                v = this.getHeight();
                this._setTop(v? "calc(50% - "+(v >> 1)+"px)" : "50%");
            }
        };
        /**
         * @param {json} v styles to be applied to the DOM element that represents this layer. This should only be used by componenet developers who know what they are doing.
         */
        jUI.Layout.prototype._style = function(v){
            app.$(this.__V.el.style,v,true);
        };
        
        jUI.Layout.prototype.getShowContextMenu = function(){
            return false;
        };
        jUI.Layout.prototype.isSelectable = function(){
            return false;
        };
        
        jUI.Layout.prototype.setId = function(v){
            this.__V.el.id = v;
        };
        jUI.Layout.prototype._setClassName = function(){
            this.__V.el.setAttribute("class",this.__V.className.join(" "));
        };
        jUI.Layout.prototype._resetClassName = function(){
            var V = this.__V;
            V.className.splice(1, V.className - 1);
            this._setClassName();
        };
        jUI.Layout.prototype._appendToClassName = function(v){
            this.__V.className.push(v);
            this._setClassName();
        };
        jUI.Layout.prototype._removeFromClassName = function(v){
            this.__V.className.remove(v);
            this._setClassName();
        };
        jUI.Layout.prototype._replaceClassName = function(oldClass, newClass){
            this.__V.className.remove(oldClass);
            this.__V.className.push(newClass);
            this._setClassName();
        };
        jUI.Layout.prototype.setClassName = function(v){
            this.__V.className[0] = v;
            this._setClassName();
        };
        jUI.Layout.prototype.setLeft = function(v){
            var V = this.__V;
            if(V.Layout.layout&3 || V.Layout.align !== jUI.Layout.alNone) return;
            this._setLeft(v);
        };
        jUI.Layout.prototype.setTop = function(v){
            var V = this.__V;
            if(V.Layout.layout&3 || V.Layout.valign !== jUI.Layout.valNone) return;
            this._setTop(v);
        };
        jUI.Layout.prototype.setRight = function(v){
            var V = this.__V;
            if(V.Layout.layout&3 || V.Layout.align !== jUI.Layout.alNone) return;
            this._setRight(v);
        };
        jUI.Layout.prototype.setBottom = function(v){
            var V = this.__V;
            if(V.Layout.layout&3 || V.Layout.valign !== jUI.Layout.valNone) return;
            this._setBottom(v);
        };
        jUI.Layout.prototype.setWidth = function(v){
            var V = this.__V;
            this._setWidth(v);
        };
        jUI.Layout.prototype.setHeight = function(v){
            var V = this.__V;
            this._setHeight(v);
        };
        jUI.Layout.prototype.setInnerWidth = function(v){
            +v && this.setWidth(this.getHorPadding() + v);
        };
        jUI.Layout.prototype.setInnerHeight = function(v){
            +v && this.setHeight(this.getVerPadding() + v);
        };
        
        jUI.Layout.prototype.setSize = function(w,h){
            this.setWidth(w);
            this.setHeight(h);
        };
        jUI.Layout.prototype.setLayout = function(v){
            var V = this.__V,s = V.el.style,flt = app.cssProps.cssfloat;
            if(v === jUI.ltFollowVer || v === jUI.ltFollowHor){
                s.position = "relative";
                s.left = "auto";
                s.right = "auto";
                s.top = "auto";
                s.bottom = "auto";
                var al = V.Layout.align;
                s[flt] = app.rtl && (!al || al === jUI.alLeft) || !app.rtl && (al === jUI.alRight) ?"right" : "left";
            }else{
                s.position = v === jUI.ltFixed? "fixed" : "absolute";
                this._setLeft(V.left);
                this._setRight(V.right);
                this._setTop(V.top);
                this._setBottom(V.bottom);
                s[flt] = "none";
            }
            if(v === jUI.ltFollowVer){
                s.clear = "both";
            }else{
                s.clear = "none";
            }
            V.Layout.layout = v;
        };
        jUI.Layout.prototype.setAlign = function(v){
            var V = this.__V;
            switch(v){
                case "<" : v = 1;  break;
                case ">" : v = 2;  break;
                case "|" : v = 3;  break;
            }
            V.Layout.align = v;
            switch(v){
                case 1: V.left = 0; break;
                case 2: V.right = 0; break;
                case 3: 
                    var w = this.getWidth();
                    V.left = w? "calc(50% - "+(w >> 1)+"px)" : "50%";
                    V.right = undefined; 
                    break;
            }
            this.setLayout(V.Layout.layout);
        };
        jUI.Layout.prototype.setVAlign = function(v){
            var V = this.__V;
            switch(v){
                case "^" : v = 1;  break;
                case "_" : v = 2;  break;
                case "-" : v = 3;  break;
            }
            V.Layout.valign = v;
            switch(v){
                case 1: V.top = 0; break;
                case 2: V.bottom = 0; break;
                case 3: 
                    var h = this.getHeight();
                    V.top = h? "calc(50% - "+(h >> 1)+"px)" : "50%";
                    V.bottom = undefined; 
                    break;
            }
            this.setLayout(V.Layout.layout);
        };
        jUI.Layout.prototype.setAV = function(v){
            this.setAlign(v[0]);
            this.setVAlign(v[1]);
        };
        jUI.Layout.prototype.setInnerAlign = function(v){
            var V = this.__V, ha, va, s = this._childrenAppendNode().style;
            V.Layout.innerAlign = v;
            switch(v&3){
                case 2: ha = "flex-end"; break;
                case 3: ha = "center"; break;
                default: ha = "flex-start"; break;
            }
            switch(v&12){
                case 8: va = "flex-end"; break;
                case 12: va = "center"; break;
                default: va = "flex-start"; break;
            }
            V.visible && this._setDisplayType(jUI.Layout._dtFlex);
            
            /* Internet Explorer 10 */ 
            s["-ms-flex-pack"] = ha;
            s["-ms-flex-align"] = va;

            /* Firefox */
            s["-moz-box-pack"] = ha;
            s["-moz-box-align"] = va;

            /* Safari, Opera, and Chrome */
            s["-webkit-box-pack"] = ha;
            s["-webkit-box-align"] = va;

            /* W3C */
            s["box-pack"] = ha;
            s["box-align"] = va;

            s["justify-content"] = ha; 
            s["align-items"] = va;
        };
        jUI.Layout.prototype.setZIndex = function(v){
            this.__V.el.style = v;
        };
        jUI.Layout.prototype.setEnabled = function(v){
            var V = this.__V;
            if(V.enabled === v) return;
            V.enabled = v;
            if(!v)
                this._appendToClassName("disabled");
            else
                this._removeFromClassName("disabled");
        };
        
        jUI.Layout.prototype.setPosition = function(l, t){
            this.setLeft(l);
            this.setTop(t);
        };
        /**
         * 
         * @param posOb {l:int | undefined,r:int | undefined,t:int | undefined,b:int | undefined}  
         *      all of the options are optional. 
         */
        jUI.Layout.prototype.setAnchor = function(posOb){
            for(var p in posOb){
                switch(p){
                    case "l":
                        this.setLeft(posOb[p]);
                        break;
                    case "r":
                        this.setRight(posOb[p]);
                        break;
                    case "t":
                        this.setTop(posOb[p]);
                        break;
                    case "b":
                        this.setBottom(posOb[p]);
                        break;
                }
            }
        };
        /**
         * 
         * @param posOb {{l:int | undefined,r:int | undefined,t:int | undefined,b:int | undefined} | int}  
         *      all of the options are optional. 
         */
        jUI.Layout.prototype.setMargin = function(posOb){
            var s = this.__V.el.style,mr;
            if(posOb != null && posOb instanceof Object){
                for(var p in posOb){
                    switch(p){
                        case "l":
                            mr = app.rtl? "margin-right":"margin-left";
                            break;
                        case "r":
                            mr = app.rtl? "margin-left":"margin-right" ;
                            break;
                        case "t":
                            mr = "margin-top" ;
                            break;
                        case "b":
                            mr = "margin-bottom" ;
                            break;
                    }
                    s[mr] = posOb[p] == null? null : +posOb[p]? posOb[p]+"px" : posOb[p];
                }
            }else{
                s.margin = s[mr] = posOb == null? null : +posOb? posOb+"px" : posOb;
            }
        };
        jUI.Layout.prototype.setMinWidth = function(v){
            var V = this.__V;
            V.minWidth = v;
            this._childrenAppendNode().style.minWidth = v? v+"px" : 0;
            this._setWidth(V.width);
        };
        jUI.Layout.prototype.setMaxWidth = function(v){
            var V = this.__V;
            V.maxWidth = v;
            this._childrenAppendNode().style.maxWidth = v === undefined? "none" : v+"px";
            this._setWidth(V.width);
        };
        jUI.Layout.prototype.setMinHeight = function(v){
            var V = this.__V;
            V.minHeight = v;
            this._childrenAppendNode().style.minHeight = v? v+"px" : 0;
            this._setHeight(V.height);
        };
        jUI.Layout.prototype.setMaxHeight = function(v){
            var V = this.__V;
            V.maxHeight = v;
            this._childrenAppendNode().style.maxHeight = v === undefined? "none" : v+"px";
            this._setHeight(V.height);
        };
        /**
         * 
         * @param pdOb {l:int | undefined,r:int | undefined,t:int | undefined,b:int | undefined}  
         *      all of the options are optional. 
         */
        jUI.Layout.prototype.setPadding = function(pdOb){ 
            var s = this.__V.el.style;
            var s = this.__V.el.style,mr;
            if(pdOb != null && pdOb instanceof Object){
                for(var p in pdOb){
                    switch(p){
                        case "l":
                            mr = app.rtl? "padding-right":"padding-left";
                            break;
                        case "r":
                            mr = app.rtl? "padding-left":"padding-right" ;
                            break;
                        case "t":
                            mr = "padding-top" ;
                            break;
                        case "b":
                            mr = "padding-bottom" ;
                            break;
                    }
                    s[mr] = pdOb[p] == null? null : +pdOb[p]? pdOb[p]+"px" : pdOb[p];
                }
            }else{
                s.padding = s[mr] = pdOb == null? null : +pdOb? pdOb+"px" : pdOb;
            }
        };
        jUI.Layout.prototype.setNoWrap = function(v){
            this.__V.el.style["white-space"] = v? "nowrap" : "inherit";
        };
        jUI.Layout.prototype._setDisplayType = function(v){
            var s = this.__V.el.style;
            switch(v){
                case jUI.Layout._dtNone: s.display = "none"; break;
                case jUI.Layout._dtInline: s.display = "inline-block"; break;
                case jUI.Layout._dtFlex: 
                    var innerS = this._childrenAppendNode().style;
                    if(s !== innerS){
                        s.display = "block";
                        s = innerS;
                    }
                    s.display = "flex"; 
                    if(s.display != "flex"){
                        /* W3C */
                        s.display = "box";
                        if(s.display != "box"){
                            /* Safari, Opera, and Chrome */
                            s.display = "-webkit-box";
                            if(s.display != "-webkit-box"){
                                /* Firefox */
                                s.display = "-moz-box";
                                if(s.display != "-moz-box") 
                                    /* Internet Explorer 10 */
                                    s.display = "-ms-flexbox";
                            }
                        }
                    }
                    break;
                default: s.display = "block";
            }
        };
        
        jUI.Layout.prototype._childrenAppendNode = function(){
            return this.__V.el;
        };
        jUI.Layout.prototype._addChild = function(ch){
            var V = this.__V,chs = V.Layout.children;
            if(chs.indexOf(ch) === -1){
                chs.push(ch);
                this._childrenAppendNode().insertBefore(ch.__V.el,null);
                ch.__V.Layout.parentForm = V.Layout.parentForm;
                return true;
            }
            return false;
        };
        jUI.Layout.prototype._removeChild = function(ch){
            var V = this.__V;
            if(V.Layout.children.remove(ch) !== -1){
                ch.__V.el.parentNode && ch.__V.el.parentNode.removeChild(ch.__V.el);
                ch.__V.Layout.parentForm = null;
                return true;
            }
            return false;
        };
        /**
         * The function will automatically set the parent for each child
         * to this Layout.
         * 
         * @param {[jUI.Layout]} chs array of childrens
         */
        jUI.Layout.prototype.addChildren = function(chs){
            for(var i=0,l=chs.length;i<l;++i)
                chs[i].setParent(this);
        };
        jUI.Layout.prototype.bringToFront = function(){
            var V = this.__V, e = V.el;
            if(!V.parent) return;
            var p = V.parent._childrenAppendNode();
            p.insertBefore(e,null); 
            V.parent.__V.Layout.children.moveLast(this);
        };
        jUI.Layout.prototype.sendBack = function(){
            var V = this.__V, e = V.el;
            if(!V.parent) return;
            var p = V.parent._childrenAppendNode(),fn = p.childNodes[0];
            if(fn != e){ 
                p.insertBefore(e,fn); 
                V.parent.__V.Layout.children.moveFirst(this);
            }
        };
        jUI.Layout.prototype.moveBefore = function(c){
            var V = this.__V, e = V.el, parent = V.parent;
            if(!parent || c === this || parent !== c.__V.parent) return;
            var p = parent._childrenAppendNode();
            p.insertBefore(e,c.__V.el); 
            parent.__V.Layout.children.moveBefore(this,c);
        };
        jUI.Layout.prototype.setParent = function(newParent){
            var V = this.__V, oldParent = V.parent;
            if(oldParent === newParent) return;
            V.parent = newParent;
            oldParent && oldParent._removeChild(this);
            newParent && newParent._addChild(this);
        };
        jUI.Layout.prototype.setVisible = function(v){
            var V = this.__V;
            if(V.visible === v) return;
            V.visible = v;
            this._setDisplayType(v ? this._getDisplayType() : jUI.Layout._dtNone);
            if(v){
                this._setHeight(V.height);
                this._setWidth(V.width);
            }
        };
        /**
         * 
         * @param {double} v 0-1
         */
        jUI.Layout.prototype.setOpacity = function(v){
            this.__V.el.style.opacity = v;
        };
        
        /**
         * @description setTabIndex to make the element focusable and get the keyboard events
         * 
         * @param {type} n
         */
        jUI.Layout.prototype.setTabIndex = function(n){
            (n && parseInt(n)) && (this.__V.el.tabIndex = n);
        };
        
        /**
         * @description Set focus to the focusable element
         * @returns {Boolean} Returns True if element got focus, false otherwise
         */
        jUI.Layout.prototype.setFocus = function(){
            try {
                this.__V.el.focus();
            }catch(err){
                return false;
            }
            return true;
        };
        
        /**
         * @param {int} flag 1: Horizontal, 2: Vertical, 3: Both
         * @param {int} extraSpace
         */
        jUI.Layout.prototype.fitContent = function(flag, extraSpace){ 
            var V = this.__V;
            if(!V.el.offsetParent) return;
            !flag && (flag = 3);
            !extraSpace && (extraSpace = 0);
            var cn = V.Layout.children, i=0,l=cn.length,cw=0,ch=0,nw,nh,c,ftc,al,val,cv;
            for(;i<l;++i){
                c = cn[i];
                cv = c.__V;
                if(cv.left !== undefined && cv.right !== undefined )
                    nw = (c.getMinWidth() || 0) + c.getLeft() + c.getRight();
                else if(cv.left === undefined){
                    nw = c.getWidth() + c.getRight();
                }else{
                    nw = c.getRightEdge();
                }
                if(cv.top !== undefined && cv.bottom!== undefined )
                    nh = (c.getMinHeight() || 0) + c.getTop() + c.getBottom();
                else if(cv.top === undefined){
                    nh = c.getHeight() + c.getBottom();
                }else{
                    nh = c.getBottomEdge();
                }
                if(cw < nw) cw = nw;
                if(ch < nh) ch = nh;
            }
            (flag & 1) && this.setWidth(cw + extraSpace);
            (flag & 2) && this.setHeight(ch + extraSpace);
        };
        /**
         * 
         * @param {type} ca Component array.
         * @param {type} left from which the alignment starts
         * @param {type} top from which the alignment starts
         * @param {type} horSpace space between compos 
         * @param {type} cw Column Widths, the minimum width of each column
         */
        jUI.Layout.prototype.arrangeHor = function(ca,left,top,horSpace,cw){ 
            !top && (top = 0);
            !left && (left = 0);
            !horSpace && (horSpace = 0);
            !cw && (cw = []);
            var i=0,ln=ca.length,l,w,f,mh=0,tw=0,h,c,a={top:top};
            
            for(l=left;i<ln;++i){
                f = 0, c = ca[i];
                if(c == undefined) w=0; 
                else if(typeof c  == "string"){ c = new jUI.Text({text:c,parent:this}); w = c.getWidth(); f = 1;}
                else if(+c) w = +c;
                else if(c instanceof Array) h = this.arrangeHor(c,l,top,horSpace), w = h.tw, h = h.mh;
                else{  w = c.getWidth(); f = 1; }
                cw[i] && cw[i] > w && (w = cw[i]);
                tw+=w;
                if(f){ 
                    a.left = l;
                    c.$(a);
                    h = c.getHeight();
                }
                (mh < h) && (mh = h);
                l += w + horSpace;
            }
            return {mh:mh,tw:tw};
        }
        /**
         * 
         * @param {type} ca Component array.
         * @param {type} left from which the alignment starts.
         * @param {type} top from which the alignment starts.
         * @param {type} verSpace space between compos
         * @param {type} rh Row Heights, the minimum height of each 
         */
        jUI.Layout.prototype.arrangeVer = function(ca,left,top,verSpace,rh){ 
            !top && (top = 0);
            !left && (left = 0);
            !verSpace && (verSpace = 0);
            !rh && (rh = []);
            var i=0,ln=ca.length,t=top,f,h,c,pa={left:left};
            for(;i<ln;++i){
                f = 0, c = ca[i];
                if(c == undefined) h=0; 
                else if(typeof c  == "string"){ c = new jUI.Text({text:c,parent:this}); h = c.getHeight(); f = 1;}
                else if(+c) h = +c;
                else{  h = c.getHeight(); f = 1; }
                if(f){ 
                    pa.top = t;
                    c.$(pa);
                }
                rh[i] && rh[i] > h &&  (h = rh[i]);
                t+=h+verSpace;
            }
            return t-top-(i?verSpace:0);
        };
        /**
         * 
         * @param {type} ca Component array.
         * @param {type} left from which the alignment starts. 
         * @param {type} top from which the alignment starts. 
         * @param {type} horSpace space between compos
         * @param {type} verSpace space between compos
         * @param {type} cw Column Widths, the minimum width of each column
         * @param {type} rh Row Heights, the minimum height of each 
         * @returns {jUI.__init__.Layout.__initClass__.jui-core_L1595}
         */
        jUI.Layout.prototype.arrangeGrid = function(ca,left,top,horSpace,verSpace,cw,rh){ 
            !top && (top = 0);
            !left && (left = 0);
            !horSpace && (horSpace = 0);
            !verSpace && (verSpace = 0);
            !rh && (rh = []);
            for(var i=0,ln=ca.length,t=top,info;i<ln;++i){
                if(+ca[i]){ t+=+ca[i]; continue; }
                info = this.arrangeHor(ca[i],left,t,horSpace,cw);
                t+=(rh[i] && rh[i] > info.mh? rh[i] : info.mh)+verSpace;
            }
        };


        jUI.Layout.prototype._getDisplayType = function(){
            return this.getInnerAlign() === jUI.Layout.ialNone? jUI.Layout._dtBlock : jUI.Layout._dtFlex;
        };
        jUI.Layout.prototype.getId = function(){
            return this.__V.el.id;
        };
        jUI.Layout.prototype.getClassName = function(){
            return this.__V.className[0];
        };
        jUI.Layout.prototype.getParent = function(){
            return this.__V.parent;
        };
        jUI.Layout.prototype.getVisible = function(){
            return this.__V.visible;
        };
        jUI.Layout.prototype.getLeft = function(){
            var V = this.__V, e = V.el, p = e.offsetParent;
            return p ? (app.rtl ? p.offsetWidth - e.offsetLeft - e.offsetWidth : e.offsetLeft) : V.left;
        };
        jUI.Layout.prototype.getRight = function(){
            var V = this.__V, e = V.el, p = e.offsetParent;
            return p ? (app.rtl ? e.offsetLeft : p.offsetWidth - e.offsetLeft - e.offsetWidth) : V.right;
        };
        jUI.Layout.prototype.getRightEdge = function(){
            return this.getLeft() + this.getWidth();
        };
        jUI.Layout.prototype.getTop = function(){
            var V = this.__V, e = V.el;
            return e.offsetParent ? e.offsetTop : V.top;
        };
        jUI.Layout.prototype.getBottom = function(){
            var V = this.__V, e = V.el, p = e.offsetParent;
            return p ? p.offsetHeight - e.offsetTop - e.offsetHeight : V.bottom;
        };
        jUI.Layout.prototype.getBottomEdge = function(){
            return this.getTop() + this.getHeight();
        };
        jUI.Layout.prototype.getWidth = function(){
            var V = this.__V;
            return V.el.offsetParent ? V.el.offsetWidth : V.width;
        };
        jUI.Layout.prototype.getHeight = function(){
            var V = this.__V;
            return V.el.offsetParent ? V.el.offsetHeight : V.height;
        };
        jUI.Layout.prototype.getInnerWidth = function(){
            return this.getWidth() - this.getHorPadding();
        };
        jUI.Layout.prototype.getHorPadding = function(){
            var V = this.__V;
            var leftPadding = window.getComputedStyle(V.el, null).getPropertyValue("padding-left"); 
            var rightPadding = window.getComputedStyle(V.el, null).getPropertyValue("padding-right"); 
            leftPadding = +leftPadding.substring(0,leftPadding.length-2);
            rightPadding = +rightPadding.substring(0,rightPadding.length-2);
            return leftPadding + rightPadding;
        };
        jUI.Layout.prototype.getInnerHeight = function(){
            return this.getHeight() - this.getVerPadding();
        };
        jUI.Layout.prototype.getVerPadding = function(){
            var V = this.__V;
            var topPadding = window.getComputedStyle(V.el, null).getPropertyValue("padding-top"); 
            var bottomPadding = window.getComputedStyle(V.el, null).getPropertyValue("padding-bottom"); 
            topPadding = +topPadding.substring(0,topPadding.length-2);
            bottomPadding = +bottomPadding.substring(0,bottomPadding.length-2);
            return topPadding + bottomPadding;
        };
        jUI.Layout.prototype.getAlign = function(){
                return this.__V.Layout.align;
        };
        jUI.Layout.prototype.getVAlign = function(){
                return this.__V.Layout.valign;
        };
        jUI.Layout.prototype.getInnerAlign = function(){
                return this.__V.Layout.innerAlign;
        };
        jUI.Layout.prototype.getElement = function(){
                return this.__V.el;
        };
        jUI.Layout.prototype.getCID = function(){
                return this.__V.CID;
        };
        jUI.Layout.prototype.getMinWidth = function(){return this.__V.Layout.minWidth;};
        jUI.Layout.prototype.getMinHeight= function(){return this.__V.Layout.minHeight;};
        jUI.Layout.prototype.getMaxWidth = function(){return this.__V.Layout.maxWidth;};
        jUI.Layout.prototype.getMaxHeight= function(){return this.__V.Layout.maxHeight;};
        jUI.Layout.prototype._getScrollLeft = function(){
            var v = this.__V.el.scrollLeft;
            return app.rtl ? -v : v;
        };
        jUI.Layout.prototype._getScrollTop = function(){
            return this.__V.el.scrollTop;
        };
        jUI.Layout.prototype.getAbsolutePosition = function(){
            var x = this.getLeft(), y = this.getTop(),c = this.__V.el.offsetParent;
            while(c !== document.body){
                x += c.offsetLeft; 
                y += c.offsetTop;
                x -= app.rtl ? -c.scrollLeft : c.scrollLeft;
                y -= c.scrollTop;
                c = c.offsetParent;
            }
            return {x:x,y:y};
        };
        jUI.Layout.prototype.toAbsoluteCoord = function(x, y){
            var c = this.__V.el;
            while(c !== document.body){
                x += c.offsetLeft; 
                y += c.offsetTop;
                x -= app.rtl ? -c.scrollLeft : c.scrollLeft;
                y -= c.scrollTop;
                c = c.offsetParent;
            }
            return {x:x,y:y};
        };
        jUI.Layout.prototype.toClientCoord = function(x, y){
            var p = this.__V.el;
            while(p){
                x -= p.offsetLeft; 
                y -= p.offsetTop;
                x += app.rtl ? -p.scrollLeft : p.scrollLeft;
                y += p.scrollTop;
                p = p.offsetParent;
            }
            return {x:x,y:y};
        };
        jUI.Layout.prototype.getParentForm = function(){
            return this.__V.Layout.parentForm;
        };
        jUI.Layout.prototype.getOpacity = function(){
            return this.__V.el.style.opacity;
        };
        jUI.Layout.prototype.getZIndex = function(){
            return this.__V.el.style;
        };
        jUI.Layout.prototype.getNoWrap = function(){
            return this.__V.el.style["white-space"] === "nowrap";
        };
        jUI.Layout.prototype.getEnabled = function(){
            return this.__V.el.enabled;
        };
        jUI.Layout.prototype.getChildren = function(){
            return this.__V.Layout.children;
        }
        
        
        app.$(jUI.Layout.prototype.__props = app.clone(jUI.Layout.prototype.__props), {
            id: "setId",
            className: "setClassName",
            classModifier: "_appendToClassName",
            parent: "setParent", 
            visible: "setVisible",
            left: "setLeft", 
            top: "setTop", 
            right:"setRight", 
            bottom: "setBottom", 
            width: "setWidth", 
            height: "setHeight", 
            anchor: "setAnchor",
            align: "setAlign",
            valign: "setVAlign",
            av: "setAV",
            minWidth: "setMinWidth",
            minHeight: "setMinHeight",
            maxWidth: "setMaxWidth",
            maxHeight: "setMaxHeight",
            margin: "setMargin",
            layout: "setLayout",
            opacity: "setOpacity",
            innerAlign: "setInnerAlign",
            zIndex: "setZIndex",
            children: "addChildren",
            padding: "setPadding",
            noWrap: "setNoWrap",
            enabled: "setEnabled",
            _style: "_style",
            tabIndex: "setTabIndex"
        });
        
        jUI.Layout.prototype.__events = jUI.Layout.prototype.__events.clone().concat([
            "mouseover",
            "mousedown",
            "mouseup",
            "mousemove",
            "click",
            "mouseout",
            "keypress",
            "keyup",
            "keydown",
            "focus",
            "blur",
            "drag",
            "dragStart",
            "dragStop"
        ]);
        
    })();
        
    //=================================================================================
    // Layout End 
    //=================================================================================

    // =================================================================================
    // Table Start 
    // =================================================================================
    
    /**
     * jUI.Table
     * 
     * @extends jUI.Layout
     * 
     * @param {json} pa {<br>
     *      structure: [<br>
     *          {rows:int, cols:int | [int colspans]} <br>
     *      ], <br>
     *      propsFor:[<br>
     *          {
     *              row: int, <br>
     *              col: int, <br>
     *              width: int | String %, <br>
     *              height: int | String %, <br>
     *              children: [jUI.Layout] <br>
     *          } <br>
     *      ]<br>
     * }
     * @constructor
     */
    jUI.Table = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui table",
            visible: true
        }, false);
        
        jUI.Layout.call(this,newPa,document.createElement("table"));
    };
    (function(){
        jUI.Table.prototype = new jUI.Layout({__loading__: true});
	jUI.Table.prototype.constructor = jUI.Table;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Table.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            var el = this.__V.el;
            el.cellSpacing = 0;
            el.cellPadding = 0;
        };
        
        jUI.Table.prototype.finalize = function(){
            jUI.Layout.prototype.finalize.call(this);
        };
        
        // Overriden Function End ===========================================
        /**
         * @param {[{rows:int, cols:int | [int colspans]}]} v 
         */
        jUI.Table.prototype.addStructure = function(v){
            var el = this.__V.el;
            v.forEach(function(val){
                var r = val.rows, c = val.cols,row,cell;
                for(var j=1;j<=r;++j){
                    row = el.insertRow(-1);
                    for(var k=0,l=+c||c.length;k<l;++k){
                        cell = row.insertCell(-1);
                        !+c && (cell.colSpan = ""+c[k]);
                    }
                }
            });
        };
        /**
         * @param {jUI.Table.CellProps} v { <br>
         *      row: int, <br>
         *      col: int, <br>
         *      width: int | String %, <br>
         *      height: int | String %, <br>
         *      children: [jUI.Layout] <br>
         *  }
         */
        jUI.Table.prototype.setPropsFor = function(v){
            var el = this.__V.el, cell;
            v.forEach(function(val){
                cell = el.rows[val.row].cells[val.col];
                if(val.width !== undefined){
                    cell.style.width = val.width + (+val.width? "px" : "");
                }
                if(val.height !== undefined){
                    cell.style.height = val.height + (+val.height ? "px" : "");
                }
                if(val.children !== undefined){
                    val.children.forEach(function(ch){ 
                        ch.__V.el.style.position = "relative";
                        cell.appendChild(ch.__V.el); 
                    });
                }
            });
        };
        /**
         * @param {function(cell, row, col)} v
         */
        jUI.Table.prototype.forEach = function(v){
            var el = this.__V.el, row;
            for(var i=0,l=el.rows.length;i<l;++i){
                row = el.rows[i];
                for(var j=0,jl=row.cells.length;j<jl;++j){
                    v(row.cells[j],i,j);
                }
            }
        };
        
        
        app.$(jUI.Table.prototype.__props = app.clone(jUI.Table.prototype.__props), {
            structure: "addStructure",
            propsFor: "setPropsFor"
        });
        
        jUI.Table.prototype.__events = jUI.Table.prototype.__events.clone().concat([
        ]);
        
    })();
    
    // =================================================================================
    // Table End
    // =================================================================================
    
    
    
    // =================================================================================
    // DBComponent Start 
    // =================================================================================
    
    /**
     * jUI.DBComponent
     * 
     * @extends jUI.Layout
     * 
     * @param {json} pa {<br>
     *      name: String, <br>
     *      value: String, <br>
     *      dataset: jUI.Dataset, <br>
     *      dataField: String, <br>
     *      required: boolean (defalut false), <br>
     *      errorText: String <br>,
     *      events: { <br>
     *          checkRequirement: function() -> boolean <br>
     *      }<br>
     * }
     * @param {DomElement} _element (optional) The underlying DomElement 
     * that will be used for this Layout.
     * @constructor
     */
    jUI.DBComponent = function(pa, _element){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui dbcomponent",
            visible: true
        }, false);
        if(newPa.value !== undefined){
            // Move the value property to the end.
            var val = newPa.value;
            delete newPa.value;
            newPa.value = val;
        }
        
        jUI.Layout.call(this,newPa,_element);
        this._updateValue(this.getDataset());
    };
    (function(){
        jUI.DBComponent.prototype = new jUI.Layout({__loading__: true});
        jUI.DBComponent.prototype.constructor = jUI.DBComponent;
        
        
        // Overriden Function Start ===========================================
        
        jUI.DBComponent.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            this.__V.DBComponent = {
                dataset: null,
                dataField: null,
                required: false,
                errorText: null
            };
        };
        
        jUI.DBComponent.prototype.setEnabled = function(v){
            jUI.Layout.prototype.setEnabled.call(this, v);
            this.__V.el.disabled = !v;
        };
        jUI.DBComponent.prototype.finalize = function(){
            this.setDataset(null);
            delete this.__V.DBComponent.dataset;
            jUI.Layout.prototype.finalize.call(this);
        };
        
        // Overriden Function End ===========================================
        
        jUI.DBComponent.prototype.setName = function(v){
            this.__V.el.name = v;
        };
        jUI.DBComponent.prototype.setValue = function(v){
            this.__V.el.value = v;
        };
        /**
         * @param {jUI.Dataset} v
         */
        jUI.DBComponent.prototype.setDataset= function(v){
            var V = this.__V.DBComponent;
            V.dataset && V.dataset.removeDBComponent(this);
            V.dataset = v;
            v && V.dataset.addDBComponent(this);
            this._doDatasetRefresh();
        };
        jUI.DBComponent.prototype.setDataField = function(v){
            this.__V.DBComponent.dataField = v;
            this._doDatasetRefresh();
        };
        jUI.DBComponent.prototype.setRequired = function(v){
            this.__V.DBComponent.required = v;
        };
        jUI.DBComponent.prototype.setErrorText = function(v){
            this.__V.DBComponent.errorText = v;
        };
        /**
         * @returns {Boolean}
         */
        jUI.DBComponent.prototype.checkRequirements = function(){
            var valid = true;
            if(!this.getEnabled()) return true;
            this._doEventWithCallback("checkRequirement", function(retVal){
                valid &= retVal !== false;
            });
            return valid && (!this.getRequired() || this.getValue() != null);
        };
        
        jUI.DBComponent.prototype.getName = function(){
            return this.__V.el.name;
        };
        jUI.DBComponent.prototype.getValue = function(){
            return this.__V.el.value;
        };
        /**
         * @returns {jUI.Dataset}
         */
        jUI.DBComponent.prototype.getDataset= function(){
            return this.__V.DBComponent.dataset;
        };
        jUI.DBComponent.prototype.getDataField = function(){
            return this.__V.DBComponent.dataField;
        };
        jUI.DBComponent.prototype.getRequired = function(){
            return this.__V.DBComponent.required;
        };
        jUI.DBComponent.prototype.getErrorText = function(){
            return this.__V.DBComponent.errorText;
        };
        
        jUI.DBComponent.prototype._updateValue = function(dataset){
            var ds = this.getDataset(), df = this.getDataField();
            ds && df && ds.getMode() !== jUI.dsmAdd && this.setValue(ds.f(df));
        };
        
        jUI.DBComponent.prototype._doDatasetReady = function(dataset){
            
        };
        jUI.DBComponent.prototype._doDatasetRefresh = function(dataset){
            this._updateValue(dataset);
        };
        jUI.DBComponent.prototype._doDataChanged = function(dataset){
            this._updateValue(dataset);
        };
        jUI.DBComponent.prototype._doDataUpdate = function(dataset,from, to){
            this._updateValue(dataset);
        };
        jUI.DBComponent.prototype._doDataAdded = function(dataset,from ,to){
            this._updateValue(dataset);
        };
        jUI.DBComponent.prototype._doBeforeDataDeleted = function(dataset,from ,to){
            
        };
        jUI.DBComponent.prototype._doDataDeleted = function(dataset,from ,to){
            this._updateValue(dataset);
        };
        jUI.DBComponent.prototype._doModeChanged = function(dataset,mode){
            this._updateValue(dataset);
        };
        jUI.DBComponent.prototype._dataSaved = function(){
            
        };
        
        
        app.$(jUI.DBComponent.prototype.__props = app.clone(jUI.DBComponent.prototype.__props), {
            name: "setName",
            value: "setValue",
            dataset: "setDataset",
            dataField: "setDataField",
            required: "setRequired",
            errorText: "setErrorText"
        });
        
        jUI.DBComponent.prototype.__events = jUI.DBComponent.prototype.__events.clone().concat([
            "checkRequirement"
        ]);
        
    })();
    
    // =================================================================================
    // DBComponent End
    // =================================================================================
    
    // =================================================================================
    // Canvas Start 
    // =================================================================================
    
    /**
     * @TODO    jUI.Canvas.addGradient, and jUI.Canvas._Element.setGradient
     * 
     * @extends jUI.DBComponent
     * 
     * @param {json} pa {<br>
     *      parent: jUI.Canvas,<br>
     *      fill: String color | undefined, <br>
     *      stroke: String color | undefined, <br>
     *      strokeWidth: double,<br>
     *      strokeOpacity: double 0-1<br>
     *      fillOpacity: double 0-1 <br>
     * }
     * @constructor
     */
    jUI.Canvas = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            visible: true,
            className: "jui canvas"
        }, false);
        
        var c = jUI.Canvas._createNode("svg");
        app.setAttributes(c,{ 
            xmlns: "http://www.w3.org/2000/svg", 
            version: "1.1",
            "shape-rendering": "geometricPrecision"
        });
        
        jUI.DBComponent.call(this, newPa, c);
    };
    (function(){
        jUI.Canvas.prototype = new jUI.DBComponent({__loading__: true});
	jUI.Canvas.prototype.constructor = jUI.Canvas;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Canvas.prototype._initProp = function(pa){
            jUI.DBComponent.prototype._initProp.call(this, pa);
            
            var V = this.__V;
            
            var defs = jUI.Canvas._createNode("defs");
            V.el.appendChild(defs);
            
            this.__V.Canvas = {
                gradients:{},
                defs: defs,
                fill: undefined,
                stroke: undefined,
                strokeWidth: undefined,
                strokeOpacity: undefined,
                fillOpacity: undefined
            };
        };
        
        // Overriden Function End ===========================================
        /**
         * c: Canvas, gpa: {id,angle,gradient string}
         * @param {type} c
         * @param {type} gpa
         * @returns {undefined}
         */
        jUI.Canvas.prototype.addGradient = function(c,gpa){
            if(!gpa[0]) return;
            gpa[1] = +gpa[1];
            var g = ce.createNode("linearGradient"),rad = gpa[1] * Math.PI / 180, v = [0, 0, Math.cos(rad), Math.sin(rad)],
                            mx = 1 / (Math.max(Math.abs(v[2]), Math.abs(v[3])) || 1),id,oldGrd = c.gradients[gpa[0]];
            v[2] *= mx;
            v[3] *= mx;
            if (v[2] < 0) { v[0] = -v[2]; v[2] = 0;	}
            if (v[3] < 0) {	v[1] = -v[3]; v[3] = 0;	}

            id = gpa[0]+"_"+(++ce.GID);
            app.setAttribute(g,{id:id,x1:v[0],y1:v[1],x2:v[2],y2:v[3]});
            c.defs.appendChild(g);

            var stps = gpa[2].split(";"),stp,stplen,att,s;
            for(stp=0,stplen=stps.length;stp<stplen;++stp){
                    att = stps[stp].split(",");
                    s = ce.createNode("stop");
                    app.setAttribute(s,{offset:att[0],"stop-color":att[1],"stop-opacity":(att[2]?att[2]:1)}); 
                    g.appendChild(s);
            }

            if(oldGrd){ 
                    c.defs.removeChild(oldGrd[1]); 
                    var cpa = oldGrd[2], i=0, l=cpa.length;
                    for(;i<l;++i) cpa[i].style.fill = "url(#"+id+")";
                    oldGrd[0] = id; oldGrd[1] = g;
            }else c.gradients[gpa[0]] = [id,g,[]];
        };
        jUI.Canvas.prototype.playAnimations = function(){
            this.__V.el.unpauseAnimations();
        };
        jUI.Canvas.prototype.stopAnimations = function(){
            this.__V.el.pauseAnimations();
        };
        
        jUI.Canvas.prototype._applyToAllElements = function(pa){
            var V = this.__V, chs = V.Layout.children;
            for(var i=0,l=chs.length,ch;i<l;++i){
                ch = chs[i];
                if(ch instanceof jUI.Canvas._Element)
                    ch.$(pa);
            }
        };
        jUI.Canvas.prototype.setFill = function(v){
            this._applyToAllElements({fill:v});
            this.__V.Canvas.fill = v;
        };
        jUI.Canvas.prototype.setFillOpacity = function(v){
            this._applyToAllElements({fillOpacity:v});
            this.__V.Canvas.fillOpacity = v;
        };
        jUI.Canvas.prototype.setStroke = function(v){
            this._applyToAllElements({stroke:v});
            this.__V.Canvas.stroke = v;
        };
        jUI.Canvas.prototype.setStrokeOpacity= function(v){
            this._applyToAllElements({strokeOpacity:v});
            this.__V.Canvas.strokeOpacity = v;
        };
        jUI.Canvas.prototype.setStrokeWidth = function(v){
            this._applyToAllElements({strokeWidth:v});
            this.__V.Canvas.strokeWidth = v;
        };
        
        
        jUI.Canvas.prototype.getFill = function(v){
            return this.__V.Canvas.fill;
        };
        jUI.Canvas.prototype.getFillOpacity = function(v){
            return this.__V.Canvas.fillOpacity;
        };
        jUI.Canvas.prototype.getStroke = function(v){
            return this.__V.Canvas.stroke;
        };
        jUI.Canvas.prototype.getStrokeOpacity= function(v){
            return this.__V.Canvas.strokeOpacity;
        };
        jUI.Canvas.prototype.getStrokeWidth = function(v){
            return this.__V.Canvas.strokeWidth;
        };
        
        jUI.Canvas._createNode = function(type){
            return document.createElementNS("http://www.w3.org/2000/svg", type);
        };
        /**
         * 
         * @param {int} r
         * @param {int} g
         * @param {int} b
         * @returns {h:double,s:double,l:double}
         */
        jUI.Canvas.rgbToHsl = function(r, g, b){
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b),h, s, l = (max + min) / 2;
            if(max == min){
                h = s = 0; 
            }else{
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max){
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return {h:h,s:s,l:l};
        };
        jUI.Canvas.hueTorgb = function(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        /**
         * 
         * @param {int} h
         * @param {int} s
         * @param {int} l
         * @returns {String} rgb representation.
         */
        jUI.Canvas.hslToRgb = function(h, s, l){
            var r, g, b;
            if(s == 0){
                    r = g = b = l;
            }else{
                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s,p = 2 * l - q;
                    r = ce.hue2rgb(p, q, h + 1/3);
                    g = ce.hue2rgb(p, q, h);
                    b = ce.hue2rgb(p, q, h - 1/3);
            }
            var rgb = {r:Math.floor(r * 255),g:Math.floor(g * 255),b:Math.floor(b * 255)};
            rgb.hex = "#"+(0x1000000|(rgb.r<<16)|(rgb.g<<8)|rgb.b).toString(16).slice(1);
            return rgb;
        };
        /**
         * 
         * @param {int} r 0-255
         * @param {int} g 0-255
         * @param {int} b 0-255
         * @returns {h:double,s:double,v:double}
         */
        jUI.Canvas.rgbToHsv = function(r, g, b){
            r = r/255, g = g/255, b = b/255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b),h, v = max,d = max - min,s = max == 0 ? 0 : d / max;
            if(max == min){
                h = 0;
            }else{
                switch(max){
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return {h:h,s:s,v:v};
        };
        /**
         * 
         * @param {int} h
         * @param {int} s
         * @param {int} v
         * @returns {String} rgp representation.
         */
        jUI.Canvas.hsvToRgb = function(h, s, v){
            var r, g, b,i = Math.floor(h * 6),f = h * 6 - i,p = v * (1 - s),q = v * (1 - f * s),t = v * (1 - (1 - f) * s);
            switch(i % 6){
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }
            var rgb = {r:Math.floor(r * 255),g:Math.floor(g * 255),b:Math.floor(b * 255)};
            rgb.hex = "#"+(0x1000000|(rgb.r<<16)|(rgb.g<<8)|rgb.b).toString(16).slice(1);
            return rgb;
        };
        /**
         * 
         * @param {int} x
         * @param {int} y
         * @param {int} angle degree
         * @returns {x:double, y:double} the new rorated coordinates.
         */
        jUI.Canvas.rotate = function(x,y,angle){
            angle = Math.PI/180*angle;
            var s = Math.sin(angle),c = Math.cos(angle);
            return {x:((x*c-y*s)),y:((x*s+y*c))};
        };
        
        
        
        app.$(jUI.Canvas.prototype.__props = app.clone(jUI.Canvas.prototype.__props), {
            fill: "setFill",
            stroke: "setStroke",
            strokeWidth: "setStrokeWidth",
            strokeOpacity: "setStrokeOpacity",
            fillOpacity: "setFillOpacity"
        });
        
        jUI.Canvas.prototype.__events = jUI.Canvas.prototype.__events.clone().concat([
        ]);
        
        
    })();
    
    /**
     * Abstract class
     * jUI.Canvas._Element inherits from jUI.Layout.
     * 
     * @param {json} pa { <br>
     *      parent: jUI.Canvas,<br>
     *      fill: String color | undefined, <br>
     *      stroke: String color | undefined, <br>
     *      strokeWidth: double,<br>
     *      strokeOpacity: double 0-1<br>
     *      fillOpacity: double 0-1 <br>
     * }
     * @param {NSDomElement} _element svg DOM element
     */
    jUI.Canvas._Element = function(pa, _element){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            left:0,
            top:0,
            width:0,
            height:0,
            visible: true,
            fill: undefined
        }, false);
        jUI.Layout.call(this, newPa, _element);
    };
    (function(){
        jUI.Canvas._Element.prototype = new jUI.Layout({__loading__: true});
	jUI.Canvas._Element.prototype.constructor = jUI.Canvas._Element;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Canvas._Element.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            this.__V.CanvasElement = {
            };
        };
        
        jUI.Canvas._Element.prototype.setParent = function(v){
            if(v instanceof jUI.Canvas)
                jUI.Layout.prototype.setParent.call(this, v);
        };
        
        jUI.Canvas._Element.prototype._setLeft = function(v){
            v = v || 0;
            var V = this.__V;
            V.el.setAttribute("x", v);
            V.left = v;
        };
        jUI.Canvas._Element.prototype._setTop = function(v){
            v = v || 0;
            var V = this.__V;
            V.el.setAttribute("y", v);
            V.top = v;
        };
        jUI.Canvas._Element.prototype._setRight = function(v){
        };
        jUI.Canvas._Element.prototype._setBottom = function(v){
        };
        jUI.Canvas._Element.prototype._setWidth = function(v){
            v = v || 0;
            var V = this.__V,_V = V.Layout,mx = _V.maxWidth,mn = _V.minWidth,e = V.el;
            if(v < 0) v = 0;
            mn && v < mn && (v = mn);
            mx && v > mx && (v = mx);
            V.el.setAttribute("width", v);
            V.width = v;
        };
        jUI.Canvas._Element.prototype._setHeight = function(v){
            v = v || 0;
            var V = this.__V,_V = V.Layout,mx = _V.maxHeight,mn = _V.minHeight,e = V.el;
            if(v < 0) v = 0;
            mn && v < mn && (v = mn);
            mx && v > mx && (v = mx);
            V.el.setAttribute("height", v);
            V.height = v;
        };
        
        // Overriden Function End ===========================================
        jUI.Canvas._Element.prototype.setGradient = function(v){
            if(pa.gradient && o.cnv){
                    if(oldGr) o.cnv.gradients[oldGr][2].remove(o);
                    var g = o.cnv.gradients[pa.gradient];
                    if(!g) ce.addGradient(o.cnv,[pa.gradient,0,"0%,#000000"]);
                    else{ 
                            o.style.fill = "url(#"+g[0]+")"; 
                            o.setAttribute("fill","url(#"+g[0]+")");
                    }
                    o.cnv.gradients[pa.gradient][2].push(o);
                }else{
                    o.style.fill = "";
                    o.setAttribute("fill",o.cfc==undefined?'none':o.cfc);
                    if(oldGr && o.cnv && o.cnv.gradients[oldGr]) o.cnv.gradients[oldGr][2].remove(o);
                }
        }
        
        /**
         * @param {String} v color str or "none" if opeque color is 
         * needed. to unset the fill, send null.
         */
        jUI.Canvas._Element.prototype.setFill = function(v){
            if(v) 
                this.__V.el.style.fill = v;
            else
                delete this.__V.el.style.fill;
        };
        /**
         * @param {String} v color str or "none" if opeque color is 
         * needed. to unset the stroke, send null.
         */
        jUI.Canvas._Element.prototype.setStroke = function(v){
            if(v) 
                this.__V.el.style.stroke = v;
            else
                delete this.__V.el.style.stroke;
        };
        jUI.Canvas._Element.prototype.setStrokeWidth = function(v){
            this.__V.el.style.strokeWidth = v;
        };
        jUI.Canvas._Element.prototype.setStrokeOpacity = function(v){
            this.__V.el.style.strokeOpacity = v;
        };
        jUI.Canvas._Element.prototype.setFillOpacity = function(v){
            this.__V.el.style.fillOpacity = v;
        };
        
        
        jUI.Canvas._Element.prototype.getFill = function(){
            var f = this.__V.el.style.fill;
            return f === "none" ? undefined : f;
        };
        jUI.Canvas._Element.prototype.getStroke = function(){
            var s = this.__V.el.style.stroke;
            return s === "none" ? undefined : s;
        };
        jUI.Canvas._Element.prototype.getStrokeWidth = function(){
            return this.__V.el.style.strokeWidth;
        };
        jUI.Canvas._Element.prototype.getStrokeOpacity = function(){
            return this.__V.el.style.strokeOpacity;
        };
        jUI.Canvas._Element.prototype.getFillOpacity = function(){
            return this.__V.el.style.fillOpacity;
        };
        
        
        
        app.$(jUI.Canvas._Element.prototype.__props = app.clone(jUI.Canvas._Element.prototype.__props), {
            fill: "setFill",
            stroke: "setStroke",
            strokeWidth: "setStrokeWidth",
            strokeOpacity: "setStrokeOpacity",
            fillOpacity: "setFillOpacity"
        });
        
        jUI.Canvas._Element.prototype.__events = jUI.Canvas._Element.prototype.__events.clone().concat([
        ]);
        
    })();
    
    
    /**
     * Abstract class
     * jUI.Canvas.Animation inherits from jUI.Layout.
     * 
     * @param {json} pa { <br>
     *      parent: jUI.Canvas._Element,<br>
     *      attributeName: "transform", <br>
     *      type: "rotate", <br>
     *      from: String ,<br>
     *      to: String,<br>
     *      duration: double 0-1,<br>
     *      repeatCount: int | "indefinite"  <br>
     * }
     * @param {NSDomElement} _element svg DOM element
     */
    jUI.Canvas.Animation = function(pa){
        if(pa && pa.__loading__) return;
        jUI.Layout.call(this, pa, jUI.Canvas._createNode("animateTransform"));
    };
    (function(){
        jUI.Canvas.Animation.prototype = new jUI.Layout({__loading__: true});
	jUI.Canvas.Animation.prototype.constructor = jUI.Canvas.Animation;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Canvas.Animation.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            this.__V.CanvasAnimation = {
                
            };
            this.__V.el.setAttribute("attributeType", "xml");
        };
        
        jUI.Canvas.Animation.prototype.setParent = function(v){
            if(v instanceof jUI.Canvas._Element)
                jUI.Layout.prototype.setParent.call(this, v);
        };
        
        jUI.Canvas.Animation.prototype._setLeft = function(v){
        };
        jUI.Canvas.Animation.prototype._setTop = function(v){
        };
        jUI.Canvas.Animation.prototype._setRight = function(v){
        };
        jUI.Canvas.Animation.prototype._setBottom = function(v){
        };
        jUI.Canvas.Animation.prototype._setWidth = function(v){
        };
        jUI.Canvas.Animation.prototype._setHeight = function(v){
        };
        
        // Overriden Function End ===========================================
        jUI.Canvas.Animation.prototype.setAttributeName = function(v){
            this.__V.el.setAttribute("attributeName", v);
        };
        jUI.Canvas.Animation.prototype.setType = function(v){
            this.__V.el.setAttribute("type", v);
        };
        jUI.Canvas.Animation.prototype.setFrom = function(v){
            this.__V.el.setAttribute("from", v);
        };
        jUI.Canvas.Animation.prototype.setTo = function(v){
            this.__V.el.setAttribute("to", v);
        };
        jUI.Canvas.Animation.prototype.setDuration = function(v){
            this.__V.el.setAttribute("dur", v);
        };
        jUI.Canvas.Animation.prototype.setRepeatCount = function(v){
            this.__V.el.setAttribute("repeatCount", v);
        };
        
        
        jUI.Canvas.Animation.prototype.getAttributeName = function(){
            this.__V.el.getAttribute("attributeName");
        };
        jUI.Canvas.Animation.prototype.getType = function(){
            this.__V.el.getAttribute("type");
        };
        jUI.Canvas.Animation.prototype.getFrom = function(){
            this.__V.el.getAttribute("from");
        };
        jUI.Canvas.Animation.prototype.getTo = function(){
            this.__V.el.getAttribute("to");
        };
        jUI.Canvas.Animation.prototype.getDuration = function(){
            this.__V.el.getAttribute("dur");
        };
        jUI.Canvas.Animation.prototype.getRepeatCount = function(){
            this.__V.el.getAttribute("repeatCount");
        };
        
        
        
        app.$(jUI.Canvas.Animation.prototype.__props = app.clone(jUI.Canvas.Animation.prototype.__props), {
            attributeName: "setAttributeName",
            type: "setType",
            from: "setFrom",
            to: "setTo",
            duration: "setDuration",
            repeatCount: "setRepeatCount"
        });
        
        jUI.Canvas.Animation.prototype.__events = jUI.Canvas.Animation.prototype.__events.clone().concat([
        ]);
        
    })();
    
    /**
     * jUI.Canvas.Rect inherits from jUI.Canvas._Element.
     * 
     * @param {json} pa { <br>
     *      radiusX: double corner radius x, <br>
     *      radiusY: double corner radius y <br>
     * }
     */
    jUI.Canvas.Rect = function(pa){
        if(pa && pa.__loading__) return;
        var c = jUI.Canvas._createNode("rect");
        jUI.Canvas._Element.call(this, pa, c);
    };
    (function(){
        jUI.Canvas.Rect.prototype = new jUI.Canvas._Element({__loading__: true});
	jUI.Canvas.Rect.prototype.constructor = jUI.Canvas.Rect;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Canvas.Rect.prototype._initProp = function(pa){
            jUI.Canvas._Element.prototype._initProp.call(this, pa);
            this.__V.CanvasRect = {
                radiusX: 0,
                radiusY: 0
            };
        };
        
        // Overriden Function End ===========================================
        
        jUI.Canvas.Rect.prototype.setRadiusX = function(v){
            this.__V.el.setAttribute("rx", v);
            this.__V.CanvasRect.radiusX = v;
        };
        jUI.Canvas.Rect.prototype.setRadiusY = function(v){
            this.__V.el.setAttribute("ry", v);
            this.__V.CanvasRect.radiusY = v;
        };
        
        
        jUI.Canvas.Rect.prototype.getRadiusX = function(){
            return this.__V.CanvasRect.radiusX;
        };
        jUI.Canvas.Rect.prototype.getRadiusY = function(){
            return this.__V.CanvasRect.radiusY;
        };
        
        
        
        app.$(jUI.Canvas.Rect.prototype.__props = app.clone(jUI.Canvas.Rect.prototype.__props), {
            radiusX: "setRadiusX",
            radiusY: "setRadiusY"
        });
        
        jUI.Canvas.Rect.prototype.__events = jUI.Canvas.Rect.prototype.__events.clone().concat([
        ]);
        
    })();
    
    /**
     * jUI.Canvas.Circle inherits from jUI.Canvas._Element.
     * 
     * @param {json} pa { <br>
     *      radius: double radius, <br>
     *      centerX: int center X <br>
     *      centerY: int center y <br>
     * }
     */
    jUI.Canvas.Circle = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            radius: 0,
            centerX: 0,
            centerY: 0
        }, false);
        var c = jUI.Canvas._createNode("circle");
        jUI.Canvas._Element.call(this, newPa, c);
    };
    (function(){
        jUI.Canvas.Circle.prototype = new jUI.Canvas._Element({__loading__: true});
	jUI.Canvas.Circle.prototype.constructor = jUI.Canvas.Circle;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Canvas.Circle.prototype._initProp = function(pa){
            jUI.Canvas._Element.prototype._initProp.call(this, pa);
            this.__V.CanvasCircle = {
                radius: 0,
                centerX: 0,
                centerY: 0
            };
        };
        
        jUI.Canvas.Circle.prototype._setLeft = function(v){
            //v = v || 0;
            //this.setCenterX(v + this.__V.CanvasCircle.radius);
        };
        jUI.Canvas.Circle.prototype._setTop = function(v){
            //v = v || 0;
            //this.setCenterY(v + this.__V.CanvasCircle.radius);
        };
        jUI.Canvas.Circle.prototype._setWidth = function(v){
            /*
            v = v || 0;
            var V = this.__V,_V = V.Layout,mx = _V.maxWidth,mn = _V.minWidth;
            if(v < 0) v = 0;
            mn && v < mn && (v = mn);
            mx && v > mx && (v = mx);
            this.setRadius(v >> 1);
            */
        };
        jUI.Canvas.Circle.prototype._setHeight = function(v){
            /*
            v = v || 0;
            var V = this.__V,_V = V.Layout,mx = _V.maxHeight,mn = _V.minHeight;
            if(v < 0) v = 0;
            mn && v < mn && (v = mn);
            mx && v > mx && (v = mx);
            this.setRadius(v >> 1);
            */
        };
        
        
        jUI.Canvas.Circle.prototype.getLeft = function(){
            return this.getCenterX() - this.getRadius();
        };
        jUI.Canvas.Circle.prototype.getTop = function(){
            return this.getCenterY() - this.getRadius();
        };
        jUI.Canvas.Circle.prototype.getWidth = jUI.Canvas.Circle.prototype.getHeight = function(){
            return this.getRadius() << 1;
        };
        
        // Overriden Function End ===========================================
        
        jUI.Canvas.Circle.prototype.setRadius = function(v){
            v = v || 0;
            var V = this.__V;
            V.el.setAttribute("r", v);
            V.CanvasCircle.radius = v;
        };
        jUI.Canvas.Circle.prototype.setCenterX = function(v){
            v = v || 0;
            var V = this.__V;
            V.el.setAttribute("cx", v);
            V.CanvasCircle.centerX = v;
        };
        jUI.Canvas.Circle.prototype.setCenterY = function(v){
            v = v || 0;
            var V = this.__V;
            V.el.setAttribute("cy", v);
            V.CanvasCircle.centerY = v;
        };
        
        
        jUI.Canvas.Circle.prototype.getRadius = function(){
            return this.__V.CanvasCircle.radius;
        };
        jUI.Canvas.Circle.prototype.getCenterX = function(){
            return this.__V.CanvasCircle.centerX;
        };
        jUI.Canvas.Circle.prototype.getCenterY = function(){
            return this.__V.CanvasCircle.centerY;
        };
        
        
        app.$(jUI.Canvas.Circle.prototype.__props = app.clone(jUI.Canvas.Circle.prototype.__props), {
            radius: "setRadius",
            centerX: "setCenterX",
            centerY: "setCenterY"
        });
        
        jUI.Canvas.Circle.prototype.__events = jUI.Canvas.Circle.prototype.__events.clone().concat([
        ]);
        
    })();
    
    /**
     * jUI.Canvas.Ellipse inherits from jUI.Canvas._Element.
     * 
     * @param {json} pa { <br>
     *      radiusX: double radius X, <br>
     *      radiusX: double radius Y, <br>
     *      centerX: int center X <br>
     *      centerY: int center y <br>
     * }
     */
    jUI.Canvas.Ellipse = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            radiusX: 0,
            radiusY: 0,
            centerX: 0,
            centerY: 0
        }, false);
        var c = jUI.Canvas._createNode("ellipse");
        jUI.Canvas._Element.call(this, newPa, c);
    };
    (function(){
        jUI.Canvas.Ellipse.prototype = new jUI.Canvas._Element({__loading__: true});
	jUI.Canvas.Ellipse.prototype.constructor = jUI.Canvas.Ellipse;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Canvas.Ellipse.prototype._initProp = function(pa){
            jUI.Canvas._Element.prototype._initProp.call(this, pa);
            this.__V.CanvasEllipse = {
                radiusX: 0,
                radiusY: 0,
                centerX: 0,
                centerY: 0
            };
        };
        
        jUI.Canvas.Ellipse.prototype._setLeft = function(v){
            //v = v || 0;
            //this.setCenterX(v + this.__V.CanvasCircle.radius);
        };
        jUI.Canvas.Ellipse.prototype._setTop = function(v){
            //v = v || 0;
            //this.setCenterY(v + this.__V.CanvasCircle.radius);
        };
        jUI.Canvas.Ellipse.prototype._setWidth = function(v){
            /*
            v = v || 0;
            var V = this.__V,_V = V.Layout,mx = _V.maxWidth,mn = _V.minWidth;
            if(v < 0) v = 0;
            mn && v < mn && (v = mn);
            mx && v > mx && (v = mx);
            this.setRadius(v >> 1);
            */
        };
        jUI.Canvas.Ellipse.prototype._setHeight = function(v){
            /*
            v = v || 0;
            var V = this.__V,_V = V.Layout,mx = _V.maxHeight,mn = _V.minHeight;
            if(v < 0) v = 0;
            mn && v < mn && (v = mn);
            mx && v > mx && (v = mx);
            this.setRadius(v >> 1);
            */
        };
        
        
        jUI.Canvas.Ellipse.prototype.getLeft = function(){
            return this.getCenterX() - this.getRadiusX();
        };
        jUI.Canvas.Ellipse.prototype.getTop = function(){
            return this.getCenterY() - this.getRadiusY();
        };
        jUI.Canvas.Ellipse.prototype.getWidth = function(){
            return this.getRadiusX() << 1;
        };
        
        jUI.Canvas.Ellipse.prototype.getHeight = function(){
            return this.getRadiusY() << 1;
        };
        
        // Overriden Function End ===========================================
        
        jUI.Canvas.Ellipse.prototype.setRadiusX = function(v){
            v = v || 0;
            var V = this.__V;
            V.el.setAttribute("rx", v);
            V.CanvasEllipse.radiusX = v;
        };
        jUI.Canvas.Ellipse.prototype.setRadiusY = function(v){
            v = v || 0;
            var V = this.__V;
            V.el.setAttribute("ry", v);
            V.CanvasEllipse.radiusY = v;
        };
        jUI.Canvas.Ellipse.prototype.setCenterX = function(v){
            v = v || 0;
            var V = this.__V;
            V.el.setAttribute("cx", v);
            V.CanvasEllipse.centerX = v;
        };
        jUI.Canvas.Ellipse.prototype.setCenterY = function(v){
            v = v || 0;
            var V = this.__V;
            V.el.setAttribute("cy", v);
            V.CanvasEllipse.centerY = v;
        };
        
        
        jUI.Canvas.Ellipse.prototype.getRadiusX = function(){
            return this.__V.CanvasEllipse.radiusX;
        };
        jUI.Canvas.Ellipse.prototype.getRadiusY = function(){
            return this.__V.CanvasEllipse.radiusY;
        };
        jUI.Canvas.Ellipse.prototype.getCenterX = function(){
            return this.__V.CanvasEllipse.centerX;
        };
        jUI.Canvas.Ellipse.prototype.getCenterY = function(){
            return this.__V.CanvasEllipse.centerY;
        };
        
        
        app.$(jUI.Canvas.Ellipse.prototype.__props = app.clone(jUI.Canvas.Ellipse.prototype.__props), {
            radiusX: "setRadiusX",
            radiusY: "setRadiusY",
            centerX: "setCenterX",
            centerY: "setCenterY"
        });
        
        jUI.Canvas.Ellipse.prototype.__events = jUI.Canvas.Ellipse.prototype.__events.clone().concat([
        ]);
        
    })();
    
    /**
     * Abstract Class
     * jUI.Canvas._Poly inherits from jUI.Canvas._Element.
     * 
     * @param {json} pa { <br>
     *      points: String svg points, a space separated coordinates, <br>
     * }
     * @param {NSDomElement} _element svg DOM element
     */
    jUI.Canvas._Poly = function(pa, _element){
        if(pa && pa.__loading__) return;
        jUI.Canvas._Element.call(this, pa, _element);
    };
    (function(){
        jUI.Canvas._Poly.prototype = new jUI.Canvas._Element({__loading__: true});
	jUI.Canvas._Poly.prototype.constructor = jUI.Canvas._Poly;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Canvas._Poly.prototype._initProp = function(pa){
            jUI.Canvas._Element.prototype._initProp.call(this, pa);
            this.__V.CanvasPoly = {
                points: undefined
            };
        };
        
        // Overriden Function End ===========================================
        
        jUI.Canvas._Poly.prototype.setPoints = function(v){
            this.__V.el.setAttribute("points", v);
            this.__V.CanvasPoly.points = v;
        };
        
        jUI.Canvas._Poly.prototype.getPoints = function(){
            return this.__V.CanvasPoly.points;
        };
        
        
        app.$(jUI.Canvas._Poly.prototype.__props = app.clone(jUI.Canvas._Poly.prototype.__props), {
            points: "setPoints"
        });
        
        jUI.Canvas._Poly.prototype.__events = jUI.Canvas._Poly.prototype.__events.clone().concat([
        ]);
        
    })();
    
    /**
     * jUI.Canvas.Polyline inherits from jUI.Canvas._Poly.
     * 
     * @param {json} pa { <br>
     * }
     */
    jUI.Canvas.Polyline = function(pa){
        if(pa && pa.__loading__) return;
        var c = jUI.Canvas._createNode("polyline");
        jUI.Canvas._Poly.call(this, pa, c);
    };
    (function(){
        jUI.Canvas.Polyline.prototype = new jUI.Canvas._Poly({__loading__: true});
	jUI.Canvas.Polyline.prototype.constructor = jUI.Canvas.Polyline;
    })();
    
    /**
     * jUI.Canvas.Polygon inherits from jUI.Canvas._Poly.
     * 
     * @param {json} pa { <br>
     * }
     */
    jUI.Canvas.Polygon = function(pa){
        if(pa && pa.__loading__) return;
        var c = jUI.Canvas._createNode("polygon");
        jUI.Canvas._Poly.call(this, pa, c);
    };
    (function(){
        jUI.Canvas.Polygon.prototype = new jUI.Canvas._Poly({__loading__: true});
	jUI.Canvas.Polygon.prototype.constructor = jUI.Canvas.Polygon;
    })();
    
    /**
     * jUI.Canvas.Path inherits from jUI.Canvas._Element.
     * 
     * @param {json} pa { <br>
     *      path: String svg path, <br>
     * }
     */
    jUI.Canvas.Path = function(pa){
        if(pa && pa.__loading__) return;
        var c = jUI.Canvas._createNode("path");
        jUI.Canvas._Element.call(this, pa, c);
    };
    (function(){
        jUI.Canvas.Path.prototype = new jUI.Canvas._Element({__loading__: true});
	jUI.Canvas.Path.prototype.constructor = jUI.Canvas.Path;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Canvas.Path.prototype._initProp = function(pa){
            jUI.Canvas._Element.prototype._initProp.call(this, pa);
            this.__V.CanvasPath = {
                path: undefined
            };
        };
        
        // Overriden Function End ===========================================
        
        jUI.Canvas.Path.prototype.setPath = function(v){
            this.__V.el.setAttribute("d", v);
            this.__V.CanvasPath.path = v;
        };
        
        jUI.Canvas.Path.prototype.getPath = function(){
            return this.__V.CanvasPath.path;
        };
        
        
        app.$(jUI.Canvas.Path.prototype.__props = app.clone(jUI.Canvas.Path.prototype.__props), {
            path: "setPath"
        });
        
        jUI.Canvas.Path.prototype.__events = jUI.Canvas.Path.prototype.__events.clone().concat([
        ]);
        
    })();
    
    /**
     * jUI.Canvas.Image inherits from jUI.Canvas._Element.
     * 
     * @param {json} pa { <br>
     *      src: String image source, <br>
     * }
     */
    jUI.Canvas.Image = function(pa){
        if(pa && pa.__loading__) return;
        var c = jUI.Canvas._createNode("image");
        c.setAttribute("preserveAspectRatio","none");
        jUI.Canvas._Element.call(this, pa, c);
    };
    (function(){
        jUI.Canvas.Image.prototype = new jUI.Canvas._Element({__loading__: true});
	jUI.Canvas.Image.prototype.constructor = jUI.Canvas.Image;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Canvas.Image.prototype._initProp = function(pa){
            jUI.Canvas._Element.prototype._initProp.call(this, pa);
            this.__V.CanvasImage = {
                src: undefined
            };
        };
        
        // Overriden Function End ===========================================
        
        jUI.Canvas.Image.prototype.setSrc = function(v){
            this.__V.el.setAttributeNS("http://www.w3.org/1999/xlink", "href", v);
            this.__V.CanvasImage.src = v;
        };
        
        jUI.Canvas.Image.prototype.getSrc = function(){
            return this.__V.CanvasImage.src;
        };
        
        
        app.$(jUI.Canvas.Image.prototype.__props = app.clone(jUI.Canvas.Image.prototype.__props), {
            src: "setSrc"
        });
        
        jUI.Canvas.Image.prototype.__events = jUI.Canvas.Image.prototype.__events.clone().concat([
        ]);
        
    })();
    
    //=================================================================================
    // Canvas End 
    //=================================================================================
    
})();