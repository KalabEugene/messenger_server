const mongoose = require('mongoose');
const link = 'mongodb+srv://123456qwerty:123456qwerty@cluster0.wwedw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const connectDb = () =>{
    return mongoose.connect(link, {useNewUrlParser: true});
}

module.exports = connectDb;