/* global app, webapp, jUI */

(function () {

    webapp.Transfer = function () {
        jUI.ViewController.call(this);
    };
    webapp.Transfer.prototype = new jUI.ViewController({__loading__: true});
    webapp.Transfer.prototype.constructor = webapp.Transfer;
    webapp.Transfer.prototype._initController = function () {
        var so = this;
        this.toBankAccountID = null;
        this.toAccountID = null;
        this.pages = {};
        this.txtAmount = null;
        
        this.viewDidLoad = function () {

        };
        this.btnAction = function () {
            app.ajax({
                url: webapp.reqUrl,
                params: {
                    MODULE_NAME: "Accounts",
                    FUNC_NO: "transfer",
                    from_bank_account_id: so.models.bank_accounts.f("bank_account_id") ,
                    to_account_id:  so.toAccountID.getValue(),
                    to_bank_account_id:  so.toBankAccountID.getValue(),
                    amount: so.txtAmount.getValue()
                },
                success: function (response) {
                    if(response.data){
                        
                        response.data.error = response.data.error && jUI.showMessage(app.__("Error"), response.data.error, jUI.mtError, [jUI.btnCancel]);
                        
                        if(response.data.DATASET.rows[0]){
                            var row = response.data.DATASET.rows[0];
                            var old_b = row.old_balance || null;
                            var new_b = row.new_balance || null;
                            
                            jUI.showMessage( app.__("Success"),   
                                    app.__("Money transfered successfuly") + "<br/>" 
                                    + app.__("Your Old balance was") + ": <span style='color: red'>" + app.round(old_b, 3) + " LYD </span>" 
                                    + "<br/>"
                                    + app.__("Your New balance is") + ": <span style='color: green; font-weight: bold;'>" + app.round(new_b, 3) + " LYD </span>",
                                    
                                    jUI.mtInformation,
                                    [
                                        new jUI.Button({
                                            text: app.__("Ok"),
                                            events: {
                                                click: function () {
                                                    so.view.close();
                                                    this.getParentForm().close();
                                                }
                                            }
                                        })
                                    ]                                    
                            
                            )  
                            
                        }
                        
                        
                    }else{
                        
                    }
                }
            });
            return false;
        };
    };
    
    webapp.Transfer.prototype._initModels = function () {
        var so = this;
        return {
            bank_accounts: new jUI.Dataset({
                url: webapp.reqUrl,
                autoSubmit: true,
                params: {
                    MODULE_NAME: "Accounts",
                    FUNC_NO: "bank_accounts"
                },
                calcFields: {
                    account: function (f, pos) {
                        var mdl = so.models.bank_accounts;
                        var accType = mdl.fAt("acc_type",pos);
                        var bnkAccId = mdl.fAt("bank_account_id", pos);
                        var balance = mdl.fAt("balance", pos);
                        return webapp.getBankAccAsLabel(accType,bnkAccId,balance);                    }
                }
            })
        };
    };
    webapp.Transfer.prototype._initView = function () {
        var so = this;
        return new jUI.Form({
            title: app.__("Transfer"),
            av: ["|", "-"],
            maxHeight: 400,
            width: 600,
            autoFree: true,
            children: [
                new jUI.Text({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    classModifier: "title2",
                    text: app.__("From")
                }),
                new jUI.Select({
                    layout: jUI.Layout.ltFollowVer,
                    listDataset: this.models.bank_accounts,
                    listField: "account",
                    name: "from_bank_account_id",
                    placeholder: app.__("From Bank Account..."),
                    width: "100%"
                }),
                
                new jUI.Text({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    text: "<br/><hr/>"
                }),

                new jUI.Text({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    classModifier: "title2",
                    text: app.__("Amount")
                }),
                so.txtAmount = new jUI.TextField({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    name: "amount",
                    placeholder: app.__("Amount")
                }),
                new jUI.Text({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    text: "<br/><hr/>"
                }),
                new jUI.Text({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    classModifier: "title2",
                    text: app.__("To [UserName]")
                }),
                so.toAccountID = new jUI.TextField({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    name: "to_accout_id",
                    placeholder: app.__("To Account ID")
                }),
                new jUI.Text({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    classModifier: "title2",
                    text: app.__("To [Bank Account Number]")
                }),
                so.toBankAccountID = new jUI.TextField({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    name: "to_bank_account_id",
                    placeholder: app.__("To Bank Account ID")
                }),
                new jUI.Text({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    text: "<hr/>"
                })
            ],
            tabIndex: 1,
            buttons: [
                jUI.butAction(app.__("Make Transfer"), this.btnAction, 2),
                jUI.btnCancel
            ]
        });
    };
})();
