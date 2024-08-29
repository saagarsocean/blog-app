const commentValidationSchema = {
    content: {
        in: ['body'],
        exists: {
            errorMessage: 'content is required'
        },
        notEmpty: {
            errorMessage: 'content cannot be empty'
        },
        isLength: {
            options: { min: 1, max: 100 },
            errorMessage: 'content should be between 1 to 100 characters long'
        },
        trim: true
    }
}

module.exports = commentValidationSchema