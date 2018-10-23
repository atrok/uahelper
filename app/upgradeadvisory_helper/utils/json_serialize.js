function assignType(object){
    if(object && typeof(object) === 'object' && global[object.__type]) {
        object = assignTypeRecursion(object.__type, object);
    }
    return object;
}

function assignTypeRecursion(type, object){
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            var obj = object[key];
            if(Array.isArray(obj)){
                 for(var i = 0; i < obj.length; ++i){
                     var arrItem = obj[i];
                     if(arrItem && typeof(arrItem) === 'object' && global[arrItem.__type]) {
                         obj[i] = assignTypeRecursion(arrItem.__type, arrItem);
                     }
                 }
            } else  if(obj && typeof(obj) === 'object' && global[obj.__type]) {
                object[key] = assignTypeRecursion(obj.__type, obj);
            }
        }
    }
    return Object.assign(new global[type](), object);
}

module.exports = {
    assignType,
}
