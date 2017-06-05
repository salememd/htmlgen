/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global jUI, app */

(function(){
    
    
    //=================================================================================
    // Window Start
    //=================================================================================
    
    /**
     * jUI.Window inherits from jUI.Layout.
     * 
     * @param {json} pa { <br>
     *      modalClassName: String (default jui-window-modal) <br>
     *      autoClose: boolean (default false) if click outside the window, it closes, <br>
     *      autoFree: boolean (default false) if true, the window will free once the window is closed. References to this window are still manually removed. This can be done through implementing a "close" event.<br>
     *      events:{<br>
     *          show: function(),<br>
     *          close: function()<br>
     *      }<br>
     * }
     * 
     * @constructor
     */
    jUI.Window = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            parent:app.mainForm,
            layout: jUI.Layout.ltFixed,
            className: "jui window",
            modalClassName:"jui window modal"
        }, false);
        jUI.Layout.call(this, newPa);
    };
    (function(){
        jUI.Window.prototype = new jUI.Layout({__loading__: true});
        jUI.Window.prototype.constructor = jUI.Window;
        jUI.Window._autoCloseWindows = [];
        app.addEvent(window,"mousedown",function(e){
            var wins = jUI.Window._autoCloseWindows;
            if(wins.length > 0){
                var nodesClicked = document.querySelectorAll( "[iswindow]:hover" ),i=wins.length-1,win,close;
                while(i>=0){
                    win = wins[i];
                    close = true;
                    for(var j=0,l2=nodesClicked.length;j<l2;++j){
                        if(win === nodesClicked[i].juiObject){
                            close = false;
                            break;
                        }
                    }
                    if(close && !win.__V.Window.showing){
                        win.close();
                    }
                    --i;
                }
            }
            
        });
        
        // Overriden Function Start ===========================================
        
        jUI.Window.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            this.__V.Window = {
                modalClassName: undefined,
                modalLayout: null,
                autoClose: false,
                autoFree: false,
                showing: false,
                showTimeoutId: null
            };
            this.__V.el.setAttribute("iswindow","true");
        };
        
        jUI.Window.prototype.setVisible = function(v){
            v? this.show() : this.close();
        };
        
        jUI.Window.prototype._addChild = function(ch){
            if(jUI.Layout.prototype._addChild.call(this, ch)){
                ch.__V.Layout.parentForm = this;
            }
        };
        
        // Overriden Function End ===========================================
        
        /**
         * @param {boolean} modal (optional)
         * @param {int} x (optional)
         * @param {int} y (optional)
         */
        jUI.Window.prototype.show = function(modal,x,y){
            var V = this.__V, vw = V.Window, so = this;
            if(V.visible) return;
            vw.showing = true;
            if(modal){
                vw.modalLayout = new jUI.Layout({
                    layout: jUI.Layout.ltFixed,
                    anchor: {l:0,r:0,t:0,b:0},
                    parent: app.mainForm,
                    visible: true,
                    className:vw.modalClassName
                });
            }
            vw.autoClose && jUI.Window._autoCloseWindows.push(this);
            vw.showTimeoutId = setTimeout(function(){
                vw.showTimeoutId = null;
                modal && vw.modalLayout._appendToClassName("in");
                so._appendToClassName("in");
            },100);
            this.bringToFront();
            x != null && y != null && this.setPosition(x,y);
            jUI.Layout.prototype.setVisible.call(this, true);
            this._doEvent("show");
            setTimeout(function(){vw.showing = false;},100);
        };
        jUI.Window.prototype.close = function(){
            var V = this.__V, vw = V.Window;
            if(!V.visible) return;
            if(vw.showTimeoutId){
                clearTimeout(vw.showTimeoutId);
                vw.showTimeoutId = null;
            }
            this._removeFromClassName("in");
            jUI.Layout.prototype.setVisible.call(this, false);
            jUI.Window._autoCloseWindows.remove(this);
            if(vw.modalLayout){
                vw.modalLayout.free();
                vw.modalLayout = null;
            }
            this._doEvent("close");
            !V.finalizing && vw.autoFree && this.free();
        };
        jUI.Window.prototype.setModalClassName = function(v){
            var V = this.__V.Window;
            V.modalClassName = v;
            if(V.modalLayout){
                V.modalLayout.setClassName(v);
            }
        };
        jUI.Window.prototype.setAutoClose = function(v){
            var V = this.__V.Window, so = this;
            if(V.autoClose === v) return;
            V.autoClose = v;
        };
        jUI.Window.prototype.setAutoFree = function(v){
            this.__V.Window.autoFree = v;
        };
        
        jUI.Window.prototype.getModalClassName = function(v){
            return this.__V.Window.modalClassName;
        };
        jUI.Window.prototype.getAutoClose = function(){
            return this.__V.Window.autoClose;
        };
        jUI.Window.prototype.getAutoFree = function(){
            return this.__V.Window.autoFree;
        };
        
        
        app.$(jUI.Window.prototype.__props = app.clone(jUI.Window.prototype.__props), {
            modalClassName: "setModalClassName",
            autoClose: "setAutoClose",
            autoFree: "setAutoFree"
        });
        
        jUI.Window.prototype.__events = jUI.Window.prototype.__events.clone().concat([
            "show",
            "close"
        ]);
        
    })();
    
    //=================================================================================
    // Window End 
    //=================================================================================
    
    //=================================================================================
    // Form Start
    //=================================================================================
    
    /**
     * jUI.Form inherits from jUI.Window.
     * 
     * @param {json} pa { <br>
     *      title: String,<br>
     *      titleAlign: jUI.Text.talXXX, <br>
     *      buttonsAlign: jUI.Layout.ialXXX (default jUI.Layout.ialRight), <br>
     *      buttons: [jUI.Button | jUI.Form.btnXXX] <br>
     * }
     * 
     * @constructor
     */
    jUI.Form = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            buttonsAlign: jUI.Layout.ialRight,
            className:"jui form"
        }, false);
        jUI.Window.call(this, newPa);
    };
    (function(){
        jUI.btnCancel = jUI.Form.btnCancel = 1;
        /**
         * @param {String} text
         * @param {function() -> boolean} action if returns false, the form won't close, otherwise, it will close.
         * @param {Integer} tabIndex Tab Index
         * @returns {jUI.Button}
         */
        jUI.butAction = jUI.Form.btnAction = function(text, action, tabIndex){
            !tabIndex && (tabIndex = -1);
            return new jUI.Button({tabIndex: tabIndex,text:text,events:{
                click: function(){
                    var retVal = action && action();
                    if(retVal !== false){
                        this.getParentForm().close();
                    }
                }
            }});
        };
    })();
    (function(){
        jUI.Form.prototype = new jUI.Window({__loading__: true});
	jUI.Form.prototype.constructor = jUI.Form;
        
        // Overriden Function Start ===========================================
        
        jUI.Form.prototype._initProp = function(pa){
            jUI.Window.prototype._initProp.call(this, pa);
            var title, so = this;
            this.__V.Form = {
                title: title = new jUI._IconLabelComponent({
                    parent:this,
                    className:"jui title",
                    width:"100%",
                    layout:jUI.Layout.ltFollowVer
                }),
                form: new jUI.Layout({
                    parent:this,
                    className:"jui body",
                    width:"100%",
                    layout:jUI.Layout.ltFollowVer,
                    visible: true,
                    _style: {
                        display: "inherit",
                        overflow: "auto"
                    }
                }),
                buttons: new jUI.Layout({
                    parent: this,
                    className: "jui buttons",
                    width:"100%",
                    visible: false,
                    layout:jUI.Layout.ltFollowVer
                })
            };
            
            title._setIconPosition("right");
            title._setIcon(new jUI.Shape(app.$(app.resources.icons.paths.closeBigThin,{
                events:{
                    click: function(){
                        so.close();
                    }
                }
            },true)));
        };
        
        jUI.Form.prototype.show = function(){
            jUI.Window.prototype.show.apply(this, arguments);
            this.__V.Form.title._updateIconPosition();
        };
        
        jUI.Form.prototype._childrenAppendNode = function(){
            var V = this.__V;
            if(V.intializing)
                return V.el;
            return this.__V.Form.form.__V.el;
        };
        
        // Overriden Function End ===========================================
        
        jUI.Form.prototype.setTitle = function(v){
            this.__V.Form.title._setText(v);
        };
        jUI.Form.prototype.setTitleAlign = function(v){
            this.__V.Form.title.setInnerAlign(v);
        };
        jUI.Form.prototype.setButtonsAlign = function(v){
            this.__V.Form.title.setInnerAlign(v);
        };
        jUI.Form.prototype.setButtonsAlign = function(v){
            var V = this.__V.Form;
            V.buttons.setInnerAlign(v);
        };
        /**
         * @param {[jUI.Button]} v
         */
        jUI.Form.prototype.addButton = function(v){
            var V = this.__V.Form, pa = {
                parent: V.buttons,
                layout: jUI.Layout.ltFollowHor
            };
            for(var i=0,l=v.length,btn;i<l;++i){
                btn = v[i];
                if(btn === jUI.Form.btnCancel){
                    new jUI.Button(app.$({
                        text:app.lang["cancel"],
                        events:{
                            click: function(){
                                this.getParentForm().close();
                            }
                        }
                    },pa,false));
                }else if(btn instanceof jUI.Button){
                    v[i].$(pa);
                }
            }
            v.length > 0 && V.buttons.setVisible(true);
        };
        
        
        jUI.Form.prototype.getTitle = function(){
            return this.__V.Form.title._getText();
        };
        jUI.Form.prototype.getTitleAlign = function(){
            return this.__V.Form.title.getInnerAlign();
        };
        
        
        app.$(jUI.Form.prototype.__props = app.clone(jUI.Form.prototype.__props), {
            title: "setTitle",
            titleAlign: "setTitleAlign",
            buttonsAlign: "setButtonsAlign",
            buttons: "addButton"
        });
        
        jUI.Form.prototype.__events = jUI.Form.prototype.__events.clone().concat([
        ]);
        
    })();
    
    //=================================================================================
    // Form End 
    //=================================================================================
    
    
    //=================================================================================
    // MessageDialog Start
    //=================================================================================
    
    /**
     * jUI.MessageDialog inherits from jUI.Form.
     * 
     * @param {json} pa { <br>
     *      type: jUI.MessageDialog.mtXXX,<br>
     *      message: String<br>
     * }
     * 
     * @constructor
     */
    jUI.MessageDialog = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            align: "|",
            valign: "-",
            maxWidth: 600,
            minWidth: 200,
            maxHeight: 350,
            innerAlign: jUI.Layout.ialLeft
        }, false);
        jUI.Form.call(this, newPa);
    };
    (function(){
        jUI.mtNone = jUI.MessageDialog.mtNone = 0;
        jUI.mtError = jUI.MessageDialog.mtError = 1;
        jUI.mtWarning = jUI.MessageDialog.mtWarning = 2;
        jUI.mtInformation = jUI.MessageDialog.mtInformation = 3;
        jUI.mtQuestion = jUI.MessageDialog.mtQuestion = 4;
    })();
    (function(){
        jUI.MessageDialog.prototype = new jUI.Form({__loading__: true});
	jUI.MessageDialog.prototype.constructor = jUI.MessageDialog;
        
        /**
         * @param {String} title
         * @param {String} mess
         * @param {jUI.MessageDialog.mtXXX} type
         * @param {[jUI.Button | jUI.Form.btnXXX]} btns
         */
        jUI.showMessage = function(title,mess,type,btns){
            new jUI.MessageDialog({
                title: title,
                type: type,
                message: mess,
                buttons: btns
            }).show(true);
        };
        
        
        // Overriden Function Start ===========================================
        
        jUI.MessageDialog.prototype._initProp = function(pa){
            jUI.Form.prototype._initProp.call(this, pa);
            this.__V.MessageDialog = {
                icon: null,
                message: null
            };
        };
        
        // Overriden Function End ===========================================
        
        jUI.MessageDialog.prototype.setMessage = function(v){
            var V = this.__V.MessageDialog;
            if(!V.message){
                V.message = new jUI.Text({
                    parent: this,
                    layout: jUI.Layout.ltFollowHor
                });
            }
            V.message.setText(v);
        };
        jUI.MessageDialog.prototype.setType = function(v){
            var V = this.__V.MessageDialog,path,icons = app.resources.icons.paths;
            switch(v){
                case jUI.MessageDialog.mtError:
                    path = app.$(icons.error,{classModifier:"error"},true); 
                    break;
                case jUI.MessageDialog.mtWarning:
                    path = app.$(icons.warning,{classModifier:"warning"},true); 
                    break;
                case jUI.MessageDialog.mtInformation:
                    path = app.$(icons.information,{classModifier:"information"},true); 
                    break;
                case jUI.MessageDialog.mtQuestion:
                    path = app.$(icons.question,{classModifier:"question"},true); 
                    break;
                default:
                    if(V.icon){
                        V.icon.free();
                        V.icon = null;
                    }
                    return;
            }
            if(!V.icon){
                V.icon = new jUI.Shape({
                    parent: this,
                    layout: jUI.Layout.ltFollowHor,
                    margin: {r:10}
                });
                V.icon.sendBack();
            }
            V.icon.$(path);
        };
        
        app.$(jUI.MessageDialog.prototype.__props = app.clone(jUI.MessageDialog.prototype.__props), {
            type: "setType",
            message: "setMessage"
        });
        
        jUI.MessageDialog.prototype.__events = jUI.MessageDialog.prototype.__events.clone().concat([
        ]);
        
    })();
    
    //=================================================================================
    // MessageDialog End 
    //=================================================================================
    
    
    
})();
