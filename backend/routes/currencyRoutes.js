import express from "express";
import { updateCurrencyController } from "../controllers/currencyController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Update preferred currency
router.put("/update", requireSignIn, updateCurrencyController);

export default router;