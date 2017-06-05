
/* global app, webapp, jUI */
(function(){
    webapp.Home = function(){jUI.ViewController.call(this);};
    webapp.Home.prototype = new jUI.ViewController({__loading__:true});
    webapp.Home.prototype.constructor = webapp.Home;
    webapp.Home.prototype._initController = function(){
        var so = this;
        this.purchaseSummary = null;
        this.purchaseTotal = null;
        this.requestId = null;
        this.qrForm = null;
        this.checkRequestId = null;
        
        var data = [
            {
                title: "Alera Epoch Series All Mesh Multifunction Mid-Back Chair, Black Back Seat",
                image: "img1.jpg",
                amount: 350.650
            },
            {
                title: "Ameriwood Home Dakota L-Shaped Desk with Bookshelves, Espresso",
                image: "img2.jpg",
                amount: 200.880
                
            },
            {
                title: "HP Pavilion 27xw 27-in IPS LED Backlit Monitor",
                image: "img3.jpg",
                amount: 539.000
                
            }
        ];
        
        
        this.viewDidLoad = function(){
            var total = 0;
            data.forEach(function(item){
                so.purchaseSummary.addChildren([
                    new jUI.Layout({
                        visible: true,
                        width: "100%",
                        layout: jUI.ltFollowVer,
                        margin: {t:10,b:10},
                        children: [
                            new jUI.Image({
                                width: 100,
                                layout: jUI.ltFollowHor,
                                url: webapp.baseUrl + "/images/"+ item.image
                            }),
                            new jUI.Text({
                                width: 200,
                                //height: 100,
                                layout: jUI.ltFollowHor,
                                //textAlign: jUI.talMiddle,
                                text: item.title
                            }),
                            new jUI.Text({
                                classModifier: "price",
                                layout: jUI.ltFollowHor,
                                width: 200,
                                //height: 100,
                                textAlign: jUI.talRight,
                                text: item.amount.toFixed(3)+" LYD"
                            })
                        ]
                    })
                ]);
                
                total += item.amount;
            });
            this.purchaseTotal.setText(total.toFixed(3)+" LYD");
        };
        
        this.checkRequestStatus = function(){
            app.ajax({
                url: "http://73.25.73.68:8080/bank-api-test/pay?lang=en&AJAXQuery=1&JSONResponse=1",
                method: "POST",
                params: {
                    MODULE_NAME: "ApiHandler",
                    FUNC_NO: "is_paid",
                    request_id: so.requestId
                },
                success: function(data){
                    if (data.data.ERROR) {
                        jUI.showMessage(app.lang['error'],data.data.ERROR,jUI.MessageDialog.mtError,[jUI.Form.btnCancel]);
                    } else {
                        var isPaid = data.data.DATASET.rows[0].is_payed;
                        if(isPaid){
                            clearInterval(so.checkRequestId);
                            so.checkRequestId = null;
                            so.qrForm.close();
                            so.qrForm = null;
                            jUI.showMessage(app.lang['conf'],"Payment was successful",jUI.MessageDialog.mtInformation,[jUI.Form.btnCancel]);
                        }
                    }
                }
            });
        };
        
        this.showQR = function(){
            this.qrForm = new jUI.Form({
                title: app.__("Scan to Pay"),
                av: ["|", "-"],
                height: 500,
                maxHeight: 600,
                width: 500,
                autoFree: true,
                children: [
                    this.imageHolder = new jUI.Image({
                        av: ["|", "-"],
                        url: "http://73.25.73.68:8080/bank-api-test/pay?lang=en&AJAXQuery=1&ImageResponse=1&MODULE_NAME=ApiHandler&FUNC_NO=get_qr&request_id="+so.requestId
                    }),
                    new jUI.Text({

                    })
                ],
                events:{
                    close: function(){
                        so.checkRequestId && clearInterval(so.checkRequestId);
                        so.checkRequestId = null;
                        so.qrForm = null;
                    }
                }
            });
            this.qrForm.show(true);
            
            this.checkRequestId = setInterval(function(){
                so.checkRequestStatus();
            },5000);
        };
        
        this.makeMoneyRequest = function(){
            app.ajax({
                url: "http://73.25.73.68:8080/bank-api-test/pay?lang=en&AJAXQuery=1&JSONResponse=1",
                method: "POST",
                params: {
                    MODULE_NAME: "ApiHandler",
                    FUNC_NO: "create_request"
                },
                loader: webapp.loader,
                success: function(data){
                    if (data.data.ERROR) {
                        jUI.showMessage(app.lang['error'],data.data.ERROR,jUI.MessageDialog.mtError,[jUI.Form.btnCancel]);
                    } else {
                        so.requestId = data.data.ENTRYADDED.rows[0].request_id;
                        so.showQR();
                    }
                }
            });
            
        };
        
    };
    webapp.Home.prototype._initView = function(){
        return new jUI.Layout({
            anchor:{l:0,r:0,t:0,b:0},
            classModifier: "home",
            parent: app.mainForm,
            children: [
                new jUI.ToolBar({
                    layout: jUI.ltFollowVer,
                    width: "100%",
                    height: 40,
                    tools: [
                        new jUI.ToolButton({
                            icon: new jUI.Shape(app.resources.icons.paths._24.users),
                            text: app.__("My Account"),
                            events:{
                                click: this.adminBtnClick
                            }
                        }),
                        new jUI.ToolButton({
                            icon: new jUI.Shape(app.resources.icons.paths._24.myOrders),
                            text: app.__("My Orders"),
                            events:{
                                click: this.myAccountClick
                            }
                        })
                    ],
                    rightTools: [
                        new jUI.ToolButton({
                            icon: new jUI.Shape(app.resources.icons.paths._24.inbox),
                            events:{
                            }
                        }),
                        new jUI.ToolButton({
                            icon: new jUI.Shape(app.resources.icons.paths._24.settings),
                            events:{
                                click: this.preferencesClick
                            }
                        }),
                        new jUI.ToolButton({
                            icon: new jUI.Shape(app.resources.icons.paths._24.logout),
                            events:{
                                click: this.logOutClick
                            }
                        })
                    ]
                }),
                new jUI.Layout({
                    visible: true,
                    classModifier: "page-header",
                    layout: jUI.ltFollowVer,
                    width: "100%",
                    height: 100,
                    padding: {l:7,t:5,b:5,r:7},
                    children: [
                        new jUI.Image({
                            layout: jUI.ltFollowHor,
                            url: webapp.baseUrl + "/images/logo.png",
                            align: "<",
                            margin: {r:50}
                        }),
                        new jUI.TextField({
                            layout: jUI.ltFollowHor,
                            width: "calc(100% - 600px)",
                            minWidth: 200,
                            height: 40,
                            valign: "-",
                            placeholder: app.__("Search")
                        }),
                        new jUI.Button({
                            layout: jUI.ltFollowHor,
                            icon: new jUI.Shape(app.resources.icons.paths._24.search),
                            valign: "-",
                            height: 40,
                        })
                    ]
                }),
                new jUI.Layout({
                    visible: true,
                    layout: jUI.ltFollowVer,
                    width: "100%",
                    children: [
                        new jUI.Text({
                            layout: jUI.ltFollowVer,
                            padding: 30,
                            classModifier: "header1",
                            text: app.__("Checkout (3 items)")
                        }),
                        this.purchaseSummary = new jUI.Layout({
                            classModifier: "border",
                            layout: jUI.ltFollowVer,
                            visible: true,
                            padding: 20,
                            width: 550,
                            margin: 20
                        }),
                        new jUI.Layout({
                            classModifier: "border",
                            visible: true,
                            layout: jUI.ltFollowVer,
                            width: 550,
                            padding: 20,
                            margin: {l:20,r:20,b:20},
                            children: [
                                new jUI.Button({
                                    layout: jUI.ltFollowHor,
                                    width: 300,
                                    text: app.__("Place your order"),
                                    events: {
                                        click: this.makeMoneyRequest
                                    }
                                }),
                                this.purchaseTotal = new jUI.Text({
                                    classModifier: "price total",
                                    layout: jUI.ltFollowHor,
                                    textAlign: jUI.talRight,
                                    width: 200
                                })
                            ]
                        })
                    ]
                })
            ],
            visible: true
        });
    };
})();
