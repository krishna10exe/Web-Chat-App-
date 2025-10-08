import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app=express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
// routes
import authRoutes from "./routes/auth.route.js"

// routes declarations
app.use("/api/v1/users/auth",authRoutes)

export default app