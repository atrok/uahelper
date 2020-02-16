var CouchDB = require('../couchdb').CouchDB;
var Logger = require('../../logger');
//var db = require('../couchdb');
var db = require('../../customconfig').customconfig.database;

var couchdb = new CouchDB({ host: db.couchdb_host, port: db.couchdb_port, username: db.couchdb_username, password: db.couchdb_pass });

var logger = new Logger(null);

var databases = [
    'uahelper', 'uahelper_history', 'uahelper_configlists', 'genesys_releases', 'remove_me_again_2'
]

var b = function () {
    databases.forEach(v => {
        logger.log("Checking existing databases : " + v)

        f(v, {})
            .then(res => {
                logger.log("Continue, checking views : " + res);
                g(res);
            })
            .catch(err => {
                logger.log("Failed : " + v + ", " + err.message);
            })
    })
}

var f = function (dbname) {
    var db = couchdb.getDBConnection(dbname);

    return new Promise((resolve, reject) => {
        db.exists(function (err, exists) {
            if (err) {
                logger.log('Error: ' + dbname + ', ' + err.message);
                reject(err);
            }
            if (exists) {
                logger.log('DB exists, continue: ' + dbname);
            } else {
                logger.log('DB does not exist, creating: ' + dbname);
                db.create(function (err) {
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
    var db = couchdb.getDBConnection(dbname);;
    return new Promise(async (resolve, reject) => {

        try {
            await db.initialize();

            resolve('Views checked');

        } catch (err) {
            reject(err);
        }
    })
}

module.exports = {
    db_init: b
}

