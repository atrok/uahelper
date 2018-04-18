var validate = require('./validate');
var { constraints, search_component_constraints } = require('./constraints');

var validator = function (args) { }

validator.prototype.validate = function (args) {
    switch (args.form) {
        case "form_dbs":
            var result = validate(args.args, constraints);
            console.log(result);

            return result;
        case "form_comp":
            var result = validate(args.args, search_component_constraints);
            console.log(result);

            return result;
        case "form_csv":
            return undefined;
        default:
            return { validator: 'Can\'t find form ' + args.form + ' to validate' };
    }
}


module.exports = new validator();
