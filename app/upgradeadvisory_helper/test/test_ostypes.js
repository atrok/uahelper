var OSTypes=require('../enum/ostypes');

var type=new OSTypes();

var val=type.findByTypeID(15);

console.assert("Windows"===val.name,"Failed findByTypeID %", val);

var val=type.findByTypeID(-1);
console.assert(null===val,"Failed findByTypeID with id=-1 %", val);

var val=type.findByName('Windows Server 2003');
console.assert(15===val.typeid,"Failed findByName with name=Windows Server 2003", val);

var val=type.findByName('Windows Server');
console.assert(null===val ,"Failed findByName with name=Windows Server (expected val==NULL)", val);

var val=type.findByName(145);
console.assert(null===val ,"Failed findByName with name=145 (expected val==NULL)", val);

