import transactionModel from "../models/transactionModel.js";
import mongoose from "mongoose";

export const getIncomeExpenseReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).send({ success: false, message: "Month and Year are required" });
    }

    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 0); // Last day of the month

    // Convert userId to ObjectId
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Debug: Log transactions before aggregation
    const rawTransactions = await transactionModel.find({
      userId: userId,
      date: { $gte: startDate, $lte: endDate },
    });
    console.log("Filtered Transactions Before Aggregation:", rawTransactions);

    // Aggregate income and expenses separately
    const transactions = await transactionModel.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" }, // Sum the total amount for income and expenses
        },
      },
    ]);

    console.log("Aggregated Transactions:", transactions);

    let report = { income: 0, expenses: 0 };
    transactions.forEach((item) => {
      if (item._id === "income") {
        report.income = item.totalAmount;
      } else if (item._id === "expense") {
        report.expenses = item.totalAmount;
      }
    });

    res.status(200).send({ success: true, report });
  } catch (error) {
    console.log("Error fetching income-expense report:", error);
    res.status(500).send({ success: false, message: "Error fetching income-expense report", error });
  }
};


export const getCategoryWiseReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).send({ success: false, message: "Month and Year are required" });
    }

    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 0); // Last day of the month

    // Convert userId to ObjectId to ensure proper matching
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Log transactions before aggregation
    const rawTransactions = await transactionModel.find({
      userId: userId, // Ensure correct matching
      type: "expense",
      date: { $gte: startDate, $lte: endDate },
    });

    console.log("Filtered Transactions Before Aggregation:", rawTransactions);

    // Perform aggregation correctly
    const transactions = await transactionModel.aggregate([
      {
        $match: {
          userId: userId, // Ensure userId is correctly matched
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category", // Group by category
          totalAmount: { $sum: "$amount" }, // Sum the total amount
        },
      },
    ]);

    console.log("Aggregated Transactions:", transactions);

    if (!transactions.length) {
      return res.status(404).send({ success: false, message: "No expense transactions found for this period" });
    }

    res.status(200).send({ success: true, categories: transactions });
  } catch (error) {
    console.log("Error fetching category report:", error);
    res.status(500).send({ success: false, message: "Error fetching category report", error });
  }
};


// Get Transactions with Filters (Category, Tags, Date Range)
export const getFilteredTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category, tags } = req.query;
    let query = { userId: req.user._id };

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (category) {
      query.category = category;
    }
    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    const transactions = await transactionModel.find(query);
    res.status(200).send({ success: true, transactions });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error fetching transactions", error });
  }
};
