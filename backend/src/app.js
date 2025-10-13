import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { app, server } from "./lib/socket.js";

// Load environment variables
dotenv.config();

// Set up CORS, body parsing, cookies
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Recreate __dirname for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Routes
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

app.use("/api/v1/users/auth", authRoutes);
app.use("/api/v1/users/messages", messageRoutes);

// Serve frontend in production (Render)

// Export app (for testing or server.js usage)
export default app;
