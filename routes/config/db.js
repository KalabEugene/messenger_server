const mongoose = require('mongoose');

const connectDb = () =>{
    return mongoose.connect(process.env.DB_LINK, {useNewUrlParser: true});
}

module.exports = connectDb;