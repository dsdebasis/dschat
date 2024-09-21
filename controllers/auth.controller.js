import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const signup = AsyncHandler(async (req, res) => {
  const { fullName, username, password, confirmPassword, gender } = req.body;

  if (!fullName || !username || !password || !confirmPassword || !gender) {
    throw new ApiError(400, "Please fill in all the fields.");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and Confirm Password should match.");
  }

  const user = await User.findOne({ username });

  if (user) {
    throw new ApiError(400, "Username already exists.");
  }

  // HASH PASSWORD HERE
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;

  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

  const newUser = new User({
    fullName,
    username,
    password: hashedPassword,
    gender,
    profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
  });

  if (newUser) {
    // Generate JWT token here
    try {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      return res.status(200).json(
        new ApiResponse(200, "Successfully Account Created", {
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          profilePic: newUser?.profilePic,
        })
      );
    } catch (error) {
      throw new ApiError(500, error.message, error);
    }
  }
});

export const login = AsyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ApiError(400, "username and password is required");
    }
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user ) {
      throw new ApiError(400, "Invalid User name ");
    }
    
    if(!isPasswordCorrect) throw new ApiError(400, "Invalid password");
    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json(
      new ApiResponse(200, "Successfully Login", {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic,
      })
    );
  } catch (error) {
   throw new ApiError(500,error.message,error)
  }
});

export const logout = (req, res) => {
  try {
    res.clearCookie()
    return res.status(200).json(new ApiResponse(200,"Logged out successfully"))
  } catch (error) {
    console.log("Error in logout controller", error.message);
throw new ApiError(500,error.message,error)
  }
};
