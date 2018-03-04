/* Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   webapp.js
 *
 * DESCRIPTION
 *   Shows a web based query using connections from connection pool.
 *
 *   This displays a table of employees in the specified department.
 *
 *   The script creates an HTTP server listening on port 7000 and
 *   accepts a URL parameter for the department ID, for example:
 *   http://localhost:7000/90
 *
 *   Uses Oracle's sample HR schema.  Scripts to create the HR schema
 *   can be found at: https://github.com/oracle/db-sample-schemas
 *
 *****************************************************************************/

var http = require('http');
var ora = require('oracledb');
var dbConfig = require('./dbconfig.js');
var config=require('../configuration');
var httpPort = 7000;
var docProcessing = require('../docProcessing');
const URL = require('url');
var html = require('../html/html');
const { OracleDBResult, CouchDBResult, DocProcessingResult } = require('../result');
var fs = require('fs');
var path = require('path');
const logger = require(enduro.enduro_path + '/libs/logger');


// Main entry point.  Creates a connection pool, on callback creates an
// HTTP server that executes a query based on the URL parameter given.
// The pool values shown are the default values.
var oracledb = function () {
}

oracledb.prototype.addConfiguration = function (config) {
  this.config = config;
  return this;
}

oracledb.prototype.logger=function(logger){
  this.l=logger;
  return this;
}

oracledb.prototype.log=function(){
 //var logger=this.logger;
  var console=function(){}
  console.prototype.print=function(str){logger.timestamp(str)}

  var clientlogger=function(){}
  clientlogger.prototype.print=function(str){
    this.l.log(str);
  }
  clientlogger.prototype.l=this.l;
  

  if (typeof this.l==='undefined') return new console();
  return new clientlogger();
}

oracledb.prototype.init = function (response) {
  var clientlogger=this.log();
  return new Promise(async (resolve, reject) => {
    try {

      
      clientlogger.print('<p><h3>Executing against Oracle DB</h3>' + this.config.host + '/' + this.config.dbname + "<br/>" + this.config.user + '<br/></p>');
    
      //console.log('creating oracle connection  pool, moving to handle request');


      var result = await handleRequest(clientlogger, {
        user: this.config.user || dbConfig.user,
        password: this.config.pass || dbConfig.password,
        connectString: (this.config.host && this.config.dbname) ? this.config.host + '/' + this.config.dbname : dbConfig.connectString
        // Default values shown below
        // externalAuth: false, // whether connections should be established using External Authentication
        // poolMax: 4, // maximum size of the pool. Increase UV_THREADPOOL_SIZE if you increase poolMax
        // poolMin: 0, // start with no connections; let the pool shrink completely
        // poolIncrement: 1, // only grow the pool by one connection at a time
        // poolTimeout: 60, // terminate connections that are idle in the pool for 60 seconds
        // poolPingInterval: 60, // check aliveness of connection if in the pool for 60 seconds
        // queueRequests: true, // let Node.js queue new getConnection() requests if all pool connections are in use
        // queueTimeout: 60000, // terminate getConnection() calls in the queue longer than 60000 milliseconds
        // poolAlias: 'myalias' // could set an alias to allow access to the pool via a name
        // stmtCacheSize: 30 // number of statements that are cached in the statement cache of each connection
      })

     // callback(response, result);
     //result.catch((e)=>{setTimeout(function(e){throw e})}); // taking care of possible result promise rejections/exceptions
      //TODO add time of query execution            
      resolve(result);
    } catch (e) {
      console.log ('Catch it!', e.stack);
      reject(e);
    }

  });

}

var handleRequest = function (clientlogger, params) {

  return new Promise(async (resolve, reject) => {
    try {
      // Checkout a connection from the pool
      // var connection = await pool.getConnection();

      var connection = await ora.getConnection(params);
     clientlogger.print('got Oracle connection ');

      var query = fs.readFileSync(path.resolve(__dirname, config.ua.dbms.oracle.component_query), 'utf-8');

      var result = await connection.execute(query);

      clientlogger.print('got the query results, start processing results');

      connection.close(function (err) {
        if (err) {
          //html.handleError(response, "normal release() error", err);
          throw new Error(err);
        } else {
          clientlogger.print('Oracle connection is closed!');
          //return res;
        }
      });

      resolve(result);

    } catch (err) {
      //html.handleError(response, "Oracle DB communication error", err);
      console.log(err.stack);
      reject(err);

    }
  })
}

module.exports = new oracledb();