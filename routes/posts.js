const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/users");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const posts = await Post.find({});
  res.send(posts);
});

router.post("/", auth, async (req, res) => {
  let user = await User.findOne({ email: req.user.email });
  if(req.files){
    require('../services/gridfs_upload').init(req.files.file)
    const post = new Post({
      text: req.body.text || "Default text",
      userName: user.nickName || "Noname",
      srcImg: user.srcImg || "No photo",
      userId: user.userId,
      file: req.body.file,
      likesUsers: [],
      likes: 0,
      fileName: req.files.file.name || null 
    }) 
      await post.save();
      return res.json(post);
  } else {
      const post = new Post({
        text: req.body.text || "Default text",
        userName: user.nickName || "Noname",
        srcImg: user.srcImg || "No photo",
        userId: user.userId,
        file: req.body.file,
        likesUsers: [],
        likes: 0,
      }) 
      await post.save();
      return res.json(post);
    }
  
});

router.put("/info", auth, async (req, res) => {
  await Post.updateMany(
    { userId: req.user.id },
    { $set: { userName: req.body.nickName } }
  );
  return res.send(`Posts was updated!`).status(200);
});

router.put("/likes", auth, async (req, res) => {
  const post = await Post.findOne({ _id: req.body.id });
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
  } else return res.send("Error").status(400);
});
module.exports = router;
