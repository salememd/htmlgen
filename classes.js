// Base Class
function JSView(elemn) {

    this.view = elemn;
    this.attr = {
        "style": {}
    };

}

JSView.prototype.setClassName = function(name) {
    this.attr["class"] = name;
    this.refreshView();

}

JSView.prototype.setIdName = function(name) {
    this.attr["id"] = name;
    this.refreshView();

}

JSView.prototype.showView = function() {

    this.attr["style"]["display"] = "block";
    this.refreshView();

}

JSView.prototype.hideView = function() {

    this.attr["style"]["display"] = "none";
    this.refreshView();

}

JSView.prototype.setWidth = function(val) {

    this.attr["style"]["width"] = val;
    this.refreshView();

}


JSView.prototype.setHeigh = function(val) {
    this.attr["style"]["height"] = val;
    this.refreshView();

}

JSView.prototype.getViewProperties = function() {
    return this.attr;
}

JSView.prototype.getView = function() {
    return this.view;
}

JSView.prototype.refreshView = function() {

    if (this.attr.hasOwnProperty("textnode")) {
        this.view.innerHTML = '';
        this.view.appendChild(document.createTextNode(this.attr["textnode"]));
    }

    for (k2 in this.attr.style) {
        this.getView().style[k2] = this.attr.style[k2];
    }

    for (attr in this.attr) {
        if (attr != "style") {
            this.view.setAttribute(attr, this.attr[attr]);
        }
    }
}

JSView.prototype.render = function() {

    this.refreshView();
    document.body.appendChild(this.view);

}


/*-================================-*/

// Inheritance from view
function JSLayout(type) {
    JSView.call(this, document.createElement("div")); // Call the constructor 
}

JSLayout.prototype = Object.create(JSView.prototype); // creates a JSView object and setting JSLayout.prototype to JSView.prototype "doesn't re-call the constructor"

JSLayout.prototype.add = function(viewObj) {

    viewObj.refreshView();
    this.view.appendChild(viewObj.getView());

}

/*-================================-*/

// Inheritance from view
function JSButton() {

    JSView.call(this, document.createElement("input"));
    this.attr["type"] = "submit";

}


JSButton.prototype = Object.create(JSView.prototype);

JSButton.prototype.setTitle = function(title) {
    this.attr["value"] = title;
    this.refreshView();

}


JSButton.prototype.addOnClickListener = function(excute) {
    this.getView().addEventListener("click", excute);
    this.refreshView();

}

/*-================================-*/

// Inheritance from view
function JSEditText() {
    JSView.call(this, document.createElement("input"));
    this.attr["type"] = "text";
    this.refreshView();

}

JSEditText.prototype = Object.create(JSView.prototype);

JSEditText.prototype.setHint = function(ttext) {
    this.attr["placeholder"] = ttext;
    this.refreshView();

}

JSEditText.prototype.setValue = function(ttext) {
    this.attr["value"] = ttext;
    this.refreshView();

}

JSEditText.prototype.getValue = function() {
    return this.attr["value"];

}

/*-================================-*/

// Inheritance from view
function JSTextView() {

    JSView.call(this, document.createElement("p"));
}


JSTextView.prototype = Object.create(JSView.prototype);

JSTextView.prototype.setText = function(ttext) {
    this.attr["textnode"] = ttext;
    this.refreshView();

}

/*-================================-*/

// Inheritance from view
function JSSpan() {

    JSView.call(this, document.createElement("span"));

}

JSSpan.prototype = Object.create(JSView.prototype);

JSSpan.prototype.setText = function(ttext) {
    this.attr["textnode"] = ttext;
    this.refreshView();

}


/*-================================-*/

function JSPopUpMessages() {

    this.main = new JSLayout();
    this.main.setClassName("modal");

    this.inner = new JSLayout();
    this.inner.setClassName("modal-content");

    this.x = new JSSpan();
    this.x.setClassName("close");
    this.x.setText("×");
    this.message = new JSTextView();

    this.inner.add(this.x);
    this.inner.add(this.message);

    this.main.add(this.inner);


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
        this.main.render();
        this.main.showView();
    }

    this.hide = function() {
        this.main.hideView();
    }
}