import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import { generateToken } from "../lib/gentoke.js"
import bcrypt from "bcryptjs"
import cloudinary from "../utils/cloudinary.js"

const registerUser = asyncHandler(async(req,res) => {
    const {fullName, password , email}=req.body
    console.log(req.body)
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
    if(createdUser){
        generateToken(createdUser._id,res)
    }
    if(!createdUser) throw new ApiError(500,"Something went wrong while registering user")

    return res.status(200).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
    )
})

const loginUser = asyncHandler(async(req,res) => {
    const {email,password} =req.body
    if(!email || !password) throw new ApiError(400,"Email And Password is required!");
    
    const user= await User.findOne({email})
    if(!user) throw new ApiError(400,"Invalid Credential!");
    
    const checkPassword=await bcrypt.compare(password,user.password)
    if(!checkPassword) throw new ApiError(400,"Invalid Credential!");

    const token=generateToken(user._id,res);
    return res.status(200).json( new ApiResponse(200,{user: user,token},"User logged in successfully!"))
})

const logoutUser = asyncHandler(async(req,res) =>{
    res.cookie("jwt","",{
        httpOnly: true,
        secure: process.env.NODE_ENV!=="development",
        sameSite: "strict",
        maxAge: 0});
    
    res.status(200).json({message: "Logged out successfully"})
})

const updateProfile = asyncHandler(async(req,res)=>{
    const {profilePic}=req.body
    if(!profilePic) throw new ApiError(400,"Profile Pic is required!");
    
    const userId=req.user._id
    if(!userId) throw new ApiError(400,"User not found!");

    const uploadRespone=await cloudinary.uploader.upload(profilePic);
    const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadRespone.secure_url},{new:true});
    res.status(200).json(new ApiResponse(200,updatedUser,"Profile Pic is Uploaded Successfully"));
})

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export {registerUser,loginUser,logoutUser,updateProfile,checkAuth}