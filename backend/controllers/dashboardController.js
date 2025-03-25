import UserModel from "../models/userModel.js";
import TransactionModel from "../models/transactionModel.js";

// Get dashboard data based on user role
export const getDashboardData = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === 1) {
      // Admin Dashboard: Get all users, total transactions, financial summary
      const totalUsers = await UserModel.countDocuments();
      const totalTransactions = await TransactionModel.countDocuments();
      const financialSummary = await TransactionModel.aggregate([
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]);

      return res.status(200).json({
        success: true,
        totalUsers,
        totalTransactions,
        financialSummary: financialSummary.length > 0 ? financialSummary[0].totalAmount : 0,
      });
    } else {
      // Regular User Dashboard: Get user's transactions, budget, and goals
      const transactions = await TransactionModel.find({ userId: user._id }).sort({ createdAt: -1 });
      const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      const budget = user.budget || 0;
      const remainingBudget = budget - totalSpent;

      return res.status(200).json({
        success: true,
        transactions,
        budget,
        remainingBudget,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
