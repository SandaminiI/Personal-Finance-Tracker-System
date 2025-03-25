import goalModel from "../models/goalModel.js";
import transactionModel from "../models/transactionModel.js";

// Create a new goal
export const createGoalController = async (req, res) => {
  try {
    const { title, targetAmount, deadline, autoSavePercentage } = req.body;

    if (!title || !targetAmount || !deadline) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }

    const goal = new goalModel({
      userId: req.user._id,
      title,
      targetAmount,
      deadline,
      autoSavePercentage,
    });

    await goal.save();
    res.status(201).send({ success: true, message: "Goal created successfully", goal });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error creating goal", error });
  }
};

// Get all goals
export const getGoalsController = async (req, res) => {
  try {
    const goals = await goalModel.find({ userId: req.user._id });
    res.status(200).send({ success: true, goals });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error fetching goals", error });
  }
};

// Update goal progress (manual saving)
export const updateGoalProgressController = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const goal = await goalModel.findById(id);
    if (!goal) return res.status(404).send({ success: false, message: "Goal not found" });

    goal.savedAmount += amount;
    await goal.save();

    res.status(200).send({ success: true, message: "Goal progress updated", goal });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error updating goal progress", error });
  }
};

// Auto-allocate savings from income
export const autoAllocateSavingsController = async (req, res) => {
  try {
    const { incomeAmount } = req.body; // Amount from income transaction

    if (!incomeAmount) {
      return res.status(400).send({ success: false, message: "Income amount is required" });
    }

    const goals = await goalModel.find({ userId: req.user._id, autoSavePercentage: { $gt: 0 } });

    let totalAllocated = 0;
    for (const goal of goals) {
      let allocation = (incomeAmount * goal.autoSavePercentage) / 100;
      goal.savedAmount += allocation;
      totalAllocated += allocation;
      await goal.save();
    }

    res.status(200).send({ success: true, message: "Savings allocated automatically", totalAllocated });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error allocating savings", error });
  }
};

// Delete a goal
export const deleteGoalController = async (req, res) => {
  try {
    const { id } = req.params;
    await goalModel.findByIdAndDelete(id);
    res.status(200).send({ success: true, message: "Goal deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error deleting goal", error });
  }
};
