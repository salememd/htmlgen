/* global app, webapp, jUI */

(function () {

    webapp.Preferences = function () {
        jUI.ViewController.call(this);
    };
    webapp.Preferences.prototype = new jUI.ViewController({__loading__: true});
    webapp.Preferences.prototype.constructor = webapp.Preferences;
    webapp.Preferences.prototype._initController = function () {
        var so = this;
        this.txtPin = null;
        
        this.viewDidLoad = function () {

        };
        this.btnAction = function () {
            app.ajax({
                url: webapp.reqUrl,
                params: {
                    MODULE_NAME: "Accounts",
                    FUNC_NO: "set_custom_pin",
                    new_pin: so.txtPin.getValue()
                },
                success: function (response) {
                    
                    if(response.data){
                        if( response.data.ERROR){
                            response.data.ERROR = response.data.ERROR && jUI.showMessage(app.__("Error"), response.data.ERROR, jUI.mtError, [jUI.btnCancel]);
                            return;
                        }
                        if(response.data.ENTRYUPDATED.PINCHANGED){
                            jUI.showMessage(app.__("Success"), app.__("Pin Changed."), jUI.mtInformation, [jUI.btnCancel]);
                            so.view.close();
                        }
                    }else{
                        jUI.showMessage(app.__("Error"), app.__("Failed to Change Pin."), jUI.mtError, [jUI.btnCancel]);
                    }
                }
            });
            return false;
        };
    };
    
    webapp.Preferences.prototype._initModels = function () {
        var so = this;
        return {
        };
    };
    webapp.Preferences.prototype._initView = function () {
        var so = this;
        return new jUI.Form({
            title: app.__("Preferences"),
            av: ["|", "-"],
            maxHeight: 400,
            width: 600,
            autoFree: true,
            children: [
                webapp.createFormLabel(app.__("Set New PIN Number")),
                so.txtPin = new jUI.TextField({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    name: "pin",
                    placeholder: app.__("6 digits Pin")
                })
            ],
            tabIndex: 1,
            buttons: [
                jUI.butAction(app.__("Save"), this.btnAction, 2),
                jUI.btnCancel
            ]
        });
    };
})();
