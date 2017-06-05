
/* global jUI,app,webapp */
(function(){
    webapp.main = function(){
        var so = this;
        this.loader = new webapp.Loader();
        this.createFormLabel = function(text, forId){
            return new jUI.Label({
                    classModifier: "label",
                    text: text,
                    layout: jUI.Layout.ltFollowVer,
                    forId: (forId)?forId:""
                });
        };

        app.onConnectionFailed = function(){
            so.loader.stop();
            jUI.showMessage(app.lang['error'],app.lang['conn_failur'],jUI.MessageDialog.mtWarning,[jUI.Form.btnCancel]);
        };
        new webapp.Home();
    };
})();

(function(){
    
    /**
     * app.__
     * 
     * @description Translate the string in the argument to the current application language... <br>
     *              If no translation found, then the same string will be returned.<br>
     * 
     * @param {string} v  string to be translated
     * @return {string} The translation or the same string if no translation found
     */
    app.__ = function(v){
        return (app.lang[v]?app.lang[v]:v);
    };
    
    app.round = function(v, decimals){
        var n = null;
        try {
            n = parseFloat(v);
        }catch (exception) {
            n = null;
        }
        
        var d=100;
        if(! isNaN(decimals)  ){
            d = Math.pow(10, decimals) ;
        }
        return (n==null)?  v : (+(Math.round(v * d) / d )).toFixed(3);
    };
    
    
})();