/* global app, webapp, jUI */

(function () {
    webapp.Qr = function (request_id ) {
        this.request_id = request_id;
        jUI.ViewController.call(this);
    };
    webapp.Qr.prototype = new jUI.ViewController({__loading__: true});
    webapp.Qr.prototype.constructor = webapp.Qr;
    webapp.Qr.prototype._initController = function () {
        var so = this;
        this.imageHolder = null;
        
        var myInterval = setInterval(function(){
            so.refreshModel()
        }, 2000);
        
        this.splitPanel = null;
        this.pages = {};
        
        
        this.viewDidLoad = function () {

        };
        
        this.refreshModel = function () {
            if (so.models.paymentRequestDs.getMode() === jUI.dsmView) {
                so.models.paymentRequestDs.refresh();
            }
        };
        
        this.clearCheckingInterval = function(){
            clearInterval(myInterval);
        };
    };

    webapp.Qr.prototype._initModels = function () {
        var so = this;
        return {
            paymentRequestDs: new jUI.Dataset({
                url: webapp.reqUrl,
                autoSubmit: true,
                params: {
                    MODULE_NAME: "PayRequest",
                    FUNC_NO: "get_request_info",
                    request_id: this.request_id
                },
                events:{
                    receivedResponse: function(data){
                        if(so.initializing) return;
                        var row = null;
                        if(data.data.DATASET && data.data.DATASET.rows){
                            row = data.data.DATASET.rows[0] || null;
                        }
                        if (row == null) return;
                        
                        if (row.is_payed){
                            so.clearCheckingInterval()
                            
                            jUI.showMessage(app.__("Payment Request Payed"), 
                            "<span style='color: green; font-size: 1.2em'>" + app.round(row.amount,3) + " LYD</span> " 
                            + " " + app.__("has been paid") + "<br/>"
                            + "<br/><b>" + app.__("Description") + ":</b> <br/>" + row.description ,
                            jUI.MessageDialog.mtInformation,[jUI.btnCancel]);
                            
                            so.view.close();
                            
                        }
                    }
                }
            })
        };
    };

    webapp.Qr.prototype._initView = function () {
        return new jUI.Form({
            title: app.__("Scan to Pay"),
            av: ["|", "-"],
            height: 500,
            maxHeight: 600,
            width: 500,
            autoFree: true,
            children: [
                this.imageHolder = new jUI.Image({
                    av: ["|", "-"],
                    url: webapp.reqUrl + "&ImageResponse=1&MODULE_NAME=PayRequest&FUNC_NO=get_pay_qr&request_id="+this.request_id+"&size=450"
                }),
                new jUI.Text({
                    
                })
            ],
            events:{
                close: this.clearCheckingInterval
            }
        });

    };
})();
