import mongoose from "mongoose";

const connectdb = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("mongodb connected for ai");
};

export { connectdb };