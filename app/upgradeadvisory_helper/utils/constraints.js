var constraints = {
    dbname:{
        presence: true,
        format: {
            // Must be numbers and numbers and -,_ allowed
            pattern: "^[A-Za-z0-9\.-_]+",
            message: "^Alphanumerical and .-_ are allowed in DB name"
        },
        length:{
            minimum:4,
            maximum: 25,
            message: "^DB name should be 4-25 symbols long"
        }

    },
    host:{
        presence: true,
        format: {
            // Must be numbers and numbers and -,_ allowed
            pattern: "^[A-Za-z0-9\.-_]+",
            message: "^Alphanumerical and .-_ are only allowed in hostname"
        },
        length:{
            minimum:4,
            maximum: 100,
            message: "^Can't be less than 4 and more than 100 symbols in hostname"
        }

    },
    user: {
        presence: true,
        format: {
            // Must be numbers and numbers and -,_ allowed
            pattern:  "^[A-Za-z0-9\.-_]+",
            message: "^Alphanumerical and .-_ are only allowed in username"
        },
        length:{
            minimum:3,
            maximum: 16,
            message: '^Username can\'t be shorter than 3 and longer than 16 symbols'
        }
            
      },
      pass: {
        presence: true,
        length:{
            minimum:3,
            maximum: 16,
            message: '^Password can\'t be shorter than 3 and longer than 16 symbols'
        }
      }

  };


  var search_component_constraints = {
    apptype:{
        presence: true,
        length:{
            minimum: 4,
            maximum: 100,
            message: "^Application name should be 4-100 symbols long"
        }

    },
    ostype:{
        presence: true,
        format: {
            // Must be numbers and numbers and -,_ allowed
            pattern: "^[a-z]+",
            message: "^lowercase character only allowed in os type"
        },
        length:{
            minimum:4,
            maximum: 25,
            message: "^Can't be less than 4 and more than 25 symbols in os type"
        }

    },
    release: {
        presence: false,
        format: {
            // Must be numbers and numbers and -,_ allowed
            pattern:  "^[0-9\.]+",
            message: "^Digits and '.' are only allowed in release"
        },
        length:{
            minimum:1,
            maximum: 10,
            message: '^Release can\'t be shorter than 1 and longer than 10 symbols'
        }
            
      }
  };
  module.exports={
      constraints,
      search_component_constraints
  };