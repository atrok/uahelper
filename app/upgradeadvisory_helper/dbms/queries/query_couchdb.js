var CouchDB = require('../couchdb').CouchDB;
var Logger = require('../../logger');
var db = require('../couchdb');

var couchdb = new CouchDB({ host: db.couchdb_host, port: db.couchdb_port, username: db.couchdb_username, password: db.couchdb_pass });

var remove = async function (response, id, revid, dbname) {

    try {
        var logger = new Logger(response);

        if (typeof dbname === 'undefined')
            logger.log('DB name is not provided, using default set name');

        var db = couchdb.getDBConnection(dbname);

        if (!revid) {
            var revid = await getRevision(db, id);
        }

        return new Promise((resolve, reject) => {
            db.remove(id, revid, function (err, res) {
                if(err){
                    reject(err);
                    return;
                }else{
                console.log('deleted: '+id+' revid:'+revid);
                resolve(res);
                }
            });
        });

    } catch (err) {
        console.log(err.stack);
        throw err;
    }
}

function getRevision(db, id) {
    return new Promise((resolve, reject) => {
        db.get(id, function (err, doc) {
            if (err) {
                reject(err);
                return;
            }else{

            console.log('Resolved revId:', doc._rev);
            resolve(doc._rev);
            }
        });
    })
}
var query = (response, view, opts, dbname) => {

    var logger = new Logger(response);

    if (typeof dbname === 'undefined')
        logger.log('DB name is not provided, using default set name');

    var localOpts;
    (!opts) ? localOpts = { group: true } : localOpts = opts;

    return new Promise(async (resolve, reject) => {

        try {
            var db = couchdb.getDBConnection(dbname);

            var logger = new Logger(null);

            var res = await couchdb.select(view, localOpts, response);

            var rows = res.rows;

            //    rows.forEach(function(value,key){
            //        logger.log(value.key.toString());
            //    })
            resolve(res);
        } catch (err) {
            console.log(err.stack);
            reject(err);
        }
    });
};


module.exports = {
    query,
    remove
};