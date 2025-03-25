import express from "express";
import { getIncomeExpenseReport, getCategoryWiseReport, getFilteredTransactions } from "../controllers/reportController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Income vs. Expenses Report
router.get("/income-expense", requireSignIn, getIncomeExpenseReport);

// Category-Wise Spending Trends
router.get("/category-report", requireSignIn, getCategoryWiseReport);

// Filter Transactions
router.get("/filtered-transactions", requireSignIn, getFilteredTransactions);

export default router;
