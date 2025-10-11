import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";

const getUsersForSidebars = asyncHandler(async(req,res) => {
    const loggedInUserId=req.user?._id;
    if(!loggedInUserId) throw new ApiError(404,"User is not logged In");
    
    const filterUsers=await User.find({_id : { $ne : loggedInUserId}}).select("-password");
    if(!filterUsers.length) throw new ApiError(404,"No Users Found");
    
    res.status(200).json(new ApiResponse(200,filterUsers,"Users fetched Successfully"));
})

const getMessage = asyncHandler(async(req,res) => {
    const {id: userToChatId}=req.params;
    if(!userToChatId) throw new ApiError(404,"User not Found from params");

    const userId=req.user?._id;
    if(!userId) throw new ApiError(404,"User not Found");

    const messages = await Message.find({
        $or : [
            {senderId: userId , receiverId: userToChatId},
            {senderId: userToChatId, receiverId: userId}
        ]
    }).sort({ createdAt: 1 });;

    res.status(200).json(new ApiResponse(200,messages,"Messages Fetched Successfully!"));
})

const sendMessage = asyncHandler(async(req,res) =>{
    const {text , image} = req.body;
    const {id: receiverId}= req.params;
    const senderId =req.user._id;
    if(!text && !image) throw new ApiError(400,"Message cannot be empty");
    let imageUrl;
    if(image){
        const cloudinaryUpload =await cloudinary.uploader.upload(image);
        imageUrl=cloudinaryUpload.secure_url;
    }

    const newMessage= new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl
    });

    await newMessage.save();

    // realtime functionality --> using socket.io

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }


    res.status(201).json(new ApiResponse(201,newMessage,"Message ready to send"))
})

export {getUsersForSidebars,getMessage,sendMessage}