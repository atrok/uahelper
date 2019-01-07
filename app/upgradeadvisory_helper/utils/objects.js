var objects={

    getPropertiesArray: function(obj){

        return Object.getOwnPropertyNames(obj);

    },

    copy: function(obj, struct) {
        //console.log(typeof obj);

        const propNames = Object.getOwnPropertyNames(struct);
        propNames.forEach(function (name) {
            const desc = Object.getOwnPropertyDescriptor(struct, name);
            Object.defineProperty(obj, name, desc);
        });
        return obj;
    }

}


var obj={
    "8.1.234.455": '1',
    "8.1.234.454": '1',
    "8.1.234.452": '1',
}

var t=objects.getPropertiesArray(obj);
