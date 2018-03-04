const StringBuilder=require('../stringbuilder');
var i=0;

class FormHTML{
    constructor(){
        this.sb=new StringBuilder();

        this.html_entities=[];
        this.sb.append('<div id="form_container">');

        this.formattributes=undefined;
        this.submit='<input type="submit" value="Submit">';

        this.header=undefined;
        this.description=undefined;
    
    }

    addFormAttributes(name,method,action){
        var n= (typeof name!=='undefined')?name:'form_'+i;
        var m=(typeof method!=='undefined')?'method="'+method+'"':'method="get"';
        var a=(typeof action!=='undefined')?'action="'+action+'"': 'action="/"';
        
        this.formattributes='<form id="'+n+'" '+m+' '+a+'>';
    }

    addHeader(text){
        this.header='<h1><a>'+text+'</a></h1>';
    }


    addDescription(header, text){

        var sb=new StringBuilder();
        sb.append('<div>');
        if (typeof header!=='undefined') sb.append('<h2>'+header+'</h2>');
        if (typeof this.text!=='undefined') sb.append('<p>'+text+'</p>');
        sb.append('</div>');
        this.description=sb.toString();
    }

    addElement(element){
        this.html_entities.push(element.toString());
        return this;
    }

    addSubmit(text){
        this.submit='<input type="submit" value="'+text+'">';
    }

    toString(){
        this.sb.append(this.formattributes);
        this.sb.append(this.header);
        this.sb.append(this.description);

        if(this.html_entities.length>0){
            this.html_entities.forEach(e=>{
                this.sb.append(e);
            })
        }
        this.sb.append(this.submit);
        this.sb.append('</form></div>');

        return this.sb.toString();

    }

}

module.exports=FormHTML;
