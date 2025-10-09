import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import { User } from "../models/user.model.js"

const protectRoute = asyncHandler(async(req,res,next) => {
    const token =req.cookies?.jwt

    if(!token) throw new ApiError(401,"Unauthorized  - Token not found!");

    const decoded=jwt.verify(token,process.env.JWT_SECRET);

    if(!decoded) throw new ApiError(401,"Unauthorized - Invalid Token");

    const userId= decoded.userId;
    const user=await User.findById(userId).select("-password")
    if(!user) throw new ApiError(404,"User not Found");

    req.user = user
    next();
})

export default protectRoute