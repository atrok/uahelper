var db=require('../couchdb');
var Logger=require('../logger');
var query=require('../queries/groupbycomponents');

var couchdb=new db.CouchDB({host:db.couchdb_host,port: db.couchdb_port,username: db.couchdb_username,password: db.couchdb_pass});

var b= async ()=>{

    var logger=new Logger();
    var db=couchdb.getDBConnection('sitemap-data-genesys_81');

    /*
    db.save('_design/test2', '', {
        views: {
        'group-by-components-names': {
            map: function (doc) {
                if(doc.component){
                emit([doc.component, doc.solution_name,doc.component-href],1);
            }
            },
            reduce: function(keys, values) {
              return sum(values);
            }
        } 
      }
    } , async function (err, res) {
    //db.save('_design/test', func , function (err, res) {
      if(err){
        console.log(err)
        return;
      }
      console.log("Created succesfully");
*/
      //var db=couchdb.getDBConnection('sitemap-data-genesys_81');
      var res=await couchdb.select('test2/group-by-components-names',{group: true, stale: 'update_after'},null);
      
          var rows=res.rows;
      
          rows.forEach(function(value,key){
              logger.log(value.key.toString());
        })
    //});
}

b();

