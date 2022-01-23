const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/users");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 }).limit(20);
  res.status(200).send(posts);
});

router.get("/popularposts", auth, async (req, res) => {
  const posts = await Post.find({}).sort({ likes: -1 }).limit(10);
  res.status(200).send(posts);
});

router.post("/", auth, async (req, res) => {
  let user = await User.findOne({ _id: req.user.id });
  const post = new Post({
    text: req.body.text || "Default text",
    username: user.nickname || "Noname",
    profilepicture: user.profilepicture || "No photo",
    userId: req.user.id,
  });
  await post.save();
  if (req.files) {
    let id = require("../services/gridfs_upload").init(req.files.file);
    await Post.updateOne({ _id: post._id }, { $set: { fileId: id } });
  }
  return res.status(201).json(post);
});

router.put("/info", auth, async (req, res) => {
  await Post.updateMany(
    { userId: req.user.id },
    { $set: { username: req.body.nickname } }
  );
  return res.send(`Posts was updated!`).status(200);
});

router.put("/:id/likes", auth, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  if (!post.likesUsers.includes(req.user.id)) {
    post.likesUsers.push(req.user.id);
    await Post.updateOne(
      { _id: req.body.id },
      { $set: { likes: req.body.likes, likesUsers: post.likesUsers } }
    );
    return res.send(`Post was updated!`).status(200);
  }
  post.likesUsers.splice(post.likesUsers.indexOf(req.user.id), 1);
  await Post.updateOne(
    { _id: req.body.id },
    { $set: { likes: req.body.likes - 2, likesUsers: post.likesUsers } }
  );
  return res.send(`Post was updated!`).status(200);
});

router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    await post.delete();
    return res.send(`Post id ${post.id} was deleted!`).status(200);
  } else {
    return res.status(400).send("Error");
  }
});
module.exports = router;
