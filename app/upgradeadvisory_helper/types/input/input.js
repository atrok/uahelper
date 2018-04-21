class Input {
    constructor(com) {
        this.components = com;
        this.current = {};
        try{
        this.couchdb = new db.CouchDB({ host: db.couchdb_host, port: db.couchdb_port, username: db.couchdb_username, password: db.couchdb_pass });
        this.couchdb.getDBConnection(db.couchdb_name);
        }catch(e){
            console.log(e);
            throw e;
        }
    }

    iterator() {
        var index = 0;
        while (index < this.components.length) {
            this.current = this.components[index];

            var solution = this.getSolution();
            var application = this.getApplication();
            var release = this.getRelease()
            var os=this.getOS();
            
            var c= {
                key:index,
                value:{
                    solution: solution,
                APPLICATION_TYPE: application,
                RELEASE: release,
                OS_TYPE: os,

                }
            };

            index++;

            yield c;
        }
    }
    

    async findSolution(component) {
        // if solution is empty let's try to find it in release notes DB
        //empty
        var couchdb=this.coughdb;
        return new Promise(async (resolve, reject) => {
          try {
            var solutions_fromDB = await couchdb.select('test2/solutions_by_components',
              {
                startkey: [component, ""],
                endkey: [component, {}],
                group: true, reduce: true, inclusive_end: true
              }, null
            )
      
            resolve(solutions_fromDB[0].key[1]);
          } catch (e) {
            console.log("FindSolution: " + e.stack);
            reject(e);
          }
        })
      }

    getSolution(){}
    getApplication(){}
    getRelease(){}
    getOS(){}

}

class DBInput extends Input{
    constructor(com) {
        var components = com;
        var current = {};
    }

    iterator(){
        super.iterator();
    }

    async getSolution(){

        var p = apptypes.findByLCValue(this.current.APPLICATION_TYPE);
        
        if (null === p) {
          solution = await super.findSolution(this.current.APPLICATION_TYPE);
        } else {
          solution = p.solution;
        }

        return solution;
    }
    getApplication(){
        var p = apptypes.findByLCValue(this.current.APPLICATION_TYPE);
        if (null === p) {
            return this.current.APPLICATION_TYPE
        }else{
            return p.name
        }
    }

    getRelease(){
        return this.current.RELEASE;
    }

    getOS(){
        var o = ostypes.findByTypeID(this.current.OS_TYPE);
        var os = (null === o) ? this.current.OS_TYPE : o.name;
        return os;
    }

}