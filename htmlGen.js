function HTMLGen(tagName, attributes, hasValue = false) {

    var att = "";
    for (key in attributes) {
        att = att + key + "=\"" + attributes[key] + "\" ";
    }

    if (hasValue == false) {
        var closeTag = "/>";
        var html = "<" + tagName + " " + att;
        return data = {
            genHtml: html,
            getGenHtml: function() {
                return this.genHtml + closeTag;
            }
        };

    } else {
        var closeTag = "</" + tagName + ">"
        var html = "<" + tagName + " " + att + ">";

        return data = {
            genHtml: html,
            addValue: function(value) {
                if (typeof value === 'string')
                    this.genHtml = this.genHtml + value;
                else
                    this.genHtml = this.genHtml + value.getGenHtml();
            },
            getGenHtml: function() {
                return this.genHtml + closeTag;
            }
        };
    }

}

function render(HTMLdata) {
    var body = "";

    if (HTMLdata instanceof Array) {
        for (val in HTMLdata) {
            body = body + HTMLdata[val].getGenHtml();
        }
    } else {
        body = body + HTMLdata.getGenHtml();
    }

    document.body.innerHTML = document.body.innerHTML + body;
}


