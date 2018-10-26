var objects={

    getPropertiesArray: function(obj){

        return Object.getOwnPropertyNames(obj);

    }

}


var obj={
    "8.1.234.455": '1',
    "8.1.234.454": '1',
    "8.1.234.452": '1',
}

var t=objects.getPropertiesArray(obj);
