const mongoose = require('mongoose')
const configureDB = async()=>{
    try{
        const db = await mongoose.connect(process.env.DB_URL)
        console.log('Connected to MongoDB')
    } catch(err){
        console.log(err)
    }
}

module.exports = configureDB