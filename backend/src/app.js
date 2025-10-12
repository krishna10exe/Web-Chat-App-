import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { app,server } from "./lib/socket.js"
import path from "path"
// const app = express();
const __dirname = path.resolve();
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
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // SPA catch-all route for Express 5
  app.get("/{path*}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}


export default app