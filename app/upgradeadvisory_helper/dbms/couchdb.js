'use strict';

var cradle = require('cradle');
var StringBuilder = require('../stringbuilder');
var Logger = require('../logger');

cradle.setup({
  host: '192.168.14.91',
  port: 5984,
  cache: true,
  raw: false,
  forceSave: true
});




class CouchDB {


  constructor(params) {//{host, port, username, password, cache, raw, forceSave}
    this.cradle = cradle;

    this.cradle.setup({
      host: (null === params.host) ? '127.0.0.1' : params.host,
      port: (!params.port) ? 5984 : params.port,
      cache: (!params.cache) ? true : params.cache,
      raw: !(params.raw) ? false : params.raw,
      forceSave: (!params.forceSave) ? true : params.forceSave
    });

    this.username = params.username;
    this.password = params.password;

    this.view_all = 'all';
    this.view_group_releases_by_component = "group-releases-by-component";
    this.view_features_by_release = "features-by-release";
    this.database_name = 'sitemap-data-genesys_rn_85';

    this.db = null;


    this.isCreated = false;

    this.FULL_MASK = 0x1F;// 11111

  }

  check_views(response, create_view) {
    var logger = response;
    var db = this.db;
    var database_name = this.database_name;
    var create_view = create_view;
    var FULL_MASK=this.FULL_MASK;
    return new Promise((resolve, reject) => {
      var mask = 0x0;



      logger.log("Start working with DB '" + database_name + "'");

      db.get('_all_docs', {
        startkey: "\"_design\"",
        endkey: "\"_design0\"",
        include_docs: true
      }, async function (err, res) {
        logger.log('Check exisiting views in _all_docs, processing results:');

        if (err) {

          if (res) {
            if (!res['rows']) err = res.json;
          }

          logger.log(err);
          reject(new Error("Failed to check views"));
        }




        //console.log(typeof res);
        var r = {};
        var revision;
        try {
          res.rows.forEach(function (row, key) {
            logger.log('Design doc id: ' + row.id + ', rev: ' + row.value.rev);
            if (row.id === '_design/test') {
              var views = Object.getOwnPropertyNames(row.doc.views);
              view_names.forEach(function (value) {
                if (views.find(x => x == value.name)) {
                  mask = mask | value.flag;
                  logger.log("'" + value.name + "' function, adjusted mask:" + parseInt(mask).toString(2));
                }
              });
              revision = row.value.rev;
            }

          });

          var p=undefined;
          if (mask != FULL_MASK) {
            logger.log('Masks aren\'t equal: ' + parseInt(mask).toString(2) + " vs. " + parseInt(FULL_MASK).toString(2));
            p = {revision:revision, mask:mask};
          }
          resolve(p);

        } catch (err) {
          logger.log(err.stack);
          reject(err);
        }

      });
    }); /// Promise ending
  };

  create_view(logger, options) {

    if(typeof options==='undefined')
    throw new Error('Options are undefined. Can\'t execute views creation without options {revision: doc.revision, mask: <views bit masks>}');

    var mask= options.mask;
    var revision=options.revision;
    this.checkDB();
    var db=this.db;

    return new Promise(resolve => {

      var func = {};

      view_names.forEach(function (value) {

        // Check mask against views predefined bitmask and include its function if missing
        if (mask & value.flag) {
          logger.log("View already exists: " + value.name);
        } else {
          logger.log("Missing view " + value.name);
        }
        Object.assign(func, value.function);
      });

      logger.log("Creating new view");
      var rev = (revision) ? revision : null;

      db.save('_design/test', rev, func, function (err, res) {
        //db.save('_design/test', func , function (err, res) {
        if (err) {
          logger.log(err);
          resolve(err);
          return;
        }
        //console.log("Created succesfully");
        resolve("Created succesfully, id:" + res.id + ", rev: " + res.rev); // returning Promise after views are created;
      });
    });//Promise ending
};


// query to get data from CouchDB
// where opts is an object like {key: ['Interaction Server','8.5.107.22']}
// return promise to use in async/await operations

select(view, opts, response) {

  var logger = new Logger(response);
  return new Promise(async (resolve, reject) => {
    this.checkDB();
    var db = this.db;
    logger.log('Getting data from ' + view + ' with options')
    logger.log(opts);
    try {
      var error;
      var result;
      db.view(view, opts, function (err, res) {
        if (err) {
          logger.log(err);
          reject(err)
        } else {

          logger.log("Found " + res.rows.length + " records");


          resolve(res);
        }
      });
    } catch (err) {
      throw err;
    }
  });
};

//var logger = null;

initialize(recreate, response) {
  var logger = new Logger(response);
  return new Promise(async (resolve, reject) => {
    try {
      this.checkDB();
      if (recreate === 'true') this.FULL_MASK = 0x15;
      var p = await this.check_views(logger);
      if (p) await this.create_view(logger,p);
      logger.log(p);
      resolve();
      //response.end();
    } catch (e) {
      logger.log(e.stack);
      //response.end();
      //throw e;
    }
  });
};

checkDB() {
  if (this.db === null) throw new Error("Connection to DB is not opened. Please call getDBConnection(database)");
}

getDBConnection(database) {
  this.database_name = (typeof database === 'undefined') ? this.database_name : database;
  this.db = new (cradle.Connection)({ auth: { username: this.username, password: this.password } }).database(this.database_name);
  return this.db;
};

databases(cb){
  return new (cradle.Connection)({ auth: { username: this.username, password: this.password } }).databases(cb);
}



  /*
  db.view('test/features-by-release', {key: ['Interaction Server','8.5.107.22']}, function (err, res) {
    //console.log('Getting data from '+view+' with options '+opts);
    console.log(typeof res);
    res.rows.forEach(function(value){
    
      console.log(value);
    });
     if(err) console.log(err);
    //current_release=res;
    
  });
  */
  //DBSetup.initialize();
  //console.log('In process of DB initialization');


}

const view_names = [
  {
    name: 'all', flag: 0x1, function: {
      all: {
        map: function (doc) {
          emit(doc["component"], doc);
        }
      }
    }
  },
  {
    name: "group-releases-by-component", flag: 0x2, function: {
      "group-releases-by-component": {
        map: function (doc) {
          if (doc.release && doc.component) {
            emit([doc.component, doc.release], 1);
          }
        },
        reduce: function (keys, values) {
          return sum(values);
        }
      }
    }
  },
  {
    name: "features-by-release", flag: 0x4, function: {
      "features-by-release": {
        map: function (doc) {
          var os = [];
          if (doc.windows) {
            if (doc.windows === 'X') {
              os.push('windows');
            }
          }
          if (doc.linux) {
            if (doc.linux === 'X') {
              os.push('linux');
            }
          }

          if (doc.solaris) {
            if (doc.solaris === 'X') {
              os.push('solaris');
            }
          }

          if (doc.aix) {
            if (doc.aix === 'X') {
              os.push('aix');
            }
          }

          if (doc['HP-UX']) {
            if (doc['HP-UX'] === 'X') {
              os.push('hpux');
            }
          }

          if (doc.hpuxpa||doc.hpuxipf) {
            if (doc.hpuxpa === 'X'||doc.hpuxipf==='X') {
              os.push('hpux');
            }
          }


          if (doc['TRUE64 UNIX']) {
            if (doc['TRUE64 UNIX'] === 'X') {
              os.push('trux');
            }
          }

          for (var i = 0, l = os.length; i < l; i++) {
            if (doc.release && doc.component) {
              var family = doc.release.slice(0, 3);
              emit([doc.component, os[i], doc.release, doc.restricted], {
                _id: doc._id,
                _rev: doc._rev,
                aix: doc.aix,
                component: doc.component,
                'component-href': doc['component-href'],
                family: family,
                'family-href': doc['family-href'],
                features: doc.features,
                linux: doc.linux,
                release: doc.release,
                release_date: doc.release_date,
                release_type: doc.release_type,
                'release-link-href': doc['release-link-href'],
                restrictions: doc.restrictions,
                solaris: doc.solaris,
                solution_name: doc.solution_name,
                upgrade_notes: doc.upgrade_notes,
                'web-scraper-start-url': doc['web-scraper-start-url'],
                windows: doc.windows
              });
            }
          }
        }
      }
    }
  },
  {
    name: "short-release-info", flag: 0x8, function: {
      "short-release-info": {
        map: function (doc) {
          if (doc.release && doc.component) {
            var family = doc.release.slice(0, 3);
            emit([doc.component, doc.release, family, doc.release_date, doc.release_type], 1);
          }
        },
        reduce: function (keys, values) {
          return sum(values);
        }
      }
    }
  },
  {
    name: "group-releases-by-family", flag: 0x10, function: {
      "group-releases-by-family": {
        map: function (doc) {
          if (doc.release) {
            var family = doc.release.slice(0, 3);
            var os = [];
            if (doc.windows) {
              if (doc.windows === 'X') {
                os.push('windows');
              }
            }
            if (doc.linux) {
              if (doc.linux === 'X') {
                os.push('linux');
              }
            }

            if (doc.solaris) {
              if (doc.solaris === 'X') {
                os.push('solaris');
              }
            }

            if (doc.aix) {
              if (doc.aix === 'X') {
                os.push('aix');
              }
            }

            if (doc['HP-UX']) {
              if (doc['HP-UX'] === 'X') {
                os.push('hpux');
              }
            }

            if (doc.hpuxpa||doc.hpuxipf) {
              if (doc.hpuxpa === 'X'||doc.hpuxipf==='X') {
                os.push('hpux');
              }
            }
  
            if (doc['TRUE64 UNIX']) {
              if (doc['TRUE64 UNIX'] === 'X') {
                os.push('trux');
              }
            }

            for (var i = 0, l = os.length; i < l; i++) {
              emit([doc.component, os[i], family, doc.release, doc.release_date, doc.release_type], 1);
            }
          }
        },
        reduce: function (keys, values) {
          return sum(values);
        }
      }
    }
  }
];



module.exports = {
  CouchDB,
  couchdb_host: '192.168.14.91',
  couchdb_port: 5984,
  couchdb_username: 'admin',
  couchdb_pass: 'Genesys#1',
  couchdb_name: 'genesys_releases'
};