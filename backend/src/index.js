import dotenv from "dotenv"
import express from "express"
import authRoutes from "./routes/auth.route.js"
import app from './app.js'
import connectDB from "./lib/db.js"

dotenv.config({
    path: './.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000 , ()=>{
        console.log("Server is running at port :",process.env.PORT)
    })
})
.catch((error)=>{
    console.log("MONGODB connection failed!!",error)
})
