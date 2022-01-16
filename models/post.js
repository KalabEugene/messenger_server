const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userName: { type: String },
  srcImg: { type: String },
  text: { type: String },
  userId: { type: String },
  likes: { type: Number },
  likesUsers: [{ type: String }],
  fileName: { type: String },
  date: { type: Date },
});

module.exports = mongoose.model("post", postSchema);
