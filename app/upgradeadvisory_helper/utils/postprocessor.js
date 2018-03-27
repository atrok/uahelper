var docx = require('../docx');
var {SimpleObjectResult, ArrayResult} = require('../result');
const dbwrap = require('../dbms/couchdb');
var postprocessor = function () { }
var html=require('../html/html');

postprocessor.prototype.init = function (obj) {
    this.result = obj;
    //this.couchdb = new db.CouchDB({ host: db.couchdb_host, port: db.couchdb_port, username: db.couchdb_username, password: db.couchdb_pass });
    
    return this;
}
postprocessor.prototype.setlogger = function (logger) {
    this.l = logger;
    return this;
}

postprocessor.prototype.log = function () {
    //var logger=this.logger;
    var console = function () { }
    console.prototype.print = function (str) { logger.timestamp(str) }

    var clientlogger = function () { }
    clientlogger.prototype.print = function (str) {
        this.l.log(str);
    }
    clientlogger.prototype.l = this.l;


    if (typeof this.l === 'undefined') return new console();
    return new clientlogger();
}


postprocessor.prototype.format = function (id) {
    var output = {}
    output.table = html.displayTableResults(new ArrayResult(this.result.components), 'Results');
    if (this.result.file)
        output.file = html.displayTableResults(new SimpleObjectResult(this.result.file), 'Resulting file');

    output.parsed_obj=this.result.obj;
    output._id=this.result._id;
    output._rev=this.result._rev;

    if (this.result.errors.length > 0) {
        output.errors = html.displayTableResults(new ArrayResult(this.result.errors), 'Errors');
    }
    
    return output;

}


postprocessor.prototype.save = async function () {
    //check if database uahelper exists
    var couchdb = new dbwrap.CouchDB({ host: dbwrap.couchdb_host, port: dbwrap.couchdb_port, username: dbwrap.couchdb_username, password: dbwrap.couchdb_pass });

    var db = couchdb.getDBConnection('uahelper');

    var result = this.result;

    await new Promise((resolve,reject)=>{
        db.exists(function (err, exists) {
        if (err) {
            console.log('error', err);
            reject(err);
        } else if (exists) {
            console.log('db exists, continue.');
        } else {
            console.log('database does not exists, creating.');
            db.create();
        }
        resolve();        
        });
    });

    return new Promise((resolve,reject)=>{
        db.save(result, function (err, res) {
        console.log('saved id:', res);
        resolve(res);
        })
    })
   
}

var include = function (arr, obj) {
    return (arr.indexOf(obj) != -1);
}
postprocessor.prototype.send = function () { }

module.exports = postprocessor;

