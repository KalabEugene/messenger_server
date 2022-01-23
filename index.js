const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./services/db");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = process.env.PORT || 3000;
// const connectDb = require('./config/db');

require("dotenv").config();

app.use(fileUpload());

const indexRouter = require("./routes/main");
const postRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const gridFsRouter = require("./routes/gridfs");

require("./services/firebase").init();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use("/", indexRouter);
app.use("/posts", postRouter);
app.use("/users", usersRouter);
app.use("/gridfs", gridFsRouter);

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
