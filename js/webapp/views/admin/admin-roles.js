
/* global app, webapp, jUI */
(function(){
    webapp.Roles = function(){jUI.ViewController.call(this);};
    webapp.Roles.prototype = new jUI.ViewController({__loading__:true});
    webapp.Roles.prototype.constructor = webapp.Roles;
    webapp.Roles.prototype._initController = function(){
        var so = this;
        this.viewDidLoad = function(pa){
        };
        
        this.onAddRoleBtnClick = function(){
            so.models.rolesDs.setMode(jUI.dsmAdd);
            new webapp.Roles.EntryForm({
                parentController:so,
                title: app.lang['add_role']
            }).view.show(true);
        };
        
        this.onEditRoleBtnClick = function(){
            so.models.rolesDs.setMode(jUI.dsmEdit);
            new webapp.Roles.EntryForm({
                parentController:so,
                title: app.lang['edit_role']
            }).view.show(true);
        };
        
        this.onDelRoleBtnClick = function(){
            jUI.showMessage(app.lang['conf'],app.lang['r_u_sure_del_role'],jUI.mtError,[ 
                jUI.butAction(app.lang['ok'],function(){
                    so.models.rolesDs.submit({
                        extraParams:{FUNC_NO:"del"},
                        loader: webapp.loader
                    });
                }),
                jUI.btnCancel
            ]);
        };
        this.onEditPrivsBtnClick = function(){
            new webapp.Roles.PrivsEditForm({
                parentController:so
            }).view.show(true);
        };
        
    };
    webapp.Roles.prototype._initModels = function(){
        var rolesDs;
        return {
            rolesDs: rolesDs = new jUI.Dataset({
                url: webapp.reqUrl,
                autoSubmit: true,
                params: {
                    MODULE_NAME: "usermanagement.Roles"
                }
            }),
            privsDs: new jUI.Dataset({
                url: webapp.reqUrl,
                masterDataset: rolesDs,
                masterKey: "no",
                dataKey: "role_no",
                params: {
                    MODULE_NAME: "usermanagement.Roles",
                    FUNC_NO: "role-privs"
                }
            })
        };
    };
    webapp.Roles.prototype._initView = function(){
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
                                click: this.onAddRoleBtnClick
                            }
                        }),
                        new jUI.ToolButton({
                            icon: new jUI.Shape(app.resources.icons.paths._16.edit),
                            events:{
                                click: this.onEditRoleBtnClick
                            }
                        }),
                        new jUI.ToolButton({
                            icon: new jUI.Shape(app.resources.icons.paths._16.del),
                            events:{
                                click: this.onDelRoleBtnClick
                            }
                        }),
                        new jUI.ToolButton({
                            icon: new jUI.Shape(app.resources.icons.paths._16.key),
                            events:{
                                click: this.onEditPrivsBtnClick
                            }
                        })
                    ]
                }),
                new jUI.Grid({
                    anchor: {l:0,t:38,b:0},
                    width: 300,
                    dataset: this.models.rolesDs,
                    columns: [
                        new jUI.Grid.Column({title: app.lang["name"], dataField: "name"})
                    ]
                }),
                new jUI.Grid({
                    anchor: {l:300,t:38,r:0,b:0},
                    dataset: this.models.privsDs,
                    columns: [
                        new jUI.Grid.Column({title: app.lang["cat"], dataField: "priv_cat"}),
                        new jUI.Grid.Column({title: app.lang["module"], dataField: "module"}),
                        new jUI.Grid.Column({title: app.lang["func"], dataField: "func"}),
                        new jUI.Grid.Column({title: app.lang["desc"], dataField: "description"})
                    ]
                })
            ],
            visible: true
        });
    };
    
    
    webapp.Roles.EntryForm = function(pa){jUI.ViewController.call(this,pa);};
    webapp.Roles.EntryForm.prototype = new jUI.ViewController({__loading__:true});
    webapp.Roles.EntryForm.prototype.constructor = webapp.Roles.EntryForm;
    webapp.Roles.EntryForm.prototype._initController = function(){

        var so = this;
        
        this.viewDidLoad = function(pa){
            this.view.setTitle(pa.title);
        };

        this.onSaveBtnClick = function(){
            var rolesDs = so.parentController.models.rolesDs;
            rolesDs.submit({
                loader: webapp.loader,
                finish:function(st){
                    st && so.view.close();
                }
            });
            return false;
        };
        
    };
    webapp.Roles.EntryForm.prototype._initView = function(){
        var rolesDs = this.parentController.models.rolesDs;
        return new jUI.Form({
            av: ["|","-"],
            width: 400,
            maxHeight: 600,
            autoFree: true,
            children: [
                webapp.createFormLabel(app.lang["name"]),
                new jUI.TextField({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    name: "name",
                    dataField: "name",
                    dataset: rolesDs
                })
            ],
            buttons: [
                jUI.butAction(app.lang["save"],this.onSaveBtnClick),
                jUI.btnCancel
            ]
        });
    };
    
    webapp.Roles.PrivsEditForm = function(pa){jUI.ViewController.call(this,pa);};
    webapp.Roles.PrivsEditForm.prototype = new jUI.ViewController({__loading__:true});
    webapp.Roles.PrivsEditForm.prototype.constructor = webapp.Roles.PrivsEditForm;
    webapp.Roles.PrivsEditForm.prototype._initController = function(){

        var so = this;
        this.privGrid = null;
        
        this.onGridReady = function(){
            so.parentController.models.privsDs.forEach(function(i){
                so.privGrid.selectValue(this.getKeyValueAt(i));
            });
        };

        this.onSaveBtnClick = function(){
            var rolesDs = so.parentController.models.rolesDs;
            rolesDs.submit({
                loader: webapp.loader,
                extraParams: {FUNC_NO: "edit-role-privs"},
                extraCompos: [so.privGrid],
                finish: function(st){
                    st && so.view.close();
                }
            });
            return false;
        };
        
    };
    webapp.Roles.PrivsEditForm.prototype._initModels = function(){
        return {
            privsDs: new jUI.Dataset({
                url: webapp.reqUrl,
                autoSubmit: true,
                params: {
                    MODULE_NAME: "usermanagement.Roles",
                    FUNC_NO: "privs-list"
                }
            })
        };
    };
    webapp.Roles.PrivsEditForm.prototype._initView = function(){
        var rolesDs = this.parentController.models.rolesDs;
        return new jUI.Form({
            title: app.lang["edit_privs"],
            av: ["|","-"],
            width: 600,
            maxHeight: 600,
            autoFree: true,
            children: [
                webapp.createFormLabel(app.lang["sel_privs"]),
                this.privGrid = new jUI.Grid({
                    layout: jUI.Layout.ltFollowVer,
                    width: "100%",
                    height: 400,
                    name: "privs",
                    dataset: this.models.privsDs,
                    selectionMode: jUI.smMultiple,
                    columns: [
                        new jUI.Grid.Column({title: app.lang["cat"], dataField: "priv_cat"}),
                        new jUI.Grid.Column({title: app.lang["module"], dataField: "module"}),
                        new jUI.Grid.Column({title: app.lang["func"], dataField: "func"}),
                        new jUI.Grid.Column({title: app.lang["desc"], dataField: "description"})
                    ],
                    events: {
                        ready: this.onGridReady
                    }
                })
            ],
            buttons: [
                jUI.butAction(app.lang["save"],this.onSaveBtnClick),
                jUI.btnCancel
            ]
        });
    };
    
})();
