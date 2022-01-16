const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const auth = require('../middleware/auth');
const admin = require("firebase-admin");

router.get("/me", auth, async (req, res) => {
    const userSearch = await User.findOne({ userId: req.user.id });
    return res.json(userSearch);
});

router.post("/", async (req, res) => {
    let idToken = req.body.token;
    let fuser = await admin.auth().verifyIdToken(idToken);
    let user = await User.findOne({ email: fuser.email });
    if (!user) {
        user = new User({
        aboutUser: fuser.aboutUser || "",
        userName: fuser.name || "Noname",
        srcImg: fuser.picture || "No photo",
        userId: fuser.uid,
        nickName: fuser.nickName || fuser.name || "No nickname",
        email: fuser.email
        });
        await user.save();
    }
  const token = jwt.sign({id: fuser.uid, email: fuser.email}, process.env.TOKEN_KEY, {
    expiresIn: "24h",
  });
  return res.json({token, ...user});
});

router.put("/", auth, async (req, res) => {
  const user = await User.findOne({userId: req.user.id});
  if (user) {
      if (req.body.aboutUser){
        user.aboutUser = req.body.aboutUser;
      }
      if(req.body.nickName){
        user.nickName = req.body.nickName;
      }
    
  }
  console.log(user);
  await user.save();
  return res.json(user);
});

router.delete("/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.delete();
    return res.send(`User id ${user.id} was deleted!`).status(200);
  } else return res.send("Error").status(400);
});
module.exports = router;
