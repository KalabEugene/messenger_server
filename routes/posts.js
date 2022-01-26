import express, { query } from "express";
export const router = express.Router();
import Post from "../models/post.js";
import User from "../models/users.js";
import auth from "../middleware/auth.js";
import GridFsUpload from "../services/gridfs_upload.js";

router.get("/", auth, async (req, res) => {
  let count = await Post.count();
  const resultsPage = 5;
  const pageNumber = req.query.page;
  let page = pageNumber >= 1 ? pageNumber : 1;
  page = page - 1;
  const posts = await Post.find({})
    .populate("author")
    .sort({ createdAt: -1 })
    .limit(resultsPage)
    .skip(resultsPage * page);
  res.status(200).send({ posts, count });
});

router.get("/my", auth, async (req, res) => {
  let count = await Post.count();
  const resultsPage = 5;
  const pageNumber = req.query.page;
  let page = pageNumber >= 1 ? pageNumber : 1;
  page = page - 1;
  const posts = await Post.find({ author: req.user.id })
    .populate("author")
    .sort({ createdAt: -1 })
    .limit(resultsPage)
    .skip(resultsPage * page);
  res.status(200).send({ posts, count });
});

router.get("/popular", auth, async (req, res) => {
  const posts = await Post.find({})
    .populate("author")
    .sort({ likes: -1 })
    .limit(10);
  res.status(200).send(posts);
});

router.post("/", auth, async (req, res) => {
  let date = new Date();
  if(req.body.text === undefined){
    return res.status(400).send("Text must be specified");
  }
  const post = new Post({
    text: req.body.text,
    author: req.user.id,
    createdAt: date,
  });
  await post.save();
  if (req.files) {
    let id = GridFsUpload.init(req.files.file);
    await Post.updateOne({ _id: post._id }, { $set: { fileId: id } });
  }
  return res.status(201).json(post);
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
