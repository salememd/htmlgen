
/* global app, webapp, jUI */
(function(){
    webapp.Accounts = function(){jUI.ViewController.call(this);};
    webapp.Accounts.prototype = new jUI.ViewController({__loading__:true});
    webapp.Accounts.prototype.constructor = webapp.Accounts;
    webapp.Accounts.prototype._initController = function(){
        var so = this;
        this.viewDidLoad = function(pa){
        };
        
        this.onAddAccountBtnClick = function(){
            so.models.accountsDs.setMode(jUI.dsmAdd);
            new webapp.Accounts.EntryForm({
                parentController:so,
                title: app.lang['add_account']
            }).view.show(true);
        };
        
        this.onEditAccountBtnClick = function(){
            so.models.accountsDs.setMode(jUI.dsmEdit);
            new webapp.Accounts.EntryForm({
                parentController:so,
                title: app.lang['edit_account']
            }).view.show(true);
        };
        
        this.onDelAccountBtnClick = function(){
            jUI.showMessage(app.lang['conf'],app.lang['r_u_sure_del_acc'],jUI.mtError,[ 
                jUI.butAction(app.lang['ok'],function(){
                    so.models.accountsDs.submit({
                        extraParams:{FUNC_NO:"del"},
                        loader: webapp.loader
                    });
                }),
                jUI.btnCancel
            ]);
        };
        
        this.onChangePinClick = function(){
            jUI.showMessage(app.lang['conf'],app.__("Are you sure to change the pin?"),jUI.mtError,[ 
                jUI.butAction(app.lang['ok'],function(){
                    so.models.accountsDs.submit({
                        extraParams:{FUNC_NO:"change_pin"},
                        loader: webapp.loader
                    });
                }),
                jUI.btnCancel
            ]);
        };
        
    };
    webapp.Accounts.prototype._initModels = function(){
        return {
            accountsDs: new jUI.Dataset({
                url: webapp.reqUrl,
                autoSubmit: true,
                params: {
                    MODULE_NAME: "usermanagement.Accounts"
                }
            })
        };
    };
    webapp.Accounts.prototype._initView = function(){
        return new jUI.Layout({
            anchor: {l:0,t:0,r:3,b:0},
            children: [
                new jUI.ToolBar({
                    anchor: {l:0,t:0,r:0},
                    height: 35,
                    tools:[
                        new jUI.ToolButton({
                            icon: new jUI.Shape(app.resources.icons.paths._16.add),
                            events:{
                                click: this.onAddAccountBtnClick
                            }
                        }),
                        new jUI.ToolButton({
                            icon: new jUI.Shape(app.resources.icons.paths._16.edit),
                            events:{
                                click: this.onEditAccountBtnClick
                            }
                        }),
                        new jUI.ToolButton({
                            icon: new jUI.Shape(app.resources.icons.paths._16.del),
                            events:{
                                click: this.onDelAccountBtnClick
                            }
                        }),
                        new jUI.ToolButton({
                            text: app.__("Change Pin"),
                            events: {
                                click: this.onChangePinClick
                            }
                        })
                    ]
                }),
                new jUI.Grid({
                    anchor: {l:0,t:38,r:0,b:0},
                    dataset: this.models.accountsDs,
                    columns: [
                        new jUI.Grid.Column({title: app.lang["no"], dataField: "no"}),
                        new jUI.Grid.Column({title: app.lang["user_name"], dataField: "user_id"}),
                        new jUI.Grid.Column({title: app.lang["name"], dataField: "name"}),
                        new jUI.Grid.Column({title: app.lang["email"], dataField: "email"}),
                        new jUI.Grid.Column({title: app.lang["phone"], dataField: "phone"}),
                        new jUI.Grid.Column({title: app.lang["last_login"], dataField: "last_login"})
                    ]
                })
            ],
            visible: true
        });
    };
    
    
    webapp.Accounts.EntryForm = function(pa){jUI.ViewController.call(this,pa);};
    webapp.Accounts.EntryForm.prototype = new jUI.ViewController({__loading__:true});
    webapp.Accounts.EntryForm.prototype.constructor = webapp.Accounts.EntryForm;
    webapp.Accounts.EntryForm.prototype._initController = function(){

        var so = this;
        
        this.viewDidLoad = function(pa){
            this.view.setTitle(pa.title);
        };

        this.onSaveBtnClick = function(){
            var accDs = so.parentController.models.accountsDs;
            accDs.submit({
                loader: webapp.loader,
                finish:function(st){
                    st && so.view.close();
                }
            });
            return false;
        };
        
    };
    webapp.Accounts.EntryForm.prototype._initModels = function(){
        return {
            userTypeDs: new jUI.Dataset({
                url: webapp.reqUrl,
                autoSubmit: true,
                params: {
                    MODULE_NAME: "usermanagement.Accounts",
                    FUNC_NO: "user-type-list"
                }
            })
        };
    };
    webapp.Accounts.EntryForm.prototype._initView = function(){
        var accDs = this.parentController.models.accountsDs;
        return new jUI.Form({
            av: ["|","-"],
            width: 400,
            maxHeight: 600,
            autoFree: true,
            children: [
                webapp.createFormLabel(app.lang["user_type"]),
                new jUI.Select({
                    layout: jUI.Layout.ltFollowVer,
                    width: 200,
                    name: "user_type",
                    dataset: accDs,
                    dataField: "user_type",
                    listDataset: this.models.userTypeDs,
                    listField: "name",
                    placeholder: app.lang["select"]
                }),
                webapp.createFormLabel(app.lang["user_name"]),
                new jUI.TextField({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    name: "user_id",
                    dataField: "user_id",
                    dataset: accDs,
                    enabled: accDs.isAddMode()
                }),
                webapp.createFormLabel(app.lang["pass"]),
                new jUI.TextField({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    name: "pass",
                    dataset: accDs,
                    enabled: accDs.isAddMode()
                },true),
                webapp.createFormLabel(app.lang["name"]),
                new jUI.TextField({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    name: "name",
                    dataField: "name",
                    dataset: accDs
                }),
                webapp.createFormLabel(app.lang["email"]),
                new jUI.TextField({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    name: "email",
                    dataField: "email",
                    dataset: accDs
                }),
                webapp.createFormLabel(app.__("Account ID:")),
                new jUI.TextField({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    name: "account_id",
                    dataField: "account_id",
                    dataset: accDs
                }),
                webapp.createFormLabel(app.lang["phone"]),
                new jUI.TextField({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    name: "phone",
                    dataField: "phone",
                    dataset: accDs
                }),
                new jUI.Checkbox({
                    layout: jUI.Layout.ltFollowVer,
                    name: "active",
                    margin: {t:10},
                    label: app.lang["active"],
                    dataField: "active",
                    dataset: accDs
                })
            ],
            buttons: [
                jUI.butAction(app.lang["save"],this.onSaveBtnClick),
                jUI.btnCancel
            ]
        });
    };
    
})();
