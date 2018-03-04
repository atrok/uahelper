var couchdb=require('../couchdb');

var b= async (db)=>{
    var db=couchdb.getDBConnection(db);

    db.save('_design/test', '', {
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
    } , function (err, res) {
    //db.save('_design/test', func , function (err, res) {
      if(err){
        console.log(err)
        return;
      }
      console.log("Created succesfully");
      
    });
}

b();
