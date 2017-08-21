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
                    fields: ["treeNodes"],
                    rows: [
                        [
						new jUI.Tree.Node({
                            selectable: true,
                            text: "a-f",
                            expanded: true,
                            children: [
                                new jUI.Tree.Node({
                                    text: "a",
                                    selectable: true,
                                    children: []
                                }),
                                new jUI.Tree.Node({
                                    text: "b",
                                    selectable: true,
                                    children: []
                                }),
                                new jUI.Tree.Node({
                                    text: "c-f",
                                    selectable: true,
                                    children: [
                                        new jUI.Tree.Node({
                                            text: "c",
                                            selectable: true,
                                            children: []
                                        }), new jUI.Tree.Node({
                                            text: "d - f",
                                            selectable: true,
                                            children: [
                                                new jUI.Tree.Node({
                                                    text: "d",
                                                    selectable: true,
                                                    children: []
                                                }),
                                                new jUI.Tree.Node({
                                                    text: "e",
                                                    selectable: true,
                                                    children: []
                                                }),
                                                new jUI.Tree.Node({
                                                    text: "f",
                                                    selectable: true,
                                                    children: []
                                                }),
                                            ],
                                            expanded: false
                                        }),
                                    ],
                                    expanded: true,
                                })
                            ],
                            expanded: true,
                        })
						],
                        [
                            new jUI.Tree.Node({
                                text: "g",
                                selectable: true,
                                expanded: true,
                                children: []
                            })
                        ],
                        [
                            new jUI.Tree.Node({
                                text: "h",
                                selectable: true,
                                expanded: true,
                                children: []
                            })
                        ],
                        [
                            new jUI.Tree.Node({
                                text: "i - n",
                                selectable: true,
                                children: [
                                    new jUI.Tree.Node({
                                        text: "i",
                                        selectable: true,
                                        expanded: true,
                                        children: []
                                    }),
                                    new jUI.Tree.Node({
                                        text: "j",
                                        selectable: true,
                                        expanded: true,
                                        children: []
                                    }),
                                    new jUI.Tree.Node({
                                        text: "k - m",
                                        selectable: true,
                                        children: [
                                            new jUI.Tree.Node({
                                                text: "k",
                                                selectable: true,
                                                expanded: true,
                                                children: []
                                            }), new jUI.Tree.Node({
                                                text: "l",
                                                selectable: true,
                                                expanded: true,
                                                children: []
                                            }), new jUI.Tree.Node({
                                                text: "m",
                                                selectable: true,
                                                expanded: true,
                                                children: []
                                            })
                                        ],
                                        expanded: true,
                                    }),
                                    new jUI.Tree.Node({
                                        text: "n",
                                        selectable: true,
                                        children: []
                                    })
                                ],
                                expanded: true,
                            })
                        ]


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