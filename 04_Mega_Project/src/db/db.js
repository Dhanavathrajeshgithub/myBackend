import mongoose from "mongoose";
const connectDB = async () => {
  try {
    //console.log(`${process.env.MONGODB_URI}`);
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    throw error;
  }
};

export default connectDB;
