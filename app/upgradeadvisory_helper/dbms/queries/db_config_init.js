var CouchDB = require('../couchdb').CouchDB;
var Logger = require('../../logger');
//var db = require('../couchdb');
var db = require('../../customconfig').customconfig.database;

var logger = new Logger(null);

var databases = [
    'uahelper', 'uahelper_history', 'uahelper_configlists', 'genesys_releases'
]

var b = function () {
    databases.forEach(v => {
        logger.log("Checking existing databases : " + v)

        f(v, {})
            .then(res => {
                // TODO: need to improve the algorithm of views checking
                // right now it takes all the views and adds to all databases and it's not correct behaviour
                //logger.log("Continue, checking views : " + res);
                //g(res);
            })
            .catch(err => {
                logger.log("Failed : " + v + ", " + err.message);
            })
    })
}

var f = function (dbname) {
    var couchdb = new CouchDB({ host: db.couchdb_host, port: db.couchdb_port, username: db.couchdb_username, password: db.couchdb_pass });

    var db_instance = couchdb.getDBConnection(dbname);

    return new Promise((resolve, reject) => {
        db_instance.exists(function (err, exists) {
            if (err) {
                logger.log('Error: ' + dbname + ', ' + err.message);
                reject(err);
            }
            if (exists) {
                logger.log('DB exists, continue: ' + dbname);
            } else {
                logger.log('DB does not exist, creating: ' + dbname);
                db_instance.create(function (err) {
                    if (err)
                        logger.log("DB create operation failed");
                    reject(err);
                });

            }
            resolve(dbname);
        });


    });
}

var g = function (dbname) {
    var couchdb = new CouchDB({ host: db.couchdb_host, port: db.couchdb_port, username: db.couchdb_username, password: db.couchdb_pass });
    couchdb.getDBConnection(dbname);

    return new Promise(async (resolve, reject) => {

        try {
            await couchdb.initialize();

            resolve('Views checked');

        } catch (err) {
            reject(err);
        }
    })
}

module.exports = {
    db_init: b
}

