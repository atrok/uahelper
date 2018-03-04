class DatabaseTypes {
    
        constructor(){
            this.types=[
                { typeid:'8.1'	, name:'sitemap-data-genesys_81'},
                { typeid:'8.5'	, name:'sitemap-data-genesys_rn_85'}
            ];
        }
    
        findByTypeID(id){
            var type=this.types;
            for (var i=0;i<type.length;i++){
                if (id===type[i].typeid)
                return type[i];
            }
            return null;
    
        }
    
        findByName(name){
            var type=this.types;
            for (var i=0;i<type.length;i++){
                if (name===type[i].lc_value)
                return type[i];
            }
            return null;
        }
    
    
    }
    
    module.exports=DatabaseTypes;