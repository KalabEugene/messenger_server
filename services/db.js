import mongoose from "mongoose";

 function connectDb () {
  return mongoose.connect(process.env.DB_LINK, { useNewUrlParser: true });
};

export default connectDb;