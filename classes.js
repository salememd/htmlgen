// Base Class
function JSView(elemn , params) {

    this.view = elemn;
	this.attributes = params;	
	
}

JSView.prototype.elemntAttr = ["class","id","style"];


JSView.prototype.getView = function() {

   return this.view;

}

JSView.prototype.initView = function(){
	
	for (var k in this.attributes){
		if(this.elemntAttr.indexOf(k) < 0 ){
			throw new Exception();
		}
	}
	
	for (var k in this.attributes){
	   this.view.setAttribute(k , this.attributes[k]);
	}
}

JSView.prototype.showView = function() {

    this.view["style"]["display"] = "block";

}

JSView.prototype.hideView = function() {

    this.view["style"]["display"] = "none";

}


JSView.prototype.render = function() {
	this.initView();
    document.body.appendChild(this.view);

}


/*-================================-*/

// Inheritance from view
function JSLayout(params) {
	
    JSView.call(this, document.createElement("div") , params); // Call the constructor 
	this.initView();
	
}

JSLayout.prototype =  new JSView();

JSLayout.prototype.add = function(viewObj) {

    this.view.appendChild(viewObj.getView());

}

/*-================================-*/

// Inheritance from view
function JSButton(params) {
	 JSView.call(this, document.createElement("input") , params); // Call the constructor 
	this.initView();

}


JSButton.prototype = Object.create(JSView.prototype);
JSButton.prototype.elemntAttr = (function(){var a = JSON.parse(JSON.stringify(JSView.prototype.elemntAttr)) /*clone the object*/; a.push("type","value"); return a;})();

JSButton.prototype.addOnClickListener = function(excute) {
    this.getView().addEventListener("click", excute);

}

/*-================================-*/

// Inheritance from view
function JSEditText(params) {

    JSView.call(this, document.createElement("input"), params);
	this.initView();


}

JSEditText.prototype =Object.create(JSView.prototype);
JSEditText.prototype.elemntAttr = (function(){var a = JSON.parse(JSON.stringify(JSView.prototype.elemntAttr)) /*clone the object*/; a.push("type","value","placeholder"); return a;})();



/*-================================-*/

// Inheritance from view
function JSTextView(params) {

    JSView.call(this, document.createElement("p"),params);
	this.initView();
}


JSTextView.prototype = Object.create(JSView.prototype);


JSTextView.prototype.setText = function(ttext) {
	  this.getView().appendChild(document.createTextNode(ttext));;


}

/*-================================-*/

// Inheritance from view
function JSSpan() {

    JSView.call(this, document.createElement("span"));
	this.initView();

}

JSSpan.prototype = Object.create(JSView.prototype);

JSSpan.prototype.setText = function(ttext) {
  this.getView().appendChild(document.createTextNode(ttext));;
}


/*-================================-*/

function JSPopUpMessages() {

    this.main = new JSLayout({"class": "modal"});

    this.inner = new JSLayout({"class": "modal-content"});

    this.x = new JSSpan({"class": "close"});
    this.x.setText("×");
	
    this.message = new JSTextView();

    this.inner.add(this.x);
    this.inner.add(this.message);

    this.main.add(this.inner);
	this.main.render();


    var self = this;
    this.x.getView().onclick = function() {
        self.main.hideView();
    }

    this.setMessage = function(content) {
        this.message.setText(content);
    }

    this.addButton = function(btn) {
        self.inner.add(btn);
    }


    this.show = function() {
        this.main.showView();
    }

    this.hide = function() {
        this.main.hideView();
    }
}