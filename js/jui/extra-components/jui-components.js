/* global jUI, app */


(function(){

/**
     * jUI.Label
     * 
     * @extends jUI.DBComponent.
     * 
     * @param {json} pa {<br>
     *      text: String, <br>
     *      textAligh: jUI.Text.talXXX, <br>
     *      selectable: boolean (true), <br>
     *      forId: String <br>
     * }
     * @constructor
     */
    jUI.Label = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui label",
            visible: true
        }, false);
        var el = document.createElement("label");
        
        jUI.DBComponent.call(this,newPa,el);
    };
    (function(){

    })();
    (function(){
        jUI.Label.prototype = new jUI.DBComponent({__loading__: true});
	jUI.Label.prototype.constructor = jUI.Label;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Label.prototype._initProp = function(pa){
            jUI.DBComponent.prototype._initProp.call(this, pa);
            
            this.__V.Label = {
                text: "",
                selectable: true,
                forId: null
            };
            
        };
        
        jUI.Label.prototype._addChild = function(ch){
            return false;
        };
        jUI.Label.prototype._removeChild = function(ch){
            return false;
        };
        
        jUI.Label.prototype.setValue = function(v){
            jUI.DBComponent.prototype.setValue.call(this, v);
            this.setText(v);
        };

        // Overriden Function End ===========================================
        
        jUI.Label.prototype.setForId = function(v){
            var V = this.__V;
            (v && (V.Label.forId = v) ) || (V.Label.forId="") ;
            v && V.el.setAttribute("for",v);
        };
        jUI.Label.prototype.getForId = function(){
            return this.__V.Label.forId;
        };

        jUI.Label.prototype.setText = function(v){
            var V = this.__V;
            V.el.innerHTML = v;
            V.Label.text = v;
        };
        jUI.Label.prototype.setSelectable = function(v){
            var V = this.__V;
            if(V.Label.selectable === v) return;
            V.Label.selectable = v;
            if(!v)
                this._appendToClassName("no-selection");
            else
                this._removeFromClassName("no-selection");
        };
        
        jUI.Label.prototype.getText = function(){
            return this.__V.Label.text;
        };
        
        jUI.Label.prototype.setTextAlign = function(v){
            this.setInnerAlign(v);
            var ha;
            switch(v&3){
                case 2: ha = app.rtl? "left" : "right"; break;
                case 3: ha = "center"; break;
                default: ha = app.rtl? "right" : "left"; break;
            }
            this.__V.el.style.textAlign = ha; 
        };
        
        jUI.Label.prototype.getTextAlign= function(){
            return this.getInnerAlign();
        };
        
        jUI.Label.prototype.getSelectable = function(){
            return this.__V.Label.selectable;
        };

        app.$(jUI.Label.prototype.__props = app.clone(jUI.Label.prototype.__props), {
            text: "setText",
            textAlign: "setTextAlign",
            selectable: "setSelectable",
            forId: "setForId"
        });

        jUI.Label.prototype.__events = jUI.Label.prototype.__events.clone().concat([
        ]);

    })();

    // =================================================================================
    // Label End
    // =================================================================================

})();