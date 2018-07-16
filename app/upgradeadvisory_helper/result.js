var ListHTML = require('./html/listhtml');
var StringBuilder = require('./stringbuilder');

class Result {
    constructor(result) {
        this.result = result;
    }

    display() {
        var result = this.result;

        if (result) {
            if (result.length == 0) {
                return false;
            }
            return true;
        }
        return false;
    }
}

class OracleDBResult extends Result {
    constructor(result) {
        super(result);
    }

    display() {
        var sb = new StringBuilder();

        if (super.display()) {

            sb.append('<table class="table">');
            var result = this.result;
            // Column Title
            if (result.metaData && result.rows) { // results in array form (from oracle driver)
                sb.append("<tr>");
                for (var col = 0; col < result.metaData.length; col++) {
                    sb.append("<th>" + result.metaData[col].name + "</th>");
                }
                sb.append("</tr>");

                // Rows
                for (var row = 0; row < result.rows.length; row++) {
                    sb.append("<tr>");
                    for (col = 0; col < result.rows[row].length; col++) {
                        sb.append("<td>" + result.rows[row][col] + "</td>");
                    }
                    sb.append("</tr>");
                }
                sb.append("</table>");
            }
        } else {
            sb.append('<p> Found 0 records </p>');
        }
        return sb.toString();
    }
}

class CouchDBResult extends Result {
    constructor(result) {
        super(result);
    }

    display() {

        var sb = new StringBuilder();
        if (super.display()) {

            var result = this.result;

            if (result[0].key) { // results in Object form (from couchdb)
                sb.append("<table class='table'>");
                //Column Title
                sb.append("<tr>");
                var columns = result[0].key.length;
                for (var col = 0; col < columns; col++) {
                    sb.append("<th>Key" + col + "</th>");
                }
                sb.append("<th>Value</th>");
                sb.append("</tr>");
                // Rows

                result.forEach(function (key, value) {
                    for (var col = 0; col < key.length; col++) {
                        sb.append("<td>" + key[col] + "</td>");
                    }
                    sb.append('<td>' + value + '</td>');
                    sb.append("</tr>");
                })

                sb.append("</table>");
            }

        } else {
            sb.append('<p>Found 0 records</p>');
        }
        return sb.toString();
    }
}

class SimpleObjectResult extends Result {
    constructor(result) {
        super(result);
    }

    display() {

        var sb = new StringBuilder();
        if (super.display()) {

            var result = this.result;

            //  if (result[0].key) { // results in Object form (from couchdb)
            sb.append("<table class='table'>");
            //Column Title
            sb.append("<tr>");
            var columns = Object.keys(result);
            for (var col = 0; col < columns.length; col++) {
                sb.append("<th>" + columns[col] + "</th>");
            }
            sb.append("</tr>");
            // Rows

            columns.forEach(function (key) {
                sb.append("<td>" + result[key].toString() + "</td>");
            })
            sb.append("</tr>");

            sb.append("</table>");
            //   }

        } else {
            sb.append('<p>Found 0 records</p>');
        }
        return sb.toString();
    }
}

class SimpleKeyValueResult extends Result {
    constructor(result) {
        super(result);
    }

    display() {

        var sb = new StringBuilder();
        if (super.display()) {

            var result = this.result;

            //  if (result[0].key) { // results in Object form (from couchdb)
            sb.append("<table class='table'>");
            //Column Title
            
            var rows = Object.keys(result);
            for (var col = 0; col < rows.length; col++) {
                sb.append("<tr>");
                sb.append("<td>" + rows[col] + "</td>");
                sb.append("<td>" + JSON.stringify(result[rows[col]]) + "</td>");
                sb.append("</tr>");
            }
            
            // Rows

            sb.append("</table>");
            //   }

        } else {
            sb.append('<p>Found 0 records</p>');
        }
        return sb.toString();
    }
}

class ArrayResult extends Result {
    constructor(result) {
        super(result);
    }
    display() {

        if (super.display()) {

            var result = this.result;

            var obj = {};


            var propNames = (typeof result[0] !== 'undefined') ? Object.getOwnPropertyNames(result[0]) : { object: undefined };
            obj.metaData = [];

            // Title
            for (var i = 0; i < propNames.length; i++) {
                obj.metaData[i] = { name: propNames[i] };
            }

            // Rows
            obj.rows = [];

            for (var i = 0; i < result.length; i++) {
                var arr = [];
                for (var k = 0; k < propNames.length; k++) {

                    const desc = Object.getOwnPropertyDescriptor(result[i], propNames[k]);
                    try {
                        var v = (typeof desc !== 'undefined') ? desc.value : { value: '' };

                        var t = new ListHTML().KVtolist(v);
                        arr[k] = (v instanceof String) ? v : t.toString();
                    } catch (err) {
                        throw new Error("ERROR!! " + JSON.stringify(result[i].toString()) + ' property:' + propNames[i], err.stack);
                    }
                }
                obj.rows[i] = arr;
            }

            var ora_result = new OracleDBResult(obj);

            return ora_result.display();
        }
    }

}

module.exports = {
    Result,
    OracleDBResult,
    CouchDBResult,
    ArrayResult,
    SimpleObjectResult,
    SimpleKeyValueResult
}