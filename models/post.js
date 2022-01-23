const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  username: { type: String },
  profilepicture: { type: String },
  text: { type: String },
  userId: { type: String },
  likes: { type: Number, default: 0 },
  likesUsers: { type: Array },
  fileId: { type: String },
  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("post", postSchema);
