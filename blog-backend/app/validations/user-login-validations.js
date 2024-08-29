const userLoginValidationSchema = {
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
        normalizeEmail:true,
        trim:true
    },
    password:{
        exists:{
            errorMessage:'password is required'
        },
        notEmpty:{
            errorMessage:'password cannot be empty'
        },
        isLength:{
            options:{min:9, max:31},
            errorMessage:'password shoulb be between 9-31 characters'
        },
        trim:true
    }
}

module.exports = userLoginValidationSchema