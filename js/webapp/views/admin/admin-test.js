
/* global app, webapp, jUI */
(function(){
    webapp.Test = function(){jUI.ViewController.call(this);};
    webapp.Test.prototype = new jUI.ViewController({__loading__:true});
    webapp.Test.prototype.constructor = webapp.Test;
    webapp.Test.prototype._initController = function(){
        var so = this;
        this.selectChooser = null;
        this.viewDidLoad = function(pa){
        };
        this.selectionSelected = function(){
            console.log(this);
            console.log(so.models.dList.f("_id"));
        };
    };
    webapp.Test.prototype._initModels = function(){
        return {
            dList : new jUI.Dataset({
                    url: webapp.reqUrl,
                    autoSubmit: true,
                    params: {
                        MODULE_NAME: "usermanagement.Groups"
                    }
                })
        };
    };
    webapp.Test.prototype._initView = function(){
        return new jUI.Layout({
            anchor: {l:0,t:0,r:3,b:0},
            children: [
                new jUI.SlideBar({
                    delta: 5,
                    orientation: jUI.orLeftRight,
                    value: 30
                }),
                new jUI.ProgressBar({
                    top: 50,
                    left:20,
                    orientation: jUI.orLeftRight,
                    percent: 30
                }),
                new jUI.PanelList({
                    top: 100,
                    left: 20,
                    height: 200,
                    width: 150,
                    panels: [
                        {title: "Panel 1", panel: new jUI.Layout()},
                        {title: "Panel 2", panel: new jUI.Layout()},
                        {title: "Panel 3", panel: new jUI.Layout()},
                        {title: "Panel 4", panel: new jUI.Layout()}
                    ]
                }),
                new jUI.Tree({
                    top: 100,
                    left: 250,
                    height: 200,
                    width: 150,
                    nodes: [
                        new jUI.Tree.Node({text:"Level 1 Node 1"}),
                        new jUI.Tree.Node({
                            text:"Level 1 Node 2",
                            nodes: [
                                new jUI.Tree.Node({text:"Level 2 Node 1"}),
                                new jUI.Tree.Node({text:"Level 2 Node 2"}),
                                new jUI.Tree.Node({text:"Level 2 Node 3"})
                            ]
                        }),
                        new jUI.Tree.Node({text:"Level 1 Node 3"}),
                        new jUI.Tree.Node({text:"Level 1 Node 4"}),
                        new jUI.Tree.Node({text:"Level 1 Node 5"})
                    ]
                }),
                this.selectChooser = new jUI.Select({
                    top: 20,
                    left: 250,
                    width: 250,
                    listDataset: this.models.dList,
                    listField: "group_name",
                    placeholder: "Select Key",
                    events:{
                        select: function(){console.log("OK")}
                    }
                }),
                new jUI.Button({
                    top: 20, 
                    left: 502,
                    height: 32,
                    width: 50,
                    text: "OK",
                    events:{
                        click: this.selectionSelected
                    }
                })
            ],
            visible: true
        });
    };
    
})();
