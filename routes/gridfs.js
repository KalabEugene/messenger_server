import express from "express";
export const router = express.Router();
import mongoose from "mongoose";

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

