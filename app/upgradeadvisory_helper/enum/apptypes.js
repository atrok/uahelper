class ApplicationTypes {
constructor (){
    this.apptypes=[
            { typeid:148, lc_value:'GVP Call Control Platform', name:"Call Control Platform", solution: "Genesys Voice Platform"},
            { typeid:59, lc_value:'Chat Server',	name:"Chat Server", solution: "eServices"},
            { typeid:90, lc_value:'Classification Server',	name:"Classification Server", solution: "eServices"},
            { typeid:21, lc_value:'Configuration Server',	name:"Configuration Server", solution: "Management Framework"},
            { typeid:64, lc_value:'E-Mail Server',	name:"E-mail Server", solution: "eServices"},
            { typeid:184, lc_value:'Genesys Administrator Server',	name:"Genesys Administrator Extension", solution: "Genesys Administrator Extension"},
            { typeid:61, lc_value:'Co-Browsing Server',	name:"Genesys Co-browse Server", solution: "Genesys Co-browse"},
            { typeid:55, lc_value:'GIM ETL',	name:"Genesys Info Mart", solution: "Genesys Info Mart"},
            { typeid:111, lc_value:'Interaction Server',	name:"Interaction Server", solution: "eServices"},
            { typeid:166, lc_value:'iWD Manager',	name:"iWD Manager", solution: "intelligent Workload Distribution"},
            { typeid:167, lc_value:'iWD Runtime Node',	name:"iWD Runtime Node", solution: "intelligent Workload Distribution"},
            { typeid:100, lc_value:'Knowledge Manager',	name:"Knowledge Manager", solution: "eServices"},
            { typeid:145, lc_value:'GVP Media Control Platform',	name:"Media Control Platform", solution: "Genesys Media Server"},
            { typeid:42, lc_value:'Message Server',	name:"Message Server", solution: "Management Framework"},
            { typeid:173, lc_value:'VP MRCP Proxy',	name:"MRCP Proxy", solution: "Genesys Voice Platform"},
            { typeid:153, lc_value:'GVP Reporting Server',	name:"Reporting Server", solution: "Genesys Media Server"},
            { typeid:149, lc_value:'GVP Resource Manager',	name:"Resource Manager", solution: "Genesys Media Server"},
            { typeid:62,lc_value:'SMS Server',	name:"SMS Server", solution: "eServices"},
            { typeid:45, lc_value:'SNMP Agent', name:"SNMP Master Agent", solution: "Management Framework"},
            { typeid:171,lc_value:'Social Messaging Server',	name:"Social Messaging Server", solution: "eServices"},
            { typeid:43,lc_value:'Solution Control Server',	name:"Solution Control Server", solution: "Management Framework"},
            { typeid:2,lc_value:'Stat Server',	name:"Stat Server", solution: "Stat Server"},
            { typeid:154,lc_value:'GVP SSG',	name:"Supplementary Services Gateway", solution: "Genesys Voice Platform"},
            { typeid:91,lc_value:'Training Server',	name:"Training Server", solution: "eServices"},
            { typeid:63,lc_value:'Contact Server',	name:"Universal Contact Server", solution: "eServices"},
            { typeid:71,lc_value:'Contact Server Manager',	name:"Universal Contact Server Manager", solution: "eServices"},
            { typeid:80,lc_value:'Web API Server',	name:"Web API Server", solution: "eServices"},
            { typeid:1005,lc_value:'Avaya Communication Manager T-Server',	name:"T-Server for Avaya Communication Manager", solution: "Framework"},
            { typeid:1072,lc_value:'SIP Switch T-Server',	name:"SIP Server", solution: "Framework"},
            ];
        }

    findByTypeID(id){
        var applications=this.apptypes;
        for (var i=0;i<applications.length;i++){
            if (id===applications[i].typeid)
            return applications[i];
        }
        return null;

    }

    findByName(name){
        var applications=this.apptypes;
        for (var i=0;i<applications.length;i++){
            if (name===applications[i].name)
            return applications[i];
        }
        return null;
    }

    findByLCValue(name){
        var applications=this.apptypes;
        for (var i=0;i<applications.length;i++){
            if (name===applications[i].lc_value)
            return applications[i];
        }
        return null;
    }

    findBySolution(name){
        var applications=this.apptypes;
        var arr=[];
        for (var i=0;i<applications.length;i++){
            if (name===applications[i].solution)
            arr.push(applications[i]);
        }
        return arr;
    }

}

module.exports=ApplicationTypes;