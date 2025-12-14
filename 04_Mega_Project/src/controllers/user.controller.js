import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { username, email, fullName, password } = req.body;
  console.log(req.body);
  // validation -> not empty
  if ([username, email, fullName, password].some((ele) => ele?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  // check if user already exists: username or email
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existedUser)
    throw new ApiError(409, "User already exists with this email or username");
  // check for images, avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath || avatarLocalPath.trim() === "") {
    throw new ApiError(400, "Avatar image is required");
  }

  // upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = null;
  if (coverImageLocalPath && coverImageLocalPath.trim() !== "")
    coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }
  // create user object -> create entry in db
  const user = User.create({
    username: username.to_LowerCase(),
    email,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });
  const createdUser = await user.save().select("-password -refreshToken");
  if (!createdUser) throw new ApiError(500, "Failed to create user");
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
  // remove password and refresh token from response
  // check for user creation
  // return res
});

export { registerUser };
