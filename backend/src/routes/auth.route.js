import express from "express"
import { registerUser } from "../controllers/auth.controller.js";

const router=express.Router();

router.route('/register').post(registerUser)
// router.route('/login').post(loginUser)
// router.route('/logout').post(logoutUser)

export default router