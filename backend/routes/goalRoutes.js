import express from "express";
import { createGoalController, getGoalsController, updateGoalProgressController, autoAllocateSavingsController, deleteGoalController } from "../controllers/goalController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new goal
router.post("/create-goal", requireSignIn, createGoalController);

// Get all goals
router.get("/all-goals", requireSignIn, getGoalsController);

// Update goal progress manually
router.put("/update-progress/:id", requireSignIn, updateGoalProgressController);

// Auto-allocate savings from income
router.post("/auto-allocate", requireSignIn, autoAllocateSavingsController);

// Delete a goal
router.delete("/delete-goal/:id", requireSignIn, deleteGoalController);

export default router;
