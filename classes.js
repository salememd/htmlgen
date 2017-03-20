// Base Class
function JSView(elemn) {

    this.view = elemn;

}

JSView.prototype.setClassName = function(name) {
    this.view.setAttribute("class", name);
}

JSView.prototype.setIdName = function(name) {
    this.view.setAttribute("id", name);
}

JSView.prototype.render = function(name) {
    document.body.appendChild(this.view);
}

JSView.prototype.showView = function() {
    this.view.style.display = "block";

}

JSView.prototype.hideView = function() {
    this.view.style.display = "none";

}

JSView.prototype.setWidth = function(val) {
    this.view.style.width = val;

}
JSView.prototype.setHeigh = function(val) {
    this.view.style.height = val;

}
JSView.prototype.getView = function() {
    return this.view;
}

/*-================================-*/

// Inheritance from view
function JSLayout(type) {

    this.view = document.createElement("div");
    this.add = function(viewObj) {
        this.getView().appendChild(viewObj.getView());

    }
}

JSLayout.prototype = new JSView();
/*-================================-*/

// Inheritance from view
function JSButton() {
    this.view = document.createElement("Button");

    this.setTitle = function(title) {
        this.getView().innerHTML = '';
        this.getView().appendChild(document.createTextNode(title));
    }
    this.addOnClickListener = function(excute) {
        this.getView().addEventListener("click", excute);
    }


}



JSButton.prototype = new JSView();
/*-================================-*/

// Inheritance from view
function JSTextView() {

    this.view = document.createElement("p");
    this.setText = function(ttext) {
        this.view.innerHTML = '';
        this.view.appendChild(document.createTextNode(ttext));
    }
}


JSTextView.prototype = new JSView();
/*-================================-*/

// Inheritance from view
function JSSpan() {

    this.view = document.createElement("span");

    this.setText = function(ttext) {
        this.getView().innerHTML = '';
        this.getView().appendChild(document.createTextNode(ttext));
    }

}

JSSpan.prototype = new JSView();

/*-================================-*/

// Inheritance from view
function JSEditText() {

    this.view = document.createElement("input");
    this.view.setAttribute("type", "text");

    this.setHint = function(ttext) {
        this.getView().setAttribute("placeholder", ttext);
    }

    this.setValue = function(ttext) {
        this.getView().setAttribute("value", ttext);
    }

    this.getValue = function() {
        return this.getView().value;

    }

}


JSEditText.prototype = new JSView();

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