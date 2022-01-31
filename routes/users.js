import express from "express";
export const router = express.Router();
import User from "../models/users.js";
import {auth} from "../middleware/auth.js";

router.get("/me", auth, async (req, res) => {
  const user = await User.findById({ _id: req.user.id });
  return res.status(200).json(user);
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
