import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  picture: { type: String },
  about: { type: String },
  userId: { type: String },
  nickname: { type: String },
  email: { type: String },
  isPremium: { type: Boolean, default: false}
});

export default mongoose.model("User", userSchema);
