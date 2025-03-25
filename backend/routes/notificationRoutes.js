import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", requireSignIn, getNotifications);
router.put("/mark-as-read", requireSignIn, markAsRead);

export default router;
