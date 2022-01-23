const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const streamifier = require("streamifier");

router.get("/download/:fileId", (req, res) => {
  let gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "Storage",
  });
  const stream = gridFsBucket.openDownloadStream(
    mongoose.Types.ObjectId(req.params.fileId)
  );
  stream.pipe(res);
});
router.delete("/delete/:id", (req, res) => {
  let gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "Storage",
  });
  gridFsBucket.delete(mongoose.Types.ObjectId(req.params.id));
  console.log("file was deleted");
});

module.exports = router;
