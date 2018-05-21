'use strict';

var cradle = require('./cradle_setup');
var docx = require('./docx');
var db = require('./dbms/couchdb');
var parser = require('./preparing');
var html = require('./html/html');
const { ArrayResult, SimpleObjectResult } = require('./result');
const ApplicationTypes = require('./enum/apptypes');
const OSTypes = require('./enum/ostypes');
const DatabaseTypes = require('./enum/databasetypes');
var Logger = require('./logger');
var LinkHTML = require('./html/linkhtml');
var CombinedHTML = require('./html/combinedhtml');

const view_names=require('./dbms/queries/view_definitions');


var start = (response, components, isGenerateReport, recreateViews) => {
  var logger = new Logger(response);

  return new Promise(async (resolve, reject) => {
    try {

      // await couchdb.initialize(recreateViews, response);//set true if need to recreate view


      var solutions = { solutions: [] }

      var obj = { components: [] };
      var apptypes = new ApplicationTypes();
      var ostypes = new OSTypes();
      var dbtypes = new DatabaseTypes();
      var errors = [];


      for (var i = 0; i < components.length; i++) {
        try {

          var couchdb = new db.CouchDB({ host: db.couchdb_host, port: db.couchdb_port, username: db.couchdb_username, password: db.couchdb_pass });

          couchdb.getDBConnection(db.couchdb_name);
          // check if solution was passed among with input arguments
          // could 2 use case
          // 1. application types are from cfg_locale (ie input results are from CFG DB query or from csv file)
          // 2. solution and application type from Application Tab' dropdown lists - these are based on solution_name and component fields of release notes DB
          // application types from both sources are different, and some applications names from release notes doesn't exist in cfg_locale, as an example - all TServers, or GMS, GWS etc
          // in first case we need to find release notes component name from apptype enum where we are looking based on lc_value, once found we can pull solution name and release notes component name to be used in query
          // in second case we will get component name and solution name that we can use in query, and we don't need to check that in apptype
          // to distinguish both use cases we can use solution field - if it's among input parameters then we don't need to go in apptype
          // if there is no solution - we need to get into apptype and pull component name + solution name

          var solution = (components[i].SOLUTION) ? components[i].SOLUTION : null;

          if (solution === null) {
            var p = apptypes.findByLCValue(components[i].APPLICATION_TYPE);
            var application = '';
            if (null === p) {
              application = components[i].APPLICATION_TYPE;
              solution = await findSolution(couchdb, application, response);
            } else {
              application = p.name;
              solution = p.solution;
            }
          }else{
            application = components[i].APPLICATION_TYPE;
          }

          var o = ostypes.findByTypeID(components[i].OS_TYPE);
          var os = (null === o) ? components[i].OS_TYPE : o.name;

          /*
          var dbtype = dbtypes.findByTypeID(components[i].RELEASE.slice(0, 3));
          if (null === dbtype) throw new Error('Database is not found for ' + application + ' release ' + components[i].RELEASE);
*/


          var opts = {
            startkey: [solution, application, os, components[i].RELEASE],
            endkey: [solution, application, os, {}],
            // group: true
            //descending: true
          };



          logger.log('Processing: ' + solution + application + ' ' + os + ' ' + components[i].RELEASE);
          var component = parser.findComponent(obj, application);


          component.solution = solution;
          components[i].SOLUTION = solution;


          var new_releases = await couchdb.select('test/features-by-release', opts, response);
          components[i].RECORDS_FOUND = new_releases.rows.length;


          if (new_releases.rows.length === 0) {
            console.log('Can\'t find ' + application + ' among available release notes');
            components[i].DELTA_SAME = 'undefined';
            components[i].DELTA_LATEST = 'undefined';
            components[i].releases = '';
          } else {

            var cur_release_index = component.current_release.push({
              release: components[i].RELEASE,
              family: new_releases.rows[0].value.family,
              date: new_releases.rows[0].value.release_date,
              release_type: new_releases.rows[0].value.release_type
            }) - 1;

            // Populate latest release of the same family info
            var delta_same_family_res = await couchdb.select('test/group-releases-by-family', {
              startkey: [solution, application, os, component.current_release[cur_release_index].family, components[i].RELEASE],
              endkey: [solution, application, os, component.current_release[cur_release_index].family, {}],
              group: true
            },
              null);

            component.current_release[cur_release_index].delta_same_family = delta_same_family_res.rows.length;
            components[i].DELTA_SAME = delta_same_family_res.rows.length - 1;

            var ind = delta_same_family_res.rows.length - 1;
            var rows = delta_same_family_res.rows;

            component.latest_same_family = {
              release: rows[ind].key[3],
              family: rows[ind].key[2],
              date: rows[ind].key[4],
              release_type: rows[ind].key[5]
            }

            // Populate delta of latest release of the latest family 
            var delta_latest_release_res = await couchdb.select('test/group-releases-by-family', {
              startkey: [solution, application, os, component.current_release[cur_release_index].family, components[i].RELEASE],
              endkey: [solution, application, os, {}, {}],
              group: true
            },
              null);

            component.current_release[cur_release_index].delta_latest_release = delta_latest_release_res.rows.length;
            components[i].DELTA_LATEST = delta_latest_release_res.rows.length - 1;

            var releases = [];

            var reduced_releases = new_releases.reduce(
              function (combiner, transformer) {
                // On each iteration, add the current transformer to the form object of the combiner.
                combiner[transformer.value.release] = new LinkHTML(transformer.value.release_date + ' ' + transformer.value.release_type, transformer.value['release-link-href']).toString();
                return combiner;
              }, {}
            );

            var assemble = new CombinedHTML();
            assemble.addElement('<div class="tableresultheader"><span>Expand</span></div><div class="rls_content" style="display:none">');
            assemble.addElement(reduced_releases);
            assemble.addElement('</div>');
            components[i].releases = assemble.toString();



            if (cur_release_index == 0) {//parse new features and issues just once for oldest release only
              //todo add comparison between current and previous releases - if current is older than previous version then we need to parse
              obj = parser.processed_obj(new_releases, obj);
            }

            response.emit('progress', { percents: Math.round((i / (components.length - 1) * 100)) });
          }
        } catch (err) {
          console.log("Components loop: " + err.stack);
          errors.push(errors.length, [components[i].APPLICATION_TYPE, components[i].RELEASE, err]);
          // reject(err);
        }
      };

      var result = {};

      // preparing and formating results 

      //result.table=html.displayTableResults(new ArrayResult(components),'Results');
      result.components = components;
      result.obj = obj;
      result.errors = errors;


      //console.log(JSON.stringify(obj));
      if (isGenerateReport) {
        var file = await docx.createDocx(obj);//.catch(function(e){setTimeout(function(e){throw e;})}); /// take care of unhandled exceptions from file promise

        file.link = new LinkHTML(file.filename, '/getfile?filename=' + file.filename).toString();
        file.deletelink = new LinkHTML('delete', '/deletefile?filename=' + file.filename).toString();
        result.file = file;
      }
      resolve(result);

    } catch (e) {
      console.log("DocProcessing: " + e.stack);
      reject(e);
    };
  })
};

function error(str) {
  throw new Error(str);
}

async function findSolution(couchdb, component, response) {
  // if solution is empty let's try to find it in release notes DB
  //empty
  return new Promise(async (resolve, reject) => {
    try {
      var solutions_fromDB = await couchdb.select(view_names.views_names.solutions_by_components.path(),
        {
          startkey: [component, ""],
          endkey: [component, {}],
          group: true, reduce: true, inclusive_end: true
        }, response
      )

      resolve(solutions_fromDB[0].key[1]);
    } catch (e) {
      console.log("FindSolution: " + e.stack);
      reject(e);
    }
  })
}

module.exports = { start };