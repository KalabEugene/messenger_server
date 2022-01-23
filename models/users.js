const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  profilepicture: { type: String },
  about: { type: String },
  userId: { type: String },
  nickname: { type: String },
  email: { type: String },
});

module.exports = mongoose.model("user", userSchema);
