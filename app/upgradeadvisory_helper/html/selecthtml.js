const StringBuilder=require('../stringbuilder');

class SelectHTML{
    constructor(selectName,visiblesize, multiple ){
        this.selectName=selectName;
        this.visiblesize=visiblesize;
        this.multiple=multiple;
        this.options=[];
    }

    addOption(text, value, selected){
        this.options.push({text: text, value: value, selected: (!selected)? false: true});
    }

    getSelectName(){
        return (this.selectName)? 'name="'+this.selectName+'"':'name="select_list"';
    }

    getVisiblesize(){
        return (this.visiblesize)?'size="'+this.visiblesize+'"':'';
    }

    getMultiple(){
        return (this.multiple)?'multiple':'';
    }

    getOptions(){
        return (this.options)?this.options:null;
    }

    toString(){
        var sb = new StringBuilder();
        sb.append('<div><select ' + this.getSelectName() + ' ' + this.getMultiple() + ' ' + this.getVisiblesize() + '>');
        this.getOptions().forEach(element => {
          sb.append('<option value="' + element.value + '">' + element.text + '</option>');
        });
        sb.append('</select></div>');
        return sb.toString();
    }
}

module.exports=SelectHTML;