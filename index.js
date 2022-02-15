import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDb from "./services/db.js";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import firebase from "./services/firebase.js";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(fileUpload());

import { router as authRouter } from "./routes/auth.js";
import { router as postRouter } from "./routes/posts.js";
import { router as usersRouter } from "./routes/users.js";
import { router as gridFsRouter } from "./routes/gridfs.js";
import { router as wayForPayRouter } from "./routes/way_for_pay.js";
import { resolveInclude } from "ejs";

firebase.init();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

  const corsOptions = {
  origin: 'https://pekker.me',
  optionsSuccessStatus: 200 }

app.use(cors(corsOptions));
/* app.options('*', cors())*/

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/users", usersRouter);
app.use("/gridfs", gridFsRouter);
app.use("/wayforpay", wayForPayRouter);

app.get("/test", (req, res) => res.status(200).send("Hello"));

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is working on ${PORT} port!`);
    });
  })
  .catch((err) => {
    console.log("Error", JSON.stringify(err));
  });
