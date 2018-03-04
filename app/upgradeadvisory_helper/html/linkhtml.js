const StringBuilder=require('../stringbuilder');

class LinkHTML{
    constructor(selectName,href, target, cls,id){
        this.selectName=selectName;
        this.href=href;
        this.target=target;
        this.cls=cls;
        this.id=id;
        
    }

    addOnClick(str){
        this.onclick=str;
        return this;
    }
    getSelectName(){
        return (this.selectName)? this.selectName:this.href;
    }

    getHref(){
        return (this.href)? 'href="'+this.href+'"':'href="/"';
    }

    
    getTarget(){
        return (this.target)? 'target="'+this.target+'"':'';
    }

    getClass(){
        return (this.cls)? 'class="'+this.cls+'"':'';
    }
    getId(){
        return (this.id)? 'id="'+this.id+'"':'';
    }

    getonclick(){
        return (this.onclick)? 'onClick="'+this.onclick+'"':'';
    }
    

    toString(){
        var sb = new StringBuilder();
        sb.append('<a ' + this.getHref() + ' '+this.getTarget()+' '+this.getClass()+' '+this.getId()+' '+this.getonclick()+'>'+this.getSelectName()+'</a>');
        return sb.toString();
    }
}

module.exports=LinkHTML;