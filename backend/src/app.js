import express from "express"
const app=express()

app.use(express.json())

// routes
import authRoutes from "./routes/auth.route.js"

// routes declarations
app.use("/api/v1/users/auth",authRoutes)

export default app