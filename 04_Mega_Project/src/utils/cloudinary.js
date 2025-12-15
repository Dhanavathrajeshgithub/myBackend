import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dyiylv8p9",
  api_key: process.env.CLOUDINARY_API_KEY || "999813759664443",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "-aQi7IguFIH46UD1ACn84vzCHGE",
});

// upload image from local file system
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // Remove file from local uploads folder
    fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    // Remove file from local uploads folder
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
