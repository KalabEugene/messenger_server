const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const auth = require("../middleware/auth");
const admin = require("firebase-admin");

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
      about: fuser.aboutUser || "",
      name: fuser.name || "Noname",
      profilepicture: fuser.picture || "No photo",
      userId: fuser.uid,
      nickname: fuser.nickName || fuser.name || "No nickname",
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
module.exports = router;
