import express from "express";
import { createTransactionController, getTransactionsController, deleteTransactionController, updateTransactionController } from "../controllers/transactionController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Transaction
router.post("/createtransaction", requireSignIn, createTransactionController);

// Get User Transactions
router.get("/alltransaction", requireSignIn, getTransactionsController);

// Edit (Update) Transaction
router.put("/updatetransaction/:id", requireSignIn, updateTransactionController);

// Delete Transaction
router.delete("/deletetransaction/:id", requireSignIn, deleteTransactionController);

export default router;
