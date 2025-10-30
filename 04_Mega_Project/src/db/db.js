import mongoose from "mongoose";
const connectDB = async () => {
  try {
    //console.log(`${process.env.MONGODB_URI}`);
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log("db CONNECTED");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
