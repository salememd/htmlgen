/* global app, webapp, jUI */


(function () {
    webapp.Statement = function () {
        jUI.ViewController.call(this);
    };
    webapp.Statement.prototype = new jUI.ViewController({__loading__: true});
    webapp.Statement.prototype.constructor = webapp.Statement;
    webapp.Statement.prototype._initController = function () {
        var so = this;
        
        this.lastTimestamp = new Date().getTime();
        this.txtLastTime =  null;
        
        this.viewDidLoad = function () {

        };
        
        this.calculatedFields = function(f,pos){
            var mdl_bnk = so.models.bank_accounts;
            var mdl_stmt = so.models.bank_statement;
            switch (f) {
                case "balance_rounded":
                    return app.round( mdl_stmt.fAt("balance", pos),3 );
                case "amount_rounded":
                    return app.round( mdl_stmt.fAt("amount", pos),3 );
                case "bank_acc_name":
                    var accType = mdl_bnk.fAt("acc_type",pos);
                    var bnkAccId = mdl_bnk.fAt("bank_account_id", pos);
                    var balance = mdl_bnk.fAt("balance", pos);
                    return webapp.getBankAccAsLabel(accType,bnkAccId,balance);
                case "deposit":
                    var v = app.round( mdl_stmt.fAt("amount", pos),3 );
                    return v>=0?v:"";
                case "withdrawal":
                    var v = app.round( mdl_stmt.fAt("amount", pos),3 );
                    return v<0? (-v).toFixed(3) :"";
            }
            return "";
        };
        
        this.loadMoreResults = function(){
            var stmtModel = so.models.bank_statement;
            var extraParams = {
                append: "1"
            };
            stmtModel.last();
            stmtModel.isEof() || (extraParams.last_timestamp= stmtModel.f("timestamp"));
            console.log(extraParams);
            stmtModel.submit({
                loader: webapp.loader,
                extraParams: extraParams
            });
        };

        this.onRefreshBtnClick = function () {
            if (so.models.bank_accounts.getMode() === jUI.dsmView) {
                so.models.bank_accounts.refresh();
            }
        };

        this.toolbarBtnKeypress = function (fn, key) {
            if (key.key && (key.key === "Enter" || key.key === " ")) {
                (typeof this[fn] === "function") && this[fn]();
            }
        };

    };

    webapp.Statement.prototype._initModels = function () {
        var so = this;
        var accountsDs=null;
        return {
            bank_accounts: accountsDs = new jUI.Dataset({
                url: webapp.reqUrl,
                autoSubmit: true,
                params: {
                    MODULE_NAME: "Accounts",
                    FUNC_NO: "bank_accounts"
                },
                calcFields:{
                    bank_acc_name: this.calculatedFields
                },
                events: {
                    ready: function () {
                    }
                }
            }),
            bank_statement: new jUI.Dataset({
                url: webapp.reqUrl,
                autoSubmit: true,
                masterDataset: accountsDs,
                masterKey: "bank_account_id",
                dataKey: "bank_account_id",
                params:{
                    MODULE_NAME: "Accounts",
                    FUNC_NO: "statement",
                },
                calcFields:{
                    balance_rounded: this.calculatedFields,
                    amount_rounded: this.calculatedFields,
                    withdrawal: this.calculatedFields,
                    deposit: this.calculatedFields
                },
                events:{
                    ready: function(){
                    }
                }
            })
        };
    };

    webapp.Statement.prototype._initView = function () {
            return new jUI.Layout({
                    visible: true,
                    anchor: {t: 0, r:0, b: 0, l: 0},
                    classModifier: "layout",
                    children: [
                        new jUI.ToolBar({
                            anchor: {t: 0, r: 0, l: 0},
                            height: 32,
                            tools: [
                                new jUI.Text({
                                    anchor: {l:0},
                                    layout: jUI.Layout.ltFollowHor,
                                    height: 25,
                                    classModifier: "grid_title ",
                                    textAlign: jUI.Text.talMiddle,
                                    text: app.__("Bank Account") + ": ",
                                    margin:{l:10, r:10}
                                }),
                                new jUI.Select({
                                    layout: jUI.Layout.ltFollowHor,
                                    listDataset: this.models.bank_accounts,
                                    listField: "bank_acc_name",
                                    placeholder: app.__("Select an account..."),
                                    height: 25,
                                    width: 350,
                                    maxWidth: 350
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
                                            text: app.__("Export as ..."),
                                            margin:{l:10, r:10}
                                        })
                                    ]
                                })
                            ]
                        }),
                        new jUI.Grid({
                            anchor: {t: 32, r:0, b:5, l: 0},
                            showTitle: true,
                            name: "bank_statement",
                            children:[
                                new jUI.Layout({
                                    visible: true,
                                    layout: jUI.Layout.ltFollowVer,
                                    width: 740,
                                    padding: {t:7, b:0},
                                    height: 36, 
                                    children:[
                                        new jUI.Button({
                                            //icon: new jUI.Shape(app.resources.icons.paths._32.load_more),
                                            text: "<span title=\"" + app.__("Load More") + "\">⚫⚫⚫</span>",
                                            classModifier: "load-more",
                                            height: 25,
                                            width: 100,
                                            align: jUI.alCenter,
                                            padding:{t:5,b:5},
                                            events:{
                                                click: this.loadMoreResults
                                            }
                                        })
                                    ]

                                })
                            ],
                            dataset: this.models.bank_statement ,
                            columns: [
                                new jUI.Grid.Column({title: app.__("Date"), dataField: "datetime" }),
                                new jUI.Grid.Column({title: app.__("Description"), dataField: "description" }),
                                
                                new jUI.Grid.Column({title: app.__("Withdrawals") + "  (" + app.__("LYD") + ") ", dataField: "withdrawal",  align: ">" }),
                                new jUI.Grid.Column({title: app.__("Deposits")+ "  (" + app.__("LYD") + ") ", dataField: "deposit",  align: ">" }),
                                
                                new jUI.Grid.Column({title: app.__("Balance") + "  (" + app.__("LYD") + ") ", dataField: "balance_rounded", align: ">"})
                            ]
                        })
                    ]
                });

    };
})();
