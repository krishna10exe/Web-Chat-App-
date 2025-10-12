import dotenv from "dotenv"
import express from "express"
import authRoutes from "./routes/auth.route.js"
import app from './app.js'
import connectDB from "./lib/db.js"
import {server} from './lib/socket.js'
import path from "path"

dotenv.config({
    path: './.env'
})
// const app = express();
const __dirname=path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

}
connectDB()
.then(()=>{
    server.listen(process.env.PORT || 5000 , ()=>{
        console.log("Server is running at port :",process.env.PORT)
    })
})
.catch((error)=>{
    console.log("MONGODB connection failed!!",error)
})
