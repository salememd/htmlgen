/* global app, webapp, jUI */


(function () {
    webapp.PaymentRequests = function () {
        jUI.ViewController.call(this);
    };
    webapp.PaymentRequests.prototype = new jUI.ViewController({__loading__: true});
    webapp.PaymentRequests.prototype.constructor = webapp.PaymentRequests;
    webapp.PaymentRequests.prototype._initController = function () {
        var so = this;
        this.totalBalance = 0;
        this.txtTotalBalance = "0";
        this.lastTimestamp = new Date().getTime();
        this.viewDidLoad = function () {

        };
        
        this.addPaymentRequest = function(){
          
            so.models.paymentRequestsDs.setMode(jUI.dsmAdd);
            webapp.displayEntryForm(
                    app.__("Add Payment Request"), 
                    so.models.paymentRequestsDs, 
                    [
                        new jUI.Text({
                            layout: jUI.Layout.ltFollowVer,
                            width: "100%",
                            classModifier: "title2",
                            text: app.__("Amount")
                        }),                        
                        new jUI.TextField({
                            layout: jUI.Layout.ltFollowVer,
                            width: "100%",
                            name: "amount",
                            placeholder: app.__("Amount"),
                            dataset: so.models.paymentRequestsDs,
                            dataField: "amount",
                            tabIndex: 3
                        }),
                        new jUI.Text({
                            layout: jUI.Layout.ltFollowVer,
                            width: "100%",
                            classModifier: "title2",
                            text: app.__("Description")
                        }),                        
                        new jUI.TextArea({
                            layout: jUI.Layout.ltFollowVer,
                            width: "100%",
                            name: "description",
                            dataset: so.models.paymentRequestsDs,
                            dataField: "description",
                            tabIndex: 4
                        })
                    ],
                    {
                        FUNC_NO: "add_pay_request"
                    }
            );            
        }
        
        this.formatDate = function (ts){
            if (!ts)
                return "";
            var t = parseInt(ts);
            var dt = new Date(t);
            return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " +
                    dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()
        }
        
        this.calculatedFields = function(f,pos){
            switch (f) {
                case "short_request_id":
                    return so.models.paymentRequestsDs.fAt("request_id").slice(6);
                case "amount_r":
                    return app.round( so.models.paymentRequestsDs.fAt("amount", pos),3 ) ;
                case "req_t_f":
                    var ts = so.models.paymentRequestsDs.fAt("request_time", pos);
                    return so.formatDate(ts);
                case "pay_t_f":
                    var ts = so.models.paymentRequestsDs.fAt("pay_time", pos);
                    return so.formatDate(ts);
                case "payment_status":
                    var v = so.models.paymentRequestsDs.fAt("is_payed", pos);
                    var msg = v ? app.__("Paid") : app.__("Not Paid Yet");
                    var color = v ? "green" : "red";
                    return "<span style=\"color:  " + color + " ;\">"+ msg + "</span>";
            }
            return "";
        };

        this.onRefreshBtnClick = function () {
            if (so.models.paymentRequestsDs.getMode() === jUI.dsmView) {
                so.models.paymentRequestsDs.refresh();
            }
        };

        this.toolbarBtnKeypress = function (fn, key) {
            if (key.key && (key.key === "Enter" || key.key === " ")) {
                (typeof this[fn] === "function") && this[fn]();
            }
        };

    };

    webapp.PaymentRequests.prototype._initModels = function () {
        var so = this;
        var accountsDs=null;
        return {
            paymentRequestsDs:  new jUI.Dataset({
                url: webapp.reqUrl,
                autoSubmit: true,
                params: {
                    MODULE_NAME: "PayRequest",
                    FUNC_NO: "get_payment_requests"
                },
                calcFields:{
                    amount_r: this.calculatedFields,
                    req_t_f: this.calculatedFields,
                    pay_t_f: this.calculatedFields,
                    payment_status : this.calculatedFields
                },
                events:{
                    receivedResponse: function(data){
                        var rows = null;
                        if(data.data && data.data.ENTRYADDED){
                            var rows = data.data.ENTRYADDED.rows || null;
                        }
                        if ( rows == null) return;
                        
                        var acc_id = rows[0].account_id;
                        var req_id = rows[0].request_id;
                        
                        console.log(acc_id + " --- " + req_id);
                        
                        webapp.qr = new webapp.Qr(req_id);
                        webapp.qr.view.show(true);
                    }
                }
            })
        };
    };

    webapp.PaymentRequests.prototype._initView = function () {

            return new jUI.Layout({
                    visible: true,
                    anchor: {t: 0, r:0, b: 0, l: 0},
                    classModifier: "layout",
                    children: [
                        new jUI.ToolBar({
                            anchor: {t: 0, r: 0, l: 0},
                            height: 32,
                            tools: [                       
                                new jUI.ToolButton({
                                    icon: new jUI.Shape(app.resources.icons.paths._16.add),
                                    events: {
                                        click: this.addPaymentRequest
                                    }
                                }),
                                new jUI.ToolButton({
                                    icon: new jUI.Shape(app.resources.icons.paths._16.edit),
                                    events: {
                                        click: this.onGetQrBtnClick
                                    }
                                }),
                                new jUI.ToolButton({
                                    icon: new jUI.Shape(app.resources.icons.paths._16.refresh),
                                    events: {
                                        click: this.onRefreshBtnClick
                                    }
                                })
                            ],
                            rightTools: [
                                new jUI.Layout({
                                    visible: true,
                                    layout: jUI.Layout.ltFollowHor,
                                    height: 25,
                                    children: [
                                        new jUI.Text({
                                            anchor: {l:0},
                                            layout: jUI.Layout.ltFollowHor,
                                            height: 25,
                                            classModifier: "grid_title",
                                            textAlign: jUI.Text.talMiddle,
                                            text: app.__("Last Payment Requests"),
                                            margin:{l:10, r:10}
                                        })
                                    ]
                                })
                            ]
                        }),
                        new jUI.Grid({
                            anchor: {t: 32, r:0, b:0, l: 0},
                            showTitle: true,
                            name: "paymentRequestsDs",
                            dataset: this.models.paymentRequestsDs ,
                            columns: [
                                new jUI.Grid.Column({title: app.__("Date"), dataField: "req_t_f" }),
                                new jUI.Grid.Column({title: app.__("Requested By"), dataField: "requester_user_id" }),
                                new jUI.Grid.Column({title: app.__("Amount") + "   (" + app.__("LYD") + ") ", dataField: "amount_r",  align: ">" }),
                                new jUI.Grid.Column({title: app.__("Is Paid?"), dataField: "payment_status"}),
                                new jUI.Grid.Column({title: app.__("Pay Time,"), dataField: "pay_t_f"}),
                                new jUI.Grid.Column({title: app.__("Description"), dataField: "description" })
                            ]
                        })
                    ]
                });

    };
})();
