import express from "express"
import { registerUser,loginUser,logoutUser,updateProfile,checkAuth } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/auth.middleware.js";
const router=express.Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/update-profile').post(protectRoute,updateProfile)
router.route('/check').get(protectRoute,checkAuth)
export default router