/* global app, webapp, jUI */
(function() {
    webapp.Administration = function() {
        jUI.ViewController.call(this);
    };
    webapp.Administration.prototype = new jUI.ViewController({
        __loading__: true
    });
    webapp.Administration.prototype.constructor = webapp.Administration;
    webapp.Administration.prototype._initController = function() {
        this.splitPanel = null;
        this.pages = {};



        this.viewDidLoad = function() {
            this.view.show();

        };


    };
    webapp.Administration.prototype._initModels = function() {
        return {
            options: new jUI.Dataset({
                data: {
                    fields: ["id", "subject", "hours"],
                    rows: [
					
						["132112", "java", 3],
						["132112", "VB", 3],
					    ["132112", "VB", 2],
						["132112", "c", 1],
						["231112", "java",2],
						["231112", "c",3],
						["331112", "c#",6],
						["132112", "c++",5],

					

					]
                }
            })
        };
    };
    webapp.Administration.prototype._initView = function() {
        var so = this;
		var t = new jUI.Tree({
                _style: {
                    overflow: "auto"
                },
                layout: jUI.Layout.ltFollowHor,
                width: 500,
                height: 500,
				levelFields: ["id","hours","subject"],
                dataset: so.models.options,
                events: {
                    onNodeSelectionChange: function(a) {
                        alert("User onSelect event: " + a.getText());
                    },
                    onViewStateChange: function(a) {
                        alert("User onCollaps/expand event: " + a.getText());
                    }
                }
            });
		var b = new jUI.Button({
                    text: "collapse all and click",
                    width: 250,
                    layout: jUI.ltFollowVer,
                    align: "|",
                    tabIndex: 4,
                    events:{
                        click: function(){
							
							so.models.options.setPos(1);
						},
                        keypress: this.loginButnKeyPress
                    }
                });	
		var c = new jUI.Button({
                    text: "add Node",
                    width: 250,
                    layout: jUI.ltFollowVer,
                    align: "|",
                    tabIndex: 4,
                    events:{
                        click: function(){
							
							so.models.options.addData([["132112", "java3", 3]],1);
						},
                        keypress: this.loginButnKeyPress
                    }
                });
			var d = new jUI.Button({
                    text: "delete nodes",
                    width: 250,
                    layout: jUI.ltFollowVer,
                    align: "|",
                    tabIndex: 4,
                    events:{
                        click: function(){
							alert("delete from 0 to 2");
							so.models.options.deleteRecords(0,2);
						},
                        keypress: this.loginButnKeyPress
                    }
                });	
				
				var update = new jUI.Button({
                    text: "update node",
                    width: 250,
                    layout: jUI.ltFollowVer,
                    align: "|",
                    tabIndex: 4,
                    events:{
                        click: function(){
							//t.deteleAllNodes();
						    //alert(t.getTreeLeafs().length)
							so.models.options.updateData([["132112", "C", 3]],1,1);
						},
                        keypress: this.loginButnKeyPress
                    }
                });	
        return new jUI.Window({
            width: "100%",
            height: "100%",

            children: [t,b,c,d,update]
        });


    };
})();