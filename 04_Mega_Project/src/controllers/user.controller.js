import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { username, email, fullName, password } = req.body;
  // validation -> not empty
  if ([username, email, fullName, password].some((ele) => ele?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  // check if user already exists: username or email
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existedUser)
    throw new ApiError(409, "User already exists with this email or username");
  // check for images, avatar
  const avatarLocalPath = req.files?.avatar?.[0]?.path || "";
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path || "";

  if (!avatarLocalPath || avatarLocalPath.trim() === "") {
    throw new ApiError(400, "Avatar image is required");
  }

  // upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }
  // create user object -> create entry in db
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });
  if (!user) throw new ApiError(500, "Failed to create user");
  const createdUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) throw new ApiError(500, "Failed to create user");
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
  // remove password and refresh token from response
  // check for user creation
  // return res
});

const loginUser = asyncHandler(async (req, res) => {
  //console.log(req.body);
  const { username, email, password } = req.body;

  if (!(username || email) || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPass = await user.isPasswordCorrect(password);
  if (!isPass) {
    throw new ApiError(401, "Incorrect password");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Token generation failed");
  }

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  const safeUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(new ApiResponse(200, safeUser, "Login successful"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User loggedOut Successfully "));
});
export { registerUser, loginUser, logoutUser };
