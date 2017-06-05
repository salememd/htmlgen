    /* global app, webapp, jUI */


(function () {
    webapp.Summary = function () {
        jUI.ViewController.call(this);
    };
    webapp.Summary.prototype = new jUI.ViewController({__loading__: true});
    webapp.Summary.prototype.constructor = webapp.Summary;
    webapp.Summary.prototype._initController = function () {
        var so = this;
        this.totalBalance = 0;
        this.txtTotalBalance = "0";

        this.viewDidLoad = function () {

        };
        
        this.onStatementBtnClick = function () {
//            if(webapp.myAccount.pages['Statement']){
//                webapp.myAccount.pages['Statement'].view.bringToFront();
//            }
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

    webapp.Summary.prototype._initModels = function () {
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
                    balance_with_currency: function (f, pos) {
                        return app.round(so.models.bank_accounts.fAt("balance", pos), 3) + " " + app.__("LYD");
                    },
                    bank_short_id: function(f,pos){
                            return "************"+so.models.bank_accounts.fAt("bank_account_id", pos).slice(-6);
                    }
                },
                events: {
                    ready: function () {
                        if (so.initializing)
                            return;
                        so.totalBalance = 0;
                        so.models.bank_accounts.forEach(function (pos) {
                            so.totalBalance += so.models.bank_accounts.fAt("balance", pos);
                            return true;
                        });
                        so.totalBalance = app.round(so.totalBalance, 3);
                        so.txtTotalBalance.setText(so.totalBalance);
                    }
                }
            })
        };
    };

    webapp.Summary.prototype._initView = function () {

        return new jUI.Layout({
            visible: true,
            anchor: {t: 0, r: 0, b: 0, l: 0},
            classModifier: "layout",
            children: [
                new jUI.Layout({
                    visible: true,
                    anchor: {t: 0, b: 0, l: 0},
                    width: 700,
                    children: [
                        new jUI.ToolBar({
                            anchor: {t: 0, r: 0, l: 0},
                            height: 32,
                            rightTools: [
                                new jUI.Layout({
                                    visible: true,
                                    layout: jUI.Layout.ltFollowHor,
                                    height: 25,
                                    children: [
                                        new jUI.Text({
                                            anchor: {l: 0},
                                            layout: jUI.Layout.ltFollowHor,
                                            height: 25,
                                            classModifier: "grid_title",
                                            textAlign: jUI.Text.talMiddle,
                                            text: app.__("Total Balance:"),
                                            margin: {l: 10, r: 10}
                                        }),
                                        this.txtTotalBalance = new jUI.Text({
                                            layout: jUI.Layout.ltFollowHor,
                                            height: 25,
                                            classModifier: "grid_title bold",
                                            textAlign: jUI.Text.talMiddle,
                                            text: "0"
                                        }),
                                        new jUI.Text({
                                            layout: jUI.Layout.ltFollowHor,
                                            height: 25,
                                            margin: {l: 4, r: 4},
                                            classModifier: "grid_title",
                                            textAlign: jUI.Text.talMiddle,
                                            text: app.__("LYD")
                                        })
                                    ]
                                })
                            ],
                            tools: [
                                new jUI.ToolButton({
                                    icon: new jUI.Shape(app.resources.icons.paths._16.refresh),
                                    events: {
                                        click: this.onRefreshBtnClick
                                    }
                                })
                            ]
                        }),
                        new jUI.Grid({
                            anchor: {t: 32, l: 0},
                            width: 700,
                            showTitle: true,
                            name: "bank_accounts",
                            dataset: this.models.bank_accounts,
                            columns: [
                                new jUI.Grid.Column({title: app.__("Bank Account Number"), dataField: "bank_short_id", width: 400}),
                                new jUI.Grid.Column({title: app.__("Account Type"), dataField: "acc_type", width: 150}),
                                new jUI.Grid.Column({
                                    title: app.__("Balance"), dataField: "balance_with_currency", width: 150,
                                    align: ">"
                                })
                            ]

                        })
                    ]
                })
            ]
        });
    };
})();
