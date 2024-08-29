const categoryValidationSchema = {
    name:{
        exists:{
            errorMessage:'category name is required'
        },
        notEmpty:{
            errorMessage:'category name cannot be empty'
        },
        trim:true
    },
    description:{
        exists:{
            errorMessage:'category description is required'
        },
        notEmpty:{
            errorMessage:'category description is required'
        },
        isLength:{
            options:{min:10},
            errorMessage:'category description should atleast consists of minimum 10 characters'
        },
        trim:true
    }
}

module.exports = categoryValidationSchema