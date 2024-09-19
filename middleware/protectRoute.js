import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {AsyncHandler} from "../utils/AsyncHandler.js";
const protectRoute = AsyncHandler(async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			throw new ApiError(400,"Unauthorized - No Token Provided")
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			throw new ApiError(401,"Unauthorized - Invalid Token")
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			throw new ApiError(400,"User not found")
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		throw new ApiError(500,error.message,error)
	}
})

export default protectRoute;
