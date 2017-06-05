
/* global jUI, app */

(function(){
    
    
    // =================================================================================
    // Shape Start 
    // =================================================================================
    
    /**
     * jUI.Shape 
     * @extends jUI.Canvas.
     * 
     * @param {json} pa {<br>
     *      path: String svg path <br>
     * }
     * @constructor
     */
    jUI.Shape = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui icon"
        }, false);
        jUI.Canvas.call(this, newPa);
    };
    (function(){
        jUI.Shape.prototype = new jUI.Canvas({__loading__: true});
	jUI.Shape.prototype.constructor = jUI.Shape;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Shape.prototype._initProp = function(pa){
            jUI.Canvas.prototype._initProp.call(this, pa);
            this.__V.Shape = {
                path: new jUI.Canvas.Path({parent:this})
            };
        };
        jUI.Shape.prototype._setClassName = function(){
            this.__V.Shape.path._setClassName();
        };
        jUI.Shape.prototype._resetClassName = function(){
            this.__V.Shape.path._resetClassName();
        };
        jUI.Shape.prototype._appendToClassName = function(v){
            this.__V.Shape.path._appendToClassName(v);
        };
        jUI.Shape.prototype._removeFromClassName = function(v){
            this.__V.Shape.path._removeFromClassName(v);
        };
        jUI.Shape.prototype.setClassName = function(v){
            this.__V.Shape.path.setClassName(v);
        };
        
        // Overriden Function End ===========================================
        /**
         */
        jUI.Shape.prototype.setPath = function(v){
            this.__V.Shape.path.setPath(v);
        };
        
        jUI.Shape.prototype.getPath = function(){
            return this.__V.Shape.path.getPath();
        };
        
        app.$(jUI.Shape.prototype.__props = app.clone(jUI.Shape.prototype.__props), {
            path: "setPath"
        });
        
        jUI.Shape.prototype.__events = jUI.Shape.prototype.__events.clone().concat([
        ]);
        
    })();
    
    // =================================================================================
    // Shape End
    // =================================================================================
    
    // =================================================================================
    // Text Start 
    // =================================================================================
    
    /**
     * jUI.Text
     * 
     * @extends jUI.DBComponent.
     * 
     * @param {json} pa {<br>
     *      text: String, <br>
     *      textAlign: jUI.Text.talXXX, <br>
     *      selectable: boolean (true) <br>
     * }
     * @param {DomElement} _element (optional) The underlying DomElement 
     * that will be used for this Layout.
     * @constructor
     */
    jUI.Text = function(pa, _element){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui text",
            visible: true
        }, false);
        
        jUI.DBComponent.call(this,newPa,_element);
    };
    (function(){
	jUI.talNone = jUI.Text.talNone = 0;
	jUI.talLeft = jUI.Text.talLeft = 1;
	jUI.talRight = jUI.Text.talRight = 2;
	jUI.talCenter = jUI.Text.talCenter = 3;
	jUI.talTop = jUI.Text.talTop = 4;
	jUI.talBottom = jUI.Text.talBottom = 8;
	jUI.talMiddle = jUI.Text.talMiddle = 12;
    })();
    (function(){
        jUI.Text.prototype = new jUI.DBComponent({__loading__: true});
	jUI.Text.prototype.constructor = jUI.Text;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Text.prototype._initProp = function(pa){
            jUI.DBComponent.prototype._initProp.call(this, pa);
            this.__V.Text = {
                text: "",
                selectable: true
            };
            
        };
        
        jUI.Text.prototype._addChild = function(ch){
            return false;
        };
        jUI.Text.prototype._removeChild = function(ch){
            return false;
        };
        
        jUI.Text.prototype.setValue = function(v){
            jUI.DBComponent.prototype.setValue.call(this, v);
            this.setText(v);
        };
        
        // Overriden Function End ===========================================
        jUI.Text.prototype.setText = function(v){
            var V = this.__V;
            V.el.innerHTML = v;
            V.Text.text = v;
        };
        jUI.Text.prototype.setSelectable = function(v){
            var V = this.__V;
            if(V.Text.selectable === v) return;
            V.Text.selectable = v;
            if(!v)
                this._appendToClassName("no-selection");
            else
                this._removeFromClassName("no-selection");
        };
        
        jUI.Text.prototype.getText = function(){
            return this.__V.Text.text;
        };
        
        jUI.Text.prototype.setTextAlign = function(v){
            this.setInnerAlign(v);
            var ha;
            switch(v&3){
                case 2: ha = app.rtl? "left" : "right"; break;
                case 3: ha = "center"; break;
                default: ha = app.rtl? "right" : "left"; break;
            }
            this.__V.el.style.textAlign = ha; 
        };
        
        jUI.Text.prototype.getTextAlign= function(){
            return this.getInnerAlign();
        };
        
        jUI.Text.prototype.getSelectable = function(){
            return this.__V.Text.selectable;
        };
        
        app.$(jUI.Text.prototype.__props = app.clone(jUI.Text.prototype.__props), {
            text: "setText",
            textAlign: "setTextAlign",
            selectable: "setSelectable"
        });
        
        jUI.Text.prototype.__events = jUI.Text.prototype.__events.clone().concat([
        ]);
        
    })();
    
    // =================================================================================
    // Text End
    // =================================================================================
    
    
    // =================================================================================
    // Image Start 
    // =================================================================================
    
    /**
     * @extends jUI.DBComponent
     * 
     * @param {json} pa {<br>
     *      url: String, <br>
     *      autoResize: boolean (default true), <br>
     *      events: { <br>
     *          load <br>
     *      }<br>
     * } <br>
     * 
     * @constructor
     */
    jUI.Image = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui image",
            visible: true,
            autoResize: true
        }, false);
        
        jUI.DBComponent.call(this,newPa);
    };
    (function(){
        jUI.Image.prototype = new jUI.DBComponent({__loading__: true});
	jUI.Image.prototype.constructor = jUI.Image;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Image.prototype._initProp = function(pa){
            jUI.DBComponent.prototype._initProp.call(this, pa);
            var imgEl = document.createElement("img");
            imgEl.juiObject = this;
            imgEl.onload = this._imageLoaded;
            var s = this.__V.el.style;
            s.backgroundPosition = "center center";
            s.backgroundRepeat = "no-repeat";
            this.__V.Image = {
                imgEl: imgEl,
                loaded: false,
                autoResize: true
            };
        };
        
        jUI.Image.prototype.finalize = function(){
            var imgEl = this.__V.Image.imgEl;
            delete imgEl.juiObject;
            delete this.__V.Image.imgEl;
            jUI.DBComponent.prototype.finalize.call(this);
        };
        
        // Overriden Function End ===========================================
        
        jUI.Image.prototype._imageLoaded = function(){
            var so = this.juiObject, V = so.__V;
            V.Image.loaded = true;
            so._updateSize();
            V.el.style.backgroundImage = "url("+V.Image.imgEl.src+")";
            so._doEvent("load");
        };
        jUI.Image.prototype._updateSize = function(){
            var V = this.__V,imgEl = V.Image.imgEl,w,h;
            if(V.Image.loaded){
                if(V.Image.autoResize){
                    w = imgEl.width;
                    h = imgEl.height;
                    this.setSize(w, h);
                }
                //V.el.style.backgroundSize = 25px 25px;
            }
        };
        
        jUI.Image.prototype.setUrl = function(v){
            var V = this.__V.Image;
            V.loaded = false;
            V.imgEl.src = v;
        };
        jUI.Image.prototype.setAutoResize = function(v){
            this.__V.Image.autoResize = v;
            this._updateSize();
        };
        
        jUI.Image.prototype.getUrl = function(){
            return this.__V.Image.imgEl.src;
        };
        jUI.Image.prototype.getAutoResize = function(){
            return this.__V.Image.autoResize;
        };
        jUI.Image.prototype.getImageWidth = function(){
            var V = this.__V.Image;
            return V.loaded? V.imgEl.width : undefined;
        };
        jUI.Image.prototype.isLoaded= function(){
            return this.__V.Image.loaded;
        };
        jUI.Image.prototype.getImageHeight = function(){
            var V = this.__V.Image;
            return V.loaded? V.imgEl.height : undefined;
        };
        
        app.$(jUI.Image.prototype.__props = app.clone(jUI.Image.prototype.__props), {
            url: "setUrl",
            autoResize: "setAutoResize"
        });
        
        jUI.Image.prototype.__events = jUI.Image.prototype.__events.clone().concat([
            "load"
        ]);
        
    })();
    
    // =================================================================================
    // Image End
    // =================================================================================
    
    
    // =================================================================================
    // Button Start 
    // =================================================================================
    
    /**
     * jUI.Button 
     * 
     * @extends jUI.Layout.
     * 
     * @param {json} pa {<br>
     *      text: String, <br>
     *      icon: jUI.Image | jUI.Shape, <br>
     *      iconAlign: jUI.Button.ialXXX <br>
     * }
     * @param {DomElement} _element (optional) The underlying DomElement 
     * that will be used for this Layout.
     * @constructor
     */
    jUI.Button = function(pa, _element){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui button",
            visible: true,
            innerAlign: jUI.Layout.ialCenter | jUI.Layout.ialMiddle,
            noWrap: true
        }, false);
        
        jUI.Layout.call(this,newPa,_element);
    };
    (function(){
        jUI.ialLeft = jUI.Button.ialLeft = 1;
        jUI.ialRight = jUI.Button.ialRight = 2;
    })();
    (function(){
        jUI.Button.prototype = new jUI.Layout({__loading__: true});
	jUI.Button.prototype.constructor = jUI.Button;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Button.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            this.__V.Button = {
                text: null,
                iconWidth: undefined,
                iconHeight: undefined,
                iconType: jUI.Button.ictImage,
                icon: undefined,
                iconLayout: null,
                iconAlign: jUI.Button.ialLeft
            };
        };
        
        // Overriden Function End ===========================================
        
        jUI.Button.prototype.setText = function(v){
            var V = this.__V.Button;
            if(v){
                if(!V.text) V.text = new jUI.Text({
                    layout: jUI.Layout.ltFollowHor,
                    selectable: false,
                    parent:this
                });
                V.text.setText(v);
            }else{
                if(V.text){
                    V.text.free();
                    V.text = null;
                }
            }
        };
        jUI.Button.prototype.setIconAlign = function(v){
            var V = this.__V.Button;
            V.iconAlign = v;
            V.icon && V.icon[v === jUI.Button.ialRight? "bringToFront" : "sendBack"]();
        };
        jUI.Button.prototype.setIcon = function(v){
            if(v && !(v instanceof jUI.Image || v instanceof jUI.Shape)) return;
            var V = this.__V.Button;
            if(V.icon === v) return;
            if(!v && V.icon){
                V.icon.free();
            }
            if(v){
                v.$({layout: jUI.Layout.ltFollowHor,parent:this});
                v[V.iconAlign === jUI.Button.ialRight? "bringToFront" : "sendBack"]();
            }
            V.icon = v;
        };
        
        jUI.Button.prototype.getText= function(){
            var V = this.__V.Button;
            return V.text && V.text.getText() || "";
        };
        jUI.Button.prototype.getIcon = function(){
            return this.__V.Button.icon;
        };
        jUI.Button.prototype.getIconAlign = function(){
            return this.__V.Button.iconAlign;
        };
        
        app.$(jUI.Button.prototype.__props = app.clone(jUI.Button.prototype.__props), {
            text: "setText",
            icon: "setIcon",
            iconAlign: "setIconAlign"
        });
        
        jUI.Button.prototype.__events = jUI.Button.prototype.__events.clone().concat([
        ]);
        
    })();
    
    // =================================================================================
    // Button End
    // =================================================================================
    
    // =================================================================================
    // SubmitButton Start 
    // =================================================================================
    
    /**
     * jUI.SubmitButton 
     * 
     * @extends jUI.Button.
     * 
     * @param {json} pa {<br>
     * }
     * @constructor
     */
    jUI.SubmitButton = function(pa){
        if(pa && pa.__loading__) return;
        var el = document.createElement("input");
        el.type = "submit";
        jUI.Layout.call(this,pa,el);
    };
    (function(){
        jUI.SubmitButton.prototype = new jUI.Button({__loading__: true});
	jUI.SubmitButton.prototype.constructor = jUI.SubmitButton;
        
        app.$(jUI.SubmitButton.prototype.__props = app.clone(jUI.SubmitButton.prototype.__props), {
        });
        
        jUI.SubmitButton.prototype.__events = jUI.SubmitButton.prototype.__events.clone().concat([
        ]);
        
    })();
    
    // =================================================================================
    // SubmitButton End
    // =================================================================================
    
    
    
    // =================================================================================
    // _IconLabelComponent Start 
    // =================================================================================
    
    /**
     * jUI._IconLabelComponent
     * 
     * @extends jUI.DBComponent
     * 
     * @param {json} pa {<br>
     *      _text: String <br>
     * }
     * @param {DomElement} _element (optional) The underlying DomElement 
     * that will be used for this Layout.
     * @constructor
     */
    jUI._IconLabelComponent = function(pa, _element){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            innerAlign: jUI.Layout.ialMiddle | jUI.Layout.ialLeft
        }, false);
        jUI.DBComponent.call(this,newPa, _element);
    };
    (function(){
        jUI._IconLabelComponent.prototype = new jUI.DBComponent({__loading__: true});
        jUI._IconLabelComponent.prototype.constructor = jUI._IconLabelComponent;
        
        
        // Overriden Function Start ===========================================
        
        jUI._IconLabelComponent.prototype._initProp = function(pa){
            jUI.DBComponent.prototype._initProp.call(this, pa);
            var el = this.__V.el;
            this.__V._IconLabelComponent = {
                text: new jUI.Text({parent:this,layout:jUI.Layout.ltFollowHor,_style:{overflow:"hidden"}}),
                shape: null,
                iconPosition: null
            };
            el.style["white-space"] = "nowrap";
            el.style["overflow"] = "hidden";
        };
        
        jUI._IconLabelComponent.prototype.setClassName = function(v){
            jUI.DBComponent.prototype.setClassName.call(this, v);
            this._updateIconPosition();
        };
        
        // Overriden Function End ===========================================
        
        
        jUI._IconLabelComponent.prototype._updateIconPosition = function(){
            var V = this.__V._IconLabelComponent, el = this.__V.el,s = el.style;
            if(!V.iconPosition) return;
            var onLeft = V.iconPosition === "left",
                    pdl = "padding-"+V.iconPosition, 
                    pdr = "padding-"+(onLeft ? "right" : "left"),
                    padding = app.rtl? pdr : pdl;
            s[pdl] = null;
            s[pdr] = null;
            if(V.shape){
                var comPadding = window.getComputedStyle(el, null).getPropertyValue(padding);
                comPadding = +comPadding.substring(0,comPadding.length-2) || 5;
                s[padding] = (V.shape.getWidth()+5+comPadding)+"px";
                if(onLeft)
                    V.shape.$({left: comPadding, right: undefined});
                else
                    V.shape.$({right: comPadding, left: undefined});
            }
        };
        
        jUI._IconLabelComponent.prototype._setText = function(v){
            this.__V._IconLabelComponent.text.setText(v);
        };
        /**
         * @returns {jUI.Shape}
         */
        jUI._IconLabelComponent.prototype._getIcon = function(v){
            return this.__V._IconLabelComponent.shape;
        };
        
        /**
         * @param {jUI.Shape} v
         */
        jUI._IconLabelComponent.prototype._setIcon = function(v){
            var V = this.__V._IconLabelComponent;
            if(V.shape === v) return;
            V.shape && V.shape.free();
            V.shape = v;
            v.$({
                parent: this,
                valign: "-"
            });
            this._updateIconPosition();
        };
        
        jUI._IconLabelComponent.prototype._setIconPosition = function(v){
            this.__V._IconLabelComponent.iconPosition = v;
            this._updateIconPosition();
        };
        
        jUI._IconLabelComponent.prototype._getText = function(){
            return this.__V._IconLabelComponent.text.getText();
        };
        
        app.$(jUI._IconLabelComponent.prototype.__props = app.clone(jUI._IconLabelComponent.prototype.__props), {
            _text: "_setText"
        });
        
        jUI._IconLabelComponent.prototype.__events = jUI._IconLabelComponent.prototype.__events.clone().concat([
        ]);
        
    })();
    
    // =================================================================================
    // _IconLabelComponent End
    // =================================================================================
    
    
    
    // =================================================================================
    // Loader Start 
    // =================================================================================
    
    /**
     * jUI.Loader 
     * 
     * @TODO other loaders that you can add : http://codepen.io/aurer/pen/jEGbA
     * 
     * @extends jUI.Layout.
     * 
     * @param {json} pa {<br>
     *      size: int, <br>
     *      text: String, <br>
     *      textPosition: "left" | "right" | "top" | "bottom" | null, <br>
     *      playing: boolean (default false) <br>
     * }
     * @constructor
     */
    jUI.Loader = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui loader",
            visible: true,
            noWrap: true
        }, false);
        
        jUI.Layout.call(this,newPa);
    };
    (function(){
        jUI.Loader.prototype = new jUI.Layout({__loading__: true});
	jUI.Loader.prototype.constructor = jUI.Loader;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Loader.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            var cnv;
            this.__V.Loader = {
                text: null,
                textPosition: null,
                size: 10,
                palying: false,
                canvas: cnv = new jUI.Canvas({
                    parent:this,
                    width:80,
                    height:80,
                    layout:jUI.Layout.ltFollowHor,
                    children: [
                        new jUI.Canvas.Path({
                            className: "indicator",
//                            path: "M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z",
                            path: "M10,40c0,0,0-0.4,0-1.1c0-0.3,0-0.8,0-1.3c0-0.3,0-0.5,0-0.8c0-0.3,0.1-0.6,0.1-0.9c0.1-0.6,0.1-1.4,0.2-2.1 "
                                    +"c0.2-0.8,0.3-1.6,0.5-2.5c0.2-0.9,0.6-1.8,0.8-2.8c0.3-1,0.8-1.9,1.2-3c0.5-1,1.1-2,1.7-3.1c0.7-1,1.4-2.1,2.2-3.1 "
                                    +"c1.6-2.1,3.7-3.9,6-5.6c2.3-1.7,5-3,7.9-4.1c0.7-0.2,1.5-0.4,2.2-0.7c0.7-0.3,1.5-0.3,2.3-0.5c0.8-0.2,1.5-0.3,2.3-0.4l1.2-0.1 "
                                    +"l0.6-0.1l0.3,0l0.1,0l0.1,0l0,0c0.1,0-0.1,0,0.1,0c1.5,0,2.9-0.1,4.5,0.2c0.8,0.1,1.6,0.1,2.4,0.3c0.8,0.2,1.5,0.3,2.3,0.5 "
                                    +"c3,0.8,5.9,2,8.5,3.6c2.6,1.6,4.9,3.4,6.8,5.4c1,1,1.8,2.1,2.7,3.1c0.8,1.1,1.5,2.1,2.1,3.2c0.6,1.1,1.2,2.1,1.6,3.1 "
                                    +"c0.4,1,0.9,2,1.2,3c0.3,1,0.6,1.9,0.8,2.7c0.2,0.9,0.3,1.6,0.5,2.4c0.1,0.4,0.1,0.7,0.2,1c0,0.3,0.1,0.6,0.1,0.9 "
                                    +"c0.1,0.6,0.1,1,0.1,1.4C74,39.6,74,40,74,40c0.2,2.2-1.5,4.1-3.7,4.3s-4.1-1.5-4.3-3.7c0-0.1,0-0.2,0-0.3l0-0.4c0,0,0-0.3,0-0.9 "
                                    +"c0-0.3,0-0.7,0-1.1c0-0.2,0-0.5,0-0.7c0-0.2-0.1-0.5-0.1-0.8c-0.1-0.6-0.1-1.2-0.2-1.9c-0.1-0.7-0.3-1.4-0.4-2.2 "
                                    +"c-0.2-0.8-0.5-1.6-0.7-2.4c-0.3-0.8-0.7-1.7-1.1-2.6c-0.5-0.9-0.9-1.8-1.5-2.7c-0.6-0.9-1.2-1.8-1.9-2.7c-1.4-1.8-3.2-3.4-5.2-4.9 "
                                    +"c-2-1.5-4.4-2.7-6.9-3.6c-0.6-0.2-1.3-0.4-1.9-0.6c-0.7-0.2-1.3-0.3-1.9-0.4c-1.2-0.3-2.8-0.4-4.2-0.5l-2,0c-0.7,0-1.4,0.1-2.1,0.1 "
                                    +"c-0.7,0.1-1.4,0.1-2,0.3c-0.7,0.1-1.3,0.3-2,0.4c-2.6,0.7-5.2,1.7-7.5,3.1c-2.2,1.4-4.3,2.9-6,4.7c-0.9,0.8-1.6,1.8-2.4,2.7 "
                                    +"c-0.7,0.9-1.3,1.9-1.9,2.8c-0.5,1-1,1.9-1.4,2.8c-0.4,0.9-0.8,1.8-1,2.6c-0.3,0.9-0.5,1.6-0.7,2.4c-0.2,0.7-0.3,1.4-0.4,2.1 "
                                    +"c-0.1,0.3-0.1,0.6-0.2,0.9c0,0.3-0.1,0.6-0.1,0.8c0,0.5-0.1,0.9-0.1,1.3C10,39.6,10,40,10,40z",
                            children:[
                                new jUI.Canvas.Animation({
                                    attributeName: "transform",
                                    type:"rotate",
                                    from: "0 40 40",
                                    to: "360 40 40",
                                    duration: "0.9s",
                                    repeatCount: "indefinite"
                                })
                            ]
                        }),
                        new jUI.Canvas.Path({
                            className: "indicator white",
//                            path: "M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z",
                            path: "M62,40.1c0,0,0,0.2-0.1,0.7c0,0.2,0,0.5-0.1,0.8c0,0.2,0,0.3,0,0.5c0,0.2-0.1,0.4-0.1,0.7 "
                                    +"c-0.1,0.5-0.2,1-0.3,1.6c-0.2,0.5-0.3,1.1-0.5,1.8c-0.2,0.6-0.5,1.3-0.7,1.9c-0.3,0.7-0.7,1.3-1,2.1c-0.4,0.7-0.9,1.4-1.4,2.1 "
                                    +"c-0.5,0.7-1.1,1.4-1.7,2c-1.2,1.3-2.7,2.5-4.4,3.6c-1.7,1-3.6,1.8-5.5,2.4c-2,0.5-4,0.7-6.2,0.7c-1.9-0.1-4.1-0.4-6-1.1 "
                                    +"c-1.9-0.7-3.7-1.5-5.2-2.6c-1.5-1.1-2.9-2.3-4-3.7c-0.6-0.6-1-1.4-1.5-2c-0.4-0.7-0.8-1.4-1.2-2c-0.3-0.7-0.6-1.3-0.8-2 "
                                    +"c-0.2-0.6-0.4-1.2-0.6-1.8c-0.1-0.6-0.3-1.1-0.4-1.6c-0.1-0.5-0.1-1-0.2-1.4c-0.1-0.9-0.1-1.5-0.1-2c0-0.5,0-0.7,0-0.7 "
                                    +"s0,0.2,0.1,0.7c0.1,0.5,0,1.1,0.2,2c0.1,0.4,0.2,0.9,0.3,1.4c0.1,0.5,0.3,1,0.5,1.6c0.2,0.6,0.4,1.1,0.7,1.8 "
                                    +"c0.3,0.6,0.6,1.2,0.9,1.9c0.4,0.6,0.8,1.3,1.2,1.9c0.5,0.6,1,1.3,1.6,1.8c1.1,1.2,2.5,2.3,4,3.2c1.5,0.9,3.2,1.6,5,2.1 "
                                    +"c1.8,0.5,3.6,0.6,5.6,0.6c1.8-0.1,3.7-0.4,5.4-1c1.7-0.6,3.3-1.4,4.7-2.4c1.4-1,2.6-2.1,3.6-3.3c0.5-0.6,0.9-1.2,1.3-1.8 "
                                    +"c0.4-0.6,0.7-1.2,1-1.8c0.3-0.6,0.6-1.2,0.8-1.8c0.2-0.6,0.4-1.1,0.5-1.7c0.1-0.5,0.2-1,0.3-1.5c0.1-0.4,0.1-0.8,0.1-1.2 "
                                    +"c0-0.2,0-0.4,0.1-0.5c0-0.2,0-0.4,0-0.5c0-0.3,0-0.6,0-0.8c0-0.5,0-0.7,0-0.7c0-1.1,0.9-2,2-2s2,0.9,2,2C62,40,62,40.1,62,40.1z",
                            children:[
                                new jUI.Canvas.Animation({
                                    attributeName: "transform",
                                    type:"rotate",
                                    from: "0 40 40",
                                    to: "-360 40 40",
                                    duration: "0.6s",
                                    repeatCount: "indefinite"
                                })
                            ]
                        })
                    ]
                })
            };
            cnv.stopAnimations();
        };
        
        // Overriden Function End ===========================================
        
        jUI.Loader.prototype.setText = function(v){
            var V = this.__V.Loader;
            if(v){
                if(!V.text) V.text = new jUI.Text({
                    layout: jUI.Layout.ltFollowHor,
                    selectable: false,
                    parent:this
                });
                V.text.setText(v);
            }else{
                if(V.text){
                    V.text.free();
                    V.text = null;
                }
            }
        };
        jUI.Loader.prototype.setPlaying = function(v){
            var V = this.__V.Loader;
            V.palying = v;
            V.canvas[v? "playAnimations" : "stopAnimations"]();
        };
        
        
        jUI.Loader.prototype.getText= function(){
            var V = this.__V.Loader;
            return V.text && V.text.getText() || "";
        };
        jUI.Loader.prototype.getPlaying = function(){
            return this.__V.Loader.palying;
        };
        
        app.$(jUI.Loader.prototype.__props = app.clone(jUI.Loader.prototype.__props), {
            text: "setText",
            icon: "setIcon",
            iconAlign: "setIconAlign",
            playing: "setPlaying"
        });
        
        jUI.Loader.prototype.__events = jUI.Loader.prototype.__events.clone().concat([
        ]);
        
    })();
    
    // =================================================================================
    // Loader End
    // =================================================================================
    
    
    
    // =================================================================================
    // _ToolDock Start 
    // =================================================================================
    
    /**
     * jUI._ToolDock 
     * 
     * @extends jUI.Layout.
     * 
     * @param {json} pa {<br>
     * }
     * @constructor
     */
    jUI._ToolDock = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui tooldock",
            visible: true,
            noWrap: true
        }, false);
        jUI.Layout.call(this,newPa, document.createElement("ul"));
    };
    (function(){
        jUI._ToolDock.prototype = new jUI.Layout({__loading__: true});
	jUI._ToolDock.prototype.constructor = jUI._ToolDock;
        
        
        // Overriden Function Start ===========================================
        
        jUI._ToolDock.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            app.$(this.__V.el.style,{
                "list-style": "outside none none",
                "margin": "0px"
            }, true);
        };

        jUI._ToolDock.prototype._getDisplayType = function(){
            return jUI.Layout._dtFlex;
        };
        
        // Overriden Function End ===========================================
        
    })();
    /**
     * jUI.ToolButton 
     * 
     * @extends jUI.Button.
     * 
     * @param {json} pa {<br>
     * }
     * @constructor
     */
    jUI.ToolButton = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            height: "100%",
            layout: jUI.Layout.ltFollowHor,
            className: "jui toolbutton"
        }, false);
        
        jUI.Button.call(this,newPa,document.createElement("li"));
    };
     (function(){
        jUI.ToolButton.prototype = new jUI.Button({__loading__: true});
	jUI.ToolButton.prototype.constructor = jUI.ToolButton;
    })();
     /**
     * jUI.ToolText 
     * 
     * @extends jUI.Text.
     * 
     * @param {json} pa {<br>
     * }
     * @constructor
     */
    jUI.ToolText = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            height: "100%",
            layout: jUI.Layout.ltFollowHor,
            className: "jui tooltext",
            textAlign: jUI.talCenter | jUI.talMiddle
        }, false);
        
        jUI.Text.call(this,newPa,document.createElement("li"));
    };
     (function(){
        jUI.ToolText.prototype = new jUI.Text({__loading__: true});
	jUI.ToolText.prototype.constructor = jUI.ToolText;
    })();
    // =================================================================================
    // _ToolDock End
    // =================================================================================
    
    
    // =================================================================================
    // TabBar Start 
    // =================================================================================
    
    /**
     * jUI.TabBar
     * 
     * @extends jUI.Layout.
     * 
     * @param {json} pa {<br>
     *      pages: [jUI.TabBar.TabPage], <br>
     *      pageController: jUI.TabBar.TabPageController, <br>
     *      events: {<br>
     *          tabClose: function(jUI.TabBar.TabPage), <br>
     *          tabActive: function(jUI.TabBar.TabPage), <br>
     *          tabInactiv: function(jUI.TabBar.TabPage), <br>
     *      } <br>
     * }
     * @constructor
     */
    jUI.TabBar = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui tabbar",
            visible: true
        }, false);
        
        jUI.Layout.call(this,newPa);
    };
    (function(){
        jUI.TabBar.prototype = new jUI.Layout({__loading__: true});
	jUI.TabBar.prototype.constructor = jUI.TabBar;
        
        
        // Overriden Function Start ===========================================
        
        jUI.TabBar.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            var rs = app.resources.icons.paths;
            var V = this.__V;
            V.TabBar = {
                pages: [],
                scrollLayout: new jUI.Layout({
                    anchor: {l:25,r:25,t:0,b:0},
                    parent: this,
                    visible:true
                }),
                tabDock: new jUI._ToolDock({
                    height: "100%",
                    align: "<",
                    layout: jUI.Layout.ltFollowHor
                }),
                pageController: null,
                leftBtn: new jUI.Button({
                    anchor: {l:0,t:0,b:0},
                    icon: new jUI.Shape(app.rtl? rs.rightArrow : rs.leftArrow),
                    parent: this,
                    tag: app.rtl? 1 : -1,
                    events:{
                        dragStart: this._scroll,
                        dragStop: this._scrollTerminate
                    }
                }),
                rightBtn: new jUI.Button({
                    //layout: jUI.Layout.ltFixed,
                    anchor: {r:0,t:0,b:0},
                    icon: new jUI.Shape(app.rtl? rs.leftArrow : rs.rightArrow),
                    parent: this,
                    tag: app.rtl? -1 : 1,
                    events:{
                        dragStart: this._scroll,
                        dragStop: this._scrollTerminate
                    }
                }),
                activePage: null,
                scrollID: null
            };
            V.TabBar.tabDock.setParent(V.TabBar.scrollLayout);
            V.TabBar.scrollLayout.__V.el.style.overflow = "hidden";
        };
        
        // Overriden Function End ===========================================
        
        jUI.TabBar.prototype._scroll = function(){
            var so = this, V = so.getParent().__V.TabBar, e = V.scrollLayout.__V.el,oldPos = e.scrollLeft,theEnd;
            var f = function(){
                e.scrollLeft += so.getTag() * 5;
                theEnd = oldPos === e.scrollLeft;
                if(theEnd && V.scrollID){
                    clearInterval(V.scrollID);
                    V.scrollID = null;
                }
            };
            V.scrollID = setInterval(f,10);
        };
        jUI.TabBar.prototype._scrollTerminate = function(){
            var V = this.getParent().__V.TabBar;
            if(V.scrollID){
                clearInterval(V.scrollID);
                V.scrollID = null;
            }
        };
        /**
         * Adds one or more tab pages.
         * @param {jUI.TabBar.TabPage | [jUI.TabBar.TabPage]} v 
         */
        jUI.TabBar.prototype.addPage = function(v){
            var ps = arguments,V = this.__V.TabBar,pV;
            if(v instanceof Array)
                ps = v;
            var fp;
            for(var i=0,l=ps.length,p;i<l;++i){
                p = ps[i];
                if(p instanceof jUI.TabBar.TabPage){
                    !fp && (fp = p);
                    V.pages.push(p);
                    pV = p.__V.TabBarTabPage;
                    pV.tabBar && pV.tabBar.removePage(p);
                    pV.tabBar = this;
                    pV.tab.setParent(V.tabDock);
                    V.pageController && p.setParent(V.pageController);
                }
            }
            fp && (this.setActivePage(fp));
        };
        jUI.TabBar.prototype.removePage = function(v){
            var V = this.__V.TabBar,pi = V.pages.indexOf(v),pV = v.__V.TabBarTabPage;
            if(pi === -1) return;
            this._doEvent("tabClose",v);
            V.pages.deleteItem(pi);
            if(V.activePage === v){
                if(pi === V.pages.length) --pi;
                this.setActivePage(pi >= 0 ? V.pages[pi] : null);
            }
            pV.tab.setParent(null);
            V.pageController && v.setParent(V.pageController);
            pV.tabBar = null;
            
        };
        jUI.TabBar.prototype.setPageController = function(v){
            var V = this.__V.TabBar;
            V.pageController && V.pages.forEach(function(val){val.setParent(null);});
            V.pageController = v;
            v && V.pages.forEach(function(val){val.setParent(v);});
        };
        jUI.TabBar.prototype.setActivePage = function(v){
            var V = this.__V.TabBar,pV;
            if(V.activePage === v) return;
            if(V.activePage){
                pV = V.activePage.__V.TabBarTabPage;
                V.activePage.setVisible(false);
                pV.tab._removeFromClassName("active");
                this._doEvent("tabInactive",V.activePage);
            }
            V.activePage = v;
            if(v){
                pV = v.__V.TabBarTabPage;
                v.setVisible(true);
                pV.tab._appendToClassName("active");
                this._doEvent("tabActive",V.activePage);
            }
        };
        
        jUI.TabBar.prototype.getActivePage = function(){
            return this.__V.TabBar.activePage;
        };
        jUI.TabBar.prototype.getPageController = function(){
            return this.__V.TabBar.pageController;
        };
        
        app.$(jUI.TabBar.prototype.__props = app.clone(jUI.TabBar.prototype.__props), {
            pages: "addPage",
            pageController: "setPageController"
        });
        
        jUI.TabBar.prototype.__events = jUI.TabBar.prototype.__events.clone().concat([
            "tabClose",
            "tabActive",
            "tabInactive"
        ]);
        
    })();
    
     /**
     * jUI.TabBar.TabPage 
     * 
     * @extends jUI.Layout.
     * 
     * @param {json} pa {<br>
     *      title: String, <br>
     *      closable: boolean (default false), <br>
     *      icon: jUI.Image | jUI.Shape, <br>
     *      tabBar: jUI.TabBar <br>
     * }
     * @constructor
     */
    jUI.TabBar.TabPage = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui tabpage",
            anchor: {l:0,t:0,r:0,b:0}
        }, false);
        
        jUI.Layout.call(this,newPa);
    };
    (function(){
        jUI.TabBar.TabPage.prototype = new jUI.Layout({__loading__: true});
	jUI.TabBar.TabPage.prototype.constructor = jUI.TabBar.TabPage;
        
        
        // Overriden Function Start ===========================================
        
        jUI.TabBar.TabPage.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            this.__V.TabBarTabPage = {
                tab: new jUI.ToolButton({
                    className: "jui tabbar tab",
                    text: " ",
                    tag: this,
                    events: {
                        click: this.activate
                    }
                }),
                closable: false,
                tabBar: null,
                closeBtn: null
            };
        };
        
        jUI.TabBar.prototype.finalize = function(){
            var V = this.__V.TabBarTabPage;
            V.tabBar && V.tabBar.removePage(this);
            V.tab.free();
            delete V.tab;
            delete V.closeBtn;
            jUI.Layout.prototype.finalize.call(this);
        };
        
        // Overriden Function End ===========================================
        
        jUI.TabBar.TabPage.prototype.activate = function(){
            var so = this;
            if(so instanceof jUI.Button) 
                so = so.getTag();
            var V = so.__V.TabBarTabPage;
            V.tabBar && V.tabBar.setActivePage(so);
        };
        
        jUI.TabBar.TabPage.prototype.close= function(){
            var so = this;
            if(so instanceof jUI.Button) 
                so = so.getTag();
            var V = so.__V.TabBarTabPage;
            if(V.closable){
                V.tabBar && V.tabBar.removePage(so);
                so.free();
            }
        };
        jUI.TabBar.TabPage.prototype.setTitle = function(v){
            this.__V.TabBarTabPage.tab.setText(v);
        };
        jUI.TabBar.TabPage.prototype.setClosable = function(v){
            var V = this.__V.TabBarTabPage;
            if(V.closable === v) return;
            V.closable = v;
            if(v){
                V.closeBtn = new jUI.Button({
                    className: "jui tabclosebtn",
                    icon: new jUI.Shape(app.resources.icons.paths.close),
                    layout: jUI.Layout.ltFollowHor,
                    parent: V.tab,
                    tag: this,
                    events: {
                        click: this.close
                    }
                });
                V.closeBtn.__V.el.style["margin-"+(app.rtl? "right" : "left")] = "10px";
            }else{
                V.closeBtn && V.closeBtn.free();
                V.closeBtn = null;
            }
            
        };
        /**
         * @param {jUI.Shape | jUI.Image} v
         * @returns {undefined}
         */
        jUI.TabBar.TabPage.prototype.setIcon = function(v){
            this.__V.TabBarTabPage.tab.setIcon(v);
        };
        /**
         * @param {jUI.TabBar} v
         */
        jUI.TabBar.TabPage.prototype.setTabBar = function(v){
            var V = this.__V.TabBarTabPage;
            V.tabBar && V.tabBar.removePage(this);
            this._setTabBar(v);
            v && v.addPage(this);
        };
        
        jUI.TabBar.TabPage.prototype.getTitle = function(){
            return this.__V.TabBarTabPage.tab.getText();
            
        };
        jUI.TabBar.TabPage.prototype.getClosable = function(){
            return this.__V.TabBarTabPage.closable;
        };
        jUI.TabBar.TabPage.prototype.getIcon = function(){
            return this.__V.TabBarTabPage.tab.getIcon();
        };
        
        
        app.$(jUI.TabBar.TabPage.prototype.__props = app.clone(jUI.TabBar.TabPage.prototype.__props), {
            title: "setTitle",
            icon: "setIcon",
            closable: "setClosable",
            tabBar: "setTabBar"
        });
        
        jUI.TabBar.TabPage.prototype.__events = jUI.TabBar.TabPage.prototype.__events.clone().concat([
        ]);
        
    })();
    
    /**
     * jUI.TabBar.TabPageController 
     * 
     * @extends jUI.Layout.
     * 
     * @param {json} pa {<br>
    *       tabBar: jUI.TabBar
     * }
     * @constructor
     */
    jUI.TabBar.TabPageController = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui tabpagecontroller",
            visible:true
        }, false);
        
        jUI.Layout.call(this,newPa);
    };
    (function(){
        jUI.TabBar.TabPageController.prototype = new jUI.Layout({__loading__: true});
	jUI.TabBar.TabPageController.prototype.constructor = jUI.TabBar.TabPageController;
        
        
        // Overriden Function Start ===========================================
        
        
        // Overriden Function End ===========================================
        
        /**
         * @param {jUI.TabBar} v
         */
        jUI.TabBar.TabPageController.prototype.setTabBar = function(v){
            v && v.setPageController(this);
        };
        
        app.$(jUI.TabBar.TabPageController.prototype.__props = app.clone(jUI.TabBar.TabPageController.prototype.__props), {
            tabBar: "setTabBar"
        });
        
    })();
    
    // =================================================================================
    // TablBar End 
    // =================================================================================
    
    
    // =================================================================================
    // ToolBar Start 
    // =================================================================================
    
    /**
     * jUI.ToolBar 
     * 
     * @extends jUI.Layout.
     * 
     * @param {json} pa {<br>
     *      tools: [jUI.Layout | String], <br>
     *      rightTools: [jUI.Layout | String] <br>
     * }
     * @constructor
     */
    jUI.ToolBar = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui toolbar",
            visible: true,
            noWrap: true
        }, false);
        jUI.Layout.call(this,newPa);
    };
    (function(){
        jUI.ToolBar.prototype = new jUI.Layout({__loading__: true});
	jUI.ToolBar.prototype.constructor = jUI.ToolBar;
        
        
        // Overriden Function Start ===========================================
        
        jUI.ToolBar.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            this.__V.ToolBar = {
                toolDockLeft: new jUI._ToolDock({
                    height: "100%",
                    align: "<",
                    layout: jUI.ltFollowHor,
                    parent: this
                }),
                toolDockRight: new jUI._ToolDock({
                    height: "100%",
                    align: ">",
                    layout: jUI.ltFollowHor,
                    parent: this
                })
            };
        };
        
        // Overriden Function End ===========================================
        
        jUI.ToolBar.prototype._addTool = function(toolDock,v){
            var ts = v;
            if(v[0] instanceof Array)
                ts = v[0];
            
            var pa = {
                height: "100%",
                layout: jUI.Layout.ltFollowVer,
                parent: toolDock,
                visible: true
            };
            for(var i=0,l=ts.length,t;i<l;++i){
                t = ts[i];
                if(t instanceof jUI.ToolButton || t instanceof jUI.ToolText){
                    t.setParent(toolDock);
                }else if(typeof t === "string"){
                    new jUI.ToolText(pa).setText(t);
                }else{
                    ts[i].setParent(new jUI.Layout(pa, document.createElement("li")));
                }
            }
        };
        
        /**
         * Adds one or more tab pages to the left.
         * @param {jUI.Layout... | [jUI.Layout | String]} v 
         */
        jUI.ToolBar.prototype.addTool = function(v){
            this._addTool(this.__V.ToolBar.toolDockLeft,arguments);
        };
        
        /**
         * Adds one or more tab pages to the right.
         * @param {jUI.Layout... | [jUI.Layout | String]} v 
         */
        jUI.ToolBar.prototype.addRightTool = function(v){
            this._addTool(this.__V.ToolBar.toolDockRight,arguments);
        };
        
        app.$(jUI.ToolBar.prototype.__props = app.clone(jUI.ToolBar.prototype.__props), {
            tools: "addTool",
            rightTools: "addRightTool"
        });
        
        jUI.ToolBar.prototype.__events = jUI.ToolBar.prototype.__events.clone().concat([
        ]);
        
    })();
    
    
    // =================================================================================
    // ToolBar End 
    // =================================================================================
    
    
    // =================================================================================
    // SplitPanel Start 
    // =================================================================================
    
    /**
     * jUI.SplitPanel 
     * 
     * @extends jUI.Layout.
     * 
     * @param {json} pa {<br>
     *      panel1Children: [jUI.Layout], <br>
     *      panel2Children: [jUI.Layout], <br>
     *      orientation: jUI.orXXX (default jUI.orLeftRight), <br>
     *      splitterSize: int (default 10), <br>
     *      panelSize: int (default 150) <br>
     * }
     * @constructor
     */
    jUI.SplitPanel = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui splitpanel",
            visible: true,
            orientation: jUI.orLeftRight,
            splitterSize: 10,
            panelSize: 150
        }, false);
        jUI.Layout.call(this,newPa);
    };
    (function(){
        jUI.SplitPanel.prototype = new jUI.Layout({__loading__: true});
	jUI.SplitPanel.prototype.constructor = jUI.SplitPanel;
        
        
        // Overriden Function Start ===========================================
        
        jUI.SplitPanel.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            var panelProps = {
                layout: jUI.ltFollowHor,
                width: "100%",
                height: "100%",
                visible: true,
                className: "jui panel1",
                _style: {
                    overflow: "auto"
                }
            };
            var mouseStartPos,so = this;
            var tbl, V = this.__V.SplitPanel = {
                tbl: tbl = document.createElement("table"),
                panel1TD: document.createElement("td"),
                panel1: new jUI.Layout(panelProps),
                splitterTD: document.createElement("td"),
                splitter:  new jUI.Layout(app.$({
                    className: "jui splitter",
                    children: [
                        new jUI.Shape({
                            align: "|",
                            valign: "-"
                        })
                    ],
                    events: {
                        dragStart: function(e){
                            mouseStartPos = V.orientation&3? e.screenX : e.screenY;
                            document.body.style.cursor = V.orientation&3? "col-resize" : "row-resize";
                        },
                        drag: function(e){
                            var pos = V.orientation&3? e.screenX : e.screenY;
                            var diff = pos - mouseStartPos;
                            (V.orientation&10) && (diff = -diff);
                            app.rtl && (V.orientation&3) && (diff = -diff);
                            so.setPanelSize(V.panelSize + diff);
                            mouseStartPos = pos;
                        },
                        dragStop: function(e){
                            mouseStartPos = null;
                            document.body.style.cursor = null;
                        }
                    }
                },panelProps,false)),
                panel2TD: document.createElement("td"),
                panel2:  new jUI.Layout(app.$({
                    className: "jui panel2"
                },panelProps,false)),
                splitterSize: 10,
                orientation: null,
                panelSize: 150
            };
            var el = this.__V.el;
            app.$(V.tbl.style, {
                width: "100%",
                height: "100%"
            },true);
            V.tbl.cellPadding = 0;
            V.panel1TD.appendChild(V.panel1.__V.el);
            V.splitterTD.appendChild(V.splitter.__V.el);
            V.panel2TD.appendChild(V.panel2.__V.el);
            
            el.appendChild(V.tbl);
        };
        
        // Overriden Function End ===========================================
        
        jUI.SplitPanel.prototype.setOrientation = function(v){
            var V = this.__V.SplitPanel,p1 = V.panel1TD,p2 = V.panel2TD, sp = V.splitterTD,tbl = V.tbl;
            while(tbl.rows.length > 0) tbl.deleteRow(0);
            if(v&3){
                p1.style.width = v === jUI.orLeftRight? V.panelSize + "px" : "auto";
                p1.style.height = "100%";
                p2.style.width = v === jUI.orRightLeft? V.panelSize + "px" : "auto";
                p2.style.height = "100%";
                sp.style.height = "100%";
                sp.style.cursor = "col-resize";
                var r = tbl.insertRow(-1);
                r.appendChild(p1);
                r.appendChild(sp);
                r.appendChild(p2);
                V.splitter.getChildren()[0].$(app.resources.icons.paths.circlesVertical);
            }else{
                p1.style.height = v === jUI.orTopBottom? V.panelSize + "px" : "100%";
                p1.style.width = "100%";
                p2.style.height = v === jUI.orBottomTop? V.panelSize + "px" : "100%";
                p2.style.width = "100%";
                sp.style.width = "100%";
                sp.style.cursor = "row-resize";
                tbl.insertRow(-1).appendChild(p1);
                tbl.insertRow(-1).appendChild(sp);
                tbl.insertRow(-1).appendChild(p2);
                V.splitter.getChildren()[0].$(app.resources.icons.paths.circlesHorizontal);
            }
            V.orientation = v;
            this.setSplitterSize(V.splitterSize);
        };
        jUI.SplitPanel.prototype.setSplitterSize = function(v){
            var V = this.__V.SplitPanel;
            V.splitterTD.style[V.orientation&3 ? "width" : "height"] = v + "px";
            V.splitterSize = v;
        };
        jUI.SplitPanel.prototype.setPanelSize = function(v){
            var V = this.__V.SplitPanel;
            V[V.orientation&5? "panel1TD" : "panel2TD"].style[V.orientation&3 ? "width" : "height"] = v + "px";
            V.panelSize = v;
        };
        
        jUI.SplitPanel.prototype.addChildToPanel1 = function(v){
            this.__V.SplitPanel.panel1.addChildren(v);
        };
        jUI.SplitPanel.prototype.addChildToPanel2 = function(v){
            this.__V.SplitPanel.panel2.addChildren(v);
        };
        
        
        
        app.$(jUI.SplitPanel.prototype.__props = app.clone(jUI.SplitPanel.prototype.__props), {
            panel1Children: "addChildToPanel1",
            panel2Children: "addChildToPanel2",
            orientation: "setOrientation",
            splitterSize: "setSplitterSize",
            panelSize: "setPanelSize"
        });
        
        jUI.SplitPanel.prototype.__events = jUI.SplitPanel.prototype.__events.clone().concat([
        ]);
        
    })();
    
    
    // =================================================================================
    // SplitPanel End 
    // =================================================================================
    
    
    
    // =================================================================================
    // PanelList Start 
    // =================================================================================
    
    /**
     * jUI.PanelList 
     * 
     * @extends jUI.Layout.
     * 
     * @param {json} pa {<br>
     *      panels: [{title: String, panel: jUI.Layout}], <br>
     *      events: { <br>
     *          panelOpen: function(panel, index), <br>
     *          panelClose: function(panel, index) <br>
     *      }<br>
     * }
     * @constructor
     */
    jUI.PanelList = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui panellist",
            visible: true
        }, false);
        jUI.Layout.call(this,newPa);
    };
    (function(){
        jUI.PanelList.prototype = new jUI.Layout({__loading__: true});
        jUI.PanelList.prototype.constructor = jUI.PanelList;
        
        
        // Overriden Function Start ===========================================
        
        jUI.PanelList.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            this.__V.PanelList = {
                panels: [],
                selectedIndex: null
            };
        };
        
        // Overriden Function End ===========================================
        
        jUI.PanelList.prototype._rebuild = function(){
            var V = this.__V.PanelList, labelHeights = 0, sp, i = V.selectedIndex;
            if(i != null){
                V.panels.forEach(function(p){
                    labelHeights += p.label.getHeight() 
                        + app.getStyleComputedValue(p.panel.__V.el,"margin-top")
                        + app.getStyleComputedValue(p.panel.__V.el,"margin-bottom");
                });
                sp = V.panels[i];
                sp.panel.setHeight("calc(100% - "+labelHeights+"px)");
                sp.label._getIcon().$(app.resources.icons.paths.downArrow);
                this._doEvent("panelOpen", sp, i);
            }
            
        };
        
        jUI.PanelList.prototype.selectPanel = function(index){
            var V = this.__V.PanelList, ic = app.resources.icons.paths, p;
            if(V.selectedIndex != null){
                p = V.panels[V.selectedIndex];
                p.panel.setHeight(0);
                p.label._getIcon().$(app.rtl? ic.rightArrow : ic.leftArrow);
                this._doEvent("panelClose", p, V.selectedIndex);
            }
            V.selectedIndex = index !== V.selectedIndex? index : null;
            this._rebuild();
        };
        
        jUI.PanelList.prototype.addPanel = function(title, panel){
            var V = this.__V.PanelList, ic = app.resources.icons.paths, so = this, i = V.panels.length;
            var label = new jUI._IconLabelComponent({
                parent: this,
                _text: title,
                width: "100%",
                layout: jUI.ltFollowVer,
                visible: true,
                className: "jui panellabel",
                tag: i,
                events: {
                    click: function(){so.selectPanel(this.getTag());}
                }
            });
            label._setIconPosition("right");
            label._setIcon(new jUI.Shape(app.rtl? ic.rightArrow : ic.leftArrow));
            panel.$({
                parent: this,
                layout: jUI.ltFollowVer,
                height: 0,
                width: "100%",
                visible: true,
                className: "jui panel"
            });
            V.panels.push({label: label, panel: panel});
        };
        jUI.PanelList.prototype.addPanels = function(v){
            for(var i=0,l=v.length;i<l;++i){
                this.addPanel(v[i].title, v[i].panel);
            }
        };
        
        app.$(jUI.PanelList.prototype.__props = app.clone(jUI.PanelList.prototype.__props), {
            panels: "addPanels"
        });
        
        jUI.PanelList.prototype.__events = jUI.PanelList.prototype.__events.clone().concat([
            "panelOpen",
            "panelClose"
        ]);
        
    })();
    
    // =================================================================================
    // PanelList End 
    // =================================================================================
    
    
    
})();
