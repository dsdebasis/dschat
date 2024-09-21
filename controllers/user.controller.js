import User from "../models/user.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { AsyncHandler } from "../utils/AsyncHandler.js";
export const getUsersForSidebar = AsyncHandler(async (req, res) => {
	 console.log(req.user)
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		return res.status(200).json(new ApiResponse(200,"Successfully fetched all users",filteredUsers))
	} catch (error) {
		// console.error("Error in getUsersForSidebar: ", error.message);
		throw new ApiError(500,error.message,error)
	}
})
