const User = require('../models/user-model')
const userRegisterValidationSchema = {
    username:{
        exists:{
            errorMessage:'username is required'
        },
        notEmpty:{
            errorMessage:'username cannot be empty'
        },
        trim:true
    },
    email:{
        exists:{
            errorMessage:'email is required'
        },
        notEmpty:{
            errorMessage:'email cannot be empty'
        },
        isEmail:{
            errorMessage:'email should be in a valid format'
        },
        custom:{
            options: async function(value){
                const user = await User.findOne({email:value})
                if(user){
                    throw new Error('email already taken')
                } else {
                    return true
                }
            }
        },
        trim:true
    },
    password:{
        exists:{
            errorMessage:'password is required'
        },
        notEmpty:{
            errorMessage:'passowrd cannot be empty'
        },
        isLength:{
            options:{min:9, max:31},
            errorMessage:'password should be between 9-31 characters'
        },
        trim:true
    },    
    bio:{
        exists:{
            errorMessage:'bio is required'
        },
        notEmpty:{
            errorMessage:'bio cannot be empty'
        },    
        trim:true
    }
}

module.exports = userRegisterValidationSchema