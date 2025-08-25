import mongoose from "mongoose";

const connectDb = async (DATABASE_URL: string) => {
  try {
    await mongoose.connect(DATABASE_URL, {
      maxPoolSize: 20,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("connection successfully");
  } catch (err) {
    console.log("can't connect db", err);
  }
};
export default connectDb;
