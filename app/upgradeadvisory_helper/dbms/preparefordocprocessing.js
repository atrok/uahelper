class ResultHandler {
    constructor() { }

    prepare() {
        console.log('Preparing dbms data before sending to docxprocessor');
    }

    fill_data(obj, struct) {
        //console.log(typeof obj);

        const propNames = Object.getOwnPropertyNames(struct);
        propNames.forEach(function (name) {
            const desc = Object.getOwnPropertyDescriptor(struct, name);
            Object.defineProperty(obj, name, desc);
        });
        return obj;
    };
}

class ResultHandlerOra extends ResultHandler {

    prepare(result) {
        super.prepare();
        var obj = [];

        for (var row = 0; row < result.rows.length; row++) {
            obj[row] = {};
            for (var col = 0; col < result.rows[row].length; col++) {
                var t = { [result.metaData[col].name]: result.rows[row][col] };
                obj[row] = this.fill_data(obj[row], t);
            }
        }

        return obj;
    }
}

class ResultHandlerMsql extends ResultHandler {

    prepare(data) {
        super.prepare();
        var obj = [];

        if (typeof data.recordset === 'undefined')
            throw new Error('Wrong format for MSSQLDB result, missing recordset property')

        var result = data.recordset;
        for (var row = 0; row < result.length; row++) {
            obj[row] = {};
            var keys = Object.keys(result[row]);
            for (var o = 0; o < keys.length; o++) {
                var k = keys[o].toUpperCase();
                var t = { [k]: result[row][keys[o]] }
                obj[row] = this.fill_data(obj[row], t);
            }
        }

        return obj;

    }
}

module.exports = {
    ResultHandlerOra,
    ResultHandlerMsql
}