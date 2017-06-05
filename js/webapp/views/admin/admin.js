
/* global app, webapp, jUI */
(function(){
    webapp.Administration = function(){jUI.ViewController.call(this);};
    webapp.Administration.prototype = new jUI.ViewController({__loading__:true});
    webapp.Administration.prototype.constructor = webapp.Administration;
    webapp.Administration.prototype._initController = function(){
        var so = this;
        this.splitPanel = null;
        this.pages = {};

        this.viewDidLoad = function(){
            
        };
        
        this.onOptionSelectChanged = function(row, st){
            if(st){
                if(!so.pages[row]){
                    so.pages[row] = new webapp[so.models.options.f("pageView")]();
                    so.splitPanel.addChildToPanel2([so.pages[row].view]);
                }
                so.pages[row].view.bringToFront();
            }
        };
        
    };
    webapp.Administration.prototype._initModels = function(){
        return {
            options: new jUI.Dataset({
                data: {
                    fields: ["pageName","pageView"],
                    rows:[
                        [app.lang["accounts"], "Accounts"],
                        [app.lang["roles"],"Roles"]
                    ]
                }
            })
        };
    };
    webapp.Administration.prototype._initView = function(){
        return new jUI.TabBar.TabPage({
            title: app.lang["administration"],
            closable: true,
            children: [
                this.splitPanel = new jUI.SplitPanel({
                    layout: jUI.ltFollowVer,
                    width: "100%",
                    height: "100%",
                    orientation: jUI.porLeftRight,
                    panel1Children: [
                        new jUI.List({
                            width: "100%",
                            height: "100%",
                            dataset: this.models.options,
                            classModifier: "navMenu",
                            columns: [
                                new jUI.List.Column({dataField:"pageName"})
                            ],
                            events: {
                                selectChange: this.onOptionSelectChanged
                            }
                        })
                    ]
                })
            ]
        });
    };
})();
