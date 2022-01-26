import express from "express";
export const router = express.Router();
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import auth from "../middleware/auth.js";
import admin from "firebase-admin";

router.get("/me", auth, async (req, res) => {
  const user = await User.findById({ _id: req.user.id });
  return res.status(200).json(user);
});

router.post("/", async (req, res) => {
  let idToken = req.body.token;
  let fuser = await admin.auth().verifyIdToken(idToken);
  let user = await User.findOne({ email: fuser.email });
  if (!user) {
    user = new User({
      about: fuser.aboutUser,
      name: fuser.name,
      picture: fuser.picture,
      userId: fuser.uid,
      nickname: fuser.nickName || fuser.name,
      email: fuser.email,
    });
    await user.save();
  }
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_KEY,
    {
      expiresIn: "24h",
    }
  );
  return res.status(200).json({ token, ...user });
});

router.put("/", auth, async (req, res) => {
  const user = await User.findById({ _id: req.user.id });
  if (user) {
    if (req.body.about) {
      user.about = req.body.about;
    }
    if (req.body.nickname) {
      user.nickname = req.body.nickname;
    }
  }
  await user.save();
  return res.status(200).json(user);
});

router.delete("/", auth, async (req, res) => {
  const user = await User.findById({ _id: req.user.id });
  if (user) {
    await user.delete();
    return res.send(`User id ${user.id} was deleted!`).status(200);
  } else {
    return res.status(400).send("Error");
  }
});
