const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    usersName: { type: String},
    /* title: { type: String}, */
    text: { type: String},
    date: {type: String, default: Date.now}
});

module.exports = mongoose.model('post', postSchema);