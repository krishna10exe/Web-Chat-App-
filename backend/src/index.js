import dotenv from "dotenv"
import express from "express"
import authRoutes from "./routes/auth.route.js"
import connectDB from "./lib/db.js"
import {server} from './lib/socket.js'
// import path from "path"

dotenv.config({
    path: './.env'
})
const __dirname = path.resolve();

import app from './app.js'
connectDB()
.then(()=>{
    server.listen(process.env.PORT || 5000 , ()=>{
        console.log("Server is running at port :",process.env.PORT)
    })
})
.catch((error)=>{
    console.log("MONGODB connection failed!!",error)
})
