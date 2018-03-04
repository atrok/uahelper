var StringBuilder = require('../stringbuilder');

class ListHTML {

    constructor() {
        this.sb = new StringBuilder();
    }

    KVtolist(obj) {// {key: value, key:value}
        if (obj instanceof Object) {
            this.sb.append("<ul>");
            var propnames = Object.getOwnPropertyNames(obj);
            var i = 0;
            propnames.forEach(value => {
                var desc = Object.getOwnPropertyDescriptor(obj, value);
                this.sb.append('<li id="' + value + '">' +value+' : '+ desc.value.toString() + '</li>');
            })
            this.sb.append('</ul>');

        } else {
            this.sb.append(obj);
        }
        return this;
    }
    toString() {
        return this.sb.toString();
    }

}


module.exports = ListHTML;