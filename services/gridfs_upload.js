const mongoose = require("mongoose");
const streamifier = require("streamifier");


  module.exports = {
    init(file){
      let filename = file.name;

      let gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "Storage",
      });
      streamifier
        .createReadStream(file.data)
        .pipe(uploadStream = gridFsBucket.openUploadStream(filename))
        .on("error", () => {
          console.log("Some error occured:" + error);
        })
        .on("finish", () => {
          console.log("done uploading");
        });
        return uploadStream.id
  }
  }