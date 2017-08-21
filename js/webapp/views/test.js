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
                    fields: ["text", "selected", "expand", "parent"],
                    rows: [
                        
						
						["a", true, true, -1],
						["b", true, false, 0],
						["c", true, false, 0],
						["d", true, false, 2],
                        ["e", true, false, 3],
                        ["f", true, false, 0],
						["g", true, false, -1],
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