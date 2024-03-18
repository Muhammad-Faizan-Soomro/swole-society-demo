import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { options } from "../constants.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "error occured while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new ApiError(400, "all fields are required");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, "user already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Cannot Register User Due To Internal Server Error"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "user created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    throw new ApiError(400, "user does not exist");
  }

  const validatePassword = await existedUser.isPasswordCorrect(password);

  if (!validatePassword) {
    throw new ApiError(400, "incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existedUser._id
  );

  const user = await User.findById(existedUser._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: user, accessToken, refreshToken },
        "user logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logout Successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password -refreshToken");

  if (!users) {
    throw new ApiError(
      500,
      "can not retrieve users due to some internal server error"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "all users retrived"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "user retrieved successfully"));
});

const updateCurrentUser = asyncHandler(async (req, res) => {
  const { newPassword, oldPassword, firstName, lastName, email } = req.body;

  const initialUser = await User.findById(req.user._id);

  const validatePassword = await initialUser.isPasswordCorrect(oldPassword);

  if (!validatePassword) {
    throw new ApiError(400, "wrong old password");
  }

  initialUser.password = newPassword || initialUser.password;
  initialUser.firstName = firstName || initialUser.firstName;
  initialUser.lastName = lastName || initialUser.lastName;
  initialUser.email = email || initialUser.email;
  await initialUser.save({ validateBeforeSave: false });

  const user = await User.findById(initialUser._id).select(
    "-refreshToken -password"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "profile updated successfully"));
});

const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new ApiError(401, "user not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user fetched successfully"));
});

const deleteSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  if (user.isAdmin) {
    throw new ApiError(400, "can not delete admins");
  }

  await User.deleteOne({ _id: user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "user deleted successfully"));
});

const updateSingleUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, isAdmin } = req.body;

  const user = await User.findById(req.params.id).select(
    "-password -refreshToken"
  );

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.isAdmin = isAdmin || user.isAdmin;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
  getSingleUser,
  deleteSingleUser,
  updateSingleUser,
};
