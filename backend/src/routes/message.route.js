import express from "express"
import { Router } from "express"
import protectRoute from "../middleware/auth.middleware.js"
import { getUsersForSidebars,getMessage,sendMessage } from "../controllers/message.controller.js";

const router = Router();
router.route("/get-users").get(protectRoute,getUsersForSidebars);
router.route("/:id").get(protectRoute,getMessage);
router.route("/send/:id").post(protectRoute,sendMessage);

export default router
