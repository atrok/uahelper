var StringBuilder = require('../stringbuilder');
var SelectHTML = require('./selecthtml');
var FormHTML=require('./formhtml');

// Report an error
function handleError(response, text, err) {
  if (null !== response) {
    if (err) {
      text += ": " + err.message;
    }
    console.error(text);
    
    response.write('<div class="error"><p>Error: ' + text + '</p></div>');
    htmlFooter(response);
  }
}

// Display query results
function displayTableResults(result, tablename) {
var sb=new StringBuilder();
    var tname=(typeof tablename!=='undefined')?tablename:'Query results';
    sb.append('<div id="resultsTable">');
    sb.append("<h2>"+tname+"</h2>");

    sb.append(result.display());

    sb.append('</div>');

    return sb.toString();
}

function displayObject(result) {
  var sb=new StringBuilder();
      //var tname=(typeof tablename!=='undefined')?tablename:'Query results';
      var s=[];
      Object.keys(result).forEach((key)=>{
        s.push(result[key]);
      })
  
      return s;
  }

// Display query results
function displayResults(result) {
  var sb=new StringBuilder();
  
    sb.append('<div id="result">');
    sb.append(result);
    sb.append("</div>");
  return sb.toString;
}
// Prepare HTML header
function htmlHeader(response, title, caption) {
  if (null !== response) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("<!DOCTYPE html>");
    response.write("<html>");
    response.write("<head>");
    response.write("<style>" +
      "body {background:#FFFFFF;color:#000000;font-family:Arial,sans-serif;margin:40px;padding:10px;font-size:12px;}" +
      "h1 {margin:0px;margin-bottom:12px;background:#FF0000;text-align:center;color:#FFFFFF;font-size:28px;}" +
      "table {border-collapse: collapse;   margin-left:auto; margin-right:auto;}" +
      "td, th {padding:8px;border-style:solid}" +
      "</style>\n");
    response.write("<title>" + caption + "</title>");
    response.write("</head>");
    response.write("<body>");
    response.write('<h1 id="title">' + title + "</h1>");
  }
}

// Prepare HTML footer
function htmlFooter(response) {
  if (null !== response) {
    response.write("<p>Finished</p></body></html>");
    response.end();
  }
}

function htmlMenu(response) {
  if (null !== response) {
    response.write('<div class=\'menu\'>' +
      '<p><a title="Home" href="/">Home</a></p>' +
      '<p><a title="Start Upgrade Advisory document preparation" href="/prepareAdvisory">Start Upgrade Advisory document creation</a></p>' +
      '<p><a title="Test Upgrade Advisory document preparation" href="/testPrepareAdvisory">Test Upgrade Advisory document creation</a></br>' +
      'use ?apptype=<your apptype>&release=<your release> as a query to generate report for single component only</p>' +
      '<p><a title="Recreate Couch DB views" href="/recreateViews">Recreate Couch DB views</a></p>' +
      '<p><a title="CouchDB query interface" href="/queryCouchDB">Query CouchDB</a></p>' +
      '<p><a title="Get list of available components" href="/getComponents">Get list of available components</a></p>' +
      '</div>');
  }
}

function queryForm(response, args) {
  if (null !== response) {
    var dbname = '',
      view = '',
      key = '',
      startkey = '',
      endkey = '',
      group = '',
      include_docs = '',
      descending = '';

    if (args !== null) {
      dbname = (typeof args.dbname !== 'undefined') ? args.dbname : '';
      var view = (typeof args !== 'undefined' && typeof args.view !== 'undefined') ? args.view : '';
      var key = (typeof args !== 'undefined' && typeof args.key !== 'undefined') ? args.key : '';
      var startkey = (typeof args !== 'undefined' && typeof args.startkey !== 'undefined') ? args.startkey : '';
      var endkey = (typeof args !== 'undefined' && typeof args.endkey !== 'undefined') ? args.endkey : '';
      var group = (typeof args !== 'undefined' && typeof args.group !== 'undefined') ? 'checked' : '';
      var include_docs = (typeof args !== 'undefined' && typeof args.include_docs !== 'undefined') ? 'checked' : '';
      var descending = (typeof args !== 'undefined' && typeof args.descending !== 'undefined') ? 'checked' : '';
    }
    response.write('	<div id="form_container">' +

      '<h1><a>CouchDB query interface</a></h1>' +
      '<form id="form_68250" class="appnitro"  method="get" action="/queryCouchDB">' +
      '<div class="form_description">' +
      '<h2>Query CouchDB </h2>' +
      '<p>Request data from CouchDB</p>' +
      '</div>	' +
      '	<ul >' +

      '<li id="li_1" >' +
      '<label class="description" for="element_1">DB name (max 255) </label>' +
      '<div>' +
      '<input id="element_1" name="dbname" class="element text medium" type="text" size="255" maxlength="255" value="' + dbname + '"/> ' +
      '</div> ' +
      '</li>		' +

      '<li id="li_1" >' +
      '<label class="description" for="element_1">View</label>' +
      '<div>' +
      '<input id="element_1" name="view" class="element text medium" type="text" size="255" maxlength="255" value="' + view + '"/> ' +
      '</div> ' +
      '</li>		' +
      '<li id="li_1" >' +
      '<label class="description" for="element_1">Key</label>' +
      '<div>' +
      '<input id="element_1" name="key" class="element text medium" type="text" size="255" maxlength="255" value="' + key + '"/> ' +
      '</div> ' +
      '</li>' +
      '<li id="li_1" >' +
      '<label class="description" for="element_1">Start key</label>' +
      '<div>' +
      '<input id="element_1" name="startkey" class="element text medium" type="text" size="255" maxlength="255" value="' + startkey + '"/> ' +
      '</div> ' +
      '</li>' +
      '<li id="li_1" >' +
      '<label class="description" for="element_1">End Key</label>' +
      '<div>' +
      '<input id="element_1" name="endkey" class="element text medium" type="text" size="255" maxlength="255" value="' + endkey + '"/> ' +
      '</div> ' +
      '</li>' +
      '<li id="li_3" >' +
      '<label class="description" for="element_3"> </label>' +
      '<span>' +
      '<input id="element_3_1" name="group" class="element checkbox" type="checkbox" value=true ' + group + ' />' +
      '<label class="choice" for="element_3_1">Group</label>' +
      '<input id="element_3_2" name="include_docs" class="element checkbox" type="checkbox" value=true ' + include_docs + ' />' +
      '<label class="choice" for="element_3_2">Include docs</label>' +
      '<input id="element_3_2" name="descending" class="element checkbox" type="checkbox" value=true ' + descending + ' />' +
      '<label class="choice" for="element_3_2">Descending</label>' +

      '</span>' +
      '</li>' +

      '<li class="buttons">' +
      '<input type="hidden" name="form_id" value="68250" />' +

      '<input id="saveForm" class="button_text" type="submit" name="submit" value="Submit" />' +
      '</li>' +
      '</ul>' +
      '</form>' +
      '</div>');
  }
}

function generateForm(response, form){

  if (form instanceof FormHTML){

    response.write(form.toString());
  }else{
    throw new Error('FormHTML was expected');
  }

}

// list is array of values
function selectList(response, list) {

  if (list instanceof SelectHTML) {
    response.write(list.toString());

  } else {
    throw new Error('SelectHTML was expected');
  }
}


module.exports = {
  htmlHeader,
  htmlFooter,
  displayResults,
  handleError,
  displayTableResults,
  displayObject,
  htmlMenu,
  queryForm,
  selectList,
  generateForm
}