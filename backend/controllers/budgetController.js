import budgetModel from "../models/budgetModel.js";
import transactionModel from "../models/transactionModel.js";
import notificationModel from "../models/notificationModel.js";
import mongoose from "mongoose";

// Create or update a budget
export const createOrUpdateBudgetController = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || !amount || !month || !year) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }

    let budget = await budgetModel.findOne({ userId: req.user._id, category, month, year });

    if (budget) {
      budget.amount = amount;
      await budget.save();
      return res.status(200).send({ success: true, message: "Budget updated successfully", budget });
    } else {
      budget = new budgetModel({ userId: req.user._id, category, amount, month, year });
      await budget.save();
      return res.status(201).send({ success: true, message: "Budget set successfully", budget });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in setting budget", error });
  }
};

// Get all budgets for a specific month and year
export const getBudgetsController = async (req, res) => {
  try {
    const { month, year } = req.query;
    const budgets = await budgetModel.find({ userId: req.user._id, month, year });
    res.status(200).send({ success: true, budgets });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in fetching budgets", error });
  }
};


export const checkBudgetStatusController = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).send({ success: false, message: "Month and Year are required" });
    }

    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 0); // Last day of the month

    // Convert userId to ObjectId
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Fetch budgets
    const budgets = await budgetModel.find({ userId: userId, month, year });
    console.log("User Budgets:", budgets);

    if (!budgets.length) {
      return res.status(404).send({ success: false, message: "No budgets found for this period" });
    }

    let warnings = [];
    let recommendations = [];

    for (const budget of budgets) {
      const spent = await transactionModel.aggregate([
        {
          $match: {
            userId: userId,
            type: "expense",
            category: budget.category,
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: { _id: null, totalSpent: { $sum: "$amount" } },
        },
      ]);

      let totalSpent = spent.length ? spent[0].totalSpent : 0;
      console.log(`Budget for ${budget.category}: ${budget.amount}, Spent: ${totalSpent}`);

      if (totalSpent >= budget.amount * 0.8 && totalSpent < budget.amount) {
        warnings.push(`⚠️ You are nearing your budget limit for ${budget.category}.`);
      }

      if (totalSpent > budget.amount) {
        warnings.push(`🚨 You have exceeded your budget for ${budget.category}!`);
        recommendations.push({
          category: budget.category,
          suggestion: `❗ You spent ${totalSpent}, exceeding your budget of ${budget.amount}. Consider adjusting your budget or reducing expenses.`,
        });
      }

      if (totalSpent > budget.amount * 1.2) {
        recommendations.push({
          category: budget.category,
          suggestion: `💡 Your spending in ${budget.category} is consistently over budget. You might consider increasing your budget.`,
        });
      }

      if (totalSpent < budget.amount * 0.5) {
        recommendations.push({
          category: budget.category,
          suggestion: `🤑 You are spending significantly less than expected on ${budget.category}. Consider lowering your budget.`,
        });
      }
    }

    res.json({ success: true, warnings, recommendations });
  } catch (error) {
    console.log("Error checking budget status:", error);
    res.status(500).send({ success: false, message: "Error checking budget status", error });
  }
};
