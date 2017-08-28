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
                    fields: ["id", "subject"],
                    rows: [
					
						["132112", "java"],
						["132112", "java"],
					    ["132112", "VB"],
						["132112", "c"],
						["231112", "java"],
						["231112", "c"],
						["331112", "c#"],
						["132112", "c++"],

					

					]
                }
            })
        };
    };
    webapp.Administration.prototype._initView = function() {
        var so = this;
        return new jUI.Window({
            width: "100%",
            height: "100%",

            children: [new jUI.Tree({
                _style: {
                    overflow: "auto"
                },
                layout: jUI.Layout.ltFollowHor,
                width: 500,
                height: 500,
                dataset: so.models.options,

                events: {
                    onNodeSelectionChange: function(a) {
                        alert("User onSelect event: " + a.getText());
                    },
                    onViewStateChange: function(a) {
                        alert("User onCollaps/expand event: " + a.getText());
                    }
                }
            })]
        });


    };
})();