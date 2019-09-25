// rename the file into customconfig.js and set the parameters as required.
customconfig={
    database: {
        dbtype: "couchdb", // leave as is
        couchdb_host: '192.168.14.91',
        couchdb_port: 5984,
        couchdb_username: 'admin',
        couchdb_pass: 'Genesys#1',
        dbname: "genesys_releases",
        // couch db params only, leave it as is unless there is a specific need to adjust it
        cache: true,
        raw: false,
        forceSave: true
    },
    http_port: 3030
}
    
module.exports={customconfig}
    