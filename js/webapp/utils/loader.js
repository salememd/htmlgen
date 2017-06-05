
/* global app, webapp, jUI */
(function(){
    webapp.Loader = function(){jUI.LoaderViewController.call(this);};
    webapp.Loader.prototype = new jUI.LoaderViewController({__loading__:true});
    webapp.Loader.prototype.constructor = webapp.Loader;
    webapp.Loader.prototype._initController = function(){
        this.loader = null;
        
        this.viewDidLoad = function(){
        };
        
        this.play = function(){
            this.view.show(true);
            this.loader.setPlaying(true);
        };
        this.stop = function(){
            this.loader.setPlaying(false);
            this.view.close();
        };
        
    };
    webapp.Loader.prototype._initView = function(){
        return new jUI.Window({
            className: "jui",
            av: ["|","-"],
            children:[
                this.loader = new jUI.Loader({
                    playing: false,
                    layout: jUI.Layout.ltFollowVer
                })
            ]
        });
    };
})();
