import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
  text: { type: String },
  author: { type: ObjectId, ref: "User" },
  likes: { type: Number, default: 0 },
  likesUsers: { type: Array },
  fileId: { type: ObjectId },
  createdAt: { type: Date },
});

export default mongoose.model("Post", postSchema);
