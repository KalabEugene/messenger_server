import mongoose from "mongoose";
import streamifier from "streamifier";

const GridFsUpload = {
  init(file) {
    let filename = file.name;
    let uploadStream = null;

    let gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "Storage",
    });
    streamifier
      .createReadStream(file.data)
      .pipe((uploadStream = gridFsBucket.openUploadStream(filename)))
      .on("error", () => {
        console.log("Some error occured:" + error);
      })
      .on("finish", () => {
        console.log("done uploading");
      });
    return uploadStream.id;
  },
};
export default GridFsUpload;
