import mongoose from "mongoose";
import bcryptjs from "bcryptjs"
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    fullName:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        default: ""
    },
},{timestamps: true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password=await bcryptjs.hash(this.password,10)
})

export const User = mongoose.model("User",userSchema);