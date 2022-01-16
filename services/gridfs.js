const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const streamifier = require("streamifier");

router.get("/download/:filename", (req, res) => {
  let gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "Storage",
  });
  const stream = gridFsBucket.openDownloadStreamByName(req.params.filename)
  stream.pipe(res)    
 /*  gridFsBucket.on("error", () => {
      console.log("Some error occurred in download:" + error);
      res.send(error);
    }) */
});

module.exports = router;
