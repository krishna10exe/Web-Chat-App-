import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"

const registerUser = asyncHandler(async(req,res) => {
    const {fullName, password , email}=req.body
    if([fullName,email,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"all fields are required!")
    }

    const existedUser=await User.findOne({email})
    if(existedUser) throw new ApiError(400,"user with email id already exists")
    
    if(password.length<6) throw new ApiError(400,"Password must contain atleast 6 characters")
    
    const user= await User.create({
        fullName,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password")

    if(!createdUser) throw new ApiError(500,"Something went wrong while registering user")

    return res.status(200).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
    )
})

export {registerUser}