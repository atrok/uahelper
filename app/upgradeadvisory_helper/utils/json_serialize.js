var types = require("../result");

var serializerProto = {
    assignType: function assignType(object) {
        if (object && typeof (object) === 'object' && types[object.__type]) {
            object = this.assignTypeRecursion(object.__type, object);
        }
        return object;
    },

    assignTypeRecursion: function assignTypeRecursion(type, object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                var obj = object[key];
                if (Array.isArray(obj)) {
                    for (var i = 0; i < obj.length; ++i) {
                        var arrItem = obj[i];
                        if (arrItem && typeof (arrItem) === 'object' && global[arrItem.__type]) {
                            obj[i] = this.assignTypeRecursion(arrItem.__type, arrItem);
                        }
                    }
                } else if (obj && typeof (obj) === 'object' && global[obj.__type]) {
                    object[key] = this.assignTypeRecursion(obj.__type, obj);
                }
            }
        }
        return Object.assign(new types[type](), object);
    }

}
function createSerializer(types){

    var obj=Object.create(serializerProto);
    Object.assign(obj, types);

    return obj;

}
module.exports = {
    createSerializer,
}
