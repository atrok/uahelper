var dbquery=require('../queries/groupbycomponents.js');
var Logger=require('../logger');
const {CouchDBResult}=require('../result');

p=async()=>{
    try {
        var logger=new Logger(null);
    var opts ={
        startkey:["Chat Server", {},{}],
        endkey:["Chat Server", {},{}]
    };
    var res = await dbquery.query(null,'test2/features-by-component-os', {});//['windows','solaris']]});

    var couch_result=new CouchDBResult(res);
    //logger.log(couch_result);

} catch (err) {
 console.log(err.stack);    
}
};

p();