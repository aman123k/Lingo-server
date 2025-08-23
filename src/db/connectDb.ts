import mongoose from "mongoose";

const connectDb = async (DATABASE_URL: string) => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("connection successfully");
  } catch (err) {
    console.log("can't connect db", err);
  }
};
export default connectDb;
