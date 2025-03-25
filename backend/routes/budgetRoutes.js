import express from "express";
import { createOrUpdateBudgetController, getBudgetsController, checkBudgetStatusController } from "../controllers/budgetController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create or update a budget
router.post("/setBudget", requireSignIn, createOrUpdateBudgetController);

// Get all budgets for a month
router.get("/allBudget", requireSignIn, getBudgetsController);

// Check if spending exceeds budget
router.get("/status", requireSignIn, checkBudgetStatusController);

export default router;
