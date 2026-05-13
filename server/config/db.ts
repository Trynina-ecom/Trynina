import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI as string);

  isConnected = true;

  console.log("MongoDB connected");
};

export default connectDB;