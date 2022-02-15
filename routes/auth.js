import express from "express";
export const router = express.Router();
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import admin from "firebase-admin";
import sendGrid from "../services/sendgrid.js";

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
  sendGrid(fuser.email);
  return res.status(200).json({ token, ...user });
});
