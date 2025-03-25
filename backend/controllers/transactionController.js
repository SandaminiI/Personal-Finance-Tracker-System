import transactionModel from "../models/transactionModel.js";
import userModel from "../models/userModel.js";
import { getExchangeRate } from "../services/currencyService.js"; // Import exchange rate service
import { sendNotification } from "../services/notificationService.js";

export const createTransactionController = async (req, res) => {
  try {
    const { type, category, amount, currency, date, tags } = req.body;
    if (!type || !category || !amount || !currency) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }

    let convertedAmount = amount;
    let exchangeRate = 1;

    // Fetch the exchange rate if the currency is different from the user's default
    if (currency !== "LKR") {  // Assuming LKR is the default currency
      exchangeRate = await getExchangeRate(currency, "LKR");
      if (!exchangeRate) return res.status(500).send({ success: false, message: "Currency conversion failed" });

      convertedAmount = amount * exchangeRate;
    }

    const transaction = new transactionModel({
      userId: req.user._id,
      type,
      category,
      amount,
      currency,
      convertedAmount,
      exchangeRate,
      date,
      tags,
    });

    await transaction.save();
    console.log("✅ Transaction saved successfully");

    // Check for unusual spending (e.g., 50% more than average)
    const recentTransactions = await transactionModel.find({ userId: req.user._id, category });
    const avgSpending = recentTransactions.reduce((acc, t) => acc + t.amount, 0) / (recentTransactions.length || 1);

    console.log(`📊 Avg Spending for ${category}: ${avgSpending}, New Transaction: ${amount}`);

    if (amount > avgSpending * 1.5) {
      console.log("🚨 High spending detected! Sending notification...");
      sendNotification(req.user._id, "spending_alert", `High spending detected: You spent ${amount} in ${category}`);
    }

    res.status(201).send({
      success: true,
      message: "Transaction added successfully",
      transaction: {
        _id: transaction._id,
        userId: transaction.userId,
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        currency: transaction.currency,
        convertedAmount: transaction.convertedAmount,
        exchangeRate: transaction.exchangeRate,
        date: transaction.date,
        tags: transaction.tags,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in creating transaction", error });
  }
};


// Get all transactions for a user
export const getTransactionsController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    const transactions = await transactionModel.find({ userId: req.user._id }).sort({ date: -1 });

    res.status(200).send({ success: true, transactions, preferredCurrency: user.currency });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in fetching transactions", error });
  }
};



// Edit (Update) a transaction
export const updateTransactionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, category, amount, currency, date, tags } = req.body;

    const transaction = await transactionModel.findById(id);
    if (!transaction) {
      return res.status(404).send({ success: false, message: "Transaction not found" });
    }

    let convertedAmount = amount;
    let exchangeRate = transaction.exchangeRate;

    // If currency has changed, recalculate conversion
    if (currency !== transaction.currency) {
      exchangeRate = await getExchangeRate(currency, transaction.currency);
      if (!exchangeRate) return res.status(500).send({ success: false, message: "Currency conversion failed" });

      convertedAmount = amount * exchangeRate;
    }

    const updatedTransaction = await transactionModel.findByIdAndUpdate(
      id,
      { type, category, amount, currency, convertedAmount, exchangeRate, date, tags },
      { new: true }
    );

    res.status(200).send({ success: true, message: "Transaction updated successfully", updatedTransaction });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in updating transaction", error });
  }
};


// Delete a transaction
export const deleteTransactionController = async (req, res) => {
  try {
    const { id } = req.params;
    await transactionModel.findByIdAndDelete(id);
    res.status(200).send({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in deleting transaction", error });
  }
};