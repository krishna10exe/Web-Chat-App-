import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app=express()

app.use(cors({ origin:"http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));   
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());
// routes
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

// routes declarations
app.use("/api/v1/users/auth",authRoutes)
app.use("/api/v1/users/messages",messageRoutes)

export default app