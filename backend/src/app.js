import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { app,server } from "./lib/socket.js"
import path from "path"
// const app = express();
app.use(cors({ origin:"http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));   
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

const __dirname = path.resolve();

// routes
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

// routes declarations
app.use("/api/v1/users/auth",authRoutes)
app.use("/api/v1/users/messages",messageRoutes)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

export default app