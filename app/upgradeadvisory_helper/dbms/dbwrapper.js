const dbconfig = require('./dbconfig');
var oracledb = require('./oracledb');
var mssqldb = require('./mssqldb');
const { ResultHandlerMsql, ResultHandlerOra } = require('./preparefordocprocessing');

var dbwrapper = function () { }

dbwrapper.prototype.getInstance = function (connection_string) {
    this.dbtype = connection_string.dbtype || 'oracle';
    switch (this.dbtype) {
        case 'oracle':

            this.db = oracledb.addConfiguration(connection_string);
            this.resultHandler = new ResultHandlerOra();
            return this;

        case 'mssql':
            this.db = new mssqldb();
            this.db.addConfiguration(connection_string);

            this.resultHandler = new ResultHandlerMsql();
            return this;

        default:
            return null;

    }
}

dbwrapper.prototype.logger = function (logger) {
    this.db.logger(logger);
    return this;
}

dbwrapper.prototype.init = function (socket) {
    db = this.db;
    return new Promise(async (resolve, reject) => {
        try {
            var res = await db.init(socket);

            resolve(this.resultHandler.prepare(res));
        } catch (err) {
            console.log(err.stack)
            reject(err);
        }
    })
}

module.exports = new dbwrapper();