var db = require('./dbms/couchdb');
var upgradeAdvisory = require('./upgradeAdvisory');
var oracledb = require('./dbms/oracledb');
var components = require('./dbms/queries/query_couchdb');
var html = require('./html/html');
var fs = require('fs');
var path = require('path');
var docProcessing = require('./docProcessing');
var SelectHTML = require('./html/selecthtml');
var FormHTML = require('./html/formhtml');
var {buildFilename} = require('./utils/file_util');

const { OracleDBResult, CouchDBResult, DocProcessingResult } = require('./result');

function start(response) {
    console.log("Request handler 'start' was called.");

    response.writeHead(200, { "Content-Type": "text/plain" });
    html.htmlHeader(response, 'Upgrade Advisory Helper', 'Upgrade Advisory Helper');
    html.htmlMenu(response);
    html.htmlFooter(response);
    //response.end();
}

function upload(response) {
    console.log("Request handler 'upload' was called.");
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("Hello Upload");
    response.end();
}

function recreateViews(response, args) {
    console.log("Request handler 'recreateViews' was called.");
    response.writeHead(200, { "Content-Type": "text/plain" });

    html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: Recreate VIews');
    html.htmlMenu(response);
    var couchdb = new db.CouchDB({ host: db.couchdb_host, port: db.couchdb_port, username: db.couchdb_username, password: db.couchdb_pass });

    couchdb.databases(async function (err, dbs) {

        if (err) {
            response.write(err.stack);
            return;
        }


        var form = new FormHTML();
        form.addFormAttributes('form_databases', 'get', '/recreateViews');
        form.addHeader("Recreate views");
        form.addDescription("Choose database from the list","it will recreate views for entire database. Please note it will trigger timely rebuilding of database index");
        var se = new SelectHTML("databases");



        dbs.forEach(element => {
            se.addOption(element, element);
        });

        form.addElement(se);

        html.generateForm(response, form);

        if (args) {
            if (args.databases) {
                couchdb.getDBConnection(args.databases);
                await couchdb.initialize('true', response);
            }

        }
        html.htmlFooter(response);
    })



}

async function prepareAdvisory(response, args) {
    console.log("Request handler 'prepareAdvisory' was called.");
    response.writeHead(200, { "Content-Type": "text/plain" });

    html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: Prepare Upgrade Advisory Document');
    html.htmlMenu(response);

    await oracledb.init(response, async function (response, result) {
        return await upgradeAdvisory.generateDocx(response, result, 'false');

    });

    //html.htmlFooter(response);

}

async function testPrepareAdvisory(response, args) {
    console.log("Request handler 'TestPrepareAdvisory' was called.");
    response.writeHead(200, { "Content-Type": "text/plain" });

    html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: Test Upgrade Advisory Document');
    html.htmlMenu(response);

    var component = [{
        APPLICATION_TYPE: (null !== args) ? args.apptype : "SIP Server",
        OS_TYPE: 'linux',
        RELEASE: (null !== args) ? args.release : "8.1.102.95"
    }]
    var res = await docProcessing.start(response, component);

    html.displayResults(response, res);

    html.htmlFooter(response);

}

async function getFeaturesByOs(response, args) {
    console.log("Request handler 'getFeaturesByOs' was called.");
    response.writeHead(200, { "Content-Type": "text/plain" });

    html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: getFeaturesByOs');
    html.htmlMenu(response);

    try {
        //var logger = new Logger(null);
        var opts = {
            //  startkey: ["Chat Server", "solaris", "8.5.105.06",{}],
            //  endkey: ["Chat Server", "solaris", {},{}]
        };
        var res = await components.query(null, 'test/features-by-release', opts);//['windows','solaris']]});

        var couch_result = new CouchDBResult(res);
        html.displayTableResults(response, couch_result);

        html.htmlFooter(response);

    } catch (err) {
        html.handleError(response, 'Failed to populate table with results', err);
    }

}
async function getComponents(response) {
    console.log("Request handler 'getComponents' was called.");
    response.writeHead(200, { "Content-Type": "text/plain" });
    html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: Get Components');
    html.htmlMenu(response);
    try {
        var res = await components.query(response, 'test2/group-by-components-names', null);

        var couch_result = new CouchDBResult(res);
        html.displayTableResults(response, couch_result);

        html.htmlFooter(response);
    } catch (err) {
        html.handleError(response, 'Failed to populate table with results', err);
    }
}

async function queryCouchDB(response, args) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: Query CouchDB');
    html.htmlMenu(response);
    html.queryForm(response, args);
    try {
        if (null !== args) {

            var opts = {};

            if (args.key) opts = Object.defineProperty(opts, "key", Object.getOwnPropertyDescriptor(args, "key"));
            if (args.startkey) opts = Object.defineProperty(opts, "startkey", Object.getOwnPropertyDescriptor(args, "startkey"));
            if (args.endkey) opts = Object.defineProperty(opts, "endkey", Object.getOwnPropertyDescriptor(args, "endkey"));
            if (args.group) opts = Object.defineProperty(opts, "group", Object.getOwnPropertyDescriptor(args, "group"));
            if (args.inlcude_docs) opts = Object.defineProperty(opts, "include_docs", Object.getOwnPropertyDescriptor(args, "include_docs"));
            if (args.descending) opts = Object.defineProperty(opts, "descending", Object.getOwnPropertyDescriptor(args, "descending"));
            var dbname = (args.dbname) ? args.dbname : undefined;

            var res = await components.query(response, args.view, opts, dbname);

            var couch_result = new CouchDBResult(res);
            html.displayTableResults(response, couch_result);


        }
        html.htmlFooter(response);
    } catch (err) {
        html.handleError(response, 'Failed to populate table with results', err);
    }
}

function getFile(response, args) {
    console.log("Request handler 'getFile' was called.");

    // html.htmlMenu(response);
    if (!args || !args.filename) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        html.htmlHeader(response, 'Upgrade Advisory Helper', 'UAHelper: Get Components');
        html.htmlMenu(response);
        html.handleError(response, 'No reference to the file has been provided in the url', null);
        return;
    }
    var path = buildFilename(args.filename);

    fs.exists(path, function (exists) {
       try { 
           if (!exists) {
            console.log('doesn\'t exist');
            throw (new Error('File ' + filename + ' is not found'));
            return;
        }


        
            response.writeHead(200, {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": "attachment;filename=" + args.filename
            });

            //fs.createReadStream(path.resolve(__dirname, filename)).pipe(response);
            fs.createReadStream(path).pipe(response);
        } catch (err) {
            console.log(err.stack);
            response.writeHead(500, { "Content-Type": "text/plain" });
            throw err;
            // html.htmlFooter(response);
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.recreateViews = recreateViews;
exports.prepareAdvisory = prepareAdvisory;
exports.getComponents = getComponents;
exports.getFile = getFile;
exports.testPrepareAdvisory = testPrepareAdvisory;
exports.getFeaturesByOs = getFeaturesByOs;
exports.queryCouchDB = queryCouchDB;