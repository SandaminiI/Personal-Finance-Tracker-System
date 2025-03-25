import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

// Get dashboard data based on user role
router.get("/", requireSignIn, getDashboardData);

export default router;
