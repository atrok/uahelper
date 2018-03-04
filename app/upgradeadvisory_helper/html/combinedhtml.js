var StringBuilder=require('../stringbuilder');
var ListHTML=require('./listhtml');

class CombinedHTML{
    constructor(){
        this.elems=[];
    }

    addElement(el){
        return this.elems.push(el);// return index of added elem to be able to delete it
    }

    KVProcessor(fn){
        this.kvprocessor=fn;
    }


    toString(){
        var result=new StringBuilder();
       for (var el in this.elems){
           var kv=new ListHTML().KVtolist(this.elems[el]);
            var t=(el instanceof String)?this.elems[el]:kv.toString();
            result.append(t);
        }

        return result.toString()
    }
}

module.exports=CombinedHTML;