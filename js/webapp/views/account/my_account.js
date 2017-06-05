/* global app, webapp, jUI */


(function () {
    webapp.MyAccount = function () {
        jUI.ViewController.call(this);
    };
    webapp.MyAccount.prototype = new jUI.ViewController({__loading__: true});
    webapp.MyAccount.prototype.constructor = webapp.MyAccount;
    webapp.MyAccount.prototype._initController = function () {
        var so = this;
        this.splitPanel = null;
        this.pages = {};

        this.viewDidLoad = function () {
            console.log("loaded");
        };

        this.toolbarBtnKeypress = function (fn, key) {
            if (key.key && (key.key === "Enter" || key.key === " ")) {
                (typeof this[fn] === "function") && this[fn]();
            }
        };

        this.onOptionSelectChanged = function (row, st) {
            if (st) {
                var pageView = so.models.options.f("pageView");
                if (!so.pages[pageView]) {
                    so.pages[pageView] = new webapp[so.models.options.f("pageView")]();
                    so.splitPanel.addChildToPanel2([so.pages[pageView].view]);
                }
                so.pages[pageView].view.bringToFront();
            }
        };

    };

    webapp.MyAccount.prototype._initModels = function () {
        return {
            options: new jUI.Dataset({
                data: {
                    fields: ["pageName", "pageView"],
                    rows: [
                        [app.__("Summary"), "Summary"],
                        [app.__("Bank Statement"), "Statement"],
                        [app.__("Payments Requests"), "PaymentRequests"]
                    ]
                }
            })
        };
    };

    webapp.MyAccount.prototype._initView = function () {

        return new jUI.TabBar.TabPage({
            title: app.__("MyAccount"),
            closable: true,
            children: [

                this.splitPanel = new jUI.SplitPanel({
                    layout: jUI.ltFollowVer,
                    width: "100%",
                    height: "100%",
                    orientation: jUI.porLeftRight,
                    panel1Children: [
                        new jUI.List({
                            anchor: {t:0, r:0, b:5,l:0},
//                            width: "100%",
//                            height: "100%",
                            dataset: this.models.options,
                            classModifier: "navMenu",
                            columns: [
                                new jUI.List.Column({dataField: "pageName"})
                            ],
                            events: {
                                selectChange: this.onOptionSelectChanged
                            }
                        })
                    ],
                    panel2Children: [
                        
                    ]
                })
            ]
        });

    };
})();
