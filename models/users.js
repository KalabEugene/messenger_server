const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { type: String},
    srcImg: {type: String},
    aboutUser: { type: String},
    userId: { type: String},
    nickName: { type: String},
    email: { type: String}
    
});

module.exports = mongoose.model('user', userSchema);