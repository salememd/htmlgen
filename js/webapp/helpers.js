/* global jUI, app, webapp */

(function(){
    
    app.escapeHtml = function (unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    };
    
    String.prototype.escapeHtml = function () {
        return this
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    };
    
    Date.prototype.getCustomFormat = function(pattern){
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

(function(){
    webapp.InputForm = function(pa){
        (pa.btnAction && (this.btnAction = pa.btnAction)) || (this.btnAction = function(){});
        ((pa.viewUI.constructor === Array) && (this.viewUI = pa.viewUI)) || (this.viewUI = []) ;
        
        jUI.ViewController.call(this,pa);
    };
    webapp.InputForm.prototype = new jUI.ViewController({__loading__: true});
    webapp.InputForm.prototype.constructor = webapp.InputForm;
    webapp.InputForm.prototype._initController = function(){
        var so = this;
        this.viewDidLoad = function(pa){
            so.view.setTitle(pa.title);
        };
    };
    webapp.InputForm.prototype._initModels = function(){
        return {};
    };
    webapp.InputForm.prototype._initView = function(){
        return new jUI.Form({
            title: app.__("Form"),
            av: ["|", "-"],
            maxHeight: 400,
            width: 600,
            autoFree: true,
            children: this.viewUI,
            tabIndex: 1,
            buttons: [
                jUI.butAction(app.__("Save"), this.btnAction, this.viewUI.length+1),
                jUI.btnCancel
            ]
        });
    };
    
    /**
         * Instead of creating a new ViewController everytime for entry forms, this one can do the work. ;-) 
         * 
         * @param {String} title                the title of the Entry Form
         * @param {jUI.Dataset} model           This model will be used when submitting the form data
         * @param [jUI.Layout] viewUI           An array of Layout, will be placed in the middle of the shown form.
         * @param {json} extraParams            extraParams will be send with the request, usually {FUNC_NO : "func_name"}
         * @param {function} actionFunction(ViewController vc)     if exist, will be called when clicking the action button, vc will refer to form ViewController
         *                                                         if not exist, the model will be submitted to take the proper action (Add | Edit), window will be closed on success
         * @returns {undefined}
         * 
         */

        webapp.displayEntryForm = function (title, model, viewUI, extraParams, actionFunction) {
            var inputForm;
            extraParams = extraParams || {};

            var btnAction;
            if(actionFunction){
                btnAction = function(){
                    actionFunction(inputForm);
                    return false;
                };
            }else{
                btnAction = function () {
                    model.submit({
                        loader: webapp.loader,
                        extraParams: extraParams,
                        finish: function (st){
                            st && inputForm.view.close();
                        }
                    });
                    return false;
                };
            }
        
            inputForm = new webapp.InputForm({
                title: title,
                viewUI: viewUI,
                btnAction: btnAction
            });
            inputForm.view.show(true);
        };
    
})();

(function(){
    
    /**
     * 
     * @param {jUI.Layout} layout  The layout which you want to clear content
     * @returns void
     * 
     */
    webapp.clearChildren = function(layout){
        var ch = layout.getChildren() || [];
        var l = ch.length;
        for(var i=0;i<l;i++){
            ch[0].free();
        }
    };
    
    webapp.getBankAccAsLabel = function(accType, bnkAccId, balance){
        var v = accType ;
        v += "  -  (*******" + bnkAccId.slice(-6) + ")";
        var balance = app.round( balance ,3 ) + "  " + app.__("LYD");
        return  "<span style=\"float: left;\">" + v + "</span>" 
                + "<span style=\"display: inline; float: right;\">" + balance + "</span>" ;
    };
    
})();
