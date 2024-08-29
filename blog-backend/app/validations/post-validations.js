postValidationSchema = {
    title:{
        exists:{
            errorMessage:'title is required'
        },
        notEmpty:{
            errorMessage:'title cannot be empty'
        },
        isLength:{
            options:{min:7, max:99},
            errorMessage:'title should consists of minimum 7 characters'
        },
        trim:true
    },
    content:{
        exists:{
            errorMessage:'content is required'
        },
        notEmpty:{
            errorMessage:'content cannot be empty'
        },
        isLength:{
            options:{min:100},
            errorMessage:'content should consists of minimum 100 characters'
        },
        trim:true
    },
    featuredImage:{
        exists:{
            errorMessage:'featureImage is required'
        }
    }
}